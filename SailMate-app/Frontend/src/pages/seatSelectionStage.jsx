import React from "react";

const seatSelectionStage = () => {

    return(
        <div className="mainScreen">
            <div className="travel-info" >
                <DepartureInfo/>
                <Ticket/>
            </div>
            <div className="ticketSum">
                <TicketSum/>
                <Continue/>
            </div>
        </div>
    );

}

export default seatSelectionStage;