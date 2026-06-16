import React from "react";

const TextInput = ({
	name,
	onChange,
	value,
	type = "text",
	placeholder = "Enter Address",
	label = "ADDRESS",
	maxLength,
}) => {
	return (
		<div className="custom-text-wrapper">
			<label>{label}</label>
			<input
				type={type}
				name={name}
				id={name}
				onChange={onChange}
				placeholder={placeholder}
				maxLength={maxLength}
			/>
		</div>
	);
};

export default TextInput;
