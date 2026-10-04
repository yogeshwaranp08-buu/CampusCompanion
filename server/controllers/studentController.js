const User = require('../models/User');
const ExcelJS = require('exceljs');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// @desc    Get students with filters (admin only)
// @route   GET /api/students
// @access  Admin
exports.getStudents = async (req, res) => {
  try {
    const { search, department, year, page = 1, limit = 20 } = req.query;
    const query = { role: 'student' };

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { collegeId: { $regex: search, $options: 'i' } }
      ];
    }
    if (department) query.department = department;
    if (year) query.year = year;

    const total = await User.countDocuments(query);
    const students = await User.find(query)
      .select('-passwordHash -__v')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      students,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch students.' });
  }
};

// @desc    Get student statistics (admin only)
// @route   GET /api/students/stats
// @access  Admin
exports.getStudentStats = async (req, res) => {
  try {
    const [totalStudents, deptCounts, yearCounts] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.aggregate([
        { $match: { role: 'student' } },
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      User.aggregate([
        { $match: { role: 'student' } },
        { $group: { _id: '$year', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ])
    ]);

    const departmentStats = {};
    deptCounts.forEach(d => { departmentStats[d._id || 'Unspecified'] = d.count; });

    const yearStats = {};
    yearCounts.forEach(y => { yearStats[y._id || 'Unspecified'] = y.count; });

    res.json({
      success: true,
      stats: {
        totalStudents,
        departments: departmentStats,
        years: yearStats
      }
    });
  } catch (error) {
    console.error('Student stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch student statistics.' });
  }
};

// @desc    Export students to Excel
// @route   GET /api/students/export
// @access  Admin
exports.exportStudents = async (req, res) => {
  try {
    const { department, year } = req.query;
    const query = { role: 'student' };

    if (department) query.department = department;
    if (year) query.year = year;

    const students = await User.find(query)
      .select('collegeId fullName email department year phone createdAt')
      .sort({ collegeId: 1 });

    // Generate dynamic filename
    let filename = 'students';
    if (department) {
      // Create abbreviation from department name
      const deptAbbr = department
        .replace(/ and /g, ' & ')
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase();
      filename += `_${deptAbbr}`;
    }
    if (year) {
      const yearNum = year.replace(/[^0-9]/g, '');
      filename += `_year${yearNum}`;
    }
    if (!department && !year) {
      filename += '_all';
    }
    filename += '.xlsx';

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Campus Companion';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Students');

    // Define columns
    worksheet.columns = [
      { header: 'College ID', key: 'collegeId', width: 15 },
      { header: 'Name', key: 'fullName', width: 30 },
      { header: 'Email', key: 'email', width: 35 },
      { header: 'Department', key: 'department', width: 40 },
      { header: 'Year', key: 'year', width: 12 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Registration Date', key: 'createdAt', width: 20 }
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true, size: 12 };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E3A5F' }
    };
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };

    // Add data rows
    students.forEach(student => {
      worksheet.addRow({
        collegeId: student.collegeId,
        fullName: student.fullName,
        email: student.email,
        department: student.department || '',
        year: student.year || '',
        phone: student.phone || '',
        createdAt: student.createdAt
          ? new Date(student.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
          : ''
      });
    });

    // Auto filter
    worksheet.autoFilter = {
      from: 'A1',
      to: `G${students.length + 1}`
    };

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Export students error:', error);
    res.status(500).json({ success: false, message: 'Failed to export students.' });
  }
};

