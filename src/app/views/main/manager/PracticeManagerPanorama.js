// Libraries
import React from "react";
import ReactDOM from "react-dom";
import { observable } from "mobx";
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router-dom";
import classNames from "classnames";
import levenshtein from "levenshtein-edit-distance";

// Components
import Card from '../../basic_components/Card';
import Select from '../../basic_components/Select';
import TimerBar from './helpers/TimerBar';
import ConfigDisplay from './helpers/ConfigDisplay';
import PanoramaViewer from './helpers/PanoramaViewer';

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
class PracticeManagerPanorama extends React.Component {

	@observable cardAnimState = 'bounceInRight';
	@observable cardBackAnimState = 'hide';
	@observable inputAnimClasses = 'd-none';
	@observable nextButtonDisabled = false;
	@observable inProgressState = 0;
	@observable cardsFinished = {};
	@observable validPalaces = {};
	@observable practiceDeck = null;
	@observable currentStep = 0; // actually starts at 1
	@observable currentMemStep = 1;
	@observable currentCard = {};
	@observable currentMistakes = 0;
	@observable currentMode = 0;
	@observable currentMethod = 0;
	@observable activeCardNumber = 0;
	@observable currentAssist = 0;
	@observable currentMemPalaceImage = null;
	@observable currentInfoSpots = [];

	constructor(props) {
		super(props);

		// refs
		for (let key of ['selectMode', 'selectNumber', 'selectMethod', 'selectAssist', 'selectDenom',
						 'selectSuit', 'memTimer', 'recallTimer', 'cardName', 'goButton', 'nextRoundButton',
						 'startRecallButton', 'nextCardButton', 'panView'])
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

		// enum (0-4)
		const inProgressStates = ['NOT_STARTED', 'MEMORIZE', 'INTERMISSION', 'RECALL', 'FINISHED'];
		this.progressEnum = {};
		for (let i = 0; i <= 4; i++) {
			const inProgressState = inProgressStates[i];
			this.progressEnum[this.progressEnum[i] = inProgressState] = i;
		}

		this.memPalaceName = null;
	}

	setCurrentCardAndAddToPano() {
		const { memPalacesObj } = this.props.Manager;

		let [imageIndex, imageInfoSpot] = this.getCurrentMemPalaceImageAndNextInfoSpot();

		console.log(imageIndex);

		this.currentStep += 1;
		this.currentCard = this.practiceDeck[this.currentStep-1];

		if (imageIndex !== -1 && this.currentMemPalaceImage !== "http://0.0.0.0:3001" + memPalacesObj[this.memPalaceName].image_urls[imageIndex]) {
			this.currentInfoSpots = [];
			this.currentMemPalaceImage = "http://0.0.0.0:3001" + memPalacesObj[this.memPalaceName].image_urls[imageIndex];
		}

		let element = this.createInfoSpot();
		if (this.panView.current && this.currentMemPalaceImage) {
			//this.panView.current.loadImage("http://0.0.0.0:3001" + this.currentMemPalaceImage);
			//this.panView.current.populateInfoSpot(imageInfoSpot, element, 'c300');
			this.currentInfoSpots.push([imageInfoSpot, element, 'c300']);
		}
	}

	getCurrentMemPalaceImageAndNextInfoSpot() {
		const { memPalacesObj } = this.props.Manager;
		let image_array = memPalacesObj[this.memPalaceName].groups_to_image_array;

		let imageInfoSpot = null;
		let imageIndex = -1;
		let i = -1;
		while (i < this.currentStep) {
			for (let infoSpotsArray of image_array) {

				if (infoSpotsArray.length > 0)
					imageIndex += 1;

				for (let infoSpot of infoSpotsArray) {
					if (i+1 >= this.currentStep) {
						imageInfoSpot = infoSpot;
						return [imageIndex, imageInfoSpot];
					} else {
						i += 1;
					}
				}
			}
		}
	}

