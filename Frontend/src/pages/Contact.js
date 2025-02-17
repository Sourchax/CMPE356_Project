import React from "react";
import "../assets/styles/contact.css";

const Contact = () => {
  return (
    <div className="contact-container">
      {/* Main Content */}
      <main className="contact-main">
        <h1>Contact Us</h1>
        <p>If you have any questions, feel free to reach out to us.</p>

        {/* Contact Form */}
        <form className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" placeholder="Enter your name" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" placeholder="Your message"></textarea>
          </div>
          <button type="submit">Send</button>
        </form>
      </main>
    </div>
  );
};

export default Contact;
