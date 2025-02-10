import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [verificationSent, setVerificationSent] = useState(false);

    const handleSendVerification = async () => {
        try {
            await axios.post("/api/auth/forgot-password", { emailOrPhone });
            setVerificationSent(true);
        } catch (error) {
            alert("Error sending verification code");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Forgot Password</h2>
            <input type="text" placeholder="Email or Phone" value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} className="w-full p-2 border rounded mb-2" />
            <button onClick={handleSendVerification} className="w-full bg-blue-500 text-white py-2 rounded">
                {verificationSent ? "Verification Sent" : "Send Verification Code"}
            </button>
        </div>
    );
};

export default ForgotPassword;