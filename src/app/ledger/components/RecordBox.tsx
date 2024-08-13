import React from 'react';

const recordBoxRoot = "flex justify-between item-stretch p-2 m-0.5 bg-lgray";
const dateBoxRoot = "flex flex-col gap-y-2 item-stretch p-2 m-0.5";
const dateHeader = "flex justify-between p-2 m-0.5";

// TODO: use props to pass data
function LedgerRecordBox() {
  return (
    <div class={recordBoxRoot}>
      <div>icon</div>
      <div>description</div>
      <div>amount</div>
    </div>
  );
}

export function LedgerDateBox() {
  return (
    <div class={dateBoxRoot}>
      <div class={dateHeader}>
        <div>Mon Date Rel</div>
        <div>Saved $</div>
      </div>
      {/* any number of record boxes here */}
      <LedgerRecordBox />
      <LedgerRecordBox />
      <LedgerRecordBox />
    </div>
  );
};

export function TotalBox() {
  // get data here
  return (
    <div class="rounded-md bg-pinkbg p-2 m-2">
      <div class="rounded-md border-2 border-solid border-whitea text-white">
        <div class="text-md text-center">You Have Saved</div>
        <div class="text-lg text-center">$Amount</div>
      </div>
    </div>
  );
};
