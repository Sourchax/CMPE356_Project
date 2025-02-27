import { SignUp, useClerk} from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../assets/styles/CustomSignUp.css";

const CustomSignUp = () => {
  const clerk = useClerk();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    console.log("Clerk Loaded:", clerk.loaded); // Debugging
    setLoaded(clerk.loaded);
  }, [clerk.loaded]);

  return (
    <div className="signup-container">
      <div className="signup-box">
        {loaded && (
          <Link to="/" className={`back-link ${loaded ? "visible" : ""}`}>
            &larr; Back to Home
          </Link>
        )}

        <SignUp
          appearance={{
            elements: {
              rootBox: "signup-content",
              card: "signup-card",
              headerTitle: "signup-title",
              headerSubtitle: "signup-subtitle",
              socialButtonsBlockButton: "social-buttons",
              formFieldInput: "form-input",
              formButtonPrimary: "form-button",
            },
          }}
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          redirectUrl="/verify-email"
        />

      </div>
    </div>
  );
};

export default CustomSignUp;
