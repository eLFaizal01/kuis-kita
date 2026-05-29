import { useState } from 'react';
import { auth, db } from './firebase'; 
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const useAuthLogic = (appId, onSuccess) => {
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

            onSuccess(currentProfile);

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

    return {
        isLoginMode, setIsLoginMode,
        email, setEmail,
        password, setPassword,
        tempName, setTempName,
        tempAvatar, setTempAvatar,
        loading, errorMsg, setErrorMsg,
        handleAuthSubmit
    };
};
