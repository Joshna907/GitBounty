import React from "react";

const FeaturesSection = () => {
  return (
    <div className="bg-black text-white py-24 px-6 text-center relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
    <div className="inline-flex px-6 py-2 rounded-full bg-[#f50090]/20 mb-12 backdrop-blur-lg shadow-[0_0_20px_rgba(255,255,255,0.15)]">
  <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#f50090] to-[#9b23ea] px-4 py-1 text-sm font-medium text-white shadow-[0_0_20px_rgba(245,0,144,0.4)] hover:opacity-95 transition-all duration-300">
    Features
  </span>
</div>




        <h2 className="text-5xl font-bold mb-4">Discover Powerful</h2>
        <h2 className="text-5xl font-bold mb-8">Tools Built for Developers</h2>

        <p className="text-gray-400 mb-16">
          Explore what makes <span className="text-[#f50090] font-semibold">GitBounty</span> fast, transparent, and decentralized.
        </p>

        {/* Features Container */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mt-16">
          {/* Feature 1 */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-16 h-16 mb-6 text-[#f50090]">
              <svg
                className="w-full h-full"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 7h3a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h3m3-3h3a2 2 0 012 2v3M9 5h3a2 2 0 012 2v3"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-2">Smart Contract Payments</h3>
            <p className="text-gray-400 text-l max-w-xs">
              Automated, secure crypto payouts once submissions are verified — ensuring transparency and trust.
            </p>
          </div>

          {/* Arrow between 1 & 2 */}
          <div className="hidden md:flex items-center justify-center w-[180px]">
            <svg
              width="100%"
              height="40"
              viewBox="0 0 200 40"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="arrowGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f50090" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#f50090" stopOpacity="1" />
                </linearGradient>
              </defs>
              <path
                d="M0 20 H180 L170 10 M180 20 L170 30"
                stroke="url(#arrowGradient1)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Feature 2 */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-16 h-16 mb-6 text-[#f50090]">
              <svg
                className="w-full h-full"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-2">Verified Submissions</h3>
            <p className="text-gray-400 text-l max-w-xs">
              Developers link GitHub pull requests directly to your posted issues for full transparency.
            </p>
          </div>

          {/* Arrow between 2 & 3 */}
          <div className="hidden md:flex items-center justify-center w-[180px]">
            <svg
              width="100%"
              height="40"
              viewBox="0 0 200 40"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="arrowGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f50090" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#f50090" stopOpacity="1" />
                </linearGradient>
              </defs>
              <path
                d="M0 20 H180 L170 10 M180 20 L170 30"
                stroke="url(#arrowGradient2)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Feature 3 */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-16 h-16 mb-6 text-[#f50090]">
              <svg
                className="w-full h-full"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-2">
              Escrow‑Based Smart Contracts
            </h3>
            <p className="text-gray-400 text-l max-w-xs">
              Bounty rewards are locked securely in Ethereum smart contracts and
              released only after verified task completion, ensuring trust and security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
