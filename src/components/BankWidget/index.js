import React from 'react';

const BankWidget = () => {
  return (
    <div className="bankwidget">
      <h1>Choose your bank to start payment</h1>
      <form className="bankform">
        <label className="select-label">
          <select className="form-select block w-full mt-1">
            <option>- Choose bank</option>
            <option>Guaranty Trust Bank</option>
            <option>Zenith Bank</option>
          </select>
          <svg className="custom-select-icon" width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M14.0774 0.0773926L15.2559 1.2559L7.99994 8.51183L0.744019 1.2559L1.92253 0.0773926L7.99994 6.1548L14.0774 0.0773926Z" fill="#91979F" />
          </svg>
        </label>
        <label>
          <input className="account-number" placeholder="Enter account number" />
        </label>
        <button className="auth-account-btn">
          Authenticate
          <svg className="auth-account-btn-icon" width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M5.76438 6.51862L0 1.05876L1.11781 0L8 6.51862L1.11781 13.0372L0 11.9785L5.76438 6.51862Z" fill="white" />
          </svg>
        </button>
      </form>
    </div>
  );
}

export default BankWidget;
