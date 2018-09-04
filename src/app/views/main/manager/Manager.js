// Libraries
import React from "react";
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';

// Components
import CreateManager from './CreateManager.js';
import EditManager from './EditManager.js';
import MemPalaces from './MemPalaces.js';
import PracticeManager from './PracticeManager.js';
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
	constructor(props) {
		super(props);

		// Func Binds
		this.subNavClick = this.subNavClick.bind(this);
	}

	subNavClick(tabStr) {
		this.props.Manager.setCurrentSubNav(tabStr);
	}

	render() {
		return(
			<div className="manager">
				<ul className="nav nav-tabs">
					<div className="container">
			        		<div className={this.props.User.isLoading || this.props.Manager.isLoading ? 'd-none' : ''}>
			        			{!this.props.User.isLoggedIn ? (
									<li className="nav-item pull-left">
						              <a className={"nav-link active show"} 
						              	 onClick={this.subNavClick.bind(this, 'Info')} data-toggle="tab">Info</a>
						            </li>
						        ) : (
						        	<React.Fragment>
					        			{this.props.Manager.deckObject === null ? (
								            <li className="nav-item pull-left">
								              <a className={"nav-link" + (this.props.Manager.currentSubNav === 'Create' ? " active show" : "")} 
								              	 onClick={this.subNavClick.bind(this, 'Create')} data-toggle="tab">Create</a>
								            </li>
								        ) : (
								        	<React.Fragment>
									            <li className="nav-item pull-left">
									              <a className={"nav-link" + (this.props.Manager.currentSubNav === 'Edit Deck' ? " active show" : "")} 
									              	 onClick={this.subNavClick.bind(this, 'Edit Deck')} data-toggle="tab">Edit Deck</a>
									            </li>
									            <li className="nav-item pull-left">
									              <a className={"nav-link" + (this.props.Manager.currentSubNav === 'Memory Palaces' ? " active show" : "")} 
									              	 onClick={this.subNavClick.bind(this, 'Memory Palaces')} data-toggle="tab">Memory Palaces</a>
									            </li>
									            <li className="nav-item pull-left">
									              <a className={"nav-link" + (this.props.Manager.currentSubNav === 'Practice' ? " active show" : "")} 
									              	 onClick={this.subNavClick.bind(this, 'Practice')} data-toggle="tab">Practice</a>
									            </li>
									            <li className="nav-item pull-left">
									              <a className={"nav-link" + (this.props.Manager.currentSubNav === 'Scoreboard' ? " active show" : "")} 
									              	 onClick={this.subNavClick.bind(this, 'Scoreboard')} data-toggle="tab">Scoreboard</a>
									            </li>

									        </React.Fragment>
								        )}
							     	</React.Fragment>
							    )}
				        	</div>
			        </div>
		        </ul>

		        <br/>

				<div className="container-fluid">
					<div className="row">
			            <div className="col-2">
			            </div>

			            <div className="col-8">
					        {this.props.User.isLoading || this.props.Manager.isLoading ? (
					        	<Loading/>
				        	) : (
				        		<React.Fragment>
					        		{!this.props.User.isLoggedIn ? (
						            	<div className={"tab-pane fade active show"}>
							              <p>You are not logged in! Please log in first to create and manage a deck.</p>
							            </div>
							        ) : (
							        	<React.Fragment>
							        		{this.props.Manager.deckObject === null ?
							            		<CreateManager isActive={this.props.Manager.currentSubNav === 'Create'} />
							            	: 
							            		<React.Fragment>
													<EditManager isActive={this.props.Manager.currentSubNav === 'Edit Deck'} />
													<MemPalaces isActive={this.props.Manager.currentSubNav === 'Memory Palaces'} />
													<PracticeManager isActive={this.props.Manager.currentSubNav === 'Practice'} />
													<Scoreboard isActive={this.props.Manager.currentSubNav === 'Scoreboard'} />
												</React.Fragment>
											}
								        </React.Fragment>
								    )}
								</React.Fragment>
						    )}
					    </div>

			            <div className="col-2">
			            </div>
			        </div>
			    </div>
			</div>
		);
	}
}

export default Manager;