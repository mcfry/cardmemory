// Libraries
import React from "react";
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';

// Components
import CreateManager from './CreateManager.js';

// Css
import './Manager.css';

@withRouter @inject((RootStore) => {
	return {
		User: RootStore.UserStore,
		Deck: RootStore.DeckStore
	}
}) @observer
class Manager extends React.Component {
	constructor(props) {
		super(props);

		// Func Binds
		this.subNavClick = this.subNavClick.bind(this);

		this.state = {
			currentSubNav: 'Create'
		};
	}

	subNavClick(tabStr) {
		this.setState({
			currentSubNav: tabStr
		});
	}

	render() {
		return(
			<div className="manager">
				<ul className="nav nav-tabs">
					<div className="container">
						{!this.props.User.isLoggedIn ? (
							<li className="nav-item pull-left">
				              <a className={"nav-link active show"} 
				              	 onClick={this.subNavClick.bind(this, 'Info')} data-toggle="tab">Info</a>
				            </li>
				        ) : (
					        <div>
						        {this.props.Deck.deckObject === null ? (
						            <li className="nav-item pull-left">
						              <a className={"nav-link" + (this.state.currentSubNav === 'Create' ? " active show" : "")} 
						              	 onClick={this.subNavClick.bind(this, 'Create')} data-toggle="tab">Create</a>
						            </li>
						        ) : ''}
					            <li className="nav-item pull-left">
					              <a className={"nav-link" + (this.state.currentSubNav === 'Edit' ? " active show" : "")} 
					              	 onClick={this.subNavClick.bind(this, 'Edit')} data-toggle="tab">Edit</a>
					            </li>
					        </div>
				        )}
			        </div>
		        </ul>

		        <br/>

				<div className="container-fluid">
					<div className="row">
			            <div className="col-2">
			            </div>

			            <div className="col-8">
			            	{!this.props.User.isLoggedIn ? (
				            	<div className={"tab-pane fade active show"}>
					              <p>You are not logged in! Please log in first to create and manage a deck.</p>
					            </div>
					        ) : (
					        	<div>
					        		{this.props.Deck.deckObject === null ?
					            		<CreateManager isActive={this.state.currentSubNav === 'Create'} />
					            	: ''}

					            	<div className={"tab-pane fade" + (this.state.currentSubNav === 'Edit' ? " active show" : "")}>
						              <p>blah</p>
						            </div>
						        </div>
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