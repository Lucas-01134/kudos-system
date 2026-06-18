import mongoose from 'mongoose';
import Kudos from '../models/Kudos.js';
import User from '../models/User.js';

export const sendKudos = async (req, res) => {
  try {
    const { to, message, category, isPublic } = req.body;

    if (!to || !message) {
      return res.status(400).json({ message: 'Please provide recipient and message' });
    }

    console.log('sendKudos request', { from: req.userId, to, message, category, isPublic });

    let recipient;
    if (mongoose.Types.ObjectId.isValid(to)) {
      recipient = await User.findById(to);
    }

    if (!recipient) {
      recipient = await User.findOne({ username: to }) || await User.findOne({ email: to });
    }

    if (!recipient) {
      console.log('sendKudos recipient not found', { to });
      return res.status(404).json({ message: 'Recipient not found' });
    }

    const normalizedFrom = String(req.userId);
    const normalizedRecipient = String(recipient._id);
    console.log('sendKudos compare', { normalizedFrom, normalizedRecipient });
    if (normalizedFrom === normalizedRecipient) {
      return res.status(400).json({ message: 'You cannot send kudos to yourself' });
    }

    const kudos = new Kudos({
      from: req.userId,
      to: recipient._id,
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

    console.log('getReceivedKudos', { userId: req.userId, page, limit });
    const userObjectId = new mongoose.Types.ObjectId(req.userId);

    const kudos = await Kudos.find({
      to: userObjectId,
      isVisible: { $ne: false }
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('from', 'username firstName lastName profileImage')
      .populate('to', 'username firstName lastName profileImage');

    const total = await Kudos.countDocuments({ to: req.userId, isVisible: { $ne: false } });

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
    console.error('getReceivedKudos error', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getSentKudos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log('getSentKudos', { userId: req.userId, page, limit });
    const userObjectId = new mongoose.Types.ObjectId(req.userId);

    const kudos = await Kudos.find({
      from: userObjectId,
      isVisible: { $ne: false }
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('from', 'username firstName lastName profileImage')
      .populate('to', 'username firstName lastName profileImage');

    const total = await Kudos.countDocuments({ from: req.userId, isVisible: { $ne: false } });

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
    console.error('getSentKudos error', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getKudosFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const userId = req.userId;
    const userObjectId = userId ? new mongoose.Types.ObjectId(userId) : null;

    const query = userObjectId
      ? {
          isVisible: { $ne: false },
          $or: [
            { isPublic: true },
            { from: userObjectId },
            { to: userObjectId }
          ]
        }
      : { isVisible: { $ne: false }, isPublic: true };

    const kudos = await Kudos.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('from', 'username firstName lastName profileImage')
      .populate('to', 'username firstName lastName profileImage');

    const total = await Kudos.countDocuments(query);

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

    const requestingUser = await User.findById(req.userId);
    const isAdmin = requestingUser?.isAdmin;

    if (kudos.from.toString() !== req.userId.toString() && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this kudos' });
    }

    await Kudos.findByIdAndDelete(req.params.id);
    res.json({ message: 'Kudos deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const setKudosVisibility = async (req, res) => {
  try {
    const kudos = await Kudos.findById(req.params.id);
    if (!kudos) {
      return res.status(404).json({ message: 'Kudos not found' });
    }

    kudos.isVisible = req.body.isVisible !== undefined ? req.body.isVisible : false;
    await kudos.save();

    res.json({ message: 'Kudos visibility updated', kudos });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getKudosStats = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log('getKudosStats', { userId });
    
    const received = await Kudos.countDocuments({ to: userId });
    const sent = await Kudos.countDocuments({ from: userId });
    const likes = await Kudos.aggregate([
      { $match: { to: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalLikes: { $sum: { $size: '$likes' } } } }
    ]);

    res.json({
      received,
      sent,
      likes: likes.length > 0 ? likes[0].totalLikes : 0
    });
  } catch (error) {
    console.error('getKudosStats error', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
