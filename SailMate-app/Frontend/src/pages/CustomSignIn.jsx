import { SignIn, useClerk } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../assets/styles/CustomSignIn.css";
import { useTranslation } from "react-i18next";

const CustomSignIn = () => {
  const clerk = useClerk();
  const [loaded, setLoaded] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    console.log("Clerk Loaded:", clerk.loaded); // Debugging
    setLoaded(clerk.loaded);
    
    // Add fade-in animation effect
  }, [clerk.loaded]);

  return (
    <div className="sign-in_container">
      <div className={`signin-box ${fadeIn ? 'fade-in' : ''}`}>
        {loaded && (
          <Link to="/" className={`back-link ${loaded ? "visible" : ""}`}>
            &larr; {t('auth.backToHome')}
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
                footerAction: "signin-footer-action",
                identityPreview: "signin-identity-preview",
                formFieldLabel: "form-label",
                formFieldRow: "form-group",
                alertText: "signin-alert",
                logoBox: "signin-logo-box",
              },
              variables: {
                spacingUnit: "16px", // Increase spacing
                borderRadius: "10px", // Larger border radius
              },
            }}
            path="/sign-in"
            routing="path"
            signUpUrl="/sign-up"
          />
        ) : (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">{t('auth.loadingAuthentication')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSignIn;