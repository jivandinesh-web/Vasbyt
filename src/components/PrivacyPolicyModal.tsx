import React from 'react';
import {
  ShieldCheck,
  X,
  Lock,
  UserCheck,
  Database,
  EyeOff,
  FileText,
  Mail,
  CheckCircle2,
} from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="modal-privacy-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="modal-privacy-card"
        className="bg-[#171c24] border border-[#2c333f] w-full max-w-3xl max-h-[90vh] rounded-xs shadow-2xl flex flex-col overflow-hidden text-left"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#2c333f] bg-[#12151b]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xs bg-[#7c8f5c]/15 border border-[#7c8f5c]/35 flex items-center justify-center text-[#7c8f5c]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-lg sm:text-xl tracking-wide uppercase text-[#f5efe3] leading-none">
                  Privacy Policy
                </h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#242c38] text-[#7c8f5c] border border-[#7c8f5c]/30">
                  POPIA &amp; GDPR Compliant
                </span>
              </div>
              <p className="text-xs text-[#9aa1ac] mt-1">
                Last updated: September 2026 · Vasbyt SA Running
              </p>
            </div>
          </div>
          <button
            id="btn-close-privacy"
            onClick={onClose}
            className="text-[#9aa1ac] hover:text-[#f5efe3] p-1.5 rounded-xs hover:bg-[#242c38] transition-colors cursor-pointer"
            title="Close Privacy Policy"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6 text-[#cfd4dc] text-xs sm:text-sm leading-relaxed">
          {/* Introduction */}
          <div className="space-y-2">
            <h3 className="font-display font-bold text-sm sm:text-base text-[#f5efe3] uppercase tracking-wide flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#e28b37]" />
              1. Overview &amp; Commitment
            </h3>
            <p className="text-[#9aa1ac]">
              Vasbyt SA Running (&ldquo;Vasbyt&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy in compliance with South Africa&apos;s <strong>Protection of Personal Information Act (POPIA)</strong> and applicable global data protection principles including the GDPR. This policy explains what information we collect, how it is stored, and your rights as a runner.
            </p>
          </div>

          {/* Data Collected */}
          <div className="space-y-2">
            <h3 className="font-display font-bold text-sm sm:text-base text-[#f5efe3] uppercase tracking-wide flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#d8b34a]" />
              2. Information We Collect
            </h3>
            <div className="space-y-2 text-[#9aa1ac]">
              <div className="flex items-start gap-2 bg-[#12151b] p-3 rounded-xs border border-[#2c333f]">
                <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#f5efe3]">Google Authentication:</strong> When you choose to sign in with Google, we receive your basic public profile information (name, email address, and profile picture avatar) provided via Google OAuth 2.0.
                </div>
              </div>
              <div className="flex items-start gap-2 bg-[#12151b] p-3 rounded-xs border border-[#2c333f]">
                <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#f5efe3]">Runner Passport Information:</strong> Optional athlete details you choose to record, such as your home province, licensed running club, Athletics South Africa (ASA) license number, age category, and personal best (PB) times (5k, 10k, 21.1k, 42.2k, Ultra).
                </div>
              </div>
              <div className="flex items-start gap-2 bg-[#12151b] p-3 rounded-xs border border-[#2c333f]">
                <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#f5efe3]">Bookmarked Fixtures &amp; Clubs:</strong> Starred races and saved athletics clubs stored to assist your race calendar planning.
                </div>
              </div>
            </div>
          </div>

          {/* How Data Is Used */}
          <div className="space-y-2">
            <h3 className="font-display font-bold text-sm sm:text-base text-[#f5efe3] uppercase tracking-wide flex items-center gap-2">
              <Database className="w-4 h-4 text-[#7c8f5c]" />
              3. How We Use &amp; Store Your Data
            </h3>
            <p className="text-[#9aa1ac]">
              We use your data solely to provide you with a personalized running fixture calendar, synchronize your bookmarked events across your mobile and desktop devices, and maintain your Runner Passport.
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#9aa1ac] pl-2">
              <li>Your data is securely stored in Google Firebase Cloud Firestore with role-based security rules.</li>
              <li>Only authenticated requests originating from your verified user ID can read or update your personal athlete profile document.</li>
              <li>We also store local preferences (such as province filters and map layer selections) on your device&apos;s local storage for rapid offline viewing.</li>
            </ul>
          </div>

          {/* Third Parties & Selling */}
          <div className="space-y-2">
            <h3 className="font-display font-bold text-sm sm:text-base text-[#f5efe3] uppercase tracking-wide flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-[#e28b37]" />
              4. No Sale of Personal Information
            </h3>
            <p className="text-[#9aa1ac]">
              We <strong>never sell, rent, monetize, or trade</strong> your personal information, running records, or email addresses to advertisers, race timing companies, or third-party data brokers.
            </p>
          </div>

          {/* Security */}
          <div className="space-y-2">
            <h3 className="font-display font-bold text-sm sm:text-base text-[#f5efe3] uppercase tracking-wide flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#38bdf8]" />
              5. Data Security &amp; Retention
            </h3>
            <p className="text-[#9aa1ac]">
              All communication between your browser and our servers occurs over encrypted HTTPS/TLS connections. Your credentials are never handled directly by Vasbyt; authentication is delegated securely to Google Identity Services.
            </p>
          </div>

          {/* Runner Rights */}
          <div className="space-y-2">
            <h3 className="font-display font-bold text-sm sm:text-base text-[#f5efe3] uppercase tracking-wide flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#7c8f5c]" />
              6. Your Rights &amp; Data Deletion
            </h3>
            <p className="text-[#9aa1ac]">
              Under POPIA and international data protection laws, you retain the right to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#9aa1ac] pl-2">
              <li>Access and review all personal details stored in your profile.</li>
              <li>Edit or update your club, license number, or PBs at any time via the Profile tab.</li>
              <li>Request complete deletion of your account and cloud-stored records by contacting us or clearing your cloud profile.</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-2 bg-[#12151b] p-3.5 rounded-xs border border-[#2c333f]">
            <h3 className="font-display font-bold text-sm text-[#f5efe3] uppercase tracking-wide flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#d8b34a]" />
              7. Contact &amp; Inquiries
            </h3>
            <p className="text-xs text-[#9aa1ac]">
              For any questions regarding this Privacy Policy or data protection inquiries, contact us at:
              <br />
              <span className="font-mono text-[#d8b34a] mt-1 inline-block">privacy@vasbyt.run</span>
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3 bg-[#12151b] border-t border-[#2c333f] flex items-center justify-between">
          <div className="text-[11px] text-[#6d7580]">
            Vasbyt SA Running · Athletics South Africa (ASA) Community
          </div>
          <button
            id="btn-dismiss-privacy"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#242c38] hover:bg-[#2c3645] text-xs font-semibold text-[#f5efe3] rounded-xs cursor-pointer transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
