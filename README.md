# Joyfulfrugalista-web
## Project Overview
People in Australia are struggling with the cost of living, with 6.9 million people - one in 2 workers - living from pay day to pay day. One in five people are experiencing extreme effects on their mental health due to the rising cost of living, with young people in particular struggling. One reason people struggle is that they don't have the skills to save money, or they think it's pointless because the little savings don't make a difference.
## Document Directory
* [Landing Page](https://wax-butternut-983.notion.site/The-Joyful-Joyfulfrugalista-Project-cb94c30dcd1f4fcd8cf3f9334867ff90?pvs=4)
* [Google Drive](https://drive.google.com/drive/folders/181NKiNVCuW4TMf3HKB54Vql3RZBUGc-3?hl=zh_CN)

## Set up for development

Download ``.env.local`` file and place in the project root file, you need to set up these environment variable to access the Firebase:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

Then run the following command to start local dev:
```
npm install
npx next
```

Then in your browser, visit `localhost:3000` or `127.0.0.1:3000`

## Build
Before pushing your updates, run the following command to make sure it builds:
```shell
npx next build
```
## Deploy
This project uses [github actions](.github/workflows/vercel.yml). Each commit and pull request on the `main` and `dev` branches will trigger the building of the website and its deployment to a vercel instance.
You can visit the deployed website at [Joyful Savings Jar](https://joyfulfrugalista-web.vercel.app/)
