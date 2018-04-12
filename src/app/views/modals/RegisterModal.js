// Libraries
import React from "react";
import { observer, inject } from 'mobx-react';
import { withRouter } from "react-router-dom";
import classNames from "classnames";

// Components
import Alert from '../basic_components/Alert';

@withRouter @inject((RootStore) => {
	return {
		User: RootStore.UserStore
	}
}) @observer
class RegisterModal extends React.Component {
	constructor(props) {
		super(props);

		// Refs
		this.modalClose = React.createRef();
		this.registerForm = React.createRef();
		this.username = React.createRef();
		this.email = React.createRef();
		this.password = React.createRef();
		this.confirmPassword = React.createRef();
		this.alert = React.createRef();

		// Func binds
		this.attemptToRegisterUser = this.attemptToRegisterUser.bind(this);
		this.validateUsername = this.validateUsername.bind(this);
		this.validateEmail = this.validateEmail.bind(this);
		this.validatePassword = this.validatePassword.bind(this);
		this.resetModal = this.resetModal.bind(this);

		this.state = {
			lastRegisterFailed: false, userRegistered: false, usernameValid: false, usernameErrorStr: "", 
			emailValid: false, emailErrorStr: "", passwordsValid: false, passwordsErrorStr: "", confPasswordsErrorStr: ""
		};
	}

	handleEnter = (event) => {
		if (event.key === "Enter") {
			this.attemptToRegisterUser();
		}
	}

	validateUsername() {
		let usernameValid = false;
		let usernameErrorStr = "";

		if (this.username.current.value.length >= 4) {
			usernameValid = true;
		} else {
			usernameErrorStr = "Username must be 4 characters or longer.";
		}

		this.setState({
			usernameValid: usernameValid, usernameErrorStr: usernameErrorStr
		});
	}

	validateEmail() {
		let emailValid = false;
		let emailErrorStr = "We'll never share your email with anyone else.";

		if (this.email.current.value.length > 6) {
			// 99.99% Compliant w/ RFC 2822
		    var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
		    if (re.test(String(this.email.current.value).toLowerCase()) === true) {
		    	emailValid = true;
		    } else {
		    	emailErrorStr = "Not a valid email address.";
		    }
		} else {
			emailErrorStr = "Email must be 6 characters or longer.";
		}

		this.setState({
			emailValid: emailValid, emailErrorStr: emailErrorStr
		});
	}

	validatePassword() {
		let passwordsValid = false;
		let passwordsErrorStr = "";
		let confPasswordsErrorStr = "";

		if (this.password.current.value !== "") {
			if (this.password.current.value.length < 6) {
				passwordsErrorStr = "Password must be 6 characters or longer.";
			}
		} else if (this.confirmPassword.current.value !== "") {
			passwordsErrorStr = "You must enter a password first.";
		}

		if (this.confirmPassword.current.value !== "") {
			if (this.confirmPassword.current.value.length < 6) {
				confPasswordsErrorStr = "Password must be 6 characters or longer";
			} else if (this.confirmPassword.current.value === this.password.current.value) {
				passwordsValid = true;
			} else {
				confPasswordsErrorStr = "Passwords do not match.";
			}
		}

		this.setState({
			passwordsValid: passwordsValid, passwordsErrorStr: passwordsErrorStr, confPasswordsErrorStr: confPasswordsErrorStr
		});
	}

	resetModal() {
		if (this.registerForm.current !== null) {
			this.registerForm.current.reset();
		}

		this.setState({
			lastRegisterFailed: false, userRegistered: false
		});
	}

	attemptToRegisterUser() {
		const { User } = this.props;
		const failed = () => {
			this.setState({
				userRegistered: false, lastRegisterFailed: true
			});
			if (this.alert.current) {
				this.alert.current.resetAlert();
			}
		};

		if (this.state.usernameValid && this.state.emailValid && this.state.passwordsValid) {
			User.create(this.username.current.value, this.email.current.value, this.password.current.value, this.confirmPassword.current.value).then((success) => {
				this.modalClose.current.click();
				this.props.history.push('/');
			}).catch((error) => {
				failed();
			});
		} else {
			failed();
		}
	}

