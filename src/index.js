import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'mobx-react';
import registerServiceWorker from './registerServiceWorker';

// Stores
import RootStore from './app/stores';

// Main app component
import App from './app/App';

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
Storage.prototype.getArrayAndClear = function(key, delay=0) {
  // Parse stringified array if exists
  let existing = this.getItem(key);
  if (existing !== null) {
    existing = JSON.parse(existing);
  }

  // delay in case of page refresh we want persistence
  setTimeout(() => {
    this.removeItem(key);
  }, delay);
  
  return existing;
};

// Hook into root
ReactDOM.render(
  <Provider {...RootStore}>
    <Router>
	    <App />
    </Router>
  </Provider>, 
	document.getElementById('root')
);

registerServiceWorker();
