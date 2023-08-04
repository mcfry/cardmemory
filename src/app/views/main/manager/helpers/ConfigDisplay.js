import React from "react";

class ConfigDisplay extends React.PureComponent {
	render() {
		let { configDisplay, currentMode, updateMode, selectMode, cardsFinished, difficulty,
			  validPalaces, selectNumber, selectMethod, selectAssist, startPractice, goButton } = this.props;

		// TODO: pass in all memory palaces, refactor in Select Component
		return (
			<div className={configDisplay}>
				<br/><br/>
				<div className="form-group">
				    <select className="custom-select" defaultValue="0" onChange={updateMode} ref={selectMode} autoFocus>
				      <option value="0" disabled>Review Mode</option>
				      {['Flash Cards', 'Memorize the Deck'].map((mode, index) => {
				      	return (<option key={index} value={mode}>
				      				{mode}
				      			</option>)
				      })}
				    </select>
				</div>

				{currentMode === 'Memorize the Deck' && <>
					<div className="form-group">
					    <select className="custom-select" defaultValue="0" ref={selectNumber}>
					      <option value="0" disabled>Number to memorize</option>
					      {[13,26,39,52].map((number, index) => {
					      	return (<option key={index} value={number} disabled={cardsFinished.length < number}>
					      				{difficulty(index)}: {number}
					      			</option>)
					      })}
					    </select>
					</div>

					<div className="form-group">
					    <select className="custom-select" defaultValue="0" ref={selectMethod}>
					      <option value="0" disabled>Recall method</option>
					      {['Suit and Denomination', 'Card Name'].map((method, index) => {
					      	return (<option key={index} value={method}>
					      				{method}
					      			</option>)
					      })}
					    </select>
					</div>

					<div className="form-group">
					    <select className="custom-select" defaultValue="0" ref={selectAssist}>
					      <option value="0" disabled>Memory palace</option>
					      {Object.keys(validPalaces).concat(['None']).map((assist, index) => {
					      	return (<option key={index} value={assist}>
					      				{assist}
					      			</option>)
					      })}
					    </select>
					</div>
				</>}

				<button type="button" onClick={startPractice} ref={goButton} className="btn btn-primary btn-danger practice-button-start">Go!</button>
			</div>
		);
	}
}

export default ConfigDisplay;

							