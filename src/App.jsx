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
        {/* POPUP INPUT NAMA TAMU DI ATAS LAYAR PLAY */}
        {showGuestModal && <GuestNameModal />}

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

            {userProfile && view !== 'login' && (
               <div className="flex items-center gap-3 border-l border-slate-200 pl-3 md:pl-6">
                  <div 
                     onClick={() => { if (!isSharedMode) setView('login') }}
                     className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-full cursor-pointer hover:bg-slate-50 hover:border-indigo-200 transition-all group"
                     title={isSharedMode ? "Nama Pemain" : "Edit Profil"}
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
        {!isSharedMode && view === 'lobby' && renderLobby()}
        {!isSharedMode && view === 'leaderboard' && renderLeaderboard()}
        {!isSharedMode && view === 'stickers' && renderStickers()}
        {!isSharedMode && view === 'creator' && renderCreator()}
        {(view === 'player' || (isSharedMode && view !== 'login')) && renderPlayer()}
        {view === 'result' && renderResult()}
        
        {/* RENDER MASKOT BIPBOP */}
        {(view === 'player' || view === 'result' || (isSharedMode && view !== 'login')) && (
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
