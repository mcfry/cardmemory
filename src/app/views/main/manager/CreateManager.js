// Libraries
import React from "react";
import classNames from "classnames";
import axios from 'axios';

// Components
import Card from '../../basic_components/Card';

// Images
import heartsImg from '../../../images/card-icons/hearts.png';
import spadesWhiteImg from '../../../images/card-icons/spades-white.png';
import usainBoltImg from '../../../images/usain_bolt_ex.png';
import phelpsImg from '../../../images/phelps_ex.png';

// Css
import './Manager.css';

class Manager extends React.Component {
	constructor(props) {
		super(props);

		// Func Binds
		this.themeClick = this.themeClick.bind(this);
		this.createDeck = this.createDeck.bind(this);

		// Refs
		this.red = React.createRef();
		this.black = React.createRef();
		this.hearts = React.createRef();
		this.diamonds = React.createRef();
		this.clubs = React.createRef();
		this.spades = React.createRef();
		this.theme1 = React.createRef();
		this.theme2 = React.createRef();
		this.custom = React.createRef();
		this.customForm = React.createRef();

		this.state = {
			loggedIn: false, currentSubNav: 'Create', deckType: '', showCustom: false
		};
	}

	isLoggedIn() {
	    let username = localStorage.getItem('username');
	    let email = localStorage.getItem('email');
	    let authentication_token = localStorage.getItem('authentication_token');

	    let loggedIn = false;
	    if (username && email && authentication_token) { loggedIn = true; }

	    if (this.state.loggedIn !== loggedIn) {
	      this.setState({
	        loggedIn: loggedIn
	      });
	    }
	}

	deckTypeClick(type) {
		this.setState({
			deckType: type
		});
	}

	themeClick() {
		this.setState({
			showCustom: this.custom.current.checked
		});
	}

	createDeck() {
		let that = this;

		let deckObject = null;
		if (this.theme1.current.checked === true) {
			deckObject = {
				red: 'Women', black: 'Men', hearts: 'Good', clubs: 'Good', diamonds: 'Evil', spades: 'Evil'
			};
		} else if (this.theme2.current.checked === true) {
			deckObject = {
				red: 'Evil', black: 'Good', hearts: 'Women', clubs: 'Men', diamonds: 'Men', spades: 'Women'
			};
		} else if (this.custom.current.checked === true) {
			if (!String.isEmpty(this.red.current.value) && !String.isEmpty(this.black.current.value) &&
				!String.isEmpty(this.hearts.current.value) && !String.isEmpty(this.diamonds.current.value) &&
				!String.isEmpty(this.clubs.current.value) && !String.isEmpty(this.spades.current.value)) {

				deckObject = {
					red: this.red.current.value, black: this.black.current.value, hearts: this.hearts.current.value, 
					clubs: this.clubs.current.value, diamonds: this.diamonds.current.value, spades: this.spades.current.value
				};
			}
		}

		if (deckObject !== null) {
			deckObject.deck_type = this.state.deckType;

			axios({
				url: `http://0.0.0.0:3001/api/v1/deck_infos`, 
		        method: 'post',
		        data: deckObject,
		        headers: {
		          'Content-Type': 'application/json',
		          'X-User-Email': localStorage.getItem('email'),
		          'X-User-Token': localStorage.getItem('authentication_token')
		        }
	        }).then(function (response) {
				let authentication_token, email, username;
				({authentication_token, email, username} = response.data);

				localStorage.setItem('authentication_token', authentication_token);
				localStorage.setItem('username', username);
				localStorage.setItem('email', email);

				sessionStorage.pushItem('alerts', {
					type: 'success',
					message: "You've successfully logged in!"
				});

				that.modalClose.current.click();
				that.props.history.push('/');
			}).catch(function (error) {
				sessionStorage.pushItem('alerts', {
					type: 'danger',
					message: "Something went wrong. Please try again."
				});
			});
		} else {
			sessionStorage.pushItem('alerts', {
				type: 'danger',
				message: "Missing input! Please review your choices."
			});
		}
	}

