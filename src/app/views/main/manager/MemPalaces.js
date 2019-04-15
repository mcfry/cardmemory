// Libraries
import React from "react";
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';

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
		this.groupsInput = React.createRef();
	}

	addMemoryPalace() {
	}

	deleteMemoryPalace() {
	}

	addImage() {
	}

	deleteImage() {
	}

	updateCurrentPalaceName(name) {
		this.currentPalaceName = name;
		this.currentImageIndex = 0;
	}

	updateCurrentImageIndex(index) {
		this.currentImageIndex = index;
	}

	updateCurrentGroupInput() {
		if (this.groupsInput.current) {
			this.props.Manager.memPalacesObj[this.currentPalaceName].groups_to_image_array[this.currentImageIndex] = this.groupsInput.current.value;
		}
	}

	render() {
		return(
			<div id="memory-palace-tab" className="tab-content">
				<div className={"tab-pane fade" + (this.props.Manager.currentSubNav === 'Memory Palaces' ? " active show" : "")}>

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

									<div className="list-group">
									  <a className="list-group-item list-group-item-action" onClick={this.addMemoryPalace.bind(this)}>
									 	<i className="fa fa-plus"></i>&nbsp;<span className="align-suit-text">New Palace</span>
									  </a>
									  <a className="list-group-item list-group-item-action" onClick={this.deleteMemoryPalace.bind(this)}>
									 	<i className="fa fa-trash"></i>&nbsp;<span className="align-suit-text">Delete Palace</span>
									  </a>
									</div>
								</div>

								<div className="col-md-2 col-horiz-reduce-pad">
						            <div className="list-group list-group-nopad">
										{this.props.Manager.memPalacesObj[this.currentPalaceName].image_urls.map((path, index) => (
											<a key={index} onClick={this.updateCurrentImageIndex.bind(this, index)} className={"list-group-item list-group-item-center list-group-item-action" + (this.currentImageIndex === index ? " active" : "")}>
												Image {index}
											</a>
										))}
									</div>

									<div className="list-group">
									  <a className="list-group-item list-group-item-action" onClick={this.addImage.bind(this)}>
									 	<i className="fa fa-plus"></i>&nbsp;<span className="align-suit-text">New Image</span>
									  </a>
									  <a className="list-group-item list-group-item-action" onClick={this.deleteImage.bind(this)}>
									 	<i className="fa fa-trash"></i>&nbsp;<span className="align-suit-text">Delete Image</span>
									  </a>
									</div>
								</div>

								<div className="col-md-8">
						            <div className="container">

						            	<div className="row">
							            	<div className="col-md-8">
								            	<div className="form-group">
													<label htmlFor="groups-input">Number of spots you want to use in this image (info hover)</label>
													<input type="text" className="form-control col-md-1" id="groups-input" value={this.props.Manager.memPalacesObj[this.currentPalaceName].groups_to_image_array[this.currentImageIndex]} onChange={this.updateCurrentGroupInput.bind(this)} ref={this.groupsInput} />
												</div>
											</div>
							            </div>

							            <div className="row">
							            	<img className="img-fluid" alt="memory-palace" src={"http://0.0.0.0:3001/" + this.props.Manager.memPalacesObj[this.currentPalaceName].image_urls[this.currentImageIndex]}/>
						            	</div>

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