import React from 'react';

const USSDWidget = () => {
  return (
    <div className="ussdwidget">
      <h1 className="text-center">Choose your bank to start payment</h1>
      <div className="ussd-collections">
        <button type="button" className="ussdbutton">
          <span>Guaranty Trust Bank</span>
          <span>*737#</span>
        </button>
        <button type="button" className="ussdbutton">
          <span>Zenith Bank</span>
          <span>*966#</span>
        </button>
      </div>
    </div>
  )
}

export default USSDWidget;
