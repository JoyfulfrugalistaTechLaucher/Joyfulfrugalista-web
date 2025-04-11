import { getDatabase, ref, push, get, set } from 'firebase/database'
import { SavingsRecord } from '@/app/interface';

export const addEntryToDatabase = (uid: string, date: string, saved: string, category: string, description: string) => {
    return new Promise<void>((resolve, reject) => {
        const database = getDatabase();
        const userAddInfoRef = ref(database, `addInfo/${uid}`);
        const newRecordRef = push(userAddInfoRef);

        set(newRecordRef, {
            date,
            saved,
            category,
            description
        })
            .then(() => {
                resolve(); // Resolve the promise when data is successfully added
            })
            .catch((error) => {
                reject(error); // Reject the promise with the error if there's any
            });
    });
};

export const fetchSavingData = (uid: string) => {
    const database = getDatabase();
    const userAddInfoRef = ref(database, `addInfo/${uid}`);

    // Fetch data from Firebase
    return new Promise((resolve, reject) => {
        get(userAddInfoRef).then((snapshot) => {
            if (snapshot.exists()) {
              const savingEntries = snapshot.val();
              const totalSaved = Object
                .values(savingEntries as Record<string, SavingsRecord>)
                .reduce((acc: number, entry: SavingsRecord) =>
                  acc + entry.saved, 0);
                resolve({ savingEntries, totalSaved });
            } else {
                // Handle case when no data exists
                resolve({ savingEntries: [], totalSaved: 0 });
            }
        }).catch((error) => {
            // Handle error while fetching data
            console.error('Error fetching data from database:', error);
            reject(error);
        });
    });
};
