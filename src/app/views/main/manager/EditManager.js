// Libraries
import React from "react";
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import classNames from "classnames";
import LZString from 'lz-string';

// Components
import Card from '../../basic_components/Card';
import SideSuit from './helpers/SideSuit';

// Images
import heartsImg from '../../../images/card-icons/hearts.png';
import heartsWhiteImg from '../../../images/card-icons/hearts-white.png';
import diamondsImg from '../../../images/card-icons/diamonds.png';
import diamondsWhiteImg from '../../../images/card-icons/diamonds-white.png';
import clubsImg from '../../../images/card-icons/clubs.png';
import clubsWhiteImg from '../../../images/card-icons/clubs-white.png';
import spadesImg from '../../../images/card-icons/spades.png';
import spadesWhiteImg from '../../../images/card-icons/spades-white.png';

// Css
import './Manager.css';
import 'animate.css/animate.min.css';

@withRouter @inject(RootStore => {
	return {
		Manager: RootStore.ManagerStore,
		Alert: RootStore.AlertStore
	}
}) @observer
class Manager extends React.Component {

	@observable currentSuit = 'hearts';
	@observable currentDenom = 'Ace';
	@observable cardAnimState = 'bounceInRight';
	@observable changeCardDisabled = false;

	constructor(props) {
		super(props);

		// defaults
		this.currentSuit = 'hearts';
		this.currentDenom = 'Ace';

		// refs
		for (let key of ['cardForm', 'cardElem', 'cardName', 'imageUrl', 'action1', 'action2', 'cardsUpload'])
			this[key] = React.createRef();

		// enum (14-2)
		const denoms = ['Ace', 'King', 'Queen', 'Jack', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
		this.denomsEnum = {};
		for (let i = 12; i >= 0; i--) {
			const denom = denoms[12-i];
			this.denomsEnum[this.denomsEnum[i+2] = denom] = i+2;
		}

		// enum (4-1)
		const suits = ['spades', 'clubs', 'diamonds', 'hearts'];
		this.suitsEnum = {};
		for (let i = 3; i >= 0; i--) {
			const suit = suits[3-i];
			this.suitsEnum[this.suitsEnum[i+1] = suit] = i+1;
		}
	}

	suitChange = (suit) => () => {
		if (this.changeCardDisabled === false && this.currentSuit !== suit) {
			this.updateCurrentImageData();
			this.setCurrentCard(suit, this.currentDenom);
		}
	}

	denomChange = (denom) => () => {
		if (this.changeCardDisabled === false && this.currentDenom !== denom) {
			this.updateCurrentImageData();
			this.setCurrentCard(this.currentSuit, denom);
		}
	}

	suitTheme = () => {
		return this.props.Manager.deckObject.deck_info[this.currentSuit];
	}

	colorTheme = () => {
		if (this.currentSuit === 'diamonds' || this.currentSuit === 'hearts') {
			return this.props.Manager.deckObject.deck_info['red'];
		} else {
			return this.props.Manager.deckObject.deck_info['black'];
		}
	}

	clearField = (fieldRef, fieldName) => () => {
		if (this.changeCardDisabled === false && fieldRef.current) {
			fieldRef.current.value = "";
			if (fieldName === 'cardImage') {
				this.clearImageData(true, false);
				this.updateCurrentImageData();
			} else if (fieldName === 'objectImage') {
				this.clearImageData(false, true);
				this.updateCurrentImageData();
			}
		}
	}

	clearImageData = (clearCard = true, clearObj = true) => {
		if (this.cardElem.current) {
			if (clearCard === true) this.cardElem.current.clearCardImage();
			if (clearObj === true) this.cardElem.current.clearObjectImage();
		}
	}

	updateCurrentImageData = () => {
		const suitNumeric = this.suitsEnum[this.currentSuit];
		const denomNumeric = this.denomsEnum[this.currentDenom];

		if (this.cardElem.current) {
			const imageData = this.cardElem.current.cardImageData();
			if (imageData !== null) {
				this.props.Manager.updateCard(suitNumeric, denomNumeric, {
					image_url: 	imageData.image_url,
					image_tx: 	imageData.image_tx,
					image_ty: 	imageData.image_ty,
					image_h: 	imageData.image_h === null ? null : imageData.image_h.slice(0,-2),
					image_w: 	imageData.image_w === null ? null : imageData.image_w.slice(0,-2)
				});
			}

			const objImageData = this.cardElem.current.objectImageData();
			if (objImageData !== null) {
				this.props.Manager.updateCard(suitNumeric, denomNumeric, {
					action2: 	objImageData.image_url,
					action2_tx: objImageData.image_tx,
					action2_ty: objImageData.image_ty,
					action2_h: 	objImageData.image_h === null ? null : objImageData.image_h.slice(0,-2),
					action2_w: 	objImageData.image_w === null ? null : objImageData.image_w.slice(0,-2)
				});
			}
		}
	}

	setCurrentCard(suit, denom, first=false) {
		if (first === false)
			this.cardAnimState = 'bounceOutLeft';

		this.changeCardDisabled = true;
		setTimeout(() => {
			const suitNumeric = this.suitsEnum[suit];
			const denomNumeric = this.denomsEnum[denom];
			if (this.props.Manager.deckObject.cards[suitNumeric] !== undefined) {
				if (this.props.Manager.deckObject.cards[suitNumeric][denomNumeric] !== undefined) {
					const cardObj = this.props.Manager.deckObject.cards[suitNumeric][denomNumeric];

					try {
						// Update uncontrolled components
						this.imageUrl.current.value = cardObj.image_url;
						this.cardName.current.value = cardObj.name;
						this.action1.current.value = cardObj.action1;
						this.action2.current.value = cardObj.action2;
					} catch(e) {
						// Not mounted because of page switching and timeout, will rerun
						// when switching back
					}
				} else {
					this.cardForm.current.reset();
				}
			} else {
				this.cardForm.current.reset();
			}

			if (first === false)
				this.clearImageData();

			this.currentSuit = suit;
			this.currentDenom = denom;
			this.cardAnimState = 'bounceInRight';

			// Delay this a bit, feels too fast
			setTimeout(() => {
				this.changeCardDisabled = false;
			}, 500);
		}, 400);
	}

	getCardSuitImage = () => {
		if (this.props.Manager.deckObject.deck_info.deck_type === 'light') {
			if (this.currentSuit === 'hearts') {
				return heartsImg;
			} else if (this.currentSuit === 'diamonds') {
				return diamondsImg;
			} else if (this.currentSuit === 'clubs') {
				return clubsImg;
			} else {
				return spadesImg;
			}
		} else {
			if (this.currentSuit === 'hearts') {
				return heartsWhiteImg;
			} else if (this.currentSuit === 'diamonds') {
				return diamondsWhiteImg;
			} else if (this.currentSuit === 'clubs') {
				return clubsWhiteImg;
			} else {
				return spadesWhiteImg;
			}
		}
	}

	editCard = (fieldType) => (event) => {
		function updateCurrentCard(fieldType, value) {
			const suitNumeric = this.suitsEnum[this.currentSuit];
			const denomNumeric = this.denomsEnum[this.currentDenom];

			// Last level doesn't need to be observable, just PO..
			this.props.Manager.deckObject.cards[suitNumeric][denomNumeric][fieldType] = value;
		}

		if (fieldType === 'name') {
			if (event.target.value.length < 15) {
				updateCurrentCard.call(this, fieldType, event.target.value);
			} else {
				updateCurrentCard.call(this, fieldType, event.target.value.substring(0, 15));
				this.cardName.current.value = event.target.value.substring(0, 15);
			}
		} else if (fieldType === 'action1') {
			if (event.target.value.length < 25) {
				updateCurrentCard.call(this, fieldType, event.target.value);
			} else {
				updateCurrentCard.call(this, fieldType, event.target.value.substring(0, 25));
			}
		} else if (fieldType === 'action2') { // Object Image
			updateCurrentCard.call(this, fieldType, event.target.value);
		} else if (fieldType === 'image_url') {
			updateCurrentCard.call(this, fieldType, event.target.value);
		} else {
			event.preventDefault();
		}
	}

	editCardKeyDown(ref, event) {
		ref.current.setAttribute('data-previousvalue', event.target.value);
	}

	updateCards = () => {
		this.updateCurrentImageData();
		this.props.Manager.updateCards();
	}

	exportCards = () => {
		this.props.Manager.exportCards();
	}

	uploadCards = () => {
		this.cardsUpload.current.click(); // Trigger event
	}

	componentDidMount() {
		let that = this;
		this.setCurrentCard(this.currentSuit, this.currentDenom, true);

		// Use HTML5 File Api for client-side upload
		function onChange(event) {
	        let reader = new FileReader();
		    reader.onload = (event) => {
		    	try {
			        let cards = JSON.parse(LZString.decompressFromUTF16(event.target.result));
			        that.props.Manager.uploadCards(cards);
			    } catch(e) {
			    	this.props.Alert.pushItem('alerts', {
						type: 'danger',
						message: "Invalid file. File must be a correctly formatted JSON file."
					});
			    }
		    };
	        reader.readAsText(event.target.files[0]);
	    }
	    this.cardsUpload.current.addEventListener('change', onChange);
	}

	render() {
		const { Manager } = this.props;
		const deckTypeClasses = classNames('card', 'mb-3', 'mx-auto', 'animated', 'card-animate', this.cardAnimState, { 
			'bg-light': Manager.deckObject.deck_info.deck_type === 'light',
			'bg-dark': Manager.deckObject.deck_info.deck_type === 'dark',
			'text-white': Manager.deckObject.deck_info.deck_type === 'dark'
		});

		const heartsActive = classNames('list-group-item', 'list-group-item-action', { active: this.currentSuit === 'hearts'});
		const diamondsActive = classNames('list-group-item', 'list-group-item-action', 'diamond-list-group', { active: this.currentSuit === 'diamonds'});
		const clubsActive = classNames('list-group-item', 'list-group-item-action', { active: this.currentSuit === 'clubs'});
		const spadesActive = classNames('list-group-item', 'list-group-item-action', { active: this.currentSuit === 'spades'});

		const suitNumeric = this.suitsEnum[this.currentSuit];
		const denomNumeric = this.denomsEnum[this.currentDenom];
		const denoms = ['Ace', 'King', 'Queen', 'Jack', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
		const cardObj = this.props.Manager.deckObject.cards[suitNumeric][denomNumeric];

		// Use the full object dereference in jsx, mobx tracks by access, not value..
		// this.props.Manager.deckObject.cards[suitNumeric][denomNumeric]

		// TODO: Factor out form

		return(
			<div id="edit-deck-tab" className="tab-content">
				<div className={classNames("tab-pane", "fade", {"active show": Manager.currentSubNav === 'Edit Deck'})}>

					<div className="container">
						<div className="row">
							<div className="col-md-2 col-horiz-reduce-pad">
					            <div className="list-group">
								  <SideSuit klasses={heartsActive} suit={'hearts'} suitClick={this.suitChange('hearts')} blackImg={heartsImg} whiteImg={heartsWhiteImg}/>
								  <SideSuit klasses={diamondsActive} suit={'diamonds'} suitClick={this.suitChange('diamonds')} blackImg={diamondsImg} whiteImg={diamondsWhiteImg}/>
								  <SideSuit klasses={clubsActive} suit={'clubs'} suitClick={this.suitChange('clubs')} blackImg={clubsImg} whiteImg={clubsWhiteImg}/>
								  <SideSuit klasses={spadesActive} suit={'spades'} suitClick={this.suitChange('spades')} blackImg={spadesImg} whiteImg={spadesWhiteImg}/>
								</div>
								<div className="list-group">
								  <a className="list-group-item list-group-item-action" onClick={this.updateCards}>
								 	<i className="fa fa-save"></i>&nbsp;<span className="align-suit-text">Save Changes</span>
								  </a>
								  <a className="list-group-item list-group-item-action" onClick={this.exportCards}>
								 	<i className="fa fa-download"></i>&nbsp;<span className="align-suit-text">Download Deck</span>
								  </a>
								  <a className="list-group-item list-group-item-action" onClick={this.uploadCards}>
								 	<i className="fa fa-upload"></i>&nbsp;<span className="align-suit-text">Upload Deck</span><input ref={this.cardsUpload} type="file" hidden/>
								  </a>
								</div>
							</div>

							<div className="col-md-2 col-horiz-reduce-pad">
					            <div className="list-group list-group-nopad">
					              {denoms.map((denom, index) => (
					              	<a key={index} onClick={this.denomChange(denom)}
					              		className={classNames("list-group-item", "list-group-item-center", "list-group-item-action", {"active": this.currentDenom === denom})}
					              	>
									    {denom}
									</a>
					              ))}
								</div>
							</div>

							<div className="col-md-8">
					            <div className="container">

						            <form ref={this.cardForm}>
						            	<div className="row">
						            		<div className="col-md-6">
								            	<div className="form-group">
													<label htmlFor="cardname-input">Card Name (Theme: {`${this.suitTheme()} ${this.colorTheme()}`})</label>
													<input type="text" className="form-control" id="cardname-input" onChange={this.editCard('name')} placeholder="Card name" ref={this.cardName}/>
												</div>
												<div className="form-group">
													<label htmlFor="action1-input">Action</label>
													<input type="text" className="form-control" id="action1-input" onChange={this.editCard('action1')} placeholder="Action name" ref={this.action1}/>
												</div>
											</div>

											<div className="col-md-6">
								            	<div className="form-group">
													<label htmlFor="image-url-input">Card Image URL</label>
													<div className="row">
														<div className="col-md-11">
															<input type="text" className="form-control" id="image-url-input" onChange={this.editCard('image_url')} placeholder="URL" ref={this.imageUrl}/>
														</div>
														<div className="col-md-1">
															{(cardObj.image_url !== null && cardObj.image_url.length > 0) && 
																<i className="fa fa-times field-close-btn" onClick={this.clearField(this.imageUrl, 'cardImage')}></i>
															}
														</div>
													</div>
												</div>
												<div className="form-group">
													<label htmlFor="action2-input">Object Image URL</label>
													<div className="row">
														<div className="col-md-11">
															<input type="text" className="form-control" id="action2-input" onChange={this.editCard('action2')} placeholder="Action name" ref={this.action2}/>
														</div>
														<div className="col-md-1">
															{(cardObj.action2 !== null && cardObj.action2.length > 0) &&
																<i className="fa fa-times field-close-btn" onClick={this.clearField(this.action2, 'objectImage')}></i>
															}
														</div>
													</div>
												</div>
											</div>
										</div>
									</form>

									<br/>

									<div className="container">
										<Card klasses={deckTypeClasses} ref={this.cardElem}
											cardDenom={this.currentDenom}
											cardSuitImg={this.getCardSuitImage()}
											cardImgAlt=""
											cardTitle={Manager.deckObject.cards[suitNumeric][denomNumeric].name}
											cardImg={Manager.deckObject.cards[suitNumeric][denomNumeric].image_url}
											cardImgTx={Manager.deckObject.cards[suitNumeric][denomNumeric].image_tx}
											cardImgTy={Manager.deckObject.cards[suitNumeric][denomNumeric].image_ty}
											cardImgH={Manager.deckObject.cards[suitNumeric][denomNumeric].image_h}
											cardImgW={Manager.deckObject.cards[suitNumeric][denomNumeric].image_w}
											action1={Manager.deckObject.cards[suitNumeric][denomNumeric].action1}
											action2={Manager.deckObject.cards[suitNumeric][denomNumeric].action2}
											objectImgTx={Manager.deckObject.cards[suitNumeric][denomNumeric].action2_tx}
											objectImgTy={Manager.deckObject.cards[suitNumeric][denomNumeric].action2_ty}
											objectImgH={Manager.deckObject.cards[suitNumeric][denomNumeric].action2_h}
											objectImgW={Manager.deckObject.cards[suitNumeric][denomNumeric].action2_w}
										/>
									</div>

					            </div>

							</div>
						</div>
					</div>

				</div>
	        </div>
		);
	}
}

export default Manager;