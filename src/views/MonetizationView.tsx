import React, { useState } from 'react';
import { 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight, 
  HelpCircle, 
  Sparkles, 
  TrendingUp, 
  CreditCard,
  Building,
  Check,
  Send,
  Sliders,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

export const MonetizationView: React.FC = () => {
  const { 
    currentChannel, 
    adminConfig, 
    applyForMonetization, 
    simulateChannelGrowth, 
    navigateTo,
    currentUser 
  } = useApp();

  const [legalName, setLegalName] = useState('Elena Rostova');
  const [country, setCountry] = useState('United States');
  const [payoutMethod, setPayoutMethod] = useState<'Stripe Direct' | 'Bank Wire' | 'PayPal Express'>('Stripe Direct');
  const [payoutAccount, setPayoutAccount] = useState('acct_stripe_992182');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const channel = currentChannel;
  const currentSubs = channel?.subscriberCount || 0;
  const currentViews = channel?.totalViews || 0;

  const reqSubs = adminConfig.requiredSubscribers;
  const reqViews = adminConfig.requiredViews;

  const subsProgress = Math.min(100, Math.round((currentSubs / reqSubs) * 100));
  const viewsProgress = Math.min(100, Math.round((currentViews / reqViews) * 100));
  const isBothMet = currentSubs >= reqSubs && currentViews >= reqViews;

  const status = channel?.monetization.status || 'not_eligible';

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channel || !agreedTerms) return;

    setIsSubmitting(true);
    setTimeout(() => {
      applyForMonetization(channel.id, legalName, country, payoutMethod, payoutAccount);
      setIsSubmitting(false);
    }, 800);
  };

  const handleSimulateBonus = () => {
    if (!channel) return;
    simulateChannelGrowth(channel.id, 200, 30000);
    // If it triggers eligibility
    if (currentSubs + 200 >= reqSubs && currentViews + 30000 >= reqViews) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              VidPulse Partner Program & Monetization
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Earn ad revenue, receive monthly payouts, and access premium creator tooling
          </p>
        </div>

        {/* Status Pill Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Channel Status:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            status === 'approved' 
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800' 
              : status === 'pending'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                : status === 'eligible'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-300 dark:border-blue-800'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}>
            {status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* SECTION A: APPROVED PARTNER DASHBOARD (When approved) */}
      {status === 'approved' && (
        <div className="space-y-6">
          {/* Earnings Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Estimated Earnings (30d)</div>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2 font-mono tabular-nums">
                ${(channel?.monetization.estimatedEarnings || 384.50).toFixed(2)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Revenue Share: {adminConfig.defaultRevenueSharePercent}% Creator / {100 - adminConfig.defaultRevenueSharePercent}% Platform</div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Finalized Balance</div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
                ${(channel?.monetization.finalizedEarnings || 280.00).toFixed(2)}
              </div>
              <div className="text-[11px] text-emerald-500 font-semibold mt-1">Ready for next payout cycle</div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Performance Metrics</div>
              <div className="flex items-center gap-4 mt-2 font-mono tabular-nums">
                <div>
                  <div className="text-xs text-slate-400">RPM</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">${channel?.monetization.rpm.toFixed(2) || '2.30'}</div>
                </div>
                <div className="h-6 w-px bg-slate-200 dark:border-slate-800" />
                <div>
                  <div className="text-xs text-slate-400">CPM</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">${channel?.monetization.cpm.toFixed(2) || '4.20'}</div>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Threshold: ${adminConfig.minimumPayoutAmount} USD</div>
            </div>
          </div>

          {/* Payment History Ledger */}
          <div className="bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" />
                <span>Payout & Remittance History</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Method: {channel?.monetization.payoutMethod}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono tabular-nums">
                <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Invoice ID</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Payout Method</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {(channel?.monetization.payments || []).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400 font-sans">
                        No prior payouts recorded. Payments generate on the 25th of each month for balances above ${adminConfig.minimumPayoutAmount}.
                      </td>
                    </tr>
                  ) : (
                    channel?.monetization.payments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{p.invoiceId}</td>
                        <td className="py-3 px-4 text-slate-500">{new Date(p.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-sans">{p.method}</td>
                        <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">${p.amount.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION B: APPLICATION UNDER REVIEW (When pending) */}
      {status === 'pending' && (
        <div className="p-8 rounded-3xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 text-center space-y-4">
          <Clock className="w-12 h-12 text-amber-500 mx-auto animate-pulse" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Your Partner Program Application is Pending Review
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            Submitted on {channel?.monetization.appliedDate ? new Date(channel.monetization.appliedDate).toLocaleDateString() : 'recently'}. 
            Our platform administrators are currently evaluating your channel's engagement authenticity, copyright compliance, and adherence to creator terms.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('admin')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-xs transition-colors"
            >
              Switch to Admin Dashboard to Review & Approve
            </button>
          </div>
        </div>
      )}

      {/* SECTION C: ELIGIBILITY TRACKER & PROGRESS REQUIREMENTS */}
      {(status === 'not_eligible' || status === 'eligible') && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Program Eligibility Requirements
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                To maintain a safe and authentic advertiser ecosystem, channels must meet these two genuine thresholds before submitting an application:
              </p>
            </div>

            {/* Requirement 1: Subscribers */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span>1. Genuine Subscribers</span>
                  {currentSubs >= reqSubs && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                </span>
                <span className="font-mono tabular-nums text-slate-600 dark:text-slate-400">
                  {currentSubs.toLocaleString()} / {reqSubs.toLocaleString()} ({subsProgress}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    currentSubs >= reqSubs ? 'bg-emerald-500' : 'bg-rose-600'
                  }`}
                  style={{ width: `${subsProgress}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 flex justify-between font-mono tabular-nums">
                <span>{Math.max(0, reqSubs - currentSubs).toLocaleString()} subscribers remaining</span>
                <span>Minimum: {reqSubs.toLocaleString()}</span>
              </div>
            </div>

            {/* Requirement 2: Eligible Views */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span>2. Valid Eligible Views ({adminConfig.qualificationDays}d period)</span>
                  {currentViews >= reqViews && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                </span>
                <span className="font-mono tabular-nums text-slate-600 dark:text-slate-400">
                  {currentViews.toLocaleString()} / {reqViews.toLocaleString()} ({viewsProgress}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    currentViews >= reqViews ? 'bg-emerald-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${viewsProgress}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 flex justify-between font-mono tabular-nums">
                <span>{Math.max(0, reqViews - currentViews).toLocaleString()} views remaining</span>
                <span>Minimum: {reqViews.toLocaleString()}</span>
              </div>
            </div>

            {/* Simulation testing tool for instant unlocking */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl">
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Channel Growth Testing Tool</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Advance channel numbers to test the unlock and review application flow.
                </div>
              </div>
              <button
                type="button"
                onClick={handleSimulateBonus}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-xs shrink-0"
              >
                +200 Subs & +30k Views
              </button>
            </div>
          </div>

          {/* APPLICATION FORM: Unlocked when both requirements are met */}
          {isBothMet ? (
            <div className="bg-white dark:bg-[#16161c] border-2 border-emerald-500/60 rounded-3xl p-6 shadow-lg space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Congratulations! Your Channel is Eligible to Apply
                  </h3>
                  <p className="text-xs text-slate-500">
                    Submit your application details below for administrator review and approval.
                  </p>
                </div>
              </div>

              <form onSubmit={handleApply} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Applicant Legal Name / Entity *
                    </label>
                    <input
                      type="text"
                      value={legalName}
                      onChange={(e) => setLegalName(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tax Residency Country *
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Payout Method
                    </label>
                    <select
                      value={payoutMethod}
                      onChange={(e) => setPayoutMethod(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-100 cursor-pointer"
                    >
                      <option value="Stripe Direct">Stripe Direct Deposit</option>
                      <option value="Bank Wire">International Bank Wire (IBAN/SWIFT)</option>
                      <option value="PayPal Express">PayPal Business</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Payout Account / Identifier
                    </label>
                    <input
                      type="text"
                      value={payoutAccount}
                      onChange={(e) => setPayoutAccount(e.target.value)}
                      required
                      placeholder="acct_... or IBAN or email"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2.5 pt-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>
                    I certify that my channel content complies with VidPulse Copyright Guidelines, Commercial Terms, and does not engage in artificial engagement manipulation.
                  </span>
                </label>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!agreedTerms || isSubmitting}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Submitting Application...' : 'Submit Partner Application'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-slate-400 shrink-0" />
              <span>
                The monetization application will automatically unlock once both the subscriber ({reqSubs.toLocaleString()}) and view count ({reqViews.toLocaleString()}) requirements are satisfied.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
