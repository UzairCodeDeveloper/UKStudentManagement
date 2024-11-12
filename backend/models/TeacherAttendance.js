const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Teacher Attendance Schema
const teacherAttendanceSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  teacher_id: {
    type: Schema.Types.ObjectId, 
    ref: 'Volunteer',  // Assuming a Teacher model exists
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'leave'],
    required: true
  },
  reason_for_leave: {
    type: String,
    default: ''
  }
}, { timestamps: true });

teacherAttendanceSchema.index({ teacher_id: 1, date: 1 }, { unique: true }); // Ensure teacher can't have multiple records on the same date

const TeacherAttendance = mongoose.model('TeacherAttendance', teacherAttendanceSchema);

module.exports = TeacherAttendance;
