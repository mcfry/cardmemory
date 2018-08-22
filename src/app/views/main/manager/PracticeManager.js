// Libraries
import React from "react";
import { observable } from "mobx";
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router-dom";
import classNames from "classnames";
import levenshtein from "levenshtein-edit-distance";

// Components
import Card from '../../basic_components/Card';
import Timer from '../../basic_components/Timer';

// Images
import heartsImg from '../../../images/card-icons/hearts.png';
import heartsWhiteImg from '../../../images/card-icons/hearts-white.png';
import diamondsImg from '../../../images/card-icons/diamonds.png';
import diamondsWhiteImg from '../../../images/card-icons/diamonds-white.png';
import clubsImg from '../../../images/card-icons/clubs.png';
import clubsWhiteImg from '../../../images/card-icons/clubs-white.png';
import spadesImg from '../../../images/card-icons/spades.png';
import spadesWhiteImg from '../../../images/card-icons/spades-white.png';
import redBackImg from '../../../images/red-back.png';
import whiteBackImg from '../../../images/white-back.png';

// Css
import './Manager.css';
import './MemPalace.css';
import 'animate.css/animate.min.css';

@withRouter @inject((RootStore) => {
	return {
		Manager: RootStore.ManagerStore,
		Alert: RootStore.AlertStore
	}
}) @observer
class Manager extends React.Component {

	@observable cardAnimState = 'bounceInRight';
	@observable cardBackAnimState = 'hide';
	@observable inputAnimClasses = 'd-none';
	@observable nextButtonDisabled = false;
	@observable inProgressState = 0;
	@observable cardsFinished = {};
	@observable practiceDeck = null;
	@observable currentStep = 1;
	@observable currentMemStep = 1;
	@observable currentCard = {};
	@observable currentMistakes = 0;
	@observable currentMode = 0;
	@observable currentMethod = 0;
	@observable activeCardNumber = 0;

	constructor(props) {
		super(props);

		// refs
		this.selectMode = React.createRef();
		this.selectNumber = React.createRef();
		this.selectMethod = React.createRef();
		this.selectDenom = React.createRef();
		this.selectSuit = React.createRef();
		this.memTimer = React.createRef();
		this.recallTimer = React.createRef();
		this.cardName = React.createRef();

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

	setCurrentCardAndAnimate(beforeAnim, afterAnim, newIsCardBack, custom_delay, callback) {
		beforeAnim = beforeAnim || '';
		afterAnim = afterAnim || '';
		newIsCardBack = newIsCardBack || false;
		let delay = newIsCardBack ? 500 : 400;
		delay = custom_delay || delay;

		this.cardAnimState = beforeAnim;
		setTimeout(() => {
			this.currentCard = this.practiceDeck[this.currentStep-1];
			if (newIsCardBack) {
				this.cardAnimState = 'hide';
				this.cardBackAnimState = afterAnim;
				if (typeof callback === 'function') {
					callback();
				}
			} else {
				this.cardAnimState = afterAnim;
			}
		}, delay);
	}

	getCardSuitImage() {
		if (this.props.Manager.deckObject.deck_info.deck_type === 'light') {
			if (this.currentCard.suit === 'hearts') {
				return heartsImg;
			} else if (this.currentCard.suit === 'diamonds') {
				return diamondsImg;
			} else if (this.currentCard.suit === 'clubs') {
				return clubsImg;
			} else {
				return spadesImg;
			}
		} else {
			if (this.currentCard.suit === 'hearts') {
				return heartsWhiteImg;
			} else if (this.currentCard.suit === 'diamonds') {
				return diamondsWhiteImg;
			} else if (this.currentCard.suit === 'clubs') {
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
					denom_obj.suit = this.suitsEnum[suit];
					denom_obj.denom = this.denomsEnum[denom];

					cardsFinished.push(denom_obj);
				}
			}
		}

		this.cardsFinished = cardsFinished;
	}

