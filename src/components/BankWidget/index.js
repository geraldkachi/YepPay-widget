import React from 'react';

const BankWidget = () => {
  return (
    <div className="bankwidget">
      <h1>Choose your bank to start payment</h1>
      <form className="bankform">
        <label class="select-label">
          <select class="form-select block w-full mt-1">
            <option>- Choose bank</option>
            <option>Guaranty Trust Bank</option>
            <option>Zenith Bank</option>
          </select>
          <svg className="custom-select-icon" width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0774 0.0773926L15.2559 1.2559L7.99994 8.51183L0.744019 1.2559L1.92253 0.0773926L7.99994 6.1548L14.0774 0.0773926Z" fill="#91979F" />
          </svg>
        </label>
        <label>
          <input className="account-number" placeholder="Enter account number" />
        </label>
      </form>
    </div>
  );
}

export default BankWidget;
