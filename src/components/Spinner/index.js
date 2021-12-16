import React from 'react';
import PropTypes from 'prop-types';

const Spinner = ({ width, height, colour }) => (
  <svg width={width} height={height} viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke={colour}>
    <g fill="none" fillRule="evenodd">
      <g transform="translate(1 1)" strokeWidth="2">
        <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
        <path d="M36 18c0-9.94-8.06-18-18-18">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 18 18"
            to="360 18 18"
            dur="1s"
            repeatCount="indefinite" />
        </path>
      </g>
    </g>
  </svg>
)

export default Spinner;

Spinner.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  colour: PropTypes.string,
};

Spinner.defaultProps = {
  width: '38',
  height: '38',
  colour: '#fff',
};