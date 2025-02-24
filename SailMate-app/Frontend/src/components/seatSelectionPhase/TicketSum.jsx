import React from "react";
import { FaClock, FaMapMarkerAlt, FaCalendarAlt, FaInfoCircle, FaShieldAlt } from 'react-icons/fa';
const TicketSum = () => {
    return(
        <div className="bg-white rounded-md shadow-sm p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="bg-white text-blue-600 font-bold">ONE WAY</div>
          <div className="flex items-center">
            <span className="mr-2 text-gray-500">&#8594;</span>
            <span className="text-green-500 font-bold">ECONOMY</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <span className="text-gray-600">Bursa</span>
            <FaMapMarkerAlt className="mx-2 text-green-500" />
          </div>
          <div className="flex items-center">
            <span className="text-gray-600">Yenikapi</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2 text-green-500" />
            <div>
              <div className="text-gray-600">Date</div>
              <div>February 27, 2025</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-right">
              <div className="text-gray-600">Departure - Arrival</div>
              <div>08:30 - 10:55</div>
            </div>
          </div>
        </div>

        <div className="border-t my-2"></div>

        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <div className="text-gray-600">Passenger</div>
          </div>
          <div>1 Passenger</div>
          <div className="text-green-500 font-bold">₺490</div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="text-gray-600">Service Fee</div>
          <div className="text-green-500">₺10</div>
        </div>

        <div className="bg-green-500 text-white p-2 flex justify-between items-center">
          <div>TOTAL</div>
          <div>₺500</div>
        </div>
      </div>
    );
}

export default TicketSum;