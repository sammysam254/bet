import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export const WelcomeScreen = ({ onGetStarted }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      title: "YOUR WINNING\nJOURNEY\nSTARTS HERE!",
      messiImg: "/assets/messi.jpg",
      zlatanImg: "/assets/zlatan.jpg",
      ronaldoImg: "/assets/ronaldo.jpg"
    },
    {
      title: "LIVE IN-PLAY\nREAL-TIME\nODDS & STATS",
      messiImg: "/assets/ronaldo.jpg",
      zlatanImg: "/assets/messi.jpg",
      ronaldoImg: "/assets/zlatan.jpg"
    },
    {
      title: "INSTANT CASHOUT\n& ACCUMULATOR\nBOOSTS DAILY",
      messiImg: "/assets/zlatan.jpg",
      zlatanImg: "/assets/ronaldo.jpg",
      ronaldoImg: "/assets/messi.jpg"
    }
  ];

  const current = slides[activeSlide];

  return (
    <div className="welcome-screen" id="welcome-onboarding-screen">
      {/* Tilted Collage of Football Icons */}
      <div className="welcome-cards-collage">
        {/* Top card: Messi World Cup */}
        <div className="hero-tilted-card card-top">
          <img src={current.messiImg} alt="Messi World Cup Trophy" />
          <div className="card-overlay-gradient" />
        </div>

        {/* Middle card: Zlatan celebration */}
        <div className="hero-tilted-card card-mid">
          <img src={current.zlatanImg} alt="Zlatan AC Milan Roar" />
          <div className="card-overlay-gradient" />
        </div>

        {/* Bottom card: Ronaldo celebration */}
        <div className="hero-tilted-card card-bot">
          <img src={current.ronaldoImg} alt="Cristiano Ronaldo Celebration" />
          <div className="card-overlay-gradient" />
        </div>

        {/* Gradient vignette blending cards into the bottom section */}
        <div className="welcome-vignette" />
      </div>

      {/* Bottom Action Section */}
      <div className="welcome-footer">
        <h1 className="welcome-title" style={{ whiteSpace: 'pre-line' }}>
          {current.title}
        </h1>

        <div className="welcome-bottom-row">
          {/* Carousel dots indicators */}
          <div className="carousel-dots">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`dot ${activeSlide === idx ? 'active' : ''}`}
                onClick={() => setActiveSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* White pill "Get started ->" button */}
          <button
            type="button"
            className="btn-get-started"
            id="btn-get-started"
            onClick={onGetStarted}
          >
            <span>Get started</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};
