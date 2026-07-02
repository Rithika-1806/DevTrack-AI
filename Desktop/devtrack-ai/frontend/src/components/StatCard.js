import React from 'react';

const colorMap = {
  green:  {
    bg: '#eef6f1', color: '#2e7d52', bar: '#2e7d52'
  },
  blue:   {
    bg: '#eff2ff', color: '#6b8af7', bar: '#6b8af7'
  },
  orange: {
    bg: '#fff8ed', color: '#d97706', bar: '#f59e0b'
  },
  red:    {
    bg: '#fef2f2', color: '#ef4444', bar: '#ef4444'
  },
  purple: {
    bg: '#faf0ff', color: '#a855f7', bar: '#a855f7'
  },
};

const StatCard = ({
  title, value, icon,
  color = 'green',
  subtitle, progress
}) => {
  const c = colorMap[color] || colorMap.green;

  return (
    <div className="stat-card fade-up">

      {/* Top row — icon + label + value */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        marginBottom: '10px'
      }}>
        {/* Icon box */}
        <div style={{
          width: '38px', height: '38px',
          background: c.bg,
          borderRadius: '10px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px', flexShrink: 0
        }}>
          {icon}
        </div>

        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: '10.5px', fontWeight: 600,
            color: '#9a9a8e',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            margin: '0 0 3px'
          }}>
            {title}
          </p>
          <p style={{
            fontSize: '22px', fontWeight: 900,
            color: '#1a1a1a', margin: 0,
            lineHeight: 1
          }}>
            {value ?? 0}
          </p>
        </div>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p style={{
          fontSize: '11px', fontWeight: 600,
          color: c.color, margin: '0 0 8px'
        }}>
          {subtitle}
        </p>
      )}

      {/* Progress bar */}
      <div className="prog">
        <div
          className="prog-bar"
          style={{
            width: `${progress || 60}%`,
            background: c.bar
          }}
        />
      </div>

    </div>
  );
};

export default StatCard;