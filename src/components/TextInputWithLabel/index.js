import React, { useState } from "react";

import NumberFormat from "react-number-format";

const TextInputWithLabel = ({
	name,
	readOnly = false,
	disabled = false,
	onBlur,
	onChange,
	error,
	value,
	type = "text",
	placeholder = "Enter Address",
	label = "",
}) => {
	return (
		<div className="textInputWithLabel-wrapper">
			<label>{label}</label>

			<input
				type={type}
				onBlur={onBlur}
				readOnly={readOnly}
				disabled={disabled}
				id={name}
				name={name}
				onChange={onChange}
				value={value}
				placeholder={placeholder}
			/>
			{error && <p className="error">{error}</p>}
		</div>
	);
};

export default TextInputWithLabel;
