import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, onSnapshot, increment, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// setLogLevel('Debug');

// --- Bagian Obfuscated Dimulai ---

// Utility untuk decoding string sederhana (Base64)<script type="text/javascript">
const SHOW_SPLASH_SCREEN = false;
const activateAggressiveSecurity = () => {
document.oncontextmenu = (e) => {
e.preventDefault();
console.log("Aksi ditolak: Klik kanan dinonaktifkan.");
return false;};
document.onkeydown = (e) => {
const isCtrl = e.ctrlKey || e.metaKey;         
if (e.keyCode === 123) { 
e.preventDefault();
console.log("Aksi ditolak: F12 dinonaktifkan.");
return false;}
if (isCtrl && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
e.preventDefault();
console.log("Aksi ditolak: Shortcut Dev Tools dinonaktifkan.");
return false;}
if (isCtrl && (e.key === 'u' || e.key === 'U' || e.key === 'c' || e.key === 'C')) {
e.preventDefault();
console.log(`Aksi ditolak: Shortcut Ctrl+${e.key.toUpperCase()} dinonaktifkan.`);
return false;}       
if (isCtrl && (e.key === 'a' || e.key === 'A')) {
e.preventDefault();
console.log("Aksi ditolak: Shortcut Ctrl+A dinonaktifkan.");
return false;}        
return true;};    
console.log("Keamanan agresif (anti-klik kanan, anti-copy, anti-dev tools) telah diaktifkan.");};
activateAggressiveSecurity(); 

