import React, { useState, useEffect } from "react";
import ActionButton from "../../components/Button/ActionButton";
import SucccessCheck from "../../assets/success-check-icon.svg";
import Spinner from "../../components/Spinner";
import { useHistory, useParams } from "react-router-dom";
import { urls } from "../../utils/urls";
import { customerConfirmCode, generateDynamicAccountNumberValidate, logAsDisputeToBackend } from "../../services/offline_transfer";
import { usePaymentContext } from "../../context/PaymentContext";
import { useMutation } from "react-query";
import useInterval from "../../hooks/useInterval"; // Import the useInterval hook
import toast from "react-hot-toast";

function secondsToTime(secs) {
  let divisor_for_minutes = secs % (60 * 60);
  let minutes = Math.floor(divisor_for_minutes / 60);
  let divisor_for_seconds = divisor_for_minutes % 60;
  let seconds = Math.ceil(divisor_for_seconds);
  return { minutes, seconds };
}

const waitingTime = 180; // 5 minutes in seconds 

const ConfirmOfflinePayment = ({
  back,
  paymentConfirmed,
  setPaymentConfirmed,
  accountNumber,
  proceed,
  setExpiryTime,
  setHasAccountNumber,
  setAccountNumber,
  setBank,
  transactionRef,
  sessionId,
  paymentDetail
}) => {
  const [count, setCount] = useState(waitingTime);
  const [isCounting, setIsCounting] = useState(true);
  const history = useHistory();
  const { accessCode } = useParams();
  const paymentContext = usePaymentContext();
  // Mutation for validating the payment
  const { mutate: mutateValidate } = useMutation(
    async (body) => {
      const response = await generateDynamicAccountNumberValidate(body);
      return response;
    },
    {
      onSuccess: async (response) => {
        if (response?.status) {
            const { customerCode, paymentDetail } = paymentContext;
						if (customerCode) {
							try {
								const payload = {
									customer_code: customerCode,
									reference: paymentDetail?.reference || ""
								};

								const updateResponse = await customerConfirmCode(payload);

								if (updateResponse?.status) {
									toast.success('Customer code updated successfully.');
								} else {
									toast.error('Failed to update customer code.');
								}
							} catch (error) {
								console.error('❌ Error updating customer code:', error);
							}
						}
          paymentContext.setPayment({
						currency: response.data?.currency,
						amount: response.data?.amount,
						callback_url: response.data?.callback_url,
					});
          paymentContext.setSuccessMessage(response?.data?.message);
          history.push(urls.success(accessCode));
        } else {
          // If validation fails, log as dispute
          paymentContext.setErrorMessage(`${response?.error} ${response.message}`);
          history.push(urls.failure(accessCode));
          //   logAsDispute({ account_number: accountNumber });
        }
      },
      onError: (error) => {
        // If validation fails, log as dispute
        // logAsDispute({ account_number: accountNumber });
        paymentContext.setErrorMessage(`${error?.error} ${error?.message}`);
        history.push(urls.failure(accessCode));
      },
    }
  );

  // Function to validate the payment
  const validatePayment = () => {
    mutateValidate({
      transaction_reference: transactionRef,
      account_number: accountNumber,
      session_id: sessionId,
      customer_code: paymentContext?.customerCode || "",
      reference: paymentContext?.paymentDetail?.reference || "",
    }, 
    
);
  };

  // Countdown timer using useInterval
  useInterval(
    () => {
      if (count > 0) {
        setCount(count - 1);
      }
      if (count === 1) {
        setIsCounting(false);
        // Trigger validation when countdown ends
        validatePayment();
      }
    },
    isCounting && !paymentConfirmed ? 1000 : null
  );

  const { seconds, minutes } = secondsToTime(count);


  useEffect(() => {
      const eventName = "transaction.attempted";
      const channelName = `transaction${paymentDetail?.reference}`;
  
      let pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
        cluster: process.env.REACT_APP_CLUSTER,
      });
  
      if (accountNumber.trim()) {
        const channel = pusher.subscribe(channelName);
  
        channel.bind(eventName, async function (data) {
          if (data?.response) {
            if (data.response?.status) {
              const { customerCode } = paymentContext;
              // Stop the countdown
              setIsCounting(false);

              if (customerCode) {
                try {
                  const payload = {
                    customer_code: customerCode,
                    reference: paymentDetail.reference
                  };
                  const updateResponse = await customerConfirmCode(payload);
  
                  if (updateResponse?.status) {
                    toast.success('Customer code updated successfully.');
                  } else {
                    toast.error('Failed to update customer code.');
                  }
                } catch (error) {
                  console.error('❌ Error updating customer code:', error);
                }
              }
  
              setPaymentConfirmed(true);
              paymentContext.setPayment({
                currency: data?.response?.data?.currency,
                amount: data?.response?.data
                  ?.processed_amount_formatted,
                callback_url: data?.response?.data?.callback_url,
              });
              paymentContext.setSuccessMessage(data?.response?.message);
              return history.push(urls.success(data?.accessCode));
            } else {
              let errorMessage = "";
              if (data?.response?.message?.toLowerCase() === "error") {
                errorMessage = "Something went wrong. This might be due to poor network. Please try again.";
              } else {
                errorMessage = data?.response?.message;
              }
               // Stop the countdown
               setIsCounting(false);
              paymentContext.setErrorCallback(
                data?.response?.data?.callback_url ?? ""
              );
              paymentContext.setErrorMessage(errorMessage);
              return history.push(
                urls.failure(data?.accessCode ?? accessCode)
              );
            }
          }
        });
      }
  
      return () => {
        pusher?.unsubscribe(channelName);
        pusher.disconnect();
      };
    }, [accountNumber]);
  
    useEffect(() => {
      let pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
        cluster: process.env.REACT_APP_CLUSTER,
      });
  
      if (accountNumber.trim()) {
        const eventName = "transaction.nuban-error";
        const channelName = `nuban-error${accountNumber}`;
        // const channelName = `nuban-error930340403930`;
        var channel = pusher.subscribe(channelName);
        channel.bind(eventName, function (data) {
          console.log(data, 'transaction.nuban-error')
          if (data?.response) {
            if (!data.response.status) {
              const errorMessage = data.response?.message ?? "";
              paymentContext.setErrorMessage(errorMessage);
              return history.push(
                urls.failure(data.accessCode ?? accessCode)
              );
            }
          }
        });
  
        return () => {
          pusher.unsubscribe(channelName);
          pusher.disconnect();
        };
      }
    }, [accountNumber]);

  return (
    <div className="offline">
      <h4>We are confirming your transfer. This could take a couple of minutes.</h4>
      <div className="offline-confirmation-wrapper">
        <div className="money-sent">
          <p>You have sent the money</p>
          <img src={SucccessCheck} alt="" />
        </div>
        {!paymentConfirmed && (
          <>
            <div className="offline-confirming-payment">
              <p>Confirming payment</p>
              <div className="items-center loader">
                <p>
                  {`${minutes < 10 ? "0" : ""}${minutes}`}:
                  {`${seconds < 10 ? "0" : ""}${seconds}`}
                </p>
                {isCounting && <Spinner height="20" width="20" colour={"#5D627B"} />}
              </div>
            </div>
          </>
        )}
        {paymentConfirmed && (
          <div className="offline-confirmed">
            <p>Payment confirmed</p>
            <img src={SucccessCheck} alt="" />
          </div>
        )}
      </div>

      {!paymentConfirmed && (
        <>
          <div className="wait-section">
            <div className="wait-button-wrapper">
              {!isCounting && (
                <p className="failure-message">
                  {/* Payment confirmation failed.  */}
                  Please contact support.
                </p>
              )}
            </div>
          </div>
          <p className="support-content">
            If you have any issues with this transfer, please contact{" "}
            <span className="support">support@payfixy.com</span>
          </p>
          <p className="support-content">
            And Via Whatsapp{" "}
             <a href="https://wa.me/2349033799523" target="_blank" rel="noopener noreferrer" className="support">09033799523</a>
          </p>
        </>
      )}

      {paymentConfirmed && (
        <div className="offline-dismiss-section">
          <ActionButton
            type="button"
            className="submitbutton justify-center"
            onClick={() => history.push(urls.home(accessCode))}
            disabled={false}
            loading={false}
            spinColour="#FFFFFF"
            testId="card-payment"
          >
            <span>Dismiss</span>
          </ActionButton>
        </div>
      )}
    </div>
  );
};

export default ConfirmOfflinePayment;