import React, { useRef, useState, useMemo } from "react";
import ArrowDown from "../../assets/chevron-down.svg";
import useDebounce from "../../hooks/useDebounce";
import useOnClickOutside from "../../hooks/useOnClickOutside";


const UssdBankDropdown = ({ selected, list }) => {
	const showDropDown = useState(false);
	const searchValue = useState("");
	const dropdownRef = useRef(null);

	const debouncedValue = useDebounce(searchValue[0], 100);

	const toggleState = () => {
		showDropDown[1]((prev) => !prev);
	};

	const _bankList = useMemo(() => {
		return debouncedValue.trim()
			? list.filter((item) => {
					return item?.bankName?.toLowerCase()?.includes(debouncedValue?.toLowerCase());
			  })
			: list;
	}, [debouncedValue, list]);

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
				<span>{selected[0].bankName}</span>
				<img src={ArrowDown} alt="" />
			</button>

			{showDropDown[0] && (
				<div className="options-wrapper">
					<input
						value={searchValue[0]}
						onChange={handleInputChange}
						type="text"
						placeholder="Search bank..."
					/>
					{!hasResult && debouncedValue.trim() && (
						<div className="no-result">No match found.</div>
					)}
					{!hasResult && !debouncedValue.trim() && (
						<div className="no-result">Bank List empty.</div>
					)}
					{hasResult && (
						<ul className="bank-list custom-scrollbar">
							{_bankList.map((bank, index) => {
								return (
									<li
										key={`bankList${index}`}
										onClick={() => {
											selected[1](bank);
											searchValue[1]("");
											toggleState();
										}}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
											  selected[1](bank);
											  searchValue[1]("");
											  toggleState();
											}
										  }}
										  role="option"
										  tabIndex={0}
										   className="bank-item"
									>
										{bank.bankName}
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
