// Libraries
import { saveAs } from 'file-saver/FileSaver';
import { observable, action } from 'mobx';
import axios from 'axios';
//import activeStorageUpload from '../../../activeStorageUpload';
import LZString from 'lz-string';

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
	@observable memPalacesObj = null; // name: [image_urls]
	@observable bestTimes = [];

	@action setCurrentSubNav(subNav) {
		if (subNav === 'Edit Deck') this.loadDeck(); // TODO: use dirty flag, only fetch if changed
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
			this.currentSubNav = "Edit Deck";
		}
	}

	// NOTE: Because MobX updates by access, and not value, the full object path must be accessed
	@action updateCard(suit, denom, newFields) {
		for (let key in newFields) {
			this.deckObject.cards[suit][denom][key] = newFields[key];
		}
	}

	@action setMemPalaces(memPalacesObj) {
		this.memPalacesObj = memPalacesObj;
	}

	@action setCards(cards) {
		if (cards !== null) {
			for (var suit = 1; suit <= 4; suit++) {
				for (var denom = 2; denom <= 14; denom++) {
					this.deckObject.cards[suit][denom] = cards[suit][denom];
				}
			}
		}
	}

	@action setBestTimes(times) {
		this.bestTimes = times;
	}
	
	/////////////////////
	// Model Functions //
	/////////////////////

	// Public //

	createDeck(deckInfo) {
		let fields = ['deck_type', 'red', 'black', 'hearts', 'spades', 'diamonds', 'clubs'];
		if (fields.every(field => deckInfo[field])) {
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
				this.rootStore.AlertStore.pushItem('alerts', {
					type: 'success',
					message: "Deck successfully created!"
				});

		    	this.loadDeck();
			}).catch((error) => {
				this.rootStore.AlertStore.pushItem('alerts', {
					type: 'danger',
					message: "Something went wrong. Please try again."
				});

				this.setIsLoading(false);
			});
		} else {
			// TODO: More detailed alert for this
			this.rootStore.AlertStore.pushItem('alerts', {
				type: 'danger',
				message: "You must select a card type and theme."
			});
		}
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
			this.rootStore.AlertStore.pushItem('alerts', {
				type: 'success',
				message: "Deck successfully updated!"
			});

			this.setIsLoading(false);
		}).catch((error) => {
			this.rootStore.AlertStore.pushItem('alerts', {
				type: 'danger',
				message: "Something went wrong. Please try again."
			});

			this.setIsLoading(false);
		});
	}

	updateMemoryPalace(name) {
		axios({
			url: `http://0.0.0.0:3001/api/v1/memory_palaces`, 
	        method: 'patch',
	        data: {name: name, groups_to_image_array: this.memPalacesObj[name].groups_to_image_array, image_urls: this.memPalacesObj[name].image_urls},
	        headers: {
	          'Content-Type': 'application/json',
	          'X-User-Email': localStorage.getItem('email'),
	          'X-User-Token': localStorage.getItem('authentication_token')
	        }
	    }).then((response) => {
			this.rootStore.AlertStore.pushItem('alerts', {
				type: 'success',
				message: "Memory palace successfully saved!"
			});
		}).catch((error) => {
			this.rootStore.AlertStore.pushItem('alerts', {
				type: 'danger',
				message: "Something went wrong. Please try again."
			});
		});
	}

	exportCards() {
		// NOTE: It would be nice to download as a json file so it could be modified locally, however
		// saveAs() uses the HTML5 api to download files client-side and does not support large files.
		// Since we want to export/use a large number of images in the deck, this is probably not feasible
		// this way.
		try {
			if (window.File && window.FileReader && window.FileList && window.Blob) {
				let jsonString = JSON.stringify(this.deckObject.cards);
				let lzString = LZString.compressToUTF16(jsonString);
				let deckBlob = new Blob([lzString], {type: "text/plain;charset=utf-16"});
				saveAs(deckBlob, 'memo-deck.txt');
			} else {
				this.rootStore.AlertStore.pushItem('alerts', {
					type: 'warning',
					message: "Your current browser version does not support uploading the deck you just downloaded."
				});
			}
		} catch(e) {
			this.rootStore.AlertStore.pushItem('alerts', {
				type: 'danger',
				message: "Exporting decks is not supported by your current browser version."
			});
		}
	}

	uploadCards(cards) {
		this.setCards(cards);
		this.updateCards();
	}

	sendTime(timeObj) {
		axios({
			url: `http://0.0.0.0:3001/api/v1/best_times`, 
	        method: 'post',
	        data: timeObj,
	        headers: {
	          'Content-Type': 'application/json',
	          'X-User-Email': localStorage.getItem('email'),
	          'X-User-Token': localStorage.getItem('authentication_token')
	        }
	    }).then((response) => {
	    	// Success
	    	this.getTimes();
		}).catch((error) => {
			this.rootStore.AlertStore.pushItem('alerts', {
				type: 'danger',
				message: "Couldn't retrieve your best times, something went wrong. Please try again."
			});
		});
	}

	// TODO: cache the result
	getTimes() {
		axios({
			url: `http://0.0.0.0:3001/api/v1/best_times`, 
	        method: 'get',
	        headers: {
	          'Content-Type': 'application/json',
	          'X-User-Email': localStorage.getItem('email'),
	          'X-User-Token': localStorage.getItem('authentication_token')
	        }
	    }).then((response) => {
	    	// Success
	    	this.setBestTimes(response.data);
		}).catch((error) => {
			this.rootStore.AlertStore.pushItem('alerts', {
				type: 'danger',
				message: "Couldn't retrieve your best times, something went wrong. Please try again."
			});
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
		    	//console.log(response.data);
		    	//let test = observable.map(response.data.cards);
		    	//console.log(test);

		    	let tempDeckObj = observable.object(response.data);
		    	this.setDeckObject(tempDeckObj);
		    	this.setIsLoading(false);
			}).catch((error) => {
				this.setDeckObject(null);
				this.setIsLoading(false);
			});
		}

		// BUGFIX: if loaded at same time as deck can have issue with object null (ui renders loaded but req in progress)
		loadMemoryPalaces() {
			this.setIsLoading(true);
			axios({
				url: `http://0.0.0.0:3001/api/v1/memory_palaces`, 
		        method: 'get',
		        headers: {
		          'Content-Type': 'application/json',
		          'X-User-Email': localStorage.getItem('email'),
		          'X-User-Token': localStorage.getItem('authentication_token')
		        }
		    }).then((response) => {
		    	//console.log(response.data);
		    	let memPalacesObj = observable.object(response.data);
		    	this.setMemPalaces(memPalacesObj);
		    	this.setIsLoading(false);
			}).catch((error) => {
				console.log(error.response);

				this.setMemPalaces(null);
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