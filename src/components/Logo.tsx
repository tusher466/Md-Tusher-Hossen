import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = 'w-9 h-9', size = 36 }) => {
  return (
    <div
      className={`relative rounded-xl overflow-hidden shadow-xs flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* Fresh Leaf Green Gradients */}
          <linearGradient id="leafGradBg" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ecfdf5" />
            <stop offset="50%" stopColor="#d1fae5" />
            <stop offset="100%" stopColor="#a7f3d0" />
          </linearGradient>

          <linearGradient id="leafGradPrimary" x1="14" y1="10" x2="38" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          <linearGradient id="leafGradSecondary" x1="20" y1="12" x2="42" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="70%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          <linearGradient id="docShadow" x1="10" y1="8" x2="30" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f0fdf4" />
          </linearGradient>

          <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#065f46" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Outer squircle container */}
        <rect width="48" height="48" rx="12" fill="url(#leafGradBg)" stroke="#86efac" strokeWidth="1.2" />

        {/* Back document sheet (layered packet hint) */}
        <path
          d="M13 11C13 9.89543 13.8954 9 15 9H27L33 15V33C33 34.1046 32.1046 35 31 35H15C13.8954 35 13 34.1046 13 33V11Z"
          fill="#bbf7d0"
          opacity="0.8"
        />

        {/* Foreground Document Sheet with subtle shadow */}
        <g filter="url(#softGlow)">
          <path
            d="M9 13C9 11.8954 9.89543 11 11 11H25L31 17V37C31 38.1046 30.1046 39 29 39H11C9.89543 39 9 38.1046 9 37V13Z"
            fill="url(#docShadow)"
            stroke="#bbf7d0"
            strokeWidth="1.2"
          />
          {/* Document Folded Corner */}
          <path
            d="M25 11V16C25 16.5523 25.4477 17 26 17H31"
            fill="#e2fbe8"
            stroke="#86efac"
            strokeWidth="1.2"
          />
        </g>

        {/* Document horizontal text/table representation lines */}
        <line x1="13" y1="18" x2="21" y2="18" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
        <line x1="13" y1="22" x2="19" y2="22" stroke="#6ee7b7" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="13" y1="26" x2="17" y2="26" stroke="#a7f3d0" strokeWidth="1.2" strokeLinecap="round" />

        {/* Organic Light Leaf Green Sprouting Emblem */}
        <g filter="url(#softGlow)">
          {/* Main Leaf Body */}
          <path
            d="M17 38C17 29 25 21 38 18C37 31 29 39 17 38Z"
            fill="url(#leafGradPrimary)"
          />
          {/* Upper Leaf Highlight Wing */}
          <path
            d="M22 36C22 28 28 22 38 18C33 26 29 33 22 36Z"
            fill="url(#leafGradSecondary)"
            opacity="0.9"
          />
          {/* Leaf Central Rib & Veins */}
          <path
            d="M18.5 36.5C24 33 29.5 28 35 20.5"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M24 32C26.5 32 29 30 30.5 28.5"
            stroke="#d1fae5"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          <path
            d="M28 27.5C30.5 27 32.5 25 34 23.5"
            stroke="#d1fae5"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
        </g>

        {/* Official Procurement Verification Seal Badge */}
        <circle cx="15" cy="33" r="4.5" fill="#ffffff" stroke="#059669" strokeWidth="1.2" />
        <circle cx="15" cy="33" r="3.3" fill="#10b981" />
        <path
          d="M13.5 33L14.6 34.1L16.5 31.9"
          stroke="#ffffff"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
