import { observable, action } from 'mobx';
import axios from 'axios';

class User {
	
	/////////////////////
	// Getters/Setters //
	/////////////////////

	@observable isLoading = false;
	@observable isLoggedIn = false;

	@action setIsLoading(isLoading) {
		this.isLoading = isLoading;
	}


	@action setIsLoggedIn(isLoggedIn) {
		this.isLoggedIn = isLoggedIn;
	}

	/////////////////////
	// Model Functions //
	/////////////////////

	create(username, email, password, password_confirmation) {
		this.setIsLoading(true);
		return new Promise((resolve, reject) => {
			axios({
		        url: `http://0.0.0.0:3001/users`, 
		        method: 'post',
		        data: {
		        	username: username,
					email: email,
					password: password,
					password_confirmation: password_confirmation
		        },
		        headers: {
		          'Content-Type': 'application/json'
		        }
		    }).then((response) => {
		    	this.setIsLoading(false);

				sessionStorage.pushItem('alerts', {
					type: 'success',
					message: "You've successfully registered, try logging in!"
				});

				resolve(true);
			}).catch((error) => {
				this.setIsLoading(false);

				reject(false);
			});
		});
	}

	logIn(username = null, password = null) {
		// const usernameStore = localStorage.getItem('username');
	 //    const tokenStore = localStorage.getItem('authentication_token');

	    // if (usernameStore && tokenStore) {
	    //   this.logInFromStorage(username);
	    // } else 
	    if (username && password) {
	      return this.createSession(username, password);
	    } else { 
	      return this.logOut();
	    }
	}

	logOut() {
		this.setIsLoading(true);
		return new Promise((resolve, reject) => {
			axios({
		        url: `http://0.0.0.0:3001/api/v1/sessions`, 
		        method: 'delete',
		        headers: {
		          'Content-Type': 'application/json',
		          'X-User-Email': localStorage.getItem('email'),
		          'X-User-Token': localStorage.getItem('authentication_token')
		        }
	        }).then((response) => {
	        	this.setIsLoggedIn(false);
	        	this.setIsLoading(false);

		        localStorage.removeItem('username');
		        localStorage.removeItem('email');
		        localStorage.removeItem('authentication_token');

		        sessionStorage.pushItem('alerts', {
		          type: 'success',
		          message: "You've successfully logged out."
		        });

		        resolve(true);
	        }).catch((error) => {
	        	this.setIsLoggedIn(true);
	        	this.setIsLoading(false);

		        sessionStorage.pushItem('alerts', {
		          type: 'danger',
		          message: "Could not log out."
		        });

		        resolve(false);
	        });
	    });
	}

	createSession(username, password) {
		this.setIsLoading(true);
		return new Promise((resolve, reject) => {
			axios({
		        url: `http://0.0.0.0:3001/api/v1/sessions`, 
		        method: 'post',
		        data: {
		        	username: username,
					password: password
		        },
		        headers: {
		          'Content-Type': 'application/json'
		        }
		    }).then((response) => {
		    	this.setIsLoggedIn(true);
		    	this.setIsLoading(false);

				let authentication_token, email, username;
				({authentication_token, email, username} = response.data);

				localStorage.setItem('authentication_token', authentication_token);
				localStorage.setItem('username', username);
				localStorage.setItem('email', email);

				sessionStorage.pushItem('alerts', {
					type: 'success',
					message: "You've successfully logged in!"
				});

				resolve(true);
			}).catch((error) => {
				this.setIsLoggedIn(false);
				this.setIsLoading(false);

				reject(false);
			});
		});
	}

	/////////////////////
	//  Model Helpers  //
	/////////////////////
}

export default new User();