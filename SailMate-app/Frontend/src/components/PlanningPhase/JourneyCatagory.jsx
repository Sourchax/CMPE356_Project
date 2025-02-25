import React from "react";

import "../../assets/styles/PlanningPhase/PlaPha.css";


const ferryData = [
  { departure: "07:00", arrival: "07:45", promo: 200, economy: 225, business: 250 },
  { departure: "11:00", arrival: "11:45", promo: 200, economy: 225, business: 250 },
  { departure: "15:00", arrival: "15:45", promo: 200, economy: 225, business: 250 },
];

const PlanningPhase = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#0D3A73] mb-4">Journey Planning</h2>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="text-white">
              <th className="p-3 bg-[#06AED5]">Departure</th>
              <th className="p-3 bg-[#06AED5]">Arrival</th>
              <th className="p-3 bg-[#F0C808]">Promo</th>
              <th className="p-3 bg-[#D1FFD7]">Economy</th>
              <th className="p-3 bg-[#F05D5E]">Business</th>
            </tr>
          </thead>
          <tbody>
            {ferryData.map((ferry, index) => (
              <tr key={index} className="text-center border-b border-gray-300">
                <td className="p-3">{ferry.departure}</td>
                <td className="p-3">{ferry.arrival}</td>
                <td className="p-3">{ferry.promo}₺</td>
                <td className="p-3">{ferry.economy}₺</td>
                <td className="p-3">{ferry.business}₺</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlanningPhase;
