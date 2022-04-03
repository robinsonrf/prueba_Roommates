const nodemailer = require('nodemailer');

function enviarCorreo(to, subject, html) {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'rabyrez3@gmail.com',
                pass: 'raby1949'
            }
        });

        const mailOptions = {
            from: 'rabyrez3@gmail.com',
            to,
            subject,
            html
        };

        transporter.sendMail(mailOptions, (err, data) => {
            if(err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });

}

module.exports = {enviarCorreo};