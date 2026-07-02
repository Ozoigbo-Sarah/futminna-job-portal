const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, roles, skills, department, graduationYear, companyName, companyDescription } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Set active role to first selected role
    const userRoles = roles || ['graduate'];
    const activeRole = userRoles[0];

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      roles: userRoles,
      activeRole,
      skills: skills || [],
      department: department || '',
      graduationYear: graduationYear || '',
      companyName: companyName || '',
      companyDescription: companyDescription || ''
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      { id: user._id, roles: user.roles, activeRole: user.activeRole },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        activeRole: user.activeRole
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, roles: user.roles, activeRole: user.activeRole },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        activeRole: user.activeRole
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Switch active role
exports.switchRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.user.id);

    if (!user.roles.includes(role)) {
      return res.status(400).json({ message: 'You do not have this role' });
    }

    user.activeRole = role;
    await user.save();

    const token = jwt.sign(
      { id: user._id, roles: user.roles, activeRole: user.activeRole },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        activeRole: user.activeRole
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add a new role to existing user
exports.addRole = async (req, res) => {
  try {
    const { role, companyName, companyDescription } = req.body;
    const user = await User.findById(req.user.id);

    if (user.roles.includes(role)) {
      return res.status(400).json({ message: 'You already have this role' });
    }

    // Make sure roles array has no duplicates
    user.roles = [...new Set([...user.roles, role])];
    
    if (role === 'employer') {
      user.companyName = companyName || '';
      user.companyDescription = companyDescription || '';
    }

    await user.save();
    res.json({ message: 'Role added successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      name, bio, skills, department, graduationYear,
      companyName, companyDescription, github, linkedin,
      portfolio, phone
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (skills) user.skills = skills;
    if (department !== undefined) user.department = department;
    if (graduationYear !== undefined) user.graduationYear = graduationYear;
    if (companyName !== undefined) user.companyName = companyName;
    if (companyDescription !== undefined) user.companyDescription = companyDescription;
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (portfolio !== undefined) user.portfolio = portfolio;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    res.json({ message: 'Profile updated successfully!', user });
  } catch (error) {
    console.log('PROFILE UPDATE ERROR:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};