	nextCard() {
		if (this.nextButtonDisabled) {
			return;
		}

		// Clicked Next
		if (this.currentStep < this.activeCardNumber) {
			if (this.inProgressState === 1) {
				this.currentStep += 1;
				this.nextButtonDisabled = true;
				this.setCurrentCardAndAnimate('bounceOutLeft', 'bounceInRight');
				setTimeout(() => {
					this.nextButtonDisabled = false;
				}, 1000);
				this.currentMemStep = this.currentStep;
			} else if (this.inProgressState === 3) {
				if (this.currentMode === 'Flash Cards') {
					if (this.cardName.current && !String.isEmpty(this.cardName.current.value)) {
						if (levenshtein(this.practiceDeck[this.currentStep-1].name, this.cardName.current.value) <= 2) {
							this.currentStep += 1;
							this.nextButtonDisabled = true;
							this.setCurrentCardAndAnimate('bounceOutLeft', 'bounceInRight');
							setTimeout(() => {
								this.nextButtonDisabled = false;
							}, 1000);
						} else {
							this.processIncorrect();
						}
					} else {
						this.processIncorrect();
					}
				} else if (this.currentMethod === 'Card Name') {
					if (this.cardName.current && !String.isEmpty(this.cardName.current.value)) {
						if (levenshtein(this.practiceDeck[this.currentStep-1].name, this.cardName.current.value) <= 2) {
							// Hide card back
							this.cardBackAnimState = 'flipOutY';
							this.cardAnimState = 'hide';
							this.nextButtonDisabled = true;

							setTimeout(() => {
								// Reveal correct guess
								this.cardBackAnimState = 'hide';
								this.cardAnimState = 'flipInY';

								setTimeout(() => {
									// Get next card
									this.currentStep += 1;
									this.cardName.current.value = "";
									this.cardName.current.focus();
									this.setCurrentCardAndAnimate('bounceOutLeft', 'bounceInRight', true);

									setTimeout(() => {
										this.nextButtonDisabled = false;
									}, 500);
								}, 1100);
							}, 500);
						} else {
							this.processIncorrect();
						}
					} else {
						this.processIncorrect();
					}
				} else {
					if (this.selectSuit.current && parseInt(this.selectSuit.current.value, 10) !== 0 && 
						this.selectDenom.current && parseInt(this.selectDenom.current.value, 10) !== 0) {
						
						if (this.practiceDeck[this.currentStep-1].card_number === this.denomsEnum[this.selectDenom.current.value] && 
							this.practiceDeck[this.currentStep-1].suit === this.selectSuit.current.value.toLowerCase()) {

							// Hide card back
							this.cardBackAnimState = 'flipOutY';
							this.cardAnimState = 'hide';
							this.nextButtonDisabled = true;

							setTimeout(() => {
								// Reveal correct guess
								this.cardBackAnimState = 'hide';
								this.cardAnimState = 'flipInY';

								setTimeout(() => {
									// Get next card
									this.currentStep += 1;
									this.selectSuit.current.value = "0";
									this.selectDenom.current.value = "0";
									this.setCurrentCardAndAnimate('bounceOutLeft', 'bounceInRight', true);

									setTimeout(() => {
										this.nextButtonDisabled = false;
									}, 500);
								}, 1100);
							}, 500);
						} else {
							this.processIncorrect();
						}
					} else {
						this.processIncorrect();
					}
				}
			}
		// Clicked Finish
		} else {
			// Mark end as one step after final count
			if (this.inProgressState === 1) {
				this.currentMemStep = this.activeCardNumber + 1;
				this.memTimer.current.stopTimer();

				// Start recall transition
				this.inProgressState = 2;
			} else if (this.currentMode === 'Flash Cards') {
				if (this.cardName.current && !String.isEmpty(this.cardName.current.value)) {
					if (levenshtein(this.practiceDeck[this.currentStep-1].name, this.cardName.current.value) <= 2) {
						this.inProgressState = 4;
						this.memTimer.current.stopTimer();
					} else {
						this.processIncorrect();
					}
				}
			} else if (this.inProgressState === 3) {
				if (this.cardName.current && !String.isEmpty(this.cardName.current.value)) {
					if (levenshtein(this.practiceDeck[this.currentStep-1].name, this.cardName.current.value) <= 2) {
						this.recallTimer.current.stopTimer();
						this.props.Manager.sendTime({
							difficulty: this.difficulty(parseInt(this.selectNumber.current.value, 10)),
							seconds: this.memTimer.current.state.counter + this.recallTimer.current.state.counter,
							mistakes: this.currentMistakes
						});

						this.inProgressState = 4;
					} else {
						this.processIncorrect();
					}
				} else if (this.selectSuit.current && parseInt(this.selectSuit.current.value, 10) !== 0 && 
					this.selectDenom.current && parseInt(this.selectDenom.current.value, 10) !== 0) {
					
					if (this.practiceDeck[this.currentStep-1].card_number === this.denomsEnum[this.selectDenom.current.value] && 
						this.practiceDeck[this.currentStep-1].suit === this.selectSuit.current.value.toLowerCase()) {

						this.recallTimer.current.stopTimer();
						this.props.Manager.sendTime({
							difficulty: this.difficulty(parseInt(this.selectNumber.current.value, 10)),
							seconds: this.memTimer.current.state.counter + this.recallTimer.current.state.counter,
							mistakes: this.currentMistakes
						});

						this.inProgressState = 4;
					} else {
						this.processIncorrect();
					}
				} else {
					this.processIncorrect();
				}
			}
		}
	}

