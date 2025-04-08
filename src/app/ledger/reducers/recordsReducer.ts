type Action = {
  kind: 'added' | 'filtered' | 'sorted';
  record?: SavingsRecord;
  filter?: string;
  key?: 'latest' | 'oldest' | 'increasing' | 'decreasing';
}

export function recordsReducer(
    records: SavingsRecord[],
    action: Action
): SavingsRecord[] {
  switch(action.kind) {
      case 'added': {
          return [
              action.record,
              ...records,
          ];
      }
      case 'filtered': {
          if (!action.filter || action.filter === 'all') {
              return records;
          }
          return records.filter(record => record.category === action.filter);
      }
      case 'sorted': {
          if (action.key === undefined) {
              console.error('Sorting key is undefined');
              return records;
          }
          switch(action.key) {
              case 'latest': {
                  return [...records].sort((a, b) => b.date.localeCompare(a.date));
              }
              case 'oldest': {
                  return [...records].sort((a, b) => a.date.localeCompare(b.date));
              }
              case 'increasing': {
                  return [...records].sort((a, b) => a.moneyAdded - b.moneyAdded);
              }
              case 'descreasing': {
                  return [...records].sort((a, b) => b.moneyAdded - a.moneyAdded);
              }
              default: {
                  console.error('Unknown sorting key: ' + action.key);
                  return records;
              }
          }
      }
      default: {
          console.log('Nothing to do with the user records');
          return records;
      }
  }
}
