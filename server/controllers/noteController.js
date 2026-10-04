const Note = require('../models/Note');
const path = require('path');
const fs = require('fs');
const { deleteFile } = require('../middleware/upload');

// @desc    Get all notes
// @route   GET /api/notes
// @access  Private
exports.getNotes = async (req, res) => {
  try {
    const { search, department, semester, year, page = 1, limit = 12 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (department) query.department = department;
    if (semester) query.semester = semester;
    if (year) query.year = year;

    const total = await Note.countDocuments(query);
    const notes = await Note.find(query)
      .populate('uploadedBy', 'fullName email role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      notes,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notes.' });
  }
};

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Private
exports.getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('uploadedBy', 'fullName email role');

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found.' });
    }

    res.json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch note.' });
  }
};

// @desc    Create note
// @route   POST /api/notes
// @access  Admin
exports.createNote = async (req, res) => {
  try {
    const { title, subject, description, department, semester, year } = req.body;

    if (!title || !subject || !department || !semester || !year) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file.' });
    }

    const note = await Note.create({
      title,
      subject,
      description,
      department,
      semester,
      year,
      fileName: req.file.originalname,
      fileUrl: `uploads/notes/${req.file.filename}`,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: req.user._id
    });

    await note.populate('uploadedBy', 'fullName email role');

    res.status(201).json({
      success: true,
      message: 'Note uploaded successfully.',
      note
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload note.' });
  }
};

// @desc    Bulk upload multiple PDF notes
// @route   POST /api/notes/bulk-upload
// @access  Admin
exports.bulkUploadNotes = async (req, res) => {
  try {
    const { title, subject, description, department, semester, year } = req.body;

    if (!title || !subject || !department || !semester || !year) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload at least one PDF file.' });
    }

    const results = { created: 0, failed: 0, notes: [], errors: [] };

    for (const file of req.files) {
      try {
        // Validate each file is PDF
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.pdf' && file.mimetype !== 'application/pdf') {
          results.failed++;
          results.errors.push({ fileName: file.originalname, message: 'Only PDF files are allowed for bulk upload.' });
          // Delete the non-PDF file
          const filePath = path.join(__dirname, '..', 'uploads', 'notes', file.filename);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          continue;
        }

        const note = await Note.create({
          title: `${title} - ${path.basename(file.originalname, ext)}`,
          subject,
          description,
          department,
          semester,
          year,
          fileName: file.originalname,
          fileUrl: `uploads/notes/${file.filename}`,
          fileType: file.mimetype,
          fileSize: file.size,
          uploadedBy: req.user._id
        });

        await note.populate('uploadedBy', 'fullName email role');
        results.created++;
        results.notes.push(note);
      } catch (err) {
        results.failed++;
        results.errors.push({ fileName: file.originalname, message: err.message });
      }
    }

    res.status(201).json({
      success: true,
      message: `Successfully uploaded ${results.created} note(s).${results.failed > 0 ? ` ${results.failed} failed.` : ''}`,
      results
    });
  } catch (error) {
    console.error('Bulk upload notes error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload notes.' });
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Admin
exports.updateNote = async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found.' });
    }

    const updateData = { ...req.body };

    if (req.file) {
      // Delete old file
      deleteFile(note.fileUrl);
      updateData.fileName = req.file.originalname;
      updateData.fileUrl = `uploads/notes/${req.file.filename}`;
      updateData.fileType = req.file.mimetype;
      updateData.fileSize = req.file.size;
    }

    note = await Note.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).populate('uploadedBy', 'fullName email role');

    res.json({
      success: true,
      message: 'Note updated successfully.',
      note
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update note.' });
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Admin
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found.' });
    }

    deleteFile(note.fileUrl);
    await Note.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Note deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete note.' });
  }
};

// @desc    Download note file
// @route   GET /api/notes/:id/download
// @access  Private (both admin and student)
exports.downloadNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found.' });
    }

    const filePath = path.join(__dirname, '..', note.fileUrl);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found on server.' });
    }

    res.download(filePath, note.fileName);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to download file.' });
  }
};
