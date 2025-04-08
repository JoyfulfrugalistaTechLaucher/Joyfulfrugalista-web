type LoadRecords = {
    kind: 'loaded';
    data: SavingsRecord[];
}

type AddRecord = {
    kind: 'added';
    record: SavingsRecord;
}

type FilterRecord = {
    kind: 'filtered';
    filter: string
}

type SortRecords = {
    kind: 'sorted';
    key?: 'latest' | 'oldest' | 'increasing' | 'decreasing';
}

type Action = LoadRecords | AddRecord | FilterRecord | SortRecords;

export function recordsReducer(
    records: SavingsRecord[],
    action: Action
): SavingsRecord[] {
  switch(action.kind) {
      case 'loaded': {
          return action.data;
      }
      case 'added': {
          return [
              action.record,
              ...records,
          ];
      }
      case 'filtered': {
          return records.filter(record => record.category === action.filter);
      }
      case 'sorted': {
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
