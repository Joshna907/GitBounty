import React, { useState } from "react";

const testimonials = [
  {
    name: 'Jack',
    username: '@jack',
    text: "I've never seen anything like this before. It's amazing. I love it.",
  },
  {
    name: 'Jill',
    username: '@jill',
    text: "I don't know what to say. I'm speechless. This is amazing.",
  },
  {
    name: 'John',
    username: '@john',
    text: "I'm at a loss for words. This is amazing. I love it.",
  },
  {
    name: 'Jane',
    username: '@jane',
    text: "I'm at a loss for words. This is amazing. I love it.",
  },
  {
    name: 'Jenny',
    username: '@jenny',
    text: "This platform is incredible. The experience is seamless!",
  },
  {
    name: 'James',
    username: '@james',
    text: "Everything works perfectly. Highly recommend!",
  },
];

const TestimonialCard = ({ item, onClick }) => (
  <div
    onClick={onClick}
    className="shrink-0 w-[350px] rounded-2xl border border-gray-800/50 p-1 mx-2  
      bg-black/40 backdrop-blur-sm hover:border-[#f50090] transition-all duration-300 
      cursor-pointer group"
  >
    <div className="flex flex-col min-h-[100px] justify-between">  
      <div className="mb-2"> 
        <p className="text-lg font-semibold text-white mb-1">{item.name}</p>  
        <p className="text-sm text-gray-500">{item.username}</p> 
      </div>
      <p className="text-base text-gray-300 leading-relaxed line-clamp-4">  
        "{item.text}"
      </p>
    </div>
  </div>
);

const Testimonials = () => {
  const [pausedRows, setPausedRows] = useState([false, false]);

  const togglePause = (rowIndex) => {
    setPausedRows((prev) => {
      const copy = [...prev];
      copy[rowIndex] = !copy[rowIndex];
      return copy;
    });
  };

  return (
    <section className="relative bg-black text-white py-20 overflow-hidden">
      <div className="text-center mb-20">    
       <div className="inline-flex px-6 py-2 rounded-full bg-[#f50090]/20 mb-12 backdrop-blur-lg shadow-[0_0_20px_rgba(255,255,255,0.15)]">
  <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#f50090] to-[#9b23ea] px-4 py-2 text-sm font-medium text-white shadow-[0_0_20px_rgba(245,0,144,0.4)] hover:opacity-95 transition-all duration-300">
    Our Customers
  </span>
</div>
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight">What People Are Saying</h2>
        <p className="text-grey-400 mt-6  text-m">See how GitBounty empowers developers worldwide.</p>
      </div>

      {/* Fading edges */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute left-0 top-0 h-full w-72">
          <div className="h-full w-full bg-linear-to-r from-black via-black/95 to-transparent" />
        </div>
        <div className="absolute right-0 top-0 h-full w-72">
          <div className="h-full w-full bg-linear-to-l from-black via-black/95 to-transparent" />
        </div>
      </div>

      <div className="space-y-8 relative z-0">
        {/* Row 1: Left to right */}
        <div
          className="flex whitespace-nowrap"
          style={{
            animation: "marquee 30s linear infinite",
            animationPlayState: pausedRows[0] ? "paused" : "running",
            willChange: "transform",
          }}
        >
          {[...testimonials, ...testimonials].map((item, index) => (
            <TestimonialCard
              key={`r1-${index}`}
              item={item}
              onClick={() => togglePause(0)}
            />
          ))}
        </div>

        {/* Row 2: Right to left */}
        <div
          className="flex whitespace-nowrap"
          style={{
            animation: "marquee-reverse 32s linear infinite",
            animationPlayState: pausedRows[1] ? "paused" : "running",
            willChange: "transform",
          }}
        >
          {[...testimonials, ...testimonials].map((item, index) => (
            <TestimonialCard
              key={`r2-${index}`}
              item={item}
              onClick={() => togglePause(1)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;