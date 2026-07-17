/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, Monitor, Eye, Settings, Sparkles, 
  Menu, X, Heart, RefreshCw, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { InvitationData, ThemeConfig, GuestWish } from './types';
import { THEMES, DEFAULT_INVITATION_DATA } from './data';
import InvitationCover from './components/InvitationCover';
import InvitationContent from './components/InvitationContent';
import InvitationEditor from './components/InvitationEditor';

// Default guestbook wishes
const INITIAL_WISHES: GuestWish[] = [
  {
    id: 'w-1',
    name: 'Budi Setiawan & Keluarga',
    status: 'Hadir',
    guestCount: 2,
    message: 'Selamat menempuh hidup baru Yusuf & Nabila! Semoga pernikahan kalian dipenuhi dengan cinta, berkah, dan kebahagiaan yang melimpah hingga maut memisahkan. Menjadi keluarga sakinah, mawaddah, warahmah. Aamiin.',
    timestamp: '16 Juli 2026, 14:15 WIB'
  },
  {
    id: 'w-2',
    name: 'Siti Aminah, S.Kom.',
    status: 'Hadir',
    guestCount: 1,
    message: 'Barakallahu lakuma wa baraka alaikuma wa jamaa bainakuma fii khair. Selamat ya Nabila sayang, akhirnya hari bahagia yang dinanti tiba juga! Ikut terharu dan bahagia melihat kalian bersatu.',
    timestamp: '16 Juli 2026, 15:30 WIB'
  },
  {
    id: 'w-3',
    name: 'Aditya Pratama (Alumni Teknik)',
    status: 'Tidak Hadir',
    guestCount: 0,
    message: 'Happy wedding Bro Yusuf! Mohon maaf sekali belum bisa hadir langsung karena sedang dinas di luar kota. Doa terbaik untuk pernikahan kalian, semoga langgeng, berkah, dan segera diberikan momongan yang sholeh/sholehah.',
    timestamp: '16 Juli 2026, 17:05 WIB'
  },
  {
    id: 'w-4',
    name: 'Rian & Amanda',
    status: 'Ragu-ragu',
    guestCount: 1,
    message: 'Selamat untuk Yusuf dan Nabila! Semoga dilancarkan seluruh prosesinya hingga hari H nanti ya. Kami usahakan hadir di acara resepsi.',
    timestamp: '16 Juli 2026, 18:22 WIB'
  }
];

