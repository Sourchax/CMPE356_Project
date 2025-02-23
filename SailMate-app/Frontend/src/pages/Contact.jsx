import React from "react";
import "../assets/styles/contact.css";

const Contact = () => {
  return (
    <div className="contact-container">
      <div class="contact-form">
        <span class="heading">Contact Us</span>
        <form>
          <label for="name">Name:</label>
          <input type="text" required=""/>
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required=""/>
          <label for="message">Message:</label>
          <textarea id="message" name="message" required=""></textarea>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
