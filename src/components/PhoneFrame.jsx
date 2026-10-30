import React, { useState, useEffect } from 'react';
import { Wifi, Signal } from 'lucide-react';

export const PhoneFrame = ({ children, activeScreenTitle }) => {
  const [currentTime, setCurrentTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      minutes = minutes < 10 ? '0' + minutes : minutes;
      setCurrentTime(`${hours % 12 || 12}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="iphone-frame" id="iphone-device-frame">
      {/* iOS Status Bar */}
      <div className="phone-status-bar">
        <span>{currentTime}</span>

        {/* Dynamic Island */}
        <div className="dynamic-island">
          <div className="island-camera-dot" />
          <div className="island-sensor-dot" />
        </div>

        {/* Status icons: Signal, Wifi, Battery */}
        <div className="status-icons">
          <Signal size={14} strokeWidth={2.5} />
          <Wifi size={14} strokeWidth={2.5} />
          <div className="battery-icon">
            <div className="battery-level" />
          </div>
        </div>
      </div>

      {/* Main Screen Content */}
      <div className="phone-content">
        {children}
      </div>

      {/* iOS Home Indicator Bar */}
      <div className="phone-home-indicator" />
    </div>
  );
};
