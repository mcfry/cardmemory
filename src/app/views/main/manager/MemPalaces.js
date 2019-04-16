// Libraries
import React from "react";
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';

// Css
import './Manager.css';

@withRouter @inject(RootStore => {
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

		// Refs
		for (let key of ['memPalaceForm', 'groupsInput'])
			this[key] = React.createRef();
	}

	addMemoryPalace = () => {
	}

	deleteMemoryPalace = () => {
	}

	addImage = () => {
	}

	deleteImage = () => {
	}

	updateCurrentPalaceName = (name) => () => {
		this.currentPalaceName = name;
		this.currentImageIndex = 0;
	}

	updateCurrentImageIndex = (index) => () => {
		this.currentImageIndex = index;
	}

	updateCurrentGroupInput = () => {
		if (this.groupsInput.current) {
			this.props.Manager.memPalacesObj[this.currentPalaceName].groups_to_image_array[this.currentImageIndex] = this.groupsInput.current.value;
		}
	}

	render() {
		const { Manager } = this.props;

		return(
			<div id="memory-palace-tab" className="tab-content">
				<div className={classNames("tab-pane", "fade", {"active show": Manager.currentSubNav === 'Memory Palaces'})}>

					{Manager.memPalacesObj !== null && <div className="container">
						<div className="row">
							<div className="col-md-2 col-horiz-reduce-pad">
								<div className="list-group">
									{Object.keys(Manager.memPalacesObj).map((key, index) => (
										<button key={index} className={"list-group-item list-group-item-action" + (key === this.currentPalaceName ? " active" : "")} 
											onClick={this.updateCurrentPalaceName(key)}>
											<span>{key[0].toUpperCase() + key.slice(1)}</span>
										</button>
									))}
								</div>

								<div className="list-group">
								  <button className="list-group-item list-group-item-action" onClick={this.addMemoryPalace}>
								 	<i className="fa fa-plus"></i>&nbsp;<span className="align-suit-text">New Palace</span>
								  </button>
								  <button className="list-group-item list-group-item-action" onClick={this.deleteMemoryPalace}>
								 	<i className="fa fa-trash"></i>&nbsp;<span className="align-suit-text">Delete Palace</span>
								  </button>
								</div>
							</div>

							<div className="col-md-2 col-horiz-reduce-pad">
					            <div className="list-group list-group-nopad">
									{Manager.memPalacesObj[this.currentPalaceName].image_urls.map((path, index) => (
										<button key={index} onClick={this.updateCurrentImageIndex(index)} 
											className={"list-group-item list-group-item-center list-group-item-action" + (this.currentImageIndex === index ? " active" : "")}>
											Image {index}
										</button>
									))}
								</div>

								<div className="list-group">
								  <button className="list-group-item list-group-item-action" onClick={this.addImage}>
								 	<i className="fa fa-plus"></i>&nbsp;<span className="align-suit-text">New Image</span>
								  </button>
								  <button className="list-group-item list-group-item-action" onClick={this.deleteImage}>
								 	<i className="fa fa-trash"></i>&nbsp;<span className="align-suit-text">Delete Image</span>
								  </button>
								</div>
							</div>

							<div className="col-md-8">
					            <div className="container">

					            	<div className="row">
						            	<div className="col-md-8">
							            	<div className="form-group">
												<label htmlFor="groups-input">Number of spots you want to use in this image (info hover)</label>
												<input type="text" className="form-control col-md-1" id="groups-input" 
													value={Manager.memPalacesObj[this.currentPalaceName].groups_to_image_array[this.currentImageIndex]} 
													onChange={this.updateCurrentGroupInput} ref={this.groupsInput} />
											</div>
										</div>
						            </div>

						            <div className="row">
						            	<img className="img-fluid" alt="memory-palace" 
						            		src={"http://0.0.0.0:3001/" + Manager.memPalacesObj[this.currentPalaceName].image_urls[this.currentImageIndex]}/>
					            	</div>

					            </div>

							</div>
						</div>
					</div>}

				</div>
	        </div>
		);
	}
}

export default MemPalaces;