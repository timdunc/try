import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBJvZXpFn4LrGeZNhAK6yUJxMoklP7SS1Q",
  authDomain: "frex-e04c5.firebaseapp.com",
  projectId: "frex-e04c5",
  storageBucket: "frex-e04c5.appspot.com",
  messagingSenderId: "266554379699",
  appId: "1:266554379699:web:dedcdc4a433bc952238fc6"
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export { storage, app };
