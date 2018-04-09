// Libraries
import React from "react";
import classNames from "classnames";

// Css
import './Alert.css';

class Alert extends React.Component {
	constructor(props) {
		super(props);

		// Func binds
		this.closeAlert = this.closeAlert.bind(this);

		this.initialState = {
			alertOpen: true, alertCanTransition: true 
		};
		this.state = this.initialState;
	}

	closeAlert() {
		this.setState({
			alertCanTransition: false
		});
		setTimeout(() => {
			this.setState({
				alertOpen: false
			});
		}, 400);
	}

	resetAlert() {
		this.setState(this.initialState);
	}

	render () {
		const alertClasses = classNames('alert', 'alert-'+this.props.alertType, {
			hide: !this.state.alertCanTransition,
			none: !this.state.alertOpen
		});

		return (
			<div className={alertClasses}>
			  <button type="button" className="close" onClick={this.closeAlert}>&times;</button>
			  {this.props.alertMessage}
			</div>
		);
	}
}

export default Alert;