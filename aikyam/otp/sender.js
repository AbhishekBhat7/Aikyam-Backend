// const express = require('express');
// const bodyParser = require('body-parser');
// const nodemailer = require('nodemailer');
// const cors = require('cors');
// const fs = require('fs');

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());
// app.use(bodyParser.json());

// let otp = null;
// let otpEmail = null;

// function getEmailHtml(otp) {
//     const template = fs.readFileSync('email-template.html', 'utf8');
//     return template.replace('{{OTP}}', otp);
// }

// app.post('/sendOtp', async (req, res) => {
//     const email = req.body.email;
//     console.log("Email received:", email);
//     console.log("Received request to send OTP");

//     if (!email) {
//         return res.send({ success: false, error: "Email not provided" });
//     }

//     otp = Math.floor(100000 + Math.random() * 900000);
//     otpEmail = email;
    

//     let transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS
//         }
//     });

//     let mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: 'OTP Code for Aikyam ',
//         html: getEmailHtml(otp)
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         res.send({ success: true });
//     } catch (error) {
//         console.error("Error sending email:", error);
//         res.send({ success: false, error: error.message });
//     }
// });


// app.post('/verifyOtp', (req, res) => {
//     console.log("Received request to verify OTP");
//     const { email, userOtp } = req.body;
//     if (email === otpEmail && userOtp == otp) {
//         res.send({ verified: true });
//     } else {
//         res.send({ verified: false });
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
const sendgrid = require('@sendgrid/mail'); // Using SendGrid as fallback
require('dotenv').config(); // Ensure that environment variables are loaded

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let otp = null;
let otpEmail = null;

function getEmailHtml(otp) {
    const template = fs.readFileSync('email-template.html', 'utf8');
    return template.replace('{{OTP}}', otp);
}

// Send OTP via Gmail or SendGrid
async function sendEmail(email, otp) {
    let transporter;
    const emailContent = getEmailHtml(otp);

    // Use Gmail by default
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'OTP Code for Aikyam',
            html: emailContent,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log("Email sent via Gmail.");
            return { success: true };
        } catch (error) {
            console.error("Error sending email via Gmail:", error.message);
            // If Gmail fails, try SendGrid
            return sendViaSendGrid(email, emailContent);
        }
    } else {
        return sendViaSendGrid(email, emailContent);
    }
}

// Send email using SendGrid as a fallback
async function sendViaSendGrid(email, emailContent) {
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY); // Ensure you have the SendGrid API key in your environment variables
    const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL, // Ensure this email is verified in your SendGrid account
        subject: 'OTP Code for Aikyam',
        html: emailContent,
    };

    try {
        await sendgrid.send(msg);
        console.log("Email sent via SendGrid.");
        return { success: true };
    } catch (error) {
        console.error("Error sending email via SendGrid:", error.message);
        return { success: false, error: error.message };
    }
}

app.post('/sendOtp', async (req, res) => {
    const email = req.body.email;
    console.log("Email received:", email);
    console.log("Received request to send OTP");

    if (!email) {
        return res.send({ success: false, error: "Email not provided" });
    }

    otp = Math.floor(100000 + Math.random() * 900000);
    otpEmail = email;

    const response = await sendEmail(email, otp);
    
    if (response.success) {
        res.send({ success: true });
    } else {
        res.send({ success: false, error: response.error });
    }
});

app.post('/verifyOtp', (req, res) => {
    console.log("Received request to verify OTP");
    const { email, userOtp } = req.body;
    if (email === otpEmail && userOtp == otp) {
        res.send({ verified: true });
    } else {
        res.send({ verified: false });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
