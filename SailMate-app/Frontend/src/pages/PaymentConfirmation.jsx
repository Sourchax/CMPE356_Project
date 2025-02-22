import React from "react";
import "../assets/styles/paymentconfirmation.css"; // Import external CSS file

const PaymentConfirmation = () => {
  return (
    <div className="container">
      <div className="content">
        {/* Step Indicator */}
        <div className="step-indicator">
          <div className="inactive-step">Voyage Plan</div>
          <div className="inactive-step">Voyage Information</div>
          <div className="active-step">Confirmation and Payment</div>
        </div>
        
        <div className="main-section">
          {/* Ticket Details */}
          <div className="ticket-details">
            <h2>Ticket Details</h2>
            <div className="total">Total: $ </div>
          </div>
          
          {/* Payment Section */}
          <div className="payment-section">
            <h2>Payment Method</h2>
            
            <div className="promo-code">
              <label>Promotion Code</label>
              <div className="input-group">
                <input type="text" placeholder="Enter the Coupon Code" />
                <button className="apply-btn">Ekle</button>
              </div>
            </div>
            
            <label>Pay with Credit Card</label>
            <div className="card-details">
              <p>Credit Card Information</p>
              <input type="text" placeholder="Name Surname" />
              <input type="text" placeholder="Card Number" />
              
              <div className="card-inputs">
                <select>
                  <option>Month</option>
                </select>
                <select>
                  <option>Year</option>
                </select>
                <input type="text" placeholder="CVV" />
              </div>
              
              <div className="terms">
                <input type="checkbox" />
                <span>I have carefully read and I agree to the terms and conditions.</span>
              </div>
            </div>
            
            <div className="summary">
              <p><span>Total:</span><span>$</span></p>
              <p><span>Tax:</span><span>$</span></p>
              <p className="bold"><span>Total Payment to be paid:</span><span>$</span></p>
            </div>
            
            <button className="purchase-btn">Purchase</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
