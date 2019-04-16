import React from "react";

class ScoreList extends React.PureComponent {
	render() {
		const { bestTimes } = this.props;
		let difficultyStr = '';
		let difficultyObj = null;

		if (bestTimes.easy !== undefined) {
			difficultyStr = 'Easy';
			difficultyObj = bestTimes.easy;
		} else if (bestTimes.medium !== undefined) {
			difficultyStr = 'Medium';
			difficultyObj = bestTimes.medium;
		} else if (bestTimes.hard !== undefined) {
			difficultyStr = 'Hard';
			difficultyObj = bestTimes.hard;
		}

		return (
			<div className="list-group" style={{'paddingBottom': '20px'}}>
				<div>
					<h1 style={{'marginLeft': '20px'}}>{difficultyStr}</h1>
				</div>
				{difficultyObj.map((time, index) => {
					return (
						<button key={index} className="list-group-item list-group-item-center">
						    <span className="scoreboard-col"><i className="fa fa-clock-o"></i>&nbsp;Seconds: {time.seconds}</span>
						    <span className="scoreboard-col"><i className="fa fa-times"></i>&nbsp;Mistakes: {time.mistakes}</span>
						</button>
					)
				})}
			</div>
		);
	}
}

export default ScoreList;