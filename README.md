# cross-platform-nextjs
a boilerplate for building cross platform app (Mac, Linux, Windows, ios, Android) with nextjs, react, and material-ui


## how to develop

npm i
npx ionic capacitor add android
npx ionic capacitor add ios
npm run export

### start electron

npm run run:electron

### build for Mac, Linux, Windows

npm run build:mac
npm run build:linux
npm run build:win

### open Xcode to build for ios

npm run open:ios

### open Android Studio to build for Android
npm run open:android

# This project is set as the root workspace project because electron-builder needs to be installed at the same level's node_modules

# jest is not added yet

## Screens
### Running on iPhone
<p align="center">
    <img src="doc/iphone.png" width="300px">
</p>

### Running on Android
<p align="center">
    <img src="doc/android.png" width="300px">
</p>

### Running on Desktop
<p align="center">
    <img src="doc/desktop.png" width="70%">
</p>

### Running on Web
<p align="center">
    <img src="doc/web.png" width="70%">
</p>
