"use client";
import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const VerificationPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verificationResult, setVerificationResult] = useState(null);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [email, setEmail] = useState("");

  const inputRefs = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];
  const router = useRouter();

  useEffect(() => {
    inputRefs[0].current.focus();
    startResendTimer();

    // Get email from URL
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get("email");
   

    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }

   
  }, []);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const startResendTimer = () => {
    setResendTimer(60);
    setCanResend(false);
  };

  const handleChange = (element, index) => {
    // Only allow single digit input
    const value = element.value;
    if (value.length > 1) return false;

    // Only allow numeric input
    if (!/^\d*$/.test(value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? value : d))]);

    if (value !== "" && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      setOtp([...otp.map((d, idx) => (idx === index ? "" : d))]);
      if (index > 0) {
        inputRefs[index - 1].current.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    console.log("Attempting to verify OTP:", otpString);

    // Get sendMail parameter from URL
    const urlParams = new URLSearchParams(window.location.search);
    const sendMail = urlParams.get("sendMail");

    try {
      console.log("Making API call...");
      // Build the base URL
      let apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}api/user-verification/${otpString}`;

      // Add email to query only if sendMail is "true"
      if (sendMail === "true") {
        apiUrl += `?email=${email}`;
      }

      const response = await axios.get(apiUrl);
      console.log("API response:", response);

      if (response.data && response.status === 200) {
        // Show success toast
        toast.success("OTP verified successfully!");

        // Set verification result (optional, as we're redirecting immediately)
        setVerificationResult({ success: "Verification successful" });

        // Redirect to login page after a short delay
     
          setTimeout(() => {
            router.push("/login");
          }, 1500)
        
      } else {
        // Handle unexpected response
        setVerificationResult({
          error: response.data.notification,
        });
        toast.error(response.notification);
      }
    } catch (error) {
      console.error("API call error:", error);
      setVerificationResult({
        error:
          error.response?.data?.notification ||
          "Verification failed. Please try again.",
      });
      toast.error(
        error.response?.data?.notification ||
          "Verification failed. Please try again."
      );
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error("Email not found. Please try logging in again.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/resend-register-code`,
        { email: email }
      );
      if (response.data && response.status === 200) {
        toast.success("Verification code resent successfully!");
        startResendTimer();
      } else {
        toast.error("Failed to resend verification code. Please try again.");
      }
    } catch (err) {
      console.error("Error resending code:", err);
      toast.error(
        err.response?.data?.notification ||
          "An error occurred. Please try again."
      );
    }
  };

  const isVerifyDisabled = otp.some((digit) => digit === "");

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center min-vh-100"
    >
      <Row className="justify-content-center w-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={4}>
          <div className="bg-white p-4 rounded-4 shadow">
            <div className="text-center mb-4">
              <div
                className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                style={{ width: "50px", height: "50px" }}
              >
                <i className="bi bi-shield-check fs-4"></i>
              </div>
            </div>
            <h5 className="text-center mb-4">OTP will be sent to your email</h5>

            <Form onSubmit={handleSubmit}>
              <Row className="gx-2 mb-4">
                {otp.map((digit, index) => (
                  <Col key={index}>
                    <Form.Control
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleChange(e.target, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      ref={inputRefs[index]}
                      className="text-center"
                      style={{
                        height: "50px",
                        fontSize: "1.5rem",
                        WebkitAppearance: "none",
                        MozAppearance: "textfield",
                      }}
                    />
                  </Col>
                ))}
              </Row>
              <Button
                variant="primary"
                type="submit"
                className="w-100 py-2"
                disabled={isVerifyDisabled}
              >
                Verify OTP
              </Button>
            </Form>
            <div className="mt-3 text-center">
              <Button
                variant="link"
                onClick={handleResendCode}
                disabled={!canResend}
                className="p-0"
              >
                Resend Code
              </Button>
              {!canResend && <span className="ms-2">({resendTimer}s)</span>}
            </div>
            {verificationResult && (
              <div className="mt-3 text-center">
                {verificationResult.error ? (
                  <p className="text-danger">{verificationResult.error}</p>
                ) : (
                  <p className="text-success">{verificationResult.success}</p>
                )}
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default VerificationPage;
