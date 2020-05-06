const amqp = require('amqplib/callback_api');
const nodemailer = require('nodemailer');
const emailExistence = require("email-existence");

let sendMail = function(req, res) {

    /*
    email-existence with async/await - which is not working
    console.log('email : ' + req.body.emailTo.toString());
    let temp = await emailExistence.check(req.body.emailTo.toString(), (err, res) => {
        console.log('res : ' + JSON.stringify(res));
        console.log('res : ' + res);
        return res;
    });
    console.log('validateEmail existence: ' + temp);*/

    const output = `
        <h3>${req.body.message}</h3>
        <h3>Contact Details</h3>
        <ul>  
          <li>Name: Minal Narsale</li>
          <li>Company: Hypoteket</li>
          <li>Email: minalnarsale@gmail.com</li>
          <li>Phone: +91 9503668540</li>
        </ul>
      `;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '{yourEmailId}',
            pass: '{yourPassword}'
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Nodemailer" <minalnarsale@gmail.com>', // sender address
        to: req.body.emailTo, // list of receivers
        subject: req.body.subject, // Subject line
        text: req.body.message, // plain text message
        html: output // html body
    };

    //checking if email-id does exist
    emailExistence.check(req.body.emailTo.toString(), (err1, res1) => {
        if(res1) {
            console.log('sending mail');
            // send mail with defined transport object
            transporter.sendMail(mailOptions, function (err, info) {
                let msg = '';
                let statusCode = 0;
                if(err) {
                    statusCode = 500;
                    msg = 'mail has not been sent to ' + req.body.emailTo;
                    //res.status(500).json({'message': msg});
                } else {
                    statusCode = 200;
                    msg = 'mail has been sent to ' + req.body.emailTo;
                    console.log(info);
                }
                amqp.connect('amqp://localhost', function(error0, connection) {
                    if (error0) {
                        throw error0;
                    }
                    connection.createChannel(function(error1, channel) {
                        if (error1) {
                            throw error1;
                        }
                        const queue = 'mailTo';
                        channel.assertQueue(queue, {
                            durable: false
                        });
                        channel.sendToQueue(queue, Buffer.from(msg));
                        console.log('setting rabbitmq message');
                        res.status(statusCode).json({'message': msg});
                    });
                });
            });
        } else {
            res.status(500).json({'message': 'email is incorrect'});
        }
    });
};

module.exports = sendMail;