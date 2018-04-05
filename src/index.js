// Site-wide js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

// Site-wide css
import 'font-awesome/css/font-awesome.min.css';
import './index.css';

// Main config
import registerServiceWorker from './registerServiceWorker';

// Main app component
import App from './App';

/* 
 * Extend functionality
 */

// Check if string is empty or null
String.isEmpty = function(value) {
  return !(typeof value === "string" && value.length > 0);
}

// Create a psuedo array object in localStorage/sessionStorage
Storage.prototype.pushItem = function(key, value) {
	// Parse stringified array if exists
	let existing = this.getItem(key);
	if (existing !== null) {
		existing = JSON.parse(existing);
	} else {
		existing = [];
	}

	// Push new value and stringify array
	existing.push(value);
    return this.setItem(key, JSON.stringify(existing));
};

// Retrieve pseudo array object
Storage.prototype.getArray = function(key) {
	// Parse stringified array if exists
	let existing = this.getItem(key);
	if (existing !== null) {
		existing = JSON.parse(existing);
	}

	return existing;
};

// Retrieve pseudo array object
Storage.prototype.getArrayAndClear = function(key) {
	// Parse stringified array if exists
	let existing = this.getItem(key);
	if (existing !== null) {
		existing = JSON.parse(existing);
	}

	this.removeItem(key);
	return existing;
};

// Hook into root, define router
ReactDOM.render(
	<Router>
		<App />
	</Router>, 
	document.getElementById('root')
);

registerServiceWorker();
