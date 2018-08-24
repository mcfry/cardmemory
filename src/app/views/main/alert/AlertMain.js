// Libraries
import React from "react";
// import { observable } from "mobx";
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';

// Components
import Alert from '../../basic_components/Alert';

// Images

// Css

@withRouter @inject((RootStore) => {
	return {
		Alert: RootStore.AlertStore
	}
}) @observer
class AlertMain extends React.Component {

	constructor(props) {
		super(props);

		// Non-render state
		this.activeAlerts = {};
		this.alertsQueue = [];
		this.alertsTotal = 0;

		// Func Binds

		// Refs
	}

	componentWillUpdate() {
		let oldAlerts = [];
		for (let alert of this.alertsQueue) {
			if (alert.childRef.current && alert.childRef.current.state.alertOpen === false) {
				delete this.activeAlerts[alert.message];
			} else {
				oldAlerts.push(alert);
			}
		}

		let sessionAlerts = sessionStorage.getArrayAndClear("alerts", 0) || [];
		let nq = [];
		for (let alert of sessionAlerts) {
			if (alert.type !== undefined && alert.message !== undefined && !(alert.message in this.activeAlerts)) {
				alert.index = this.alertsTotal++;
				alert.childRef = React.createRef();
				nq.push(alert);
				this.activeAlerts[alert.message] = true;
			}
		}

		this.alertsQueue = nq.concat(oldAlerts);
	}

	render() {
		// NOTE: Sometimes rendered twice if uri changes

		// Pre-render logic
		const alertsToRender = [];
	    if (this.alertsQueue.length !== 0) {
	    	for (let aq of this.alertsQueue) {
	    		alertsToRender.push(
	    			<Alert key={aq.index} alertType={aq.type} alertMessage={aq.message} removeLast={this.removeLast} ref={aq.childRef}/>
	    		);
	    	}
	    }

	    let rerenderIfChanged = this.props.Alert.alertRender;

		return(
			<div className="container-fluid">
				<div hidden>{rerenderIfChanged.toString()}</div>

            	{alertsToRender.length === 0 ? '' : (
            		<div className='alerts-list'>
            			{alertsToRender}
            		</div>
            	)}
            </div>
		);
	}
}

export default AlertMain;