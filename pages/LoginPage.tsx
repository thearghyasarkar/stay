import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card, Icon } from '../components/UI';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // PWA State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  const navigate = useNavigate();

  // useEffect(() => {
  //   // Check if already installed
  //   const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
  //   setIsStandalone(isInStandaloneMode);

  //   // Check for iOS
  //   const userAgent = window.navigator.userAgent.toLowerCase();
  //   const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
  //   setIsIOS(isIosDevice);

  //   // Listen for install prompt (Android/Chrome)
  //   const handleBeforeInstallPrompt = (e: Event) => {
  //     e.preventDefault();
  //     setDeferredPrompt(e);
  //     console.log("PWA install prompt ready");
  //   };

  //   window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

  //   return () => {
  //     window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  //   };
  // }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // 1. Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // 2. Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // 3. Update UI notify the user they can install the PWA
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // 1. Show the install prompt
    deferredPrompt.prompt();

    // 2. Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // 3. We've used the prompt, so clear it
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  // const handleInstallClick = async () => {
  //   // Handle iOS Instructions
  //   if (isIOS) {
  //     setShowIOSInstructions(!showIOSInstructions);
  //     return;
  //   }

  //   // Handle Android/Desktop Prompt
  //   if (!deferredPrompt) return;

  //   deferredPrompt.prompt();
  //   const { outcome } = await deferredPrompt.userChoice;
  //   console.log(`User response to the install prompt: ${outcome}`);
  //   setDeferredPrompt(null);
  // };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper-light dark:bg-paper-dark p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-stone-900 dark:bg-stone-100 rounded-full flex items-center justify-center text-white dark:text-black font-serif font-bold italic text-3xl mx-auto mb-4 shadow-lg">
            s.
          </div>
          <h1 className="text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-2">stay.</h1>
          <p className="text-stone-500">Your minimalist personal journal.</p>
        </div>

        <Card>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Email</label>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Password</label>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="••••••••"
              />
            </div>

            {error && <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/10 p-2 rounded">{error}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          <div className="mt-6 text-center border-b border-stone-100 dark:border-stone-800 pb-6">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline underline-offset-4"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          {/* Install App Section */}
          {isInstallable && (
            <div className="mt-6 pt-2 animate-fade-in">
               <p className="text-center text-xs text-stone-400 mb-3">Get the full experience</p>
               <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800"
                  onClick={handleInstallClick}
               >
                  <Icon name={isIOS ? "share" : "smartphone"} size={18} />
                  Install App
               </Button>

               {/* iOS Specific Instructions */}
               {showIOSInstructions && isIOS && (
                 <div className="mt-4 p-4 bg-stone-50 dark:bg-stone-800 rounded-lg text-sm text-stone-600 dark:text-stone-300 animate-slide-up">
                    <div className="flex items-center gap-3 mb-2">
                       <Icon name="share" size={20} className="text-blue-500" />
                       <p>1. Tap the <span className="font-bold">Share</span> button in your browser menu.</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-5 h-5 border-2 border-stone-400 rounded flex items-center justify-center">
                          <span className="text-xs font-bold">+</span>
                       </div>
                       <p>2. Select <span className="font-bold">Add to Home Screen</span>.</p>
                    </div>
                 </div>
               )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;