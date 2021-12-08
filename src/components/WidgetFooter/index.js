import React from 'react';
import PropTypes from 'prop-types';

const WidgetFooter = ({verb, onClick }) => {
  return (
    <div className="widget-footer flex justify-center items-center">
      <button className="flex items-center" onClick={onClick}>
        <span>
          <svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.7713 13.8792L4.22879 4.98603" stroke="#162858" strokeLinecap="round" />
            <path d="M11.7712 4.98603L4.22874 13.8792" stroke="#162858" strokeLinecap="round" />
          </svg>
        </span>
        <span>{verb}</span>
      </button>
    </div>
  )
}

export default WidgetFooter;

WidgetFooter.propTypes = {
  verb: PropTypes.string,
  onClick: PropTypes.func
};
