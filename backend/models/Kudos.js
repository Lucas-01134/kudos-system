import mongoose from 'mongoose';

const kudosSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 500
  },
  category: {
    type: String,
    enum: ['leadership', 'teamwork', 'innovation', 'support', 'excellence', 'other'],
    default: 'other'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

kudosSchema.index({ 'to': 1, 'createdAt': -1 });
kudosSchema.index({ 'from': 1, 'createdAt': -1 });

export default mongoose.model('Kudos', kudosSchema);
