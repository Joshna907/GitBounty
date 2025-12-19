import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./index.css";

import Navbar from "./components/Navbar";
import AnnouncementSection from "./components/AnnouncementSection";

// pages
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import ExploreBounty from "./pages/ExploreBounty";
import CreateBounty from "./pages/CreateBounty";
import ClaimBounty from "./pages/ClaimBounty";
import BountyDetails from "./pages/BountyDetails";
import ViewClaims from "./pages/ViewCliam";
import HandleCliam from "./pages/HandleCliam";
import CreatedBountyDetails from "./pages/CreatedBountyDetails";
import UserDashBoard from "./pages/UserDashBoard";
import MyBounties from "./pages/MyBounties";
import CreatorDashClaim from "./pages/CreatorDashClaim";
import AuthSuccess from "./pages/AuthSuccess";


function App() {
  const location = useLocation();

 const hideLayout = 
  location.pathname.startsWith("/view-claim") ||
  location.pathname.startsWith("/creator-dash")||
  location.pathname.startsWith("/dev-dash")||
  location.pathname.startsWith("/my-bounties")||
  location.pathname.startsWith("/claims-review");




  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/auth-success" element={<AuthSuccess />} />

        <Route path="/explore" element={<ExploreBounty />} />
        <Route path="/create-bounty" element={<CreateBounty />} />
        <Route path="/claim" element={<ClaimBounty />} />
        <Route path="/bounty/:id" element={<BountyDetails />} />

        <Route path="/claim/:id" element={<ClaimBounty />} />


        {/* Creator dashboard WITHOUT navbar/footer */}
        {/* static page */}
        <Route path="/view-claim" element={<ViewClaims />} />
        <Route path="/handle-claim" element={<HandleCliam />} />
        
        <Route path="/creator-dash" element={<CreatedBountyDetails />} />
        <Route path="/my-bounties" element={<MyBounties />} />
        <Route path="/claims-review" element={<CreatorDashClaim />} />
        {/* dynmic page */}
        <Route path="/view-claim/:id" element={<ViewClaims />} />
        <Route path="/handle-claim/:bountyId/:devAddress" element={< HandleCliam/>} />

      
      {/* developer dashboard */}
      <Route path="/dev-dash" element={<UserDashBoard />} />



      </Routes>

      {!hideLayout && <AnnouncementSection />}
    </>
  );
}

export default App;
