// Libraries
import { observable, action } from 'mobx';
import axios from 'axios';

class User {

	constructor(rootStore) {
		this.rootStore = rootStore;

		this.logInFromStorage();
	}
	
	/////////////////////
	// Getters/Setters //
	/////////////////////

	@observable isInitialLoading = false;
	@observable isLoading = false;
	@observable isLoggedIn = false;

	@action setIsLoading(isLoading) {
		this.isLoading = isLoading;
	}

	@action setIsInitialLoading(isLoading) {
		this.isInititalLoading = isLoading;
	}

	@action setIsLoggedIn(isLoggedIn) {
		this.isLoggedIn = isLoggedIn;
	}

	/////////////////////
	// Model Functions //
	/////////////////////

	// Public //

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
				sessionStorage.pushItem('alerts', {
					type: 'success',
					message: "You've successfully registered, try logging in!"
				});

				resolve({
					response: response,
					transactions: () => {
		    			this.setIsLoading(false);
			    	}
			    });
			}).catch((error) => {
				this.setIsLoading(false);

				reject({
					response: error,
					transactions: () => {
						this.setIsLoading(false);
			    	}
			    });
			});
		});
	}

	logIn(username = null, password = null) {
	    if (username && password) {
	      return this.createSession(username, password);
	    } else if (this.isLoggedIn) { 
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
		        localStorage.removeItem('username');
		        localStorage.removeItem('email');
		        localStorage.removeItem('authentication_token');

		        sessionStorage.pushItem('alerts', {
		          type: 'success',
		          message: "You've successfully logged out."
		        });

		        resolve({
					response: response,
					transactions: () => {
						this.setIsLoggedIn(false);
	        			this.setIsLoading(false);
			    	}
			    });
	        }).catch((error) => {
	        	// Don't allow react to catch failure
	        	resolve({
					response: error,
					transactions: () => {
	        			this.setIsLoading(false);
			    	}
			    });
	        });
	    });
	}

	// Private (Not Enforced) //

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
					let authentication_token, email, username;
					({authentication_token, email, username} = response.data);

					localStorage.setItem('authentication_token', authentication_token);
					localStorage.setItem('username', username);
					localStorage.setItem('email', email);

					sessionStorage.pushItem('alerts', {
						type: 'success',
						message: "You've successfully logged in!"
					});

					this.rootStore.ManagerStore.loadDeck();

					resolve({
						response: response,
						transactions: () => {
							this.setIsLoading(false);
							this.setIsLoggedIn(true);
				    	}
				    });
				}).catch((error) => {
					reject({
						response: error,
						transactions: () => {
							this.setIsLoggedIn(false);
							this.setIsLoading(false);
				    	}
				    });
				});
			});
		}

		logInFromStorage() {
			this.setIsInitialLoading(true);
			axios({
		        url: `http://0.0.0.0:3001/api/v1/sessions`, 
		        method: 'get',
		        headers: {
		          'Content-Type': 'application/json',
		          'X-User-Email': localStorage.getItem('email'),
		          'X-User-Token': localStorage.getItem('authentication_token')
		        }
		    }).then((response) => {
		    	this.rootStore.ManagerStore.loadDeck();
				this.setIsLoggedIn(true);
    			this.setIsInitialLoading(false);
			}).catch((error) => {
				localStorage.removeItem('username');
		        localStorage.removeItem('email');
		        localStorage.removeItem('authentication_token');

				this.setIsLoggedIn(false);
				this.setIsInitialLoading(false);
			});
		}

	/////////////////////
	//  Model Helpers  //
	/////////////////////

}

export default User;