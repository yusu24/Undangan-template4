/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Heart, Calendar, Palette, Gift, Share2, 
  ChevronDown, ChevronUp, Music, Sparkles, Copy, Check, Info, User
} from 'lucide-react';
import { InvitationData, ThemeConfig, DigitalGiftItem } from '../types';
import { THEMES, MUSIC_TRACKS } from '../data';

interface InvitationEditorProps {
  data: InvitationData;
  onChange: (newData: InvitationData) => void;
  guestNameInput: string;
  onGuestNameChange: (name: string) => void;
}

type EditorSection = 'mempelai' | 'acara' | 'tema' | 'kado' | 'bagikan';

export default function InvitationEditor({
  data,
  onChange,
  guestNameInput,
  onGuestNameChange
}: InvitationEditorProps) {
  const [activeSection, setActiveSection] = useState<EditorSection>('mempelai');
  const [copiedLink, setCopiedLink] = useState(false);

  const toggleSection = (section: EditorSection) => {
    setActiveSection(activeSection === section ? 'mempelai' : section);
  };

  // Helper to update invitation data field
  const updateField = (key: keyof InvitationData, value: any) => {
    onChange({
      ...data,
      [key]: value
    });
  };

  // Helper to update Event Details
  const updateEvent = (index: number, key: string, value: string) => {
    const updatedEvents = [...data.events];
    updatedEvents[index] = {
      ...updatedEvents[index],
      [key]: value
    };
    updateField('events', updatedEvents);
  };

  // Helper to update Gift Items
  const updateGift = (id: string, key: string, value: string) => {
    const updatedGifts = data.gifts.map(gift => {
      if (gift.id === id) {
        return { ...gift, [key]: value };
      }
      return gift;
    });
    updateField('gifts', updatedGifts);
  };

  // Generate personalized share link
  const getPersonalizedUrl = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    if (!guestNameInput.trim()) return baseUrl;
    const encodedName = encodeURIComponent(guestNameInput.trim());
    return `${baseUrl}?to=${encodedName}`;
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(getPersonalizedUrl());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="w-full bg-slate-900 border-r border-slate-800 text-slate-100 h-full flex flex-col overflow-y-auto p-5 space-y-5 no-scrollbar">
      {/* Editor Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-amber-500 mb-1">
          <Sparkles className="w-5 h-5" />
          <h2 className="text-lg font-bold tracking-wide uppercase font-serif">Invitation Builder</h2>
        </div>
        <p className="text-xs text-slate-400">
          Sesuaikan teks, tanggal, tema, dan musik undangan Anda secara real-time.
        </p>
      </div>

      {/* SECTION 1: MEMPELAI (BRIDE & GROOM DETAILS) */}
      <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
        <button
          onClick={() => toggleSection('mempelai')}
          className="w-full flex items-center justify-between p-4 bg-slate-950/80 hover:bg-slate-950 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Heart className="w-4.5 h-4.5 text-rose-500 fill-rose-500/10" />
            <span className="font-semibold text-sm">Profil Mempelai</span>
          </div>
          {activeSection === 'mempelai' ? <ChevronUp className="w-4.5 h-4.5" /> : <ChevronDown className="w-4.5 h-4.5" />}
        </button>

        {activeSection === 'mempelai' && (
          <div className="p-4 space-y-4 border-t border-slate-800 text-xs">
            {/* GROOM */}
            <div className="space-y-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800/40">
              <span className="block text-xs font-bold text-amber-500 uppercase tracking-wider">Mempelai Pria (Groom)</span>
              <div>
                <label className="block text-slate-400 mb-1">Nama Panggilan</label>
                <input 
                  type="text" 
                  value={data.groomName} 
                  onChange={(e) => updateField('groomName', e.target.value)}
                  className="w-full p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Nama Lengkap & Gelar</label>
                <input 
                  type="text" 
                  value={data.groomFullName} 
                  onChange={(e) => updateField('groomFullName', e.target.value)}
                  className="w-full p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Urutan dalam Keluarga</label>
                <input 
                  type="text" 
                  value={data.groomOrder} 
                  onChange={(e) => updateField('groomOrder', e.target.value)}
                  placeholder="e.g., Putra Pertama"
                  className="w-full p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Nama Orang Tua</label>
                <input 
                  type="text" 
                  value={data.groomParents} 
                  onChange={(e) => updateField('groomParents', e.target.value)}
                  placeholder="Bpk. X & Ibu Y"
                  className="w-full p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Instagram Username</label>
                <input 
                  type="text" 
                  value={data.groomInstagram} 
                  onChange={(e) => updateField('groomInstagram', e.target.value)}
                  className="w-full p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Photo URL (Unsplash)</label>
                <input 
                  type="text" 
                  value={data.groomPhoto} 
                  onChange={(e) => updateField('groomPhoto', e.target.value)}
                  className="w-full p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 text-[10px]"
                />
              </div>
            </div>

            {/* BRIDE */}
            <div className="space-y-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800/40">
              <span className="block text-xs font-bold text-amber-500 uppercase tracking-wider">Mempelai Wanita (Bride)</span>
              <div>
                <label className="block text-slate-400 mb-1">Nama Panggilan</label>
                <input 
                  type="text" 
                  value={data.brideName} 
                  onChange={(e) => updateField('brideName', e.target.value)}
                  className="w-full p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Nama Lengkap & Gelar</label>
                <input 
                  type="text" 
                  value={data.brideFullName} 
                  onChange={(e) => updateField('brideFullName', e.target.value)}
                  className="w-full p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Urutan dalam Keluarga</label>
                <input 
                  type="text" 
                  value={data.brideOrder} 
                  onChange={(e) => updateField('brideOrder', e.target.value)}
                  placeholder="e.g., Putri Kedua"
                  className="w-full p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Nama Orang Tua</label>
                <input 
                  type="text" 
                  value={data.brideParents} 
                  onChange={(e) => updateField('brideParents', e.target.value)}
                  placeholder="Bpk. X & Ibu Y"
                  className="w-full p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Instagram Username</label>
                <input 
                  type="text" 
                  value={data.brideInstagram} 
                  onChange={(e) => updateField('brideInstagram', e.target.value)}
                  className="w-full p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Photo URL (Unsplash)</label>
                <input 
                  type="text" 
                  value={data.bridePhoto} 
                  onChange={(e) => updateField('bridePhoto', e.target.value)}
                  className="w-full p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 text-[10px]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: ACARA (EVENT INFOS) */}
      <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
        <button
          onClick={() => toggleSection('acara')}
          className="w-full flex items-center justify-between p-4 bg-slate-950/80 hover:bg-slate-950 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Calendar className="w-4.5 h-4.5 text-amber-500" />
            <span className="font-semibold text-sm">Waktu & Tempat</span>
          </div>
          {activeSection === 'acara' ? <ChevronUp className="w-4.5 h-4.5" /> : <ChevronDown className="w-4.5 h-4.5" />}
        </button>

        {activeSection === 'acara' && (
          <div className="p-4 space-y-4 border-t border-slate-800 text-xs">
            {/* Target Countdown Date */}
            <div className="space-y-1 bg-slate-900/60 p-3 rounded-xl border border-slate-800/40 mb-2">
              <label className="block text-slate-400">Target Hitung Mundur (YYYY-MM-DD)</label>
              <input 
                type="date" 
                value={data.mainEventDate} 
                onChange={(e) => updateField('mainEventDate', e.target.value)}
                className="w-full p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              />
            </div>

            {data.events.map((evt, i) => (
              <div key={i} className="space-y-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800/40">
                <span className="block text-xs font-bold text-amber-500 uppercase tracking-wider">{evt.title}</span>
                <div>
                  <label className="block text-slate-400 mb-1">Judul Acara</label>
                  <input 
                    type="text" 
                    value={evt.title} 
                    onChange={(e) => updateEvent(i, 'title', e.target.value)}
                    className="w-full p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Tanggal Acara</label>
                  <input 
                    type="text" 
                    value={evt.date} 
                    onChange={(e) => updateEvent(i, 'date', e.target.value)}
                    className="w-full p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Jam / Waktu</label>
                  <input 
                    type="text" 
                    value={evt.time} 
                    onChange={(e) => updateEvent(i, 'time', e.target.value)}
                    className="w-full p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Nama Tempat/Gedung</label>
                  <input 
                    type="text" 
                    value={evt.locationName} 
                    onChange={(e) => updateEvent(i, 'locationName', e.target.value)}
                    className="w-full p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Alamat Lengkap</label>
                  <textarea 
                    value={evt.address} 
                    onChange={(e) => updateEvent(i, 'address', e.target.value)}
                    rows={2}
                    className="w-full p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 focus:outline-none resize-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Google Maps Link</label>
                  <input 
                    type="text" 
                    value={evt.mapsUrl} 
                    onChange={(e) => updateEvent(i, 'mapsUrl', e.target.value)}
                    className="w-full p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 focus:outline-none text-[10px]"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 3: TEMA & MUSIK */}
      <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
        <button
          onClick={() => toggleSection('tema')}
          className="w-full flex items-center justify-between p-4 bg-slate-950/80 hover:bg-slate-950 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Palette className="w-4.5 h-4.5 text-amber-500" />
            <span className="font-semibold text-sm">Tema & Musik</span>
          </div>
          {activeSection === 'tema' ? <ChevronUp className="w-4.5 h-4.5" /> : <ChevronDown className="w-4.5 h-4.5" />}
        </button>

        {activeSection === 'tema' && (
          <div className="p-4 space-y-4 border-t border-slate-800 text-xs">
            {/* Theme Select */}
            <div>
              <label className="block text-slate-400 mb-2">Pilih Palet Warna & Gaya</label>
              <div className="grid grid-cols-1 gap-2">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => updateField('themeId', theme.id)}
                    className={`p-3 rounded-xl flex items-center justify-between border cursor-pointer transition-all text-left ${
                      data.themeId === theme.id 
                        ? 'border-amber-500 bg-amber-500/10 text-white' 
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="block font-semibold text-xs">{theme.name}</span>
                    </div>
                    {/* Visual Color Previews */}
                    <div className="flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-emerald-700" style={{ backgroundColor: theme.primary.replace('bg-[', '').replace(']', '') }} />
                      <span className="w-4 h-4 rounded-full bg-slate-100" style={{ backgroundColor: theme.background.replace('bg-[', '').replace(']', '') }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Music Track Select */}
            <div>
              <label className="block text-slate-400 mb-2">Pilih Musik Latar (Background Music)</label>
              <div className="grid grid-cols-1 gap-1.5">
                {MUSIC_TRACKS.map((track) => (
                  <button
                    key={track.url}
                    onClick={() => updateField('musicUrl', track.url)}
                    className={`p-3 rounded-xl flex items-center gap-2.5 border text-left cursor-pointer transition-all ${
                      data.musicUrl === track.url 
                        ? 'border-amber-500 bg-amber-500/15 text-amber-400' 
                        : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <Music className="w-4 h-4 text-amber-500/70" />
                    <span className="text-[11px] font-medium truncate flex-1">{track.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: KADO & AMPLOP DIGITAL */}
      <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
        <button
          onClick={() => toggleSection('kado')}
          className="w-full flex items-center justify-between p-4 bg-slate-950/80 hover:bg-slate-950 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Gift className="w-4.5 h-4.5 text-amber-500" />
            <span className="font-semibold text-sm">Amplop & Kado</span>
          </div>
          {activeSection === 'kado' ? <ChevronUp className="w-4.5 h-4.5" /> : <ChevronDown className="w-4.5 h-4.5" />}
        </button>

        {activeSection === 'kado' && (
          <div className="p-4 space-y-4 border-t border-slate-800 text-xs">
            {data.gifts.map((gift, idx) => (
              <div key={gift.id} className="space-y-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800/40">
                <span className="block text-xs font-bold text-amber-500 uppercase tracking-wider">Rekening Penerima {idx+1}</span>
                <div>
                  <label className="block text-slate-400 mb-1">Nama Bank / Wallet</label>
                  <input 
                    type="text" 
                    value={gift.bankName} 
                    onChange={(e) => updateGift(gift.id, 'bankName', e.target.value)}
                    className="w-full p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Nomor Rekening</label>
                  <input 
                    type="text" 
                    value={gift.accountNumber} 
                    onChange={(e) => updateGift(gift.id, 'accountNumber', e.target.value)}
                    className="w-full p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Atas Nama Pemilik Rekening</label>
                  <input 
                    type="text" 
                    value={gift.accountHolder} 
                    onChange={(e) => updateGift(gift.id, 'accountHolder', e.target.value)}
                    className="w-full p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 focus:outline-none"
                  />
                </div>
              </div>
            ))}

            {/* PHYSICAL GIFT SHIPPING */}
            <div className="space-y-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800/40">
              <span className="block text-xs font-bold text-amber-500 uppercase tracking-wider">Kado Fisik / Alamat Kirim</span>
              <div>
                <label className="block text-slate-400 mb-1">Alamat Penerima Kado</label>
                <textarea 
                  value={data.giftAddress} 
                  onChange={(e) => updateField('giftAddress', e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 focus:outline-none resize-none text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Nama Penerima Paket</label>
                <input 
                  type="text" 
                  value={data.giftRecipientName} 
                  onChange={(e) => updateField('giftRecipientName', e.target.value)}
                  className="w-full p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 5: BAGIKAN (PERSONALIZED LINK GENERATOR) */}
      <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
        <button
          onClick={() => toggleSection('bagikan')}
          className="w-full flex items-center justify-between p-4 bg-slate-950/80 hover:bg-slate-950 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Share2 className="w-4.5 h-4.5 text-amber-500" />
            <span className="font-semibold text-sm">Bagikan ke Tamu</span>
          </div>
          {activeSection === 'bagikan' ? <ChevronUp className="w-4.5 h-4.5" /> : <ChevronDown className="w-4.5 h-4.5" />}
        </button>

        {activeSection === 'bagikan' && (
          <div className="p-4 space-y-4 border-t border-slate-800 text-xs">
            <div className="p-3 bg-blue-950/40 border border-blue-900/30 rounded-xl flex gap-2 text-blue-300">
              <Info className="w-5 h-5 shrink-0 text-blue-400" />
              <p className="text-[10px] leading-relaxed">
                Anda dapat membuat tautan unik untuk masing-masing tamu Anda. Nama tamu akan secara otomatis muncul dengan indah di sampul depan undangan saat dibuka!
              </p>
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5 font-semibold">Nama Tamu Undangan (Dear Guest)</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={guestNameInput}
                  onChange={(e) => onGuestNameChange(e.target.value)}
                  placeholder="e.g., Budi Setiawan & Keluarga"
                  className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-200 focus:outline-none pr-10 font-medium"
                />
                <User className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500" />
              </div>
            </div>

            {/* Generated Share Link Preview */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
              <span className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Tautan Undangan Tamu:</span>
              <p className="font-mono text-[10px] text-slate-400 break-all select-all p-2 bg-slate-900 rounded border border-slate-800">
                {getPersonalizedUrl()}
              </p>
              
              <button
                onClick={handleCopyShareLink}
                className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-200" />
                    <span>Link Berhasil Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Link Undangan Tamu</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Editor Footer Signature */}
      <div className="text-center pt-4 text-[10px] text-slate-500 border-t border-slate-800/60 flex flex-col gap-1 items-center justify-center">
        <span>Undangan Pernikahan Premium • React + Tailwind</span>
        <div className="flex items-center gap-1 text-rose-500/60 mt-0.5">
          <span>Dibuat dengan</span>
          <Heart className="w-3 h-3 fill-rose-500/40" />
          <span>untuk Hari Bahagia Anda</span>
        </div>
      </div>
    </div>
  );
}