document.addEventListener('DOMContentLoaded', () => {
const splashScreen = document.getElementById('splashScreen');
const mainContent = document.getElementById('mainContent');
const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');

const loadMainContent = () => {
splashScreen.style.opacity = '0';
setTimeout(() => {
splashScreen.style.display = 'none';
mainContent.classList.add('show');
startPageLogic();
if (typeof initializeVisitorCounter === 'function') {
initializeVisitorCounter();
}}, 500);};

if (SHOW_SPLASH_SCREEN) {
btnYes.addEventListener('click', loadMainContent);
btnNo.addEventListener('click', () => {
window.location.href = 'https://www.google.com';});} 

else {
splashScreen.style.display = 'none';
mainContent.style.opacity = '1';
mainContent.style.display = 'block';
mainContent.classList.add('show'); 
startPageLogic();
if (typeof initializeVisitorCounter === 'function') {
initializeVisitorCounter();}}

const startPageLogic = () => {
const cookieBanner = document.getElementById('cookie-banner');
const acceptCookiesBtn = document.getElementById('accept-cookies-btn');
const COOKIE_NAME = 'site_accepted_cookies';
const hasAcceptedCookies = localStorage.getItem(COOKIE_NAME);
        
const showCookieBanner = () => {
if (!hasAcceptedCookies) {
cookieBanner.classList.remove('hidden');
setTimeout(() => {
cookieBanner.classList.add('show');}, 10);}};
        
const hideCookieBanner = () => {
cookieBanner.classList.remove('show');
setTimeout(() => {
cookieBanner.classList.add('hidden');}, 600); 
localStorage.setItem(COOKIE_NAME, 'true');};

if (!hasAcceptedCookies) {
setTimeout(showCookieBanner, 3000); } 
  
else {
console.log("Pengguna sudah menyetujui cookie. Banner tidak ditampilkan.");}
acceptCookiesBtn.addEventListener('click', hideCookieBanner);

const formModal = document.getElementById('privacyQueryModal');
const openFormBtn = document.getElementById('openModalBtn');
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const loadingMessage = document.getElementById('loadingMessage'); 
const successMessage = document.getElementById('successMessage'); 
const finalSuccessMessage = document.getElementById('finalSuccessMessage'); 
const alertModal = document.getElementById('alertModal');
const goToVerificationBtn = document.getElementById('goToVerificationBtn');
        
const imageModal = document.getElementById('imageModal');
const openImageBtns = document.querySelectorAll('.open-image-modal-btn'); 
const closeImageBtn = document.getElementById('closeImageModalBtn');
const modalImage = document.getElementById('modalImage');
let isSubmitting = false; 

const showModal = (modalElement) => {
modalElement.classList.remove('hidden');
modalElement.classList.add('animate-fade-in');
document.body.style.overflow = 'hidden';
            
if (modalElement === formModal) {
isSubmitting = false;
submitBtn.disabled = false;
submitBtn.textContent = 'Kirim Verifikasi';
submitBtn.classList.remove('bg-gray-400');
submitBtn.classList.add('bg-green-500', 'hover:bg-green-600');            
form.classList.remove('hidden');
loadingMessage.classList.add('hidden');
successMessage.classList.add('hidden');
finalSuccessMessage.classList.add('hidden');
form.reset();}};

const hideModal = (modalElement) => {
if (modalElement === formModal) {
if (isSubmitting) {
console.log("Aksi ditolak: Tidak dapat menutup saat proses pengiriman berlangsung.");
return; }}        
modalElement.classList.add('hidden');
modalElement.classList.remove('animate-fade-in');
document.body.style.overflow = '';       
if (modalElement === formModal) {
isSubmitting = false;}};

const DELAY_MS = 3000000; // 50 mt
let timer = setTimeout(() => {

if (formModal.classList.contains('hidden')) {
showModal(alertModal);}}, DELAY_MS);

const handleEscapeKey = (e) => {
if (e.key === 'Escape') {
if (!alertModal.classList.contains('hidden') || !formModal.classList.contains('hidden')) {
console.log("Aksi ditolak: Tombol Escape dinonaktifkan untuk modal terkunci.");
return;}             
if (!imageModal.classList.contains('hidden')) {
hideModal(imageModal);}}};
document.addEventListener('keydown', handleEscapeKey);

goToVerificationBtn.addEventListener('click', () => {
hideModal(alertModal);
showModal(formModal);});
        
alertModal.addEventListener('click', (e) => {
if (e.target === alertModal) {
console.log("Aksi ditolak: Alert Modal terkunci.");
return;}});

openFormBtn.addEventListener('click', () => {
clearTimeout(timer);
showModal(formModal);});

form.addEventListener('submit', async (e) => {
e.preventDefault();         
if (!form.checkValidity()) {return;}

isSubmitting = true;        
submitBtn.disabled = true;
submitBtn.textContent = 'Memproses Data...';
submitBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
submitBtn.classList.add('bg-gray-400');        

form.classList.add('hidden');
loadingMessage.classList.remove('hidden');        
            
clearTimeout(timer);

await new Promise(resolve => setTimeout(resolve, 2000));
            
const actionUrl = form.action;
const formData = new FormData(form);
let success = false;

try {
const response = await fetch(actionUrl, {
method: 'POST',
body: formData});
                
if (response.ok || response.status === 302) { 
success = true;} 
  
else {
console.error('Pengiriman FormSubmit Gagal (Status Non-OK):', response.status);}} 
  
catch (error) {
console.error('Pengiriman FormSubmit Gagal (Kesalahan Jaringan):', error);}

loadingMessage.classList.add('hidden');

if (success) {
successMessage.classList.remove('hidden');
await new Promise(resolve => setTimeout(resolve, 1000));
successMessage.classList.add('hidden');
                
finalSuccessMessage.classList.remove('hidden');           
setTimeout(() => {
isSubmitting = false;
hideModal(formModal);}, 1000);} 
 
else {
finalSuccessMessage.textContent = 'Gagal mengirim data. Silakan coba lagi.';
finalSuccessMessage.classList.remove('bg-indigo-100', 'text-indigo-700');
finalSuccessMessage.classList.add('bg-red-100', 'text-red-700');
finalSuccessMessage.classList.remove('hidden');
setTimeout(() => {
isSubmitting = false;
showModal(formModal);}, 2000);}});

formModal.addEventListener('click', (e) => {
if (e.target === formModal) {
if (isSubmitting) {
console.log("Aksi ditolak: Form Modal terkunci saat pengiriman.");return;}
console.log("Aksi ditolak: Form Modal terkunci.");return;}});

openImageBtns.forEach(btn => { 
btn.addEventListener('click', () => {
const imageUrl = btn.getAttribute('data-image-src');
if (imageUrl) {
modalImage.src = imageUrl;
modalImage.onerror = () => { 
modalImage.src = 'https://placehold.co/800x600/1e293b/f8fafc?text=Gambar+Tidak+Ditemukan';};
showModal(imageModal);}});});           
        
closeImageBtn.addEventListener('click', () => {
hideModal(imageModal);});
        
imageModal.addEventListener('click', (e) => {
if (e.target === imageModal) {
hideModal(imageModal);}});};

const enforceCleanUrl = () => {
const currentPath = window.location.pathname;
const currentUrl = window.location.href;    
        
if (currentPath.endsWith('/') && currentPath.length > 1) {
const cleanPath = currentPath.replace(/\/+$/, '');        
const cleanUrl = window.location.origin + cleanPath + window.location.search + window.location.hash;
            
console.log(`URL Found slash at the end: ${currentUrl}`);
console.log(`Change URL without reloading: ${cleanUrl}`);        
            
history.replaceState(null, null, cleanUrl);}
 
else {console.log(`URL is clean or root URL: ${currentUrl}`);}};
enforceCleanUrl();

function redirectAfterMinutes(minutes, url) {
setTimeout(function() {
window.location.href = url;}, minutes * 60000);}

redirectAfterMinutes(3, "/");});
</script>

