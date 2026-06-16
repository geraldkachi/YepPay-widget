import React from 'react';
import PropTypes from 'prop-types';
import Spinner from '../Spinner';

const ActionButton = ({
	className,
	children,
	onClick,
	loading,
	testId,
	disabled,
	spinColour,
}) => (
	<button
		data-testid={testId}
		type="button"
		onClick={onClick}
		className={`flex items-center ${className} ${
			disabled ? "button-disabled" : ""
		}`}
		disabled={disabled || loading}
	>
		{loading ? (
			<span className="w-full centralize">
				<Spinner height="20" width="20" colour={spinColour} />
			</span>
		) : (
			<>{children}</>
		)}
	</button>
);

ActionButton.propTypes = {
  testId: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  spinColour: PropTypes.string,
};

ActionButton.defaultProps = {
  className: '',
  disabled: false,
  loading: false,
  spinColour: '#F12F58',
}

export default ActionButton;
