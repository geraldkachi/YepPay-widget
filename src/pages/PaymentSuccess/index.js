import React, { useEffect, useState, useRef } from "react";
import AnimatedSuccessCheckmark from "../../components/AnimatedSuccessCheckmark";
import WidgetFooter from "../../components/WidgetFooter";
import { usePaymentContext } from "../../context/PaymentContext";
import { Redirect, useHistory, useParams } from "react-router-dom";
import useInterval from "../../hooks/useInterval";
import { customerConfirmCode } from "../../services/offline_transfer";
import toast from "react-hot-toast";

function secondsToTime(secs) {
  let divisor_for_minutes = secs % (60 * 60);
  let divisor_for_seconds = divisor_for_minutes % 60;
  let seconds = Math.ceil(divisor_for_seconds);
  return { seconds };
}

const timeToRedirect = 4;

const PaymentSuccess = () => {
  const history = useHistory();
  const paymentContext = usePaymentContext();
  const { payment, paymentDetail, setPayment, customerCode } = paymentContext;
  const { accessCode } = useParams();

  const [count, setCount] = useState(timeToRedirect);
  const [isCounting, setIsCounting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiSuccess, setApiSuccess] = useState(false);
  const [apiComplete, setApiComplete] = useState(false);

  const apiCalledRef = useRef(false);

  // Derived — always fresh, never stale from useState init
  const allowRedirect =
    !paymentDetail?.callback_type ||
    paymentDetail.callback_type === "callback";

  // Must redirect check FIRST — before any hooks or loading screens
  // (we do this after hooks but before any early return that could skip hooks)

  const returnHome = () => {
    setPayment({});
    return history.push(`/${accessCode}`);
  };

  const openCallbackUrl = () => {
    if (payment?.callback_url) {
      return window.location.replace(payment.callback_url);
    }
    return returnHome();
  };

  const sendCustomerCode = async () => {
    if (apiCalledRef.current) return;
    apiCalledRef.current = true;

    // No customerCode or reference — skip API, proceed directly
    if (!customerCode || !paymentDetail?.reference) {
      setApiSuccess(true);
      setApiComplete(true);
      setIsLoading(false);
      if (allowRedirect) setIsCounting(true);
      return;
    }

    let success = false; // local variable — avoids stale state reads in finally

    try {
      const payload = {
        customer_code: customerCode,
        reference: paymentDetail.reference,
      };

      const updateResponse = await customerConfirmCode(payload);

      if (updateResponse?.status) {
        toast.success("Customer code updated successfully.");
        success = true;
      } else {
        toast.error("Failed to update customer code.");
      }
    } catch (error) {
      console.error("Error updating customer code:", error);
      toast.error("Error updating customer code.");
    } finally {
      // Use local `success` var — state setter hasn't flushed yet at this point
      setApiSuccess(success);
      setApiComplete(true);
      setIsLoading(false);

      if (allowRedirect && success) {
        setIsCounting(true);
      }
    }
  };

  const handleRetry = () => {
    setApiComplete(false);
    setApiSuccess(false);
    setIsLoading(true);
    apiCalledRef.current = false;
    sendCustomerCode();
  };

  useEffect(() => {
    sendCustomerCode();
  }, []); 
  
  // Countdown — only runs when isCounting is true (set only after API resolves)
  useInterval(
    () => {
      if (count > 1) {
        setCount((c) => c - 1); // updater form — avoids stale closure bug
      } else {
        setIsCounting(false);
        openCallbackUrl();
      }
    },
    isCounting ? 1000 : null
  );

  // Guard: no payment means user landed here directly — redirect home
  if (!payment?.amount) {
    return <Redirect to={`/${accessCode}`} />;
  }

  // Loading screen — shown while API call is in flight
  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <div className="text-center">
          <div className="justify-center flex mb-4">
            <div
              className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-red-600"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
          <p>Finalizing transaction...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait, redirecting shortly.</p>
        </div>
      </div>
    );
  }

  // Error screen — API completed but failed (only when customerCode was present)
  if (apiComplete && !apiSuccess && customerCode) {
    return (
      <div className="h-full flex justify-center items-center">
        <div className="paymentstatus mt-50">
          <div className="w-full flex justify-center">
            <div className="icon-wrapper">
              <AnimatedSuccessCheckmark />
            </div>
          </div>
          <div className="paymentstatus-content">
            <p>Payment Successful</p>
            <span>You have successfully completed the payment of</span>
            <h1>
              {payment.currency || "NGN"} {payment.amount}
            </h1>
            <div className="redirect-wrapper" style={{ marginTop: "20px" }}>
              <div style={{ color: "#e74c3c", marginBottom: "15px" }}>
                ⚠️ Your payment was successful but we could not update your
                record. Please try again.
              </div>
              <button
                onClick={handleRetry}
                style={{
                  background: "#0066FF",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Retry Update
              </button>
            </div>
          </div>
          <div className="pt-120">
            <WidgetFooter onClick={returnHome} verb="Dismiss" />
          </div>
        </div>
      </div>
    );
  }

  const { seconds } = secondsToTime(count);

  return (
    <div className="h-full flex justify-center items-center">
      <div className="paymentstatus mt-50">
        <div className="w-full flex justify-center">
          <div className="icon-wrapper">
            <AnimatedSuccessCheckmark />
          </div>
        </div>
        <div className="paymentstatus-content">
          <p>Payment Successful</p>
          <span>You have successfully completed the payment of</span>
          <h1>
            {payment.currency || "NGN"} {payment.amount}
          </h1>

          {allowRedirect && apiSuccess && (
            <div className="redirect-wrapper">
              <span className="redirect-button">
                <span className="redirect-text">Redirects in: </span>
                <span className="redirect-timer">
                  {`${seconds < 10 ? "0" : ""}${seconds}`}
                </span>
              </span>
            </div>
          )}
        </div>

        <div className="pt-120">
          <WidgetFooter
            onClick={() => {
              if (allowRedirect && apiSuccess) {
                openCallbackUrl();
              } else {
                returnHome();
              }
            }}
            verb="Dismiss"
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;