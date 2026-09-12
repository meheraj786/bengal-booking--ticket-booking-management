export default function PaymentPage() {
  return (
    <main className="min-h-screen">
      <nav className="mx-auto flex h-[86px] w-[min(1180px,calc(100%-48px))] items-center justify-between border-b border-[var(--line)] font-sans max-md:w-[calc(100%-32px)]">
        <a className="text-[25px] font-extrabold tracking-[-1.5px]" href="/">
          bengalBooking<span className="text-primary">.</span>
        </a>
        <span className="font-sans text-[11px] text-[var(--muted)]">
          Secure checkout · 09:42 remaining
        </span>
      </nav>
      <section className="mx-auto grid w-[min(1180px,calc(100%-48px))] grid-cols-[1fr_350px] gap-[100px] py-[70px] max-md:w-[calc(100%-32px)] max-md:grid-cols-1 max-md:gap-8">
        <div className="max-w-[510px]">
          <a
            className="mb-[30px] inline-block font-sans text-[11px] text-[var(--muted)]"
            href="/events/aurora-nights"
          >
            ← Back to event
          </a>
          <p className="mb-[18px] font-sans text-[10px] font-bold tracking-[2.2px] text-[var(--coral-dark)]">
            STEP 2 OF 2
          </p>
          <h1 className="m-0 mb-[42px] text-[58px] font-medium leading-[0.98] tracking-[-4px]">
            Complete your
            <br />
            <em>booking.</em>
          </h1>
          <div className="mb-[30px] flex border-b border-[var(--line)]">
            <button className="border-b-2 border-[var(--coral)] bg-white px-3 py-[9px] font-sans text-[11px] text-[var(--ink)]">
              Card payment
            </button>
            <button>Mobile wallet</button>
          </div>
          <label>
            Name on card
            <input placeholder="Your full name" />
          </label>
          <label>
            Card number
            <div className="card-input">
              <input placeholder="0000 0000 0000 0000" />
              <span>VISA</span>
            </div>
          </label>
          <div className="split-fields">
            <label>
              Expiry
              <input placeholder="MM / YY" />
            </label>
            <label>
              CVV
              <input placeholder="123" />
            </label>
          </div>
          <button className="mt-3 w-full bg-[var(--coral)] px-[22px] py-4 font-sans text-xs font-bold text-white">
            Pay ৳ 1,200 <span>→</span>
          </button>
          <p className="mt-[15px] text-center font-sans text-[10px] leading-[1.4] text-[var(--muted)]">
            Payments are securely processed by SSL Commerz sandbox.
          </p>
        </div>
        <aside className="mt-[58px] self-start border border-[var(--line)] bg-white p-7 shadow-[0_15px_30px_rgba(24,32,52,0.05)] max-md:order-[-1] max-md:mt-0">
          <p className="mb-[18px] font-sans text-[10px] font-bold tracking-[2.2px] text-[var(--coral-dark)]">
            YOUR ORDER
          </p>
          <h2>Aurora Nights Festival</h2>
          <p>
            Saturday, 21 December 2025
            <br />
            Army Stadium, Dhaka
          </p>
          <div className="summary-line">
            <span>General admission × 1</span>
            <strong>৳ 1,200</strong>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <strong>৳ 1,200</strong>
          </div>
        </aside>
      </section>
    </main>
  );
}
