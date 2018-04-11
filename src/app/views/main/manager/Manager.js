// Libraries
import React from "react";

// Components
import CreateManager from './CreateManager.js';

// Css
import './Manager.css';

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
			            <li className="nav-item pull-left">
			              <a className={"nav-link" + (this.state.currentSubNav === 'Create' ? " active show" : "")} 
			              	 onClick={this.subNavClick.bind(this, 'Create')} data-toggle="tab">Create</a>
			            </li>

			            <li className="nav-item pull-left">
			              <a className={"nav-link" + (this.state.currentSubNav === 'Edit' ? " active show" : "")} 
			              	 onClick={this.subNavClick.bind(this, 'Edit')} data-toggle="tab">Edit</a>
			            </li>
			        </div>
		        </ul>

		        <br/>

				<div className="container-fluid">
					<div className="row">
			            <div className="col-2">
			            </div>

			            <div className="col-8">
			            	<CreateManager isActive={this.state.currentSubNav === 'Create'} />
			            	<div className={"tab-pane fade" + (this.state.currentSubNav === 'Edit' ? " active show" : "")} id="profile">
				              <p>Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit.</p>
				            </div>
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