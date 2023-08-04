import React from "react";

class Select extends React.PureComponent {
	render() {
		let { ref, placeholder, placeholderValue, options } = this.props;

		return (
			<div className="form-group">
				<select className="custom-select" defaultValue={placeholderValue} ref={ref}>
			      <option value={placeholderValue} disabled>{placeholder}</option>
			      {options.map(
			      	(option, index) => {
				      	return (<option key={index} value={option}>
				      				{option}
				      			</option>)
			      	}
			      )}
			    </select>
			</div>
		);
	}
}

export default Select;