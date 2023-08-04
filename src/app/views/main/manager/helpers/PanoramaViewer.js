// Libraries
import React from "react";
import classNames from 'classnames';
import { PANOLENS } from '../../../../utils/panolens';
import { toJS } from 'mobx';

// Images
import PlayingCardsIcon from '../../../../images/card-icons/playing-cards-white.png';
import Canvas150 from '../../../../images/canvas150x150.png';
import Canvas300 from '../../../../images/canvas300x260.png';

// Css
import './PanoramaViewer.css';

class PanoramaViewer extends React.Component {
	constructor(props) {
		super(props);

		for (let ref of ['panCont'])
			this[ref] = React.createRef();
	}

	populateInfoSpot = (infoPosition, elementToMount = null, imageType = 'default', eventListeners = {}) => {
		let imageTypes = {
			default: PlayingCardsIcon,
			c150: Canvas150,
			c300: Canvas300
		};
		let image = imageTypes[imageType];

		if (this.panorama && infoPosition !== null) {
			// Add Infospot
			let infospot = new PANOLENS.Infospot(800, image);
			infospot.position.set(parseInt(infoPosition.x), parseInt(infoPosition.y), parseInt(infoPosition.z));

			if (elementToMount === null) {
				// Create delete element
				elementToMount = document.createElement('button');
				elementToMount.className = "btn btn-danger btn-sm override-btn";
				elementToMount.textContent = 'Delete';

				eventListeners['click'] = this.depopulateInfoSpot(infospot);
				eventListeners['mouseover'] = () => {
					setTimeout(() => {
						infospot.element.className = "btn btn-danger btn-sm override-btn"; // animated fadeOut
					}, 500);
				};
			}

			// Mount the element
			infospot.addHoverElement(elementToMount, -30);

			// Add listeners after mounting because it's cloned internally
			for (let eventKey in eventListeners) {
				infospot.element.addEventListener(eventKey, eventListeners[eventKey]);
			}

			this.infospots.push(infospot);
			this.panorama.add(infospot);
			this.panorama.toggleInfospotVisibility(true);
		}
	}

	depopulateInfoSpot = (infospot) => () => {
		if (this.panorama) {
			let newInfospotObjs = [];
			for (let activeInfospot of this.infospots) {
				if (activeInfospot !== infospot) {
					let { x, y, z } = activeInfospot.position;
					newInfospotObjs.push({x: x, y: y, z: z});
				} else {
					activeInfospot.element.display = 'none';
					// Removed from this.infospots when the component updates
				}
			}

			// this.infospots updated when the component updates
			this.props.setGroupSpotImagePositions(newInfospotObjs);
		}
	}

	addInfoSpotAtClick = (event) => {
		if (this.viewer && this.panorama) {
			if (event.ctrlKey) {
				let clickedPos = this.viewer.getPosition();
				this.populateInfoSpot(clickedPos);
				this.props.addGroupSpotToImage(clickedPos);
			}
	    }
	}

	loadImage = (imageSrc) => {
		if (this.panorama)
			this.panorama.load(imageSrc);
	}

	createViewer(options) {
		this.viewer = new PANOLENS.Viewer(options);
	}

	createPano(imgSrc) {
		if (this.viewer) {
			this.panorama = new PANOLENS.ImagePanorama(imgSrc);
			this.viewer.add(this.panorama);
		}
	}

	createInfoSpots(infospots = []) {
		this.infospots = infospots;
	}

	componentDidUpdate(prevProps, prevState) {
		// TODO: Clean this up for modularity / remove or relocate
		// Handle first update
		if (!this.viewer) {
			this.createViewer({
				container: this.panCont.current,
				autoHideInfospot: false,
				controlBar: true
			});
		}

		if (!this.panorama && this.props.panoImgSrc) {
			this.createPano(this.props.panoImgSrc);
		}

		if (!this.infospots) {
			this.createInfoSpots();
		}

		// If provided, auto manage them on updates
		if (this.props.panoImgInfoSpots !== null || this.props.panoImgInfoSpotsAdvanced !== null) {
			// Remove any infospots from previous image
			for (let infospot of this.infospots) {
				this.panorama.remove(infospot);
			}
			this.infospots = [];

			// Add info spots
			if (this.props.panoImgInfoSpots) {
				for (let infoPosition of this.props.panoImgInfoSpots) {
					this.populateInfoSpot(infoPosition);
				}
			}

			// Add complex info spots
			if (this.props.panoImgInfoSpotsAdvanced) {
				for (let [infoPosition, element, imageType] of this.props.panoImgInfoSpotsAdvanced) {
					this.populateInfoSpot(infoPosition, element, imageType);
				}
			}
		}

		this.panorama.toggleInfospotVisibility(true);
		this.loadImage(this.props.panoImgSrc);
	}

	render() {
		let { addingEnabled } = this.props;

		let clickFunc = null;
		if (addingEnabled && addingEnabled === true) {
			clickFunc = this.addInfoSpotAtClick;
		}

		return(<>
			<div onClick={clickFunc} className="pan-cont" ref={this.panCont}/>
		</>);
	}
}

export default PanoramaViewer;
