const expect = require('chai').expect;
const sinon = require('sinon');
const transporter = require('../../../utility/queue/sendMail').transporter;
const supertest = require('supertest');
const app = require('../../../server');
const request = supertest(app);
const amqp = require('amqplib/callback_api');

describe('POST /api/sendEmail : mail has been sent', function() {

    this.timeout(60000);
    beforeEach(() => {
        sinon.restore();
    });

    it('incorrect email-id', (done) => {

        const body = {
            emailTo: 'wrongpassword@gmail.com',
            subject: 'testing mail',
            message: 'testing mocha test cases'
        };
        request.post('/api/sendEmail')
            .send(body)
            .end(function (err, res) {
                if (err) done(err);
                expect(res.status).to.equal(500);
                expect(res.text).to.equal('email is incorrect');
                done();
            });
    });

    it('amqp.connect error', (done) => {

        let err = {"errno":"ENOTFOUND","code":"ENOTFOUND","syscall":"getaddrinfo","hostname":"localhostt"};
        let amqpStub = sinon.stub(amqp, 'connect');
        amqpStub.withArgs(sinon.match.any).yields(err);
        const body = {
            emailTo: 'minalnarsale@gmail.com',
            subject: 'testing mail',
            message: 'testing mocha test cases'
        };
        request.post('/api/sendEmail')
            .send(body)
            .end(function (err, res) {
                if (err) done(err);
                expect(res.status).to.equal(200);
                expect(res.text).to.have.string(`mail has been sent to ${body.emailTo}`);
                expect(res.text).to.have.string(`RabbitMQ is down.`);
                expect(res.text).to.have.string(`Mail status did not register in RabbitMQ.`);
                done();
            });
    });

    it('success responses : mail sent', (done) => {

        const body = {
            emailTo: 'minalnarsale@gmail.com',
            subject: 'testing mail',
            message: 'testing mocha test cases'
        };
        request.post('/api/sendEmail')
            .send(body)
            .end(function (err, res) {
                if (err) done(err);
                expect(res.status).to.equal(200);
                expect(res.text).to.equal(`mail has been sent to ${body.emailTo}`);
                done();
            });
    });
});

describe('POST /api/sendEmail : mail has not been sent', function() {

    this.timeout(60000);
    beforeEach(() => {
        sinon.restore();
    });
    it('transporter.sendMail error', (done) => {

        let err = {"code":"EENVELOPE","command":"API"};
        let transporterStub = sinon.stub(transporter, 'sendMail');
        transporterStub.withArgs(sinon.match.any).yields(err);
        const body = {
            emailTo: 'minalnarsale@gmail.com',
            subject: 'testing mail',
            message: 'testing mocha test cases'
        };
        request.post('/api/sendEmail')
            .send(body)
            .end(function (err, res) {
                if (err) done(err);
                expect(res.status).to.equal(500);
                expect(res.text).to.equal(`mail has not been sent to ${body.emailTo}`);
                done();
            });
    });
});