import React from 'react';
import { LedgerDateBox, TotalBox } from './components/RecordBox.tsx';
import { Stats  } from './components/Stats.tsx';

export default function LedgerPage() {
  return (
    // TODO: may replace with className later
    <div class="flex gap-x-4 w-full">
      {/* left - records */}
      <div class="flex-1">
        <h1 class="uppercase">leger</h1>
        <TotalBox />
        <LedgerDateBox />
      </div>

      {/* right - stats */}
      <div class="flex-1 w-full mx-auto">
        <Stats />
      </div>
    </div>
  );
};