	skipCard() {
		if (this.nextButtonDisabled) {
			return;
		} else {
			if (this.currentStep < this.activeCardNumber) {
				this.currentStep += 1;
				this.nextButtonDisabled = true;
				this.setCurrentCardAndAnimate('bounceOutLeft', 'bounceInRight');
				setTimeout(() => {
					this.nextButtonDisabled = false;
				}, 1000);
			} else {
				this.inProgressState = 4;
				this.memTimer.current.stopTimer();
			}
		}
	}

	processIncorrect() {
		if (this.currentMode !== 'Flash Cards') {
			this.cardBackAnimState = 'shake';
		} else {
			this.cardAnimState = 'shake';
		}
		this.currentMistakes += 1;

		if (this.currentMistakes >= 3 && this.currentMode !== 'Flash Cards') {
			this.cardBackAnimState = 'hinge';
			setTimeout(() => {
				this.cardBackAnimState = 'none';
				this.resetPractice();
			}, 2000);
		} else {
			setTimeout(() => {
				if (this.currentMode !== 'Flash Cards') {
					this.cardBackAnimState = 'none';
				} else {
					this.cardAnimState = 'none';
				}
			}, 400);
		}
	}

	// Use Fisher-Yates algo
	shufflePracticeDeck() {
		let practiceDeck = this.cardsFinished;
		for (let i = practiceDeck.length - 1; i > 0; i--) {
	        const j = Math.floor(Math.random() * (i + 1));
	        [practiceDeck[i], practiceDeck[j]] = [practiceDeck[j], practiceDeck[i]];
	    }

		this.practiceDeck = practiceDeck;
	}

	startPractice() {
		// Default value === string 0, returned by default from html attr or if not rendered
		const cardMode = this.selectMode.current ? this.selectMode.current.value : '0';
		const cardNumber = this.selectNumber.current ? this.selectNumber.current.value : '0';
		const cardMethod  = this.selectMethod.current ? this.selectMethod.current.value : '0';

		if (cardMode === 'Memorize the Deck' && (cardNumber === '0' || cardMethod === '0')) {
			this.props.Alert.pushItem('alerts', {
				type: 'error',
				message: "You must first select the number of cards and method to practice!"
			});
		} else if (cardMode === 'Flash Cards' && this.cardsFinished.length <= 2) {
			this.props.Alert.pushItem('alerts', {
				type: 'error',
				message: "You must completely finish (every field) at least 2 cards before using this mode!"
			});
		} else if (cardMode === '0') {
			this.props.Alert.pushItem('alerts', {
				type: 'error',
				message: "You must first select a mode to practice!"
			});
		} else {
			if (this.memTimer.current) {
				this.memTimer.current.resetTimer();
				this.memTimer.current.startTimer();
			}

			if (this.recallTimer.current) {
				this.recallTimer.current.resetTimer();
			}

			if (this.currentMode === 'Memorize the Deck') {
				this.inProgressState = 1;
				this.activeCardNumber = parseInt(this.selectNumber.current.value, 10);
				this.currentMethod = this.selectMethod.current.value;
			} else {
				this.inProgressState = 3;
				this.activeCardNumber = this.cardsFinished.length;
				this.currentMethod = 'Card Name';
				this.inputAnimClasses = 'none';
			}

			this.shufflePracticeDeck();
			this.setCurrentCardAndAnimate('hide', 'bounceInRight', false, 0);
			this.cardBackAnimState = 'hide';
		}
	}

