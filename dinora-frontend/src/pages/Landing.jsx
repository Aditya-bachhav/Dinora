import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IconTable, IconOrders, IconCard, IconMenu, IconUsers } from "../components/ui/Icons";
import Spotlight from "../components/ui/Spotlight";
import Reveal from "../components/ui/Reveal";

function PhoneMock() {
  return (
    <div className="ld-phone">
      <div className="ld-phone-notch" />
      <div className="ld-phone-screen">
        <div className="ld-phone-topbar">
          <span>Table 4</span>
          <span className="ld-phone-live">● live</span>
        </div>
        <div className="ld-phone-item">
          <div className="ld-phone-item-thumb" />
          <div className="ld-phone-item-text">
            <strong>Hyderabadi biryani</strong>
            <span>₹320</span>
          </div>
          <div className="ld-phone-qty">2</div>
        </div>
        <div className="ld-phone-item">
          <div className="ld-phone-item-thumb" />
          <div className="ld-phone-item-text">
            <strong>Masala lemonade</strong>
            <span>₹90</span>
          </div>
          <div className="ld-phone-qty">1</div>
        </div>
        <div className="ld-phone-toast">
          <span className="ld-phone-dot" />
          Order sent to kitchen
        </div>
        <div className="ld-phone-cta">Place order · ₹730</div>
      </div>
    </div>
  );
}

const STEPS = [
  {
    title: "Guest scans the table",
    body: "No app to install. The code on the table opens straight to that table's menu.",
  },
  {
    title: "Order goes straight to the kitchen",
    body: "It lands on your live dashboard the moment it's placed — no runner, no shouting across the pass.",
  },
  {
    title: "Your staff move it along",
    body: "Preparing, ready, served — set by whoever's actually holding the plate, not a timer guessing at it.",
  },
];

const FEATURES = [
  {
    icon: <IconOrders />,
    title: "A live floor, not a refresh button",
    body: "Every order streams to your dashboard the second it's placed, and every status change staff make streams back to the guest's phone.",
    big: true,
  },
  {
    icon: <IconTable />,
    title: "One QR code per table",
    body: "Generate and print table codes in seconds — each one opens straight to that table's own menu and running order.",
  },
  {
    icon: <IconMenu />,
    title: "Menu changes go live instantly",
    body: "86 a dish or change a price and it's reflected for every guest browsing right now.",
  },
  {
    icon: <IconCard />,
    title: "Payouts go to your account",
    body: "Connect your own Razorpay account so payments settle to your bank, not a shared platform account.",
  },
  {
    icon: <IconUsers />,
    title: "A real profile, not just a login",
    body: "Crew size, restaurant type, seating — Dinora actually knows what kind of place it's running for.",
  },
];

export default function Landing() {
  return (
    <div className="ld-page">
      <header className="ld-nav">
        <div className="ld-nav-inner">
          <div className="ld-nav-brand">
            <span className="ld-nav-mark">D</span>
            Dinora
          </div>
          <nav className="ld-nav-links">
            <a href="#how-it-works">How it works</a>
            <a href="#features">Features</a>
          </nav>
          <div className="ld-nav-actions">
            <Link to="/admin/login" className="ld-nav-signin">Sign in</Link>
            <Link to="/admin/register" className="btn btn-primary btn-sm">Set up your restaurant</Link>
          </div>
        </div>
      </header>

      <section className="ld-hero">
        <div className="ld-hero-grid" aria-hidden="true" />
        <Spotlight className="ld-hero-spotlight" size={560} />
        <div className="ld-hero-inner">
          <motion.div
            className="ld-hero-copy"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1>The menu is now the order.</h1>
            <p className="ld-hero-sub">
              Guests scan, browse, and order from their own phone. Your kitchen sees it the
              instant it's placed. Dinora is the ordering layer for restaurants that would
              rather staff be on the floor than running back and forth.
            </p>
            <div className="ld-hero-actions">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ display: "inline-block" }}>
                <Link to="/admin/register" className="btn btn-primary">Set up your restaurant</Link>
              </motion.div>
              <a href="#how-it-works" className="ld-hero-secondary">See how it works</a>
            </div>
          </motion.div>
          <motion.div
            className="ld-hero-visual"
            initial={{ opacity: 0, y: 18, rotate: 8 }}
            animate={{ opacity: 1, y: 0, rotate: 3 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <PhoneMock />
          </motion.div>
        </div>
      </section>

      <section className="ld-strip">
        <div className="ld-strip-inner">
          {[
            { title: "Real-time, not refresh", body: "Orders and status updates stream over a live connection" },
            { title: "Staff set every status", body: "Nothing moves through the kitchen on a timer — your team drives it" },
            { title: "Your own payouts", body: "Connect your own account; nothing routes through a shared one" },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08} className="ld-strip-item">
              <strong>{item.title}</strong>
              <span>{item.body}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="ld-section" id="how-it-works">
        <Reveal className="ld-section-head" as="div">
          <h2>From table to kitchen in three steps</h2>
          <p>No hardware to install, nothing for guests to download.</p>
        </Reveal>
        <div className="ld-steps">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1} className="ld-step">
              <div className="ld-step-index">{i + 1}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="ld-section ld-section-tint" id="features">
        <Reveal className="ld-section-head" as="div">
          <h2>Everything the floor and the kitchen actually use</h2>
          <p>Built around a real service, not a feature checklist.</p>
        </Reveal>
        <div className="ld-bento">
          {FEATURES.map((f, i) => (
            <motion.div
              className={`ld-bento-card ${f.big ? "big" : ""}`}
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, boxShadow: "0 20px 40px -12px rgba(32,20,23,0.22)" }}
            >
              <div className="ld-bento-icon"><span className="icon">{f.icon}</span></div>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="ld-cta">
        <Reveal className="ld-cta-inner" as="div">
          <h2>Set up your restaurant in a few minutes</h2>
          <p>Tell us about your crew, connect your payments when you're ready, add your first table.</p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ display: "inline-block" }}>
            <Link to="/admin/register" className="btn btn-primary">Set up your restaurant</Link>
          </motion.div>
          <div className="ld-cta-signin">
            Already on Dinora? <Link to="/admin/login">Sign in</Link>
          </div>
        </Reveal>
      </section>

      <footer className="ld-footer">
        <div className="ld-footer-inner">
          <div className="ld-nav-brand">
            <span className="ld-nav-mark">D</span>
            Dinora
          </div>
          <span>© {new Date().getFullYear()} Dinora</span>
        </div>
      </footer>
    </div>
  );
}
