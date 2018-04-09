// Libraries
import React from "react";
import classNames from "classnames";
import axios from 'axios';

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
		this.subNavClick = this.subNavClick.bind(this);
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
			currentSubNav: 'Create', deckType: '', showCustom: false
		};
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

	subNavClick(tabStr) {
		this.setState({
			currentSubNav: tabStr
		});
	}

	render() {
		const isLightSelected = classNames('card', 'bg-light', 'mb-3', { 'bg-active-light': this.state.deckType === 'light' });
		const isDarkSelected = classNames('card', 'bg-dark', 'mb-3', 'text-white', { 'bg-active-dark': this.state.deckType === 'dark' });
		const isCustomFormVisible = classNames({ 'hide-div': !this.state.showCustom });

		return(
			<div className="manager">
				<ul className="nav nav-tabs">
					<div className="container">
			            <li className="nav-item pull-left">
			              <a className={"nav-link" + (this.state.currentSubNav === 'Create' ? " active show" : "")} 
			              	 onClick={this.subNavClick.bind(this, 'Create')} data-toggle="tab">Create</a>
			            </li>

			            <li className="nav-item pull-left">
			              <a className={"nav-link" + (this.state.currentSubNav === 'Edit' ? " active show" : "")} 
			              	 onClick={this.subNavClick.bind(this, 'Edit')} data-toggle="tab">Edit</a>
			            </li>
			        </div>
		        </ul>

		        <br/>

				<div className="container-fluid">
					<div className="row">
			            <div className="col-2">
			            </div>

			            <div className="col-8">
							<div id="myTabContent" className="tab-content">
					            <div className={"tab-pane fade" + (this.state.currentSubNav === 'Create' ? " active show" : "")} id="home">
					             	<h4>Card Type</h4>
					             	<p>Choose a type of card layout.</p>

					             	<div className="row">
					             		<div className="col-3">
							             	<div className={isLightSelected} onClick={this.deckTypeClick.bind(this, 'light')}>
											  <div className="card-header">
											  	&nbsp;A
											  	<img className="top-suit" alt="card-suit" src={heartsImg}/>
											  </div>
											  <div className="card-body">
											    <h4 className="card-title">Light card example</h4>
											    <div className="card-div container">
											    	<img className="card-image img-fluid" src={phelpsImg} alt="phelps"/>
											    </div>
											    <div className="container">
												    <p className="card-text">
												    	<b>Name:</b> Michael Phelps <br/>
												    	<b>Action1:</b> swimming <br/>
												    	<b>Action2:</b> smoking kush <br/>
												    </p>
												</div>
											  </div>
											  <div className="card-footer text-right">
											  	<img className="bottom-suit" alt="card-suit" src={heartsImg}/>
											  	A&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
											  </div> 
											</div>
										</div>

										<div className="col-3">
											<div className={isDarkSelected} onClick={this.deckTypeClick.bind(this, 'dark')}>
											  <div className="card-header">
											  	&nbsp;A
											  	<img className="top-suit" alt="card-suit" src={spadesWhiteImg}/>
											  </div>
											  <div className="card-body">
											    <h4 className="card-title">Dark card example</h4>
											    <div className="card-div">
											    	<img className="card-image img-fluid" src={usainBoltImg} alt="usain-bolt"/>
											    </div>
											    <p className="card-text">
											    	<b>Name:</b> Usain Bolt <br/>
											    	<b>Action1:</b> running <br/>
											    	<b>Action2:</b> jumping real high <br/>
											    </p>
											  </div>
											  <div className="card-footer text-right">
											  	<img className="bottom-suit" alt="card-suit" src={spadesWhiteImg}/>
											  	A&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
											  </div>
											</div>
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

					            <div className={"tab-pane fade" + (this.state.currentSubNav === 'Edit' ? " active show" : "")} id="profile">
					              <p>Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit.</p>
					            </div>
					        </div>
					    </div>

			            <div className="col-2">
			            </div>
			        </div>
			    </div>
			</div>
		);
	}
}

export default Manager;