'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy, limit, where, getDocs, getDoc } from 'firebase/firestore';
import { seedInitialData } from '@/lib/seed';
import { useFileSystem } from '@/hooks/useFileSystem';
import { logUserLogin, logAppUsage, syncUserAction } from '@/lib/analytics';
import { ingestDocument } from '@/app/actions/knowledge';

import { AppRegistry, AppId } from './AppRegistry';
import AppWindow from './AppWindow';
import Taskbar from './Taskbar';
import AppDrawer from './AppDrawer';
import VoiceAssistant from './VoiceAssistant';
import MacOSMenuBar from './MacOSMenuBar';
import MacOSControlCenter from './MacOSControlCenter';

export default function WebOSShell() {
  const fileSystem = useFileSystem();
  const [user, setUser] = useState<any>({
    uid: 'guest_admin',
    displayName: 'MASTER ADMIN',
    email: 'admin@synapse.ai',
    role: 'Master Administrator'
  });
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [openApps, setOpenApps] = useState<AppId[]>([]);
  const [activeApp, setActiveApp] = useState<AppId | null>(null);
  const [minimizedApps, setMinimizedApps] = useState<AppId[]>([]);
  const [maximizedApps, setMaximizedApps] = useState<AppId[]>([]);
  const [zOrder, setZOrder] = useState<AppId[]>([]);
  const [liveFeed, setLiveFeed] = useState<any[]>([]);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [appParams, setAppParams] = useState<Record<AppId, any>>({} as any);

  const appStartTimes = useRef<Record<string, number>>({});

  const handleOpenApp = useCallback((appId: AppId, params?: any) => {
    if (appId === 'voice' as any) {
      setIsVoiceAssistantOpen(true);
      return;
    }
    if (params) {
      setAppParams(prev => ({ ...prev, [appId]: params }));
    }
    setOpenApps(prev => {
      if (!prev.includes(appId)) {
        if (!appStartTimes.current[appId]) {
          appStartTimes.current[appId] = Date.now();
          if (user?.uid) syncUserAction(user.uid, 'app_opened', { appId });
        }
        return [...prev, appId];
      }
      return prev;
    });
    setZOrder(prev => [...prev.filter(id => id !== appId), appId]);
    setActiveApp(appId);
    setMinimizedApps(prev => prev.filter(id => id !== appId));
    setIsStartOpen(false);
  }, [user?.uid]);

  const handleCloseApp = useCallback((appId: AppId) => {
    setOpenApps(prev => prev.filter(id => id !== appId));
    setZOrder(prev => prev.filter(id => id !== appId));
    setMinimizedApps(prev => prev.filter(id => id !== appId));
    setMaximizedApps(prev => prev.filter(id => id !== appId));
    if (activeApp === appId) {
      setActiveApp(null);
    }
    
    const startTime = appStartTimes.current[appId];
    if (startTime && user?.uid) {
      const durationMs = Date.now() - startTime;
      logAppUsage(user.uid, appId, durationMs);
      syncUserAction(user.uid, 'app_closed', { appId, durationMs });
      delete appStartTimes.current[appId];
    }
  }, [activeApp, user?.uid]);

  const handleMinimizeApp = useCallback((appId: AppId) => {
    setMinimizedApps(prev => {
      if (!prev.includes(appId)) return [...prev, appId];
      return prev;
    });
    if (activeApp === appId) {
      const remainingApps = zOrder.filter(id => id !== appId && !minimizedApps.includes(id));
      setActiveApp(remainingApps.length > 0 ? remainingApps[remainingApps.length - 1] : null);
    }
  }, [activeApp, minimizedApps, zOrder]);

  const handleMaximizeApp = useCallback((appId: AppId) => {
    setMaximizedApps(prev => {
      if (prev.includes(appId)) return prev.filter(id => id !== appId);
      return [...prev, appId];
    });
  }, []);

  const handleFocusApp = useCallback((appId: AppId) => {
    setActiveApp(appId);
    setMinimizedApps(prev => prev.filter(id => id !== appId));
    setZOrder(prev => [...prev.filter(id => id !== appId), appId]);
  }, []);

  // Keyboard Shortcuts (⌘ + Space or Ctrl + Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
        e.preventDefault();
        setIsStartOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auth State Listener
  useEffect(() => {
    // Boot splash: auto-dismiss after 2.5s regardless of Firebase
    const timeout = setTimeout(() => {
      setLoading(false);
      setUser({
        uid: 'guest_admin',
        displayName: 'MASTER ADMIN',
        email: 'admin@synapse.ai',
        role: 'Master Administrator'
      });
    }, 2500);

    const unsubscribe = onAuthStateChanged(auth, async (currUser) => {
      clearTimeout(timeout);
      setFirebaseUser(currUser);
      if (currUser) {
        setUser({
          uid: currUser.uid,
          displayName: currUser.displayName || currUser.email?.split('@')[0] || 'MASTER ADMIN',
          email: currUser.email,
          photoURL: currUser.photoURL,
          role: 'Master Administrator'
        });
        logUserLogin(currUser.uid, currUser.email);
        try {
          await seedInitialData(currUser.uid);
        } catch (e) {
          console.error("Seed error", e);
        }
      } else {
        setUser({
          uid: 'guest_admin',
          displayName: 'MASTER ADMIN',
          email: 'admin@synapse.ai',
          role: 'Master Administrator'
        });
      }
      setLoading(false);
    }, (error) => {
      clearTimeout(timeout);
      console.error('Auth state error:', error);
      setUser({
        uid: 'guest_admin',
        displayName: 'MASTER ADMIN',
        email: 'admin@synapse.ai',
        role: 'Master Administrator'
      });
      setLoading(false);
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  // Live Audit Stream
  useEffect(() => {
    if (!user?.uid || user.uid === 'guest_admin' || !auth.currentUser) return;
    const q = query(
      collection(db, 'audit_logs'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLiveFeed(logs);
    }, (error) => {
      console.warn("Audit listener permission note:", error);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Global App Event Listener
  useEffect(() => {
    const handleGlobalOpenApp = (e: any) => {
      if (e.detail && e.detail.appId) {
        handleOpenApp(e.detail.appId, e.detail);
      }
    };
    window.addEventListener('open-app', handleGlobalOpenApp);
    return () => window.removeEventListener('open-app', handleGlobalOpenApp);
  }, [handleOpenApp]);

  // Autonomous Sync Daemon
  useEffect(() => {
    let syncInterval: NodeJS.Timeout;

    const performAutonomousSync = async () => {
      if (!user?.uid) return;
      // We will look for an orgId from the user doc if needed, or fallback to user.uid
      const orgIdToSync = user.orgId || user.uid;
      const isAutonomous = localStorage.getItem('synapse-autonomous-sync-enabled') === 'true';
      if (!isAutonomous) return;

      try {
        console.log('[Autonomous Sync] Starting sync...');
        let report = '# Autonomous OS State Report\n\n';
        
        // 1. Fetch Firebase Data (Transactions & Taxes)
        try {
          const txQuery = query(collection(db, 'transactions'), where('orgId', '==', orgIdToSync), orderBy('timestamp', 'desc'), limit(20));
          const txSnap = await getDocs(txQuery);
          report += '## SpendSense Transactions\n';
          txSnap.forEach(doc => {
            const data = doc.data();
            report += `- ${data.merchant} | $${data.amount} | ${data.category}\n`;
          });

          const taxQuery = query(collection(db, 'tax_filings'), where('orgId', '==', orgIdToSync), orderBy('createdAt', 'desc'), limit(10));
          const taxSnap = await getDocs(taxQuery);
          report += '\n## TaxPilot Filings\n';
          taxSnap.forEach(doc => {
            const data = doc.data();
            report += `- ${data.type} for ${data.period}: ${data.status} (Liabilities: $${data.totalLiabilities})\n`;
          });
        } catch (fbErr) {
          console.warn('[Autonomous Sync] Firebase fetch partial failure', fbErr);
        }

        // 2. Fetch Local Storage Data (Mail & Calendar)
        const mails = JSON.parse(localStorage.getItem('synapse-mail-data') || '[]');
        const events = JSON.parse(localStorage.getItem('synapse-calendar-events') || '[]');
        
        report += '\n## Recent Emails\n';
        mails.slice(0, 15).forEach((m: any) => {
          report += `- [${m.folder?.toUpperCase() || 'INBOX'}] From: ${m.sender} (${m.email}) | Subject: ${m.subject}\n  Content: ${m.snippet}\n`;
        });

        report += '\n## Upcoming Calendar Events\n';
        events.slice(0, 15).forEach((e: any) => {
          report += `- [${e.date}/${e.month + 1}/${e.year}] ${e.time} - ${e.title}: ${e.description}\n`;
        });

        // 3. Ingest to Vector DB
        await ingestDocument('Autonomous Global State Sync', report, { source: 'autonomous_sync' });
        console.log('[Autonomous Sync] Sync complete.');
      } catch (err) {
        console.error('[Autonomous Sync] Failed:', err);
      }
    };

    // Run every 5 minutes
    syncInterval = setInterval(performAutonomousSync, 5 * 60 * 1000);

    // Listen for forced manual trigger from Knowledge Base UI
    const handleForceSync = () => performAutonomousSync();
    window.addEventListener('force-autonomous-sync', handleForceSync);

    return () => {
      clearInterval(syncInterval);
      window.removeEventListener('force-autonomous-sync', handleForceSync);
    };
  }, [user?.uid, user?.orgId]);

  const activeAppDef = AppRegistry.find(a => a.id === activeApp);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#07070a] flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center border-2 border-white/30 shadow-2xl mb-5">
          <Sparkles size={28} className="text-white animate-spin" />
        </div>
        <h1 className="text-sm font-black tracking-widest text-cyan-300 uppercase">SYNAPSE OS EXECUTIVE</h1>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden relative select-none bg-[#07070a] text-white">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-cyan-600/15 rounded-full blur-[180px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[180px]" />
      </div>

      {/* Top macOS Menu Bar */}
      <MacOSMenuBar
        activeAppName={activeAppDef ? activeAppDef.name : 'DESKTOP'}
        onOpenSpotlight={() => setIsStartOpen(true)}
        onToggleControlCenter={() => setIsControlCenterOpen(prev => !prev)}
        isControlCenterOpen={isControlCenterOpen}
        onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
        onLock={() => setIsLocked(true)}
        onSignOut={() => signOut(auth)}
        user={user}
      />

      {/* Control Center Overlay */}
      <MacOSControlCenter
        isOpen={isControlCenterOpen}
        onClose={() => setIsControlCenterOpen(false)}
        onOpenVoice={() => setIsVoiceAssistantOpen(true)}
        onLock={() => setIsLocked(true)}
        onSignOut={() => signOut(auth)}
        user={user}
      />

      {/* Prominent Desktop Icons Grid */}
      <div className="absolute inset-0 top-12 bottom-24 p-3 sm:p-6 grid grid-flow-col grid-rows-5 gap-3 sm:gap-6 justify-start items-start pointer-events-auto max-w-full overflow-hidden">
        {AppRegistry.filter(a => !a.hidden).map(app => (
          <div
            key={app.id}
            onClick={() => handleOpenApp(app.id)}
            className="flex flex-col items-center gap-2 p-2.5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group w-24 text-center"
          >
            <div className={`w-14 h-14 rounded-2xl ${app.color} flex items-center justify-center border-2 border-white/25 shadow-xl group-hover:scale-110 transition-transform`}>
              <app.icon size={28} className="text-white drop-shadow-md" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-white drop-shadow-md truncate w-full">
              {app.name}
            </span>
          </div>
        ))}
      </div>

      {/* Active Application Windows */}
      <div className="absolute inset-0 top-10 bottom-20 pointer-events-none">
        <AnimatePresence>
          {openApps.map(appId => {
            const app = AppRegistry.find(a => a.id === appId);
            if (!app) return null;

            const isMinimized = minimizedApps.includes(appId);
            if (isMinimized) return null;

            const isActive = activeApp === appId;
            const isMaximized = maximizedApps.includes(appId);
            const zIndex = zOrder.indexOf(appId) + 10;
            const AppComponent = app.component;
            const params = appParams[appId];

            return (
              <AppWindow
                key={appId}
                app={app}
                isActive={isActive}
                isMaximized={isMaximized}
                zIndex={zIndex}
                onClose={() => handleCloseApp(appId)}
                onMinimize={() => handleMinimizeApp(appId)}
                onMaximize={() => handleMaximizeApp(appId)}
                onFocus={() => handleFocusApp(appId)}
              >
                <AppComponent 
                  user={user} 
                  params={params} 
                  onOpenApp={handleOpenApp} 
                />
              </AppWindow>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Launchpad Overlay */}
      <AppDrawer
        isOpen={isStartOpen}
        apps={AppRegistry.filter(a => !a.hidden)}
        onAppClick={(id) => handleOpenApp(id)}
        onClose={() => setIsStartOpen(false)}
        onSignOut={() => signOut(auth)}
        onLock={() => setIsLocked(true)}
        user={user}
      />

      {/* Dock */}
      <Taskbar
        openApps={openApps}
        activeApp={activeApp}
        minimizedApps={minimizedApps}
        onAppClick={handleOpenApp}
        onStartClick={() => setIsStartOpen(prev => !prev)}
        isStartOpen={isStartOpen}
        apps={AppRegistry}
      />

      {/* Voice Assistant */}
      <AnimatePresence>
        {isVoiceAssistantOpen && (
          <VoiceAssistant 
            user={user} 
            onClose={() => setIsVoiceAssistantOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Lock Screen */}
      <AnimatePresence>
        {isLocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center text-white"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-black text-white border-2 border-white/30 mb-4 shadow-2xl">
              {user?.displayName?.[0] || 'A'}
            </div>
            <h2 className="text-xl font-black uppercase tracking-widest">{user?.displayName || 'MASTER ADMIN'}</h2>
            <p className="text-xs text-cyan-400 font-mono font-bold uppercase mt-1 mb-6 tracking-widest">SESSION LOCKED</p>
            <button
              onClick={() => setIsLocked(false)}
              className="px-8 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border-2 border-white/25 transition-all text-xs font-black uppercase tracking-wider text-white shadow-xl"
            >
              UNLOCK SESSION
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
