import React, { useState } from 'react';
import {
  FileCode,
  X,
  ExternalLink,
  Copy,
  Check,
  Download,
  MapPin,
  Calendar,
  Users,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { TabType } from '../types';

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: TabType) => void;
}

export const SitemapModal: React.FC<SitemapModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sitemapUrl = '/sitemap.xml';

  const handleCopy = () => {
    const fullUrl = `${window.location.origin}/sitemap.xml`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const pages = [
    {
      group: 'Primary Site Sections',
      items: [
        { title: 'Home & Featured Ultra Majors', loc: '/', tab: 'home' as TabType, priority: '1.0', freq: 'Daily' },
        { title: 'National Race Calendar & Comrades Qualifiers', loc: '/#races', tab: 'races' as TabType, priority: '0.95', freq: 'Daily' },
        { title: '9 Athletics Provinces & Regional Weather', loc: '/#provinces', tab: 'provinces' as TabType, priority: '0.90', freq: 'Weekly' },
        { title: 'Running Clubs Directory & Weekly Time Trials', loc: '/#clubs', tab: 'clubs' as TabType, priority: '0.90', freq: 'Weekly' },
        { title: 'Runner Passport, PBs & ASA License', loc: '/#profile', tab: 'profile' as TabType, priority: '0.80', freq: 'Weekly' },
      ],
    },
    {
      group: '6 Disciplines of Sport',
      items: [
        { title: 'Road Running (Marathons, Half Marathons & 10ks)', loc: '/#races?discipline=road', tab: 'races' as TabType, priority: '0.90', freq: 'Daily' },
        { title: 'Trail Running (Mountain Ultras & Nature Reserves)', loc: '/#races?discipline=trail', tab: 'races' as TabType, priority: '0.90', freq: 'Daily' },
        { title: 'Walking (Sanctioned Race Walking & Walking Leagues)', loc: '/#races?discipline=walking', tab: 'races' as TabType, priority: '0.90', freq: 'Daily' },
        { title: 'Hiking (Scenic Day Hikes & Mountain Summits)', loc: '/#races?discipline=hiking', tab: 'races' as TabType, priority: '0.85', freq: 'Weekly' },
        { title: 'Trekking (Multi-Day Wilderness Expeditions)', loc: '/#races?discipline=trekking', tab: 'races' as TabType, priority: '0.85', freq: 'Weekly' },
        { title: 'Track & Field (Stadia Championships & League Fixtures)', loc: '/#races?discipline=track', tab: 'races' as TabType, priority: '0.85', freq: 'Weekly' },
      ],
    },
    {
      group: '9 Athletics South Africa (ASA) Provinces',
      items: [
        { title: 'Central Gauteng Athletics (CGA / Gauteng)', loc: '/#provinces/gp', tab: 'provinces' as TabType, priority: '0.85', freq: 'Weekly' },
        { title: 'Western Province Athletics (WPA / Western Cape)', loc: '/#provinces/wc', tab: 'provinces' as TabType, priority: '0.85', freq: 'Weekly' },
        { title: 'KwaZulu-Natal Athletics (KZNA / KwaZulu-Natal)', loc: '/#provinces/kzn', tab: 'provinces' as TabType, priority: '0.85', freq: 'Weekly' },
        { title: 'Eastern Province Athletics (EPA / Eastern Cape)', loc: '/#provinces/ec', tab: 'provinces' as TabType, priority: '0.80', freq: 'Weekly' },
        { title: 'Free State Athletics (AFS / Free State)', loc: '/#provinces/fs', tab: 'provinces' as TabType, priority: '0.80', freq: 'Weekly' },
        { title: 'Athletics Mpumalanga (AMPU / Mpumalanga)', loc: '/#provinces/mp', tab: 'provinces' as TabType, priority: '0.80', freq: 'Weekly' },
        { title: 'Limpopo Athletics (LIMA / Limpopo)', loc: '/#provinces/lp', tab: 'provinces' as TabType, priority: '0.80', freq: 'Weekly' },
        { title: 'Athletics Central North West (ACNW / North West)', loc: '/#provinces/nw', tab: 'provinces' as TabType, priority: '0.80', freq: 'Weekly' },
        { title: 'Athletics Griqualand West (AGW / Northern Cape)', loc: '/#provinces/nc', tab: 'provinces' as TabType, priority: '0.80', freq: 'Weekly' },
      ],
    },
    {
      group: 'Iconic Major Races & Ultras',
      items: [
        { title: 'Comrades Marathon (The Ultimate Human Race)', loc: '/#major/comrades-marathon', tab: 'home' as TabType, priority: '0.90', freq: 'Monthly' },
        { title: 'Two Oceans Marathon (The World’s Most Beautiful Marathon)', loc: '/#major/two-oceans-marathon', tab: 'home' as TabType, priority: '0.90', freq: 'Monthly' },
        { title: 'Sanlam Cape Town Marathon (Abbott World Marathon Major)', loc: '/#major/cape-town-marathon', tab: 'home' as TabType, priority: '0.90', freq: 'Monthly' },
        { title: 'African Bank Soweto Marathon (The People’s Race)', loc: '/#major/soweto-marathon', tab: 'home' as TabType, priority: '0.90', freq: 'Monthly' },
        { title: 'Entabeni Big Five Marathon (Limpopo Bushveld)', loc: '/#major/big-five-marathon', tab: 'home' as TabType, priority: '0.85', freq: 'Monthly' },
      ],
    },
  ];

  return (
    <div
      id="modal-sitemap-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="modal-sitemap-card"
        className="bg-[#171c24] border border-[#2c333f] w-full max-w-4xl max-h-[90vh] rounded-xs shadow-2xl flex flex-col overflow-hidden text-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#2c333f] bg-[#12151b]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xs bg-[#d8b34a]/15 border border-[#d8b34a]/35 flex items-center justify-center text-[#d8b34a]">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-lg sm:text-xl tracking-wide uppercase text-[#f5efe3] leading-none">
                  XML Sitemap
                </h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#242c38] text-[#d8b34a] border border-[#d8b34a]/30">
                  /sitemap.xml
                </span>
              </div>
              <p className="text-xs text-[#9aa1ac] mt-1">
                Standardized XML schema index for search engine crawlers (Googlebot, Bingbot) and runners.
              </p>
            </div>
          </div>
          <button
            id="btn-close-sitemap"
            onClick={onClose}
            className="text-[#9aa1ac] hover:text-[#f5efe3] p-1.5 rounded-xs hover:bg-[#242c38] transition-colors cursor-pointer"
            title="Close Sitemap"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="px-5 sm:px-6 py-2.5 bg-[#141820] border-b border-[#2c333f] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#9aa1ac]">
            <CheckCircle2 className="w-4 h-4 text-[#7c8f5c]" />
            <span>Valid sitemaps.org 0.9 XML with 28 indexed canonical routes</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1b212b] hover:bg-[#242c38] text-[#f5efe3] border border-[#2c333f] rounded-xs font-semibold cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#7c8f5c]" /> : <Copy className="w-3.5 h-3.5 text-[#d8b34a]" />}
              <span>{copied ? 'Copied URL!' : 'Copy XML URL'}</span>
            </button>
            <a
              href={sitemapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#d8b34a] hover:bg-[#ebc45b] text-[#1b1103] font-bold rounded-xs cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Open Raw /sitemap.xml</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
        </div>

        {/* Interactive Content List */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-[#9aa1ac]">
          {pages.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2.5">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#d8b34a] border-b border-[#2c333f]/60 pb-1.5">
                {group.group}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {group.items.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    className="p-2.5 rounded-xs bg-[#12151b] border border-[#2c333f] hover:border-[#d8b34a]/40 flex items-center justify-between gap-3 transition-colors group"
                  >
                    <div className="min-w-0">
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateTab(item.tab);
                        }}
                        className="text-left font-semibold text-[#f5efe3] group-hover:text-[#d8b34a] truncate block cursor-pointer"
                        title={item.title}
                      >
                        {item.title}
                      </button>
                      <span className="font-mono text-[10px] text-[#6d7580] block truncate">
                        {item.loc}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-xs bg-[#1b212b] text-[#7c8f5c] border border-[#2c333f]">
                        {item.priority}
                      </span>
                      <span className="text-[9px] text-[#6d7580] block mt-0.5">
                        {item.freq}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Raw XML Snippet Preview */}
          <div className="pt-2">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#9aa1ac] mb-2">
              XML Schema Sample
            </h4>
            <pre className="bg-[#0e1117] border border-[#2c333f] p-3 rounded-xs font-mono text-[11px] text-[#7c8f5c] overflow-x-auto leading-relaxed">
{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://vasbyt.run/</loc>
    <lastmod>2026-09-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://vasbyt.run/#races</loc>
    <lastmod>2026-09-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>
  ... (28 canonical URLs)
</urlset>`}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3 bg-[#12151b] border-t border-[#2c333f] flex items-center justify-between">
          <div className="text-[11px] text-[#6d7580]">
            Configured with <code>robots.txt</code> discovery link at root.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#242c38] hover:bg-[#2c3645] text-xs font-semibold text-[#f5efe3] rounded-xs cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
