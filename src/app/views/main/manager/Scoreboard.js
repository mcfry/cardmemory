// Libraries
import React from "react";
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';

// Css
import './Manager.css';
import 'animate.css/animate.min.css';

@withRouter @inject((RootStore) => {
	return {
		Manager: RootStore.ManagerStore
	}
}) @observer
class Manager extends React.Component {
	// constructor(props) {
	// 	super(props);
	// }

	componentDidMount() {
		this.props.Manager.getTimes();
	}

	render() {
		return(
			<div id="scoreboard-tab" className="tab-content">
				<div className={"tab-pane fade" + (this.props.isActive ? " active show" : "")}>

					<br/>

					<div className="container">
						<div className="row">
							<div className="mx-auto">
								{this.props.Manager.bestTimes.easy === undefined 
									&& this.props.Manager.bestTimes.medium === undefined 
										&& this.props.Manager.bestTimes.hard === undefined ?
									<h3><i className="fa fa-exclamation-triangle" aria-hidden="true"></i>&nbsp;No data yet. Practice your decks and complete a difficulty to start a personal scoreboard!</h3>
								: ''}
								<div className="list-group" style={{'paddingBottom': '20px'}}>
									{this.props.Manager.bestTimes.easy !== undefined ? (
										<React.Fragment>
											<div>
												<h1 style={{'marginLeft': '20px'}}>Easy</h1>
											</div>
											{this.props.Manager.bestTimes.easy.map((time, index) => {
												return (
													<a key={index} className="list-group-item list-group-item-center">
													    <span className="scoreboard-col"><i className="fa fa-clock-o"></i>&nbsp;Seconds: {time.seconds}</span>
													    <span className="scoreboard-col"><i className="fa fa-times"></i>&nbsp;Mistakes: {time.mistakes}</span>
													</a>
												)
											})}
										</React.Fragment>
									) : ''}
								</div>

								<div className="list-group" style={{'paddingBottom': '20px'}}>
									{this.props.Manager.bestTimes.medium !== undefined ? (
										<React.Fragment>
											<div>
												<h1 style={{'marginLeft': '20px'}}>Medium</h1>
											</div>
											{this.props.Manager.bestTimes.medium.map((time, index) => {
												return (
													<a key={index} className="list-group-item list-group-item-center">
													    <span className="scoreboard-col"><i className="fa fa-clock-o"></i>&nbsp;Seconds: {time.seconds}</span>
													    <span className="scoreboard-col"><i className="fa fa-times"></i>&nbsp;Mistakes: {time.mistakes}</span>
													</a>
												)
											})}
										</React.Fragment>
									) : ''}
								</div>

								<div className="list-group" style={{'paddingBottom': '20px'}}>
									{this.props.Manager.bestTimes.hard !== undefined ? (
										<React.Fragment>
											<div>
												<h1 style={{'marginLeft': '20px'}}>Hard</h1>
											</div>
											{this.props.Manager.bestTimes.hard.map((time, index) => {
												return (
													<a key={index} className="list-group-item list-group-item-center">
													    <span className="scoreboard-col"><i className="fa fa-clock-o"></i>&nbsp;Seconds: {time.seconds}</span>
													    <span className="scoreboard-col"><i className="fa fa-times"></i>&nbsp;Mistakes: {time.mistakes}</span>
													</a>
												)
											})}
										</React.Fragment>
									) : ''}
								</div>
							</div>
						</div>
					</div>

				</div>
	        </div>
		);
	}
}

export default Manager;