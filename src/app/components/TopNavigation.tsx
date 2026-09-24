import React from 'react';
import Header from '../imports/Header';

export default function TopNavigation() {
  return (
    <div className="w-full h-0 flex-shrink-0 overflow-hidden">
      <div className="w-full h-full relative hidden">
        <div className="hidden">
          <Header />
        </div>
      </div>
    </div>
  );
}