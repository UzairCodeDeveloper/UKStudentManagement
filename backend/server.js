
const express = require('express');
const bodyParser = require('body-parser');

const { sendWelcomeEmail } = require('./utils/email');

// Will use when media is involved
// const bodyParser = require('body-parser');

// // Connect Application to Database
const connectDB = require('./config/db');

const cors = require("cors");



const app = express();

app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json({ limit: '10mb' })); // to support JSON-encoded bodies
app.use(express.json({ extended: false }))
// app.use(
// 	cookieSession({
// 		name: "session",
// 		keys: ["cyberwolve"],
// 		maxAge: 24 * 60 * 60 * 100,
// 	})
// );


// for Production
const path = require('path')


// Connect Database
connectDB();

app.use(cors())
// init middleware 
// to get data in request.body
app.use(express.json({extended: false}))





// ******* Routes *******
// user Login and Register User
app.use('/api/users', require('./routes/api/users'))

// ADMIN AUTH APIs
app.use('/api/admin', require('./routes/api/admin'))

// Class APIs
app.use('/api/class', require('./routes/api/class'))

// Course APIs
app.use('/api/course', require('./routes/api/course'))

// Volunteer APIs
app.use('/api/volunteer', require('./routes/api/volunteer'))

// Student APIs
app.use('/api/session', require('./routes/api/session'))

// Resources APIs
app.use('/api/resources', require('./routes/api/resources'))

// Attendance APIs
app.use('/api/attendence', require('./routes/api/attendence'))

// Teacher Attendance APIs 
app.use('/api/teacher-attendance', require('./routes/api/teacher-attendanceRoute'));

// Assignment Submission APIs
app.use('/api/submission', require('./routes/api/submission'));

// Timetable APIs
app.use('/api/time-table', require('./routes/api/timetableRoutes'));

//announcement
app.use('/api/announcement', require('./routes/api/announcement'));


//fees
app.use('/api/fees', require('./routes/api/fees'));

//Grading
app.use('/api/grading', require('./routes/api/grading'));


//Grading
app.use('/api/password', require('./routes/api/password'));

// Family APIs
app.use('/api/family', require('./routes/api/family'));
app.use('/api/report', require('./routes/api/report'));
app.use('/api/userprofile', require('./routes/api/userprofile'));
app.use('/api/getbook', require('./routes/api/getbook'));

// (async () => {
//     try {
//         const email = "21011519-024@uog.edu.pk";
//         const userId = "testUser123";
//         const password = "testPass123";
//         const guardianId = "guardian123";
//         const guardianPassword = "guardianPass123";
//         const familyNumber = "FAMILY123";

//         await sendWelcomeEmail(email, userId, password, guardianId, guardianPassword, familyNumber);
//         console.log("Test email sent successfully.");
//     } catch (error) {
//         console.error("Error testing email function:", error.message);
//     }
// })();


// for production
// Serve static assets in production
if(process.env.NODE_ENV === 'production'){
    // set static folder
    app.use(express.static('client/build'));
    const path = require('path')
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname, 'client','build','index.html'))
    })
}

const PORT = process.env.PORT  || 5000;

app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));