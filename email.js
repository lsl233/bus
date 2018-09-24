const nodemailer = require('nodemailer');
const fs = require('fs');
const { mailInfo } = require('./config');

nodemailer.createTestAccount((err, account) => {
    const transporter = nodemailer.createTransport({
        service: 'QQ',
        secureConnection: true,
        secure: true,
        auth: {
            user: mailInfo.form,
            pass: mailInfo.pass
        }
    });

    let ngrokLogs = 'no logs';
    try {
        ngrokLogs = fs.readFileSync('./ngrok.logs', 'utf-8');
    } catch (error) {
        console.log(error);
    }


    const mailOptions = {
        from: `Fred Foo 👻 <${mailInfo.form}>`,
        to: mailInfo.to,
        subject: 'Hello ✔',
        text: ngrokLogs,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
});