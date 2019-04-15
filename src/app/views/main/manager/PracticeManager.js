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

@withRouter @inject(RootStore => {
	return {
		Manager: RootStore.ManagerStore,
		Alert: RootStore.AlertStore
	}
}) @observer
class PracticeManager extends React.Component {

	@observable cardAnimState = 'bounceInRight';
	@observable cardBackAnimState = 'hide';
	@observable inputAnimClasses = 'd-none';
	@observable nextButtonDisabled = false;
	@observable inProgressState = 0;
	@observable cardsFinished = {};
	@observable practiceDeck = null;
	@observable currentStep = 0; // actually starts at 1
	@observable currentMemStep = 1;
	@observable currentCard = {};
	@observable currentMistakes = 0;
	@observable currentMode = 0;
	@observable currentMethod = 0;
	@observable activeCardNumber = 0;
	@observable currentAssist = 0;

	constructor(props) {
		super(props);

		// refs
		for (let key of ['selectMode', 'selectNumber', 'selectMethod', 'selectAssist', 'selectDenom', 
						 'selectSuit', 'memTimer', 'recallTimer', 'cardName', 'goButton', 'nextRoundButton', 
						 'startRecallButton', 'nextCardButton'])
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

	setCurrentCardAndAnimate(beforeAnim = '', afterAnim = '', newIsCardBack = false, custom_delay, callback) {
		let delay = newIsCardBack ? 500 : 400;
		delay = custom_delay || delay;

		this.cardAnimState = beforeAnim;
		setTimeout(() => {
			if (newIsCardBack) {
				this.cardAnimState = 'hide';
				this.cardBackAnimState = afterAnim;
			} else {
				this.cardAnimState = afterAnim;
			}

			this.currentStep += 1;
			this.currentCard = this.practiceDeck[this.currentStep-1];

			typeof callback === 'function' && callback();
		}, delay);
	}

	getCardSuitImage = () => {
		const { suit } = this.currentCard;

		if (this.props.Manager.deckObject.deck_info.deck_type === 'light') {
			switch (suit) {
				case 'hearts': return heartsImg;
				case 'diamonds': return diamondsImg;
				case 'clubs': return clubsImg;
				case 'spades': return spadesImg;
				default: return '';
			}
		} else {			
			switch (suit) {
				case 'hearts': return heartsWhiteImg;
				case 'diamonds': return diamondsWhiteImg;
				case 'clubs': return clubsWhiteImg;
				case 'spades': return spadesWhiteImg;
				default: return '';
			}
		}
	}

	getCardsFinished() {
		const { cards } = this.props.Manager.deckObject;
		let cardsFinished = [];

		for (let suit in cards) {
			for (let denom in cards[suit]) {
				const denom_obj = cards[suit][denom];

				if ([denom_obj.name, denom_obj.image_url, denom_obj.action1, denom_obj.action2].every(value => 
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

	nextCard = () => {
		if (this.nextButtonDisabled) return;
		const { Manager } = this.props;

		// Clicked Next
		if (this.currentStep < this.activeCardNumber) {
			if (this.inProgressState === 1) {
				// if (this.currentStep%3 === 0) {
				// 	this.nextButtonDisabled = true;
				// 	this.setCurrentCardAndAnimate('bounceOutLeft', 'bounceInRight');
				// 	setTimeout(() => {
				// 		this.nextButtonDisabled = false;
				// 	}, 1000);
				// } else {
				// 	this.currentStep += 1;
				// }
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
							this.nextButtonDisabled = true;
							this.setCurrentCardAndAnimate('bounceOutLeft', 'bounceInRight');
							setTimeout(() => {
								this.cardName.current.value = "";
								this.cardName.current.focus();
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
						Manager.sendTime({
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
						Manager.sendTime({
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

	skipCard = () => {
		if (this.nextButtonDisabled) return;
		
		if (this.currentStep < this.activeCardNumber) {
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

	processIncorrect() {
		this.currentMode !== 'Flash Cards' ? this.cardBackAnimState = 'shake' : this.cardAnimState = 'shake';
		this.currentMistakes += 1;

		if (this.currentMistakes >= 3 && this.currentMode !== 'Flash Cards') {
			this.cardBackAnimState = 'hinge';
			setTimeout(() => {
				this.cardBackAnimState = 'none';
				this.resetPractice();
			}, 2000);
		} else {
			setTimeout(() => {
				this.currentMode !== 'Flash Cards' ? this.cardBackAnimState = 'none' : this.cardAnimState = 'none';
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

	startPractice = () => {
		const { Alert } = this.props;

		// Default value === string 0, returned by default from html attr or if not rendered
		const cardMode = this.selectMode.current ? this.selectMode.current.value : '0';
		const cardNumber = this.selectNumber.current ? this.selectNumber.current.value : '0';
		const cardMethod = this.selectMethod.current ? this.selectMethod.current.value : '0';

		if (cardMode === 'Memorize the Deck' && (cardNumber === '0' || cardMethod === '0')) {
			Alert.pushItem('alerts', {
				type: 'error',
				message: "You must first select the number of cards and method to practice!"
			});
		} else if (cardMode === 'Flash Cards' && this.cardsFinished.length < 2) {
			Alert.pushItem('alerts', {
				type: 'error',
				message: "You must completely finish (every field) at least 2 cards before using this mode!"
			});
		} else if (cardMode === '0') {
			Alert.pushItem('alerts', {
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
				this.currentAssist = this.selectAssist.current.value;
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

	resetPractice = () => {
		this.inProgressState = 0;
		this.currentMistakes = 0;
		this.currentStep = 0; // actually = 1
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
		if (this.selectAssist.current) {
			this.selectAssist.current.value = 0;
			this.currentAssist = 0;
		}
	}

	startRecall = () => {
		// If valid
		if (this.inProgressState === 2 && this.currentMemStep-1 === parseInt(this.activeCardNumber, 10)) {
			if (this.recallTimer.current) {
				this.recallTimer.current.startTimer();
			}

			this.currentStep = 0;
			this.inProgressState = 3;
			this.setCurrentCardAndAnimate('hide', 'bounceInRight', true, 500, () => {
				this.inputAnimClasses = 'none';
			});
		}
	}

	updateMode = () => this.currentMode = this.selectMode.current.value;

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

	handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			if (this.inProgressState === 0) {
				if (this.goButton.current) {
					this.goButton.current.click();
				}
			} else if (this.inProgressState === 1 || this.inProgressState === 3) {
				if (this.nextCardButton.current) {
					this.nextCardButton.current.click();
				}
			} else if (this.inProgressState === 2) {
				if (this.startRecallButton.current) {
					this.startRecallButton.current.click();
				}
			} else if (this.inProgressState === 4) {
				if (this.nextRoundButton.current) {
					this.nextRoundButton.current.click();
				}
			}
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
		document.addEventListener("keydown", this.handleKeyDown);
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this.handleKeyDown);	
	}

	render() {
		const { Manager } = this.props;
		const deckTypeClasses = classNames('card', 'mb-3', 'mx-auto', 'animated', 'card-animate', this.cardAnimState, { 
			'card-mini': this.currentAssist !== 'None' && this.currentMode !== 'Flash Cards',
			'bg-light': Manager.deckObject.deck_info.deck_type === 'light',
			'bg-dark': Manager.deckObject.deck_info.deck_type === 'dark',
			'text-white': Manager.deckObject.deck_info.deck_type === 'dark',
			'd-none': this.cardAnimState === 'hide'
		});

		const deckTypeBackClasses = classNames('card', 'mb-3', 'mx-auto', 'animated', 'card-animate', this.cardBackAnimState, { 
			'card-mini': this.currentAssist !== 'None' && this.currentMode !== 'Flash Cards',
			'bg-light': Manager.deckObject.deck_info.deck_type === 'light',
			'bg-dark': Manager.deckObject.deck_info.deck_type === 'dark',
			'd-none': this.inProgressState !== 3 || this.cardBackAnimState === 'hide'
		});

		const cardBackImg = Manager.deckObject.deck_info.deck_type === 'light' ? redBackImg : whiteBackImg;

		const configDisplay = classNames('mx-auto', { 'd-none': this.inProgressState !== 0 });
		const practiceDisplay = classNames('practice-display', 'mx-auto', { 'd-none': this.inProgressState === 0 });

		const timerHeight = this.inProgressState >= 2 && this.currentMode !== 'Flash Cards' ? '170px' : '80px';
		let practiceCpMarginBottom = '-50px';
		if (this.inProgressState === 1 || (this.currentMode === 'Flash Cards' && this.inProgressState >= 2)) {
			practiceCpMarginBottom = '-140px';
		} else if (this.inProgressState >= 2) {
			practiceCpMarginBottom = '-230px';
		}

		// const currentThreeStep = (this.currentStep-1)%3;

		// let cardProps = {};
		// if (this.practiceDeck !== null && this.currentMode !== 'Flash Cards') {
		// 	cardProps.cardTitle = this.practiceDeck[this.currentStep-1-currentThreeStep].name;
		// 	cardProps.cardImg = this.practiceDeck[this.currentStep-1-currentThreeStep].image_url;
		// 	cardProps.cardImgTx = this.practiceDeck[this.currentStep-1-currentThreeStep].image_tx;
		// 	cardProps.cardImgTy = this.practiceDeck[this.currentStep-1-currentThreeStep].image_ty;
		// 	cardProps.cardImgH = this.practiceDeck[this.currentStep-1-currentThreeStep].image_h;
		// 	cardProps.cardImgW = this.practiceDeck[this.currentStep-1-currentThreeStep].image_w;

		// 	if (currentThreeStep >= 1)
		// 		cardProps.action1 = this.practiceDeck[this.currentStep-1-currentThreeStep+1].action1;

		// 	if (currentThreeStep >= 2) {
		// 		cardProps.action2 = this.practiceDeck[this.currentStep-1].action2;
		// 		cardProps.objectImgTx = this.practiceDeck[this.currentStep-1].action2_tx;
		// 		cardProps.objectImgTy = this.practiceDeck[this.currentStep-1].action2_ty;
		// 		cardProps.objectImgH = this.practiceDeck[this.currentStep-1].action2_h;
		// 		cardProps.objectImgW = this.practiceDeck[this.currentStep-1].action2_w;
		// 	}
		// }

		let cardProps = {};
		if (this.practiceDeck !== null && this.currentAssist === 'None') {
			cardProps.cardTitle = this.currentCard.name;
			cardProps.cardImg = this.currentCard.image_url;
			cardProps.cardImgTx = this.currentCard.image_tx;
			cardProps.cardImgTy = this.currentCard.image_ty;
			cardProps.cardImgH = this.currentCard.image_h;
			cardProps.cardImgW = this.currentCard.image_w;
			cardProps.action1 = this.currentCard.action1;
			cardProps.action2 = this.currentCard.action2;
			cardProps.objectImgTx = this.currentCard.action2_tx;
			cardProps.objectImgTy = this.currentCard.action2_ty;
			cardProps.objectImgH = this.currentCard.action2_h;
			cardProps.objectImgW = this.currentCard.action2_w;
		} else if (this.currentMode !== 'Flash Cards') {
			cardProps.isBasic = true;
		}

		// TODO: Clean up
		return(
			<div id="edit-deck-tab" className="tab-content">
				<div className={classNames("tab-pane", "fade", {"active show": Manager.currentSubNav === 'Practice'})}>

					<div className="container">
						<div className="d-flex flex-column practice-cp" style={{'marginBottom': practiceCpMarginBottom}}>

							<div className='timer-bar card no-border' style={{'height': timerHeight}}>
								<center>
									{this.inProgressState > 0 && this.inProgressState <= 4 ? (
										this.currentMode === 'Flash Cards' ? 'Flash Timer' : 'Memory Timer'
									) : 'Timer'}:
								</center> <Timer ref={this.memTimer}/>

								{(this.inProgressState >= 2 && this.currentMode !== 'Flash Cards') && <>
									Recall timer: <Timer ref={this.recallTimer}/>
									Mistakes: <br/>
									<div className="mistakes">
										{this.currentMistakes === 0 ? (
											<b>None</b>
										) : (<>
											{Array.apply(null, 
												Array(this.currentMistakes)
											).map((_, mistake_number) => {
												return (
													<i key={mistake_number} className="fa fa-times mistake" aria-hidden="true"></i>
												)
											})}
										</>)}
									</div>
								</>}
							</div>

							{(this.inProgressState > 0 && this.inProgressState < 4) && <div className="pt-2">
								<button type="button" onClick={this.resetPractice} className="btn btn-danger" style={{'width': '134px'}}>
									Reset
								</button>
							</div>}

						</div>

						<div className="row">

							<div className={configDisplay}>
								<br/><br/>
								<div className="form-group">
								    <select className="custom-select" defaultValue="0" onChange={this.updateMode} ref={this.selectMode} autoFocus>
								      <option value="0" disabled>Review Mode</option>
								      {['Flash Cards', 'Memorize the Deck'].map((mode, index) => {
								      	return (<option key={index} value={mode}>
								      				{mode}
								      			</option>)
								      })}
								    </select>
								</div>

								{this.currentMode === 'Memorize the Deck' && <>
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

									<div className="form-group">
									    <select className="custom-select" defaultValue="0" ref={this.selectAssist}>
									      <option value="0" disabled>Memory palace</option>
									      {['Default', 'None'].map((method, index) => {
									      	return (<option key={index} value={method}>
									      				{method}
									      			</option>)
									      })}
									    </select>
									</div>
								</>}

								<button type="button" onClick={this.startPractice} ref={this.goButton} className="btn btn-primary btn-danger practice-button-start">Go!</button>
							</div>

							{this.inProgressState === 4 ? (<>
								<div className="container text-center">
									<div className="recall animated jackInTheBox">
										<h1 style={{'fontColor': 'green'}}>Success</h1>
									</div>

									<button type="button" onClick={this.resetPractice} ref={this.nextRoundButton} className="btn btn-danger recall">
										Next Round
									</button>
								</div>
							</>) : (
								<div className={practiceDisplay}>
									<div className="container">
										<div className="card-memory-main">

											{(this.inProgressState === 1 || this.inProgressState === 3) &&
												<Card klasses={deckTypeClasses} cardDenom={this.currentCard.denom}
													  cardSuitImg={this.getCardSuitImage()} cardImgAlt="" {...cardProps}
												/>
											}

											{this.inProgressState === 2 && <div className="container text-center">
												<button type="button" onClick={this.startRecall} ref={this.startRecallButton} className="btn btn-danger recall">
													Start Recall
												</button>
											</div>}
											
											{this.inProgressState === 3 && <>
												{this.currentMode !== 'Flash Cards' && 
													<Card klasses={deckTypeBackClasses} cardImgAlt="card-background"
													  cardImg={cardBackImg} isCardBack={true} isBasic={this.currentAssist !== 'None'} 
													/>
												}

												{this.currentMethod === 'Card Name' ? (
													<div className={"form-group " + this.inputAnimClasses}>
														<label htmlFor="cardname-input">Card name</label>
														<input type="text" className="form-control" id="cardname-input" placeholder="Card name" ref={this.cardName}/>
													</div>
												) : (<>
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
												</>)}
											</>}

											{(this.inProgressState === 1 || this.inProgressState === 3) &&
												<div className={this.currentMode === 'Flash Cards' ? "next-flash-card-go" : "next-card-go"}>
													<span><b>
														{this.currentStep > this.activeCardNumber ? this.activeCardNumber : this.currentStep}</b> of <b>{this.activeCardNumber}
													</b></span>
													<br/>
													<button type="button" onClick={this.nextCard} ref={this.nextCardButton} className="btn btn-danger">
														{this.currentStep < this.activeCardNumber ? 'Next Card' : 'Finish'}
													</button>
													{this.currentMode === 'Flash Cards' && <>
														&nbsp;&nbsp;&nbsp;
														<button type="button" onClick={this.skipCard} className="btn btn-danger">
															Skip Card
														</button>
													</>}
												</div>
											}

										</div>
									</div>

									{this.selectAssist === 'Normal' && <>
									</>}
								</div>
							)}

						</div>
					</div>

				</div>
	        </div>
		);
	}
}

export default PracticeManager;