// Libraries
import React from 'react';

// Css
import './Card.css';

class Card extends React.Component {
	render() {
		return (
			<div className={this.props.klasses} onClick={this.props.clickHandler}>
			  <div className="card-header">
			  	&nbsp;A
			  	<img className="top-suit" alt="card-suit" src={this.props.cardSuitImg}/>
			  </div>
			  <div className="card-body">
			    <h4 className="card-title">{this.props.cardTitle}</h4>
			    <div className="card-div container">
			    	<img className="card-image img-fluid" src={this.props.cardImg} alt={this.props.cardImgAlt} />
			    </div>
			    <div className="container">
				    <p className="card-text">
				    	<b>Name:</b> {this.props.cardName} <br/>
				    	<b>Action1:</b> {this.props.action1} <br/>
				    	<b>Action2:</b> {this.props.action2} <br/>
				    </p>
				</div>
			  </div>
			  <div className="card-footer text-right">
			  	<img className="bottom-suit" alt="card-suit" src={this.props.cardSuitImg}/>
			  	A&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
			  </div> 
			</div>
		);
	}
}

export default Card;