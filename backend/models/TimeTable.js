const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer',
    required: true
  },
  day_of_week: {
    type: String,
    required: true, // Day of the week (e.g., Monday, Tuesday)
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  start_time: {
    type: String,  // You can store the start time as a string (e.g., "09:00")
    required: true
  },
  end_time: {
    type: String,  // You can store the end time as a string (e.g., "10:00")
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
