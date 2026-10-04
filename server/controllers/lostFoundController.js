const LostFound = require('../models/LostFound');
const { deleteFile } = require('../middleware/upload');

// Helper: Find potential matches for a lost/found item
const findPotentialMatches = async (item) => {
  try {
    const oppositeType = item.type === 'Lost' ? 'Found' : 'Lost';
    const query = {
      type: oppositeType,
      status: 'Active',
      _id: { $ne: item._id }
    };

    // Match by category
    if (item.category) query.category = item.category;

    // Look for items within 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    query.createdAt = { $gte: thirtyDaysAgo };

    const matches = await LostFound.find(query)
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Score matches by keyword similarity
    const keywords = [
      ...(item.itemName || '').toLowerCase().split(/\s+/),
      ...(item.description || '').toLowerCase().split(/\s+/)
    ].filter(w => w.length > 2);

    const scoredMatches = matches.map(match => {
      const matchWords = [
        ...(match.itemName || '').toLowerCase().split(/\s+/),
        ...(match.description || '').toLowerCase().split(/\s+/)
      ].filter(w => w.length > 2);

      let score = 0;
      // Category match = 3 points
      if (match.category === item.category) score += 3;
      // Location match = 2 points
      if (match.location && item.location &&
          match.location.toLowerCase().includes(item.location.toLowerCase().split(/\s+/)[0])) {
        score += 2;
      }
      // Keyword overlap
      keywords.forEach(kw => {
        if (matchWords.some(mw => mw.includes(kw) || kw.includes(mw))) score += 1;
      });

      return { ...match.toObject(), matchScore: score };
    });

    return scoredMatches.filter(m => m.matchScore >= 3).sort((a, b) => b.matchScore - a.matchScore);
  } catch (error) {
    console.error('Match finding error:', error);
    return [];
  }
};

// @desc    Get all lost & found items
// @route   GET /api/lost-found
// @access  Private
exports.getLostFoundItems = async (req, res) => {
  try {
    const { search, type, category, location, status, sort = 'newest', page = 1, limit = 12 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { itemName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    if (type) query.type = type;
    if (category) query.category = category;
    if (status) query.status = status;
    if (location && !search) query.location = { $regex: location, $options: 'i' };

    // Sort
    let sortOrder = { createdAt: -1 };
    if (sort === 'oldest') sortOrder = { createdAt: 1 };
    if (sort === 'date_newest') sortOrder = { date: -1 };
    if (sort === 'date_oldest') sortOrder = { date: 1 };

    const total = await LostFound.countDocuments(query);
    const items = await LostFound.find(query)
      .populate('createdBy', 'fullName email role')
      .sort(sortOrder)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      items,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get lost & found error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch lost & found items.' });
  }
};

// @desc    Get single lost & found item
// @route   GET /api/lost-found/:id
// @access  Private
exports.getLostFoundItem = async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id)
      .populate('createdBy', 'fullName email role');

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }

    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch item.' });
  }
};

// @desc    Create lost & found item
// @route   POST /api/lost-found
// @access  Private (both admin and student)
exports.createLostFoundItem = async (req, res) => {
  try {
    const { itemName, description, category, type, location, date, contact } = req.body;

    if (!itemName || !description || !category || !type || !location || !date || !contact) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    const itemData = {
      itemName, description, category, type, location, date, contact,
      status: 'Active',
      createdBy: req.user._id
    };

    if (req.file) {
      itemData.image = {
        fileName: req.file.originalname,
        fileUrl: `uploads/lostfound/${req.file.filename}`,
        fileType: req.file.mimetype,
        fileSize: req.file.size
      };
    }

    const item = await LostFound.create(itemData);
    await item.populate('createdBy', 'fullName email role');

    // Find potential matches
    const matches = await findPotentialMatches(item);

    res.status(201).json({
      success: true,
      message: 'Post created successfully.',
      item,
      possibleMatches: matches
    });
  } catch (error) {
    console.error('Create lost & found error:', error);
    res.status(500).json({ success: false, message: 'Failed to create post.' });
  }
};

// @desc    Update lost & found item
// @route   PUT /api/lost-found/:id
// @access  Private (owner or admin)
exports.updateLostFoundItem = async (req, res) => {
  try {
    let item = await LostFound.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }

    // Check ownership (admin can edit any, students only their own)
    if (req.user.role !== 'admin' && item.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only edit your own posts.' });
    }

    const updateData = { ...req.body };

    if (req.file) {
      if (item.image && item.image.fileUrl) {
        deleteFile(item.image.fileUrl);
      }
      updateData.image = {
        fileName: req.file.originalname,
        fileUrl: `uploads/lostfound/${req.file.filename}`,
        fileType: req.file.mimetype,
        fileSize: req.file.size
      };
    }

    item = await LostFound.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).populate('createdBy', 'fullName email role');

    res.json({
      success: true,
      message: 'Post updated successfully.',
      item
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update post.' });
  }
};

// @desc    Mark item as resolved
// @route   PUT /api/lost-found/:id/resolve
// @access  Private (owner or admin)
exports.resolveItem = async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }

    // Check ownership
    if (req.user.role !== 'admin' && item.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only modify your own posts.' });
    }

    item.status = item.status === 'Resolved' ? 'Active' : 'Resolved';
    item.resolvedAt = item.status === 'Resolved' ? new Date() : null;
    await item.save();
    await item.populate('createdBy', 'fullName email role');

    res.json({
      success: true,
      message: item.status === 'Resolved' ? 'Item marked as resolved.' : 'Item marked as active.',
      item
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update item status.' });
  }
};

// @desc    Get potential matches for an item
// @route   GET /api/lost-found/:id/matches
// @access  Private
exports.getMatches = async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }

    const matches = await findPotentialMatches(item);

    res.json({
      success: true,
      matches
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to find matches.' });
  }
};

// @desc    Delete lost & found item
// @route   DELETE /api/lost-found/:id
// @access  Private (owner or admin)
exports.deleteLostFoundItem = async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }

    // Check ownership
    if (req.user.role !== 'admin' && item.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only delete your own posts.' });
    }

    if (item.image && item.image.fileUrl) {
      deleteFile(item.image.fileUrl);
    }

    await LostFound.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Post deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete post.' });
  }
};
