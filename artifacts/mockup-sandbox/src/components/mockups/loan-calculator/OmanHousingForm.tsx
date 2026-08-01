import { useState } from "react";
import { Menu, Search, ChevronUp, ChevronDown } from "lucide-react";

type SelectFieldProps = {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  ariaLabel: string;
};

function SelectField({
  value,
  onChange,
  options,
  ariaLabel,
}: SelectFieldProps) {
  return (
    <div className="relative">
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="loan-select"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="select-arrows" aria-hidden="true">
        <ChevronUp size={10} strokeWidth={2.2} />
        <ChevronDown size={10} strokeWidth={2.2} />
      </span>
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

export function OmanHousingForm() {
  const [loanType, setLoanType] = useState("شراء منزل وإكمله");
  const [ageLimit, setAgeLimit] = useState("متقاعد - حد أقصى 70");
  const [loanTerm, setLoanTerm] = useState("21 سنة (252 شهر)");
  const [housingType, setHousingType] = useState("سكني");
  const [salary, setSalary] = useState("500");
  const [commitments, setCommitments] = useState("0");
  const [amount, setAmount] = useState("60000");
  const [installment, setInstallment] = useState("اختياري");
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
        .header-icon {
          color: #f5f5f5;
          display: block;
        }
        .menu-icon {
          width: 28px;
          height: 28px;
        }
        .search-icon {
          width: 22px;
          height: 22px;
        }
        .bank-brand {
          display: flex;
          direction: ltr;
          align-items: center;
          gap: 12px;
          text-align: right;
        }
        .bank-emblem {
          width: 62px;
          height: 62px;
          position: relative;
          flex: 0 0 auto;
          border: 1px solid #a5a5a5;
          border-radius: 17px;
          transform: rotate(30deg);
          opacity: .9;
        }
        .bank-emblem::before,
        .bank-emblem::after {
          content: "";
          position: absolute;
          inset: 7px;
          border: 1px solid #949494;
          border-radius: 13px;
        }
        .bank-emblem::after {
          inset: 15px;
          border-radius: 9px;
        }
        .bank-emblem-mark {
          position: absolute;
          z-index: 1;
          inset: 0;
          display: grid;
          place-items: center;
          color: #bdbdbd;
          font-size: 22px;
          font-weight: 700;
          transform: rotate(-30deg);
        }
        .bank-name {
          line-height: 1.1;
          white-space: nowrap;
        }
        .bank-name-ar {
          font-size: 19px;
          margin-bottom: 4px;
          letter-spacing: -.3px;
        }
        .bank-name-en {
          direction: ltr;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: .15px;
        }
        .loan-content {
          width: calc(100% - 38px);
          min-height: calc(100vh - 92px);
          margin: 0 auto;
          padding: 22px 24px 12px;
          background: #fbfbfb;
          border-right: 1px solid #d6d6d6;
          border-left: 1px solid #d6d6d6;
        }
        .field-group {
          margin-bottom: 17px;
        }
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
          width: 23px;
          height: 23px;
          border: 2px solid #737373;
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
        }
        .radio-option input:checked {
          border-color: #159ce2;
          box-shadow: inset 0 0 0 5px #159ce2;
        }
        .loan-select,
        .text-input {
          width: 100%;
          height: 44px;
          border: 1px solid var(--peach-line);
          border-radius: 24px;
          outline: none;
          background: #ededed;
          color: #343434;
          font-family: Tahoma, Arial, sans-serif;
          font-size: 15px;
          transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
        }
        .loan-select {
          appearance: none;
          cursor: pointer;
          padding: 0 13px 0 42px;
          text-align: right;
        }
        .loan-select:focus,
        .text-input:focus {
          border-color: #8a6558;
          background: #f3f3f3;
          box-shadow: 0 0 0 3px rgba(189, 146, 126, .16);
        }
        .select-arrows {
          position: absolute;
          top: 50%;
          left: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 15px;
          height: 25px;
          color: #171717;
          transform: translateY(-50%);
          pointer-events: none;
        }
        .text-input {
          display: block;
          border-color: var(--line);
          border-radius: 0;
          background: #fff;
          padding: 0 12px;
          text-align: right;
          direction: rtl;
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
        .money-input-wrap {
          position: relative;
        }
        .money-input-wrap .text-input {
          direction: ltr;
          text-align: right;
          padding-right: 13px;
        }
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
        .calculate-button:hover {
          filter: brightness(.98);
        }
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
        .support-bot {
          position: fixed;
          z-index: 3;
          right: 26px;
          bottom: 10px;
          width: 78px;
          height: 78px;
          border: 0;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 1px 9px rgba(0,0,0,.18);
          cursor: pointer;
          animation: bot-float 2.8s ease-in-out infinite;
        }
        .notification-badge {
          position: absolute;
          z-index: 4;
          top: -5px;
          right: 1px;
          width: 22px;
          height: 22px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #fff;
          background: #ec0808;
          font-family: Arial, sans-serif;
          font-size: 13px;
          font-weight: 700;
        }
        .bot-face {
          position: absolute;
          left: 20px;
          top: 23px;
          width: 38px;
          height: 31px;
          border: 2px solid #b68a00;
          border-radius: 11px 11px 14px 14px;
          background: #f5c928;
        }
        .bot-face::before {
          content: "";
          position: absolute;
          inset: 4px 5px 6px;
          border-radius: 6px;
          background: #252525;
        }
        .bot-eye {
          position: absolute;
          z-index: 1;
          top: 11px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #fff;
        }
        .bot-eye-left { left: 11px; }
        .bot-eye-right { right: 11px; }
        .bot-mouth {
          position: absolute;
          z-index: 1;
          left: 15px;
          bottom: 6px;
          width: 8px;
          height: 3px;
          border-bottom: 1px solid #fff;
          border-radius: 50%;
        }
        .bot-antenna {
          position: absolute;
          top: 16px;
          left: 38px;
          width: 2px;
          height: 8px;
          background: #b68a00;
        }
        .bot-antenna::before {
          content: "";
          position: absolute;
          top: -4px;
          left: -3px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #b68a00;
        }
        .bot-side {
          position: absolute;
          top: 28px;
          width: 11px;
          height: 20px;
          border: 3px solid #e6a400;
          border-radius: 50%;
        }
        .bot-side-left { left: 11px; border-right-color: #14a6dc; }
        .bot-side-right { right: 11px; border-left-color: #14a6dc; }
        @keyframes bot-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes calculate-pulse {
          from { filter: brightness(1); }
          to { filter: brightness(1.08); }
        }
        @media (max-width: 430px) {
          .bank-header { padding: 0 28px; }
          .header-actions { gap: 28px; }
          .bank-emblem { width: 54px; height: 54px; }
          .bank-name-ar { font-size: 17px; }
          .bank-name-en { font-size: 12px; }
          .loan-content { width: calc(100% - 30px); padding: 21px 17px 10px; }
          .field-label { font-size: 23px; }
          .radio-row { font-size: 22px; }
          .support-bot { right: 22px; }
        }
      `}</style>

      <header className="bank-header">
        <div className="header-actions" aria-label="أدوات الموقع">
          <Menu className="header-icon menu-icon" strokeWidth={2.1} />
          <Search className="header-icon search-icon" strokeWidth={3} />
        </div>
        <div className="bank-brand">
          <div className="bank-emblem" aria-hidden="true">
            <span className="bank-emblem-mark">ن</span>
          </div>
          <div className="bank-name">
            <div className="bank-name-ar">بنك الإسكان العماني</div>
            <div className="bank-name-en">OMAN HOUSING BANK</div>
          </div>
        </div>
      </header>

      <section className="loan-content">
        <div className="field-group">
          <label className="field-label">نوع القرض:</label>
          <div className="radio-row">
            <label className="radio-option">
              <span>سكني</span>
              <input
                type="radio"
                name="housing-type"
                value="سكني"
                checked={housingType === "سكني"}
                onChange={() => setHousingType("سكني")}
              />
            </label>
            <label className="radio-option">
              <span>المدن المتكاملة</span>
              <input
                type="radio"
                name="housing-type"
                value="المدن المتكاملة"
                checked={housingType === "المدن المتكاملة"}
                onChange={() => setHousingType("المدن المتكاملة")}
              />
            </label>
          </div>
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="loan-type">الهدف من القرض:</label>
          <SelectField
            ariaLabel="الهدف من القرض"
            value={loanType}
            onChange={setLoanType}
            options={["شراء منزل وإكمله", "بناء منزل", "ترميم منزل"]}
          />
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="age-limit">الحد الأقصى للعمر:</label>
          <SelectField
            ariaLabel="الحد الأقصى للعمر"
            value={ageLimit}
            onChange={setAgeLimit}
            options={["متقاعد - حد أقصى 70", "موظف - حد أقصى 60", "موظف - حد أقصى 65"]}
          />
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="loan-term">مدة القرض:</label>
          <SelectField
            ariaLabel="مدة القرض"
            value={loanTerm}
            onChange={setLoanTerm}
            options={["21 سنة (252 شهر)", "15 سنة (180 شهر)", "10 سنوات (120 شهر)"]}
          />
        </div>

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
              onChange={(event) => setSalary(event.target.value)}
            />
          </div>
        </div>

        <div className="field-group">
          <label className="field-label money-label">
            الاستقطاعات (<CurrencyMark />):
          </label>
          <input
            className="text-input"
            aria-label="الاستقطاعات"
            inputMode="numeric"
            value={commitments}
            onChange={(event) => setCommitments(event.target.value)}
          />
        </div>

        <div className="field-group">
          <label className="field-label money-label">
            مبلغ القرض المطلوب (<CurrencyMark />):
          </label>
          <input
            className="text-input"
            aria-label="مبلغ القرض المطلوب"
            inputMode="numeric"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="installment">الأقساط (EMI):</label>
          <SelectField
            ariaLabel="الأقساط"
            value={installment}
            onChange={setInstallment}
            options={["اختياري", "شهري", "ربع سنوي"]}
          />
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