[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

# RN1-Vanly
React Native 1 Epitech Module

Create fabulous spots for the travelers community.

# Links

**Expo App:**
  [exp://exp.host/@mathieuv/Vanly](exp://exp.host/@mathieuv/Vanly)

**PlayStore:**
  [Vanly](https://play.google.com/store/apps/details?id=com.vanly.vanly)

# Resources
This app is developed in React Native and uses Firebase.

For more information you can check those websites:

  https://docs.expo.dev/

  https://docs.expo.dev/guides/using-firebase/

  https://firebase.google.com/docs
  
  https://docs.expo.dev/build/introduction/
  eas-cli/0.52.0 darwin-arm64 node-v16.4.1

# Install dependencies

    cd Vanly/
    yarn install

# Start app

    yarn start
    
Start app on Android:

    yarn android
    
Start app on ios:

    yarn ios
    
# Run linter

    yarn lint
    
# Eject expo

    yarn eject
    
# Build project

    expo build:android -t app-bundle [OLD]
    eas build -p android

# Deploy
See images in ./Deploy folder

**PlayStore**
- After building your project on expo's servers download your .aab file to your computer
- Go to [https://play.google.com/console/developers](https://play.google.com/console/developers)
- Go under **Production** in the left toolbar menu
- On the top right corner **Create a new release**
- Add your description, the name of your release and import the .aab file
- Once it's done press **Save** then **Deploy**

**Expo**
- After launching
```sh
yarn start or npm start
```
- Enable the developer tools in the browser while pressing the key **D**
- And click on **Publish or republish project...**
- Wait for it and it's done :) 
