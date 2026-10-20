
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyA7NAD9VoVvboJspWhkWemByf0AVwpBjK8',
  authDomain: 'catrec-ba0e8.firebaseapp.com',
  databaseURL: 'https://catrec-ba0e8-default-rtdb.firebaseio.com',
  projectId: 'catrec-ba0e8',
  storageBucket: 'catrec-ba0e8.firebasestorage.app',
  messagingSenderId: '894773550245',
  appId: '1:894773550245:web:5a0c6a0c158741062e414c',
}

const app = initializeApp(firebaseConfig)

export const database = getDatabase(app)
export const auth = getAuth(app)
