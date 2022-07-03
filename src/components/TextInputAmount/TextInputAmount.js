import React, { useState } from "react";

import NumberFormat from "react-number-format";

const TextInputAmount = ({ onChange, error, onBlur, label = "ADDRESS" }) => {
	const amount = useState("");

	// const onlyNumbers = e.target.value.replace(/[^\d\.]/g, "");
	// 					if (isNaN(onlyNumbers)) {
	// 						return;
	// 					} else {

	// 						val[1](onlyNumbers);
	// 					}

	return (
		<div className="textInputWithLabel-wrapper">
			<label>{label}</label>
			<NumberFormat
				placeholder="0.00"
				onBlur={onBlur}
				thousandsGroupStyle="thousand"
				thousandSeparator={true}
				decimalSeparator="."
				decimalScale={2}
				prefix={"₦"}
				// maxLength={10}
				fixedDecimalScale={true}
				allowNegative={false}
				value={amount[0]}
				onValueChange={(e) => {
					amount[1](e.formattedValue);
					onChange(e.value);
					console.log(e);
				}}
			/>
			{error && <p className="error">{error}</p>}
		</div>
	);
};

export default TextInputAmount;