// @desc    Validate bulk import data (preview)
// @route   POST /api/students/bulk-import/validate
// @access  Admin
exports.validateBulkImport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an Excel or CSV file.' });
    }

    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    let rows = [];

    if (ext === '.xlsx' || ext === '.xls') {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.worksheets[0];

      if (!worksheet || worksheet.rowCount < 2) {
        fs.unlinkSync(filePath);
        return res.status(400).json({ success: false, message: 'The uploaded file is empty or has no data rows.' });
      }

      // Get headers from first row
      const headerRow = worksheet.getRow(1);
      const headers = [];
      headerRow.eachCell((cell, colNumber) => {
        headers[colNumber] = String(cell.value || '').trim().toLowerCase();
      });

      // Parse data rows
      for (let i = 2; i <= worksheet.rowCount; i++) {
        const row = worksheet.getRow(i);
        const rowData = {};
        let hasData = false;

        row.eachCell((cell, colNumber) => {
          const header = headers[colNumber];
          if (header) {
            let value = cell.value;
            if (value && typeof value === 'object' && value.text) value = value.text;
            if (value && typeof value === 'object' && value.hyperlink) value = value.text || value.hyperlink;
            rowData[header] = String(value || '').trim();
            if (rowData[header]) hasData = true;
          }
        });

        if (hasData) rows.push(rowData);
      }
    } else if (ext === '.csv') {
      const csvContent = fs.readFileSync(filePath, 'utf-8');
      const lines = csvContent.split('\n').filter(l => l.trim());
      if (lines.length < 2) {
        fs.unlinkSync(filePath);
        return res.status(400).json({ success: false, message: 'The uploaded CSV is empty or has no data rows.' });
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const rowData = {};
        let hasData = false;
        headers.forEach((h, idx) => {
          rowData[h] = values[idx] || '';
          if (rowData[h]) hasData = true;
        });
        if (hasData) rows.push(rowData);
      }
    } else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ success: false, message: 'Unsupported file format. Please upload .xlsx or .csv files.' });
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: 'No data rows found in the file.' });
    }

    // Map common header variations
    const mapHeader = (row) => {
      return {
        collegeId: row['college id'] || row['collegeid'] || row['id'] || row['college_id'] || '',
        fullName: row['name'] || row['full name'] || row['fullname'] || row['full_name'] || row['student name'] || '',
        email: row['email'] || row['email address'] || row['e-mail'] || '',
        department: row['department'] || row['dept'] || row['branch'] || '',
        year: row['year'] || row['academic year'] || '',
        phone: row['phone'] || row['phone number'] || row['mobile'] || row['contact'] || ''
      };
    };

    // Validate each row
    const validDepartments = [
      'Computer Science and Engineering', 'Information Technology',
      'Electronics and Communication Engineering', 'Electrical and Electronics Engineering',
      'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering',
      'Production Engineering', 'Other'
    ];
    const deptAbbreviations = {
      'cse': 'Computer Science and Engineering',
      'it': 'Information Technology',
      'ece': 'Electronics and Communication Engineering',
      'eee': 'Electrical and Electronics Engineering',
      'mech': 'Mechanical Engineering',
      'me': 'Mechanical Engineering',
      'civil': 'Civil Engineering',
      'ce': 'Civil Engineering',
      'chem': 'Chemical Engineering',
      'che': 'Chemical Engineering',
      'pe': 'Production Engineering',
      'prod': 'Production Engineering'
    };
    const validYears = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Alumni'];
    const yearMap = {
      '1': '1st Year', '2': '2nd Year', '3': '3rd Year', '4': '4th Year',
      '1st': '1st Year', '2nd': '2nd Year', '3rd': '3rd Year', '4th': '4th Year',
      '1st year': '1st Year', '2nd year': '2nd Year', '3rd year': '3rd Year', '4th year': '4th Year',
      'alumni': 'Alumni'
    };

    const seenCollegeIds = new Set();
    const seenEmails = new Set();

    // Check for existing records in DB
    const allCollegeIds = rows.map(r => mapHeader(r).collegeId.toUpperCase()).filter(Boolean);
    const allEmails = rows.map(r => mapHeader(r).email.toLowerCase()).filter(Boolean);

    const existingByCollegeId = await User.find({ collegeId: { $in: allCollegeIds } }).select('collegeId');
    const existingByEmail = await User.find({ email: { $in: allEmails } }).select('email');

    const existingCollegeIds = new Set(existingByCollegeId.map(u => u.collegeId));
    const existingEmails = new Set(existingByEmail.map(u => u.email));

    const validatedRows = rows.map((row, index) => {
      const mapped = mapHeader(row);
      const errors = [];

      // College ID validation
      if (!mapped.collegeId) {
        errors.push('College ID is required');
      } else {
        const cid = mapped.collegeId.toUpperCase();
        if (seenCollegeIds.has(cid)) {
          errors.push('Duplicate College ID in file');
        } else if (existingCollegeIds.has(cid)) {
          errors.push('College ID already exists in database');
        }
        seenCollegeIds.add(cid);
        mapped.collegeId = cid;
      }

      // Name validation
      if (!mapped.fullName) {
        errors.push('Name is required');
      }

      // Email validation
      if (!mapped.email) {
        errors.push('Email is required');
      } else {
        const emailLower = mapped.email.toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLower)) {
          errors.push('Invalid email format');
        } else if (!emailLower.endsWith('@student.tce.edu')) {
          errors.push('Email must use @student.tce.edu domain');
        }
        if (seenEmails.has(emailLower)) {
          errors.push('Duplicate email in file');
        } else if (existingEmails.has(emailLower)) {
          errors.push('Email already exists in database');
        }
        seenEmails.add(emailLower);
        mapped.email = emailLower;
      }

      // Department validation
      if (!mapped.department) {
        errors.push('Department is required');
      } else {
        const deptLower = mapped.department.toLowerCase().trim();
        if (deptAbbreviations[deptLower]) {
          mapped.department = deptAbbreviations[deptLower];
        } else if (!validDepartments.includes(mapped.department)) {
          // Try case-insensitive match
          const match = validDepartments.find(d => d.toLowerCase() === deptLower);
          if (match) {
            mapped.department = match;
          } else {
            errors.push('Invalid department');
          }
        }
      }

      // Year validation
      if (!mapped.year) {
        errors.push('Year is required');
      } else {
        const yearLower = mapped.year.toLowerCase().trim();
        if (yearMap[yearLower]) {
          mapped.year = yearMap[yearLower];
        } else if (!validYears.includes(mapped.year)) {
          errors.push('Invalid year (must be 1-4 or Alumni)');
        }
      }

      // Phone validation (optional)
      if (mapped.phone && !/^[0-9]{10}$/.test(mapped.phone.replace(/[\s\-\+]/g, ''))) {
        errors.push('Invalid phone number (must be 10 digits)');
      }

      return {
        row: index + 1,
        data: mapped,
        valid: errors.length === 0,
        errors
      };
    });

    const validCount = validatedRows.filter(r => r.valid).length;
    const invalidCount = validatedRows.filter(r => !r.valid).length;

    res.json({
      success: true,
      totalRows: validatedRows.length,
      validCount,
      invalidCount,
      rows: validatedRows
    });
  } catch (error) {
    console.error('Validate bulk import error:', error);
    res.status(500).json({ success: false, message: 'Failed to validate file.' });
  }
};

