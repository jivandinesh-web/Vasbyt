import React, { useState } from 'react';
import { PROVINCES, CLUBS } from '../data/runningData';
import { Club, ClubContact } from '../types';
import { ClubBadge } from './ClubBadge';
import { Search, Plus, MapPin, Users, Phone, Mail, Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface ClubsViewProps {
  activeProv: string;
  onSelectProv: (prov: string) => void;
  favorites: string[];
  onToggleFavorite: (clubName: string) => void;
}

export const ClubsView: React.FC<ClubsViewProps> = ({
  activeProv,
  onSelectProv,
  favorites,
  onToggleFavorite,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedClubName, setExpandedClubName] = useState<string | null>(null);

  // User-added contacts keyed by club name
  const [clubContacts, setClubContacts] = useState<Record<string, ClubContact>>(() => {
    try {
      const stored = localStorage.getItem('vasbyt:club_contacts');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading club contacts', e);
    }
    return {};
  });

  // User-added community clubs
  const [customClubs, setCustomClubs] = useState<Club[]>(() => {
    try {
      const stored = localStorage.getItem('vasbyt:custom_clubs');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading custom clubs', e);
    }
    return [];
  });

  // Modal / Form state for editing contact
  const [editingClubName, setEditingClubName] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState<ClubContact>({
    contactPerson: '',
    role: '',
    phoneOrEmail: '',
    trainingSchedule: '',
  });

  // State for creating a brand new club
  const [showAddClubModal, setShowAddClubModal] = useState<boolean>(false);
  const [newClubForm, setNewClubForm] = useState<{
    name: string;
    prov: string;
    city: string;
    affiliation: string;
    blurb: string;
    contactPerson: string;
    phoneOrEmail: string;
  }>({
    name: '',
    prov: 'gp',
    city: '',
    affiliation: '',
    blurb: '',
    contactPerson: '',
    phoneOrEmail: '',
  });

  // Merge default clubs with custom clubs
  const allClubs: Club[] = [
    ...CLUBS.map((c) => ({
      ...c,
      customContact: clubContacts[c.name] || c.customContact,
    })),
    ...customClubs.map((c) => ({
      ...c,
      customContact: clubContacts[c.name] || c.customContact,
    })),
  ];

  // Save contacts
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClubName) return;

    const updated = {
      ...clubContacts,
      [editingClubName]: contactForm,
    };
    setClubContacts(updated);
    try {
      localStorage.setItem('vasbyt:club_contacts', JSON.stringify(updated));
    } catch (err) {
      console.error('Error saving contact', err);
    }
    setEditingClubName(null);
  };

  const handleStartEditContact = (club: Club) => {
    const existing = club.customContact || {
      contactPerson: '',
      role: '',
      phoneOrEmail: '',
      trainingSchedule: '',
    };
    setContactForm(existing);
    setEditingClubName(club.name);
  };

  // Add new club
  const handleCreateNewClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClubForm.name.trim()) return;

    const newClub: Club = {
      name: newClubForm.name.trim(),
      prov: newClubForm.prov,
      city: newClubForm.city.trim() || 'South Africa',
      affiliation: newClubForm.affiliation.trim() || 'Affiliated Athletics Club',
      blurb: newClubForm.blurb.trim() || 'Active local community running club.',
    };

    const updatedClubs = [...customClubs, newClub];
    setCustomClubs(updatedClubs);
    try {
      localStorage.setItem('vasbyt:custom_clubs', JSON.stringify(updatedClubs));
    } catch (err) {
      console.error('Error saving custom club', err);
    }

    if (newClubForm.contactPerson || newClubForm.phoneOrEmail) {
      const updatedContacts = {
        ...clubContacts,
        [newClub.name]: {
          contactPerson: newClubForm.contactPerson.trim(),
          role: 'Club Contact',
          phoneOrEmail: newClubForm.phoneOrEmail.trim(),
          trainingSchedule: '',
        },
      };
      setClubContacts(updatedContacts);
      try {
        localStorage.setItem('vasbyt:club_contacts', JSON.stringify(updatedContacts));
      } catch (err) {
        console.error('Error saving contact', err);
      }
    }

    setNewClubForm({
      name: '',
      prov: 'gp',
      city: '',
      affiliation: '',
      blurb: '',
      contactPerson: '',
      phoneOrEmail: '',
    });
    setShowAddClubModal(false);
    setExpandedClubName(newClub.name);
  };

  // Get list of provinces that have clubs listed
  const provChips = [
    { id: 'all', label: 'All Provinces' },
    ...PROVINCES.map((p) => ({ id: p.id, label: `${p.name} (${p.ab})` })),
  ];

  const q = searchTerm.toLowerCase().trim();
  const filteredClubs = allClubs.filter((c) => {
    const matchesProv = activeProv === 'all' || c.prov === activeProv;
    const matchesQuery =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.blurb.toLowerCase().includes(q) ||
      (c.customContact?.contactPerson && c.customContact.contactPerson.toLowerCase().includes(q));
    return matchesProv && matchesQuery;
  });

  const toggleClubExpand = (name: string) => {
    setExpandedClubName((prev) => (prev === name ? null : name));
  };

  return (
    <div id="view-clubs" className="space-y-6 pb-8 text-left">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2c333f]">
        <div>
          <div className="flex items-center gap-3">
            <h1
              id="clubs-pagehead"
              className="font-display font-extrabold text-2xl sm:text-3xl tracking-wider uppercase text-[#f5efe3] leading-none"
            >
              Athletics Clubs Directory
            </h1>
            <span className="bg-[#242c38] text-[#d8b34a] border border-[#d8b34a]/40 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full">
              {filteredClubs.length} clubs
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#9aa1ac] mt-1">
            Registered running clubs, training time trials, licensed coaches &amp; club directors.
          </p>
        </div>

        <button
          id="btn-add-club-toggle"
          onClick={() => setShowAddClubModal(true)}
          className="inline-flex items-center gap-2 text-xs sm:text-sm bg-[#e28b37] text-[#1b1103] hover:bg-[#eb9a4a] px-3.5 py-2 rounded-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Register Your Club
        </button>
      </div>

      {/* Filter Controls Card */}
      <div id="club-filters-card" className="bg-[#171c24] border border-[#2c333f] rounded-xs p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7580]" />
          <input
            id="club-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search clubs by name, suburb, city, or contact person…"
            className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs pl-9 pr-8 py-2.5 text-sm text-[#f5efe3] placeholder-[#6d7580] focus:outline-none focus:border-[#e28b37]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#6d7580] hover:text-[#f5efe3] p-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Province Filter Chips */}
        <div>
          <div className="text-[11px] uppercase tracking-wider text-[#6d7580] font-semibold mb-2">
            Filter by Province
          </div>
          <div id="club-prov-chips" className="flex flex-wrap gap-1.5 sm:gap-2">
            {provChips.map((p) => {
              const isOn = activeProv === p.id;
              return (
                <button
                  key={p.id}
                  id={`chip-club-prov-${p.id}`}
                  onClick={() => onSelectProv(p.id)}
                  className={`text-xs py-1 px-3 rounded-full border cursor-pointer transition-all ${
                    isOn
                      ? 'bg-[#d8b34a] border-[#d8b34a] text-[#1b1103] font-bold shadow-xs'
                      : 'bg-[#12151b] border-[#2c333f] text-[#9aa1ac] hover:border-[#6d7580] hover:text-[#f5efe3]'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Clubs Grid - Multi-column responsive layout */}
      <div
        id="club-list-container"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5"
      >
        {filteredClubs.length === 0 ? (
          <div
            id="clubs-empty"
            className="col-span-full text-center py-16 px-4 bg-[#171c24] border border-[#2c333f] rounded-xs"
          >
            <p className="text-base text-[#f5efe3] font-semibold mb-1">No clubs found</p>
            <p className="text-xs text-[#6d7580] mb-4">
              Try searching with another keyword or change the province filter.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                onSelectProv('all');
              }}
              className="text-xs font-semibold bg-[#e28b37] text-[#1b1103] px-4 py-2 rounded-xs"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredClubs.map((c) => {
            const isFav = favorites.includes(c.name);
            const isOpen = expandedClubName === c.name;
            const hasContact = !!c.customContact?.contactPerson;

            return (
              <div
                key={c.name}
                id={`club-card-${c.name.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => toggleClubExpand(c.name)}
                className={`bg-[#171c24] border rounded-xs p-5 transition-all cursor-pointer flex flex-col justify-between ${
                  isOpen
                    ? 'border-[#e28b37] bg-[#1a1f29] shadow-md'
                    : 'border-[#2c333f] hover:border-[#6d7580] hover:bg-[#1a202a]'
                }`}
              >
                <div>
                  {/* Top Row: Badge, Province Pill, Star */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <ClubBadge
                        name={c.name}
                        prov={c.prov}
                        size={44}
                        id={`badge-${c.name.replace(/\s+/g, '-').toLowerCase()}`}
                      />
                      <div>
                        <span
                          id={`club-prov-tag-${c.name.replace(/\s+/g, '-').toLowerCase()}`}
                          className="text-[10px] uppercase tracking-wider text-[#d8b34a] bg-[#d8b34a]/10 border border-[#d8b34a]/40 rounded-full px-2 py-0.5 font-bold"
                        >
                          {c.prov.toUpperCase()}
                        </span>
                        {hasContact && (
                          <span className="ml-1.5 text-[9.5px] bg-[#7c8f5c]/20 text-[#7c8f5c] border border-[#7c8f5c]/50 px-1.5 py-0.2 rounded-xs font-medium">
                            Contact Added
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      id={`star-club-${c.name.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(c.name);
                      }}
                      title={isFav ? 'Remove favorite' : 'Add favorite'}
                      className={`w-8 h-8 flex items-center justify-center rounded-xs border text-base transition-colors ${
                        isFav
                          ? 'bg-[#d8b34a]/20 border-[#d8b34a] text-[#d8b34a]'
                          : 'bg-[#12151b] border-[#2c333f] text-[#6d7580] hover:text-[#f5efe3]'
                      }`}
                    >
                      {isFav ? '★' : '☆'}
                    </button>
                  </div>

                  {/* Club Name & Location */}
                  <h3 className="text-base sm:text-lg font-bold text-[#f5efe3] leading-snug mb-1">
                    {c.name}
                  </h3>

                  <div className="text-xs text-[#9aa1ac] flex items-center gap-1.5 mb-2.5">
                    <MapPin className="w-3.5 h-3.5 text-[#e28b37] shrink-0" />
                    <span>{c.city}</span>
                    {c.founded && <span>· Est. {c.founded}</span>}
                  </div>

                  {/* Club Blurb */}
                  <p className="text-xs text-[#9aa1ac] leading-relaxed mb-3">
                    {c.blurb}
                  </p>
                </div>

                {/* Card Bottom / Expansion Section */}
                <div className="pt-3 border-t border-[#2c333f]/70">
                  <div className="flex items-center justify-between text-xs text-[#6d7580]">
                    <span className="truncate max-w-[190px]">{c.affiliation || 'ASA Affiliated'}</span>
                    <span className="text-[#e28b37] font-semibold inline-flex items-center gap-1">
                      {isOpen ? 'Less' : 'Details'}
                      {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </span>
                  </div>

                  {isOpen && (
                    <div
                      id={`club-expanded-${c.name.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 pt-3 border-t border-dashed border-[#2c333f] text-xs space-y-2.5 animate-in fade-in duration-150"
                    >
                      <div className="text-[#9aa1ac]">
                        <span className="font-semibold text-[#f5efe3]">Governing Body:</span>{' '}
                        {c.affiliation || 'Athletics South Africa provincial board'}
                      </div>

                      {/* Verified Contact Details Section */}
                      {c.customContact && (c.customContact.contactPerson || c.customContact.phoneOrEmail) ? (
                        <div className="bg-[#12151b] border border-[#a86526]/50 rounded-xs p-3 space-y-1.5 my-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] uppercase font-bold text-[#e28b37] tracking-wider">
                              Verified Club Contact
                            </span>
                            <button
                              onClick={() => handleStartEditContact(c)}
                              className="text-xs text-[#9aa1ac] hover:text-[#f5efe3] underline cursor-pointer"
                            >
                              Edit
                            </button>
                          </div>

                          {c.customContact.contactPerson && (
                            <div className="text-sm font-semibold text-[#f5efe3]">
                              {c.customContact.contactPerson}{' '}
                              {c.customContact.role && (
                                <span className="text-xs text-[#6d7580] font-normal">
                                  ({c.customContact.role})
                                </span>
                              )}
                            </div>
                          )}

                          {c.customContact.phoneOrEmail && (
                            <div className="text-xs text-[#d8b34a] flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-[#e28b37]" />
                              <span>{c.customContact.phoneOrEmail}</span>
                            </div>
                          )}

                          {c.customContact.trainingSchedule && (
                            <div className="text-xs text-[#9aa1ac] pt-1.5 border-t border-[#2c333f]/60 mt-1 flex items-start gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#e28b37] shrink-0 mt-0.5" />
                              <span>{c.customContact.trainingSchedule}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="pt-1 flex items-center justify-between text-xs text-[#6d7580]">
                          <span>No club director contact saved yet.</span>
                          <button
                            onClick={() => handleStartEditContact(c)}
                            className="text-xs text-[#e28b37] hover:underline cursor-pointer font-semibold"
                          >
                            + Add contact
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Club Contact Modal */}
      {editingClubName && (
        <div
          id="contact-edit-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
        >
          <div className="w-full max-w-md bg-[#1b212b] border border-[#a86526] rounded-xs p-6 text-left space-y-4 shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-display font-bold text-xl text-[#f5efe3] leading-none">
                  Club Contact Details
                </h3>
                <p className="text-xs text-[#e28b37] mt-1 truncate max-w-[280px] font-semibold">
                  {editingClubName}
                </p>
              </div>
              <button
                onClick={() => setEditingClubName(null)}
                className="text-sm text-[#6d7580] hover:text-[#f5efe3] p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-3.5">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#6d7580] font-medium mb-1">
                  Contact Person Name
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.contactPerson}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, contactPerson: e.target.value })
                  }
                  placeholder="e.g. Sipho Khumalo"
                  className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs px-3 py-2 text-[#f5efe3] text-sm focus:border-[#e28b37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#6d7580] font-medium mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={contactForm.role}
                  onChange={(e) => setContactForm({ ...contactForm, role: e.target.value })}
                  placeholder="e.g. Race Director / Club Chairperson / Head Coach"
                  className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs px-3 py-2 text-[#f5efe3] text-sm focus:border-[#e28b37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#6d7580] font-medium mb-1">
                  Phone / WhatsApp / Email
                </label>
                <input
                  type="text"
                  value={contactForm.phoneOrEmail}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, phoneOrEmail: e.target.value })
                  }
                  placeholder="e.g. +27 82 123 4567 or secretary@club.co.za"
                  className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs px-3 py-2 text-[#f5efe3] text-sm focus:border-[#e28b37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#6d7580] font-medium mb-1">
                  Training / Time Trial Schedule
                </label>
                <input
                  type="text"
                  value={contactForm.trainingSchedule}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, trainingSchedule: e.target.value })
                  }
                  placeholder="e.g. Tuesdays 17:30 8km Time Trial, Saturdays 05:30 Long Run"
                  className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs px-3 py-2 text-[#f5efe3] text-sm focus:border-[#e28b37] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#2c333f]">
                <button
                  type="button"
                  onClick={() => setEditingClubName(null)}
                  className="text-xs text-[#9aa1ac] hover:text-[#f5efe3] px-3.5 py-2 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#e28b37] text-[#1b1103] font-bold text-xs px-4 py-2 rounded-xs hover:bg-[#eb9a4a] transition-colors cursor-pointer"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Club Modal */}
      {showAddClubModal && (
        <div
          id="add-club-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
        >
          <div className="w-full max-w-lg bg-[#1b212b] border border-[#2c333f] rounded-xs p-6 text-left space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-display font-bold text-xl text-[#f5efe3] leading-none">
                  Register Local Running Club
                </h3>
                <p className="text-xs text-[#9aa1ac] mt-1">
                  Add a community, university, or corporate running club in South Africa
                </p>
              </div>
              <button
                onClick={() => setShowAddClubModal(false)}
                className="text-sm text-[#6d7580] hover:text-[#f5efe3] p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewClub} className="space-y-3.5">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#6d7580] font-medium mb-1">
                  Club Name *
                </label>
                <input
                  type="text"
                  required
                  value={newClubForm.name}
                  onChange={(e) => setNewClubForm({ ...newClubForm, name: e.target.value })}
                  placeholder="e.g. Lowveld Striders AC"
                  className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs px-3 py-2 text-[#f5efe3] text-sm focus:border-[#e28b37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#6d7580] font-medium mb-1">
                    Province *
                  </label>
                  <select
                    value={newClubForm.prov}
                    onChange={(e) => setNewClubForm({ ...newClubForm, prov: e.target.value })}
                    className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs px-3 py-2 text-[#f5efe3] text-sm focus:border-[#e28b37] focus:outline-none"
                  >
                    {PROVINCES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.ab})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#6d7580] font-medium mb-1">
                    City / Suburb
                  </label>
                  <input
                    type="text"
                    value={newClubForm.city}
                    onChange={(e) => setNewClubForm({ ...newClubForm, city: e.target.value })}
                    placeholder="e.g. Mbombela"
                    className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs px-3 py-2 text-[#f5efe3] text-sm focus:border-[#e28b37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#6d7580] font-medium mb-1">
                  Affiliation / Federation
                </label>
                <input
                  type="text"
                  value={newClubForm.affiliation}
                  onChange={(e) =>
                    setNewClubForm({ ...newClubForm, affiliation: e.target.value })
                  }
                  placeholder="e.g. Athletics Mpumalanga (AMPU) / WPA / CGA"
                  className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs px-3 py-2 text-[#f5efe3] text-sm focus:border-[#e28b37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#6d7580] font-medium mb-1">
                  Club Description
                </label>
                <textarea
                  rows={2}
                  value={newClubForm.blurb}
                  onChange={(e) => setNewClubForm({ ...newClubForm, blurb: e.target.value })}
                  placeholder="Weekly group runs, race-day gazebo, beginner friendly..."
                  className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs px-3 py-2 text-[#f5efe3] text-sm focus:border-[#e28b37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#6d7580] font-medium mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={newClubForm.contactPerson}
                    onChange={(e) =>
                      setNewClubForm({ ...newClubForm, contactPerson: e.target.value })
                    }
                    placeholder="e.g. Chairperson name"
                    className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs px-3 py-2 text-[#f5efe3] text-sm focus:border-[#e28b37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#6d7580] font-medium mb-1">
                    Phone or Email
                  </label>
                  <input
                    type="text"
                    value={newClubForm.phoneOrEmail}
                    onChange={(e) =>
                      setNewClubForm({ ...newClubForm, phoneOrEmail: e.target.value })
                    }
                    placeholder="e.g. 082... or email"
                    className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs px-3 py-2 text-[#f5efe3] text-sm focus:border-[#e28b37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#2c333f]">
                <button
                  type="button"
                  onClick={() => setShowAddClubModal(false)}
                  className="text-xs text-[#9aa1ac] hover:text-[#f5efe3] px-3.5 py-2 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#e28b37] text-[#1b1103] font-bold text-xs px-4 py-2 rounded-xs hover:bg-[#eb9a4a] transition-colors cursor-pointer"
                >
                  Register Club
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
