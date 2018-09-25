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

    let ngrokLogs = null;
    try {
        ngrokLogs = fs.readFileSync('./ngrok.log', 'utf-8');
    } catch (error) {
        console.log(error);
    }

    let html = '';
    if (ngrokLogs) {
        const tunnels = JSON.parse(ngrokLogs).tunnels;
        tunnels.forEach(item => {
            html += `<p>${item.name}: ${item.public_url}</p>`;
        })
    }



    const mailOptions = {
        from: `bus of ngrok update 👻 <${mailInfo.form}>`,
        to: mailInfo.to,
        subject: 'bus of ngrok update ✔',
        html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
});