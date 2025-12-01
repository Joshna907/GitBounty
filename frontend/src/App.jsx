import React from "react";
import { Routes, Route } from "react-router-dom";
import "./index.css";

import Navbar from "./components/Navbar";
import AnnouncementSection from "./components/AnnouncementSection";

// pages
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import ExploreBounty from "./pages/ExploreBounty";
import DashBoard from "./pages/DashBoard";
import CreateBounty from "./pages/CreateBounty";
import ClaimBounty from "./pages/ClaimBounty";

import BountyDetails from "./pages/BountyDetails";







function App() {
  return (
  <>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={< SignIn/>} />
      <Route path="/explore" element={<ExploreBounty />} />
      <Route path="/dashboard" element={<DashBoard />} />
      <Route path="/create-bounty" element={<CreateBounty />} />
      <Route path="/explore-bounty" element={<ExploreBounty />} />
      <Route path="/claim" element={<ClaimBounty />} />
      <Route path="/bounty/:id" element={<BountyDetails />} />

    </Routes>
    <AnnouncementSection/>
  </>
  );
}

export default App;
