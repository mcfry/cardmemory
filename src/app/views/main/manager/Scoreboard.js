// Libraries
import React from "react";
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';

// Components
import ScoreList from './helpers/ScoreList';

// Css
import './Manager.css';
import 'animate.css/animate.min.css';

@withRouter @inject(RootStore => {
	return {
		Manager: RootStore.ManagerStore
	}
}) @observer
class Scoreboard extends React.Component {
	
	componentDidMount() {
		this.props.Manager.getTimes();
	}

	render() {
		const { Manager } = this.props;

		return(
			<div id="scoreboard-tab" className="tab-content">
				<div className={classNames("tab-pane", "fade", {"active show": Manager.currentSubNav === 'Scoreboard'})}>

					<br/>

					<div className="container">
						<div className="row">
							<div className="mx-auto">
								{(Manager.bestTimes.easy === undefined 
									&& Manager.bestTimes.medium === undefined 
										&& Manager.bestTimes.hard === undefined) ? (<h3>
									<i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
									&nbsp;No data yet. Practice your decks and complete a difficulty to start a personal scoreboard!
								</h3>) :
									<ScoreList bestTimes={Manager.bestTimes}/>
								}
							</div>
						</div>
					</div>

				</div>
	        </div>
		);
	}
}

export default Scoreboard;