import { SavingsRecord } from '@/app/interface';
import { SortKey } from '@/app/constants';
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
  key: SortKey;
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
          return [...records].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        case 'oldest': {
          return [...records].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime());
        }
        case 'largest': {
          // Descending
          return [...records].sort((a, b) => b.saved - a.saved);
        }
        case 'smallest': {
          // Ascending
          return [...records].sort((a, b) => a.saved - b.saved);
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