// @desc    Execute bulk import (confirmed rows)
// @route   POST /api/students/bulk-import
// @access  Admin
exports.bulkImportStudents = async (req, res) => {
  try {
    const { students } = req.body;

    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ success: false, message: 'No student data provided.' });
    }

    const results = { created: 0, failed: 0, errors: [] };

    for (const student of students) {
      try {
        // Generate temporary password: CollegeID + last 4 digits of phone or '0000'
        const phoneSuffix = student.phone ? student.phone.slice(-4) : '0000';
        const tempPassword = `${student.collegeId}@${phoneSuffix}`;

        await User.create({
          fullName: student.fullName,
          collegeId: student.collegeId.toUpperCase(),
          email: student.email.toLowerCase(),
          passwordHash: tempPassword, // Pre-save hook will hash this
          role: 'student',
          department: student.department,
          year: student.year,
          phone: student.phone || undefined
        });

        results.created++;
      } catch (err) {
        results.failed++;
        results.errors.push({
          collegeId: student.collegeId,
          message: err.code === 11000
            ? 'Duplicate record'
            : err.message
        });
      }
    }

    res.json({
      success: true,
      message: `Successfully imported ${results.created} students.${results.failed > 0 ? ` ${results.failed} failed.` : ''}`,
      results
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({ success: false, message: 'Failed to import students.' });
  }
};

// @desc    Bulk delete students
// @route   POST /api/students/bulk-delete
// @access  Admin
exports.bulkDeleteStudents = async (req, res) => {
  try {
    const { studentIds } = req.body;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ success: false, message: 'No student IDs provided.' });
    }

    // Ensure we only delete students, not admins
    const result = await User.deleteMany({
      _id: { $in: studentIds },
      role: 'student'
    });

    res.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} student records.`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete students.' });
  }
};
