// import React from "react";
// import AnimatedSuccessCheckmark from "../../components/AnimatedSuccessCheckmark";
// import WidgetFooter from "../../components/WidgetFooter";

// const ConfirmOTP = () => {
//     return (
//         <div className="h-full flex justify-center items-center">
//             <div className="otp-container mt-50 text-center">
//                 <div className="w-full flex justify-center">
//                     <div className="icon-wrapper">
//                         <AnimatedSuccessCheckmark />
//                     </div>
//                 </div>
//                 <p className="text-lg font-bold mt-4">OTP Verified!</p>
//                 <span className="block text-gray-500">Your OTP has been successfully confirmed.</span>

//                 <div className="pt-6">
//                     <WidgetFooter verb="Continue" />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ConfirmOTP;




import React, { useEffect, useState } from "react";
import AnimatedSuccessCheckmark from "../../components/AnimatedSuccessCheckmark";
import WidgetFooter from "../../components/WidgetFooter";
import { useHistory, useParams } from "react-router-dom";

const timeToRedirect = 4;

const ConfirmOTP = () => {
    const history = useHistory();
    const { accessCode } = useParams();
    const [otp, setOtp] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [count, setCount] = useState(timeToRedirect);

    useEffect(() => {
        if (isVerified) {
            const timer = setInterval(() => {
                setCount((prev) => prev - 1);
            }, 1000);

            setTimeout(() => {
                history.push(`/${accessCode}`);
            }, timeToRedirect * 1000);

            return () => clearInterval(timer);
        }
    }, [isVerified, history, accessCode]);

    const handleVerifyOTP = () => {
        if (otp === "123456") {
            setIsVerified(true);
        } else {
            alert("Invalid OTP. Please try again.");
        }
    };

    return (
        <div className="h-full flex justify-center items-center">
            <div className="otp-container mt-50 text-center">
                {isVerified ? (
                    <>
                        <div className="w-full flex justify-center">
                            <div className="icon-wrapper">
                                <AnimatedSuccessCheckmark />
                            </div>
                        </div>
                        <p className="text-lg font-bold mt-4">OTP Verified!</p>
                        <span className="block text-gray-500">
                            Redirecting in {count} seconds...
                        </span>
                    </>
                ) : (
                    <>
                        <h2 className="text-xl font-bold mb-4">Confirm OTP</h2>
                        <p className="text-gray-600 mb-2">
                            Enter the 6-digit OTP sent to your phone/email.
                        </p>
                        <input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="border border-gray-300 p-2 text-center w-40 rounded-md"
                            placeholder="Enter OTP"
                        />
                        <div className="mt-4">
                            <button
                                onClick={handleVerifyOTP}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            >
                                Verify OTP
                            </button>
                        </div>
                    </>
                )}
                <div className="pt-6">
                    <WidgetFooter onClick={() => history.push(`/${accessCode}`)} verb="Cancel" />
                </div>
            </div>
        </div>
    );
};

export default ConfirmOTP;
