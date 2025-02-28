import React from "react";

const DepartureInfo = ({ departureDetails, passengerIndex, onPassengerChange, tripType }) => {
  
  const isDeparture = tripType === "departure";
  const bgColor = isDeparture ? "bg-blue-800" : "bg-red-800";
  
  return (
    <div>
      <div className="mt-4 flex items-center gap-2 text-gray-700">
        <div className={`${bgColor} text-white p-2 rounded-full`}>
          <span>&#128100;</span>
        </div>
        <span>{(passengerIndex % (departureDetails.passengerCount)) + 1}. Passenger</span>
      </div>

      {/* Passenger Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {["Name", "Surname", "Phone", "BirthDate", "Email"].map((field) => (
          <div className="relative" key={field}>
            <input
              type={field === "Email" ? "email" : "text"}
              placeholder={'Your ' + field}
              className="w-full p-2 border rounded"
              onChange={(e) => onPassengerChange(passengerIndex, field, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartureInfo;
