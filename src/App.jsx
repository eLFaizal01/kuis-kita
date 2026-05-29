import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Plus, ArrowLeft, CheckCircle2, XCircle, 
  Clock, Award, Trash2, Save, AlertCircle, RefreshCw, 
  Home, ArrowUp, ArrowDown, GripVertical, ListOrdered,
  Volume2, VolumeX, Music, Trophy, User, LayoutGrid,
  Star, Sparkles, ImageIcon, Heart, Lightbulb,
  Share2, Copy, Pencil, Wand2, Loader2, LogOut, Mail, Lock
} from 'lucide-react';

// --- FIREBASE CLOUD SETUP UNTUK PUBLISH KUIS & AUTENTIKASI ---
import { auth as firebaseAuth, db as firebaseDb } from "./firebase";
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously, 
  onAuthStateChanged, 
  signInWithCustomToken,
  signOut
} from 'firebase/auth';

import { doc, setDoc, getDoc, collection, onSnapshot } from 'firebase/firestore';

// ISI LANGSUNG VARIABEL GLOBALNYA DI SINI
let appId = "default-app-id";
let auth = firebaseAuth;
let db = firebaseDb;

// --- DATA AWAL (DEFAULT QUIZZES) ---
const defaultQuizzes = [
  {
    id: "quiz_1716654800",
    title: "Kuis Pengetahuan Umum",
    description: "Uji wawasan umum kamu di sini! Terdiri dari pertanyaan-pertanyaan dasar yang menyenangkan.",
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        questionText: "Apa ibukota dari negara Indonesia?",
        options: ["Surabaya", "Jakarta", "Bandung", "Medan"],
        correctAnswer: "Jakarta",
        timeLimit: 15,
        points: 10
      },
      {
        id: "q7",
        type: "image-choice",
        questionText: "Visual: Yang manakah gambar dari buah Apel?",
        options: [
          "https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg", 
          "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg", 
          "https://upload.wikimedia.org/wikipedia/commons/c/c4/Orange-Fruit-Pieces.jpg", 
          "https://upload.wikimedia.org/wikipedia/commons/3/36/Kyoho-grape.jpg" 
        ],
        correctAnswer: "https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg",
        timeLimit: 20,
        points: 15
      },
      {
        id: "q6",
        type: "memory",
        questionText: "Game Memori: Temukan dan cocokkan pasangan gambar yang sama di balik kartu!",
        pairs: [
          "🚗 Mobil", 
          "🐟 Ikan", 
          "🍭 Permen", 
          "✏️ Pensil",
          "🦖 Rex"
        ],
        timeLimit: 45,
        points: 30 
      },
      {
        id: "q5",
        type: "sorting",
        questionText: "Puzzle Susunan: Urutkan Rukun Islam berikut dengan benar (dari yang pertama hingga kelima):",
        correctOrder: [
          "Membaca Dua Kalimat Syahadat",
          "Mendirikan Shalat",
          "Menunaikan Zakat",
          "Berpuasa di Bulan Ramadhan",
          "Pergi Haji bagi yang Mampu"
        ],
        timeLimit: 30,
        points: 25 
      }
    ]
  }
];

const STICKER_COLLECTION = [
  { id: 'st1', emoji: '🦖', name: 'Dino Keren' },
  { id: 'st2', emoji: '🚀', name: 'Roket Super' },
  { id: 'st3', emoji: '🦄', name: 'Kuda Poni Ajaib' },
  { id: 'st4', emoji: '🦸‍♂️', name: 'Pahlawan Super' },
  { id: 'st5', emoji: '🐱‍🚀', name: 'Kucing Astronot' },
  { id: 'st6', emoji: '🍕', name: 'Pizza Lezat' },
  { id: 'st7', emoji: '🚁', name: 'Heli Penyelamat' },
  { id: 'st8', emoji: '🧜‍♀️', name: 'Putri Duyung' },
  { id: 'st9', emoji: '🏎️', name: 'Mobil Balap' },
  { id: 'st10', emoji: '🧸', name: 'Beruang Peluk' }
];

const AVATAR_LIST = ['🐶', '🐱', '🦊', '🐰', '🦁', '🐸', '🐼', '🐨', '🐯', '🐮'];

// --- KOMPONEN MASKOT SVG (BIPBOP 2.0 - FUTURISTIK & CANGGIH) ---
const BipBopMascot = ({ mood }) => {
  // Menentukan warna holografik/neon berdasarkan mood
  const getThemeColor = () => {
    if (mood === 'gameover' || mood === 'timeout') return '#ff1744'; // Merah Neon
    if (mood === 'happy' || mood === 'excited' || mood === 'start' || mood === 'result') return '#00e676'; // Hijau Emerald/Cyan
    if (mood === 'sad') return '#2979ff'; // Biru Elektrik
    if (mood === 'memorize') return '#d500f9'; // Ungu/Violet
    return '#00e5ff'; // Cyan (Default)
  };
  
  const theme = getThemeColor();

  return (
    <svg viewBox="0 0 120 120" className="w-24 h-24 md:w-32 md:h-32 drop-shadow-2xl overflow-visible">
      <defs>
        {/* Gradien Bodi Metalik Putih ala Perangkat Sci-Fi */}
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        
        {/* Gradien Kaca Visor Gelap Mengkilap */}
        <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        {/* Efek Neon Glow untuk elemen antarmuka wajah */}
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Cincin Levitasi Melayang di Bawah (Hover Effect) */}
      <ellipse cx="60" cy="112" rx="25" ry="4" fill="none" stroke={theme} strokeWidth="1.5" opacity="0.6" filter="url(#neonGlow)" />
      <ellipse cx="60" cy="112" rx="12" ry="2" fill={theme} opacity="0.3" filter="url(#neonGlow)" />

      <g className="transition-transform duration-500 hover:-translate-y-2">
        {/* Sayap/Panel Sensor Samping */}
        <rect x="23" y="45" width="6" height="30" rx="3" fill="#94a3b8" />
        <rect x="91" y="45" width="6" height="30" rx="3" fill="#94a3b8" />
        
        {/* Garis Indikator Panel Samping */}
        <rect x="21" y="55" width="4" height="10" rx="2" fill={theme} filter="url(#neonGlow)" />
        <rect x="95" y="55" width="4" height="10" rx="2" fill={theme} filter="url(#neonGlow)" />

        {/* Bodi Utama - Bentuk Kapsul/Telur Elegan */}
        <path d="M 30 45 C 30 15, 90 15, 90 45 C 90 85, 75 105, 60 105 C 45 105, 30 85, 30 45 Z" fill="url(#bodyGrad)" stroke="#e2e8f0" strokeWidth="2" />
        
        {/* Layar Visor Melengkung */}
        <path d="M 34 45 C 34 30, 86 30, 86 45 C 86 70, 75 80, 60 80 C 45 80, 34 70, 34 45 Z" fill="url(#visorGrad)" />

        {/* Pantulan Cahaya (Glossy Reflection) di atas Kaca */}
        <path d="M 37 40 C 37 32, 83 32, 83 40 C 83 45, 60 40, 37 45 Z" fill="#ffffff" opacity="0.08" />

        {/* EKSPRESI WAJAH HOLOGRAFIK */}
        <g filter="url(#neonGlow)" fill="none" stroke={theme} strokeWidth="3.5" strokeLinecap="round">
          {(mood === 'happy' || mood === 'excited' || mood === 'start' || mood === 'result') ? (
            <>
              {/* Mata Bahagia */}
              <path d="M 45 52 Q 50 44 55 52" />
              <path d="M 65 52 Q 70 44 75 52" />
              {/* Senyum */}
              <path d="M 52 64 Q 60 70 68 64" strokeWidth="2.5" />
            </>
          ) : mood === 'sad' ? (
            <>
              {/* Mata Sedih */}
              <line x1="45" y1="48" x2="55" y2="52" />
              <line x1="65" y1="52" x2="75" y2="48" />
              {/* Mulut Turun */}
              <path d="M 55 68 Q 60 63 65 68" strokeWidth="2.5" />
            </>
          ) : mood === 'memorize' ? (
            <>
              {/* Mata Scanner (Fokus) */}
              <circle cx="50" cy="52" r="4.5" fill="none" strokeWidth="2" />
              <circle cx="70" cy="52" r="4.5" fill="none" strokeWidth="2" />
              <circle cx="50" cy="52" r="1.5" fill={theme} stroke="none" />
              <circle cx="70" cy="52" r="1.5" fill={theme} stroke="none" />
              {/* Garis Scan */}
              <line x1="42" y1="65" x2="78" y2="65" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.8" />
            </>
          ) : (mood === 'gameover' || mood === 'timeout') ? (
            <>
              {/* Mata Silang (Error) */}
              <path d="M 46 48 L 54 56 M 54 48 L 46 56" strokeWidth="3" />
              <path d="M 66 48 L 74 56 M 74 48 L 66 56" strokeWidth="3" />
              {/* Mulut Glitch */}
              <line x1="50" y1="66" x2="70" y2="66" strokeWidth="2.5" strokeDasharray="2,3" />
            </>
          ) : (
            <>
              {/* Default / Menunggu */}
              <circle cx="50" cy="52" r="3.5" fill={theme} stroke="none" />
              <circle cx="70" cy="52" r="3.5" fill={theme} stroke="none" />
              <line x1="55" y1="65" x2="65" y2="65" strokeWidth="2" />
            </>
          )}
        </g>
      </g>
    </svg>
  );
};

