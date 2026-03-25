import React from 'react';
export default function Card({ title, subtitle, children, right }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      {(title || right) && (
        <div className="flex items-center justify-between mb-3">
          <div>
            {title && <h3 className="font-semibold">{title}</h3>}
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}