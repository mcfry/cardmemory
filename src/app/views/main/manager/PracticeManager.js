// Libraries
import React from "react";
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import classNames from "classnames";

// Components
import Card from '../../basic_components/Card';

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

@withRouter @inject((RootStore) => {
	return {
		Manager: RootStore.ManagerStore
	}
}) @observer
class Manager extends React.Component {
	@observable currentSuit = 'hearts';
	@observable currentDenom = 'Ace';
	@observable cardAnimState = 'bounceInRight';
	@observable inProgress = false;
	constructor(props) {
		super(props);

		// defaults
		this.currentSuit = 'hearts';
		this.currentDenom = 'Ace';

		// refs
		this.selectNumber = React.createRef();

		// funcs
		this.getCardSuitImage.bind(this);

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

	setCurrentCard(suit, denom) {
		this.cardAnimState = 'bounceOutLeft';
		setTimeout(() => {
			const suitNumeric = this.suitsEnum[suit];
			const denomNumeric = this.denomsEnum[denom];
			if (this.props.Manager.deckObject.cards[suitNumeric] !== undefined) {
				if (this.props.Manager.deckObject.cards[suitNumeric][denomNumeric] !== undefined) {
					const cardObj = this.props.Manager.deckObject.cards[suitNumeric][denomNumeric];

					this.imageUrl.current.value = cardObj.image_url;
					this.cardName.current.value = cardObj.name;
					this.action1.current.value = cardObj.action1;
					this.action2.current.value = cardObj.action2;
				} else {
					this.cardForm.current.reset();
				}
			} else {
				this.cardForm.current.reset();
			}

			this.currentSuit = suit;
			this.currentDenom = denom;
			this.cardAnimState = 'bounceInRight';
		}, 400);
	}

	getCardSuitImage() {
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

	getCardsFinished() {
		let cardsFinished = [];

		for (let suit in this.props.Manager.deckObject.cards) {
			for (let denom in this.props.Manager.deckObject.cards[suit]) {
				const denom_obj = this.props.Manager.deckObject.cards[suit][denom];

				if ([denom_obj.name, denom_obj.image_url, denom_obj.action1, denom_obj.action2].every((value) => 
					!String.isEmpty(value)
				)) {
					cardsFinished.push(denom_obj);
				}
			}
		}

		return cardsFinished;
	}

	startPractice() {
		const cardNumber = parseInt(this.selectNumber.current.value);
		if (cardNumber === 0) {
			sessionStorage.pushItem('alerts', {
				type: 'error',
				message: "You must select a number of cards to practice first!"
			});
		} else {
			this.inProgress = true;
		}
	}

	curr(ref) {
		if (ref.current) {
			return ref.current.value;
		} else {
			return 0;
		}
	}

	componentDidMount() {
		//this.setCurrentCard(this.currentSuit, this.currentDenom);
	}

	render() {
		const deckTypeClasses = classNames('card', 'mb-3', 'mx-auto', 'animated', 'card-animate', this.cardAnimState, { 
			'bg-light': this.props.Manager.deckObject.deck_info.deck_type === 'light',
			'bg-dark': this.props.Manager.deckObject.deck_info.deck_type === 'dark',
			'text-white': this.props.Manager.deckObject.deck_info.deck_type === 'dark'
		});

		const heartsActive = classNames('list-group-item', 'list-group-item-action', { active: this.currentSuit === 'hearts'});
		const diamondsActive = classNames('list-group-item', 'list-group-item-action', 'diamond-list-group', { active: this.currentSuit === 'diamonds'});
		const clubsActive = classNames('list-group-item', 'list-group-item-action', { active: this.currentSuit === 'clubs'});
		const spadesActive = classNames('list-group-item', 'list-group-item-action', { active: this.currentSuit === 'spades'});

		const suitNumeric = this.suitsEnum[this.currentSuit];
		const denomNumeric = this.denomsEnum[this.currentDenom];
		const denoms = ['Ace', 'King', 'Queen', 'Jack', '10', '9', '8', '7', '6', '5', '4', '3', '2'];

		const cardsFinished = this.getCardsFinished();

		// Use the full object dereference in jsx, mobx tracks by access, not value..
		// this.props.Manager.deckObject.cards[suitNumeric][denomNumeric]

		return(
			<div id="edit-deck-tab" className="tab-content">
				<div className={"tab-pane fade" + (this.props.isActive ? " active show" : "")}>

					<div className="container">
						<div className="row">
							{!this.inProgress ? (
								<div className="mx-auto">
									<br/><br/>

									<div className="form-group">
									    <select className="custom-select" ref={this.selectNumber}>
									      <option value="0" disabled selected>Number to memorize</option>
									      {[13,26,39,52].map((number, index) => {
									      	return (cardsFinished.length >= number ? <option key={index} value={`"${number}"`}>{number}</option> : '')
									      })}
									    </select>
									</div>

									<br/>

									<button type="button" onClick={this.startPractice.bind(this)} className="btn btn-primary btn-danger practice-button-start">Go!</button>
								</div>
							) : (
								<React.Fragment>
									<div className="container">
										<div className="kitchen-mem-palace mx-auto">
											{Array.apply(null, 
												Array(this.curr(this.selectNumber) >= 26 ? 26 : 13)
											).map((_, card_number) => {
												return (
													<div key={card_number} className={"card mini-card mb-3 background-card kitchen" + card_number}>
														<span className={card_number+1 > 9 ? "mini-card-text-double" : "mini-card-text-single"}>
															<b>{card_number+1}</b>
														</span>
													</div>
												)
											})}
										</div>
									</div>

									{this.curr(this.selectNumber) > 26 ? (
										<div className="container">
											<div className="living-room-mem-palace mx-auto">
												{Array.apply(null, 
													Array(this.curr(this.selectNumber) > 39 ? 26 : 13)
												).map((_, card_number) => {
													return (
														<div key={card_number+26} className={"card mini-card mb-3 background-card living" + (card_number+26)}>
															<span className="mini-card-text-double">
																<b>{card_number+27}</b>
															</span>
														</div>
													)
												})}
											</div>
										</div>
									) : ''}
								</React.Fragment>
							)}
						</div>
					</div>

				</div>
	        </div>
		);
	}
}

export default Manager;