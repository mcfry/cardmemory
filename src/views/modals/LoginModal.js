// Libraries
import React from "react";
import { withRouter } from "react-router-dom";
import axios from 'axios';

// Components
import Alert from '../stateless/Alert';

class LoginModal extends React.Component {
	constructor(props) {
		super(props);

		// Refs
		this.modalClose = React.createRef();
		this.loginForm = React.createRef();
		this.username = React.createRef();
		this.password = React.createRef();

		// Func binds
		this.attemptLogin = this.attemptLogin.bind(this);
		this.resetModal = this.resetModal.bind(this);

		this.state = {
			lastLoginFailed: false
		};
	}

	resetModal() {
		this.loginForm.current.reset();
		this.setState({
			lastLoginFailed: false
		});
	}

	attemptLogin() {
		let that = this;
		if (this.username.current.value !== "" && this.password.current.value !== "") {
			axios.post('http://0.0.0.0:3001/api/v1/sessions', {
				username: that.username.current.value,
				password: that.password.current.value
			}).then(function (response) {
				let authentication_token, email, username;
				({authentication_token, email, username} = response.data);

				localStorage.setItem('authentication_token', authentication_token);
				localStorage.setItem('username', username);
				localStorage.setItem('email', email);

				sessionStorage.pushItem('alerts', {
					type: 'success',
					message: "You've successfully logged in!"
				});

				that.modalClose.current.click();
				that.props.history.push('/');
			}).catch(function (error) {
				console.log(error);
			});
		} else {
			this.setState({
				lastLoginFailed: true
			});
		}
	}

	render() {
		const isAlert = this.state.lastLoginFailed ? 
			<Alert alertType="danger" alertMessage="Oh snap! Change a few things up and try submitting again."/> : '';

		return (
		  	<div id="login-modal" className="modal">
			  <div className="modal-dialog" role="document">
			    <div className="modal-content">

			      <div className="modal-header">
			        <h5 className="modal-title">Login</h5>
			        <button type="button" className="close" onClick={this.resetModal} data-dismiss="modal" aria-label="Close" ref={this.modalClose}>
			          <span aria-hidden="true">&times;</span>
			        </button>
			      </div>

			      <div className="modal-body">
			      	{isAlert}

			      	<form ref={this.loginForm}>
				      	<div className="form-group">
							<label htmlFor="username-input">Username</label>
							<input type="text" className="form-control" id="username-input" placeholder="Username" ref={this.username}/>
						</div>
						<div className="form-group">
							<label htmlFor="password-input">Password</label>
							<input type="password" className="form-control" id="password-input" placeholder="Password" ref={this.password}/>
						</div>
					</form>
			      </div>

			      <div className="modal-footer">
			        <button type="button" className="btn btn-primary" onClick={this.attemptLogin}>Login</button>
			        <button type="button" className="btn btn-secondary" onClick={this.resetModal} data-dismiss="modal">Cancel</button>
			      </div>

			    </div>
			  </div>
			</div>
		);
	}
}

export default withRouter(LoginModal);