export default function App() {
  // Main State
  const [invitationData, setInvitationData] = useState<InvitationData>(DEFAULT_INVITATION_DATA);
  const [guestName, setGuestName] = useState('');
  const [guestNameInput, setGuestNameInput] = useState('');
  
  // Navigation / UI States
  const [isOpened, setIsOpened] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [isEditorOpen, setIsEditorOpen] = useState(true);
  const [isGuestMode, setIsGuestMode] = useState(false); // If true, hides editor completely for clean view

  // Wishes List State
  const [wishes, setWishes] = useState<GuestWish[]>(() => {
    const saved = localStorage.getItem('wedding_wishes');
    return saved ? JSON.parse(saved) : INITIAL_WISHES;
  });

  // Audio Reference
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Parse URL Parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const toName = params.get('to');
    if (toName) {
      const decoded = decodeURIComponent(toName);
      setGuestName(decoded);
      setGuestNameInput(decoded);
      // If visited with a 'to' parameter, automatically put in guest mode for absolute premium viewing!
      setIsGuestMode(true);
      setIsEditorOpen(false);
    } else {
      setGuestName('Nama Tamu Undangan');
      setGuestNameInput('Nama Tamu Undangan');
    }
  }, []);

  // Sync wishes list to localStorage
  useEffect(() => {
    localStorage.setItem('wedding_wishes', JSON.stringify(wishes));
  }, [wishes]);

  // Audio management
  useEffect(() => {
    // Re-initialize audio on music URL change
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    audioRef.current = new Audio(invitationData.musicUrl);
    audioRef.current.loop = true;

    if (isMusicPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Autoplay blocked by browser. Interaction needed:", error);
          setIsMusicPlaying(false);
        });
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [invitationData.musicUrl]);

  // Handle Play/Pause sync
  useEffect(() => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.play().catch(() => {
          setIsMusicPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMusicPlaying]);

  // Get current active theme config
  const activeTheme = THEMES.find(t => t.id === invitationData.themeId) || THEMES[0];

  const handleOpenInvitation = () => {
    setIsOpened(true);
    setIsMusicPlaying(true);
  };

  const handleToggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  const handleAddWish = (newWish: Omit<GuestWish, 'id' | 'timestamp'>) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const formattedTime = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    }) + ' WIB';

    const wishItem: GuestWish = {
      id: `w-${Date.now()}`,
      name: newWish.name,
      status: newWish.status,
      guestCount: newWish.guestCount,
      message: newWish.message,
      timestamp: `${formattedDate}, ${formattedTime}`
    };

    setWishes([wishItem, ...wishes]);
  };

  const handleResetWishes = () => {
    if (confirm('Apakah Anda yakin ingin menyetel ulang daftar ucapan tamu ke semula?')) {
      setWishes(INITIAL_WISHES);
    }
  };

  // Sync Guest Name from Input Editor to Live Cover
  const handleGuestNameInputChange = (name: string) => {
    setGuestNameInput(name);
    setGuestName(name || 'Nama Tamu Undangan');
  };

  const handleResetData = () => {
    if (confirm('Apakah Anda yakin ingin menyetel ulang seluruh data undangan ke default?')) {
      setInvitationData(DEFAULT_INVITATION_DATA);
      setIsOpened(false);
      setIsMusicPlaying(false);
    }
  };

  return (
    <div className="w-screen h-screen flex overflow-hidden bg-slate-950 font-sans">
      {/* 1. LEFT PANEL: CREATOR/EDITOR (Visible in Builder Mode) */}
      <AnimatePresence>
        {isEditorOpen && !isGuestMode && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '420px', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="hidden lg:block h-full shrink-0 relative z-30 shadow-2xl"
          >
            <InvitationEditor 
              data={invitationData} 
              onChange={setInvitationData}
              guestNameInput={guestNameInput}
              onGuestNameChange={handleGuestNameInputChange}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile/Tablet Editor Drawer Button Overlay */}
      <div className="lg:hidden fixed bottom-24 right-4 z-40">
        <button
          onClick={() => {
            setIsGuestMode(false);
            setIsEditorOpen(!isEditorOpen);
          }}
          className="p-4 bg-amber-600 hover:bg-amber-700 text-white rounded-full shadow-2xl border border-amber-500/30 flex items-center justify-center cursor-pointer active:scale-95 transition-all"
        >
          {isEditorOpen ? <X className="w-6 h-6" /> : <Settings className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile/Tablet Editor Drawer */}
      <AnimatePresence>
        {isEditorOpen && !isGuestMode && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="lg:hidden fixed inset-x-0 bottom-0 top-16 z-30 bg-slate-900 border-t border-slate-800 rounded-t-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="flex justify-between items-center px-5 py-4 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2 text-amber-500">
                <Sparkles className="w-5 h-5" />
                <span className="font-bold text-sm tracking-wider uppercase font-serif">Invitation Builder</span>
              </div>
              <button 
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <InvitationEditor 
                data={invitationData} 
                onChange={setInvitationData}
                guestNameInput={guestNameInput}
                onGuestNameChange={handleGuestNameInputChange}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. RIGHT PANEL: LIVE INTERACTIVE PREVIEW (DEVICE FRAMING OR FULLSCREEN) */}
      <div className="flex-1 h-full flex flex-col bg-slate-950 relative overflow-hidden">
        {/* Top Control Bar for live builder features */}
        <div className="w-full bg-slate-900/95 border-b border-slate-800/80 px-4 py-3 flex items-center justify-between shrink-0 z-20 text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <span className="font-bold tracking-wider text-slate-100 flex items-center gap-1.5 font-serif uppercase">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
              Live Preview
            </span>
            <div className="hidden sm:flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800 text-[10px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-400">Theme: {activeTheme.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* View switcher: Builder Mode vs Guest Mode */}
            <button
              onClick={() => {
                setIsGuestMode(!isGuestMode);
                if (!isGuestMode) {
                  setIsEditorOpen(false);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer border ${
                isGuestMode 
                  ? 'bg-amber-600/20 border-amber-500/50 text-amber-400' 
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{isGuestMode ? 'Kembali ke Builder' : 'Uji Mode Tamu'}</span>
            </button>

            {/* Layout Toggle: Mobile Frame vs Full Screen View */}
            {!isGuestMode && (
              <div className="flex items-center bg-slate-950 border border-slate-800 p-1 rounded-lg">
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${
                    previewMode === 'mobile' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Mobile phone view"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${
                    previewMode === 'desktop' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Full browser view"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Quick Reset Tools */}
            {!isGuestMode && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleResetData}
                  className="p-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer"
                  title="Reset Data Undangan"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleResetWishes}
                  className="p-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer text-[10px] hidden md:block"
                  title="Reset Wishes/Guestbook"
                >
                  Reset Guestbook
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview Container Canvas */}
        <div className="flex-1 w-full bg-[#030712] overflow-y-auto flex items-center justify-center p-3 md:p-6 no-scrollbar relative">
          
          {/* Subtle builder watermark background */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center select-none">
            <Heart className="w-96 h-96 text-slate-100" />
          </div>

          {previewMode === 'mobile' && !isGuestMode ? (
            /* PHONE FRAME FOR MOBIL DEVICE MIMICKING */
            <div className="relative w-full max-w-[380px] h-[780px] max-h-[90vh] bg-[#0c0f16] border-[10px] border-[#1e293b] rounded-[40px] shadow-2xl flex flex-col overflow-hidden relative z-10 select-none border-b-[14px]">
              {/* Speaker & Camera notch top */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-[#1e293b] rounded-b-2xl z-50 flex items-center justify-center">
                <span className="w-12 h-1 bg-[#0f172a] rounded-full mr-2" />
                <span className="w-2.5 h-2.5 bg-[#0f172a] rounded-full" />
              </div>

              {/* Status time, signal mockups */}
              <div className="absolute top-2 left-6 right-6 z-40 text-white/90 text-[10px] flex justify-between select-none font-medium pointer-events-none">
                <span>19:45</span>
                <div className="flex items-center gap-1">
                  <span>5G</span>
                  <div className="w-4.5 h-2.5 border border-white/80 rounded p-[1px] flex items-center">
                    <span className="w-full h-full bg-white rounded-[1px]" />
                  </div>
                </div>
              </div>

              {/* Real App Scrollable Canvas Inside Device */}
              <div className="flex-1 w-full h-full overflow-y-auto no-scrollbar relative rounded-[30px] overflow-hidden bg-slate-900 select-text">
                <AnimatePresence mode="wait">
                  {!isOpened ? (
                    <motion.div
                      key="cover"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, y: '-100%' }}
                      transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
                      className="absolute inset-0 z-30"
                    >
                      <InvitationCover 
                        data={invitationData} 
                        theme={activeTheme} 
                        guestName={guestName} 
                        onOpen={handleOpenInvitation}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="w-full h-full overflow-y-auto no-scrollbar"
                    >
                      <InvitationContent 
                        data={invitationData}
                        theme={activeTheme}
                        guestName={guestName}
                        isMusicPlaying={isMusicPlaying}
                        onToggleMusic={handleToggleMusic}
                        wishes={wishes}
                        onAddWish={handleAddWish}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            /* FULL CONTAINER EXPANDED VIEW (Desktop Preview or Guest Mode) */
            <div className="w-full h-full max-w-4xl max-h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative z-10 flex flex-col">
              <div className="flex-1 w-full h-full overflow-y-auto relative no-scrollbar">
                <AnimatePresence mode="wait">
                  {!isOpened ? (
                    <motion.div
                      key="cover"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, y: '-100%' }}
                      transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
                      className="absolute inset-0 z-30"
                    >
                      <InvitationCover 
                        data={invitationData} 
                        theme={activeTheme} 
                        guestName={guestName} 
                        onOpen={handleOpenInvitation}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="w-full h-full"
                    >
                      <InvitationContent 
                        data={invitationData}
                        theme={activeTheme}
                        guestName={guestName}
                        isMusicPlaying={isMusicPlaying}
                        onToggleMusic={handleToggleMusic}
                        wishes={wishes}
                        onAddWish={handleAddWish}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
