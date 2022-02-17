import React from "react";
import Select from "react-select";
import { selectStyles } from "./select-style";

const SelectInput = ({
	label,
	placeholder = "Choose Country",
	onChange = () => {},
	onBlur = () => {},
	options = [],
	value = "",

	loading = false,

	name,
	...props
}) => {
	return (
		<div className="custom-select-wrapper">
			<label>{label}</label>
			<Select
				{...props}
				isLoading={loading}
				closeMenuOnSelect={true}
				components={{
					IndicatorSeparator: () => null,
					ClearIndicator: () => null,
				}}
				name={name}
				onChange={onChange}
				onBlur={onBlur}
				placeholder={placeholder}
				value={value}
				isSearchable={true}
				isClearable
				// isDisabled={true}
				// defaultValue={null}

				options={options}
				styles={selectStyles}
			/>
		</div>
	);
};

export default SelectInput;
