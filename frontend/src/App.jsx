import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
import ViewClaims from "./pages/ViewCliam";
import HandleCliam from "./pages/HandleCliam";
import CreatedBountyDetails from "./pages/CreatedBountyDetails";



function App() {
  const location = useLocation();

 const hideLayout = 
  location.pathname.startsWith("/view-claim") ||
  location.pathname.startsWith("/handle-claim") ||
  location.pathname.startsWith("/bounty-details") ||
  location.pathname.startsWith("/close-bounty") ;


  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/explore" element={<ExploreBounty />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/create-bounty" element={<CreateBounty />} />
        <Route path="/claim" element={<ClaimBounty />} />
        <Route path="/bounty/:id" element={<BountyDetails />} />

        <Route path="/claim/:id" element={<ClaimBounty />} />


        {/* Creator dashboard WITHOUT navbar/footer */}
        {/* static page */}
        <Route path="/view-claim" element={<ViewClaims />} />
        <Route path="/handle-claim" element={<HandleCliam />} />
        <Route path="/bounty-details" element={<CreatedBountyDetails />} />
        
        {/* dynmic page */}
        <Route path="/view-claim/:id" element={<ViewClaims />} />
        <Route path="/handle-claim/:id/:devAddress" element={< HandleCliam/>} />
        


      </Routes>

      {!hideLayout && <AnnouncementSection />}
    </>
  );
}

export default App;
