// Libraries
import React from "react";
import { observable } from "mobx";
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';

// Components
import Alert from '../../basic_components/Alert';

// Images

// Css

// Non-render state
let alerts = {};
let alerts_queue = [];

@withRouter @inject((RootStore) => {
	return {
		Alert: RootStore.AlertStore
	}
}) @observer
class AlertMain extends React.Component {

	@observable index = 0;

	constructor(props) {
		super(props);
		alerts = {};

		// Func Binds

		// Refs
	}

	componentWillUpdate() {
		let new_alerts = [];
		let explulsed_alert_keys = {};

		let sessionAlerts = sessionStorage.getArrayAndClear("alerts", 800) || [];
		for (const alert of sessionAlerts) {
			if (alert.message in alerts) {
				alerts[alert.message].childRef.current.resetAlert();

				explulsed_alert_keys[alert.message] = true;
				new_alerts.push(alerts[alert.message]);
			} else {
				alerts[alert.message] = alert;
				alerts[alert.message].index = Object.keys(alerts).length;
				alerts[alert.message].childRef = React.createRef();

				new_alerts.push(alerts[alert.message]);
			}
		}

		let old_queue = [];
		if (Object.keys(explulsed_alert_keys).length > 0) {
			for (let qd_alert of alerts_queue) {
				if (!(qd_alert.message in explulsed_alert_keys)) {
					old_queue.push(qd_alert);
				}
			}	
		} else {
			old_queue = alerts_queue;
		}

		alerts_queue = new_alerts.concat(old_queue);
	}

	render() {
		// Pre-render logic
		const alertsToRender = [];
	    if (Object.keys(alerts).length !== 0) {
	    	for (let aq of alerts_queue) {
	    		alertsToRender.push(
	    			<Alert key={aq.index} alertType={aq.type} alertMessage={aq.message} ref={alerts[aq.message].childRef} />
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