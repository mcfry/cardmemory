// Libraries
import { observable, action } from 'mobx';

class Alert {

	constructor(rootStore) {
		this.rootStore = rootStore;
	}
	
	/////////////////////
	// Getters/Setters //
	/////////////////////

	@observable alertRender = false;

	@action toggleRender() {
		this.alertRender = !this.alertRender;
	}
	
	/////////////////////
	// Model Functions //
	/////////////////////

	// Public //

	pushItem(type, item) {
		/*
		 * [alertObjs]: alertObj{type, message, time}
		 */
		sessionStorage.pushItem('alerts', item);
		this.toggleRender();
	}

	// Private (Not Enforced) //

		// func() {
		//	
		// }

	/////////////////////
	//  Model Helpers  //
	/////////////////////

}

export default Alert;