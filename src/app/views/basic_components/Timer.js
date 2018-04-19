// Libraries
import React from "react";
import classNames from "classnames";

// Css
import './Timer.css';

class Timer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			timer: null, counter: 0
		};
	}

	startTimer() {
		let timer = setInterval(this.tick.bind(this), 1000);
    	this.setState({timer});
	}

	resetTimer() {
		this.stopTimer();
		this.setState({counter: 0});
		this.startTimer();
	}

	stopTimer() {
		if (this.state.timer !== null) {
			this.clearInterval(this.state.timer);
		}
	}

	componentWillUnmount() {
	    this.stopTimer();
	}

	tick() {
		console.log(this.state);
	    this.setState({
	        counter: this.state.counter + 1
	    });
	}

	render () {
		return (
			<div className="timer">
			  <i className="fa fa-clock-o"></i>&nbsp;{`${Math.floor(this.state.counter/60)}:${this.state.counter < 10 ? '0'+this.state.counter : this.state.counter}`}
			</div>
		);
	}
}

export default Timer;