// Libraries
import React from "react";
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { toJS } from 'mobx';

// Components
import PanoramaViewer from './helpers/PanoramaViewer';

// Css
import './Manager.css';
import 'animate.css/animate.min.css';

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

	saveMemoryPalace = () => {
		this.props.Manager.updateMemoryPalace(this.currentPalaceName);
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

	addGroupSpotToImage = (position) => {
		this.props.Manager.memPalacesObj[this.currentPalaceName].groups_to_image_array[this.currentImageIndex].push({x: position.x, y: position.y, z: position.z});
	}

	setGroupSpotImagePositions = (positions) => {
		this.props.Manager.memPalacesObj[this.currentPalaceName].groups_to_image_array[this.currentImageIndex] = positions;
	}

	getSpotsLeft = () => {
		const { memPalacesObj } = this.props.Manager;

		let valid = true; // flag to insure no zero-value entries
		let total = 0;
		if (memPalacesObj && this.currentPalaceName) {
			let currentPalaceImgGroup = memPalacesObj[this.currentPalaceName].groups_to_image_array;
			let i = 0; while (total !== 52 && i < currentPalaceImgGroup.length) {
				if (currentPalaceImgGroup[i].length === 0) {
					valid = false;
				} else {
					total += currentPalaceImgGroup[i].length;
				}

				i += 1;
			}
		}

		return {
			total: total,
			valid: valid
		};
	}

	render() {
		const { Manager } = this.props;
		const spotsLeftObj = this.getSpotsLeft();

		// Each spot can hold 3 cards (person-action-object)
		const cardsLeft = 52-(spotsLeftObj.total*3);
		const spotsLeft = parseInt(cardsLeft/3) + (cardsLeft%3 === 0 ? 0 : 1);

		// FIX DECK NOT LOADED IF PAGE REFRESHED
		//console.log(Manager.memPalacesObj[this.currentPalaceName].image_urls[this.currentImageIndex]);

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
								  <button className="list-group-item list-group-item-action" onClick={this.saveMemoryPalace}>
								 	<i className="fa fa-save"></i>&nbsp;<span className="align-suit-text">Save Palace</span>
								  </button>
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
						            		<div style={{'display': 'block'}}>
						            			Spots Left: {spotsLeft} (INFO HERE)<br/>
						            			Hold Ctrl and click on a spot in the image to add a location
						            		</div>
										</div>
						            </div>

						            <div className="row">
						            	<PanoramaViewer 
						            		panoImgSrc={"http://0.0.0.0:3001" + Manager.memPalacesObj[this.currentPalaceName].image_urls[this.currentImageIndex]}
						            		panoImgInfoSpots={Manager.memPalacesObj[this.currentPalaceName].groups_to_image_array[this.currentImageIndex]}
						            		addGroupSpotToImage={this.addGroupSpotToImage} setGroupSpotImagePositions={this.setGroupSpotImagePositions}
						            	/>
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