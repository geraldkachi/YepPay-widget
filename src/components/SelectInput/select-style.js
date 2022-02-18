export const selectStyles = {
	control: (styles: any, state: any) => ({
		...styles,
		backgroundColor: "transparent",
		color: "#5D627B",
		fontFamily: "inherit",
		padding: 0,
		fontSize: "15px",
		position: "relative",
		top: "-10px",
		borderRadius: "5px",
		borderColor: "transparent",
		minWidth: "130px",
		borderWidth: "none",
		outline: "none",
		boxShadow: "none",
		height: 20,
		":hover": {
			...styles[":hover"],
			ouline: "none",
			border: "none",
			boxShadow: "none",
			// backgroundColor: "#edf2f7",
		},
		// boxShadow: state.isFocused ? 0 : 0,
		"&:hover": {
			ouline: "none",
			border: "none",
			boxShadow: "none",
		},
	}),

	menu: (styles: any, state: any) => ({
		...styles,
		zIndex: 1000,
		top: "65%",
	}),
	singleValue: (styles: any, state: any) => ({
		...styles,
		color: "#5D627B",
	}),
	placeholder: (styles: any) => ({
		...styles,

		color: "#5D627B",
	}),

	option: (styles: any) => {
		return {
			...styles,
			backgroundColor: "#fff",

			cursor: "pointer",
			color: "#718096",

			border: "none",
			outline: "none",

			":active": {
				...styles[":active"],
				backgroundColor: "#F4F5F6",
			},
			":hover": {
				...styles[":hover"],
				backgroundColor: "#F4F5F6",
				border: "none",
				boxShadow: "none",
				outline: "none",
			},
		};
	},
};
