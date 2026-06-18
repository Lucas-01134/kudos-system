import Kudos from '../models/Kudos.js';
import User from '../models/User.js';

export const sendKudos = async (req, res) => {
  try {
    const { to, message, category, isPublic } = req.body;

    if (!to || !message) {
      return res.status(400).json({ message: 'Please provide recipient and message' });
    }

    if (req.userId.toString() === to) {
      return res.status(400).json({ message: 'You cannot send kudos to yourself' });
    }

    const recipient = await User.findById(to);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    const kudos = new Kudos({
      from: req.userId,
      to,
      message,
      category: category || 'other',
      isPublic: isPublic !== undefined ? isPublic : true
    });

    await kudos.save();
    await kudos.populate([
      { path: 'from', select: 'username firstName lastName profileImage' },
      { path: 'to', select: 'username firstName lastName profileImage' }
    ]);

    res.status(201).json({
      message: 'Kudos sent successfully',
      kudos
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getReceivedKudos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const kudos = await Kudos.find({ to: req.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('from', 'username firstName lastName profileImage')
      .populate('to', 'username firstName lastName profileImage');

    const total = await Kudos.countDocuments({ to: req.userId });

    res.json({
      kudos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getSentKudos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const kudos = await Kudos.find({ from: req.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('from', 'username firstName lastName profileImage')
      .populate('to', 'username firstName lastName profileImage');

    const total = await Kudos.countDocuments({ from: req.userId });

    res.json({
      kudos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getKudosFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const kudos = await Kudos.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('from', 'username firstName lastName profileImage')
      .populate('to', 'username firstName lastName profileImage');

    const total = await Kudos.countDocuments({ isPublic: true });

    res.json({
      kudos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const likeKudos = async (req, res) => {
  try {
    const kudos = await Kudos.findById(req.params.id);
    if (!kudos) {
      return res.status(404).json({ message: 'Kudos not found' });
    }

    const likeIndex = kudos.likes.indexOf(req.userId);
    if (likeIndex > -1) {
      kudos.likes.splice(likeIndex, 1);
    } else {
      kudos.likes.push(req.userId);
    }

    await kudos.save();
    await kudos.populate([
      { path: 'from', select: 'username firstName lastName profileImage' },
      { path: 'to', select: 'username firstName lastName profileImage' },
      { path: 'likes', select: 'username' }
    ]);

    res.json({ message: 'Like updated', kudos });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteKudos = async (req, res) => {
  try {
    const kudos = await Kudos.findById(req.params.id);
    if (!kudos) {
      return res.status(404).json({ message: 'Kudos not found' });
    }

    if (kudos.from.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this kudos' });
    }

    await Kudos.findByIdAndDelete(req.params.id);
    res.json({ message: 'Kudos deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getKudosStats = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const received = await Kudos.countDocuments({ to: userId });
    const sent = await Kudos.countDocuments({ from: userId });
    const likes = await Kudos.aggregate([
      { $match: { to: require('mongoose').Types.ObjectId(userId) } },
      { $group: { _id: null, totalLikes: { $sum: { $size: '$likes' } } } }
    ]);

    res.json({
      received,
      sent,
      likes: likes.length > 0 ? likes[0].totalLikes : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
