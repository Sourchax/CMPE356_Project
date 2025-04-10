import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/UnauthorizedAccess.css";
import { useTranslation } from 'react-i18next';

const UnauthorizedAccess = () => {
  const { t } = useTranslation();
  
  // Set document title
  useEffect(() => {
    document.title = t('pageTitle.unauthorized', "Unauthorized Access | SailMate");
  }, [t]);

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="icon-wrapper">
          <div className="icon-background">
            <span role="img" aria-label="ship" className="sailboat-icon">
              ⛵
            </span>
            <span className="cross-icon">✖</span>
          </div>
        </div>
        <h1 className="unauthorized-title">Unauthorized Waters</h1>
        <p className="unauthorized-text">
          This part of the sea is off-limits to non-business sailors. Only
          authorized ships are allowed to sail these waters.
        </p>
        <Link to="/" className="upgrade-button">
          Set Sail for Safe Shores
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;
