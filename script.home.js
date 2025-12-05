import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, onSnapshot, setDoc, doc, query, getDocs, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// setLogLevel('debug'); // KOMENTARI ATAU HAPUS INI SEBELUM OBFUSCATION

// --- 1. PENGAMBILAN VARIABEL GLOBAL (Versi Paling Aman) ---
// Gunakan pengecekan standard 'typeof' yang lebih aman daripada 'globalThis'
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfigRaw = typeof __firebase_config !== 'undefined' ? __firebase_config : null;

let firebaseConfig = null;
let app, db, auth;
let currentUserId = null; 




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
