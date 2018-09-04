// Libraries
import React from "react";
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import classNames from "classnames";

// Css
import './Manager.css';

@withRouter @inject((RootStore) => {
	return {
		User: RootStore.UserStore,
		Manager: RootStore.ManagerStore
	}
}) @observer
class MemPalaces extends React.Component {

	// defaults
	@observable currentPalaceName = 'default';
	@observable currentImageIndex = 0;

	// other

	constructor(props) {
		super(props);

		// Func Binds

		// Refs\
		this.memPalaceForm = React.createRef();
	}

	updateCurrentPalaceName(name) {
		this.currentPalaceName = name;
		this.currentImageIndex = 0;
	}

	updateCurrentImageIndex(index) {
		this.currentImageIndex = index;
	}

	render() {
		return(
			<div id="memory-palace-tab" className="tab-content">
				<div className={"tab-pane fade" + (this.props.isActive ? " active show" : "")}>

					{this.props.Manager.memPalacesObj !== null ? (
						<div className="container">
							<div className="row">
								<div className="col-md-2 col-horiz-reduce-pad">
									<div className="list-group">
										{Object.keys(this.props.Manager.memPalacesObj).map((key, index) => (
											<a key={index} className={"list-group-item list-group-item-action" + (key === this.currentPalaceName ? " active" : "")} onClick={this.updateCurrentPalaceName.bind(this, key)}>
												<span>{key[0].toUpperCase() + key.slice(1)}</span>
											</a>
										))}
									</div>
								</div>

								<div className="col-md-2 col-horiz-reduce-pad">
						            <div className="list-group list-group-nopad">
										{this.props.Manager.memPalacesObj[this.currentPalaceName].map((path, index) => (
											<a key={index} onClick={this.updateCurrentImageIndex.bind(this, index)} className={"list-group-item list-group-item-center list-group-item-action" + (this.currentImageIndex === index ? " active" : "")}>
												{path.slice(0, 10)}
											</a>
										))}
									</div>
								</div>

								<div className="col-md-8">
						            <div className="container">

							            <form ref={this.memPalaceForm}>
										</form>

						            </div>

								</div>
							</div>
						</div>
					) : ''}

				</div>
	        </div>
		);
	}
}

export default MemPalaces;