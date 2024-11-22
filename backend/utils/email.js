const nodemailer = require('nodemailer');

// Transporter Configuration
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER, // Email user from environment variables
        pass: process.env.EMAIL_PASSKEY, // Password from environment variables
    },
});



/**
 * Send Welcome Email
 * 
 * @param {string} email - Recipient's email address
 * @param {string} userId - User ID
 * @param {string} password - User password
 * @param {string} guardianId - Guardian ID
 * @param {string} guardianPassword - Guardian password
 * @param {string} familyNumber - Family number
 * @returns {Promise<void>}
 */
const sendWelcomeEmail = async (email, userId, password, guardianId, guardianPassword, familyNumber) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Welcome to IMAM Organization",
            html: `
                <h1>Welcome to IMAM Organization!</h1>
                <p>Dear Member,</p>
                <p>We are thrilled to have you join our community. Below are your account details:</p>
                <ul>
                    <li><strong>User ID:</strong> ${userId}</li>
                    <li><strong>Password:</strong> ${password}</li>
                    <li><strong>Guardian ID:</strong> ${guardianId}</li>
                    <li><strong>Guardian Password:</strong> ${guardianPassword}</li>
                    <li><strong>Family Number:</strong> ${familyNumber}</li>
                </ul>
                <p>If you have any questions, feel free to contact our support team. We are here to assist you.</p>
                <p>Warm regards,</p>
                <p><strong>IMAM Organization Team</strong></p>
            `,
        };

        return transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error occurred while sending email:", error.message);
            } else {
                console.log("Email sent successfully!");
                console.log("Message ID:", info.messageId);
            }
        });
    } catch (err) {
        console.error("Server Error:", err.message);
    }
};

module.exports = { sendWelcomeEmail };
