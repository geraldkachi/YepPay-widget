import React from 'react';
import { Link } from 'react-router-dom';

const USSDWidget = () => {
  return (
    <div className="ussdwidget">
      <h1 className="text-center">Choose your bank to start payment</h1>
      <div className="ussd-collections">
        <Link to="/ussd" type="button" className="ussdbutton">
          <span>Guaranty Trust Bank</span>
          <span>*737#</span>
        </Link>
        <Link to="/ussd" type="button" className="ussdbutton">
          <span>Zenith Bank</span>
          <span>*966#</span>
        </Link>
      </div>
    </div>
  )
}

export default USSDWidget;
