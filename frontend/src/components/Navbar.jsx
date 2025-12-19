import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const [token, setToken] = useState(localStorage.getItem("gitbounty_token"));
  const [role, setRole] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [openDashboard, setOpenDashboard] = useState(false);

  // 🔄 Sync token
  useEffect(() => {
    const sync = () => setToken(localStorage.getItem("gitbounty_token"));
    window.addEventListener("tokenUpdated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("tokenUpdated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // 🔐 Decode token
  useEffect(() => {
    if (!token) return setRole(null);
    try {
      const decoded = jwtDecode(token);
      setAvatar(decoded.avatar || null);
      setRole(decoded.roles || null);
    } catch {
      setRole(null);
    }
  }, [token]);

  // 🔌 Wallet connect
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask");
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setWalletAddress(accounts[0]);
  };

  const shortWallet = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "";

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-black/20 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* Logo */}
        <img src="/images/logo.png" alt="logo" className="h-14" />

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-[18px] font-semibold uppercase">

          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/explore">Explore</Link>

          {!token && (
            <Link className="nav-link" to="/sign-in">Sign In</Link>
          )}

          {/* Dashboard Dropdown */}
          {role && (role.creator || role.developer) && (
            <div
              className="relative"
              onMouseEnter={() => setOpenDashboard(true)}
              onMouseLeave={() => setOpenDashboard(false)}
            >
              <button className="nav-link">DASHBOARD</button>

              {openDashboard && (
                <div className="absolute right-0 top-full pt-2">
                  <div className="w-56 rounded-xl bg-[#0e0e0e] border border-white/10 shadow-xl overflow-hidden">
                    {role.creator && (
                      <Link
                        to="/creator-dash"
                        className="dropdown-item"
                        onClick={() => setOpenDashboard(false)}
                      >
                        Creator Dashboard
                      </Link>
                    )}
                    {role.developer && (
                      <Link
                        to="/dev-dash"
                        className="dropdown-item"
                        onClick={() => setOpenDashboard(false)}
                      >
                        Developer Dashboard
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Wallet */}
          {walletAddress ? (
            <div className="wallet-chip" title={walletAddress}>
              {shortWallet}
            </div>
          ) : (
            <button onClick={connectWallet} className="wallet-btn">
              Connect Wallet
            </button>
          )}

          {/* Profile */}
          <Link
            to={
              role?.creator
                ? "/creator-dash"
                : role?.developer
                ? "/dev-dash"
                : "/sign-in"
            }
          >
            {avatar ? (
              <img
                src={avatar}
                alt="profile"
                className="w-9 h-9 rounded-full border border-[#f50090]"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#1a1a1a] flex items-center justify-center border border-white/10">
                <User size={18} className="text-gray-400" />
              </div>
            )}
          </Link>

        </div>
      </div>

      {/* Styles */}
      <style>{`
        .nav-link {
          color: #d1d5db;
          transition: color 0.2s;
          background: transparent;
          border: none;
        }
        .nav-link:hover {
          color: #f50090;
        }

        /* WALLET BUTTON FIX — ALL STATES */
        .wallet-btn {
          padding: 8px 18px;
          border-radius: 9999px;
          background: linear-gradient(to right,#f50090,#9b23ea);
          color: #ffffff !important;
          font-size: 15px;
          font-weight: 600;
          border: none;
          outline: none;
          cursor: pointer;
        }

        .wallet-btn:hover,
        .wallet-btn:focus,
        .wallet-btn:active {
         background: linear-gradient(to right,#f50090,#9b23ea);
          color: white !important;
          outline: none;
        }

        .wallet-chip {
          max-width: 130px;
          padding: 7px 14px;
          border-radius: 9999px;
          background: #111;
          border: 1px solid rgba(255,255,255,0.1);
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* DROPDOWN FIX */
        .dropdown-item {
          display: block;
          padding: 14px 18px;
          font-size: 14px;
          color: #e5e7eb;
          cursor: pointer;
          transition: background 0.2s;
        }
        .dropdown-item:hover {
          background: rgba(245,0,144,0.2);
          color: #f50090;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
