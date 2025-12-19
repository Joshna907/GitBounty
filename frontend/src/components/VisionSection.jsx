import React from "react";
import LampContainer from "./LampContainer";

const VisionSection = () => {
  return (
    <section className="relative w-full min-h-[420px] bg-black flex items-center justify-center overflow-hidden px-3">
      <LampContainer>
        <div className="text-center max-w-2xl pt-10">
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-semibold text-white mb-4">
            Our Vision
          </h2>

          <div className="tube-shimmer mx-auto" />

         <p className="mx-auto mt-6 max-w-2xl text-gray-300 text-lg leading-relaxed">
  Our vision is to empower open-source innovation by connecting creators and
  developers through transparent, trustless, and incentive-driven bounties
  powered by blockchain.
</p>

<div className="mt-8 flex justify-center">
  <a
    href="/explore"
    className="inline-flex items-center gap-2 rounded-md
      bg-gradient-to-r from-[#f50090] to-[#9b23ea]
      px-5 py-2 text-sm font-medium text-white
      shadow-md hover:scale-[1.03] transition"
  >
    Explore Bounties
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="m12 5 7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  </a>
</div>

        </div>
      </LampContainer>
    </section>
  );
};

export default VisionSection;
