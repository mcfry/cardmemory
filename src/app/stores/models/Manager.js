// Libraries
import { observable, action } from 'mobx';
import axios from 'axios';

class Manager {

	constructor(rootStore) {
		this.rootStore = rootStore;
	}
	
	/////////////////////
	// Getters/Setters //
	/////////////////////

	@observable currentSubNav = "Create";
	@observable isLoading = false;
	@observable deckObject = null; // cards: {name, image_url, action1, action2}, deck_info: {}

	@action setCurrentSubNav(subNav) {
		this.currentSubNav = subNav;
	}

	@action setIsLoading(isLoading) {
		this.isLoading = isLoading;
	}

	@action setDeckObject(deckObject) {
		this.deckObject = deckObject;
		if (deckObject === null) {
			this.currentSubNav = "Create";
		} else {
			this.currentSubNav = "Edit";
		}
		console.log(deckObject);
	}
	
	/////////////////////
	// Model Functions //
	/////////////////////

	// Public //

	createDeck(deckInfo) {
		this.setIsLoading(true);
		axios({
			url: `http://0.0.0.0:3001/api/v1/deck_infos`, 
	        method: 'post',
	        data: deckInfo,
	        headers: {
	          'Content-Type': 'application/json',
	          'X-User-Email': localStorage.getItem('email'),
	          'X-User-Token': localStorage.getItem('authentication_token')
	        }
	    }).then((response) => {
			sessionStorage.pushItem('alerts', {
				type: 'success',
				message: "Deck successfully created!"
			});

	    	this.loadDeck();
		}).catch((error) => {
			sessionStorage.pushItem('alerts', {
				type: 'danger',
				message: "Something went wrong. Please try again."
			});

			this.setIsLoading(false);
		});
	}

	updateCards() {
		this.setIsLoading(true);
		axios({
			url: `http://0.0.0.0:3001/api/v1/deck_infos`, 
	        method: 'patch',
	        data: {cards: this.deckObject.cards},
	        headers: {
	          'Content-Type': 'application/json',
	          'X-User-Email': localStorage.getItem('email'),
	          'X-User-Token': localStorage.getItem('authentication_token')
	        }
	    }).then((response) => {
			sessionStorage.pushItem('alerts', {
				type: 'success',
				message: "Deck successfully updated!"
			});

			this.setIsLoading(false);
		}).catch((error) => {
			sessionStorage.pushItem('alerts', {
				type: 'danger',
				message: "Something went wrong. Please try again."
			});

			this.setIsLoading(false);
		});
	}

	// Private (Not Enforced) //

		loadDeck() {
			this.setIsLoading(true);
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
		    	let test = observable.map(response.data.cards);
		    	let tempDeckObj = observable.object(response.data);
		    	console.log(test);
		    	this.setDeckObject(tempDeckObj);
		    	this.setIsLoading(false);
			}).catch((error) => {
				this.setDeckObject(null);
				this.setIsLoading(false);
			});
		}

	/////////////////////
	//  Model Helpers  //
	/////////////////////

	isEmptyObj(obj) {
		return Object.keys(obj).length === 0 && obj.constructor === Object;
	}
}

export default Manager;