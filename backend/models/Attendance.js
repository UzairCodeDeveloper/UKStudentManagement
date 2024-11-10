const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
  date: {
    type: Date,
    required: true 
  },
  
  class_id: {
    type: Schema.Types.ObjectId, 
    ref: 'Class', 
    required: true,
    index: true 
  },
  marked: {
    type: String,
    enum: ['true', 'false', 'holiday'], 
    required: true
  },   
  attendance: [
    {
      student_id: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true
      },
      status: {
        type: String,
        enum: ['present', 'absent', 'leave'], 
        required: true
      }
    }
  ]
},{ timestamps: true });


attendanceSchema.index({ class_id: 1, date: 1 }, { unique: true }); 


// attendanceSchema.pre('save', async function (next) {
//   const attendance = this;
//   const existingAttendance = await mongoose.model('Attendance').findOne({
//     class_id: attendance.class_id,
//     date: attendance.date
//   });

//   if (existingAttendance) {
//     const error = new Error('Attendance for this class on this date has already been marked.');
//     return next(error);
//   }

//   next();
// });

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
