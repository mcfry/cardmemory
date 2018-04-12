import { observable, action } from 'mobx';
import axios from 'axios';

class Deck {

	constructor(rootStore) {
		this.rootStore = rootStore;
	}
	
	/////////////////////
	// Getters/Setters //
	/////////////////////

	@observable isLoading = false;
	@observable deckObject = null;

	@action setIsLoading(isLoading) {
		this.isLoading = isLoading;
	}

	@action setDeckObject(deckObject) {
		this.deckObject = deckObject;
	}
	
	/////////////////////
	// Model Functions //
	/////////////////////

	getDeck() {
		if (this.rootStore.UserStore.isLoggedIn && this.deckObject !== null) {
			this.setIsLoading(true);
			return new Promise((resolve, reject) => {
				axios({
					url: `http://0.0.0.0:3001/api/v1/deck_infos`, 
			        method: 'get',
			        headers: {
			          'Content-Type': 'application/json',
			          'X-User-Email': localStorage.getItem('email'),
			          'X-User-Token': localStorage.getItem('authentication_token')
			        }
			    }).then((response) => {
			    	console.log(response.data);
			    	this.setIsLoading(false);
			    	//this.setDeckObject(deckObject);

					resolve(true);
				}).catch((error) => {
					this.setIsLoading(false);

					reject(false);
				});
			});
		} else {
			return this.deckObject;
		}
	}

	createDeck(deckObject) {
		this.setIsLoading(true);
		return new Promise((resolve, reject) => {
			axios({
				url: `http://0.0.0.0:3001/api/v1/deck_infos`, 
		        method: 'post',
		        data: deckObject,
		        headers: {
		          'Content-Type': 'application/json',
		          'X-User-Email': localStorage.getItem('email'),
		          'X-User-Token': localStorage.getItem('authentication_token')
		        }
		    }).then((response) => {
		    	this.setIsLoading(false);
		    	this.setDeckObject(deckObject);

				sessionStorage.pushItem('alerts', {
					type: 'success',
					message: "Deck successfully created!"
				});

				resolve(true);
			}).catch((error) => {
				this.setIsLoading(false);

				sessionStorage.pushItem('alerts', {
					type: 'danger',
					message: "Something went wrong. Please try again."
				});

				reject(false);
			});
		});
	}

	/////////////////////
	//  Model Helpers  //
	/////////////////////

	isEmptyObj(obj) {
		return Object.keys(obj).length === 0 && obj.constructor === Object;
	}
}

export default Deck;