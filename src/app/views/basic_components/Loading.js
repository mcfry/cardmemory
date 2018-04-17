// Libraries
import React from 'react';

// Css
import './Loading.css';

class Loading extends React.Component {
	render() {
		return (
			<div className="container loading-icon-container">
    			<i className="fa fa-circle-o-notch fa-spin"></i>
    		</div>
		);
	}
}

export default Loading;