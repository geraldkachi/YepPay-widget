import React, { useState, useEffect } from "react";
import CopyIcon from "../../assets/copy-icon.svg";

const MultipayPage = ({ paymentDetail }) => {
  const [copied, setCopied] = useState(false);

  // Determine the base URL based on the current environment
  const getBaseUrl = () => {
    // Check if we're in production (live) environment
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Check for custom environment variables that indicate the environment
    if (process.env.REACT_APP_BACKEND_URL) {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      
      // If the backend URL contains 'staging', use staging verification URL
      if (backendUrl.includes('staging')) {
        return 'https://staging-business.ce-nextgen.com';
      }
      
      // If the backend URL doesn't contain 'staging', assume it's production
      return 'https://payfixy.co';
    }
    
    // Fallback: use staging for development, production for production build
    return isProduction ? 'https://payfixy.co' : 'https://staging-business.ce-nextgen.com';
  };

  const baseUrl = getBaseUrl();
  const verificationUrl = `${baseUrl}/multi-pay/verify`;

  const copyText = async (val) => {
    const el = document.createElement("textarea");
    el.value = val;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.opacity = 0;
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    el.setSelectionRange(0, 99999);
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleVerificationClick = (e) => {
    e.preventDefault();
    if (paymentDetail?.reference) {
      copyText(paymentDetail.reference);
       // Open the verification URL with the reference as a query parameter
      const urlWithReference = `${verificationUrl}?${paymentDetail.reference}`;
      window.open(urlWithReference, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="offline">
      <h4 className="text-2xl font-bold" style={{ marginTop: '.7rem', fontSize: '1rem' }}>
        Make a single payment for multiple transactions
      </h4>
      
      <div className="offline-account-details-wrapper">
        <div className="offline-account-name-wrapper">
          <div className="">
            <h6 className="offline-account-number-title">
              1. Copy Transaction Reference
            </h6>
            <p className="offline-account-number-value">
              {paymentDetail?.reference}
            </p>
          </div>
          <div className="offline-copy">
            {copied && (
              <span className="ussd-copied-text">
                Reference Copied
              </span>
            )}
            <img
              onClick={() => copyText(paymentDetail?.reference)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  copyText(paymentDetail?.reference);
                }
              }}
              src={CopyIcon}
              alt="Copy reference number"
              tabIndex={0} 
              role="button" 
              aria-label="Copy reference number"
            />
          </div>
        </div>

        <div className="">
          <div className="offline-bank-name-wrapper">
            <h6 className="">2. Visit Verification Page</h6>
            <p className="" style={{ fontSize: '0.9rem' }}>
              Click <a 
                href={verificationUrl}
                rel="noopener noreferrer"
                style={{ color: '#0066FF', fontWeight: 'bold' }}
                onClick={handleVerificationClick}
              >
                {verificationUrl}
              </a> and paste the transaction references here
            </p>
            <p className="offline-details" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
              You can paste up to 5 transaction references from different applications and pay all at once
            </p>
          </div>

          <div className="offline-bank-name-wrapper" style={{ marginTop: '1rem',  fontSize: '0.9rem' }}>
            <h6 className="">3. Complete Your Payment</h6>
            <p className="" style={{ marginTop: '0.5rem',  fontSize: '0.9rem' }}>
              Pay all at once and receive value for each transaction
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipayPage;