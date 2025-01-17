const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  role: {
    type: String,
    default: '',
  },
  book_link: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);
