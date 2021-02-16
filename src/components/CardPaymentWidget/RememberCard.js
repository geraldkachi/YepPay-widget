import React from 'react';
import MasterCardSmall from '../../assets/mastercard.svg';
import VisaCardSm from '../../assets/visacard.svg';

const RememberCard = () => {
  return (
    <div className="remembercard-collections">
      <button className="remembercard" type="button">
        <button type="button">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.2999 10.2998L3.70019 3.70017" stroke="#1D1B1B" strokeLinecap="round" />
            <path d="M10.2998 3.70017L3.70014 10.2998" stroke="#1D1B1B" strokeLinecap="round" />
          </svg>
        </button>
        <span>8940</span>
        <img src={MasterCardSmall} alt="Debit Card Icon" />
      </button>
      <button className="remembercard" type="button">
        <button type="button">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.2999 10.2998L3.70019 3.70017" stroke="#1D1B1B" strokeLinecap="round" />
            <path d="M10.2998 3.70017L3.70014 10.2998" stroke="#1D1B1B" strokeLinecap="round" />
          </svg>
        </button>
        <span>8940</span>
        <img src={MasterCardSmall} alt="Debit Card Icon" />
      </button>
      <button type="button" className="remembercard">
        <button type="button">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.2999 10.2998L3.70019 3.70017" stroke="#1D1B1B" strokeLinecap="round" />
            <path d="M10.2998 3.70017L3.70014 10.2998" stroke="#1D1B1B" strokeLinecap="round" />
          </svg>
        </button>
        <span>8056</span>
        <img src={VisaCardSm} alt="Debit Card Icon" />
      </button>
    </div>
  )
}
export default RememberCard;
