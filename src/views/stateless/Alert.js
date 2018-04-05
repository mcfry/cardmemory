// Libraries
import React from "react";

// Css
import './Alert.css';

const Alert = ({ alertType, alertMessage }) => (
  	<div className={"alert alert-dismissible alert-"+alertType}>
	  <button type="button" className="close" data-dismiss="alert">&times;</button>
	  {alertMessage}
	</div>
)

export default Alert;