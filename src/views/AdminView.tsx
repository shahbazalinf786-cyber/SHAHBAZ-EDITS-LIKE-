import React, { useState } from 'react';
import { 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Sliders, 
  AlertTriangle, 
  Users, 
  Tv, 
  Film, 
  DollarSign, 
  Check, 
  Trash2, 
  Eye, 
  Lock,
  Save,
  Clock,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminView: React.FC = () => {
  const { 
    currentUser, 
    channels, 
    videos, 
    reports, 
    adminConfig, 
    updateAdminConfig, 
    reviewMonetizationApplication, 
    updateReportStatus, 
    users, 
    updateChannel,
    navigateTo 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'monetization' | 'reports' | 'config' | 'users' | 'audit'>('monetization');

  // Config inputs
  const [reqSubs, setReqSubs] = useState(adminConfig.requiredSubscribers);
  const [reqViews, setReqViews] = useState(adminConfig.requiredViews);
  const [qualDays, setQualDays] = useState(adminConfig.qualificationDays);
  const [revShare, setRevShare] = useState(adminConfig.defaultRevenueSharePercent);
  const [minPayout, setMinPayout] = useState(adminConfig.minimumPayoutAmount);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Review notes
  const [reviewNote, setReviewNote] = useState('');

  // Pending monetization apps
  const pendingChannels = channels.filter(c => c.monetization.status === 'pending');
  const pendingReports = reports.filter(r => r.status === 'pending');

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminConfig({
      requiredSubscribers: Number(reqSubs),
      requiredViews: Number(reqViews),
      qualificationDays: Number(qualDays),
      defaultRevenueSharePercent: Number(revShare),
      minimumPayoutAmount: Number(minPayout),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleApprovePartner = (channelId: string) => {
    reviewMonetizationApplication(channelId, 'approved', reviewNote || 'All engagement metrics verified and copyright standards met.');
    setReviewNote('');
  };

  const handleRejectPartner = (channelId: string) => {
    reviewMonetizationApplication(channelId, 'rejected', reviewNote || 'Channel does not satisfy our minimum quality and originality threshold.');
    setReviewNote('');
  };

  const totalPlatformViews = videos.reduce((acc, v) => acc + v.views, 0);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>VidPulse Admin Console</span>
              <span className="text-xs px-2 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold rounded-md uppercase">Superadmin</span>
            </h1>
            <p className="text-xs text-slate-500">
              Moderation queue, partner application approval, user oversight, and global system thresholds
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
          Operator: <span className="font-bold text-slate-900 dark:text-white">{currentUser?.name || 'Administrator'}</span>
        </div>
      </div>

      {/* Admin KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Registered Creators</span>
            <Users className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5 font-mono tabular-nums">
            {users.length}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Total Channels</span>
            <Tv className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5 font-mono tabular-nums">
            {channels.length}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Pending Partner Apps</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5 font-mono tabular-nums text-emerald-500">
            {pendingChannels.length}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Flagged Reports</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5 font-mono tabular-nums text-amber-500">
            {pendingReports.length}
          </div>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
        {[
          { id: 'monetization', label: 'Monetization Reviews', count: pendingChannels.length },
          { id: 'reports', label: 'Content Reports', count: pendingReports.length },
          { id: 'config', label: 'Threshold Rules & Revenue' },
          { id: 'users', label: 'Users & Channels', count: channels.length },
          { id: 'audit', label: 'Audit Log' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 px-3.5 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                tab.count > 0 ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400' : 'opacity-60'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: Monetization Reviews */}
      {activeTab === 'monetization' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Pending Partner Applications ({pendingChannels.length})
            </h3>
            <span className="text-xs text-slate-400">
              Configured threshold: {adminConfig.requiredSubscribers.toLocaleString()} subs & {adminConfig.requiredViews.toLocaleString()} views
            </span>
          </div>

          {pendingChannels.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400 bg-white dark:bg-[#16161c] rounded-3xl border border-slate-200 dark:border-slate-800">
              No pending monetization applications. Channels meeting the threshold will appear here.
            </div>
          ) : (
            pendingChannels.map((chan) => (
              <div
                key={chan.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={chan.avatar}
                      alt={chan.name}
                      className="w-12 h-12 rounded-full object-cover shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-base text-slate-900 dark:text-white">
                        <span>{chan.name}</span>
                        <span className="text-xs font-mono text-slate-400 font-normal">{chan.handle}</span>
                      </div>
                      <div className="text-xs text-slate-500 font-mono tabular-nums mt-0.5">
                        Subscribers: <span className="font-bold text-slate-900 dark:text-white">{chan.subscriberCount.toLocaleString()}</span> · Views: <span className="font-bold text-slate-900 dark:text-white">{chan.totalViews.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <div className="text-slate-400">Submitted</div>
                    <div className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {chan.monetization.appliedDate ? new Date(chan.monetization.appliedDate).toLocaleDateString() : 'Today'}
                    </div>
                  </div>
                </div>

                {/* Application Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 text-xs">
                  <div>
                    <div className="text-slate-400 text-[11px]">Applicant Legal Name</div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">{chan.monetization.applicantLegalName || chan.name}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[11px]">Tax Country</div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">{chan.monetization.applicantCountry || 'Verified'}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[11px]">Payout Method</div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">{chan.monetization.payoutMethod}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[11px]">Payout Account</div>
                    <div className="font-bold font-mono text-slate-900 dark:text-white mt-0.5">{chan.monetization.payoutAccountInfo || 'Encrypted'}</div>
                  </div>
                </div>

                {/* Optional Review Note & Decision Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                  <input
                    type="text"
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    placeholder="Optional review notes or feedback for creator..."
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-slate-100"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleRejectPartner(chan.id)}
                      className="px-4 py-2 border border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer transition-colors"
                    >
                      Reject Application
                    </button>
                    <button
                      onClick={() => handleApprovePartner(chan.id)}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve Partner</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Content Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            User Moderation Reports ({reports.length})
          </h3>

          <div className="space-y-3">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400">
                      {rep.reason.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Target: <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">{rep.targetType}</span>
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {rep.targetTitle}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    "{rep.details}" · Reported by {rep.reportedByUserName}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {rep.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => updateReportStatus(rep.id, 'dismissed', 'Report reviewed; found in compliance.')}
                        className="px-3.5 py-1.5 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => updateReportStatus(rep.id, 'resolved', 'Content taken down and creator notified.')}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
                      >
                        Enforce Action
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-emerald-500 capitalize">
                      Status: {rep.status} ({rep.actionTaken || 'Completed'})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Threshold & Revenue Rules Configuration */}
      {activeTab === 'config' && (
        <form onSubmit={handleSaveConfig} className="bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs max-w-2xl space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Monetization Eligibility & Financial Rules
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Configure platform-wide qualification rules. Changes take effect immediately across all creator dashboards.
            </p>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Platform thresholds updated and applied live!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Required Subscribers Threshold *
              </label>
              <input
                type="number"
                value={reqSubs}
                onChange={(e) => setReqSubs(Number(e.target.value))}
                min={1}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 font-mono tabular-nums text-slate-900 dark:text-slate-100"
              />
              <span className="text-[10px] text-slate-400">Default requirement: 1,000 subscribers</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Required Eligible Views Threshold *
              </label>
              <input
                type="number"
                value={reqViews}
                onChange={(e) => setReqViews(Number(e.target.value))}
                min={1}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 font-mono tabular-nums text-slate-900 dark:text-slate-100"
              />
              <span className="text-[10px] text-slate-400">Default requirement: 100,000 views</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Qualification Period (Days)
              </label>
              <input
                type="number"
                value={qualDays}
                onChange={(e) => setQualDays(Number(e.target.value))}
                min={30}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 font-mono tabular-nums text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Creator Revenue Share (%)
              </label>
              <input
                type="number"
                value={revShare}
                onChange={(e) => setRevShare(Number(e.target.value))}
                min={10}
                max={90}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 font-mono tabular-nums text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Min Payout Amount ($ USD)
              </label>
              <input
                type="number"
                value={minPayout}
                onChange={(e) => setMinPayout(Number(e.target.value))}
                min={10}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 font-mono tabular-nums text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Apply Global Thresholds</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: Users & Channels */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Channels Registry ({channels.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono tabular-nums">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-sans">Channel</th>
                  <th className="py-3 px-4 font-sans">Subscribers</th>
                  <th className="py-3 px-4 font-sans">Total Views</th>
                  <th className="py-3 px-4 font-sans">Verified</th>
                  <th className="py-3 px-4 font-sans">Monetization</th>
                  <th className="py-3 px-4 text-right font-sans">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {channels.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-sans font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <img src={c.avatar} alt={c.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                      <div>
                        <div>{c.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal font-mono">{c.handle}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{c.subscriberCount.toLocaleString()}</td>
                    <td className="py-3 px-4">{c.totalViews.toLocaleString()}</td>
                    <td className="py-3 px-4 font-sans">
                      <button
                        onClick={() => updateChannel(c.id, { verified: !c.verified })}
                        className={`text-xs font-semibold cursor-pointer ${
                          c.verified ? 'text-blue-500' : 'text-slate-400'
                        }`}
                        title="Click to toggle verified badge"
                      >
                        {c.verified ? 'Verified ✓' : 'Unverified'}
                      </button>
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span className="capitalize">{c.monetization.status.replace('_', ' ')}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-sans">
                      <button
                        onClick={() => navigateTo('channel', c.id)}
                        className="text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline cursor-pointer"
                      >
                        View Channel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: System Audit Log */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3 font-mono text-xs tabular-nums">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans">
            Administrative Audit Trail
          </h3>
          <div className="space-y-2 text-slate-600 dark:text-slate-400">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex justify-between">
              <span>[SYSTEM_BOOT] Security policies and rate limiters initialized</span>
              <span className="text-slate-400">2026-10-23 04:00</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex justify-between">
              <span>[MONETIZATION_CONFIG] Threshold verified at {adminConfig.requiredSubscribers} subs & {adminConfig.requiredViews} views</span>
              <span className="text-slate-400">2026-10-23 04:30</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex justify-between">
              <span>[FRAUD_DETECTION] Zero bot signals detected in qualification window</span>
              <span className="text-slate-400">2026-10-23 05:00</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
