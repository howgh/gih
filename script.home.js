import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, onSnapshot, increment, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// setLogLevel('Debug');

// --- Bagian Obfuscated Dimulai ---

// Utility untuk decoding string sederhana (Base64)
const $S = (s) => atob(s);

// Variabel disingkat
let d, a; // db, auth

// ID Aplikasi & Konfigurasi Firebase disandikan
const EAI = $S("b3JpZ2luYWxhbWFuaGFoLW15LWlk"); // originalamanah-my-id
const FC = {
    apiKey: $S("QUl6YVN5RFM2cmVDRGpuYWs4WXFFeHM5dEh4OWNfc0JnM0c3aEdZ"), // AIzaSyDS6reCDJnak8YaUXs9tHx9c_sBg3G7hGY
    authDomain: "global-project-fe765.firebaseapp.com",
    projectId: "global-project-fe765",
    storageBucket: "global-project-fe765.firebasestorage.app",
    messagingSenderId: "776529586347",
    appId: $S("MTc3NjUyOTU4NjM0N3dlYmJiMjlkNzIxZDc4OGZkYWVhMmZlZQ=="), // 1:776529586347:web:bb291d721d788fdaea2fee
    measurementId: "G-YV9KS75YJF"
};
const CDP = `/globalpro_counters/${EAI}/counters/main_counter`;
const VIE = $S("dmlzaXRvci1jb3VudA=="); // visitor-count

// Fungsi formatCount yang di-obfuscasi
function fC(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + $S("anQ="); // 'jt'
    if (n >= 1e5) return (n / 1e3).toFixed(0) + $S("cmI="); // 'rb'
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
    return n.toString();
}

// Fungsi initializeVisitorCounter yang di-obfuscasi
async function iVC() {
    try {
        const app = initializeApp(FC);
        d = getFirestore(app);
        a = getAuth(app);

        await signInAnonymously(a);
        console.log($S("RmlyZWJhc2UgYXV0aCAoYW5vbnltb3VzKSBzdWNjZXNzZnVsLg==")); // 'Firebase auth (anonymous) successful.'

        const cR = doc(d, CDP); // counterRef
        const cE = document.getElementById($S(VIE)); // countElement

        if (!cE) {
            console.error($S("RWxlbWVuICd2aXNpdG9yLWNvdW50JyB0aWRhayBkaXRlbXVrYW4u")); // "Elemen 'visitor-count' tidak ditemukan."
            return;
        }

        onSnapshot(cR, (doc) => {
            let c = doc.exists() ? doc.data().count : 0;
            cE.textContent = fC(c);
            console.log($S("VmlzaXRvciBjb3VudCBkaXNwbGF5ZWQ6IA==") + c); // 'Visitor count displayed: '
        }, (e) => {
            console.error($S("RXJyb3IgbGlzdGVuaW5nIHRvIGNvdW50ZXIgc25hcHNob3Q6IA=="), e); // "Error listening to counter snapshot: "
            cE.textContent = $S("RXJyb3I="); // 'Error'
        });

        await setDoc(cR, { count: increment(1) }, { merge: true });
        console.log($S("VmlzaXRvciBjb3VudCBpbmNyZW1lbnRlZCBvbiByZWZyZXNoLg==")); // 'Visitor count incremented on refresh.'
    }
    catch (e) {
        console.error($S("RXJyb3IgaW5pdGlhbGl6aW5nIEZpcmViYXNlIG9yIHZpc2l0b3IgY291bnRlcjog"), e); // "Error initializing Firebase or visitor counter: "
        const cE = document.getElementById($S(VIE));
        if (cE) cE.textContent = $S("Ti9B"); // 'N/A'
    }
}
document.addEventListener('DOMContentLoaded', iVC);

// Fungsi enforceCleanUrl yang di-obfuscasi
function eCU() {
    const cP = window.location.pathname; // currentPath
    const cU = window.location.href; // currentUrl

    if (cP.endsWith('/') && cP.length > 1) {
        const cP2 = cP.replace(/\/+$/, ''); // cleanPath
        const cU2 = window.location.origin + cP2 + window.location.search + window.location.hash; // cleanUrl
        console.log($S("W1VSTDwgQ0xFQU5JTkddIEZvdW5kIHNsYXNoIGF0IHRoZSBlbmQ6IA==") + cU); // "https://www.youtube.com/watch?v=nU4yxyd4bRs Found slash at the end: "
        console.log($S("W1VSTDwgQ0xFQU5JTkddIENoYW5nZSBVUkwgd2l0aG91dCByZWxvYWRpbmc6IA==") + cU2); // "https://www.youtube.com/watch?v=nU4yxyd4bRs Change URL without reloading: "
        history.replaceState(null, null, cU2);
    } else {
        console.log($S("W1VSTDwgQ0xFQU5JTkddIFVSTDwgaXMgY2xlYW4gb3Igcm9vdCBVUkw6IA==") + cU); // "https://www.youtube.com/watch?v=nU4yxyd4bRs URL is clean or root URL: "
    }
}
document.addEventListener('DOMContentLoaded', eCU);
// --- Bagian Obfuscated Selesai ---
