// Libraries
import React from "react";

// Css
import './Timer.css';

class Timer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			timer: null, last_count: null, counter: 0
		};
	}

	startTimer() {
		let timer = setInterval(this.tick.bind(this), 1000);
    	this.setState({timer});
	}

	resetTimer() {
		this.stopTimer();
		this.setState({counter: 0});
	}

	stopTimer() {
		if (this.state.timer !== null) {
			clearInterval(this.state.timer);
		}
		this.setState({last_count: this.state.counter});
	}

	componentWillUnmount() {
	    this.stopTimer();
	}

	tick() {
	    this.setState({
	        counter: this.state.counter + 1
	    });
	}

	render () {
		return (
			<div className="timer timer-text">
			  <i className="fa fa-clock-o"></i>&nbsp;
			  <span>
			  	{`${Math.floor(this.state.counter/60)}:${(this.state.counter%60) < 10 ? '0'+(this.state.counter%60) : (this.state.counter%60)}`}
			  </span>
			</div>
		);
	}
}

export default Timer;