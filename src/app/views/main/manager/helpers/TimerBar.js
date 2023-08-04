import React from "react";
import Timer from '../../../basic_components/Timer';

class TimerBar extends React.PureComponent {
	render() {
		let { memTimer, recallTimer, timerHeight, currentMode, 
			  currentMistakes, resetPractice, inProgressState, progressEnum } = this.props;

		return (<>
			<div className='timer-bar card no-border' style={{'height': timerHeight}}>
				<center>
					{inProgressState > progressEnum['NOT_STARTED'] && inProgressState <= progressEnum['FINISHED'] ? (
						currentMode === 'Flash Cards' ? 'Flash Timer' : 'Memory Timer'
					) : 'Timer'}:
				</center> <Timer ref={memTimer}/>

				{(inProgressState >= progressEnum['INTERMISSION'] && currentMode !== 'Flash Cards') && <>
					Recall timer: <Timer ref={recallTimer}/>
					Mistakes: <br/>
					<div className="mistakes">
						{currentMistakes === 0 ? (
							<b>None</b>
						) : (<>
							{Array.apply(null, 
								Array(currentMistakes)
							).map((_, mistake_number) => {
								return (
									<i key={mistake_number} className="fa fa-times mistake" aria-hidden="true"></i>
								)
							})}
						</>)}
					</div>
				</>}
			</div>

			{(inProgressState > progressEnum['NOT_STARTED'] 
				&& inProgressState < progressEnum['FINISHED']) && 
				<div className="pt-2">
					<button type="button" onClick={resetPractice} className="btn btn-danger" style={{'width': '134px'}}>
						Reset
					</button>
				</div>
			}
		</>);
	}
}

export default TimerBar;