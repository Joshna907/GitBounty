import React,{useState} from "react";
import axios from "axios";


const AnnouncementSection = () => {
const [email,setEmail]= useState("");
const [loading,setLoading] = useState(false);

const handleSubscribe = async () => {
  if (!email) {
    alert("Please enter a valid email");
    return;
  }

  try {
    setLoading(true);

    const res = await axios.post(
      "http://localhost:2025/api/newsletter/subscribe",
      { email }
    );

    alert("🎉 Subscribed successfully!");
    setEmail("");
  } catch (err) {
    // 👇 READ BACKEND RESPONSE
    if (err.response && err.response.status === 409) {
      alert("⚠️ You are already subscribed");
    } else {
      alert("❌ Something went wrong. Try again later");
    }
  } finally {
    setLoading(false);
  }
};



  return (
    <section
      className=" bg-black relative w-full min-h-screen flex flex-col justify-center items-center text-center text-white px-4"
      style={{
        backgroundImage: "url('/images/mountain.jpg')", // replace with your image path
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay for dark fade */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 max-w-9xl">
        <h1 className="lg:text-6xl md:text-5xl font-bold mb-13">
          Stay on top of <br />
          <span className="lg:text-6xl font-bold mb-6 leading-tight md:leading-snug">GitBounty Announcements</span>
        </h1>
        <p className="text-lg md:text-xl leading-relaxed md:leading-loose mb-13">
          Get early access to exclusive features, updates, and project news on
          gasless transactions.
        </p>

        {/* Input + Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-98 px-5 py-3 rounded-lg outline-none bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:border-pink-400"
          />
          <button 
          onClick={handleSubscribe}
          disabled={loading}
          className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-3 rounded-lg font-medium transition">
  {loading ? "Joining..." : "Join the newsletter"}
          </button>
        </div>
      </div>

      {/* Footer links (optional) */}
      {/* Footer Section */}
<footer className="relative z-10 w-full mt-24 border-t border-white/10 text-xl text-gray-400 px-8 py-12">
  <div className="max-w-7xl mx-auto space-y-6">

    {/* SOCIALS */}
    <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start border-b border-white/10 pb-4">
      <h5 className="font-semibold text-white mb-3 sm:mb-0">SOCIALS</h5>
      <div className="flex flex-wrap justify-center sm:justify-end gap-6">
        <a href="#" className="hover:text-pink-400 transition">Twitter</a>
        <a href="#" className="hover:text-pink-400 transition">LinkedIn</a>
        <a href="#" className="hover:text-pink-400 transition">YouTube</a>
        <a href="#" className="hover:text-pink-400 transition">Discord</a>
        <a href="#" className="hover:text-pink-400 transition">GitHub</a>
      </div>
    </div>

    {/* QUICK LINKS */}
    <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start border-b border-white/10 pb-4">
      <h5 className="font-semibold text-white mb-3 sm:mb-0">QUICK LINKS</h5>
      <div className="flex flex-wrap justify-center sm:justify-end gap-6">
        <a href="#" className="hover:text-pink-400 transition">Home</a>
        <a href="#" className="hover:text-pink-400 transition">About</a>
        <a href="#" className="hover:text-pink-400 transition">Contact</a>
        <a href="#" className="hover:text-pink-400 transition">Blog</a>
      </div>
    </div>

    {/* RESOURCES */}
    <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start border-b border-white/10 pb-4">
      <h5 className="font-semibold text-white mb-3 sm:mb-0">RESOURCES</h5>
      <div className="flex flex-wrap justify-center sm:justify-end gap-6">
        <a href="#" className="hover:text-pink-400 transition">Create Bounty</a>
        <a href="#" className="hover:text-pink-400 transition">Explore Bounties</a>
        <a href="#" className="hover:text-pink-400 transition">Documentation</a>
      </div>
    </div>

  </div>
</footer>

    </section>
  );
};

export default AnnouncementSection;