	resetPractice() {
		this.inProgressState = 0;
		this.currentMistakes = 0;
		this.currentStep = 1;
		this.currentMemStep = 1;
		this.inputAnimClasses = 'd-none';

		if (this.memTimer.current) {
			this.memTimer.current.resetTimer();
		}
		if (this.recallTimer.current) {
			this.recallTimer.current.resetTimer();
		}
		if (this.selectMode.current) {
			this.selectMode.current.value = 0;
			this.currentMode = 0;
		}
		if (this.selectNumber.current) {
			this.selectNumber.current.value = 0;
			this.activeCardNumber = 0;
		}
		if (this.selectMethod.current) {
			this.selectMethod.current.value = 0;
			this.currentMethod = 0;
		}
	}

	startRecall() {
		if (this.inProgressState === 2 && this.currentMemStep-1 === parseInt(this.activeCardNumber, 10)) {
			if (this.recallTimer.current) {
				this.recallTimer.current.startTimer();
			}

			this.inProgressState = 3;
			this.currentStep = 1;
			this.setCurrentCardAndAnimate('hide', 'bounceInRight', true, 500, () => {
				this.inputAnimClasses = 'none';
			});
		} else {
			// not valid
		}
	}

	updateMode() {
		this.currentMode = this.selectMode.current.value;
	}

	difficulty(indexOrNumber) {
		if (indexOrNumber === 0) {
			return 'Easy';
		} if (indexOrNumber === 1) {
			return 'Medium';
		} if (indexOrNumber === 2) {
			return 'Hard';
		} if (indexOrNumber === 13) {
			return 'easy';
		} if (indexOrNumber === 26) {
			return 'medium';
		} if (indexOrNumber === 52) {
			return 'hard';
		} else {
			return 'Very Hard';
		}
	}

	curr(ref) {
		if (ref.current) {
			return parseInt(ref.current.value, 10);
		} else {
			return 0;
		}
	}

	componentDidMount() {
		this.getCardsFinished();
	}

