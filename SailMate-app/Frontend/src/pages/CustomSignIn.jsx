import { SignIn, useClerk } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../assets/styles/CustomSignIn.css";

const CustomSignIn = () => {
  const clerk = useClerk();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    console.log("Clerk Loaded:", clerk.loaded); // Debugging
    setLoaded(clerk.loaded);
  }, [clerk.loaded]);

  return (
    <div className="container">
      <div className="signin-box">
        {loaded && (
          <Link to="/" className={`back-link ${loaded ? "visible" : ""}`}>
            &larr; Back to Home
          </Link>
        )}

        {clerk.loaded ? (
          <SignIn
            appearance={{
              elements: {
                rootBox: "signin-content",
                card: "signin-card",
                headerTitle: "signin-title",
                headerSubtitle: "signin-subtitle",
                socialButtonsBlockButton: "social-buttons",
                formFieldInput: "form-input",
                formButtonPrimary: "form-button",
              },
            }}
            path="/sign-in"
            routing="path"
            signUpUrl="/sign-up"
          />
        ) : (
          <p>Loading Clerk...</p>
        )}
      </div>
    </div>
  );
};

export default CustomSignIn;
