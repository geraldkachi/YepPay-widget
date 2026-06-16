import React, { useState, useEffect, useRef } from "react";
import OtpInput from "react-otp-input";
import { useHistory } from "react-router-dom";
import { urls } from "../../utils/urls";
import Spinner from "../../components/Spinner";
import { usePaymentContext } from "../../context/PaymentContext";
import { payWithCard } from "../../services/card";

// Utility function to get device information
export const getDeviceInformation = () => ({
  httpBrowserLanguage: navigator.language || navigator.userLanguage,
  httpBrowserJavaEnabled: typeof navigator.javaEnabled === "function" ? navigator.javaEnabled() : false,
  httpBrowserJavaScriptEnabled: true,
  httpBrowserColorDepth: window.screen.colorDepth,
  httpBrowserScreenHeight: window.screen.height,
  httpBrowserScreenWidth: window.screen.width,
  httpBrowserTimeDifference: new Date().getTimezoneOffset(),
  userAgentBrowserValue: navigator.userAgent,
  deviceChannel: /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : /Tablet|iPad/i.test(navigator.userAgent) ? "Tablet" : "Browser",
});

const CardPin = ({ accessCode }) => {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [customHtml, setCustomHtml] = useState("");
  const history = useHistory();
  const paymentContext = usePaymentContext();
  const htmlContainerRef = useRef(null);
  const [threeDSecureData, setThreeDSecureData] = useState(null);

  const handleChange = (val) => setPin(val);

  const submitPin = async (pin, cardInfo) => {
    const payload = { pin, ...cardInfo, ...getDeviceInformation() };
    paymentContext.setGrabPin(payload)

    setLoading(true);

    try {
      const response = await payWithCard(payload);
      if (!response.status) {
        throw new Error(response.message || "Payment failed");
      }

      const { data } = response;
      paymentContext.setPayment((prev) => ({ ...prev, pin }));
      paymentContext.setSuccessMessage(response.message);
      paymentContext.setReference(data.reference);

      if (data.responseCode === "T0" || data.responseCode === "M0" || data.responseCode !== "S0") {
        paymentContext.setCardPayDetails({
          amount: data.amount,
          transaction_ref: data.transactionRef,
          payment_id: data.paymentId,
          reference: data.reference,
        });
        history.push(urls.otp(accessCode, data.reference, "?type=card"));
      } 
      
      if (data.responseCode === "S0") {
        paymentContext.setCardPayDetails({
          amount: data.amount,
          transaction_ref: data.transactionRef,
          payment_id: data.paymentId,
          reference: data.reference,
          eciFlag: data.eciFlag,
          transactionId: data.transactionId,
          jwt: data.jwt,
          MD: data.MD,
          ACSUrl: data.ACSUrl,
          TermUrl: data?.TermUrl,
        });

        if (data.customisedHtml) {
          setCustomHtml(data.customisedHtml);
        } else if (data.ACSUrl) {
          setThreeDSecureData({
            ACSUrl: data.ACSUrl,
            jwt: data.jwt,
            MD: data.MD,
          });
        }
      }
    } catch (error) {
      paymentContext.setPayment({});
      paymentContext.setErrorMessage(error.message);
      history.push(urls.failure(accessCode));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pin.trim().length === 4) {
      submitPin(pin, paymentContext.cardInfo);
    }
  }, [pin]);

  useEffect(() => {
    if (customHtml && htmlContainerRef.current) {
      htmlContainerRef.current.innerHTML = customHtml;
      const form = htmlContainerRef.current.querySelector("form");
      if (form) form.submit();
    }
  }, [customHtml]);

  return (
    <div className="cardpaymentwidget">
      {loading && (
        <div className="card-pin-loader">
          <Spinner height="40" width="40" colour="#0066FF" />
        </div>
      )}
      {customHtml ? (
        <div className="h-screen flex justify-center items-center">
          <div ref={htmlContainerRef} dangerouslySetInnerHTML={{ __html: customHtml }} />
        </div>
      ) : 
	  threeDSecureData ? (
        <div className="h-screen flex justify-center items-center">
          <form method="POST" action={threeDSecureData.ACSUrl} id="threeDSecureForm">
            <input type="hidden" name="JWT" value={threeDSecureData.jwt} />
            <input type="hidden" name="MD" value={threeDSecureData.MD} />
          </form>
          <script>
            {document.getElementById("threeDSecureForm")?.submit()}
          </script>
        </div>
      ) :
	  threeDSecureData ? 
		<div className="h-screen flex justify-center items-center">
		  {/* Iframe for 3D Secure authentication */}
		  <iframe
			name="secureIframe"
			className="w-full max-w-lg h-[600px] border rounded-lg"
		  ></iframe>
	  
		  {/* Hidden form that submits inside the iframe */}
		  <form
			method="POST"
			action={threeDSecureData.ACSUrl}
			target="secureIframe"
			id="threeDSecureForm"
			className="hidden"
		  >
			<input type="hidden" name="JWT" value={threeDSecureData.jwt} />
			<input type="hidden" name="MD" value={threeDSecureData.MD} />
		  </form>
	  
		  {/* Auto-submit form after rendering */}
		  <script>
			{setTimeout(() => {
			  document.getElementById("threeDSecureForm")?.submit();
			}, 500)}
		  </script>
		</div> 
		:
	  
	  ("")}
        <>
          <h1 className="text-b" style={{ textAlign: "center", width: "254px", margin: "0px auto" }}>
            Please enter your 4 digit card pin to authorize this transaction
          </h1>
          <OtpInput
            value={pin}
            onChange={handleChange}
            numInputs={4}
            separator={""}
            containerStyle="card-pin"
            isInputSecure={true}
            isInputNum={true}
            inputStyle="card-pin-input"
          />
        </>
    </div>
  );
};

export default CardPin;