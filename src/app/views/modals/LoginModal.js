// Libraries
import React from "react";
import { transaction } from 'mobx';
import { observer, inject } from 'mobx-react';
import { withRouter } from "react-router-dom";

// Components
import Alert from '../basic_components/Alert';

@withRouter @inject((RootStore) => {
	return {
		User: RootStore.UserStore
	}
}) @observer
class LoginModal extends React.Component {
	constructor(props) {
		super(props);

		// Refs
		this.modalClose = React.createRef();
		this.loginForm = React.createRef();
		this.username = React.createRef();
		this.password = React.createRef();
		this.alert = React.createRef();

		// Func binds
		this.resetModal = this.resetModal.bind(this);
		this.attemptLogin = this.attemptLogin.bind(this);

		this.state = {
			lastLoginFailed: false
		};
	}

	handleEnter = (event) => {
		if (event.key === "Enter") {
			this.attemptLogin();
		}
	}

	resetModal() {
		this.loginForm.current.reset();
		this.setState({
			lastLoginFailed: false
		});
	}

	attemptLogin() {
		const { User } = this.props;
		const failed = () => {
			this.setState({
				lastLoginFailed: true
			});
			if (this.alert.current) {
				this.alert.current.resetAlert();
			}
		};

		if (this.username.current.value !== "" && this.password.current.value !== "") {
			User.logIn(this.username.current.value, this.password.current.value).then((status) => {
				transaction(() => {
					status.transactions();
					this.modalClose.current.click(); // Simulate a click to trigger internal bootstrap js
					this.props.history.push('/');
				});
			}).catch((error) => {
				transaction(() => {
					error.transactions();
					failed();
				});
			});
		} else {
			failed();
		}
	}

	render() {
		const isAlert = this.state.lastLoginFailed ? 
			<Alert alertType="danger" alertMessage="Oh snap! Information is incorrect." ref={this.alert} /> : '';

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
								<input type="text" className="form-control" onKeyPress={this.handleEnter} id="username-input" placeholder="Username" ref={this.username}/>
							</div>
							<div className="form-group">
								<label htmlFor="password-input">Password</label>
								<input type="password" className="form-control" onKeyPress={this.handleEnter} id="password-input" placeholder="Password" ref={this.password}/>
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

export default LoginModal;