	render() {
		const deckTypeClasses = classNames('card', 'mb-3', 'mx-auto', 'animated', 'card-animate', this.cardAnimState, { 
			'bg-light': this.props.Manager.deckObject.deck_info.deck_type === 'light',
			'bg-dark': this.props.Manager.deckObject.deck_info.deck_type === 'dark',
			'text-white': this.props.Manager.deckObject.deck_info.deck_type === 'dark',
			'd-none': this.cardAnimState === 'hide'
		});

		const deckTypeBackClasses = classNames('card', 'mb-3', 'mx-auto', 'animated', 'card-animate', this.cardBackAnimState, { 
			'bg-light': this.props.Manager.deckObject.deck_info.deck_type === 'light',
			'bg-dark': this.props.Manager.deckObject.deck_info.deck_type === 'dark',
			'd-none': this.inProgressState !== 3 || this.cardBackAnimState === 'hide'
		});

		const cardBackImg = this.props.Manager.deckObject.deck_info.deck_type === 'light' ? redBackImg : whiteBackImg;

		const configDisplay = classNames('mx-auto', { 'd-none': this.inProgressState !== 0 });
		const practiceDisplay = classNames('practice-display', 'mx-auto', { 'd-none': this.inProgressState === 0 });

		const timerHeight = this.inProgressState >= 2 && this.currentMode !== 'Flash Cards' ? '170px' : '80px';
		let practiceCpMarginBottom = '-50px';
		if (this.inProgressState === 1 || (this.currentMode === 'Flash Cards' && this.inProgressState >= 2)) {
			practiceCpMarginBottom = '-140px';
		} else if (this.inProgressState >= 2) {
			practiceCpMarginBottom = '-230px';
		}

		// TODO: Clean up
		return(
			<div id="edit-deck-tab" className="tab-content">
				<div className={"tab-pane fade" + (this.props.isActive ? " active show" : "")}>

					<div className="container">
						<div className="d-flex flex-column practice-cp" style={{'marginBottom': practiceCpMarginBottom}}>

							<div className='timer-bar card no-border' style={{'height': timerHeight}}>
								<center>
									{this.inProgressState > 0 && this.inProgressState <= 4 ? (
										this.currentMode === 'Flash Cards' ? 'Flash Timer' : 'Memory Timer'
									) : 'Timer'}:
								</center> <Timer ref={this.memTimer}/>
								{this.inProgressState >= 2 && this.currentMode !== 'Flash Cards' ? (
									<React.Fragment>
										Recall timer: <Timer ref={this.recallTimer}/>
										Mistakes: <br/>
										<div className="mistakes">
											{this.currentMistakes === 0 ? (
												<b>None</b>
											) : (
												<React.Fragment>
													{Array.apply(null, 
														Array(this.currentMistakes)
													).map((_, mistake_number) => {
														return (
															<i key={mistake_number} className="fa fa-times mistake" aria-hidden="true"></i>
														)
													})}
												</React.Fragment>
											)}
										</div>
									</React.Fragment>
								) : ''}
							</div>

							{this.inProgressState > 0 && this.inProgressState < 4 ? (
								<div className="pt-2">
									<button type="button" onClick={this.resetPractice.bind(this)} className="btn btn-danger" style={{'width': '134px'}}>
										Reset
									</button>
								</div>
							) : ''}

						</div>

						<div className="row">

							<div className={configDisplay}>
								<br/><br/>
								<div className="form-group">
								    <select className="custom-select" defaultValue="0" onChange={this.updateMode.bind(this)} ref={this.selectMode}>
								      <option value="0" disabled>Review Mode</option>
								      {['Flash Cards', 'Memorize the Deck'].map((mode, index) => {
								      	return (<option key={index} value={mode}>
								      				{mode}
								      			</option>)
								      })}
								    </select>
								</div>

								{this.currentMode === 'Memorize the Deck' ? (
									<React.Fragment>
										<div className="form-group">
										    <select className="custom-select" defaultValue="0" ref={this.selectNumber}>
										      <option value="0" disabled>Number to memorize</option>
										      {[13,26,39,52].map((number, index) => {
										      	return (<option key={index} value={number} disabled={this.cardsFinished.length < number}>
										      				{this.difficulty(index)}: {number}
										      			</option>)
										      })}
										    </select>
										</div>

										<div className="form-group">
										    <select className="custom-select" defaultValue="0" ref={this.selectMethod}>
										      <option value="0" disabled>Recall method</option>
										      {['Suit and Denomination', 'Card Name'].map((method, index) => {
										      	return (<option key={index} value={method}>
										      				{method}
										      			</option>)
										      })}
										    </select>
										</div>
									</React.Fragment>
								) : ''}

								<button type="button" onClick={this.startPractice.bind(this)} className="btn btn-primary btn-danger practice-button-start">Go!</button>
							</div>

							{this.inProgressState === 4 ? (
								<React.Fragment>
									<div className="container text-center">
										<div className="recall animated jackInTheBox">
											<h1 style={{'fontColor': 'green'}}>Success</h1>
										</div>

										<button type="button" onClick={this.resetPractice.bind(this)} className="btn btn-danger recall">
											Next Round
										</button>
									</div>
								</React.Fragment>
							) : (
								<div className={practiceDisplay}>
									<div className="container">
										<div className="card-memory-main">

											{this.inProgressState === 1 || this.inProgressState === 3 ? (
												<Card klasses={deckTypeClasses} cardDenom={this.currentCard.denom}
													  cardSuitImg={this.getCardSuitImage()} cardImgAlt=""
													  cardTitle={this.currentMode === 'Flash Cards' ? null : this.currentCard.name}
													  cardImg={this.currentCard.image_url}
													  cardName={this.currentMode === 'Flash Cards' ? null : this.currentCard.name}
													  action1={this.currentMode === 'Flash Cards' ? null : this.currentCard.action1}
													  action2={this.currentMode === 'Flash Cards' ? null : this.currentCard.action2} />
											) : <React.Fragment></React.Fragment>}

											{this.inProgressState === 2 ? (
												<div className="container text-center">
													<button type="button" onClick={this.startRecall.bind(this)} className="btn btn-danger recall">
														Start Recall
													</button>
												</div>
											) : <React.Fragment></React.Fragment>}
											
											{this.inProgressState === 3 ? (
												<React.Fragment>
													{this.currentMode !== 'Flash Cards' ? 
														<Card klasses={deckTypeBackClasses} cardImgAlt="card-background"
														  cardImg={cardBackImg} isCardBack={true} />
													: ''}

													{this.currentMethod === 'Card Name' ? (
														<div className={"form-group " + this.inputAnimClasses}>
															<label htmlFor="cardname-input">Card name</label>
															<input type="text" className="form-control" id="cardname-input" placeholder="Card name" ref={this.cardName}/>
														</div>
													) : (
														<React.Fragment>
															<div className={"form-inline justify-content-center " + this.inputAnimClasses}>
																<div className="form-group">
																    <select className="custom-select" defaultValue="0" ref={this.selectDenom}>
																      <option value="0" disabled>Denomination</option>
																      {['Ace', 'King', 'Queen', 'Jack', '10', '9', '8', '7', '6', '5', '4', '3', '2'].map(
																      	(denom, index) => {
																	      	return (<option key={index} value={denom}>
																	      				{denom}
																	      			</option>)
																      	}
																      )}
																    </select>
																</div>
																&nbsp;<b>of</b>&nbsp;
																<div className="form-group">
																    <select className="custom-select" defaultValue="0" ref={this.selectSuit}>
																      <option value="0" disabled>Suit</option>
																      {['Spades', 'Clubs', 'Diamonds', 'Hearts'].map(
																      	(suit, index) => {
																	      	return (<option key={index} value={suit}>
																	      				{suit}
																	      			</option>)
																      	}
																      )}
																    </select>
																</div>
															</div>
															<br/>
														</React.Fragment>
													)}
												</React.Fragment>
											) : <React.Fragment></React.Fragment>}

											{this.inProgressState === 1 || this.inProgressState === 3 ? (
												<div className={this.currentMode === 'Flash Cards' ? "next-flash-card-go" : "next-card-go"}>
													<span><b>{this.currentStep > this.activeCardNumber ? this.activeCardNumber : this.currentStep}</b> of <b>{this.activeCardNumber}</b></span><br/>
													{this.currentMode === 'Flash Cards' ? (
														<React.Fragment>
															<button type="button" onClick={this.skipCard.bind(this)} className="btn btn-danger">
																Skip Card
															</button>
															&nbsp;&nbsp;&nbsp;
														</React.Fragment>
													) : ''}
													<button type="button" onClick={this.nextCard.bind(this)} className="btn btn-danger">
														{this.currentStep < this.activeCardNumber ? (
															'Next Card'
														) : ( 
															this.inProgressState === 1 ? 'Finish Memorizing' : 'Finish Recall'
														)}
													</button>
												</div>
											) : <React.Fragment></React.Fragment>}

										</div>

										{this.currentMode !== 'Flash Cards' ? (
											<div className="kitchen-mem-palace mx-auto card">
												{Array.apply(null, 
													Array(this.currentMemStep >= 26 ? 26 : this.currentMemStep-1)
												).map((_, card_number) => {
													return (
														<div key={card_number} className={"card mini-card animated card-animate jackInTheBox mb-3 background-card kitchen" + card_number}>
															<span className={card_number+1 > 9 ? "mini-card-text-double" : "mini-card-text-single"}>
																{this.inProgressState === 3 && card_number < this.currentStep-1 ? (
																	<i className="fa fa-check" style={{'color': 'green'}} aria-hidden="true"></i>
																) : (
																	<b>{card_number+1}</b>
																)}
															</span>
														</div>
													)
												})}
											</div>
										) : ''}
									</div>

									{this.activeCardNumber > 26 && this.currentMode !== 'Flash Cards' ? (
										<div className="container">
											<div className="living-room-mem-palace mx-auto">
												{Array.apply(null, 
													Array(this.currentMemStep > 26 ? this.currentMemStep-26-1 : 0)
												).map((_, card_number) => {
													return (
														<div key={card_number+26} className={"card mini-card animated card-animate jackInTheBox mb-3 background-card living" + (card_number+26)}>
															<span className="mini-card-text-double">
																{this.inProgressState === 3 && card_number < this.currentStep-1 ? (
																	<i className="fa fa-check" style={{'color': 'green'}} aria-hidden="true"></i>
																) : (
																	<b>{card_number+27}</b>
																)}
															</span>
														</div>
													)
												})}
											</div>
										</div>
									) : ''}
								</div>
							)}

						</div>
					</div>

				</div>
	        </div>
		);
	}
}

export default Manager;