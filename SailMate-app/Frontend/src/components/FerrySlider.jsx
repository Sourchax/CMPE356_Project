import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import seabus from "../assets/images/seabus.jpg";
import fastFerries from "../assets/images/fast-ferries.jpg";

const FerrySlider = () => {
  return (
    <section className="relative w-full h-[70vh]">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="w-full h-full"
      >
        {/* Seabus Slide */}
        <SwiperSlide>
          <div
            className="w-full h-full bg-cover bg-center relative flex items-center justify-center text-white text-center"
            style={{ backgroundImage: `url(${seabus})` }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-2">Seabus</h2>
              <p className="text-lg max-w-2xl">Fast and comfortable sea travel with our modern Seabus fleet.</p>
            </div>
          </div>
        </SwiperSlide>

        {/* Fast Ferries Slide */}
        <SwiperSlide>
          <div
            className="w-full h-full bg-cover bg-center relative flex items-center justify-center text-white text-center"
            style={{ backgroundImage: `url(${fastFerries})` }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-2">Fast Ferries</h2>
              <p className="text-lg max-w-2xl">Experience high-speed ferry travel with superior service.</p>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default FerrySlider;
