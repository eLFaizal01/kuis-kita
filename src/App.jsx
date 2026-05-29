// Di dalam App.jsx atau LoginScreen.jsx
import React from 'react';
import { Award, User, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuthLogic } from './useAuthLogic'; // Import hook yang baru dibuat

const AVATAR_LIST = ['🐶', '🐱', '🦊', '🐰', '🦁', '🐸', '🐼', '🐨', '🐯', '🐮'];

// Kita kirim props berupa fungsi-fungsi yang dibutuhkan setelah login sukses
export const LoginScreen = ({ appId, setUserProfile, currentQuiz, startGame, setView }) => {
    
    // Panggil custom hook untuk mengambil logika Firebase
    const {
        isLoginMode, setIsLoginMode,
        email, setEmail,
        password, setPassword,
        tempName, setTempName,
        tempAvatar, setTempAvatar,
        loading, errorMsg, setErrorMsg,
        handleAuthSubmit
    } = useAuthLogic(appId, (currentProfile) => {
        // Ini adalah callback onSuccess yang dijalankan saat login berhasil
        setUserProfile(currentProfile);
        localStorage.setItem('quiz_user_profile', JSON.stringify(currentProfile));

        if (currentQuiz && window.location.hash.startsWith('#play=')) {
            startGame(currentQuiz);
        } else {
            setView('lobby');
        }
    });

    // DI BAWAH INI MURNI KODE DESAIN / UI SAJA
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-fade-in">
           <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 w-full max-w-md relative overflow-hidden">
               {/* UI Header Login */}
               <Award size={54} className="text-indigo-600 mx-auto mb-4" />
               <h1 className="text-3xl font-extrabold text-slate-800 text-center mb-6">KuisKita</h1>

               {/* UI Tombol Switch Mode Login/Register */}
               <div className="flex bg-slate-100 p-1.5 rounded-xl mb-6 shadow-inner">
                   <button 
                       type="button" 
                       onClick={() => { setIsLoginMode(true); setErrorMsg(''); }} 
                       className={`flex-1 py-2 font-bold rounded-lg ${isLoginMode ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                   >Masuk</button>
                   <button 
                       type="button" 
                       onClick={() => { setIsLoginMode(false); setErrorMsg(''); }} 
                       className={`flex-1 py-2 font-bold rounded-lg ${!isLoginMode ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                   >Daftar Baru</button>
               </div>

               {/* Notifikasi Error */}
               {errorMsg && (
                 <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium">
                   {errorMsg}
                 </div>
               )}

               {/* Form Login */}
               <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {!isLoginMode && (
                      <>
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Pilih Avatar:</label>
                            <div className="grid grid-cols-5 gap-2 bg-slate-50 p-3 rounded-2xl">
                               {AVATAR_LIST.map(ava => (
                                  <button 
                                     key={ava} type="button" onClick={() => setTempAvatar(ava)}
                                     className={`text-2xl aspect-square rounded-xl ${tempAvatar === ava ? 'bg-indigo-100 border-2 border-indigo-400' : 'hover:bg-slate-200 border-2 border-transparent'}`}
                                  >{ava}</button>
                               ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Nama Panggilan</label>
                            <div className="relative">
                               <User size={18} className="absolute left-3 top-3 text-slate-400"/>
                               <input type="text" required value={tempName} onChange={(e) => setTempName(e.target.value)} placeholder="Nama kamu..." className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5"/>
                            </div>
                        </div>
                      </>
                  )}

                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                      <div className="relative">
                         <Mail size={18} className="absolute left-3 top-3 text-slate-400"/>
                         <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alamat@email.com" className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5"/>
                      </div>
                  </div>

                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                      <div className="relative">
                         <Lock size={18} className="absolute left-3 top-3 text-slate-400"/>
                         <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 6 karakter..." className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5"/>
                      </div>
                  </div>

                  <button type="submit" disabled={loading} className="w-full mt-4 bg-indigo-600 text-white font-bold py-3.5 rounded-xl flex justify-center items-center gap-2">
                     {loading && <Loader2 size={18} className="animate-spin" />}
                     {isLoginMode ? 'Masuk' : 'Buat Akun'}
                  </button>
               </form>
           </div>
        </div>
    );
};
