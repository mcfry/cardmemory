import React from "react";
import classNames from 'classnames';

class SuitButton extends React.PureComponent {
	render() {
		const {active, suit, suitClick, blackImg, whiteImg} = this.props;

		return (
			<button className={classNames('list-group-item', 'list-group-item-action', { active: active})} onClick={suitClick}>
			  	{!active ? (
			    	<img className="card-nav-suit" alt="hearts" src={blackImg}/>
			    ) : (
			    	<img className="card-nav-suit" alt="hearts" src={whiteImg}/>
				)}
			    &nbsp;<span>{suit.charAt(0).toUpperCase() + suit.substr(1)}</span>
		  	</button>
		);
	}
}

export default SuitButton;