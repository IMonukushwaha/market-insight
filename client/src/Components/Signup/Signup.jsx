import { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../Contexts/AuthContext";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import "../../Style/Signupcss/signup.css"

export default function Signup(){
    const { setCurrentUser } = useAuth();
    const navigate = useNavigate();

    const [formdata, setFormdata] = useState({
        username: "",
        email: "",
        password: ""
    })

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(false);

    function handleonchange(event){
        setFormdata((currform) => {
            return {...currform, [event.target.name]: event.target.value}
        })
    }

    async function handleSubmit(event){
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }

        setValidated(true);
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`http://localhost:5000/signup`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify(formdata)
            });

            console.log("Status:", res.status);
            const text = await res.text(); // read as raw text first
            console.log("Raw response:", text);

            const data = JSON.parse(text); // then parse manually

            if (!res.ok) {
                setError(data.error || "Signup failed");
                return;
            }

            setCurrentUser(data.user)
            navigate("/");

        } catch (err) {
            console.log(err);
            setError("Network error, please try again");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form noValidate validated={validated} className="signup-form" onSubmit={handleSubmit}>
            <h2 className="signup-title">Create an account</h2>

            {error && <p className="signup-error">{error}</p>}

            <Form.Group className="form-group" controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Username"
                    name="username"
                    value={formdata.username}
                    onChange={handleonchange}
                    required
                />
                <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">Username is required</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="form-group" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter email address"
                    name="email"
                    value={formdata.email}
                    onChange={handleonchange}
                    required
                />
                <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                    Please enter a valid email address
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="form-group" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    value={formdata.password}
                    onChange={handleonchange}
                    required
                    minLength={6}
                />
                <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                    Password must be at least 6 characters
                </Form.Control.Feedback>
            </Form.Group>

            <Button variant="success" type="submit" disabled={loading} className="signup-btn-row">
                    {loading ? "Submitting..." : "Submit"}
            </Button>
        </Form>
    )
}