const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');

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
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/sendOtp', async (req, res) => {
    const email = req.body.email;
    console.log("Email received:", email);
    console.log("Received request to send OTP");

    if (!email) {
        return res.send({ success: false, error: "Email not provided" });
    }

    otp = Math.floor(100000 + Math.random() * 900000);
    otpEmail = email;
    

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'OTP Code for Aikyam ',
        html: getEmailHtml(otp)
    };

    try {
        await transporter.sendMail(mailOptions);
        res.send({ success: true });
    } catch (error) {
        console.error("Error sending email:", error);
        res.send({ success: false, error: error.message });
    }
});
app.use(cors({
    origin: '*', // Allow all origins or set specific origins
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
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


