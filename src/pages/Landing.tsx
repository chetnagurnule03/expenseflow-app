import React, { Suspense, lazy } from 'react';
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp, IndianRupee } from 'lucide-react';
import { ErrorBoundary } from '../components/ErrorBoundary';

const Scene = lazy(() => import('../components/Scene'));

interface Props {
  onEnterApp: () => void;
}

export const Landing: React.FC<Props> = ({ onEnterApp }) => {
  return (
    <div className="landing-page">
      {/* 3D Hero Background */}
      <div className="hero-3d-wrapper">
        <ErrorBoundary fallback={<div className="static-fallback-bg" />}>
          <Suspense fallback={<div className="static-fallback-bg" />}>
            <Scene />
          </Suspense>
        </ErrorBoundary>
        {/* Dark overlay at 40% so text stays easily readable */}
        <div className="hero-overlay-40" />
      </div>

      {/* Hero Content Above 3D Canvas */}
      <div className="landing-content">
        <div className="landing-badge">
          <Sparkles size={16} className="sunny-icon" />
          <span>Made for everyday money</span>
        </div>

        <h1 className="landing-title">
          Where did your money go?<br />
          <span className="title-highlight">Find out with ExpenseFlow</span>
        </h1>

        <p className="landing-subtitle">
          Add what you earn and what you spend in under a minute. See your balance, stay inside your monthly budget, and spot what's eating your pocket money. All in rupees.
        </p>

        <div className="landing-cta-row">
          <button className="btn-hero-launch" onClick={onEnterApp}>
            <span>Start tracking</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="landing-features-grid">
          <div className="feature-pill">
            <ShieldCheck size={18} className="mint-icon" />
            <span>Your data stays on your device</span>
          </div>
          <div className="feature-pill">
            <TrendingUp size={18} className="sunny-icon" />
            <span>Clear charts, no spreadsheets</span>
          </div>
          <div className="feature-pill">
            <IndianRupee size={18} className="coral-icon" />
            <span>Built for rupees</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
