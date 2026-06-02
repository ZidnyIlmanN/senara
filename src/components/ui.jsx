import React from 'react'

export function Icon({ name, size = 20 }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></>,
    user: <><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.4 3.1-5.2 7-5.2s6.2 1.8 7 5.2"/></>,
    bag: <><path d="M6 8h12l1 12H5L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></>,
    heart: <path d="M20.8 8.7c0 5-8.8 10-8.8 10s-8.8-5-8.8-10A4.5 4.5 0 0 1 12 5.9a4.5 4.5 0 0 1 8.8 2.8Z"/>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    leaf: <><path d="M18 4C9 5 5 10 6 19c9 1 14-5 12-15Z"/><path d="M6 19c3-5 6-8 12-15"/></>,
    flask: <><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/><path d="M7 17h10"/></>,
    check: <><circle cx="12" cy="12" r="8"/><path d="m9 12 2 2 4-4"/></>,
  }

  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

export function Logo({ light = false }) {
  return <div className={`logo ${light ? 'text-cream' : 'text-charcoal'}`}>
    <img src="/images/senara-logo.png" alt="SENARA Logo" className="h-8 md:h-10 w-auto object-contain mix-blend-multiply" />
  </div>
}

export function Arrow() {
  return <span className="arrow">{'\u2192'}</span>
}

export function Button({ children, outline = false }) {
  return <button className={outline ? 'btn btn-outline' : 'btn'}>{children}<Arrow /></button>
}
