import { useState } from "react";

const stations = [
  { name: "Izmir Central", person: "Ali Kaya", phone: "+90 232 123 4567", address: "Konak, Izmir, Turkey", city: "Izmir" },
  { name: "Istanbul Terminal", person: "Mehmet Yilmaz", phone: "+90 212 987 6543", address: "Besiktas, Istanbul, Turkey", city: "Istanbul" },
  { name: "Bursa Hub", person: "Zeynep Demir", phone: "+90 224 321 7654", address: "Osmangazi, Bursa, Turkey", city: "Bursa" },
  { name: "Izmir North", person: "Fatma Aydin", phone: "+90 232 555 7890", address: "Bornova, Izmir, Turkey", city: "Izmir" },
  { name: "Istanbul South", person: "Hasan Koc", phone: "+90 212 888 1122", address: "Kadikoy, Istanbul, Turkey", city: "Istanbul" },
];

export default function StationCard() {
  const [filter, setFilter] = useState("All");

  const filteredStations = filter === "All" ? stations : stations.filter((s) => s.city === filter);

  return (
    <div className="flex flex-col items-center px-4 py-6 min-h-screen">
      {/* Page Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Stations</h1>
      <div className="w-full max-w-screen-md border-b-4 border-gray-300 mb-6"></div>

      {/* Filter Buttons */}
      <div className="mb-8 flex flex-wrap justify-center gap-4">
        {["All", "Izmir", "Istanbul", "Bursa"].map((city) => (
          <button
            key={city}
            onClick={() => setFilter(city)}
            className={`px-5 py-2 text-base md:text-lg rounded-lg transition-all duration-300 font-medium border
              ${
                filter === city
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                  : "bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white hover:border-blue-500"
              }`}
          >
            {city}
          </button>
        ))}
      </div>
      <div className="w-full max-w-screen-md border-b-4 border-gray-300 mb-6"></div>

      {/* Station Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-screen-lg w-full justify-center">
        {filteredStations.map((station, index) => (
          <div
            key={index}
            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(station.address)}`, "_blank")}
            className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border cursor-pointer transition-all duration-300 transform
              hover:scale-[1.05] hover:shadow-2xl hover:border-blue-400 active:scale-95 max-w-sm w-full text-center mx-auto"
          >
            <h2 className="text-xl md:text-2xl font-bold text-blue-600 mb-3">{station.name}</h2>
            <p className="text-gray-700 text-base md:text-lg">Contact: {station.person}</p>
            <p className="text-gray-700 text-base md:text-lg">Phone: {station.phone}</p>
            <p className="text-gray-500 text-sm md:text-md mt-2">{station.address}</p>
          </div>
        ))}
      </div>
      
      {/* Empty State */}
      {filteredStations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 bg-[#D1FFD7] rounded-full flex items-center justify-center mb-6">
            <MapPin size={36} className="text-[#0D3A73]" />
          </div>
          <h3 className="text-xl font-bold text-[#0D3A73] mb-2">No Stations Found</h3>
          <p className="text-gray-600 max-w-md">We couldn't find any stations matching your filter. Please try another city or view all stations.</p>
          <button 
            onClick={() => setFilter("All")}
            className="mt-6 bg-[#06AED5] hover:bg-[#059cc0] text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            View All Stations
          </button>
        </div>
      )}
    </div>
  );
}
