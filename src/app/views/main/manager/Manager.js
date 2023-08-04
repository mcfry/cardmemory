// Libraries
import React from "react";
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';

// Components
import CreateManager from './CreateManager.js';
import EditManager from './EditManager.js';
import MemPalaces from './MemPalaces.js';
import PracticeManagerPanorama from './PracticeManagerPanorama.js';
import Scoreboard from './Scoreboard.js';
import Loading from '../../basic_components/Loading.js';

// Css
import './Manager.css';

@withRouter @inject((RootStore) => {
	return {
		User: RootStore.UserStore,
		Manager: RootStore.ManagerStore
	}
}) @observer
class Manager extends React.Component {

	subNavClick = () => (event, value) => {
		this.props.Manager.setCurrentSubNav(event.target.textContent);
	}

	checkActive = (current) => {
		return this.props.Manager.currentSubNav === current;
	}

	render() {
		const { User, Manager } = this.props;

		let navClasses = {
			createClasses: classNames('nav-link', {'active show': this.checkActive('Create')}),
			editClasses: classNames('nav-link', {'active show': this.checkActive('Edit Deck')}),
			memPalClasses: classNames('nav-link', {'active show': this.checkActive('Memory Palaces')}),
			pracClasses: classNames('nav-link', {'active show': this.checkActive('Practice')}),
			scoreClasses: classNames('nav-link', {'active show': this.checkActive('Scoreboard')})
		} ;

		return(
			<div className="manager">
				<ul className="nav nav-tabs bg-white">
					<div className="container">
		        		<div className={classNames({'d-none': User.isLoading || Manager.isLoading})}>
		        			{!User.isLoggedIn ? (
								<li className="nav-item pull-left">
					              <button className={"nav-link active show"}
					              	 onClick={this.subNavClick()} data-toggle="tab">Info</button>
					            </li>
					        ) : (<>
			        			{Manager.deckObject === null ? (
						            <li className="nav-item pull-left">
						              <button className={navClasses.createClasses} onClick={this.subNavClick()} data-toggle="tab">Create</button>
						            </li>
						        ) : (<>
						            <li className="nav-item pull-left">
						              <button className={navClasses.editClasses} onClick={this.subNavClick()} data-toggle="tab">Edit Deck</button>
						            </li>
						            <li className="nav-item pull-left">
						              <button className={navClasses.memPalClasses} onClick={this.subNavClick()} data-toggle="tab">Memory Palaces</button>
						            </li>
						            <li className="nav-item pull-left">
						              <button className={navClasses.pracClasses} onClick={this.subNavClick()} data-toggle="tab">Practice</button>
						            </li>
						            <li className="nav-item pull-left">
						              <button className={navClasses.scoreClasses} onClick={this.subNavClick()} data-toggle="tab">Scoreboard</button>
						            </li>
						        </>)}
						    </>)}
			        	</div>
			        </div>
		        </ul>

		        <br/>

				<div className="container-fluid">
					<div className="row">
			            <div className="col-2"></div>
			            <div className="col-8">
					        {User.isLoading || Manager.isLoading ? (
					        	<Loading/>
				        	) : (<>
				        		{!User.isLoggedIn ? (
					            	<div className={"tab-pane fade active show"}>
						              <p>You are not logged in! Please log in first to create and manage a deck.</p>
						            </div>
						        ) : (<>
						        		{Manager.deckObject === null && <CreateManager/>}
						            	{Manager.deckObject !== null && <>
											<EditManager/>
											<MemPalaces/>
											<PracticeManagerPanorama/>
											<Scoreboard/>
										</>}
								</>)}
						    </>)}
					    </div>
			            <div className="col-2"></div>
			        </div>
			    </div>
			</div>
		);
	}
}

export default Manager;
