export default function PaymentPage() {
  return (
    <main className="route-shell">
      <nav className="nav wrap">
        <a className="brand" href="/">
          evently<span>.</span>
        </a>
        <span className="secure-label">Secure checkout · 09:42 remaining</span>
      </nav>
      <section className="payment-wrap wrap">
        <div className="payment-main">
          <a className="back-link" href="/events/aurora-nights">
            ← Back to event
          </a>
          <p className="eyebrow">STEP 2 OF 2</p>
          <h1>
            Complete your
            <br />
            <em>booking.</em>
          </h1>
          <div className="payment-tabs">
            <button className="selected">Card payment</button>
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
          <button className="button payment-button">
            Pay ৳ 1,200 <span>→</span>
          </button>
          <p className="payment-note">
            Payments are securely processed by SSL Commerz sandbox.
          </p>
        </div>
        <aside className="order-summary">
          <p className="eyebrow">YOUR ORDER</p>
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
