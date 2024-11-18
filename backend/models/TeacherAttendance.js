const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeacherAttendanceSchema = new Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  attendance: [
    {
      teacher_id: { type: Schema.Types.ObjectId, ref: 'Volunteer' }, // Reference to Volunteer
      status: { type: String, enum: ['present', 'absent', 'leave'] }, // Status field
    },
  ],
});

const TeacherAttendance = mongoose.model('TeacherAttendance', TeacherAttendanceSchema);
module.exports = TeacherAttendance;
