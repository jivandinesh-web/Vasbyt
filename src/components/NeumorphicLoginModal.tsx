import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Award,
  Sparkles,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NeumorphicButton } from './NeumorphicButton';
import { NeumorphicGoogleSignInButton } from './NeumorphicGoogleSignInButton';
import { PROVINCES } from '../data/runningData';

interface NeumorphicLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'google' | 'email-signin' | 'email-register' | 'asa-license';

export const NeumorphicLoginModal: React.FC<NeumorphicLoginModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    user,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    loginAsGuestRunner,
    authLoading,
    loginError,
    clearLoginError,
  } = useAuth();

  // Close modal when user is successfully authenticated
  React.useEffect(() => {
    if (user && isOpen) {
      onClose();
    }
  }, [user, isOpen, onClose]);

  const [activeTab, setActiveTab] = useState<AuthMode>('google');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [runnerName, setRunnerName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('gp');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);
    clearLoginError();

    if (activeTab === 'email-register') {
      await registerWithEmail(email, password, runnerName);
    } else {
      await loginWithEmail(email, password);
    }
    setIsSubmitting(false);
  };

  const handleAsaLicenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearLoginError();
    await loginAsGuestRunner(
      runnerName || `Runner #${licenseNumber || 'ASA'}`,
      licenseNumber
    );
    setIsSubmitting(false);
  };

  return (
    <div
      id="modal-neumorphic-login-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="modal-neumorphic-login-card"
        className="w-full max-w-md bg-gradient-to-br from-[#191f2b] via-[#151922] to-[#12151b] border border-[#2b3545] rounded-xs shadow-[10px_10px_25px_#06080b,-8px_-8px_20px_#222a3a] overflow-hidden text-left relative"
      >
        {/* Top Header Bar with tactile close button */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#232b38] bg-[#12151d]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xs neu-inset flex items-center justify-center text-[#e28b37] border border-[#e28b37]/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-lg tracking-wider uppercase text-[#f5efe3] leading-none">
                  VAS<span className="text-[#e28b37]">BYT</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#d8b34a] bg-[#d8b34a]/15 border border-[#d8b34a]/30 px-1.5 py-0.2 rounded-full">
                  Athlete Login
                </span>
              </div>
              <p className="text-[11px] text-[#6d7580] mt-0.5">
                South African Athletics &amp; Runner Portal
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="neu-icon-btn w-8 h-8 rounded-xs text-[#9aa1ac] hover:text-[#f5efe3] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Neumorphic Segmented Tab Selector */}
          <div className="neu-segment-track p-1 rounded-xs flex items-center gap-1">
            <button
              type="button"
              id="tab-btn-google-auth"
              onClick={() => {
                setActiveTab('google');
                clearLoginError();
              }}
              className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-xs transition-all text-center cursor-pointer ${
                activeTab === 'google'
                  ? 'neu-segment-tab-active font-extrabold'
                  : 'text-[#9aa1ac] hover:text-[#f5efe3]'
              }`}
            >
              Google 1-Tap
            </button>
            <button
              type="button"
              id="tab-btn-email-auth"
              onClick={() => {
                setActiveTab('email-signin');
                clearLoginError();
              }}
              className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-xs transition-all text-center cursor-pointer ${
                activeTab === 'email-signin' || activeTab === 'email-register'
                  ? 'neu-segment-tab-active font-extrabold'
                  : 'text-[#9aa1ac] hover:text-[#f5efe3]'
              }`}
            >
              Email Account
            </button>
            <button
              type="button"
              id="tab-btn-asa-auth"
              onClick={() => {
                setActiveTab('asa-license');
                clearLoginError();
              }}
              className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-xs transition-all text-center cursor-pointer ${
                activeTab === 'asa-license'
                  ? 'neu-segment-tab-active font-extrabold'
                  : 'text-[#9aa1ac] hover:text-[#f5efe3]'
              }`}
            >
              ASA License
            </button>
          </div>

          {/* Login Error Box */}
          {loginError && (
            <div className="p-3 bg-[#802222]/20 border border-[#802222]/40 rounded-xs flex items-start justify-between gap-2.5 text-xs text-[#fca5a5] shadow-[inset_2px_2px_5px_#260808]">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#ea5b5b] mt-0.5" />
                <span className="leading-snug">{loginError}</span>
              </div>
              <button
                type="button"
                onClick={clearLoginError}
                className="text-[#9aa1ac] hover:text-white underline cursor-pointer shrink-0 text-[11px]"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* TAB 1: GOOGLE FAST SIGN-IN */}
          {activeTab === 'google' && (
            <div className="space-y-4 pt-1">
              <div className="text-center space-y-1">
                <h3 className="font-display font-black text-xl text-[#f5efe3] tracking-wide uppercase">
                  Fast Athlete Sign-In
                </h3>
                <p className="text-xs text-[#9aa1ac] max-w-xs mx-auto leading-relaxed">
                  Sign in instantly with your verified Google account to preserve your athlete records in the cloud.
                </p>
              </div>

              {/* Neumorphic Google Button */}
              <div className="pt-2 flex justify-center">
                <NeumorphicGoogleSignInButton
                  onClick={loginWithGoogle}
                  loading={authLoading}
                  label="Continue with Google"
                  size="lg"
                  className="w-full"
                />
              </div>

              {/* Neumorphic Feature Benefits List */}
              <div className="neu-inset p-3.5 rounded-xs space-y-2.5 mt-4">
                <div className="text-[11px] font-bold uppercase tracking-widest text-[#d8b34a] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#7c8f5c]" />
                  What syncs to your account:
                </div>
                <div className="space-y-1.5 text-xs text-[#c0c6d0]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#e28b37] shrink-0" />
                    <span>Personal Best times across 5k, 10k, Half, Marathon &amp; Ultras</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#e28b37] shrink-0" />
                    <span>Bookmarked fixtures across all 6 sporting disciplines</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#e28b37] shrink-0" />
                    <span>Comrades Marathon &amp; Two Oceans qualifier countdowns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#e28b37] shrink-0" />
                    <span>Athletics club roster affiliation &amp; time-trial tracking</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EMAIL & PASSWORD (SIGN IN OR REGISTER) */}
          {(activeTab === 'email-signin' || activeTab === 'email-register') && (
            <form onSubmit={handleEmailSubmit} className="space-y-4 pt-1">
              {/* Toggle between Sign In and Register */}
              <div className="flex items-center justify-between text-xs pb-1 border-b border-[#232b38]">
                <span className="font-bold text-[#f5efe3] uppercase tracking-wider">
                  {activeTab === 'email-signin'
                    ? 'Sign In With Email'
                    : 'Create Runner Account'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab(
                      activeTab === 'email-signin'
                        ? 'email-register'
                        : 'email-signin'
                    );
                    clearLoginError();
                  }}
                  className="text-xs text-[#e28b37] hover:underline font-semibold cursor-pointer"
                >
                  {activeTab === 'email-signin'
                    ? 'Need an account? Register →'
                    : '← Already have an account? Sign in'}
                </button>
              </div>

              {/* Full Name for Registration */}
              {activeTab === 'email-register' && (
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-bold text-[#9aa1ac] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#e28b37]" />
                    Runner Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={runnerName}
                      onChange={(e) => setRunnerName(e.target.value)}
                      placeholder="e.g. Sipho Sithole"
                      className="neu-input w-full px-3.5 py-2.5 rounded-xs text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-bold text-[#9aa1ac] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#e28b37]" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="runner@athletics.co.za"
                    className="neu-input w-full px-3.5 py-2.5 rounded-xs text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-bold text-[#9aa1ac] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#e28b37]" />
                    Password
                  </span>
                  {activeTab === 'email-register' && (
                    <span className="text-[10px] text-[#6d7580]">Min 6 characters</span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="neu-input w-full px-3.5 py-2.5 pr-10 rounded-xs text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7580] hover:text-[#f5efe3] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Neumorphic Remember Me Switch */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                      rememberMe ? 'neu-switch-track border-[#e28b37]/50' : 'neu-switch-track'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full transition-transform ${
                        rememberMe
                          ? 'translate-x-4 neu-switch-thumb-active'
                          : 'translate-x-0 neu-switch-thumb'
                      }`}
                    />
                  </div>
                  <span className="text-xs text-[#9aa1ac]">Stay signed in</span>
                </label>

                {activeTab === 'email-signin' && (
                  <button
                    type="button"
                    onClick={loginWithGoogle}
                    className="text-xs text-[#9aa1ac] hover:text-[#e28b37] transition-colors cursor-pointer"
                  >
                    Use Google Instead
                  </button>
                )}
              </div>

              {/* Neumorphic Submit Button */}
              <div className="pt-2">
                <NeumorphicButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isSubmitting}
                  className="w-full"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {activeTab === 'email-signin'
                    ? 'Sign In to Passport'
                    : 'Create Athlete Passport'}
                </NeumorphicButton>
              </div>
            </form>
          )}

          {/* TAB 3: ASA LICENSE QUICK CLAIM */}
          {activeTab === 'asa-license' && (
            <form onSubmit={handleAsaLicenseSubmit} className="space-y-4 pt-1">
              <div className="text-center space-y-1">
                <h3 className="font-display font-black text-xl text-[#f5efe3] tracking-wide uppercase">
                  ASA Runner Quick Pass
                </h3>
                <p className="text-xs text-[#9aa1ac] max-w-xs mx-auto leading-relaxed">
                  Enter your Athletics South Africa (ASA) license number and province to access your runner portal directly.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-bold text-[#9aa1ac] flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#e28b37]" />
                  ASA Permanent License Number
                </label>
                <input
                  type="text"
                  required
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="e.g. 14208"
                  className="neu-input w-full px-3.5 py-2.5 rounded-xs text-sm font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-bold text-[#9aa1ac] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#e28b37]" />
                  Registered Province
                </label>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="neu-input w-full px-3.5 py-2.5 rounded-xs text-sm"
                >
                  {PROVINCES.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#171c24] text-[#f5efe3]">
                      {p.name} ({p.ab})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-bold text-[#9aa1ac] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#e28b37]" />
                  Athlete Display Name (Optional)
                </label>
                <input
                  type="text"
                  value={runnerName}
                  onChange={(e) => setRunnerName(e.target.value)}
                  placeholder="e.g. Zola Pieterse"
                  className="neu-input w-full px-3.5 py-2.5 rounded-xs text-sm"
                />
              </div>

              <div className="pt-2">
                <NeumorphicButton
                  type="submit"
                  variant="gold"
                  size="lg"
                  loading={isSubmitting}
                  className="w-full"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Claim &amp; Launch Passport
                </NeumorphicButton>
              </div>
            </form>
          )}

          {/* Privacy & Security Footnote */}
          <div className="pt-3 border-t border-[#232b38]/70 flex items-center justify-between text-[11px] text-[#6d7580]">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#7c8f5c]" />
              <span>AES-256 Encrypted Sync</span>
            </div>
            <span>Athletics South Africa (ASA) compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
