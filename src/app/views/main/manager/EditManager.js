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
	constructor(props) {
		super(props);

		// defaults
		this.currentSuit = 'hearts';
		this.currentDenom = 'Ace';

		// refs
		this.cardForm = React.createRef();
		this.cardName = React.createRef();
		this.imageUrl = React.createRef();
		this.action1 = React.createRef();
		this.action2 = React.createRef();

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

	suitChange(suit) {
		this.setCurrentCard(suit, this.currentDenom);
	}

	denomChange(denom) {
		this.setCurrentCard(this.currentSuit, denom);
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

	editCard() {
		const suitNumeric = this.suitsEnum[this.currentSuit];
		const denomNumeric = this.denomsEnum[this.currentDenom];

		// Last level doesn't need to be observable, just PO..
		this.props.Manager.deckObject.cards[suitNumeric][denomNumeric] = {
			image_url: this.imageUrl.current.value,
		    name: this.cardName.current.value,
		    action1: this.action1.current.value,
		    action2: this.action2.current.value
		};
	}

	updateCards() {
		this.props.Manager.updateCards();
	}

	componentDidMount() {
		this.setCurrentCard(this.currentSuit, this.currentDenom);
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

		// Use the full object dereference in jsx, mobx tracks by access, not value..
		// this.props.Manager.deckObject.cards[suitNumeric][denomNumeric]

		return(
			<div id="edit-deck-tab" className="tab-content">
				<div className={"tab-pane fade" + (this.props.isActive ? " active show" : "")}>

					<div className="container">
						<div className="row">
							<div className="col-md-2 col-horiz-reduce-pad">
					            <div className="list-group">
								  <a className={heartsActive} onClick={this.suitChange.bind(this, 'hearts')}>
								  	{this.currentSuit !== 'hearts' ? (
								    	<img className="card-nav-suit" alt="hearts" src={heartsImg}/>
								    ) : (
								    	<img className="card-nav-suit" alt="hearts" src={heartsWhiteImg}/>
									)}
								    &nbsp;<span>Hearts</span>
								  </a>
								  <a className={diamondsActive} onClick={this.suitChange.bind(this, 'diamonds')}>
								  	{this.currentSuit !== 'diamonds' ? (
								 		<img className="card-nav-suit" alt="diamonds" src={diamondsImg}/>
								 	) : (
								 		<img className="card-nav-suit" alt="diamonds" src={diamondsWhiteImg}/>
								 	)}
								 	&nbsp;<span className="align-suit-text">Diamonds</span>
								  </a>
								  <a className={clubsActive} onClick={this.suitChange.bind(this, 'clubs')}>
								  	{this.currentSuit !== 'clubs' ? (
								 		<img className="card-nav-suit" alt="clubs" src={clubsImg}/>
								 	) : (
								 		<img className="card-nav-suit" alt="clubs" src={clubsWhiteImg}/>
								 	)}
								 	&nbsp;<span>Clubs</span>
								  </a>
								  <a className={spadesActive} onClick={this.suitChange.bind(this, 'spades')}>
								  	{this.currentSuit !== 'spades' ? (
								 		<img className="card-nav-suit" alt="spades" src={spadesImg}/>
								 	) : (
								 		<img className="card-nav-suit" alt="spades" src={spadesWhiteImg}/>
								 	)}
								 	&nbsp;<span className="align-suit-text">Spades</span>
								  </a>
								  <a className="list-group-item list-group-item-action" onClick={this.updateCards.bind(this)}>
								 	<i className="fa fa-save"></i>&nbsp;<span className="align-suit-text">Save Deck</span>
								  </a>
								</div>
							</div>

							<div className="col-md-2 col-horiz-reduce-pad">
					            <div className="list-group list-group-nopad">
					              {denoms.map((denom, index) => (
					              	<a key={index} onClick={this.denomChange.bind(this, denom)} className={"list-group-item list-group-item-center list-group-item-action " + (this.currentDenom === denom ? 'active' : '')}>
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
													<label htmlFor="username-input">Card name</label>
													<input type="text" className="form-control" id="cardname-input" onChange={this.editCard.bind(this)} placeholder="Card name" ref={this.cardName}/>
												</div>
												<div className="form-group">
													<label htmlFor="username-input">Action1</label>
													<input type="text" className="form-control" id="action1-input" onChange={this.editCard.bind(this)} placeholder="Action name" ref={this.action1}/>
												</div>
											</div>

											<div className="col-md-6">
								            	<div className="form-group">
													<label htmlFor="username-input">Image URL</label>
													<input type="text" className="form-control" id="image-url-input" onChange={this.editCard.bind(this)} placeholder="URL" ref={this.imageUrl}/>
												</div>
												<div className="form-group">
													<label htmlFor="username-input">Action2</label>
													<input type="text" className="form-control" id="action2-input" onChange={this.editCard.bind(this)} placeholder="Action name" ref={this.action2}/>
												</div>
											</div>
										</div>
									</form>

									<br/>

									<div className="container">
										<Card klasses={deckTypeClasses} cardDenom={this.currentDenom}
										  cardSuitImg={this.getCardSuitImage()} cardImgAlt=""
										  cardTitle={this.props.Manager.deckObject.cards[suitNumeric][denomNumeric].name}
										  cardImg={this.props.Manager.deckObject.cards[suitNumeric][denomNumeric].image_url}
										  cardName={this.props.Manager.deckObject.cards[suitNumeric][denomNumeric].name}
										  action1={this.props.Manager.deckObject.cards[suitNumeric][denomNumeric].action1}
										  action2={this.props.Manager.deckObject.cards[suitNumeric][denomNumeric].action2} />
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