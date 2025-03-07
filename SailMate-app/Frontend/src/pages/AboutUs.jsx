import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { motion } from 'framer-motion';
import commerImage from '../assets/images/commer.png';
import Button from "../components/Button";
import "../assets/styles/aboutus.css"; // Make sure CSS is imported

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { isSignedIn } = useUser(); // Clerk hook to check if the user is signed in

  const handleClick = () => {
    if (isSignedIn) {
      // Navigate to homepage if signed in
      navigate('/');
    } else {
      // Navigate to sign-in page if not signed in
      navigate('/sign-in');
    }
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#D1FFD7]">

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[#0D3A73] text-white">
        <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl font-extrabold tracking-tight mb-4">
              Setting Sail for a <span className="text-[#F0C808]">Smoother Journey</span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Discover the story behind SailMate, the revolutionary ferry ticketing system changing how people travel on water.
            </p>
          </motion.div>
        </div>

        {/* Animated waves */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#D1FFD7" fillOpacity="1" d="M0,128L48,133.3C96,139,192,149,288,154.7C384,160,480,160,576,138.7C672,117,768,75,864,69.3C960,64,1056,96,1152,106.7C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </motion.div>
      </div>

      {/* Our Story Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl text-[#0D3A73] font-bold text-center mb-16">Our Story</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#F0C808] rounded-full opacity-30"></div>
              <img src={commerImage} alt="Ferry passengers using SailMate" className="w-80 h-80 rounded-lg shadow-xl relative z-10" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-[#0D3A73] mb-4">How It All Began</h3>
            <p className="text-gray-700 mb-6">
              SailMate was born from a frustrating experience at a crowded ferry terminal in 2025. Our founder, waiting in a long queue for tickets, wondered why ferry booking couldn't be as seamless as other modern travel experiences.
            </p>
            <p className="text-gray-700">
              What started as a simple idea to digitize ferry tickets quickly evolved into a comprehensive platform addressing the unique challenges of waterway transportation. Today, SailMate serves thousands of travelers and dozens of ferry operators worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-[#06AED5] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-8">Our Mission</h2>
            <p className="text-xl mb-10">
              To transform waterway travel by creating technology that connects people to efficient, stress-free ferry experiences while supporting coastal and island communities.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg w-full md:w-64">
                <div className="text-[#F0C808] text-5xl font-bold mb-2">95%</div>
                <div>Reduction in boarding time</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg w-full md:w-64">
                <div className="text-[#F0C808] text-5xl font-bold mb-2">500+</div>
                <div>Ferry routes covered</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg w-full md:w-64">
                <div className="text-[#F0C808] text-5xl font-bold mb-2">2M+</div>
                <div>Happy travelers</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl text-[#0D3A73] font-bold text-center mb-16">Meet Our Team</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            {
              name: "Erk Demirel",
              title: "Founder & CEO",
              image: "https://evo.khas.edu.tr/wp-content/uploads/2024/03/Erk_Demirel.jpg",
              delay: 0
            },
            {
              name: "Ekmel Beyza Akın",
              title: "CTO",
              image: "https://media.licdn.com/dms/image/v2/D4E03AQHmr1LdBZgADg/profile-displayphoto-shrink_400_400/B4EZVwleEIHgAs-/0/1741350626025?e=1746662400&v=beta&t=4QwnausWSr2XGT1MCBNM0vy3MGkjg6b8gcsq0ov7iAs",
              delay: 0.2
            },
            {
              name: "Ege Kaptanoğlu",
              title: "Head of Customer Experience",
              image: "https://media.licdn.com/dms/image/v2/C4D03AQHdnIrOjIAOxQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1650220552799?e=1746057600&v=beta&t=dS4cN8SonvQfPD2yfTNGvot_oBAdiLHtOYX3EGgGC-U",
              delay: 0.4
            },
            {
              name: "Ali Utku Özaslan",
              title: "Head of Customer Experience",
              image: "https://evo.khas.edu.tr/wp-content/uploads/2024/03/AliUtku_Ozaslan_We%CC%82bsitePhoto-768x768.jpg",
              delay: 0.6
            }
          ].map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: member.delay }}
              className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-transform hover:scale-105"
            >
              <img src={member.image} alt={member.name} className="w-full h-64 object-contain " />
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#0D3A73]">{member.name}</h3>
                <p className="text-[#06AED5]">{member.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-[#0D3A73]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl text-white font-bold text-center mb-16">The SailMate Difference</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Innovation",
                icon: "⚓",
                description: "We pioneer smart solutions to make ferry booking and travel seamlessly efficient.",
                delay: 0
              },
              {
                title: "Reliability",
                icon: "⏱️",
                description: "Punctual departures and accurate schedules you can build your journey around.",
                delay: 0.2
              },
              {
                title: "Sustainability",
                icon: "🌊",
                description: "Eco-friendly vessels and practices that protect the beautiful waters we sail.",
                delay: 0.4
              },
              {
                title: "Comfort",
                icon: "🛋️",
                description: "Thoughtfully designed spaces and amenities for a relaxing journey across the water.",
                delay: 0.6
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: value.delay }}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-4 bg-[#D1FFD7] w-16 h-16 flex items-center justify-center rounded-full text-[#0D3A73]">{value.icon}</div>
                <h3 className="text-xl font-bold text-[#0D3A73] mb-2">{value.title}</h3>
                <p className="text-gray-700">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-[#D1FFD7]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl text-[#0D3A73] font-bold text-center mb-16">What People Say</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "SailMate transformed how we operate our ferries. Reduced lines, happier customers, better business.",
                author: "Coastal Ferries Ltd.",
                role: "Ferry Operator",
                delay: 0
              },
              {
                quote: "I use the app for my daily commute across the bay. It's saved me countless hours of waiting in line.",
                author: "Maria J.",
                role: "Daily Commuter",
                delay: 0.2
              },
              {
                quote: "Planning our island-hopping vacation was a breeze with SailMate. Seamless connections every time.",
                author: "The Robinson Family",
                role: "Vacation Travelers",
                delay: 0.4
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: testimonial.delay }}
                className="bg-white rounded-xl shadow-lg p-6 relative"
              >
                <div className="absolute -top-5 left-6 text-5xl text-[#F0C808]">"</div>
                <p className="text-gray-700 mb-6 pt-4">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#06AED5] rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <div className="font-bold text-[#0D3A73]">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-[#F0C808]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl text-[#0D3A73] font-bold mb-6">Ready to Simplify Ferry Travel?</h2>
            <p className="text-xl text-[#0D3A73] mb-8">
              Join thousands of travelers who have discovered a better way to sail.
            </p>
            <div className="aboutus-button-container">
              <Button 
                variant="primary"
                size="lg"
                className="cta-button"
                onClick={handleClick}
              >
                Get Started Today
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;