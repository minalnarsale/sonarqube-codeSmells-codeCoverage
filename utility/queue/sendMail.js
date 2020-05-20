const amqp = require('amqplib/callback_api');
const nodemailer = require('nodemailer');
const emailExistence = require("email-existence");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'minalnarsale@gmail.com',
        pass: 'Career@2020'
    }
});

let sendMailTo = function(req, res) {

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
            // send mail with defined transporter object
            transporter.sendMail(mailOptions, function (err, info) {
                let msg = '';
                let statusCode = 0;
                if(err) {
                    statusCode = 500;
                    msg = `mail has not been sent to ${req.body.emailTo}`;
                } else {
                    statusCode = 200;
                    msg = `mail has been sent to ${req.body.emailTo}`;
                    console.log(info);
                }
                amqp.connect('amqp://localhost', function(error0, connection) {

                    if (error0) {
                        statusCode = 200;
                        msg = msg + `\nRabbitMQ is down.\nMail status did not register in RabbitMQ.`;
                        return res.status(statusCode).send(msg);
                    }
                    connection.createChannel(function(error1, channel) {

                        if (error1) {
                            statusCode = 200;
                            msg = msg + '\n mail status did not register in RabbitMQ,' +
                                ' RabbitMQ-channel did not get created';
                            return res.status(statusCode).send(msg);
                        }
                        const queue = 'mailTo';
                        channel.assertQueue(queue, {
                            durable: false
                        });
                        channel.sendToQueue(queue, Buffer.from(msg));
                        console.log(`setting rabbitmq message : ${msg}`);
                        res.status(statusCode).send(msg);
                    });
                });
            });
        } else {
            res.status(500).send('email is incorrect');
        }
    });
};

module.exports = { sendMailTo, transporter };