import React, { useRef, useState, useMemo } from "react";
import ArrowDown from "../../assets/chevron-down.svg";
import useDebounce from "../../hooks/useDebounce";
import useOnClickOutside from "../../hooks/useOnClickOutside";

const dummyData = [
	{ name: "Access Bank", code: "*756#" },
	{ name: "GT Bank", code: "*756#" },
	{ name: "Providus Bank", code: "*756#" },
	{ name: "First Bank", code: "*756#" },
	{ name: "Polaris Bank", code: "*756#" },
	{ name: "Globus Bank", code: "*756#" },
	{ name: "Zenith Bank", code: "*756#" },
	{ name: "FCMB", code: "*756#" },
	{ name: "Kuda Bank", code: "*756#" },
	{ name: "Wema Bank", code: "*756#" },
];

const UssdBankDropdown = ({ selected }) => {
	const showDropDown = useState(false);
	const searchValue = useState("");
	const dropdownRef = useRef(null);

	const debouncedValue = useDebounce(searchValue[0], 100);

	const toggleState = () => {
		showDropDown[1]((prev) => !prev);
	};

	const _bankList = useMemo(() => {
		return debouncedValue.trim()
			? dummyData.filter((item) => {
					return item.name
						.toLocaleLowerCase()
						.includes(debouncedValue);
			  })
			: dummyData;
	}, [debouncedValue]);

	const hasResult = _bankList.length > 0;

	const handleInputChange = (e) => {
		searchValue[1](e.target.value);
	};

	useOnClickOutside(dropdownRef, () => {
		showDropDown[1](false);
		searchValue[1]("");
	});
	return (
		<div ref={dropdownRef} className="ussd-dropdown-wrapper">
			<button onClick={toggleState} className="trigger">
				<span>{selected[0].name}</span>
				<img src={ArrowDown} alt="" />
			</button>

			{showDropDown[0] && (
				<div className="options-wrapper">
					<input
						value={searchValue[0]}
						onChange={handleInputChange}
						type="text"
					/>
					{!hasResult && (
						<div className="no-result">No match found.</div>
					)}
					{hasResult && (
						<ul className="bank-list custom-scrollbar">
							{_bankList.map((bank, index) => {
								return (
									<li
										onClick={() => {
											selected[1](bank);
											searchValue[1]("");
											toggleState();
										}}
										key={`bankList${index}`}
									>
										{bank.name}
									</li>
								);
							})}
						</ul>
					)}
				</div>
			)}
		</div>
	);
};

export default UssdBankDropdown;