	render() {
		const isLightSelected = classNames('card', 'bg-light', 'mb-3', { 'bg-active-light': this.state.deckType === 'light' });
		const isDarkSelected = classNames('card', 'bg-dark', 'mb-3', 'text-white', { 'bg-active-dark': this.state.deckType === 'dark' });
		const isCustomFormVisible = classNames({ 'hide-div': !this.state.showCustom });

		return(
			<div id="myTabContent" className="tab-content">
	            <div className={"tab-pane fade" + (this.props.isActive ? " active show" : "")} id="home">
	             	<h4>Card Type</h4>
	             	<p>Choose a type of card layout.</p>

	             	<div className="row">
	             		<div className="col-3">
							<Card klasses={isLightSelected} clickHandler={this.deckTypeClick.bind(this, 'light')} cardTitle="Light card example" 
								  cardSuitImg={heartsImg} cardImg={phelpsImg} cardImgAlt="phelps" cardName="Michael Phelps" 
								  action1="Swimming" action2="Smoking kush" />
						</div>

						<div className="col-3">
							<Card klasses={isDarkSelected} clickHandler={this.deckTypeClick.bind(this, 'dark')} cardTitle="Dark card example" 
								  cardSuitImg={spadesWhiteImg} cardImg={usainBoltImg} cardImgAlt="usain-bolt" cardName="Usain Bolt" 
								  action1="Running" action2="Jumping real high" />
						</div>
					</div>

					<br/>
					<h4>Mnemonics</h4>
	             	<p>
	             		Choose a theme for card suit and color. If unsure, choose a theme that would be 
	             		easy to make a list of things that belong to it.
	             	</p>

	             	<div className="form-group">
						<div className="custom-control custom-radio">
						  <input type="radio" id="customRadio1" name="customRadio" onClick={this.themeClick} ref={this.theme1} className="custom-control-input"/>
						  <label className="custom-control-label" htmlFor="customRadio1">
						  	<b>Color:</b> Men (Black), Women (Red) &nbsp;&nbsp; 
						  	<b>Suit:</b> Good (Hearts & Clubs), Evil (Diamonds & Spades)
						  </label>
						</div>
						<div className="custom-control custom-radio">
						  <input type="radio" id="customRadio2" name="customRadio" onClick={this.themeClick} ref={this.theme2} className="custom-control-input"/>
						  <label className="custom-control-label" htmlFor="customRadio2">
						  	<b>Color:</b> Good (Black), Evil (Red) &nbsp;&nbsp; 
						  	<b>Suit:</b> Men (Diamonds & Clubs), Women (Hearts & Spades)
						  </label>
						</div>
						<div className="custom-control custom-radio">
						  <input type="radio" id="customRadio4" name="customRadio" onClick={this.themeClick} ref={this.custom} className="custom-control-input"/>
						  <label className="custom-control-label" htmlFor="customRadio4"><b>Custom Theme</b></label>
						</div>

						<div className={isCustomFormVisible}>
							<form ref={this.customForm}>
								<div className="form-inline form-row">
									<div className="form-group col-2">
								      <label htmlFor="red-custom" className="col-form-label">Red Theme: </label>
								      <input type="text" ref={this.red} className="form-control-plaintext" id="red-custom" placeholder="red"/>
								    </div>

								    <div className="form-group col-2">
								      <label htmlFor="black-custom" className="col-form-label">Black Theme: </label>
								      <input type="text" ref={this.black} className="form-control-plaintext" id="black-custom" placeholder="black"/>
								    </div>
								</div>

							    <div className="form-inline form-row">
									<div className="form-group col-2">
								      <label htmlFor="hearts-custom" className="col-form-label">Hearts Theme: </label>
								      <input type="text" ref={this.hearts} className="form-control-plaintext" id="hearts-custom" placeholder="hearts"/>
								    </div>

								    <div className="form-group col-2">
								      <label htmlFor="diamonds-custom" className="col-form-label">Diamonds Theme: </label>
								      <input type="text" ref={this.diamonds} className="form-control-plaintext" id="diamonds-custom" placeholder="diamonds"/>
								    </div>
								</div>

								<div className="form-inline form-row">
									<div className="form-group col-2">
								      <label htmlFor="clubs-custom" className="col-form-label">Clubs Theme: </label>
								      <input type="text" ref={this.clubs} className="form-control-plaintext" id="clubs-custom" placeholder="clubs"/>
								    </div>

								    <div className="form-group col-2">
								      <label htmlFor="spades-custom" className="col-form-label">Spades Theme: </label>
								      <input type="text" ref={this.spades} className="form-control-plaintext" id="spades-custom" placeholder="spades"/>
								    </div>
								</div>
							</form>
						</div>
					</div>

					<button type="button" onClick={this.createDeck} className="btn btn-danger">Create!</button>
					<br/><br/><br/>
	            </div>
	        </div>
		);
	}
}

export default Manager;