import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

export default defineNuxtPlugin(() => {

  const firebaseConfig = {
    apiKey: "AIzaSyBrUCgCXkpo02gZvMGxGCZsrjOpTCOdOpQ",
    authDomain: "gpt-app-3f893.firebaseapp.com",
    databaseURL: "https://gpt-app-3f893-default-rtdb.firebaseio.com",
    projectId: "gpt-app-3f893",
    storageBucket: "gpt-app-3f893.appspot.com",
    messagingSenderId: "599286839429",
    appId: "1:599286839429:web:9cdfc36495db920d97d1ec"
  };

  const app = initializeApp(firebaseConfig);

  const storage = getStorage(app);

});