import React from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  leftFooterText?: string;
}

export default function AuthLayout({ title, subtitle, children, leftFooterText }: AuthLayoutProps) {
  return (
    <div className="login-container">
      <div className="login-left">
        <div style={{ display: "flex" }}>
          <h1 style={{ marginTop: 70, marginLeft: 60, fontFamily: "'DM Serif Display', serif" }}>Wander</h1>
          <h1 style={{ marginTop: 70, fontFamily: "'DM Serif Display', serif", color: "#da8360" }}>Sync</h1>
        </div>
        <p style={{ marginTop: "auto", marginLeft: 60, marginRight: 60, marginBottom: 100, color: "#8A7A6A", fontWeight: 300, lineHeight: 1.6, fontSize: 16 }}>
          {leftFooterText}
        </p>
      </div>
      <div className="login-right">
        <h1 style={{ fontFamily: "'DM Serif Display', serif", color: "#1A1612" }}>{title}</h1>
        <h4 style={{ color: "#4A4340", fontWeight: 300, lineHeight: 1.6 }}>{subtitle}</h4>
        {children}
      </div>
    </div>
  );
}