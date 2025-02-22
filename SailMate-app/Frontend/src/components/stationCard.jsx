import React, { useState, useRef, useEffect } from "react";
import "../assets/styles/stationCard.css";

const stations = [
  { name: "Eminönü İskele", person: "Turhan TURAN", phone: "+90 212 527 99 52", address: "Galata Köprüsü Eminönü Ayağı Haliç Tarafı", city: "Istanbul" },
  { name: "Karaköy İskele", person: "Beyzo Alakaş", phone: "+90 212 244 93 83", address: "Galata Köprüsü Karaköy Ayağı Haliç Tarafı", city: "Istanbul" },
  { name: "Üsküdar İskele", person: "İhsan BAYSAL", phone: "+90 216 530 32 12", address: "Eski Balaban İskelesi", city: "Istanbul" },
  { name: "Kadıköy Metro İskele", person: "Murat İNCE", phone: "+90 216 348 10 08", address: "Rıhtım Cad. Beşiktaş Vapur İskelesi Yanı", city: "Istanbul" },
  { name: "Kadıköy Yeni İskele", person: "Kerem YETMİŞBİR", phone: "+90 216 338 66 44", address: "Et Ve Balık Kurumu Yanı, Minibüs Durakları Karşısı", city: "Istanbul" },
  { name: "Haydarpaşa İskele", person: "Halil ELMAS", phone: "+90 216 338 69 69", address: "Haydarpaşa Garı Karşısı, Kadıköy Tarafı", city: "Istanbul" },
  { name: "Bursa İskele", person: "Mehmet YILMAZ", phone: "+90 224 123 45 67", address: "Bursa City Center", city: "Bursa" },
  { name: "İzmir İskele", person: "Zeynep ÖZTÜRK", phone: "+90 232 456 78 90", address: "Konak Pier, İzmir", city: "Izmir" },
];

const StationCard = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedCity, setSelectedCity] = useState("All");
  const cardsRef = useRef(new Map());
  const [isAnimating, setIsAnimating] = useState(false);
  const [isNewCards, setIsNewCards] = useState(false);

  const toggleDetails = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleCityClick = (city) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsNewCards(true);

    setSelectedCity(city);
  };

  const filteredStations =
    selectedCity === "All"
      ? stations
      : stations.filter((station) => station.city === selectedCity);

  useEffect(() => {
    let resizeTimer;
    const handleResize = () => {
      if (isAnimating) return;
      setIsAnimating(true);

      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isAnimating]);

  useEffect(() => {
    if (isNewCards) {
      const cards = Array.from(cardsRef.current.values());
      const initialPositions = cards.map(card => {
        const rect = card.getBoundingClientRect();
        return { left: rect.left, top: rect.top };
      });

      requestAnimationFrame(() => {
        cards.forEach((card, i) => {
          const initialPos = initialPositions[i];
          const finalPos = card.getBoundingClientRect();
          const deltaX = initialPos.left - finalPos.left;
          const deltaY = initialPos.top - finalPos.top;

          // Set initial position off the bottom
          card.style.transform = `translateY(100vh)`;
          card.style.transition = 'none';

          // Force reflow
          card.offsetHeight;

          // Animate to final position (move to 0, 0 on Y-axis)
          card.style.transform = `translate(${deltaX}px, 0)`;
          card.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        setTimeout(() => {
          setIsAnimating(false);
          setIsNewCards(false);
        }, 500);
      });
    }
  }, [filteredStations, isNewCards]);

  return (
    <div className="stationPage">
      <div className="aboutStations">
        <h1>Stations</h1>
        <p>All the information about stations</p>
      </div>
      <div className="filter-bar">
        <button
          onClick={() => handleCityClick("All")}
          className={selectedCity === "All" ? "active" : ""}
        >
          All
        </button>
        <button
          onClick={() => handleCityClick("Istanbul")}
          className={selectedCity === "Istanbul" ? "active" : ""}
        >
          Istanbul
        </button>
        <button
          onClick={() => handleCityClick("Bursa")}
          className={selectedCity === "Bursa" ? "active" : ""}
        >
          Bursa
        </button>
        <button
          onClick={() => handleCityClick("Izmir")}
          className={selectedCity === "Izmir" ? "active" : ""}
        >
          İzmir
        </button>
      </div>
      <div className="station-container">
        {filteredStations.map((station, index) => (
          <div
            key={index}
            ref={el => el && cardsRef.current.set(index, el)}
            className={`card ${isAnimating || isNewCards ? 'animating' : ''}`}
            onClick={() => toggleDetails(index)}
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 5H4V19L13.2923 9.70649C13.6828 9.31595 14.3159 9.31591 14.7065 9.70641L20 15.0104V5ZM2 3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z"></path>
            </svg>
            <div className="card__content">
              <p className="card__title">{station.name}</p>
              <p className="card__description">
                <strong>Contact Person:</strong> {station.person} <br />
                <strong>Phone:</strong> {station.phone} <br />
                <strong>Address:</strong> {station.address}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StationCard;
