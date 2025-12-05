import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { 
getAuth, 
signInAnonymously, 
signInWithCustomToken, 
onAuthStateChanged,
signOut }
from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { 
getFirestore, 
doc, 
setDoc, 
onSnapshot, 
increment, 
setLogLevel,
getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Mengatur level log Firebase ke Debug
setLogLevel('Debug');

// --- Konfigurasi Main App (Menggunakan Global Variables Canvas) ---
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {
// Fallback config
apiKey: "AIzaSyBbvImpR3KnEMpwI8VVrOJg3pwcQbq12Qc",
authDomain: "autoresonderwa.firebaseapp.com",
projectId: "autoresonderwa",
storageBucket: "autoresonderwa.firebasestorage.app",
messagingSenderId: "865886495056",
appId: "1:865886495056:android:1268855d193bb3a781cc55" };
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null; 
// ------------------------------------------------------------------


// --- Konfigurasi Visitor Counter Eksternal (Hardcode sesuai permintaan user) ---
const ERROR_APP_ID = "originalamanah-my-id"; // Ini sebenarnya hanya bagian dari path dokumen
const EXTERNAL_FIREBASE_CONFIG = {
apiKey: "AIzaSyDS6reCDJnak8YaUXs9tHx9c_sBg3G7hGY/hapus",
authDomain: "global-project-fe765.firebaseapp.com",
projectId: "global-project-fe765",
storageBucket: "global-project-fe765.firebasestorage.app",
messagingSenderId: "776529586347",
appId: "1:776529586347:web:bb291d721d788fdaea2fee",
measurementId: "G-YV9KS75YJF"};
const EXTERNAL_COUNTER_DOC_PATH = `/globalpro_counters/${ERROR_APP_ID}/counters/main_counter`;
// --------------------------------------------------------------------------------

let mainDb, mainAuth; // Variabel untuk koneksi Firebase Main App
let mainUserId = null;
let listenersInitialized = false; 
let globalPromoMessage = ""; 

// Paths untuk dokumen konfigurasi Main App
const PROMO_TEXT_DOC_PATH = `/artifacts/${appId}/public/data/config/homepage_text`;
const PREORDER_TERMS_DOC_PATH = `/artifacts/${appId}/public/data/config/preorder_terms`; 
const ORDER_PROCESS_DOC_PATH = `/artifacts/${appId}/public/data/config/order_process`;
const PREORDER_HEADER_DOC_PATH = `/artifacts/${appId}/public/data/config/preorder_header`;
// --- PATH BARU UNTUK JUDUL CARA ORDER ---
const MAIN_TITLE_DOC_PATH = `/artifacts/${appId}/public/data/config/order_header`;
// ----------------------------------------- 

// --- PATH BARU UNTUK JUDUL CARA ORDER ---
const UP_DATE_DOC_PATH = `/artifacts/${appId}/public/data/config/order_date`;
// -----------------------------------------

// --- PATH BARU UNTUK JUDUL CARA ORDER ---
const ST_ARS_DOC_PATH = `/artifacts/${appId}/public/data/config/order_stars`;
// -----------------------------------------

// --- PATH BARU UNTUK JUDUL CARA ORDER ---
const KONSUL_DOC_PATH = `/artifacts/${appId}/public/data/config/order_konsul`;
// -----------------------------------------


function formatCount(num) {
if (num >= 1000000) {
// Format Juta (jt)
return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'jt';
}
if (num >= 100000) {
// Format Ribuan (rb) untuk 100.000 ke atas (sesuai logika di kode user)
return (num / 1000).toFixed(0) + 'rb';
}
if (num >= 1000) {
// Format Ribuan (k)
return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
}
return num.toString();
}



/**
 * Memperbarui tampilan pesan promosi berdasarkan pesan terbaru dan status autentikasi Main App.
 * @param {string} message - Pesan yang akan ditampilkan (tanpa prefix login).
 */
function updatePromoTextUI(message) {
const realtimeTextElement = document.getElementById('realtime-text');
if (!realtimeTextElement) return;

globalPromoMessage = message ? message.trim() : ""; 

if (globalPromoMessage.length > 0) {
let displayMessage = globalPromoMessage;

if (mainAuth.currentUser && mainAuth.currentUser.uid) { 
// User sudah login
displayMessage = `Halo kak, ${globalPromoMessage}`;
realtimeTextElement.classList.remove('bg-yellow-100', 'border-yellow-300');
realtimeTextElement.classList.add('bg-green-100', 'border-green-300');
} else {
// User belum login
displayMessage = `Anda belum login. ${globalPromoMessage}`;
realtimeTextElement.classList.remove('bg-green-100', 'border-green-300');
realtimeTextElement.classList.add('bg-yellow-100', 'border-yellow-300');
}
        
realtimeTextElement.textContent = displayMessage;
realtimeTextElement.style.display = 'block';
console.log('[Main App] Teks promosi real-time diperbarui. Ditampilkan.');
} else {
console.log('[Main App] Teks promosi tidak tersedia. Disembunyikan.');
realtimeTextElement.style.display = 'none'; }}


/**
 * Mengatur nilai visitor counter secara manual di Firestore Counter Eksternal.
 * Fungsi ini harus dipanggil dari Console, misalnya: setVisitorCountManually(1500000);
 * @param {number} newCount - Nilai counter baru yang diinginkan.
 */
async function setVisitorCountManually(newCount) {
try {
// Inisialisasi Firebase Counter secara singkat untuk operasi admin ini
// Menggunakan nama aplikasi unik "admin-counter-setter"
const app = initializeApp(EXTERNAL_FIREBASE_CONFIG, "admin-counter-setter");
const db = getFirestore(app);
        
if (typeof newCount !== 'number' || newCount < 0) {
console.error("Nilai counter harus berupa angka positif.");
return;}

const counterRef = doc(db, EXTERNAL_COUNTER_DOC_PATH);
        
await setDoc(counterRef, { count: newCount });
console.log(`[Counter Admin] Jumlah pengunjung berhasil diatur secara manual ke: ${newCount} (Firebase Eksternal)`);
        
} catch (error) {
console.error("[Counter Admin] Error mengatur jumlah pengunjung secara manual: ", error);}}
// Ekspos fungsi ke window agar dapat dipanggil dari console browser (khusus admin)
window.setVisitorCountManually = setVisitorCountManually;


/**
 * Menginisialisasi koneksi Firebase KHUSUS untuk Visitor Counter Eksternal.
 * Menggunakan konfigurasi dan path yang hardcode dari permintaan user.
 */
async function initializeExternalVisitorCounter() {
let externalDb, externalAuth;
const DELAY_MS = 1200; // <<< --- VARIABEL INI KINI ADA DI SCOPE INI ---
try {
// Menggunakan nama aplikasi unik "visitor-counter-app"
const app = initializeApp(EXTERNAL_FIREBASE_CONFIG, "visitor-counter-app"); 
externalDb = getFirestore(app);
externalAuth = getAuth(app);     
                
await signInAnonymously(externalAuth);
console.log('[Counter External] Firebase auth (anonymous) successful.');

const counterRef = doc(externalDb, EXTERNAL_COUNTER_DOC_PATH);
const countElement = document.getElementById('visitor-count');
                
if (!countElement) {
// CUKUP WARNING, JANGAN RETURN agar listener tetap berjalan
console.warn("[Counter External] Elemen 'visitor-count' tidak ditemukan. Gagal menerapkan delay.");
} else {
// Tampilkan Visitor Count setelah delay untuk sinkronisasi dengan elemen lain
setTimeout(() => {
countElement.classList.remove('hidden'); 
console.log(`[Counter External] Visitor Count ditampilkan setelah delay ${DELAY_MS}ms.`);
}, DELAY_MS);}


// Listener Real-time untuk Counter
onSnapshot(counterRef, (doc) => {
let count = 0;
if (doc.exists()) {
count = doc.data().count;
}
countElement.textContent = formatCount(count);
console.log(`[Counter External] Jumlah pengunjung ditampilkan: ${count}`);
}, (error) => {
console.error("[Counter External] Error listening to counter snapshot: ", error);
countElement.textContent = 'Error';
});	  
                
// Increment Counter hanya sekali saat load halaman
await setDoc(counterRef, { count: increment(1) }, { merge: true });
console.log('[Counter External] Jumlah pengunjung berhasil ditingkatkan.');
} catch (error) {
console.error("[Counter External] Error initializing Firebase or visitor counter: ", error);
const countElement = document.getElementById('visitor-count');
if (countElement) {
countElement.textContent = 'N/A';}}}


/**
 * Memulai semua listener Real-time Main App (Teks Dinamis, dan Ketentuan).
 * TIDAK lagi mengurus Visitor Counter.
 */
function startMainAppRealtimeListeners() {
if (listenersInitialized) {
console.log("[Main App] Realtime listeners sudah diinisialisasi. Melewati.");
return;
}
listenersInitialized = true;
console.log("[Main App] Memulai inisialisasi Realtime listeners...");

// 2. Real-time Text Update Logic (Pesan Promosi)
const promoTextRef = doc(mainDb, PROMO_TEXT_DOC_PATH);
const realtimeTextElement = document.getElementById('realtime-text');

if (!realtimeTextElement) {
console.error("[Main App] Elemen 'realtime-text' tidak ditemukan.");
return;
}
        
onSnapshot(promoTextRef, (doc) => {
let message = "";
if (doc.exists() && doc.data().message) {
message = doc.data().message;
}
updatePromoTextUI(message);
}, (error) => {
console.error("[Main App] Error listening to promo text snapshot: ", error);
realtimeTextElement.textContent = 'Error memuat pesan dinamis.';
realtimeTextElement.style.display = 'block'; 
});

getDoc(promoTextRef).then(docSnap => {
if (!docSnap.exists()) {
setDoc(promoTextRef, {
message: ""
}).then(() => console.log("[Main App] Konfigurasi promo default (kosong) disimpan.")).catch(err => console.error("[Main App] Error saving default promo config: ", err));
}
});







// 1.1. Real-time Main Title Logic (JUDUL BARU: Cara Order)
    const mainTitleRef = doc(mainDb, MAIN_TITLE_DOC_PATH);
    const mainTitleElement = document.getElementById('maintitle'); // ID dari elemen <h3> yang Anda berikan
    const defaultMainTitleText = ``;

    if (!mainTitleElement) {
        console.error("[Main App] Elemen 'maintitle' tidak ditemukan.");
        // Lanjutkan tanpa error fatal
    } else {
        onSnapshot(mainTitleRef, (doc) => {
            if (doc.exists() && doc.data().headerText) {
                // Perbarui teks di elemen <h3>
                mainTitleElement.textContent = doc.data().headerText;
                console.log(`[Main App] Judul Utama (ID: maintitle) berhasil diperbarui: ${doc.data().headerText}`);
            } else {
                // Gunakan teks default jika dokumen belum ada
                mainTitleElement.textContent = defaultMainTitleText;
                console.log('[Main App] Judul Utama (ID: maintitle) tidak ditemukan, menggunakan default.');
            }
        }, (error) => {
            console.error("[Main App] Error listening to main title snapshot: ", error);
            mainTitleElement.textContent = `Error: ${defaultMainTitleText}`;
        });

        // Inisialisasi data default untuk Judul Utama (Cara Order)
        getDoc(mainTitleRef).then(docSnap => {
            if (!docSnap.exists()) {
                setDoc(mainTitleRef, {
                    headerText: defaultMainTitleText
                }).then(() => console.log("[Main App] Konfigurasi judul utama default disimpan.")).catch(err => console.error("[Main App] Error saving default main title config: ", err));
            }
        });
    }




// 2.2. Real-time Main Title Logic (JUDUL BARU: Cara Order)
    const upDateRef = doc(mainDb, UP_DATE_DOC_PATH);
    const upDateElement = document.getElementById('Update'); // ID dari elemen <h3> yang Anda berikan
    const defaultUpDateText = ``;

    if (!upDateElement) {
        console.error("[Main App] Elemen 'maintitle' tidak ditemukan.");
        // Lanjutkan tanpa error fatal
    } else {
        onSnapshot(upDateRef, (doc) => {
            if (doc.exists() && doc.data().headerText) {
                // Perbarui teks di elemen <h3>
                upDateElement.textContent = doc.data().headerText;
                console.log(`[Main App] Judul Utama (ID: maintitle) berhasil diperbarui: ${doc.data().headerText}`);
            } else {
                // Gunakan teks default jika dokumen belum ada
                upDateElement.textContent = defaultUpDateText;
                console.log('[Main App] Judul Utama (ID: maintitle) tidak ditemukan, menggunakan default.');
            }
        }, (error) => {
            console.error("[Main App] Error listening to main title snapshot: ", error);
            upDateElement.textContent = `Error: ${defaultUpDateText}`;
        });

        // Inisialisasi data default untuk Judul Utama (Cara Order)
        getDoc(upDateRef).then(docSnap => {
            if (!docSnap.exists()) {
                setDoc(upDateRef, {
                    headerText: defaultUpDateText
                }).then(() => console.log("[Main App] Konfigurasi judul utama default disimpan.")).catch(err => console.error("[Main App] Error saving default main title config: ", err));
            }
        });
    }








// 2.3. Real-time Main Title Logic (JUDUL BARU: Cara Order)
    const stArsRef = doc(mainDb, ST_ARS_DOC_PATH);
    const stArsElement = document.getElementById('stars'); // ID dari elemen <h3> yang Anda berikan
    const defaultstArsText = `...`;

    if (!stArsElement) {
        console.error("[Main App] Elemen 'maintitle' tidak ditemukan.");
        // Lanjutkan tanpa error fatal
    } else {
        onSnapshot(stArsRef, (doc) => {
            if (doc.exists() && doc.data().headerText) {
                // Perbarui teks di elemen <h3>
                stArsElement.textContent = doc.data().headerText;
                console.log(`[Main App] Judul Utama (ID: maintitle) berhasil diperbarui: ${doc.data().headerText}`);
            } else {
                // Gunakan teks default jika dokumen belum ada
                stArsElement.textContent = defaultstArsText;
                console.log('[Main App] Judul Utama (ID: maintitle) tidak ditemukan, menggunakan default.');
            }
        }, (error) => {
            console.error("[Main App] Error listening to main title snapshot: ", error);
            stArsElement.textContent = `Error: ${defaultstArsText}`;
        });



        // Inisialisasi data default untuk Judul Utama (Cara Order)
        getDoc(stArsRef).then(docSnap => {
            if (!docSnap.exists()) {
                setDoc(stArsRef, {
                    headerText: defaultstArsText
                }).then(() => console.log("[Main App] Konfigurasi judul utama default disimpan.")).catch(err => console.error("[Main App] Error saving default main title config: ", err));
            }
        });
    }







// 2.4. Real-time Main Title Logic (JUDUL BARU: Cara Order)
    const konSulRef = doc(mainDb, KONSUL_DOC_PATH);
    const konSulElement = document.getElementById('konsul'); // ID dari elemen <h3> yang Anda berikan
    const defaultkonSulText = `...`;

    if (!konSulElement) {
        console.error("[Main App] Elemen 'maintitle' tidak ditemukan.");
        // Lanjutkan tanpa error fatal
    } else {
        onSnapshot(konSulRef, (doc) => {
            if (doc.exists() && doc.data().headerText) {
                // Perbarui teks di elemen <h3>
                konSulElement.textContent = doc.data().headerText;
                console.log(`[Main App] Judul Utama (ID: maintitle) berhasil diperbarui: ${doc.data().headerText}`);
            } else {
                // Gunakan teks default jika dokumen belum ada
                konSulElement.textContent = defaultkonSulText;
                console.log('[Main App] Judul Utama (ID: maintitle) tidak ditemukan, menggunakan default.');
            }
        }, (error) => {
            console.error("[Main App] Error listening to main title snapshot: ", error);
            konSulElement.textContent = `Error: ${defaultkonSulText}`;
        });



        // Inisialisasi data default untuk Judul Utama (Cara Order)
        getDoc(konSulRef).then(docSnap => {
            if (!docSnap.exists()) {
                setDoc(konSulRef, {
                    headerText: defaultkonSulText
                }).then(() => console.log("[Main App] Konfigurasi judul utama default disimpan.")).catch(err => console.error("[Main App] Error saving default main title config: ", err));
            }
        });
    }










// 3. Real-time Pre-order Header Text Logic (JUDUL KETENTUAN)
const termsHeaderRef = doc(mainDb, PREORDER_HEADER_DOC_PATH);
const termsHeaderElement = document.getElementById('pra-txt');
const defaultHeaderText = `<u>Ketentuan Pra-Pemesanan:</u>`;

if (!termsHeaderElement) {
console.error("[Main App] Elemen 'pra-txt' tidak ditemukan.");
return;
}

onSnapshot(termsHeaderRef, (doc) => {
if (doc.exists() && doc.data().headerText) {
termsHeaderElement.innerHTML = doc.data().headerText;
console.log('[Main App] Teks header pra-pemesanan real-time diperbarui.');
} else {
termsHeaderElement.innerHTML = defaultHeaderText;
console.log('[Main App] Teks header pra-pemesanan tidak ditemukan, menggunakan default.');
}
}, (error) => {
console.error("[Main App] Error listening to terms header snapshot: ", error);
termsHeaderElement.innerHTML = `<span class="text-red-500">Gagal memuat judul.</span> ${defaultHeaderText}`;
});

getDoc(termsHeaderRef).then(docSnap => {
if (!docSnap.exists()) {
setDoc(termsHeaderRef, {
headerText: defaultHeaderText
}).then(() => console.log("[Main App] Konfigurasi header default disimpan.")).catch(err => console.error("[Main App] Error saving default terms header config: ", err));
}
});











// 4. Real-time Pre-order Terms List Logic (Daftar Ketentuan)
const termsListRef = doc(mainDb, PREORDER_TERMS_DOC_PATH);
const termsContainer = document.getElementById('preorder-terms-container');

if (!termsContainer) {
console.error("[Main App] Elemen 'preorder-terms-container' tidak ditemukan.");
return;
}

const defaultTermsHtml = `
<ul class="list-disc pl-5 space-y-2 text-gray-600">
<li>Pembayaran DP minimal 50% harus dilakukan di awal.</li>
<li>Waktu tunggu produk Pre-Order adalah 2-3 minggu kerja.</li>
<li>Pembatalan sepihak setelah DP akan mengakibatkan DP hangus.</li>
<li>Sisa pembayaran dilunasi saat barang siap kirim atau diambil.</li>
</ul>`;

onSnapshot(termsListRef, (doc) => {
if (doc.exists() && doc.data().listHtml) {
termsContainer.innerHTML = doc.data().listHtml;
termsContainer.classList.remove('text-gray-500');
console.log('[Main App] Daftar ketentuan real-time berhasil diperbarui.');
} else {
termsContainer.innerHTML = defaultTermsHtml; 
termsContainer.classList.remove('text-gray-500'); 
console.log('[Main App] Daftar ketentuan tidak ditemukan, menggunakan default HTML list.');
}
}, (error) => {
console.error("[Main App] Error listening to terms snapshot: ", error);
termsContainer.innerHTML = `<p class="text-red-500">Gagal memuat ketentuan dari server. Menampilkan default...</p>${defaultTermsHtml}`;
});

getDoc(termsListRef).then(docSnap => {
if (!docSnap.exists()) {
setDoc(termsListRef, {
listHtml: defaultTermsHtml.trim() 
}).then(() => console.log("[Main App] Konfigurasi ketentuan default disimpan.")).catch(err => console.error("[Main App] Error saving default terms config: ", err));
}
});
        
        
// 5. Real-time Order Process Text Logic
const orderProcessRef = doc(mainDb, ORDER_PROCESS_DOC_PATH);
const orderProcessElement = document.getElementById('order-process-text');

if (!orderProcessElement) {
console.error("[Main App] Elemen 'order-process-text' tidak ditemukan.");
return;
}

onSnapshot(orderProcessRef, (doc) => {
if (doc.exists() && doc.data().processText) {
orderProcessElement.innerHTML = doc.data().processText;
console.log('[Main App] Teks proses order real-time diperbarui.');
} else {
orderProcessElement.innerHTML = 'Cara order tidak dapat dimuat atau belum diatur.';
console.log('[Main App] Teks proses order tidak ditemukan atau belum diatur.');
}
}, (error) => {
console.error("[Main App] Error listening to order process snapshot: ", error);
orderProcessElement.innerHTML = 'Gagal memuat teks proses order dari server.';
});

getDoc(orderProcessRef).then(docSnap => {
if (!docSnap.exists()) {
const defaultText = ``; 
setDoc(orderProcessRef, {
processText: defaultText
}).then(() => console.log("[Main App] Konfigurasi proses order default disimpan.")).catch(err => console.error("[Main App] Error saving default order process config: ", err));
}
});
}





/**
 * Menginisialisasi Firebase untuk Main App (Auth, Promo, Terms, etc.).
 */
async function initializeMainFirebaseApp() {
    try {
        // Menggunakan nama aplikasi unik "main-app"
        const app = initializeApp(firebaseConfig, "main-app"); 
        mainDb = getFirestore(app);
        mainAuth = getAuth(app);      
        
        const authButton = document.getElementById('auth-button');

        // Autentikasi menggunakan token kustom atau anonim (BLOCKING: Tunggu sampai selesai)
        if (initialAuthToken) {
            await signInWithCustomToken(mainAuth, initialAuthToken);
            console.log('[Main App] Firebase auth (custom token) successful.');
        } else {
            // Jika token tidak ada, gunakan autentikasi anonim sebagai fallback
            await signInAnonymously(mainAuth);
            console.log('[Main App] Firebase auth (anonymous) successful.');
        }
		
		
		
		
		// --- Tampilkan Elemen UI (Tombol dan Bintang) setelah Autentikasi dan Delay ---
        const homesElement = document.getElementById('homes');
        const starElement = document.getElementById('yourstar'); // Ambil elemen bintang SVG
        const eyesElement = document.getElementById('eyes'); // Ambil elemen bintang SVG stars
 		const starsElement = document.getElementById('stars'); // Ambil elemen bintang SVG stars
		const linesElement = document.getElementById('lines'); // Ambil elemen bintang SVG stars sectionis		 
		const sectionisElement = document.getElementById('sectionis'); // Ambil elemen bintang SVG

		 
		 
        if (homesElement || starElement) { 
            // Memberikan penundaan 500ms agar kemunculan elemen terasa lebih lambat dan halus.
            setTimeout(() => {
                if (homesElement) {
                    homesElement.classList.remove('hidden');
                    console.log('[Main App] Tombol Home ditemukan dan kelas "hidden" telah dihapus setelah delay 500ms.');
                }
                if (starElement) {
                    starElement.classList.remove('hidden'); // Hapus kelas 'hidden' dari bintang SVG
                    console.log('[Main App] Bintang SVG ditemukan dan kelas "hidden" telah dihapus setelah delay 500ms.');
                }
				if (eyesElement) {
                    eyesElement.classList.remove('hidden'); // Hapus kelas 'hidden' dari bintang SVG
                    console.log('[Main App] Bintang SVG ditemukan dan kelas "hidden" telah dihapus setelah delay 500ms.');
                }
                if (starsElement) {
                    starsElement.classList.remove('hidden'); // Hapus kelas 'hidden' dari bintang SVG
                    console.log('[Main App] Bintang SVG ditemukan dan kelas "hidden" telah dihapus setelah delay 500ms.');
                }
                if (linesElement) {
                    linesElement.classList.remove('hidden'); // Hapus kelas 'hidden' dari bintang SVG
                    console.log('[Main App] Bintang SVG ditemukan dan kelas "hidden" telah dihapus setelah delay 500ms.');
                }		
				if (sectionisElement) {
                    sectionisElement.classList.remove('hidden'); // Hapus kelas 'hidden' dari bintang SVG
                    console.log('[Main App] Bintang SVG ditemukan dan kelas "hidden" telah dihapus setelah delay 500ms.');
                }		
            }, 800); // Penundaan 500 milidetik
        } else {
            console.error('[Main App] GAGAL KRITIS: Elemen tombol Home ("homes") dan Bintang ("yourstar") TIDAK ditemukan di DOM.');
        }
        // ------------------------------------------------------------------------------------------

		
		
		
		
		

        // Panggil listener real-time SETELAH otentikasi awal selesai.
        startMainAppRealtimeListeners();  


        // Listener perubahan status autentikasi (HANYA untuk UI/status user)
        onAuthStateChanged(mainAuth, (user) => {
            if (user) {
                mainUserId = user.uid;
                authButton.textContent = 'Keluar (UID: ' + mainUserId.substring(0, 4) + '...)';
                authButton.classList.remove('bg-green-500', 'hover:bg-green-600');
                authButton.classList.add('bg-red-500', 'hover:bg-red-600');
                console.log(`[Main App] User is signed in. UID: ${mainUserId}`);
            } else {
                mainUserId = null;
                authButton.textContent = 'Masuk / Daftar';
                authButton.classList.remove('bg-red-500', 'hover:bg-red-600');
                authButton.classList.add('bg-green-500', 'hover:bg-green-600');
                console.log('[Main App] User is signed out.');
            }
            // Panggil pembaruan UI pesan promosi setiap kali status auth berubah
            if (globalPromoMessage) {
                updatePromoTextUI(globalPromoMessage);
            }
        });

        // Setup tombol Login/Logout
        authButton.addEventListener('click', async () => {
            if (mainAuth.currentUser) {
                try {
                    await signOut(mainAuth);
                    console.log('[Main App] Sign out successful.');
                } catch (error) {
                    console.error('[Main App] Error signing out:', error);
                }
            } else {
                try {
                    await signInAnonymously(mainAuth);
                    console.log('[Main App] Signed in anonymously.');
                } catch (error) {
                    console.error('[Main App] Error signing in anonymously:', error);
                }
            }
        });


    } catch (error) {
        console.error("[Main App] Error initializing Firebase or auth: ", error);
    }
}

/**
 * Fungsi utama yang dipanggil saat DOM siap. 
 * Menginisialisasi kedua instance Firebase: Main App dan External Counter.
 */
function initializeAllApps() {
    initializeMainFirebaseApp();
    initializeExternalVisitorCounter();
}

document.addEventListener('DOMContentLoaded', initializeAllApps);

function enforceCleanUrl() {
const currentPath = window.location.pathname;
const currentUrl = window.location.href;    
if (currentPath.endsWith('/') && currentPath.length > 1) {
const cleanPath = currentPath.replace(/\/+$/, '');        
const cleanUrl = window.location.origin + cleanPath + window.location.search + window.location.hash;
console.log(`URL Found slash at the end: ${currentUrl}`);
console.log(`Change URL without reloading: ${cleanUrl}`);        
history.replaceState(null, null, cleanUrl);}  
else {console.log(`URL is clean or root URL: ${currentUrl}`);}}
document.addEventListener('DOMContentLoaded', enforceCleanUrl);  
