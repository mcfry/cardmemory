// Libraries
import React from "react";
import classNames from 'classnames';
import { PANOLENS } from '../../../../utils/panolens';
import { toJS } from 'mobx';

// Images
import PlayingCardsIcon from '../../../../images/card-icons/playing-cards-white.png';
import Canvas150 from '../../../../images/canvas150x150.png';

// Css
import './PanoramaViewer.css';

class PanoramaViewer extends React.Component {
	constructor(props) {
		super(props);

		for (let ref of ['panCont'])
			this[ref] = React.createRef();
	}

	populateInfoSpot(infoPosition, image=PlayingCardsIcon) {
		if (this.panorama) {
			// Add Infospot
			let infospot = new PANOLENS.Infospot(800, image);
			infospot.position.set(parseInt(infoPosition.x), parseInt(infoPosition.y), parseInt(infoPosition.z));

			// Create delete element and add listener
			let deleteButton = document.createElement('button');
			deleteButton.className = "btn btn-danger btn-sm override-btn";
			deleteButton.textContent = 'Delete';
			infospot.addHoverElement(deleteButton, -30);
			infospot.element.addEventListener('click', this.depopulateInfoSpot(infospot)); // add after because it's cloned internally
			infospot.element.addEventListener('mouseover', () => {
				setTimeout(() => {
					infospot.element.className = "btn btn-danger btn-sm override-btn"; // animated fadeOut
				}, 500);
			});

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

	componentDidUpdate(prevProps, prevState) {
		// Handle first update
		if (!this.viewer) {
			this.viewer = new PANOLENS.Viewer({ 
				container: this.panCont.current,
				autoHideInfoSpot: false,
				controlBar: true
			});
		}
		if (!this.panorama && this.props.panoImgSrc) {
			this.panorama = new PANOLENS.ImagePanorama(this.props.panoImgSrc);
			this.viewer.add(this.panorama);
		}
		if (!this.infospots) {
			this.infospots = [];
		}

		// Remove any infospots from previous image
		for (let infospot of this.infospots) {
			this.panorama.remove(infospot);
		}
		this.panorama.toggleInfospotVisibility(true);
		this.infospots = [];

		// Add info spots from deck object
		for (let infoPosition of this.props.panoImgInfoSpots) {
			this.populateInfoSpot(infoPosition, Canvas150);
		}

		if (this.panorama)
			this.panorama.load(this.props.panoImgSrc);
	}

	render() {
		return(<>
			<div onClick={this.addInfoSpotAtClick} className="pan-cont" ref={this.panCont}/>
		</>);
	}
}

export default PanoramaViewer;