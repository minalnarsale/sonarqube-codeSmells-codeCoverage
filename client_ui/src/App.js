import React, { Component } from 'react';
import './App.css';
// import  Button from  './component/Button'


class App extends Component {

    state = {
        emailTo: '',
        subject: '',
        message: '',
        response: '',
        responseToPost: ''
    };

    handleSubmit = async e => {
        e.preventDefault();
        const response = await fetch('/api/sendEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                emailTo: this.state.emailTo,
                subject: this.state.subject,
                message: this.state.message
            }),
        });
        const body = await response.text();

        this.setState({ responseToPost: body });
    };

    render() {
        return (
            <div className='App' >
                <h2>RabbitMQ + nodeMailer</h2>
                <h4>send contact request to :</h4>
                <p>{this.state.response}</p>
                <form onSubmit={this.handleSubmit}>
                    <p>Email-to :
                    <input
                        type='email'
                        value={this.state.emailTo}
                        onChange={e => this.setState({ emailTo: e.target.value })}
                    /></p>
                    <p>Subject :
                    <input
                        type='text'
                        value={this.state.subject}
                        onChange={e => this.setState({ subject: e.target.value })}
                    /></p>
                    <p>Message :
                     <input
                        type='text'
                        value={this.state.message}
                        onChange={e => this.setState({ message: e.target.value })}
                     /></p>
                    <button type='submit'>Submit</button>
                </form>
                <p>{this.state.responseToPost}</p>
            </div>
        );
    }
}; //it will give code smell(just for test)

export default App;
