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
        enum: ['present', 'absent', 'late'], 
        required: true
      },
      reason_for_leave: {
        type: String,
        default: '' 
      },
      behaviour_marks: {
        type: Number,
        min: 0,
        max: 15, // Maximum of 5 for each field aggregated
        default: 0
      },
      knowledge: {
        type: Number,
        min: 0,
        max: 15, // Maximum of 5 for each field aggregated
        default: 0
      },
      resilience: {
        type: Number,
        min: 0,
        max: 15, // Maximum of 5 for each field aggregated
        default: 0
      }
  }
  ]
},{ timestamps: true });


attendanceSchema.index({ class_id: 1, date: 1 }, { unique: true }); 


const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;


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
