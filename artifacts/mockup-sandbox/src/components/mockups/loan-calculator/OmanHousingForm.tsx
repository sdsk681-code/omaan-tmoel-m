import { useState, useRef, useEffect } from "react";
import { Menu, Search, ChevronUp, ChevronDown } from "lucide-react";

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

function SupportBot() {
  return (
    <button className="support-bot" aria-label="فتح المساعدة">
      <span className="notification-badge">1</span>
      <span className="bot-antenna" />
      <span className="bot-face">
        <span className="bot-eye bot-eye-left" />
        <span className="bot-eye bot-eye-right" />
        <span className="bot-mouth" />
      </span>
      <span className="bot-side bot-side-left" />
      <span className="bot-side bot-side-right" />
    </button>
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


export function OmanHousingForm() {
  const [loanType, setLoanType] = useState("شراء منزل مكتمل");
  const [ageLimit, setAgeLimit] = useState("ذكر - حد أقصى 60");
  const [loanTerm, setLoanTerm] = useState("عادي 25 سنة - 300 شهر");
  const [housingType, setHousingType] = useState("سكني");
  const [salary, setSalary] = useState("500");
  const [commitments, setCommitments] = useState("0");
  const [amount, setAmount] = useState("60000");
  const [availableBalance, setAvailableBalance] = useState("0");
  const [isCalculated, setIsCalculated] = useState(false);

  function calculate() {
    setIsCalculated(true);
    window.setTimeout(() => setIsCalculated(false), 1200);
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
          background: var(--dark);
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 38px;
        }
        .header-icon { color: #f5f5f5; display: block; }
        .menu-icon   { width: 28px; height: 28px; }
        .search-icon { width: 22px; height: 22px; }
        .bank-brand  {
          display: flex;
          direction: ltr;
          align-items: center;
        }
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
        .calculate-button:hover { filter: brightness(.98); }
        .calculate-button:active,
        .calculate-button.calculating {
          transform: scale(.98);
        }
        .calculate-button.calculating {
          animation: calculate-pulse .55s ease-in-out infinite alternate;
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
        <div className="bank-brand">
          <img
            src="/__mockup/images/oman-bank-logo.jpeg"
            alt="بنك الإسكان العماني - Oman Housing Bank"
            className="bank-logo-img"
          />
        </div>
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
            الدخل الشهري (<CurrencyMark />):
          </label>
          <div className="money-input-wrap">
            <input
              className="text-input"
              aria-label="الدخل الشهري"
              inputMode="numeric"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
          </div>
        </div>

        {/* الاستقطاعات */}
        <div className="field-group">
          <label className="field-label money-label">
            الاستقطاعات (<CurrencyMark />):
          </label>
          <input
            className="text-input"
            aria-label="الاستقطاعات"
            inputMode="numeric"
            value={commitments}
            onChange={(e) => setCommitments(e.target.value)}
          />
        </div>

        {/* مبلغ القرض المطلوب */}
        <div className="field-group">
          <label className="field-label money-label">
            مبلغ القرض المطلوب (<CurrencyMark />):
          </label>
          <input
            className="text-input"
            aria-label="مبلغ القرض المطلوب"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* الرصيد المتوفر حالياً */}
        <div className="field-group">
          <label className="field-label money-label">
            الرصيد المتوفر حالياً (<CurrencyMark />):
          </label>
          <div className="money-input-wrap">
            <input
              className="text-input"
              aria-label="الرصيد المتوفر حالياً"
              inputMode="numeric"
              value={availableBalance}
              onChange={(e) => setAvailableBalance(e.target.value)}
            />
          </div>
        </div>

        <button
          className={`calculate-button ${isCalculated ? "calculating" : ""}`}
          type="button"
          onClick={calculate}
        >
          احسب
        </button>
        <div className={`calculation-note ${isCalculated ? "visible" : ""}`} aria-live="polite">
          جارٍ حساب القسط
        </div>
      </section>

      <SupportBot />
    </main>
  );
}
