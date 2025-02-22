import React from "react";
import "../../assets/styles/seatSelectionStage/TicketSum.css";
import arrowIcon from "../../assets/images/right-arrow.png"
import calendars from "../../assets/images/calendars.png"
import clock from "../../assets/images/clock.png"
const TicketSum = () => {
    return(
        <div className="mainTicket-container">
            <div className="departure-ticket">
                <div className="items">
                    <h4>Departure</h4>
                    <img src={arrowIcon} alt="Image"/>
                    <h4>Placeholder</h4>
                </div>
                <div className="items">
                    <h4>Departure</h4>
                    <h4>ok </h4>
                    <h4>Placeholder</h4>
                </div>
                <div className="items">
                    <div>
                        <img src={calendars} alt="Image"/>
                        <h4>Date</h4>
                    </div>
                    <div>
                        <img src={clock} alt="Image"/>
                        <h4>saatler</h4>
                    </div>
                </div>
                <div className="items">
                    <h4> i Passengers</h4>
                    <h4> Price </h4>
                </div>
                <div className="items">
                    <h4> Fee</h4>
                    <h4> Price </h4>
                </div>
                <div className="items">
                    <h4>Total</h4>
                    <h4>Price</h4>
                </div>
            </div>
            <div className="seatSelection-block">
                <div className="seatSelection-head">
                    <h4> Seat Selection</h4>
                    <h4> Placeholder</h4>
                </div>
                <label>
                    <input type="checkbox" class="input"/>
                    <span class="custom-checkbox"> Automatic Seat Selection </span>
                </label>
            </div>
        </div>
    );
}

export default TicketSum;