export default function App() {
  // --- STATES ---
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [view, setView] = useState('login'); 
  
  const [quizzes, setQuizzes] = useState([]);
  const [isSharedMode, setIsSharedMode] = useState(false);
  const [shareModal, setShareModal] = useState({ show: false, link: '', copied: false });
  const [leaderboards, setLeaderboards] = useState({});
  const [cloudLeaderboard, setCloudLeaderboard] = useState([]);
  
  const [isScoreSaved, setIsScoreSaved] = useState(false);
  const [unlockedStickers, setUnlockedStickers] = useState([]);
  const [sessionReward, setSessionReward] = useState(null);

  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  
  const [lives, setLives] = useState(3);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [hiddenOptions, setHiddenOptions] = useState([]); 

  const [puzzleInput, setPuzzleInput] = useState(''); 
  const [sortingItems, setSortingItems] = useState([]); 
  
  const [memoryCards, setMemoryCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isMemorizing, setIsMemorizing] = useState(false);

  const [showFeedback, setShowFeedback] = useState(false);
  const [stats, setStats] = useState({ correct: 0, wrong: 0, totalTime: 0 });

  const [mascot, setMascot] = useState({ message: 'Halo! Aku BipBop siap menemani!', mood: 'excited' });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bgmEnabled, setBgmEnabled] = useState(false); 
  const [bgmIndex, setBgmIndex] = useState(0); 

  const [draftQuiz, setDraftQuiz] = useState({ title: '', description: '', questions: [] });
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [draftQ, setDraftQ] = useState({
    type: 'multiple-choice', questionText: '', options: ['', '', '', ''],
    correctAnswer: '', sortingText: '', memoryText: '', timeLimit: 15, points: 10
  });
  const [creatorError, setCreatorError] = useState('');

  const [showAIModal, setShowAIModal] = useState(false);
  const [aiTopic, setAITopic] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // --- REFS ---
  const bgmRef = useRef(null);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const timerIntervalRef = useRef(null);
  const feedbackTimeoutRef = useRef(null);
  const memorizeTimeoutRef = useRef(null);

  const bgmOptions = [
    { name: "Trek 1 (Santai)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { name: "Trek 2 (Ceria)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { name: "Trek 3 (Eksotis)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3" }, 
    { name: "Trek 4 (Semangat)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { name: "Trek 5 (Retro)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" }
  ];

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

  // --- HELPER FUNCTIONS ---
  const triggerMascot = (mood) => {
    const messages = {
      happy: ["Hebat!", "Benar sekali! 🌟", "Kamu cerdas! 🧠", "Luar biasa! 🎉", "Mantappp! 👍"],
      sad: ["Ups, salah! 🥺", "Tidak apa-apa, coba lagi! 💪", "Tetap semangat!", "Aduh, nyaris! 🙈"],
      timeout: ["Waktu habis! ⏰", "Yah, kelamaan! 🐢", "Ayo lebih cepat! ⚡"],
      memorize: ["Mataku mengawasi! 👀", "Hafalkan posisinya ya! 🧠", "Fokus, fokus! 🔍"],
      start: ["Ayo mulai! Kamu pasti bisa! 🚀", "Semoga berhasil! 🍀", "BipBop siap menemanimu! 🤖"],
      result: ["Kuis selesai! Cek nilaimu! 🏆", "Wah, kamu sudah berusaha keras! 👏"],
      gameover: ["Oh tidak! Hati kamu habis! 💔", "Kesempatan habis! Semangat coba lagi! 🥺"]
    };
    const list = messages[mood] || messages.start;
    const randomMsg = list[Math.floor(Math.random() * list.length)];
    setMascot({ message: randomMsg, mood });
    return randomMsg;
  };

  const playSound = (type) => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      
      if (type === 'correct') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(523.25, now); osc.frequency.setValueAtTime(659.25, now + 0.1);
        gain.gain.setValueAtTime(0.5, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3); osc.start(now); osc.stop(now + 0.3);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, now); osc.frequency.linearRampToValueAtTime(100, now + 0.3);
        gain.gain.setValueAtTime(0.5, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3); osc.start(now); osc.stop(now + 0.3);
      } else if (type === 'timeout') {
        osc.type = 'square'; osc.frequency.setValueAtTime(200, now); osc.frequency.setValueAtTime(150, now + 0.2);
        gain.gain.setValueAtTime(0.3, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4); osc.start(now); osc.stop(now + 0.4);
      } else if (type === 'win') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(440, now); osc.frequency.setValueAtTime(554.37, now + 0.1);
        osc.frequency.setValueAtTime(659.25, now + 0.2); osc.frequency.setValueAtTime(880, now + 0.3);
        gain.gain.setValueAtTime(0.5, now); gain.gain.linearRampToValueAtTime(0.01, now + 0.6); osc.start(now); osc.stop(now + 0.6);
      } else if (type === 'flip') {
        osc.type = 'triangle'; osc.frequency.setValueAtTime(300, now); osc.frequency.exponentialRampToValueAtTime(500, now + 0.1);
        gain.gain.setValueAtTime(0.3, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1); osc.start(now); osc.stop(now + 0.1);
      }
    } catch (e) { }
  };

  // --- GEMINI AI INTEGRATION ---
  const generateQuizWithAI = async () => {
    if (!aiTopic.trim() || !apiKey) return;
    setIsGeneratingAI(true);
    setCreatorError('');
    
    const promptText = `Buatkan kuis edukatif dan interaktif untuk anak-anak dengan topik: "${aiTopic}". 
    Kuis harus terdiri dari 3 pertanyaan dengan tipe bervariasi (kombinasi multiple-choice, puzzle kata, atau sorting urutan). 
    Berikan deskripsi kuis yang menyemangati. Tulis dalam bahasa Indonesia yang mudah dipahami anak-anak.`;

    const payload = {
      contents: [{ parts: [{ text: promptText }] }],
      systemInstruction: { parts: [{ text: "Kamu adalah asisten AI pembuat kuis edukatif untuk anak-anak bernama BipBop. Output harus berformat JSON terstruktur." }] },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            description: { type: "STRING" },
            questions: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  type: { type: "STRING", description: "Must be one of: multiple-choice, puzzle, sorting" },
                  questionText: { type: "STRING" },
                  options: { type: "ARRAY", items: { type: "STRING" } },
                  correctAnswer: { type: "STRING" },
                  sortingText: { type: "STRING" },
                  timeLimit: { type: "INTEGER" },
                  points: { type: "INTEGER" }
                },
                required: ["type", "questionText", "timeLimit", "points"]
              }
            }
          },
          required: ["title", "description", "questions"]
        }
      }
    };

    try {
      let retries = 3;
      let delay = 1000;
      let response;
      
      while (retries > 0) {
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (response.ok) break;
        retries--;
        await new Promise(r => setTimeout(r, delay));
        delay *= 2;
      }

      if (!response || !response.ok) throw new Error("Gagal menghubungi AI.");
      
      const data = await response.json();
      const generatedData = JSON.parse(data.candidates[0].content.parts[0].text);
      
      const formattedQuestions = generatedData.questions.map((q, i) => {
        let formattedQ = { ...q, id: `q_ai_${Date.now()}_${i}`, options: q.options || [], correctOrder: [] };
        if (q.type === 'sorting' && q.sortingText) formattedQ.correctOrder = q.sortingText.split('\n').map(item => item.trim()).filter(item => item !== '');
        if (q.type === 'multiple-choice' && (!q.options || q.options.length < 2)) formattedQ.options = [q.correctAnswer, "Pilihan B", "Pilihan C", "Pilihan D"]; 
        return formattedQ;
      });

      setDraftQuiz({
        title: generatedData.title || `Kuis: ${aiTopic}`,
        description: generatedData.description || `Kuis seru tentang ${aiTopic} yang dibuat oleh BipBop!`,
        questions: [...draftQuiz.questions, ...formattedQuestions]
      });
      setShowAIModal(false);
      setAITopic('');
    } catch (err) {
      setCreatorError("BipBop kebingungan! Gagal membuat kuis dengan AI saat ini. Silakan coba lagi.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // --- USE EFFECTS ---
  
  // 1. Init Auth
  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (e) { console.error("Auth error", e); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // 2. Fetch User Profile after Auth changes
  useEffect(() => {
    if (!auth || !db || !user) return;
    const fetchProfile = async () => {
       if (!user.isAnonymous) {
          try {
             const profileRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profiles', 'info');
             const snap = await getDoc(profileRef);
             if (snap.exists()) {
                 const data = snap.data();
                 setUserProfile(data);
                 localStorage.setItem('quiz_user_profile', JSON.stringify(data));
                 if (view === 'login' && !window.location.hash.startsWith('#play=')) setView('lobby');
             }
          } catch(e) { console.error(e); }
       }
    };
    fetchProfile();
  }, [user]);

  // 3. Hash Routing (Shared Mode FIX)
  useEffect(() => {
    const handleHashChange = async () => {
      const hash = window.location.hash;
      if (hash.startsWith('#play=') && db && user) {
        const playId = hash.split('=')[1];
        try {
          const quizRef = doc(db, 'artifacts', appId, 'public', 'data', 'quizzes', playId);
          const snap = await getDoc(quizRef);
          if (snap.exists()) {
            const sharedQuiz = snap.data();
            setIsSharedMode(true);
            
            const localProfile = localStorage.getItem('quiz_user_profile');
            if (localProfile) {
                setUserProfile(JSON.parse(localProfile));
                startGame(sharedQuiz); // Jika sudah ada nama, langsung main
            } else {
                setCurrentQuiz(sharedQuiz); // Simpan data kuis sementara
                setView('guest-join');      // Arahkan ke halaman input nama
            }
          } else {
            setMascot({ message: "Yah, Kuis yang dibagikan tidak ditemukan! 🥺", mood: "sad" });
            setTimeout(() => { window.location.hash = ''; }, 3000);
          }
        } catch(e) { console.error("Failed to load shared quiz", e); }
      } else if (!hash.startsWith('#play=')) {
        setIsSharedMode(false);
      }
    };
    if (user) handleHashChange(); 
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [user]);

  // 4. Load Data Lokal
  useEffect(() => {
    const profile = localStorage.getItem('quiz_user_profile');
    const isPlayLink = window.location.hash.startsWith('#play=');
    
    if (profile) {
       setUserProfile(JSON.parse(profile));
       if (view === 'login' && !isPlayLink) setView('lobby'); 
    }

    const savedQuizzes = localStorage.getItem('custom_quizzes');
    if (savedQuizzes) setQuizzes(JSON.parse(savedQuizzes));
    else {
      setQuizzes(defaultQuizzes);
      localStorage.setItem('custom_quizzes', JSON.stringify(defaultQuizzes));
    }
    const savedLeaderboards = localStorage.getItem('quiz_leaderboards');
    if (savedLeaderboards) setLeaderboards(JSON.parse(savedLeaderboards));
    const savedStickers = localStorage.getItem('quiz_stickers');
    if (savedStickers) setUnlockedStickers(JSON.parse(savedStickers));
  }, []);

  // 5. Cloud Leaderboard Sync
  useEffect(() => {
    if (view === 'result' && isSharedMode && db && user && currentQuiz) {
        const lbCollectionRef = collection(db, 'artifacts', appId, 'public', 'data', `lb_${currentQuiz.id}`);
        const unsubscribe = onSnapshot(lbCollectionRef, (snap) => {
            const entries = [];
            snap.forEach(doc => entries.push(doc.data()));
            entries.sort((a, b) => b.score - a.score);
            setCloudLeaderboard(entries);
        }, (error) => console.error(error));
        return () => unsubscribe();
    }
  }, [view, isSharedMode, user, currentQuiz]);

  // 6. BGM Setup
  useEffect(() => {
    if (!bgmRef.current) {
      bgmRef.current = new Audio(bgmOptions[bgmIndex].url);
      bgmRef.current.loop = true;
      bgmRef.current.volume = 0.15; 
    } else {
      bgmRef.current.src = bgmOptions[bgmIndex].url;
      if (bgmEnabled) bgmRef.current.play().catch(e => console.log(e));
    }
  }, [bgmIndex]);

  useEffect(() => {
    if (bgmEnabled) {
      const playPromise = bgmRef.current?.play();
      if (playPromise !== undefined) playPromise.catch(e => { setBgmEnabled(false); });
    } else {
      bgmRef.current?.pause();
    }
  }, [bgmEnabled]);

  // 7. Evaluate Result & Assign Stickers
  useEffect(() => {
    if (view === 'result' && currentQuiz) {
       const maxScore = currentQuiz.questions.reduce((sum, q) => sum + (q.points || 10), 0);
       const percentage = Math.round((score / maxScore) * 100) || 0;
       
       if (lives > 0 && percentage >= 90) {
          const lockedStickers = STICKER_COLLECTION.filter(s => !unlockedStickers.includes(s.id));
          if (lockedStickers.length > 0) {
             const randomSticker = lockedStickers[Math.floor(Math.random() * lockedStickers.length)];
             const newUnlocked = [...unlockedStickers, randomSticker.id];
             setUnlockedStickers(newUnlocked);
             localStorage.setItem('quiz_stickers', JSON.stringify(newUnlocked));
             setSessionReward(randomSticker);
             setMascot({ message: `Hore! Kamu dapat stiker baru: ${randomSticker.name}! 🌟`, mood: 'happy' });
          } else {
             setSessionReward(null);
             setMascot({ message: "Sempurna! Semua stiker sudah kamu kumpulkan! 🏆", mood: 'happy' });
          }
       } else {
          setSessionReward(null);
          if (lives <= 0) triggerMascot('gameover');
          else triggerMascot('result');
       }
    }
  }, [view]);

  // 8. Player Timer
  useEffect(() => {
    if (view === 'player' && isTimerActive && timer > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
        setStats((prev) => ({ ...prev, totalTime: prev.totalTime + 1 }));
      }, 1000);
    } else if (timer === 0 && isTimerActive && view === 'player') {
      handleTimeout();
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [isTimerActive, timer, view]);

  // 9. Memory Match Validation
  useEffect(() => {
    if (view === 'player' && currentQuiz && !showFeedback) {
       const question = currentQuiz.questions[currentQIndex];
       if (question?.type === 'memory' && matchedPairs > 0 && matchedPairs === question.pairs.length) {
          setIsTimerActive(false);
          clearInterval(timerIntervalRef.current);
          setShowFeedback(true);
          setSelectedAnswer('WIN_MEMORY'); 
          evaluateAnswer(true);
       }
    }
  }, [matchedPairs, view, currentQuiz, currentQIndex, showFeedback]);

  // --- ACTIONS ---

  const handleLogout = async () => {
      localStorage.removeItem('quiz_user_profile');
      setUserProfile(null);
      if (auth) {
          await signOut(auth);
          await signInAnonymously(auth); 
      }
      setView('login');
  };

  const shareQuiz = async (quiz) => {
    if (!db || !user) {
        alert("Sistem Cloud belum terhubung. Tunggu sebentar.");
        return;
    }
    try {
        const quizRef = doc(db, 'artifacts', appId, 'public', 'data', 'quizzes', quiz.id);
        await setDoc(quizRef, quiz);
        const link = `${window.location.origin}${window.location.pathname}#play=${quiz.id}`;
        setShareModal({ show: true, link: link, copied: false });
    } catch(e) { console.error("Gagal mempublikasikan kuis", e); }
  };

  const copyLink = () => {
    const input = document.createElement('input');
    input.value = shareModal.link;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    setShareModal(prev => ({ ...prev, copied: true }));
    setTimeout(() => setShareModal(prev => ({ ...prev, copied: false })), 2500);
  };

  const saveToLeaderboard = async (quizId, score, maxScore) => {
    if (!userProfile) return;
    const newEntry = {
      id: Date.now().toString(),
      name: userProfile.name, 
      avatar: userProfile.avatar,
      score: score,
      maxScore: maxScore,
      date: new Date().toLocaleDateString('id-ID')
    };

    if (isSharedMode && db && user) {
        try {
            const lbRef = doc(db, 'artifacts', appId, 'public', 'data', `lb_${quizId}`, newEntry.id);
            await setDoc(lbRef, newEntry);
            setIsScoreSaved(true);
        } catch(e) { console.error(e); }
    } else {
        const updatedLeaderboards = { ...leaderboards };
        if (!updatedLeaderboards[quizId]) updatedLeaderboards[quizId] = [];
        updatedLeaderboards[quizId].push(newEntry);
        updatedLeaderboards[quizId].sort((a, b) => b.score - a.score);
        setLeaderboards(updatedLeaderboards);
        localStorage.setItem('quiz_leaderboards', JSON.stringify(updatedLeaderboards));
        setIsScoreSaved(true);
    }
  };

  const saveQuizzesToStorage = (newQuizzes) => {
    setQuizzes(newQuizzes);
    localStorage.setItem('custom_quizzes', JSON.stringify(newQuizzes));
  };

  const evaluateAnswer = (isCorrect, answerType = 'normal') => {
    if (isCorrect) {
        const pts = currentQuiz.questions[currentQIndex].points || 10;
        setScore((prev) => prev + pts);
        setStats((prev) => ({ ...prev, correct: prev.correct + 1 }));
        playSound('correct');
        triggerMascot('happy'); 
        feedbackTimeoutRef.current = setTimeout(() => { moveToNextQuestion(); }, 2500);
    } else {
        const newLives = lives - 1;
        setLives(newLives);
        setStats((prev) => ({ ...prev, wrong: prev.wrong + 1 }));
        
        if (newLives <= 0) {
            playSound('timeout');
            triggerMascot('gameover');
            feedbackTimeoutRef.current = setTimeout(() => { setView('result'); }, 3500);
        } else {
            playSound('wrong');
            triggerMascot(answerType === 'timeout' ? 'timeout' : 'sad'); 
            const delay = (currentQuiz.questions[currentQIndex].type === 'sorting' || answerType === 'timeout') ? 4500 : 3000;
            feedbackTimeoutRef.current = setTimeout(() => { moveToNextQuestion(); }, delay);
        }
    }
  };

  const startGame = (quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQIndex(0);
    setScore(0);
    setLives(3); 
    setHintsLeft(3); 
    setHiddenOptions([]);
    setStats({ correct: 0, wrong: 0, totalTime: 0 });
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsScoreSaved(false); 
    setSessionReward(null);
    setView('player');
    triggerMascot('start'); 
    startQuestion(quiz.questions[0]);
  };

  const startQuestion = (question) => {
    setSelectedAnswer(null);
    setPuzzleInput('');
    setHiddenOptions([]); 
    setShowFeedback(false);
    clearTimeout(memorizeTimeoutRef.current);
    setIsMemorizing(false);

    if (question.type === 'sorting') {
      const shuffled = [...question.correctOrder].sort(() => Math.random() - 0.5);
      if (JSON.stringify(shuffled) === JSON.stringify(question.correctOrder) && shuffled.length > 1) {
        shuffled.reverse();
      }
      setSortingItems(shuffled);
      setTimer(question.timeLimit);
      setIsTimerActive(true);
      if (currentQIndex > 0) triggerMascot('start'); 
    } else if (question.type === 'memory') {
      const deck = [...question.pairs, ...question.pairs]
        .sort(() => Math.random() - 0.5)
        .map((content, idx) => ({ id: idx, content, isFlipped: true, isMatched: false }));
      setMemoryCards(deck);
      setFlippedCards([]);
      setMatchedPairs(0);
      setIsMemorizing(true);
      setTimer(question.timeLimit);
      setIsTimerActive(false); 
      triggerMascot('memorize'); 

      memorizeTimeoutRef.current = setTimeout(() => {
         setMemoryCards(prev => prev.map(card => ({ ...card, isFlipped: false })));
         setIsMemorizing(false);
         setIsTimerActive(true); 
         triggerMascot('start'); 
      }, 3500); 
    } else {
      setSortingItems([]);
      setTimer(question.timeLimit);
      setIsTimerActive(true);
      if (currentQIndex > 0) triggerMascot('start');
    }
  };

  const moveToNextQuestion = () => {
    if (lives <= 0) return;
    if (currentQIndex + 1 < currentQuiz.questions.length) {
      setCurrentQIndex((prev) => prev + 1);
      startQuestion(currentQuiz.questions[currentQIndex + 1]);
    } else {
      playSound('win');
      setView('result');
    }
  };

  const handleHint = () => {
    if (hintsLeft <= 0 || showFeedback || isMemorizing || hiddenOptions.length > 0) return;
    const currentQ = currentQuiz.questions[currentQIndex];

    if (currentQ.type === 'multiple-choice' || currentQ.type === 'image-choice') {
        const incorrectOptions = currentQ.options.filter(opt => opt !== currentQ.correctAnswer);
        const shuffled = incorrectOptions.sort(() => Math.random() - 0.5);
        setHiddenOptions([shuffled[0], shuffled[1]]); 
        setHintsLeft(prev => prev - 1);
        playSound('flip'); 
        setMascot({ message: "BipBop menghilangkan 2 jawaban yang salah! 💡", mood: "happy" });
    } else if (currentQ.type === 'puzzle') {
        setHintsLeft(prev => prev - 1);
        const firstTwo = currentQ.correctAnswer.substring(0, 2);
        setMascot({ message: `Jawaban diawali huruf: ${firstTwo.toUpperCase()}... 💡`, mood: "happy" });
    } else if (currentQ.type === 'sorting' || currentQ.type === 'memory') {
        setHintsLeft(prev => prev - 1);
        setTimer(prev => prev + 15);
        setMascot({ message: "Aku tambahkan waktu 15 detik! ⏳", mood: "happy" });
    }
  };

  const handleTimeout = () => {
    setIsTimerActive(false);
    setSelectedAnswer('TIMEOUT');
    setShowFeedback(true);
    clearInterval(timerIntervalRef.current);
    if (currentQuiz.questions[currentQIndex].type === 'memory') {
        setMemoryCards(prev => prev.map(card => ({ ...card, isFlipped: true })));
    }
    evaluateAnswer(false, 'timeout');
  };

  const handleAnswerSelect = (option) => {
    if (showFeedback || !isTimerActive) return;
    setIsTimerActive(false);
    setSelectedAnswer(option);
    setShowFeedback(true);
    clearInterval(timerIntervalRef.current);
    const isCorrect = option === currentQuiz.questions[currentQIndex].correctAnswer;
    evaluateAnswer(isCorrect);
  };

  const handlePuzzleSubmit = () => {
    if (showFeedback || !isTimerActive || !puzzleInput.trim()) return;
    setIsTimerActive(false);
    setSelectedAnswer(puzzleInput);
    setShowFeedback(true);
    clearInterval(timerIntervalRef.current);
    const isCorrect = puzzleInput.trim().toLowerCase() === currentQuiz.questions[currentQIndex].correctAnswer.trim().toLowerCase();
    evaluateAnswer(isCorrect);
  };

  const handleSortingSubmit = () => {
    if (showFeedback || !isTimerActive) return;
    setIsTimerActive(false);
    setSelectedAnswer('SUBMITTED');
    setShowFeedback(true);
    clearInterval(timerIntervalRef.current);
    const isCorrect = JSON.stringify(sortingItems) === JSON.stringify(currentQuiz.questions[currentQIndex].correctOrder);
    evaluateAnswer(isCorrect);
  };

  const handleMemoryCardClick = (index) => {
      if (showFeedback || !isTimerActive || isMemorizing) return;
      if (memoryCards[index].isFlipped || memoryCards[index].isMatched) return;
      if (flippedCards.length === 2) return; 

      playSound('flip');
      const newCards = [...memoryCards];
      newCards[index].isFlipped = true;
      setMemoryCards(newCards);
      const newFlipped = [...flippedCards, index];
      setFlippedCards(newFlipped);

      if (newFlipped.length === 2) {
          const [idx1, idx2] = newFlipped;
          if (newCards[idx1].content === newCards[idx2].content) {
              setTimeout(() => {
                  playSound('correct');
                  setMemoryCards(prev => {
                      const matchedDeck = [...prev];
                      matchedDeck[idx1].isMatched = true;
                      matchedDeck[idx2].isMatched = true;
                      return matchedDeck;
                  });
                  setFlippedCards([]);
                  setMatchedPairs(prev => prev + 1);
              }, 400); 
          } else {
              setTimeout(() => {
                  setMemoryCards(prev => {
                       const resetDeck = [...prev];
                       resetDeck[idx1].isFlipped = false;
                       resetDeck[idx2].isFlipped = false;
                       return resetDeck;
                  });
                  setFlippedCards([]);
              }, 1000); 
          }
      }
  };

  const moveItem = (index, direction) => {
    if (showFeedback) return;
    const newItems = [...sortingItems];
    if (direction === 'up' && index > 0) {
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    } else if (direction === 'down' && index < newItems.length - 1) {
      [newItems[index + 1], newItems[index]] = [newItems[index], newItems[index + 1]];
    }
    setSortingItems(newItems);
  };
  const handleDragStart = (e, index) => { if (showFeedback) return; dragItem.current = index; };
  const handleDragEnter = (e, index) => { if (showFeedback) return; dragOverItem.current = index; };
  const handleDragEnd = () => {
    if (showFeedback || dragItem.current === null || dragOverItem.current === null) return;
    const _sortingItems = [...sortingItems];
    const draggedItemContent = _sortingItems.splice(dragItem.current, 1)[0];
    _sortingItems.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setSortingItems(_sortingItems);
  };

  // --- CREATOR ACTIONS ---
  const handleDraftOptionChange = (index, value) => {
    const newOptions = [...draftQ.options];
    newOptions[index] = value;
    setDraftQ({ ...draftQ, options: newOptions });
  };

  const addQuestionToDraft = () => {
    setCreatorError('');
    if (!draftQ.questionText.trim()) return setCreatorError('Teks pertanyaan tidak boleh kosong.');
    if (draftQ.timeLimit < 5 || draftQ.timeLimit > 300) return setCreatorError('Batas waktu harus antara 5 hingga 300 detik.');
    if (draftQ.points < 1) return setCreatorError('Poin nilai minimal 1.');

    let newQuestion = { 
      id: `q_${Date.now()}`, type: draftQ.type, questionText: draftQ.questionText,
      timeLimit: draftQ.timeLimit, points: draftQ.points
    };

    if (draftQ.type === 'multiple-choice' || draftQ.type === 'image-choice') {
      if (draftQ.options.some(opt => !opt.trim())) return setCreatorError('Semua 4 pilihan jawaban harus diisi.');
      if (!draftQ.correctAnswer) return setCreatorError('Pilih salah satu jawaban yang benar.');
      if (!draftQ.options.includes(draftQ.correctAnswer)) return setCreatorError('Jawaban benar harus sama dengan salah satu pilihan.');
      newQuestion.options = draftQ.options; newQuestion.correctAnswer = draftQ.correctAnswer;
    } else if (draftQ.type === 'puzzle') {
      if (!draftQ.correctAnswer.trim()) return setCreatorError('Jawaban benar (kata target) untuk puzzle tidak boleh kosong.');
      newQuestion.correctAnswer = draftQ.correctAnswer; newQuestion.options = [];
    } else if (draftQ.type === 'sorting') {
      const items = draftQ.sortingText.split('\n').map(i => i.trim()).filter(i => i !== '');
      if (items.length < 2) return setCreatorError('Masukkan minimal 2 item untuk diurutkan (pisahkan dengan Enter).');
      newQuestion.correctOrder = items;
    } else if (draftQ.type === 'memory') {
      const items = draftQ.memoryText.split('\n').map(i => i.trim()).filter(i => i !== '');
      if (items.length < 2 || items.length > 12) return setCreatorError('Masukkan minimal 2 hingga 12 pasang item gambar (pisahkan dengan Enter).');
      newQuestion.pairs = items;
    }

    setDraftQuiz({ ...draftQuiz, questions: [...draftQuiz.questions, newQuestion] });
    setDraftQ({ type: draftQ.type, questionText: '', options: ['', '', '', ''], correctAnswer: '', sortingText: '', memoryText: '', timeLimit: 15, points: 10 });
  };

  const removeQuestionFromDraft = (id) => { setDraftQuiz({ ...draftQuiz, questions: draftQuiz.questions.filter(q => q.id !== id) }); };
  
  const editQuestionFromDraft = (q) => {
    setDraftQ(q);
    removeQuestionFromDraft(q.id);
  };

  const saveQuiz = () => {
    setCreatorError('');
    if (!draftQuiz.title.trim()) return setCreatorError('Judul kuis harus diisi.');
    if (draftQuiz.questions.length === 0) return setCreatorError('Tambahkan minimal 1 pertanyaan ke dalam kuis.');

    let updatedQuizzes;
    if (editingQuizId) {
        updatedQuizzes = quizzes.map(q => q.id === editingQuizId ? { ...draftQuiz, id: editingQuizId } : q);
    } else {
        const newQuiz = { ...draftQuiz, id: `quiz_${Date.now()}` };
        updatedQuizzes = [...quizzes, newQuiz];
    }

    saveQuizzesToStorage(updatedQuizzes);
    setView('lobby');
    setDraftQuiz({ title: '', description: '', questions: [] });
    setEditingQuizId(null);
  };

  const deleteQuiz = (id) => {
    saveQuizzesToStorage(quizzes.filter(q => q.id !== id));
    const updatedLeaderboards = { ...leaderboards };
    delete updatedLeaderboards[id];
    setLeaderboards(updatedLeaderboards);
    localStorage.setItem('quiz_leaderboards', JSON.stringify(updatedLeaderboards));
  };

  // LAYAR LOGIN & SIGN UP
  const LoginScreen = () => {
     const [isLoginMode, setIsLoginMode] = useState(true);
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [tempName, setTempName] = useState('');
     const [tempAvatar, setTempAvatar] = useState('🐶');
     const [loading, setLoading] = useState(false);
     const [errorMsg, setErrorMsg] = useState('');

     const handleAuthSubmit = async (e) => {
         e.preventDefault();
         setErrorMsg('');
         setLoading(true);

         if (!auth) {
             setErrorMsg("Sistem error: Cloud Database tidak aktif.");
             setLoading(false);
             return;
         }

         try {
             let currentProfile = null;
             
             if (isLoginMode) {
                 const userCred = await signInWithEmailAndPassword(auth, email, password);
                 if (db) {
                     const profileRef = doc(db, 'artifacts', appId, 'users', userCred.user.uid, 'profiles', 'info');
                     const snap = await getDoc(profileRef);
                     if (snap.exists()) {
                         currentProfile = snap.data();
                     }
                 }
                 if (!currentProfile) {
                     currentProfile = { name: email.split('@')[0], avatar: '🐶' };
                 }
             } else {
                 if (!tempName.trim()) throw new Error("Nama panggilan tidak boleh kosong!");
                 if (password.length < 6) throw new Error("Password minimal 6 karakter!");
                 
                 const userCred = await createUserWithEmailAndPassword(auth, email, password);
                 currentProfile = { name: tempName.trim(), avatar: tempAvatar, email: email };
                 
                 if (db) {
                     const profileRef = doc(db, 'artifacts', appId, 'users', userCred.user.uid, 'profiles', 'info');
                     await setDoc(profileRef, currentProfile);
                 }
             }

             setUserProfile(currentProfile);
             localStorage.setItem('quiz_user_profile', JSON.stringify(currentProfile));

             if (currentQuiz && window.location.hash.startsWith('#play=')) {
                 startGame(currentQuiz);
             } else {
                 setView('lobby');
             }
         } catch (err) {
             let msg = err.message;
             if (msg.includes('auth/invalid-credential') || msg.includes('auth/user-not-found') || msg.includes('auth/wrong-password')) {
                 msg = "Email atau password salah.";
             } else if (msg.includes('auth/email-already-in-use')) {
                 msg = "Email ini sudah terdaftar. Silakan pindah ke menu 'Masuk'.";
             } else if (msg.includes('auth/invalid-email')) {
                 msg = "Format email tidak valid.";
             } else {
                 msg = msg.replace("Firebase:", "").trim();
             }
             setErrorMsg(msg);
         }
         setLoading(false);
     };

     return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-fade-in">
           <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 md:p-10 w-full max-w-md relative overflow-hidden">
               <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10"></div>
               
               <Award size={54} className="text-indigo-600 mx-auto mb-4" />
               <h1 className="text-3xl font-extrabold text-slate-800 text-center tracking-tight mb-6">KuisKita</h1>

               <div className="flex bg-slate-100 p-1.5 rounded-xl mb-6 shadow-inner">
                   <button 
                       type="button" 
                       onClick={() => { setIsLoginMode(true); setErrorMsg(''); }} 
                       className={`flex-1 py-2 font-bold rounded-lg transition-all ${isLoginMode ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                   >
                       Masuk
                   </button>
                   <button 
                       type="button" 
                       onClick={() => { setIsLoginMode(false); setErrorMsg(''); }} 
                       className={`flex-1 py-2 font-bold rounded-lg transition-all ${!isLoginMode ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                   >
                       Daftar Baru
                   </button>
               </div>

               {errorMsg && (
                 <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r-lg">
                   {errorMsg}
                 </div>
               )}

               <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {!isLoginMode && (
                      <>
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Pilih Avatar:</label>
                            <div className="grid grid-cols-5 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                               {AVATAR_LIST.map(ava => (
                                  <button 
                                     key={ava} type="button" onClick={() => setTempAvatar(ava)}
                                     className={`text-2xl aspect-square rounded-xl transition-all flex items-center justify-center ${tempAvatar === ava ? 'bg-indigo-100 border-2 border-indigo-400 scale-110 shadow-sm' : 'hover:bg-slate-200 border-2 border-transparent grayscale-[0.3]'}`}
                                  >
                                     {ava}
                                  </button>
                               ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Nama Panggilan</label>
                            <div className="relative">
                               <User size={18} className="absolute left-3 top-3 text-slate-400"/>
                               <input 
                                  type="text" required value={tempName} onChange={(e) => setTempName(e.target.value)} 
                                  placeholder="Nama kamu..."
                                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                               />
                            </div>
                        </div>
                      </>
                  )}

                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                      <div className="relative">
                         <Mail size={18} className="absolute left-3 top-3 text-slate-400"/>
                         <input 
                            type="email" required value={email} onChange={(e) => setEmail(e.target.value)} 
                            placeholder="alamat@email.com"
                            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                         />
                      </div>
                  </div>

                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                      <div className="relative">
                         <Lock size={18} className="absolute left-3 top-3 text-slate-400"/>
                         <input 
                            type="password" required value={password} onChange={(e) => setPassword(e.target.value)} 
                            placeholder={isLoginMode ? "Masukkan password..." : "Minimal 6 karakter..."}
                            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                         />
                      </div>
                  </div>

                  <button 
                     type="submit" disabled={loading}
                     className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-bold py-3.5 rounded-xl text-lg shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 active:scale-95 flex justify-center items-center gap-2"
                  >
                     {loading && <Loader2 size={18} className="animate-spin" />}
                     {isLoginMode ? 'Masuk' : 'Buat Akun'}
                  </button>
               </form>
           </div>
        </div>
     );
  };

  // LAYAR GUEST JOIN (MASUKKAN NAMA SEBELUM MAIN KUIS DARI LINK)
  const GuestJoinScreen = () => {
     const [tempName, setTempName] = useState('');
     const [tempAvatar, setTempAvatar] = useState('🚀');

     const handleJoin = (e) => {
         e.preventDefault();
         if (!tempName.trim()) return;
         
         // Simpan profil tamu
         const profile = { name: tempName.trim(), avatar: tempAvatar };
         setUserProfile(profile);
         localStorage.setItem('quiz_user_profile', JSON.stringify(profile));
         
         // Mulai permainan menggunakan kuis yang di-share
         startGame(currentQuiz);
     };

     return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 animate-fade-in">
           <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 md:p-10 w-full max-w-md relative overflow-hidden">
               <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-50 rounded-full blur-3xl opacity-50 -z-10"></div>
               
               <div className="text-center mb-6">
                 <User size={54} className="text-amber-500 mx-auto mb-4" />
                 <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Siapa Namamu?</h2>
                 <p className="text-slate-500 text-sm mt-2">Masukkan namamu agar bisa tampil di Papan Skor!</p>
               </div>

               <form onSubmit={handleJoin} className="space-y-5">
                   <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">Pilih Avatar Kerenmu:</label>
                       <div className="grid grid-cols-5 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                           {AVATAR_LIST.map(ava => (
                               <button 
                                   key={ava} type="button" onClick={() => setTempAvatar(ava)}
                                   className={`text-2xl aspect-square rounded-xl transition-all flex items-center justify-center ${tempAvatar === ava ? 'bg-amber-100 border-2 border-amber-400 scale-110 shadow-sm' : 'hover:bg-slate-200 border-2 border-transparent grayscale-[0.3]'}`}
                               >
                                   {ava}
                               </button>
                           ))}
                       </div>
                   </div>
                   
                   <div>
                       <label className="block text-sm font-bold text-slate-700 mb-1">Nama Pemain</label>
                       <div className="relative">
                           <User size={18} className="absolute left-3 top-3 text-slate-400"/>
                           <input 
                               type="text" required value={tempName} onChange={(e) => setTempName(e.target.value)} 
                               placeholder="Ketik namamu di sini..." maxLength={15}
                               className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 font-medium text-slate-700 focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
                           />
                       </div>
                   </div>

                   <button 
                       type="submit" disabled={!tempName.trim()}
                       className="w-full mt-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-slate-900 font-bold py-3.5 rounded-xl text-lg shadow-lg shadow-amber-200 transition-all transform hover:-translate-y-0.5 active:scale-95 flex justify-center items-center gap-2"
                   >
                       Mulai Bermain <Play size={18} className="fill-slate-900" />
                   </button>
               </form>
           </div>
        </div>
     );
  };

  const renderLobby = () => (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">KuisKita</h1>
          <p className="text-slate-500 mt-2 text-lg">Pilih kuis untuk dimainkan atau buat tantanganmu sendiri.</p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center md:justify-end">
          <button onClick={() => setView('stickers')} className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-pink-200 transition-all flex items-center gap-2 transform hover:scale-105 active:scale-95">
            <Sparkles size={20} /> Koleksi Stiker
          </button>
          <button onClick={() => setView('leaderboard')} className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-5 py-3 rounded-xl font-semibold shadow-lg shadow-amber-200 transition-all flex items-center gap-2 transform hover:scale-105 active:scale-95">
            <Trophy size={20} /> Papan Skor
          </button>
          <button onClick={() => { setView('creator'); setCreatorError(''); setDraftQuiz({ title: '', description: '', questions: [] }); setEditingQuizId(null); }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 transform hover:scale-105 active:scale-95">
            <Plus size={20} /> Buat Kuis
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group relative">
            <div className="p-6 flex-grow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full">
                    {quiz.questions.length} Pertanyaan
                  </span>
                  {leaderboards[quiz.id] && leaderboards[quiz.id].length > 0 && (
                    <span className="bg-amber-50 text-amber-600 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Trophy size={12}/> {leaderboards[quiz.id].length} Pemain
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {db && user && (
                     <button onClick={() => shareQuiz(quiz)} className="text-slate-300 hover:text-indigo-500 transition-colors p-1" title="Bagikan Kuis">
                       <Share2 size={18} />
                     </button>
                  )}
                  {quiz.id !== "quiz_1716654800" && (
                     <>
                       <button onClick={() => { setDraftQuiz(quiz); setEditingQuizId(quiz.id); setView('creator'); setCreatorError(''); }} className="text-slate-300 hover:text-amber-500 transition-colors p-1" title="Edit Kuis">
                         <Pencil size={18} />
                       </button>
                       <button onClick={() => deleteQuiz(quiz.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1" title="Hapus Kuis">
                         <Trash2 size={18} />
                       </button>
                     </>
                  )}
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{quiz.title}</h3>
              <p className="text-slate-500 text-sm line-clamp-3">{quiz.description}</p>
            </div>
            <div className="px-6 py-4 border-t border-slate-50 bg-slate-50">
              <button onClick={() => startGame(quiz)} className="w-full bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-medium transition-colors flex justify-center items-center gap-2">
                <Play size={18} /> Mainkan Sekarang
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* MODAL BAGIKAN KUIS */}
      {shareModal.show && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[100] p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative border-4 border-indigo-50">
                <button onClick={() => setShareModal({show: false, link: '', copied: false})} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"><XCircle size={24}/></button>
                <div className="flex justify-center mb-4 text-indigo-500"><Share2 size={48} /></div>
                <h3 className="text-2xl font-bold mb-2 text-slate-800 text-center">Kuis Siap Dibagikan! 🚀</h3>
                <p className="text-slate-500 mb-6 text-sm text-center">Berikan link di bawah ini ke teman-temanmu. Mereka akan langsung masuk ke permainan ini tanpa melihat daftar kuis milikmu.</p>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border-2 border-indigo-100">
                        <input type="text" readOnly value={shareModal.link} className="bg-transparent flex-1 outline-none text-slate-600 text-sm font-medium overflow-hidden whitespace-nowrap" />
                    </div>
                    <button onClick={copyLink} className="w-full bg-indigo-600 text-white px-4 py-3 rounded-xl text-lg font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2">
                        {shareModal.copied ? <CheckCircle2 size={20} className="animate-bounce-short"/> : <Copy size={20}/>}
                        {shareModal.copied ? 'Berhasil Disalin!' : 'Salin Link'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );

  const renderLeaderboard = () => {
    const quizzesWithScores = quizzes.filter(q => leaderboards[q.id] && leaderboards[q.id].length > 0);
    return (
      <div className="max-w-4xl mx-auto animate-fade-in pb-20">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setView('lobby')} className="p-2 bg-white text-slate-500 hover:text-slate-800 rounded-full shadow-sm hover:shadow transition-all">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Trophy className="text-amber-500" size={32}/> Papan Skor Global
          </h2>
        </div>

        {quizzesWithScores.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-slate-100">
            <Trophy size={64} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-xl font-bold text-slate-700">Belum Ada Skor Tersimpan</h3>
            <p className="text-slate-500 mt-2">Mainkan kuis dan simpan skormu untuk melihatnya di sini.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {quizzesWithScores.map(quiz => (
              <div key={quiz.id} className="bg-slate-800 text-white rounded-3xl shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none"><Trophy size={100}/></div>
                <div className="bg-slate-900/80 px-6 py-5 flex justify-between items-center border-b border-slate-700">
                  <h3 className="text-xl font-bold truncate pr-4 text-amber-400">{quiz.title}</h3>
                  <span className="text-slate-400 text-sm font-semibold shrink-0">{leaderboards[quiz.id].length} Pemain</span>
                </div>
                <div className="p-6 grid gap-3 relative z-10">
                  {leaderboards[quiz.id].slice(0, 10).map((entry, idx) => (
                    <div key={entry.id} className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 p-4 rounded-xl flex items-center gap-4 transition-colors">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 text-lg shadow-inner ${idx === 0 ? 'bg-amber-400 text-amber-900 shadow-amber-200' : idx === 1 ? 'bg-slate-300 text-slate-800 shadow-slate-100' : idx === 2 ? 'bg-amber-700 text-white shadow-amber-800/50' : 'bg-slate-800 text-slate-400 border border-slate-600'}`}>
                        {idx + 1}
                      </div>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-3xl drop-shadow-sm">{entry.avatar || '🐶'}</span>
                        <div>
                           <div className="font-bold text-white text-lg truncate">{entry.name}</div>
                           <div className="text-xs text-slate-400 font-medium">{entry.date}</div>
                        </div>
                      </div>
                      <div className="text-right bg-slate-900/50 px-4 py-2 rounded-lg">
                        <div className="font-black text-amber-400 text-xl leading-tight">{entry.score}</div>
                        <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">/ {entry.maxScore} PTS</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderStickers = () => (
    <div className="max-w-5xl mx-auto animate-fade-in pb-20">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setView('lobby')} className="p-2 bg-white text-slate-500 hover:text-slate-800 rounded-full shadow-sm hover:shadow transition-all">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <Sparkles className="text-pink-500" size={32}/> Koleksi Stikerku
        </h2>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50 rounded-full blur-3xl opacity-50 -z-10"></div>
        <p className="text-slate-500 mb-8 text-lg">
          Kumpulkan semua stiker dengan cara mendapatkan <span className="font-bold text-yellow-500">3 Bintang (Skor di atas 90%)</span> pada kuis apapun!
          <br/>Kamu telah mengumpulkan <strong>{unlockedStickers.length} dari {STICKER_COLLECTION.length}</strong> stiker.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {STICKER_COLLECTION.map(sticker => {
            const isUnlocked = unlockedStickers.includes(sticker.id);
            return (
              <div key={sticker.id} className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-300 ${isUnlocked ? 'bg-pink-50 border-pink-200 shadow-sm hover:-translate-y-1 hover:shadow-md cursor-pointer' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                <div className={`text-6xl md:text-7xl mb-3 ${isUnlocked ? 'drop-shadow-md' : 'grayscale contrast-0 opacity-20 blur-[2px]'}`}>{sticker.emoji}</div>
                <div className={`text-sm md:text-base font-bold ${isUnlocked ? 'text-pink-600' : 'text-slate-400'}`}>{isUnlocked ? sticker.name : '???'}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );

  const renderCreator = () => (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => { setView('lobby'); setEditingQuizId(null); }} className="p-2 bg-white text-slate-500 hover:text-slate-800 rounded-full shadow-sm hover:shadow transition-all">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-3xl font-bold text-slate-800">{editingQuizId ? 'Edit Kuis' : 'Buat Kuis Baru'}</h2>
        </div>
        
        {apiKey && (
          <button 
            onClick={() => setShowAIModal(true)} 
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-fuchsia-200 transition-all flex items-center gap-2 transform hover:scale-105 active:scale-95"
          >
            <Sparkles size={18} className="animate-pulse" /> Buat Kuis dengan AI
          </button>
        )}
      </div>

      {creatorError && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3 rounded-r-lg">
          <AlertCircle size={20} />
          <p>{creatorError}</p>
        </div>
      )}

      {showAIModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[100] p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative border-4 border-fuchsia-100 overflow-hidden">
                <button onClick={() => !isGeneratingAI && setShowAIModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"><XCircle size={24}/></button>
                <div className="flex justify-center mb-4 text-fuchsia-500"><Wand2 size={48} className={isGeneratingAI ? 'animate-bounce' : ''} /></div>
                <h3 className="text-2xl font-bold mb-2 text-slate-800 text-center">Keajaiban BipBop AI ✨</h3>
                <p className="text-slate-500 mb-6 text-sm text-center">Masukkan topik kuis yang ingin kamu buat (misal: "Hewan Mamalia" atau "Tata Surya"). BipBop akan membuatkan pertanyaannya otomatis!</p>
                <div className="flex flex-col gap-3">
                    <input 
                      type="text" value={aiTopic} onChange={(e) => setAITopic(e.target.value)} disabled={isGeneratingAI}
                      placeholder="Topik kuis, contoh: Matematika Dasar"
                      className="bg-slate-50 w-full p-3 rounded-xl border-2 border-indigo-100 outline-none text-slate-700 focus:border-fuchsia-400 font-medium" 
                    />
                    <button 
                      onClick={generateQuizWithAI} disabled={isGeneratingAI || !aiTopic.trim()}
                      className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-4 py-3 rounded-xl text-lg font-bold shadow-lg shadow-fuchsia-200 hover:opacity-90 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isGeneratingAI ? <><Loader2 size={20} className="animate-spin" /> Meracik Kuis...</> : 'Buat Sekarang!'}
                    </button>
                </div>
            </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Informasi Dasar Kuis</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Judul Kuis</label>
            <input type="text" value={draftQuiz.title} onChange={(e) => setDraftQuiz({...draftQuiz, title: e.target.value})} className="w-full border-slate-200 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="Contoh: Kuis Sejarah Dunia"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Singkat</label>
            <textarea value={draftQuiz.description} onChange={(e) => setDraftQuiz({...draftQuiz, description: e.target.value})} className="w-full border-slate-200 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="Jelaskan apa yang akan diuji di kuis ini..." rows={3}/>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Tambah Pertanyaan Baru</h3>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tipe Pertanyaan</label>
            <div className="flex flex-wrap gap-3 md:gap-4">
              <label className="flex items-center gap-2 cursor-pointer group bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg hover:border-indigo-300">
                <input type="radio" checked={draftQ.type === 'multiple-choice'} onChange={() => setDraftQ({...draftQ, type: 'multiple-choice', correctAnswer: ''})} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"/>
                <span className="text-slate-700 font-medium text-sm md:text-base">Pilihan Ganda</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg hover:border-indigo-300">
                <input type="radio" checked={draftQ.type === 'image-choice'} onChange={() => setDraftQ({...draftQ, type: 'image-choice', correctAnswer: ''})} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"/>
                <span className="text-slate-700 font-medium text-sm md:text-base flex items-center gap-1"><ImageIcon size={16}/> Pilihan Bergambar</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg hover:border-indigo-300">
                <input type="radio" checked={draftQ.type === 'puzzle'} onChange={() => setDraftQ({...draftQ, type: 'puzzle', correctAnswer: ''})} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"/>
                <span className="text-slate-700 font-medium text-sm md:text-base">Puzzle Kata</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg hover:border-indigo-300">
                <input type="radio" checked={draftQ.type === 'sorting'} onChange={() => setDraftQ({...draftQ, type: 'sorting', correctAnswer: ''})} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"/>
                <span className="text-slate-700 font-medium text-sm md:text-base">Susunan (Urutan)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg hover:border-indigo-300">
                <input type="radio" checked={draftQ.type === 'memory'} onChange={() => setDraftQ({...draftQ, type: 'memory', correctAnswer: ''})} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"/>
                <span className="text-slate-700 font-medium text-sm md:text-base">Cocokkan Kartu</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Teks Pertanyaan / Instruksi</label>
            <textarea value={draftQ.questionText} onChange={(e) => setDraftQ({...draftQ, questionText: e.target.value})} className="w-full border-slate-200 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50 focus:bg-white" placeholder="Tulis pertanyaanmu di sini..." rows={2}/>
          </div>

          {(draftQ.type === 'multiple-choice' || draftQ.type === 'image-choice') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {draftQ.options.map((opt, i) => (
                <div key={i} className="relative">
                  <label className="block text-xs font-medium text-slate-500 mb-1 ml-1 flex justify-between items-center">
                    Pilihan {String.fromCharCode(65 + i)}
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input 
                        type="text" value={opt} onChange={(e) => handleDraftOptionChange(i, e.target.value)} 
                        className="w-full border-slate-200 border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder={draftQ.type === 'image-choice' ? "Masukkan URL Gambar (http...)" : `Teks Pilihan ${String.fromCharCode(65 + i)}`}
                      />
                      <div className="absolute left-3 top-3.5 font-bold text-slate-300">{String.fromCharCode(65 + i)}</div>
                    </div>
                    {draftQ.type === 'image-choice' && opt.startsWith('http') && (
                      <div className="w-12 h-12 shrink-0 border border-slate-200 rounded-xl overflow-hidden bg-slate-100">
                        <img src={opt} alt="preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {draftQ.type === 'sorting' && (
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Daftar Urutan Benar (Satu Baris = Satu Item)</label>
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-700 text-sm mb-2 flex gap-2">
                   <ListOrdered size={18} className="shrink-0"/> Tuliskan urutan yang benar dari atas ke bawah.
                </div>
                <textarea value={draftQ.sortingText} onChange={(e) => setDraftQ({...draftQ, sortingText: e.target.value})} className="w-full border-slate-200 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" rows={5}/>
             </div>
          )}

          {draftQ.type === 'memory' && (
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pasangan Gambar / Teks (Satu Baris = Satu Pasang)</label>
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-700 text-sm mb-2 flex gap-2">
                   <LayoutGrid size={18} className="shrink-0"/> Gunakan emoji (Win + titik) agar menarik!
                </div>
                <textarea value={draftQ.memoryText} onChange={(e) => setDraftQ({...draftQ, memoryText: e.target.value})} className="w-full border-slate-200 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" rows={5}/>
             </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 items-end pt-2">
            <div className="flex-1 w-full">
              {(draftQ.type === 'multiple-choice' || draftQ.type === 'image-choice') ? (
                <>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Jawaban Benar</label>
                  <select value={draftQ.correctAnswer} onChange={(e) => setDraftQ({...draftQ, correctAnswer: e.target.value})} className="w-full border-slate-200 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-emerald-50 text-emerald-800 font-medium">
                    <option value="">-- Pilih Jawaban Benar --</option>
                    {draftQ.options.map((opt, i) => opt.trim() && <option key={i} value={opt}>Pilihan {String.fromCharCode(65 + i)} {draftQ.type === 'image-choice' ? '(Gambar)' : `- ${opt}`}</option>)}
                  </select>
                </>
              ) : draftQ.type === 'puzzle' ? (
                <>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Jawaban Benar (Kata Target)</label>
                  <input type="text" value={draftQ.correctAnswer} onChange={(e) => setDraftQ({...draftQ, correctAnswer: e.target.value})} className="w-full border-slate-200 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-emerald-50 text-emerald-800 font-medium" placeholder="Ketik kata jawaban..."/>
                </>
              ) : (
                <div className="text-sm font-medium text-slate-500 mb-2 invisible md:visible text-right w-full">Selesai mengatur konten di atas? Atur poin & waktu!</div>
              )}
            </div>
            
            <div className="w-full md:w-32">
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1"><Clock size={14}/> Waktu</label>
              <input type="number" min="5" max="300" value={draftQ.timeLimit} onChange={(e) => setDraftQ({...draftQ, timeLimit: parseInt(e.target.value) || 15})} className="w-full border-slate-200 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-center"/>
            </div>

            <div className="w-full md:w-32">
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1"><Award size={14}/> Poin Nilai</label>
              <input type="number" min="1" max="1000" value={draftQ.points} onChange={(e) => setDraftQ({...draftQ, points: parseInt(e.target.value) || 10})} className="w-full border-slate-200 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-center font-bold text-amber-700 bg-amber-50"/>
            </div>

            <button onClick={addQuestionToDraft} className="w-full md:w-auto bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap">
              Tambah ke Daftar
            </button>
          </div>
        </div>
      </div>

      {draftQuiz.questions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-lg font-semibold text-slate-800">Daftar Pertanyaan ({draftQuiz.questions.length})</h3>
          </div>
          <div className="space-y-4">
            {draftQuiz.questions.map((q, idx) => (
              <div key={q.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-start gap-4 hover:border-indigo-200 transition-colors">
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded">Soal {idx + 1}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${q.type === 'puzzle' ? 'bg-amber-100 text-amber-700' : q.type === 'sorting' ? 'bg-purple-100 text-purple-700' : q.type === 'memory' ? 'bg-emerald-100 text-emerald-700' : q.type === 'image-choice' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                      {q.type === 'puzzle' ? 'Puzzle Kata' : q.type === 'sorting' ? 'Urutan' : q.type === 'memory' ? 'Cocokkan Kartu' : q.type === 'image-choice' ? 'Pilihan Bergambar' : 'Pilihan Ganda'}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1"><Clock size={12}/> {q.timeLimit}s</span>
                  </div>
                  <p className="font-medium text-slate-800 mb-2">{q.questionText}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                   <button onClick={() => editQuestionFromDraft(q)} className="text-slate-400 hover:text-amber-500 hover:bg-amber-50 p-2 rounded-lg transition-colors" title="Edit Pertanyaan"><Pencil size={18}/></button>
                   <button onClick={() => removeQuestionFromDraft(q.id)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Hapus"><Trash2 size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button onClick={saveQuiz} disabled={draftQuiz.questions.length === 0} className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${draftQuiz.questions.length > 0 ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 transform hover:-translate-y-1' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
          <Save size={24} /> {editingQuizId ? 'Simpan Perubahan Kuis' : 'Simpan Kuis Final'}
        </button>
      </div>
    </div>
  );

  const renderPlayer = () => {
    const question = currentQuiz?.questions[currentQIndex];
    if (!question) return null;
    const progress = ((currentQIndex) / currentQuiz.questions.length) * 100;
    const timePercentage = (timer / question.timeLimit) * 100;
    let timerColor = "bg-emerald-500";
    if (timePercentage <= 50 && timePercentage > 25) timerColor = "bg-yellow-400";
    if (timePercentage <= 25) timerColor = "bg-red-500";

    const isHintDisabled = hintsLeft <= 0 || showFeedback || isMemorizing || ((question.type === 'multiple-choice' || question.type === 'image-choice') && hiddenOptions.length > 0);

    return (
      <div className="max-w-3xl mx-auto mt-4 md:mt-10 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <button onClick={() => { 
                clearInterval(timerIntervalRef.current); 
                if(isSharedMode) window.location.href = window.location.pathname; 
                else setView('lobby'); 
             }} className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition-colors bg-white px-3 py-1.5 rounded-lg shadow-sm hover:bg-slate-100">
               <XCircle size={18} /> <span className="hidden sm:inline">Keluar</span>
             </button>
             <div className="flex items-center bg-white px-2 py-1.5 md:px-3 rounded-lg shadow-sm border border-slate-100" title={`Sisa Nyawa: ${lives}`}>
                 {[...Array(3)].map((_, i) => (
                    <Heart key={i} size={18} className={`mx-0.5 transition-all duration-300 ${i < lives ? "text-red-500 fill-red-500 transform scale-110" : "text-slate-200 fill-slate-200"}`} />
                 ))}
             </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
             <button onClick={handleHint} disabled={isHintDisabled} className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold px-3 md:px-4 py-1.5 rounded-full shadow-sm flex items-center gap-1 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                <Lightbulb size={16} className={hintsLeft > 0 ? "fill-yellow-900" : ""} />
                <span className="hidden sm:inline">{hintsLeft} Bantuan</span>
                <span className="sm:hidden">{hintsLeft}</span>
             </button>
             <div className="bg-indigo-600 text-white font-bold px-4 py-1.5 rounded-full shadow-sm flex items-center gap-2">
               <Award size={16}/> {score} <span className="hidden md:inline">Pts</span>
             </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm font-semibold text-slate-500 mb-2">
            <span className="flex items-center gap-2">Soal {currentQIndex + 1} dari {currentQuiz.questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden shadow-inner">
            <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden relative border-t border-slate-50">
          <div className="w-full bg-slate-100 h-2">
            <div className={`h-2 transition-all duration-1000 ease-linear ${timerColor}`} style={{ width: `${timePercentage}%` }}></div>
          </div>
          <div className="p-6 md:p-10">
            <div className="flex justify-between items-start mb-6 gap-2">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-tight">
                {question.questionText}
              </h2>
              <div className={`flex items-center gap-2 font-mono text-2xl font-bold px-3 py-1.5 rounded-xl shrink-0 ${timePercentage <= 25 ? 'bg-red-100 text-red-600 animate-pulse border border-red-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                <Clock size={20} className={timePercentage <= 25 ? 'text-red-500' : 'text-slate-400'} /> {timer}
              </div>
            </div>

            {question.type === 'memory' ? (
               <div className="mt-8 bg-slate-50 p-6 rounded-2xl border border-slate-100 relative">
                  <div className="text-sm text-slate-500 mb-6 flex items-center justify-center gap-2 font-medium">
                     <LayoutGrid size={16}/> 
                     {isMemorizing ? (
                        <span className="text-indigo-600 font-bold animate-pulse">👀 Hafalkan posisi kartu! Permainan segera dimulai...</span>
                     ) : (
                        <span>Balikkan kartu untuk mencari gambar yang sama! ({matchedPairs}/{question.pairs.length} Cocok)</span>
                     )}
                  </div>
                  <div className={`grid gap-3 md:gap-4 ${memoryCards.length > 8 ? 'grid-cols-4 sm:grid-cols-5 md:grid-cols-6' : 'grid-cols-3 sm:grid-cols-4'}`}>
                     {memoryCards.map((card, idx) => {
                         const contentStr = String(card.content);
                         const spaceIndex = contentStr.indexOf(' ');
                         let icon = contentStr;
                         let text = '';
                         if (spaceIndex !== -1 && spaceIndex < 4) { 
                            icon = contentStr.substring(0, spaceIndex);
                            text = contentStr.substring(spaceIndex + 1);
                         }

                         return (
                           <div key={idx} onClick={() => handleMemoryCardClick(idx)} className="relative w-full aspect-[3/4] md:aspect-square perspective-1000 cursor-pointer group">
                              <div className={`w-full h-full transition-transform duration-500 transform-style-3d shadow-sm group-hover:shadow-md rounded-xl ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}`}>
                                  <div className="absolute w-full h-full backface-hidden bg-slate-500 rounded-xl border-4 border-slate-600 flex items-center justify-center">
                                      <div className="w-12 h-12 rounded-full border-4 border-slate-400 opacity-20"></div>
                                  </div>
                                  <div className={`absolute w-full h-full backface-hidden rounded-xl border-4 flex flex-col justify-center items-center text-center p-1 md:p-2 rotate-y-180 ${card.isMatched ? 'bg-emerald-500 border-emerald-600' : 'bg-white border-indigo-200'}`}>
                                      <span className="text-3xl md:text-4xl drop-shadow-sm">{icon}</span>
                                      {text && <span className={`text-[10px] md:text-sm font-extrabold mt-1 md:mt-2 leading-tight ${card.isMatched ? 'text-white' : 'text-slate-700'}`}>{text}</span>}
                                  </div>
                              </div>
                           </div>
                         );
                     })}
                  </div>
                  {showFeedback && selectedAnswer === 'WIN_MEMORY' && (
                     <div className="mt-6 p-4 rounded-xl text-center font-bold text-lg flex flex-col items-center gap-2 animate-fade-in bg-emerald-500 text-white shadow-lg shadow-emerald-200">
                        <CheckCircle2 size={36} className="animate-bounce-short"/> Semua Kartu Cocok! (+{question.points || 10} Poin)
                     </div>
                  )}
               </div>
            ) : question.type === 'puzzle' ? (
              <div className="mt-8 bg-slate-50 p-6 rounded-2xl border border-slate-100 relative">
                <input 
                  type="text" value={puzzleInput} onChange={(e) => setPuzzleInput(e.target.value)}
                  disabled={showFeedback || !isTimerActive}
                  placeholder="Ketik jawabanmu di sini lalu Enter..."
                  onKeyDown={(e) => e.key === 'Enter' && handlePuzzleSubmit()}
                  className={`w-full text-center text-xl md:text-2xl font-bold p-4 md:p-6 rounded-xl border-2 focus:outline-none transition-all ${
                    showFeedback ? (puzzleInput.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase() ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-red-50 border-red-500 text-red-700') : 'bg-white border-slate-300 focus:border-indigo-500 text-slate-800 shadow-inner'
                  }`}
                />
                {!showFeedback && (
                  <button onClick={handlePuzzleSubmit} disabled={!puzzleInput.trim() || !isTimerActive} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-lg font-bold py-4 rounded-xl transition-all shadow-md active:scale-[0.98]">
                    Kirim Jawaban
                  </button>
                )}
                {showFeedback && (
                  <div className={`mt-4 p-4 rounded-xl text-center font-bold text-lg flex flex-col items-center gap-2 animate-fade-in ${puzzleInput.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase() ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                    {puzzleInput.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase() ? (
                      <><CheckCircle2 size={36} className="animate-bounce-short"/> +{question.points || 10} Poin!</>
                    ) : (
                      <><XCircle size={36} /><div><p className="text-sm opacity-90 mb-1">Jawaban benar:</p><p className="text-2xl tracking-wider">{question.correctAnswer}</p></div></>
                    )}
                  </div>
                )}
              </div>
            ) : question.type === 'sorting' ? (
              <div className="mt-8 bg-slate-50 p-6 rounded-2xl border border-slate-100 relative">
                <div className="text-sm text-slate-500 mb-4 flex items-center justify-center gap-2 font-medium">
                  <ArrowUp size={16}/><ArrowDown size={16}/> Tekan panah atau geser item ke urutan yang benar.
                </div>
                <div className="space-y-3">
                  {sortingItems.map((item, index) => (
                    <div 
                      key={index} draggable={!showFeedback}
                      onDragStart={(e) => handleDragStart(e, index)} onDragEnter={(e) => handleDragEnter(e, index)} onDragEnd={handleDragEnd} onDragOver={(e) => e.preventDefault()}
                      className={`flex items-center gap-3 bg-white p-3 md:p-4 rounded-xl border-2 transition-all ${showFeedback ? 'border-slate-200 opacity-60' : 'border-indigo-100 hover:border-indigo-300 cursor-grab shadow-sm'}`}
                    >
                       <div className="flex flex-col gap-1 shrink-0">
                         <button onClick={() => moveItem(index, 'up')} disabled={index === 0 || showFeedback} className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-30"><ArrowUp size={18}/></button>
                         <button onClick={() => moveItem(index, 'down')} disabled={index === sortingItems.length - 1 || showFeedback} className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-30"><ArrowDown size={18}/></button>
                       </div>
                       <div className="font-bold text-slate-700 text-sm md:text-lg flex-1 pl-2 border-l-2 border-slate-100">{item}</div>
                       <GripVertical className="text-slate-300 shrink-0 hidden md:block" />
                    </div>
                  ))}
                </div>
                {!showFeedback && (
                  <button onClick={handleSortingSubmit} disabled={!isTimerActive} className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold py-4 rounded-xl transition-all shadow-md active:scale-[0.98]">
                    Kunci Urutan!
                  </button>
                )}
                {showFeedback && (
                  <div className={`mt-6 p-5 rounded-xl text-center font-bold text-lg flex flex-col items-center gap-3 animate-fade-in ${JSON.stringify(sortingItems) === JSON.stringify(question.correctOrder) ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                    {JSON.stringify(sortingItems) === JSON.stringify(question.correctOrder) ? (
                      <><CheckCircle2 size={36} className="animate-bounce-short"/> Susunan Sempurna! (+{question.points || 10} Poin)</>
                    ) : (
                      <div className="w-full"><XCircle size={36} className="mx-auto mb-2" /><p className="text-sm font-bold bg-black/20 py-1 px-3 rounded-full inline-block mb-3">Susunan Salah. Jawaban yang benar:</p><ol className="text-left list-decimal list-inside bg-white/10 p-4 rounded-xl text-sm md:text-base space-y-2 font-medium">{question.correctOrder.map((item, i) => <li key={i}>{item}</li>)}</ol></div>
                    )}
                  </div>
                )}
              </div>
            ) : question.type === 'image-choice' ? (
              <div className="grid grid-cols-2 gap-4 mt-8">
                {question.options.map((opt, idx) => {
                  if (hiddenOptions.includes(opt)) {
                    return <div key={idx} className="bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl opacity-40 flex items-center justify-center pointer-events-none aspect-square md:aspect-[4/3]"><span className="text-slate-400 font-bold">50:50</span></div>;
                  }

                  const isSelected = selectedAnswer === opt;
                  const isCorrect = opt === question.correctAnswer;
                  
                  let borderClass = "border-2 border-slate-200 hover:border-indigo-400";
                  if (showFeedback) {
                    if (isCorrect) borderClass = "border-4 border-emerald-500 ring-4 ring-emerald-200 z-10 scale-[1.02] bg-emerald-50";
                    else if (isSelected && !isCorrect) borderClass = "border-4 border-red-500 opacity-90 bg-red-50";
                    else borderClass = "border-2 border-slate-200 opacity-50 cursor-not-allowed";
                  }

                  return (
                    <button
                      key={idx} disabled={showFeedback || !isTimerActive} onClick={() => handleAnswerSelect(opt)}
                      className={`relative rounded-2xl overflow-hidden transition-all duration-300 ease-out group bg-white ${borderClass} aspect-square md:aspect-[4/3]`}
                    >
                      <div className="absolute top-2 left-2 z-10">
                        <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors shadow-sm ${showFeedback && isCorrect ? 'bg-emerald-500 text-white' : showFeedback && isSelected && !isCorrect ? 'bg-red-500 text-white' : 'bg-white text-slate-600'}`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                      </div>
                      <img 
                        src={opt} alt={`Pilihan ${String.fromCharCode(65 + idx)}`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentElement.classList.add('bg-slate-100', 'flex', 'items-center', 'justify-center'); e.target.parentElement.innerHTML += '<span class="text-slate-400 font-medium">Gambar Tidak Tersedia</span>'; }}
                      />
                      {showFeedback && isCorrect && <div className="absolute top-2 right-2"><CheckCircle2 size={32} className="text-emerald-500 drop-shadow-md bg-white rounded-full animate-bounce-short" /></div>}
                      {showFeedback && isSelected && !isCorrect && <div className="absolute top-2 right-2"><XCircle size={32} className="text-red-500 drop-shadow-md bg-white rounded-full" /></div>}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {question.options.map((opt, idx) => {
                  if (hiddenOptions.includes(opt)) {
                    return <div key={idx} className="p-5 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 opacity-50 flex items-center gap-4 pointer-events-none"><span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 text-slate-400 font-bold">{String.fromCharCode(65 + idx)}</span><span className="text-slate-400 font-bold line-through">{opt}</span></div>;
                  }

                  const isSelected = selectedAnswer === opt;
                  const isCorrect = opt === question.correctAnswer;
                  
                  let btnStateClass = "bg-white border-2 border-slate-200 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50";
                  if (showFeedback) {
                    if (isCorrect) btnStateClass = "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200 scale-[1.02] z-10";
                    else if (isSelected && !isCorrect) btnStateClass = "bg-red-500 border-red-500 text-white shadow-lg shadow-red-200 opacity-90";
                    else btnStateClass = "bg-white border-slate-200 text-slate-400 opacity-50 cursor-not-allowed";
                  }

                  return (
                    <button
                      key={idx} disabled={showFeedback || !isTimerActive} onClick={() => handleAnswerSelect(opt)}
                      className={`relative p-5 rounded-2xl text-left font-semibold text-lg transition-all duration-300 ease-out flex items-center justify-between group ${btnStateClass}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors ${showFeedback && isCorrect ? 'bg-white text-emerald-600' : showFeedback && isSelected && !isCorrect ? 'bg-white text-red-600' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        {opt}
                      </div>
                      {showFeedback && isCorrect && <span className="font-bold bg-emerald-600 px-2 py-1 rounded text-sm animate-bounce-short">+{question.points || 10}</span>}
                      {showFeedback && isSelected && !isCorrect && <XCircle size={24} className="text-white" />}
                    </button>
                  );
                })}
              </div>
            )}
            
            {selectedAnswer === 'TIMEOUT' && showFeedback && (
              <div className="mt-6 text-center text-red-500 font-bold bg-red-50 border-2 border-red-200 p-4 rounded-xl animate-pulse">
                Waktu Habis! Nyawamu berkurang 💔
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    const maxScore = currentQuiz.questions.reduce((sum, q) => sum + (q.points || 10), 0);
    const percentage = Math.round((score / maxScore) * 100) || 0;
    
    let earnedStars = 0;
    let message = "Jangan Menyerah!";
    
    if (lives <= 0) {
      message = "Kesempatan Habis! 💔";
      earnedStars = 0;
    } else {
      if (percentage >= 90) { earnedStars = 3; message = "Sempurna!"; }
      else if (percentage >= 50) { earnedStars = 2; message = "Kerja Bagus!"; }
      else if (percentage > 0) { earnedStars = 1; message = "Coba Lagi!"; }
    }

    const quizLeaderboard = isSharedMode ? cloudLeaderboard : (leaderboards[currentQuiz.id] || []);

    return (
      <div className="max-w-4xl mx-auto mt-6 animate-fade-in pb-12 flex flex-col lg:flex-row gap-6">
        
        {/* KARTU HASIL SKOR DENGAN BINTANG */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-10 text-center overflow-hidden relative flex-1 border-4 border-indigo-50">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>

          <div className="relative z-10">
            <div className="flex justify-center items-end gap-2 mb-6 h-20">
              <Star size={64} className={`transform transition-all duration-700 ${earnedStars >= 1 ? 'text-yellow-400 fill-yellow-400 animate-bounce-short' : 'text-slate-200 fill-slate-200'} delay-100`} />
              <Star size={84} className={`transform transition-all duration-700 -translate-y-6 ${earnedStars >= 2 ? 'text-yellow-400 fill-yellow-400 animate-bounce-short' : 'text-slate-200 fill-slate-200'} delay-300`} />
              <Star size={64} className={`transform transition-all duration-700 ${earnedStars >= 3 ? 'text-yellow-400 fill-yellow-400 animate-bounce-short' : 'text-slate-200 fill-slate-200'} delay-500`} />
            </div>

            <h2 className="text-3xl font-extrabold text-slate-800 mb-2">{message}</h2>
            <p className="text-slate-500 mb-6 font-medium">Kuis "{currentQuiz.title}" selesai.</p>

            {sessionReward && (
              <div className="bg-gradient-to-r from-pink-100 to-rose-100 border-2 border-pink-300 rounded-2xl p-4 my-6 shadow-md transform hover:scale-105 transition-transform cursor-pointer">
                <h4 className="text-pink-800 font-extrabold mb-1 flex items-center justify-center gap-1"><Sparkles size={18}/> Kado Stiker Baru!</h4>
                <div className="text-6xl mb-1 drop-shadow-md">{sessionReward.emoji}</div>
                <div className="font-bold text-pink-700 uppercase tracking-widest text-sm">{sessionReward.name}</div>
              </div>
            )}

            <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 shadow-inner">
              <div className="text-5xl md:text-6xl font-black text-indigo-600 mb-1">{score} <span className="text-2xl text-slate-400">/ {maxScore}</span></div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Total Skor</div>
              
              <div className="w-full bg-slate-200 rounded-full h-3 mb-2 overflow-hidden">
                <div className={`h-3 rounded-full ${percentage >= 50 ? 'bg-emerald-500' : 'bg-yellow-500'}`} style={{ width: `${percentage}%` }}></div>
              </div>
              <div className="text-sm text-slate-500 font-medium">{percentage}% Akurasi</div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button onClick={() => startGame(currentQuiz)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-md flex justify-center items-center gap-2">
                <RefreshCw size={18} /> Main Lagi
              </button>
              <button onClick={() => { if(isSharedMode) window.location.href = window.location.pathname; else setView('lobby'); }} className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-md flex justify-center items-center gap-2">
                <Home size={18} /> {isSharedMode ? 'Buat Kuis Sendiri' : 'Menu Utama'}
              </button>
            </div>
          </div>
        </div>

        {/* KARTU LEADERBOARD & SIMPAN SKOR */}
        <div className="bg-slate-800 text-white rounded-3xl shadow-xl p-8 md:p-10 flex-1 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10"><Trophy size={120}/></div>
          <div className="relative z-10 flex flex-col h-full">
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2"><Trophy className="text-amber-400"/> Papan Peringkat</h3>
            <p className="text-slate-400 text-sm mb-6 border-b border-slate-700 pb-4">Top Skor untuk Kuis Ini</p>

            {!isScoreSaved ? (
              <div className="bg-slate-700/50 p-5 rounded-2xl border border-slate-600 mb-6 flex flex-col items-center">
                <h4 className="font-medium text-amber-300 mb-3 text-sm">Simpan Skor Kamu!</h4>
                
                <div className="flex items-center justify-center gap-3 w-full bg-slate-800 py-3 rounded-xl mb-4 border border-slate-600">
                    <span className="text-3xl drop-shadow-md">{userProfile?.avatar}</span>
                    <span className="text-xl font-bold text-white">{userProfile?.name}</span>
                </div>
                
                <button 
                  onClick={() => saveToLeaderboard(currentQuiz.id, score, maxScore)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-4 py-3.5 rounded-xl transition-colors shadow-lg shadow-amber-900/20"
                >
                  Simpan ke Papan Skor
                </button>
              </div>
            ) : (
              <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-xl mb-6 text-center text-sm font-bold flex items-center justify-center gap-2">
                <CheckCircle2 size={18}/> Skor kamu berhasil disimpan!
              </div>
            )}

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {quizLeaderboard.length === 0 ? (
                <div className="text-center py-8 text-slate-500 italic">Belum ada skor yang tersimpan. Jadilah yang pertama!</div>
              ) : (
                quizLeaderboard.slice(0, 5).map((entry, idx) => (
                  <div key={entry.id} className="bg-slate-700/30 hover:bg-slate-700/60 transition-colors border border-slate-700 p-4 rounded-xl flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 ${idx === 0 ? 'bg-amber-400 text-amber-900' : idx === 1 ? 'bg-slate-300 text-slate-800' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      {idx + 1}
                    </div>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-3xl drop-shadow-sm">{entry.avatar || '🐶'}</span>
                      <div>
                         <div className="font-bold text-white text-lg truncate">{entry.name}</div>
                         <div className="text-xs text-slate-400 font-medium">{entry.date}</div>
                      </div>
                    </div>
                    <div className="text-right bg-slate-900/50 px-4 py-2 rounded-lg">
                      <div className="font-black text-amber-400 text-xl leading-tight">{entry.score}</div>
                      <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">/ {entry.maxScore} PTS</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-200">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600 cursor-pointer" onClick={() => { if(!isSharedMode && userProfile) setView('lobby')}}>
            <Award size={28} className="text-indigo-600" />
            <span className="font-extrabold text-xl tracking-tight text-slate-800">Kuis<span className="text-indigo-600">Kita</span></span>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              <button onClick={() => setBgmEnabled(!bgmEnabled)} className={`p-1.5 rounded-full transition-colors ${bgmEnabled ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:bg-slate-200'}`} title="Musik Latar">
                <Music size={18} />
              </button>
              {bgmEnabled && (
                <select value={bgmIndex} onChange={(e) => setBgmIndex(Number(e.target.value))} className="bg-transparent text-xs font-bold text-indigo-700 outline-none cursor-pointer max-w-[85px] md:max-w-[120px] truncate">
                  {bgmOptions.map((opt, i) => <option key={i} value={i}>{opt.name}</option>)}
                </select>
              )}
              <div className="w-px h-5 bg-slate-200"></div>
              <button onClick={() => setSoundEnabled(!soundEnabled)} className={`p-1.5 rounded-full transition-colors ${soundEnabled ? 'bg-emerald-100 text-emerald-600' : 'text-slate-400 hover:bg-slate-200'}`} title="Efek Suara">
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
            </div>

            {userProfile && view !== 'login' && view !== 'guest-join' && (
               <div className="flex items-center gap-3 border-l border-slate-200 pl-3 md:pl-6">
                  <div 
                     onClick={() => { if (!isSharedMode) setView('login') }}
                     className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-full cursor-pointer hover:bg-slate-50 hover:border-indigo-200 transition-all group"
                     title="Edit Profil"
                  >
                     <span className="text-xl group-hover:scale-110 transition-transform">{userProfile.avatar}</span>
                     <span className="font-bold text-sm text-slate-700 hidden sm:inline">{userProfile.name}</span>
                  </div>
                  {!isSharedMode && (
                    <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 p-1 transition-colors" title="Keluar">
                       <LogOut size={18} />
                    </button>
                  )}
               </div>
            )}
          </div>
        </div>
      </nav>

      <main className="p-4 md:p-8 relative overflow-hidden">
        {view === 'login' && <LoginScreen />}
        {view === 'guest-join' && <GuestJoinScreen />}

        {!isSharedMode && view === 'lobby' && renderLobby()}
        {!isSharedMode && view === 'leaderboard' && renderLeaderboard()}
        {!isSharedMode && view === 'stickers' && renderStickers()}
        {!isSharedMode && view === 'creator' && renderCreator()}
        
        {view === 'player' && renderPlayer()}
        {view === 'result' && renderResult()}
        
        {/* RENDER MASKOT BIPBOP */}
        {(view === 'player' || view === 'result' || (isSharedMode && view !== 'login' && view !== 'guest-join')) && (
          <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex items-end gap-3 pointer-events-none">
            <div className="bg-white px-4 py-3 rounded-2xl rounded-br-none shadow-xl border-2 border-indigo-100 max-w-[200px] md:max-w-[250px] animate-fade-in">
              <p className="text-sm md:text-base font-bold text-slate-700 leading-snug">{mascot.message}</p>
            </div>
            <div className="animate-float">
              <BipBopMascot mood={mascot.mood} />
            </div>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes bounceShort { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-25%); } }
        .animate-bounce-short { animation: bounceShort 0.5s ease-in-out 1; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 10px; }
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}} />
    </div>
  );
}
