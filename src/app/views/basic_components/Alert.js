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
			alertOpen: true, alertCanTransition: true, alertCanAnimate: this.props.basicAlert === true ? false : true, alertAnimState: 'bounceInRight'
		};
		this.state = this.initialState;
	}

	closeAlert() {
		// Set Hide
		this.setState({
			alertCanTransition: false
		});

		// Set None
		setTimeout(() => {
			this.setState({
				alertOpen: false
			});
		}, 400);
	}

	aliasError(alertType) {
		if (alertType === 'error') {
			return 'warning';
		} else {
			return alertType;
		}
	}

	resetAlert() {
		if (this.state.alertOpen === true && this.state.alertCanAnimate === true) {
			this.setState({alertAnimState: 'bounceOutRight'}, () => {
				setTimeout(() => {
					this.setState(this.initialState);
				}, 400);
			});
		} else {
			this.setState(this.initialState);
		}
	}

	componentDidUpdate() {
		console.log(this.props.alertMessage);
	}

	render () {
		const alertClasses = classNames('alert', 
			{
				'alert-bottom animated alert-animate': this.state.alertCanAnimate
			}, this.state.alertAnimState, 'alert-'+this.aliasError(this.props.alertType), {
				hide: !this.state.alertCanTransition,
				none: !this.state.alertOpen
			}
		);

		return (
			<React.Fragment>
				<div className={alertClasses}>
				  <button type="button" className="close" onClick={this.closeAlert}>&times;</button>
				  {this.props.alertMessage}
				</div>
			</React.Fragment>
		);
	}
}

export default Alert;