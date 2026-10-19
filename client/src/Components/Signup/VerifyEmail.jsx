import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../../Style/Signupcss/signup.css";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState({ loading: true, message: "" });
    const token = searchParams.get("token");

    useEffect(() => {
        let active = true;

        async function verify() {
            if (!token) {
                setStatus({ loading: false, message: "This verification link is invalid or has expired." });
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/verify-email`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });
                const data = await response.json();

                if (active) {
                    setStatus({
                        loading: false,
                        message: response.ok
                            ? data.message
                            : data.error || "This verification link is invalid or has expired.",
                        verified: response.ok,
                    });
                }
            } catch {
                if (active) {
                    setStatus({
                        loading: false,
                        message: "We could not verify your email right now. Please try opening the link again.",
                    });
                }
            }
        }

        verify();
        return () => { active = false; };
    }, [token]);

    return (
        <main className="signup-form verification-card">
            <h1 className="signup-title">Verify your email</h1>
            <p className={status.verified ? "signup-success" : "verification-message"} role="status">
                {status.loading ? "Verifying your email..." : status.message}
            </p>
            {!status.loading && (
                <Link to={status.verified ? "/login" : "/signup"}>
                    {status.verified ? "Continue to login" : "Back to sign up"}
                </Link>
            )}
        </main>
    );
}
