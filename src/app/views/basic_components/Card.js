// Libraries
import React from 'react';
import { observer} from 'mobx-react';

// Css
import './Card.css';

// Make it an observer so we can dereference observables in this component and trigger render
@observer
class Card extends React.Component {
	normallizeDenom(denom) {
		if (denom === 'Ace') {
			return 'A';
		} else if (denom === 'King') {
			return 'K';
		} else if (denom === 'Queen') {
			return 'Q';
		} else if (denom === 'Jack') {
			return 'J';
		} else {
			return denom;
		}
	}

	bottomMarginHacky(denom) {
		if (denom === 'Queen') {
			return '-3px';
		} else if (denom === 'Jack') {
			return '9px';
		} else if (denom === '10') {
			return '-15px';
		} else {
			return '0px';
		}
	}

	render() {
		return (
			<React.Fragment>
				{!this.props.isCardBack ? (
					<div className={this.props.klasses} onClick={this.props.clickHandler}>
					  <div className="card-header">
					  	&nbsp;{this.normallizeDenom(this.props.cardDenom)}
					  	<img className="top-suit" alt="card-suit" src={this.props.cardSuitImg}/>
					  </div>
					  <div className="card-body">
					    {this.props.cardTitle ? <h4 className="card-title">{this.props.cardTitle}</h4> : <h4>&nbsp;</h4>}
					    <div className="card-div container">
					    	<div className="row">
					    		<div className="mx-auto">
					    			<img className="card-image img-fluid" src={this.props.cardImg} alt={this.props.cardImgAlt} />
					    		</div>
					    	</div>
					    </div>
					    <div className="container">
						    <p className="card-text">
						    	{this.props.cardName ? (<React.Fragment><b>Name:</b> {this.props.cardName} <br/></React.Fragment>) : <span>&nbsp;</span>}
						    	{this.props.action1 ? (<React.Fragment><b>Action:</b> {this.props.action1} <br/></React.Fragment>) : <span>&nbsp;</span>}
						    	{this.props.action2 ? (<React.Fragment><b>Object:</b> {this.props.action2} <br/></React.Fragment>) : <span>&nbsp;</span>}
						    </p>
						</div>
					  </div>
					  <div className="card-footer text-right">
					  	<img className="bottom-suit" alt="card-suit" src={this.props.cardSuitImg}/>
					  	<span style={{marginLeft: this.bottomMarginHacky(this.props.cardDenom)}}>{this.normallizeDenom(this.props.cardDenom)}&nbsp;&nbsp;&nbsp;&nbsp;</span>
					  </div> 
					</div>
				) : (
					<div className={this.props.klasses} onClick={this.props.clickHandler}>
					  <img className="img-fluid" src={this.props.cardImg} alt={this.props.cardImgAlt} />
					</div>
				)}
			</React.Fragment>
		);
	}
}

export default Card;