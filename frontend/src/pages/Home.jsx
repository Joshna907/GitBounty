import React from 'react'
import HeroSection from "../components/HeroSection";
import FeaturesSection from '../components/FeaturesSection';
import Testimonials from '../components/Testimonials.jsx';
import VisionSection from '../components/VisionSection.jsx';
import AnnouncementSection from '../components/AnnouncementSection.jsx';

const Home = () => {
  return (
    <div className="bg-black text-white">
      <section >
        <HeroSection />
      </section>

      
       
      <section className="py-10">
        <FeaturesSection />
      </section>

      <section className="py-10">
        <Testimonials />
      </section>

      <section className="py-10">
        <VisionSection />
      </section>

      
    </div>
  )
}

export default Home