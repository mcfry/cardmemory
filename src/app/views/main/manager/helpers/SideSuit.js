import React from "react";

class SideSuit extends React.PureComponent {
	render() {
		const {klasses, suit, suitClick, blackImg, whiteImg} = this.props;
		return (
			<a className={klasses} onClick={suitClick}>
			  	{this.currentSuit !== suit ? (
			    	<img className="card-nav-suit" alt="hearts" src={blackImg}/>
			    ) : (
			    	<img className="card-nav-suit" alt="hearts" src={whiteImg}/>
				)}
			    &nbsp;<span>{suit.charAt(0).toUpperCase() + suit.substr(1)}</span>
		  	</a>
		);
	}
}

export default SideSuit;