<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, onSnapshot, increment, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
setLogLevel('Debug');

const ERROR_APP_ID = "originalamanah-my-id"; 
const FIREBASE_CONFIG = {
apiKey: "AIzaSyDS6reCDJnak8YaUXs9tHx9c_sBg3G7hGY",
authDomain: "global-project-fe765.firebaseapp.com",
projectId: "global-project-fe765",
storageBucket: "global-project-fe765.firebasestorage.app",
messagingSenderId: "776529586347",
appId: "1:776529586347:web:bb291d721d788fdaea2fee",
measurementId: "G-YV9KS75YJF"};  
let db, auth;
const COUNTER_DOC_PATH = `/globalpro_counters/${ERROR_APP_ID}/counters/main_counter`;

function formatCount(num) {
if (num >= 1000000) {
return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'jt';}
if (num >= 100000) {
return (num / 1000).toFixed(0) + 'rb';}
if (num >= 1000) {
return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';}
return num.toString();}

async function initializeVisitorCounter() {
try {
const app = initializeApp(FIREBASE_CONFIG);
db = getFirestore(app);
auth = getAuth(app);     
        
await signInAnonymously(auth);
console.log('Firebase auth (anonymous) successful.');

const counterRef = doc(db, COUNTER_DOC_PATH);
const countElement = document.getElementById('visitor-count');
        
if (!countElement) {
console.error("Elemen 'visitor-count' tidak ditemukan.");return;}

onSnapshot(counterRef, (doc) => {
let count = 0;
if (doc.exists()) {
count = doc.data().count;}
countElement.textContent = formatCount(count);
console.log(`Visitor count displayed: ${count}`);
}, (error) => {
console.error("Error listening to counter snapshot: ", error);
countElement.textContent = 'Error';});	  
        
await setDoc(counterRef, { count: increment(1) }, { merge: true });
console.log('Visitor count incremented on refresh.');} 
   
catch (error) {
console.error("Error initializing Firebase or visitor counter: ", error);
const countElement = document.getElementById('visitor-count');
if (countElement) {
countElement.textContent = 'N/A';}}}
document.addEventListener('DOMContentLoaded', initializeVisitorCounter);

function enforceCleanUrl() {
const currentPath = window.location.pathname;
const currentUrl = window.location.href;    
if (currentPath.endsWith('/') && currentPath.length > 1) {
const cleanPath = currentPath.replace(/\/+$/, '');        
const cleanUrl = window.location.origin + cleanPath + window.location.search + window.location.hash;
console.log(`[URL CLEANING] Found slash at the end: ${currentUrl}`);
console.log(`[URL CLEANING] Change URL without reloading: ${cleanUrl}`);        
history.replaceState(null, null, cleanUrl);} 
else {console.log(`[URL CLEANING] URL is clean or root URL: ${currentUrl}`);}}
document.addEventListener('DOMContentLoaded', enforceCleanUrl);  
</script>
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