	render() {
		const lastRegisterAlert = this.state.lastRegisterFailed ? 
			<Alert alertType="danger" alertMessage="Oh snap! Change a few things up and try submitting again." ref={this.alert} /> : '';

		// Begin User Helpers
		const emptyUsername = !this.username.current || (this.username.current && String.isEmpty(this.username.current.value));
		const usernameHelp = <small id="usernameHelp" className="form-text text-muted">{this.state.usernameErrorStr}</small>;

		const UsernameFormGroup = classNames('form-group', emptyUsername ? {} : { 
			'has-success': this.state.usernameValid, 'has-danger': !this.state.usernameValid
		});

		const UsernameFormControl = classNames('form-control', emptyUsername ? {} : { 
			'is-valid': this.state.usernameValid, 'is-invalid': !this.state.usernameValid
		});

		// Begin Email Helpers
		const emptyEmail = !this.email.current || (this.email.current && String.isEmpty(this.email.current.value));
		const emailHelp = <small id="emailHelp" className="form-text text-muted">{this.state.emailErrorStr}</small>;

		const EmailFormGroup = classNames('form-group', emptyEmail ? {} : { 
			'has-success': this.state.emailValid, 'has-danger': !this.state.emailValid
		});

		const EmailFormControl = classNames('form-control', emptyEmail ? {} : { 
			'is-valid': this.state.emailValid, 'is-invalid': !this.state.emailValid
		});

		// Begin Pass Helpers
		const validPass = this.state.passwordsErrorStr === "";
		const emptyPass = !this.password.current || (this.password.current && String.isEmpty(this.password.current.value));

		const passHelp = !validPass ?
			<small id="passHelp" className="form-text text-muted">{this.state.passwordsErrorStr}</small> : '';

		const passFormGroup = classNames('form-group', emptyPass ? {} : { 
			'has-success': validPass, 'has-danger': !validPass
		});

		const passFormControl = classNames('form-control', emptyPass ? {} : { 
			'is-valid': validPass, 'is-invalid': !validPass
		});

		// Begin Conf Pass Helpers
		const validConfPass = this.state.confPasswordsErrorStr === "";
		const emptyConfPass = !this.confirmPassword.current || (this.confirmPassword.current && String.isEmpty(this.confirmPassword.current.value));

		const passConfirmHelp = !validConfPass ?
			<small id="passHelp" className="form-text text-muted">{this.state.confPasswordsErrorStr}</small> : '';

		const passConfirmFormGroup = classNames('form-group', emptyConfPass ? {} : { 
			'has-success': validConfPass, 'has-danger': !validConfPass
		});

		const passConfirmFormControl = classNames('form-control', emptyConfPass ? {} : { 
			'is-valid': validConfPass, 'is-invalid': !validConfPass
		});

		return (
		  	<div id="register-modal" className="modal">
			  <div className="modal-dialog" role="document">
			    <div className="modal-content">

			      <div className="modal-header">
			        <h5 className="modal-title">Register</h5>
			        <button type="button" className="close" onClick={this.resetModal} data-dismiss="modal" aria-label="Close" ref={this.modalClose}>
			          <span aria-hidden="true">&times;</span>
			        </button>
			      </div>

			      <div className="modal-body">
			      	{lastRegisterAlert}

			      	{this.state.userRegistered ? 
						<Alert alertType="success" alertMessage="You've successfully registed, try signing in!"/>
					:
					    <form ref={this.registerForm}>
					        <div className={UsernameFormGroup}>
								<label htmlFor="username-input">Username</label>
								<input type="text" className={UsernameFormControl} onKeyPress={this.handleEnter} onChange={this.validateUsername} 
										id="username-input" aria-describedby="usernameHelp" placeholder="Username" ref={this.username}/>
								{usernameHelp}
							</div>
					        <div className={EmailFormGroup}>
								<label htmlFor="email-input">Email Address</label>
								<input type="email" className={EmailFormControl} onKeyPress={this.handleEnter} onChange={this.validateEmail} 
										id="email-input" aria-describedby="emailHelp" placeholder="Enter email" ref={this.email}/>
								{emailHelp}
							</div>
							<div className={passFormGroup}>
								<label htmlFor="password-input">Password</label>
								<input type="password" className={passFormControl} onKeyPress={this.handleEnter} onChange={this.validatePassword} 
										id="password-input" aria-describedby="passHelp" placeholder="Password" ref={this.password}/>
								{passHelp}
							</div>
							<div className={passConfirmFormGroup}>
								<label htmlFor="confirm-password-input">Confirm Password</label>
								<input type="password" className={passConfirmFormControl} onKeyPress={this.handleEnter} onChange={this.validatePassword} 
										id="confirm-password-input" aria-describedby="passConfirmHelp" placeholder="Password" ref={this.confirmPassword}/>
								{passConfirmHelp}
							</div>
						</form>
					}
			      </div>

			      <div className="modal-footer">
			        <button type="button" className="btn btn-primary" onClick={this.attemptToRegisterUser}>Register</button>
			        <button type="button" className="btn btn-secondary" onClick={this.resetModal} data-dismiss="modal">Cancel</button>
			      </div>

			    </div>
			  </div>
			</div>
		);
	}
}

export default RegisterModal;