	createInfoSpot() {
		const { Manager } = this.props;

		let domElement = document.createElement('div');
		const deckTypeClasses = classNames('card', 'mb-3', 'mx-auto', 'card-mini', {
			'bg-light': Manager.deckObject.deck_info.deck_type === 'light',
			'bg-dark': Manager.deckObject.deck_info.deck_type === 'dark',
			'text-white': Manager.deckObject.deck_info.deck_type === 'dark'
		});

		let cardElement = <Card klasses={deckTypeClasses} cardDenom={this.currentCard.denom}
			  cardSuitImg={this.getCardSuitImage()} cardImgAlt="" isBasic={true}
		/>

		ReactDOM.render(cardElement, domElement);

		return domElement;
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

	// Associate palaces with all valid difficulties
	populateValidPalaces() {
		this.validPalaces = {};
		for (let palName in this.props.Manager.memPalacesObj) {
			let spots = this.getSpotsFinished(palName);

			let availableSpots = spots * 3;
			this.validPalaces[palName] = [];
			for (let diff of [13, 26, 39, 52]) {
				if (availableSpots >= diff) {
					this.validPalaces[palName].push(diff);
				}
			}
		}
	}

	getSpotsFinished(palaceName) {
		const memPal = this.props.Manager.memPalacesObj[palaceName];

		if (memPal) {
			let valid = true;
			let total = 0;
			let currentPalaceImgGroup = memPal.groups_to_image_array;
			let i = 0; while (i < currentPalaceImgGroup.length) {
				if (currentPalaceImgGroup[i].length === 0) {
					valid = false;
				} else {
					total += currentPalaceImgGroup[i].length;
				}

				i += 1;
			}

			return total; // 3 cards per spot
		} else {
			return 0;
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

	attemptIf = (condition, toAttempt) => {
		if (condition && toAttempt && typeof toAttempt === 'function') {
			let succeeded = toAttempt();
			if (succeeded === false) this.processIncorrect();
		} else {
			this.processIncorrect();
		}
	}

	nextCardStandard = () => {
		if (this.inProgressState === 1) {

			this.nextButtonDisabled = true;
			this.setCurrentCardAndAnimate('bounceOutLeft', 'bounceInRight');
			setTimeout(() => {
				this.nextButtonDisabled = false;
			}, 1000);
			this.currentMemStep = this.currentStep;

		} else if (this.inProgressState === 3) {
			if (this.currentMode === 'Flash Cards') {

				let self = this;
				this.attemptIf(this.cardName.current && !String.isEmpty(this.cardName.current.value), function() {
					self.attemptIf(levenshtein(self.practiceDeck[self.currentStep-1].name, self.cardName.current.value) <= 2, function() {
						self.nextButtonDisabled = true;
						self.setCurrentCardAndAnimate('bounceOutLeft', 'bounceInRight');
						setTimeout(() => {
							self.cardName.current.value = "";
							self.cardName.current.focus();
							self.nextButtonDisabled = false;
						}, 1000);
					});
				});

			} else if (this.currentMethod === 'Card Name') {

				this.attemptIf(this.cardName.current && !String.isEmpty(this.cardName.current.value), function() {
					this.attemptIf(levenshtein(this.practiceDeck[this.currentStep-1].name, this.cardName.current.value) <= 2, function() {
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
					});
				});

			} else {

				this.attemptIf(this.selectSuit.current && parseInt(this.selectSuit.current.value, 10) !== 0
						&& this.selectDenom.current && parseInt(this.selectDenom.current.value, 10) !== 0, function() {

					this.attemptIf(this.practiceDeck[this.currentStep-1].card_number === this.denomsEnum[this.selectDenom.current.value]
							&& this.practiceDeck[this.currentStep-1].suit === this.selectSuit.current.value.toLowerCase(), function() {

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

					});
				});

			}
		}
	}

	nextCardFinal = () => {
		const { Manager } = this.props;

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
						difficulty: this.databaseDifficulty(parseInt(this.selectNumber.current.value, 10)),
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
						difficulty: this.databaseDifficulty(parseInt(this.selectNumber.current.value, 10)),
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

	nextCard = () => {
		if (this.nextButtonDisabled) return;
		const { Manager } = this.props;

		if (this.currentStep < this.activeCardNumber) {
			if (this.memPalaceName && this.memPalaceName !== null) {
				this.setCurrentCardAndAddToPano();
			} else {
				this.nextCardStandard();
			}
		} else {
			this.nextCardFinal();
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
		const { Alert, Manager } = this.props;

		// Default value === string 0, returned by default from html attr or if not rendered
		const cardMode = this.selectMode.current ? this.selectMode.current.value : '0';
		const cardNumber = this.selectNumber.current ? this.selectNumber.current.value : '0';
		const cardMethod = this.selectMethod.current ? this.selectMethod.current.value : '0';
		const memPalaceName = this.selectAssist.current ? this.selectAssist.current.value : '0';

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
		} else if (cardMode === 'Memorize the Deck' && memPalaceName === '0') {
			Alert.pushItem('alerts', {
				type: 'error',
				message: "You must first select an option for a memory palace!"
			});
		} else if (cardMode === 'Memorize the Deck' && memPalaceName !== 'None' && !this.validPalaces[memPalaceName].includes(parseInt(cardNumber, 10)) ) {
			Alert.pushItem('alerts', {
				type: 'error',
				message: `That memory palace does not have enough spots created for the ${cardMode} difficulty!`
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
				this.activeCardNumber = parseInt(cardNumber, 10);
				this.currentMethod = cardMethod;
				this.currentAssist = memPalaceName;
			} else {
				this.inProgressState = 3;
				this.activeCardNumber = this.cardsFinished.length;
				this.currentMethod = 'Card Name';
				this.inputAnimClasses = 'none';
			}

			this.shufflePracticeDeck();
			this.memPalaceName = memPalaceName === "0" ? null : memPalaceName;
			this.currentMemPalaceImage = null;
			this.currentInfoSpots = [];
			if (memPalaceName !== 'None' && memPalaceName !== '0') {
				let [imageIndex, _] = this.getCurrentMemPalaceImageAndNextInfoSpot();
				this.currentMemPalaceImage = "http://0.0.0.0:3001" + Manager.memPalacesObj[memPalaceName].image_urls[imageIndex];
			} else {
				this.setCurrentCardAndAnimate('hide', 'bounceInRight', false, 0);
			}
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

		let selectVals = {
			'selectMode': 'currentMode',
			'selectNumber': 'activeCardNumber',
			'selectMethod': 'currentMethod',
			'selectAssist': 'currentAssist'
		};

		for (let key in selectVals) {
			if (this[key].current) {
				this[key].current.value = 0;
				this[selectVals[key]] = 0;
			}
		}
	}

	startRecall = () => {
		// If valid
		if (this.inProgressState === 2 && this.currentMemStep-1 === parseInt(this.activeCardNumber, 10)) {
			if (this.recallTimer.current)
				this.recallTimer.current.startTimer();

			this.currentStep = 0;
			this.inProgressState = 3;
			this.setCurrentCardAndAnimate('hide', 'bounceInRight', true, 500, () => {
				this.inputAnimClasses = 'none';
			});
		}
	}

	updateMode = () => this.currentMode = this.selectMode.current.value;

	difficulty(index) {
		let diff = {
			0: 'Easy',
			1: 'Medium',
			2: 'Hard',
			3: 'Very Hard'
		};

		if (diff[index]) {
			return diff[index];
		} else {
			return 'Very Hard';
		}
	}

	databaseDifficulty(number) {
		let diff = {
			13: 'easy',
			26: 'medium',
			39: 'hard',
			52: 'very_hard'
		};

		if (diff[number]) {
			return diff[number];
		} else {
			return 'very hard';
		}
	}

	handleKeyDown = (e) => {
		let stateToButton = {
			0: this.goButton,
			1: this.nextCardButton,
			2: this.startRecallButton,
			3: this.nextCardButton,
			4: this.nextRoundButton
		};

		if (e.key === 'Enter' && stateToButton[this.inProgressState].current)
			stateToButton[this.inProgressState].current.click();
	}

	curr(ref) {
		if (ref.current) {
			return parseInt(ref.current.value, 10);
		} else {
			return 0;
		}
	}

	isUsingMemPalace() {
		if (this.currentAssist !== 0 && this.currentAssist !== '0' && this.currentAssist !== 'None') {
			return true;
		} else {
			return false;
		}
	}

	componentDidMount() {
		this.getCardsFinished();
		this.populateValidPalaces();
		document.addEventListener("keydown", this.handleKeyDown);
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this.handleKeyDown);
	}

	render() {
		const { Manager } = this.props;
		const isUsingMemPalace = this.isUsingMemPalace();

		const deckTypeClasses = classNames('card', 'mb-3', 'mx-auto', 'animated', 'card-animate', this.cardAnimState, {
			'bg-white': Manager.deckObject.deck_info.deck_type === 'light',
			'bg-dark': Manager.deckObject.deck_info.deck_type === 'dark',
			'text-white': Manager.deckObject.deck_info.deck_type === 'dark',
			'd-none': this.cardAnimState === 'hide'
		});

		const deckTypeBackClasses = classNames('card', 'mb-3', 'mx-auto', 'animated', 'card-animate', this.cardBackAnimState, {
			'bg-white': Manager.deckObject.deck_info.deck_type === 'light',
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

		let cardProps = {};
		if (this.practiceDeck !== null && !isUsingMemPalace) {
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

		return(
			<div id="edit-deck-tab" className="tab-content">
				<div className={classNames("tab-pane", "fade", {"active show": Manager.currentSubNav === 'Practice'})}>

					<div className="container">
						<div className="d-flex flex-column practice-cp" style={{'marginBottom': practiceCpMarginBottom}}>

							<TimerBar memTimer={this.memTimer} recallTimer={this.recallTimer} timerHeight={timerHeight}
								currentMode={this.currentMode} currentMistakes={this.currentMistakes} resetPractice={this.resetPractice}
								inProgressState={this.inProgressState} progressEnum={this.progressEnum}
							/>

						</div>

						<div className="row">

							<ConfigDisplay configDisplay={configDisplay} currentMode={this.currentMode} updateMode={this.updateMode}
								selectMode={this.selectMode} cardsFinished={this.cardsFinished} difficulty={this.difficulty}
								selectNumber={this.selectNumber} selectMethod={this.selectMethod} selectAssist={this.selectAssist}
								validPalaces={this.validPalaces} startPractice={this.startPractice} goButton={this.goButton} />

							{this.inProgressState === this.progressEnum['FINISHED'] ? (<>
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

											{(this.inProgressState === this.progressEnum['MEMORIZE'] || this.inProgressState === this.progressEnum['RECALL']) && <>
												{this.memPalaceName !== null &&
													<PanoramaViewer panoImgSrc={this.currentMemPalaceImage} panoImgInfoSpotsAdvanced={this.currentInfoSpots} ref={this.panView} />
												}

												<div className={this.selectAssist.current && this.selectAssist.current.value !== 'None' ? '' : ''}>
													{this.currentMode === 'Flash Cards' ? (
														<Card klasses={deckTypeClasses} cardDenom={this.currentCard.denom} cardSuitImg={this.getCardSuitImage()} />
													): (
														<Card klasses={deckTypeClasses} cardDenom={this.currentCard.denom}
															  cardSuitImg={this.getCardSuitImage()} cardImgAlt="" {...cardProps}
														/>
													)}
												</div>

											</>}

											{this.inProgressState === this.progressEnum['INTERMISSION'] && <div className="container text-center">
												<button type="button" onClick={this.startRecall} ref={this.startRecallButton} className="btn btn-danger recall">
													Start Recall
												</button>
											</div>}

											{this.inProgressState === this.progressEnum['RECALL'] && <>
												{this.currentMode !== 'Flash Cards' && <>
													{this.memPalaceName !== null ? (
														<PanoramaViewer panoImgSrc={this.currentMemPalaceImage} ref={this.panView} />
													) : (
														<Card klasses={deckTypeBackClasses} cardImgAlt="card-background"
														  cardImg={cardBackImg} isCardBack={true} isBasic={isUsingMemPalace}
														/>
													)}
												</>}

												{this.currentMethod === 'Card Name' ? (
													<div className={"form-group " + this.inputAnimClasses}>
														<label htmlFor="cardname-input">Card name</label>
														<input type="text" className="form-control" id="cardname-input" placeholder="Card name" ref={this.cardName}/>
													</div>
												) : (<>
													<div className={"form-inline justify-content-center " + this.inputAnimClasses}>
														<Select ref={this.selectDenom} placeholder="Denomination" placeholderValue="0"
															options={['Ace', 'King', 'Queen', 'Jack', '10', '9', '8', '7', '6', '5', '4', '3', '2']} />
														&nbsp;<b>of</b>&nbsp;
														<Select ref={this.selectSuit} placeholder="Suit" placeholderValue="0"
															options={['Spades', 'Clubs', 'Diamonds', 'Hearts']} />
													</div>
													<br/>
												</>)}
											</>}

											{(this.inProgressState === this.progressEnum['MEMORIZE'] || this.inProgressState === this.progressEnum['RECALL']) &&
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

								</div>
							)}

						</div>
					</div>

				</div>
	        </div>
		);
	}
}

export default PracticeManagerPanorama;
