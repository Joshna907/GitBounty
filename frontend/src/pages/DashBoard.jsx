// DashBoardFull.jsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Award,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Settings,
  LogOut,
  Github,
  Trophy,
  Target,
  Activity,
  Wallet,
  ExternalLink,
  Copy,
  Bell,
  Filter,
  Search,
  ChevronRight,
  Star,
  GitPullRequest,
  Calendar,
  Zap,
  BarChart3,
  FileText,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown
} from 'lucide-react';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

/**
 * Full Dashboard (Part 1 + Part 2 merged)
 * - Keeps original content you provided
 * - Adds Completed Bounties, Earnings, Settings, Disputes, Analytics (from Part2)
 * - Export/Stripe remain UI stubs (need backend)
 */

/* -----------------------
   Part 1 original data & UI
   ----------------------- */
const DashBoard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // main tabs (overview, active, completed, earnings, settings)
  const [walletConnected, setWalletConnected] = useState(true);

  // Mock user data
  const userData = {
    name: "John Doe",
    username: "@johndoe",
    email: "john.doe@example.com",
    avatar: "https://i.pravatar.cc/150?u=johndoe",
    githubUsername: "johndoe",
    walletAddress: "0x742d...4a8f",
    joinedDate: "January 2024",
    bio: "Full-stack developer passionate about Web3 and open source",
    reputation: 4.8,
    completionRate: 87,
    totalBounties: 12,
    rank: "Gold Hunter"
  };

  // Mock stats with enhanced data
  const stats = [
    {
      icon: Trophy,
      label: "Bounties Won",
      value: "12",
      change: "+3",
      changePercent: "+25%",
      trend: "up",
      period: "this month",
      color: "from-[#f50090] to-[#9b23ea]",
      bgColor: "bg-[#f50090]/10"
    },
    {
      icon: DollarSign,
      label: "Total Earnings",
      value: "$8,450",
      change: "+$1,200",
      changePercent: "+14.2%",
      trend: "up",
      period: "this month",
      color: "from-[#00d4ff] to-[#0066ff]",
      bgColor: "bg-[#00d4ff]/10"
    },
    {
      icon: Target,
      label: "Active Claims",
      value: "5",
      change: "2 pending",
      changePercent: "",
      trend: "neutral",
      period: "review",
      color: "from-[#ffd700] to-[#ff8c00]",
      bgColor: "bg-[#ffd700]/10"
    },
    {
      icon: Activity,
      label: "Success Rate",
      value: "87%",
      change: "+5%",
      changePercent: "+5.7%",
      trend: "up",
      period: "this month",
      color: "from-[#00ff88] to-[#00cc66]",
      bgColor: "bg-[#00ff88]/10"
    }
  ];

  // Enhanced activity timeline
  const recentActivity = [
    { 
      action: "Bounty Claimed", 
      title: "Add TypeScript Support", 
      repo: "react-app/frontend",
      time: "2 hours ago", 
      icon: CheckCircle2, 
      color: "text-green-500",
      amount: "$350",
      status: "completed"
    },
    { 
      action: "PR Submitted", 
      title: "Fix Authentication Bug", 
      repo: "defi-protocol/wallet",
      time: "5 hours ago", 
      icon: GitPullRequest, 
      color: "text-blue-500",
      amount: "$500",
      status: "pending"
    },
    { 
      action: "Bounty Started", 
      title: "Optimize Smart Contract", 
      repo: "blockchain/contracts",
      time: "1 day ago", 
      icon: Clock, 
      color: "text-yellow-500",
      amount: "$1,000",
      status: "in-progress"
    },
    { 
      action: "Payment Received", 
      title: "Dark Mode Implementation", 
      repo: "ui-library/components",
      time: "3 days ago", 
      icon: DollarSign, 
      color: "text-[#f50090]",
      amount: "$200",
      status: "paid"
    },
  ];

  // Active bounties with enhanced data
  const activeBounties = [
    {
      id: 1,
      title: "Fix Authentication Bug in Web3 Wallet",
      repo: "defi-protocol/wallet",
      reward: "$500",
      difficulty: "Intermediate",
      deadline: "3 days left",
      status: "in-progress",
      progress: 65,
      prUrl: "https://github.com/defi-protocol/wallet/pull/123",
      issueNumber: "#456",
      language: "TypeScript",
      stars: 1200
    },
    {
      id: 2,
      title: "Implement Dark Mode Toggle",
      repo: "ui-library/components",
      reward: "$200",
      difficulty: "Beginner",
      deadline: "5 days left",
      status: "pending-review",
      progress: 100,
      prUrl: "https://github.com/ui-library/components/pull/89",
      issueNumber: "#234",
      language: "JavaScript",
      stars: 850
    },
    {
      id: 3,
      title: "Optimize Smart Contract Gas Usage",
      repo: "blockchain/contracts",
      reward: "$1,000",
      difficulty: "Advanced",
      deadline: "7 days left",
      status: "in-progress",
      progress: 40,
      prUrl: null,
      issueNumber: "#789",
      language: "Solidity",
      stars: 2100
    }
  ];

  // Earnings breakdown
  const earningsData = {
    available: "$2,450",
    pending: "$1,200",
    withdrawn: "$4,800",
    nextPayout: "Jan 15, 2025"
  };


  /* -----------------------
     Part 2 components (merged inline)
     - CompletedBounties
     - EarningsPanel
     - SettingsPanel
     - DisputesPanel
     - AnalyticsPanel
     ----------------------- */

  // small badge helper
  const Badge = ({ children, color = "bg-[#f50090]" }) => (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color} bg-opacity-10 border border-white/5`}>{children}</span>
  );

  // Completed Bounties
  const CompletedBounties = ({ completed = [] }) => {
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("recent");

    const filtered = useMemo(() => {
      return completed
        .filter((b) => (filter === "all" ? true : (b.payoutStatus || b.status) === filter))
        .filter((b) => b.title.toLowerCase().includes(query.toLowerCase()) || (b.repo || '').toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => {
          if (sort === "recent") return new Date(b.completedAt || b.createdAt || 0) - new Date(a.completedAt || a.createdAt || 0);
          if (sort === "amount") return parseFloat((b.reward||'').replace(/[^0-9.]/g, "")) - parseFloat((a.reward||'').replace(/[^0-9.]/g, ""));
          return 0;
        });
    }, [completed, query, filter, sort]);

    return (
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Completed Bounties</h2>
            <p className="text-gray-400">History of your finished work, export and filter.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search completed..." className="pl-10 pr-4 py-2.5 bg-[#0d0d0d] border border-[#f50090]/30 rounded-lg text-white outline-none w-64" />
            </div>

            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2 bg-[#0d0d0d] border border-[#f50090]/30 rounded-lg">
              <option value="all">All</option>
              <option value="Paid">Paid</option>
              <option value="disputed">Disputed</option>
              <option value="refunded">Refunded</option>
            </select>

            <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2 bg-[#0d0d0d] border border-[#f50090]/30 rounded-lg">
              <option value="recent">Most Recent</option>
              <option value="amount">Highest Reward</option>
            </select>

            <button className="px-4 py-2 bg-gradient-to-r from-[#f50090] to-[#9b23ea] rounded-lg font-semibold">Export CSV</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((b) => (
            <div key={b.id} className="bg-[#0d0d0d] border border-[#f50090]/20 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{b.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-400 mb-2">
                    <span className="flex items-center gap-1"><FileText size={14} /> {b.issue || b.issueNumber || ''}</span>
                    <span className="flex items-center gap-1">{b.repo}</span>
                    <Badge color={b.difficulty === 'Advanced' ? 'bg-[#ffd700]' : 'bg-[#00d4ff]'}>{b.difficulty || '—'}</Badge>
                  </div>
                  <p className="text-sm text-gray-300">Completed on {b.completedAt ? new Date(b.completedAt).toLocaleDateString() : '—'}</p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-[#f50090]">{b.reward}</p>
                  <p className="text-xs text-gray-400 mt-1">{b.payoutStatus || '—'}</p>
                  <div className="mt-3 flex items-center gap-2 justify-end">
                    {b.prUrl ? (
                      <a href={b.prUrl} target="_blank" rel="noreferrer" className="px-3 py-2 bg-[#111] border border-[#f50090]/30 rounded-lg text-sm flex items-center gap-2">
                        <GitPullRequest size={14} /> View PR
                      </a>
                    ) : (
                      <button className="px-3 py-2 bg-[#111] border border-[#f50090]/30 rounded-lg text-sm">No PR</button>
                    )}
                    <button className="px-3 py-2 border border-gray-600 rounded-lg text-sm">Details</button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full bg-[#0d0d0d] border border-[#f50090]/20 rounded-xl p-8 text-center text-gray-400">
              No completed bounties found.
            </div>
          )}
        </div>
      </div>
    );
  };

  // Earnings & Payouts
  const EarningsPanel = ({ earnings = {} }) => {
    const mockLine = [
      { month: 'Jan', earned: 1200 },
      { month: 'Feb', earned: 800 },
      { month: 'Mar', earned: 1500 },
      { month: 'Apr', earned: 900 },
      { month: 'May', earned: 2000 },
      { month: 'Jun', earned: 2400 },
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">Earnings & Payouts</h2>
            <p className="text-gray-400">Connect Stripe to enable payouts. (UI-only stub)</p>
          </div>

          <div className="flex items-center gap-3">
            <Badge>Available: {earnings.available}</Badge>
            <Badge>Pending: {earnings.pending}</Badge>
            <button className="px-4 py-2 bg-gradient-to-r from-[#00d4ff] to-[#0066ff] rounded-lg font-semibold">Connect Stripe</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-[#0d0d0d] border border-[#f50090]/20 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-400 mb-3">Earnings (last 6 months)</h4>
            <div style={{ width: '100%', height: 240 }}>
              <ResponsiveContainer>
                <LineChart data={mockLine}>
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Line type="monotone" dataKey="earned" stroke="#f50090" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#0d0d0d] border border-[#f50090]/20 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-400 mb-3">Next Payout</h4>
            <p className="text-lg font-bold text-[#00ff88]">{earnings.nextPayout}</p>
            <p className="text-sm text-gray-400 mt-2">Withdraw to your connected bank via Stripe.</p>
            <div className="mt-4 flex flex-col gap-2">
              <button className="px-4 py-2 bg-gradient-to-r from-[#f50090] to-[#9b23ea] rounded-lg">Request Withdraw</button>
              <button className="px-4 py-2 border border-gray-600 rounded-lg">View Payout History</button>
            </div>
          </div>
        </div>

        <div className="bg-[#0d0d0d] border border-[#f50090]/20 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-gray-400">Payout History</h4>
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-400">
                <tr>
                  <th className="py-2">Date</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Destination</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {[{d:'2025-06-01', a:'$500', dest:'Bank ****1234', s:'Paid'}, {d:'2025-05-10', a:'$1200', dest:'Stripe Balance', s:'Paid'}].map((r,i)=> (
                  <tr key={i} className="border-t border-[#111]">
                    <td className="py-3 text-gray-300">{r.d}</td>
                    <td className="py-3">{r.a}</td>
                    <td className="py-3 text-gray-400">{r.dest}</td>
                    <td className="py-3 text-gray-400">{r.s}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Settings
  const SettingsPanel = ({ user = {} }) => {
    const [notifications, setNotifications] = useState({ email: true, sms: false, app: true });

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Account Settings</h2>

        <div className="bg-[#0d0d0d] border border-[#f50090]/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-3">Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400">Name</label>
              <input defaultValue={user.name} className="w-full mt-1 px-3 py-2 bg-[#111] rounded-lg" />
            </div>
            <div>
              <label className="text-sm text-gray-400">Email</label>
              <input defaultValue={user.email} className="w-full mt-1 px-3 py-2 bg-[#111] rounded-lg" />
            </div>
          </div>
        </div>

        <div className="bg-[#0d0d0d] border border-[#f50090]/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-3">Notifications</h3>
          <div className="flex flex-col gap-3">
            {['email','sms','app'].map(k=> (
              <div key={k} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold capitalize">{k}</p>
                  <p className="text-sm text-gray-400">Receive {k} notifications</p>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={notifications[k]} onChange={()=> setNotifications(s=>({...s,[k]:!s[k]}))} className="sr-only" />
                  <div className={`w-11 h-6 rounded-full ${notifications[k] ? 'bg-[#f50090]' : 'bg-gray-600'}`}></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0d0d0d] border border-[#f50090]/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-3">Connected Accounts</h3>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-[#111] border border-[#f50090]/20 rounded-lg">GitHub: connected</div>
            <div className="px-4 py-2 bg-[#111] border border-[#f50090]/20 rounded-lg">Wallet: {user.walletAddress || 'Not connected'}</div>
          </div>
        </div>
      </div>
    );
  };

  // Disputes
  const DisputesPanel = ({ disputes = [] }) => {
    const [filter, setFilter] = useState('open');
    const list = disputes.filter(d => filter === 'all' ? true : d.status === filter);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Dispute Management</h2>
            <p className="text-gray-400">Track and resolve disputes with timelines and messages.</p>
          </div>
          <div className="flex items-center gap-3">
            <select value={filter} onChange={(e)=>setFilter(e.target.value)} className="px-3 py-2 bg-[#0d0d0d] border border-[#f50090]/30 rounded-lg">
              <option value="open">Open</option>
              <option value="resolved">Resolved</option>
              <option value="appealed">Appealed</option>
              <option value="all">All</option>
            </select>
            <button className="px-4 py-2 bg-gradient-to-r from-[#f50090] to-[#9b23ea] rounded-lg">Raise Dispute</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {list.map(d => (
            <div key={d.id} className="bg-[#0d0d0d] border border-[#f50090]/20 rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{d.title}</h4>
                  <p className="text-sm text-gray-400">{d.bountyTitle} • {d.repo}</p>
                  <div className="text-xs text-gray-400 mt-2">Status: <strong className="ml-1">{d.status}</strong></div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Opened {new Date(d.openedAt).toLocaleDateString()}</p>
                  <button className="mt-3 px-3 py-2 border border-gray-600 rounded-lg">View</button>
                </div>
              </div>
            </div>
          ))}

          {list.length === 0 && <div className="text-center text-gray-400 bg-[#0d0d0d] border border-[#f50090]/20 rounded-xl p-8">No disputes found.</div>}
        </div>
      </div>
    );
  };

  // Analytics
  const AnalyticsPanel = ({ analytics = {} }) => {
    const barData = analytics.bountiesPerMonth || [
      { month: 'Jan', count: 2 },
      { month: 'Feb', count: 4 },
      { month: 'Mar', count: 3 },
      { month: 'Apr', count: 5 },
    ];
    const pieData = analytics.skillBreakdown || [
      { name: 'Frontend', value: 40 },
      { name: 'Smart Contracts', value: 35 },
      { name: 'DevOps', value: 25 },
    ];
    const COLORS = ['#f50090', '#00d4ff', '#ffd700'];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Analytics</h2>
          <div className="text-sm text-gray-400">Last 6 months</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-[#0d0d0d] border border-[#f50090]/20 rounded-xl p-4">
            <h4 className="text-sm text-gray-400 mb-3">Bounties Completed (monthly)</h4>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={barData}>
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#f50090" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#0d0d0d] border border-[#f50090]/20 rounded-xl p-4">
            <h4 className="text-sm text-gray-400 mb-3">Skills Breakdown</h4>
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };


  /* -----------------------
     Helper/data used by Part2 UI
     ----------------------- */
  const completedMock = [
    { id: 'c1', title: 'Fix authentication bug', issue: '#456', repo: 'defi-protocol/wallet', difficulty: 'Intermediate', reward: '$500', completedAt: '2025-06-01', payoutStatus: 'Paid', prUrl: 'https://github.com/defi-protocol/wallet/pull/123' },
    { id: 'c2', title: 'Dark mode', issue: '#89', repo: 'ui-library/components', difficulty: 'Beginner', reward: '$200', completedAt: '2025-05-10', payoutStatus: 'Paid', prUrl: 'https://github.com/ui-library/components/pull/89' }
  ];
  const disputesMock = [
    { id: 'd1', title: 'Wrong payout', bountyTitle: 'Optimize Gas', repo: 'blockchain/contracts', status: 'open', openedAt: '2025-06-02' }
  ];
  const analyticsMock = {};

  /* -----------------------
     Layout — original UI (part1) + integrated part2 routing
     ----------------------- */

  return (
    <div className="min-h-screen bg-[#090909] text-white font-sans">

      {/* Enhanced Header Section */}
      <div className="pt-24 pb-8 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-[#090909] via-[#0d0d0d] to-[#090909] border-b border-[#f50090]/10">
        <div className="max-w-7xl mx-auto">

          {/* Profile Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">

            {/* Profile Info */}
            <div className="flex items-start gap-6">
              <div className="relative group" style={{zIndex: 2}}>
                <div className="absolute -inset-1 bg-gradient-to-r from-[#f50090] to-[#9b23ea] rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300" />
                <img
                  src={userData.avatar}
                  alt={userData.name}
                  className="relative w-24 h-24 rounded-full border-4 border-[#090909]"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-[#f50090] to-[#9b23ea] rounded-full flex items-center justify-center border-2 border-[#090909]">
                  <CheckCircle2 size={16} className="text-white" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {userData.name}
                  </h1>
                  <span className="px-3 py-1 bg-gradient-to-r from-[#ffd700]/20 to-[#ff8c00]/20 border border-[#ffd700]/40 rounded-full text-sm font-semibold text-[#ffd700]">
                    {userData.rank}
                  </span>
                </div>

                <p className="text-gray-400 text-lg mb-3">{userData.username}</p>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Github size={16} className="text-[#f50090]" />
                    <span className="text-gray-300">{userData.githubUsername}</span>
                  </div>

                  {walletConnected && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0d0d0d] border border-[#f50090]/30 rounded-lg">
                      <Wallet size={16} className="text-[#00d4ff]" />
                      <span className="text-gray-300 font-mono text-sm">{userData.walletAddress}</span>
                      <button className="hover:text-[#f50090] transition-colors">
                        <Copy size={14} />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-[#ffd700] fill-[#ffd700]" />
                    <span className="text-gray-300 font-semibold">{userData.reputation}</span>
                    <span className="text-gray-500 text-sm ml-1">rating</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button className="px-6 py-3 bg-gradient-to-r from-[#f50090] to-[#9b23ea] rounded-lg hover:opacity-90 transition-all duration-300 shadow-[0_0_20px_rgba(245,0,144,0.3)] font-semibold flex items-center gap-2">
                <Settings size={18} />
                Edit Profile
              </button>
              <button className="p-3 bg-[#0d0d0d] border border-[#f50090]/40 rounded-lg hover:bg-[#1a1a1a] transition-all duration-300 relative">
                <Bell size={20} className="text-[#f50090]" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#f50090] rounded-full text-xs flex items-center justify-center font-bold">3</span>
              </button>
            </div>
          </div>

          {/* Bio */}
          <p className="text-gray-300 text-base lg:text-lg mb-6 max-w-3xl">{userData.bio}</p>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#0d0d0d] border border-[#f50090]/20 rounded-xl">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{userData.totalBounties}</p>
              <p className="text-sm text-gray-400 mt-1">Total Bounties</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#00ff88]">{userData.completionRate}%</p>
              <p className="text-sm text-gray-400 mt-1">Completion Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#00d4ff]">$8.4K</p>
              <p className="text-sm text-gray-400 mt-1">Total Earned</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#ffd700]">#{userData.rank === "Gold Hunter" ? "42" : "N/A"}</p>
              <p className="text-sm text-gray-400 mt-1">Global Rank</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="px-6 md:px-12 lg:px-20 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="group bg-[#0d0d0d] border border-[#f50090]/20 rounded-xl p-6 hover:shadow-[0_0_30px_rgba(245,0,144,0.2)] hover:border-[#f50090]/40 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={28} className="text-white" />
                    </div>
                    {stat.trend === 'up' && (
                      <div className="flex items-center gap-1 text-green-500 text-sm font-semibold">
                        <ArrowUpRight size={16} />
                        <span>{stat.changePercent}</span>
                      </div>
                    )}
                    {stat.trend === 'down' && (
                      <div className="flex items-center gap-1 text-red-500 text-sm font-semibold">
                        <ArrowDownRight size={16} />
                        <span>{stat.changePercent}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-gray-400 text-sm font-medium mb-2">{stat.label}</h3>
                  <p className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-300">{stat.change}</p>
                    <p className="text-xs text-gray-500">{stat.period}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="px-6 md:px-12 lg:px-20 py-4 sticky top-0 bg-[#090909]/95 backdrop-blur-sm z-20 border-b border-[#f50090]/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'active', label: 'Active Bounties', icon: Target },
              { id: 'completed', label: 'Completed', icon: CheckCircle2 },
              { id: 'earnings', label: 'Earnings', icon: DollarSign },
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'disputes', label: 'Disputes', icon: AlertCircle },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm lg:text-base font-semibold whitespace-nowrap rounded-lg transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#f50090] to-[#9b23ea] text-white shadow-[0_0_20px_rgba(245,0,144,0.3)]'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-[#0d0d0d]'
                  }`}
                >
                  <TabIcon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6 md:px-12 lg:px-20 py-8 pb-20">
        <div className="max-w-7xl mx-auto">

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Recent Activity - Takes 2 columns */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Activity className="text-[#f50090]" size={28} />
                      Recent Activity
                    </h2>
                    <button className="text-sm text-[#f50090] hover:text-[#9b23ea] transition-colors flex items-center gap-1">
                      View All
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <div className="bg-[#0d0d0d] border border-[#f50090]/20 rounded-xl p-6">
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => {
                        const Icon = activity.icon;
                        return (
                          <div
                            key={index}
                            className="group flex items-start gap-4 pb-4 border-b border-[#f50090]/10 last:border-0 hover:bg-[#111] p-3 rounded-lg transition-all cursor-pointer"
                          >
                            <div className={`mt-1 ${activity.color} p-2 rounded-lg bg-[#090909]`}>
                              <Icon size={20} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="text-gray-300 mb-1">
                                    <span className="text-white font-semibold">{activity.action}</span>
                                    {' "'}
                                    <span className="text-[#f50090]">{activity.title}</span>
                                    {'"'}
                                  </p>
                                  <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Github size={14} />
                                    <span>{activity.repo}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-[#00d4ff]">{activity.amount}</p>
                                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Performance & Achievements - Takes 1 column */}
                <div className="space-y-6">

                  {/* Performance This Month */}
                  <div className="bg-[#0d0d0d] border border-[#f50090]/20 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <TrendingUp className="text-[#f50090]" size={24} />
                      This Month
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Completed</span>
                        <span className="text-white font-bold text-lg">3</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Earned</span>
                        <span className="text-[#f50090] font-bold text-lg">$1,200</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Avg Rating</span>
                        <div className="flex items-center gap-1">
                          <Star size={16} className="text-[#ffd700] fill-[#ffd700]" />
                          <span className="text-white font-bold text-lg">4.8</span>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-[#f50090]/10">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400 text-sm">Monthly Goal</span>
                          <span className="text-gray-300 text-sm font-semibold">75%</span>
                        </div>
                        <div className="w-full bg-[#111] rounded-full h-2">
                          <div className="bg-gradient-to-r from-[#f50090] to-[#9b23ea] h-2 rounded-full" style={{width: '75%'}} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="bg-[#0d0d0d] border border-[#f50090]/20 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Award className="text-[#f50090]" size={24} />
                      Achievements
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { name: 'First Bounty', icon: '' },
                        { name: 'Speed Demon', icon: '' },
                        { name: 'Bug Hunter', icon: '' },
                        { name: 'Team Player', icon: '' }
                      ].map((badge, index) => (
                        <div
                          key={index}
                          className="group px-4 py-2 bg-gradient-to-r from-[#f50090]/20 to-[#9b23ea]/20 border border-[#f50090]/40 rounded-full text-sm font-semibold hover:from-[#f50090]/30 hover:to-[#9b23ea]/30 transition-all cursor-pointer flex items-center gap-2"
                        >
                          <span>{badge.icon}</span>
                          <span>{badge.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Bounties Tab */}
          {activeTab === 'active' && (
            <div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-2">Active Bounties</h2>
                  <p className="text-gray-400">Track your ongoing bounty work and submissions</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search bounties..."
                      className="pl-10 pr-4 py-2.5 bg-[#0d0d0d] border border-[#f50090]/30 rounded-lg text-white outline-none focus:border-[#f50090] transition-all w-64"
                    />
                  </div>

                  <Link
                    to="/explore-bounty"
                    className="px-6 py-2.5 bg-gradient-to-r from-[#f50090] to-[#9b23ea] rounded-lg hover:opacity-90 transition-all duration-300 font-semibold flex items-center gap-2 whitespace-nowrap"
                  >
                    <Zap size={18} />
                    Find Bounties
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                {activeBounties.map((bounty) => (
                  <div
                    key={bounty.id}
                    className="group bg-[#0d0d0d] border border-[#f50090]/20 rounded-xl p-6 hover:shadow-[0_0_30px_rgba(245,0,144,0.2)] hover:border-[#f50090]/40 transition-all duration-300"
                  >
                    <div className="flex flex-col gap-4">

                      {/* Header */}
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <h3 className="text-xl font-bold group-hover:text-[#f50090] transition-colors">
                              {bounty.title}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              bounty.status === 'in-progress'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                            }`}>
                              {bounty.status === 'in-progress' ? 'In Progress' : 'Pending Review'}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
                            <span className="flex items-center gap-1.5">
                              <Github size={16} />
                              {bounty.repo}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <FileText size={16} />
                              {bounty.issueNumber}
                            </span>
                            <span className="px-3 py-1 bg-[#f50090]/20 border border-[#f50090]/40 rounded-full">
                              {bounty.difficulty}
                            </span>
                            <span className="px-3 py-1 bg-[#111] rounded-full">
                              {bounty.language}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star size={14} className="text-[#ffd700]" />
                              {bounty.stars}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-3xl font-bold text-[#f50090]">{bounty.reward}</p>
                            <p className="text-sm text-gray-400 flex items-center gap-1 justify-end mt-1">
                              <Clock size={14} />
                              {bounty.deadline}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-400">Progress</span>
                          <span className="text-sm font-semibold text-white">{bounty.progress}%</span>
                        </div>
                        <div className="w-full bg-[#111] rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-[#f50090] to-[#9b23ea] h-2 rounded-full transition-all duration-500"
                            style={{width: `${bounty.progress}%`}}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        {bounty.prUrl ? (
                          <a
                            href={bounty.prUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-[#111] border border-[#f50090]/40 rounded-lg hover:bg-[#1a1a1a] transition-all duration-300 font-semibold text-sm flex items-center gap-2"
                          >
                            <GitPullRequest size={16} />
                            View PR
                            <ExternalLink size={14} />
                          </a>
                        ) : (
                          <button className="px-4 py-2 bg-gradient-to-r from-[#f50090] to-[#9b23ea] rounded-lg hover:opacity-90 transition-all duration-300 font-semibold text-sm flex items-center gap-2">
                            <GitPullRequest size={16} />
                            Submit PR
                          </button>
                        )}

                        <Link
                          to={`/bounty/${bounty.id}`}
                          className="px-4 py-2 border border-[#f50090]/40 rounded-lg hover:bg-[#1a1a1a] transition-all duration-300 font-semibold text-sm"
                        >
                          View Details
                        </Link>

                        <button className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-[#1a1a1a] transition-all duration-300 font-semibold text-sm text-gray-400 hover:text-white">
                          Update Status
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Bounties Tab (PART2 implemented) */}
          {activeTab === 'completed' && (
            <div>
              <CompletedBounties completed={completedMock} />
            </div>
          )}

          {/* Earnings Tab (PART2 implemented) */}
          {activeTab === 'earnings' && (
            <div>
              <EarningsPanel earnings={earningsData} />
            </div>
          )}

          {/* Settings Tab (PART2 implemented) */}
          {activeTab === 'settings' && (
            <div>
              <SettingsPanel user={userData} />
            </div>
          )}

          {/* Disputes Tab */}
          {activeTab === 'disputes' && (
            <div>
              <DisputesPanel disputes={disputesMock} />
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <AnalyticsPanel analytics={analyticsMock} />
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default DashBoard;
