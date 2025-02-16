import React, { useState } from 'react';
import '../assets/styles/stationCard.css';

const stations = [
  { name: "Eminönü İskele", person: "Turhan TURAN", phone: "+90 212 527 99 52", address: "Galata Köprüsü Eminönü Ayağı Haliç Tarafı" },
  { name: "Karaköy İskele", person: "Beyzo Alakaş", phone: "+90 212 244 93 83", address: "Galata Köprüsü Karaköy Ayağı Haliç Tarafı" },
  { name: "Üsküdar İskele", person: "İhsan BAYSAL", phone: "+90 216 530 32 12", address: "Eski Balaban İskelesi" },
  { name: "Kadıköy Metro İskele", person: "Murat İNCE", phone: "+90 216 348 10 08", address: "Rıhtım Cad. Beşiktaş Vapur İskelesi Yanı" },
  { name: "Kadıköy Yeni İskele", person: "Kerem YETMİŞBİR", phone: "+90 216 338 66 44", address: "Et Ve Balık Kurumu Yanı, Minibüs Durakları Karşısı" },
  { name: "Haydarpaşa İskele", person: "Halil ELMAS", phone: "+90 216 338 69 69", address: "Haydarpaşa Garı Karşısı, Kadıköy Tarafı" }
];

const StationCard = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleDetails = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="station-container">
      {stations.map((station, index) => (
        <div key={index} className="station" onClick={() => toggleDetails(index)}>
          <h3>{station.name}</h3>
          {activeIndex === index && (
            <div>
              <p><strong>Person:</strong> {station.person}</p>
              <p><strong>Phone Number:</strong> {station.phone}</p>
              <p><strong>Address:</strong> {station.address}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StationCard;
