import API_KEY from '../../../server/server.js';

const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');
async function authenticateAndCheckPin(pin) {
    try {
      // Step 1: Get custom token from server
      const response = await fetch('http://localhost:3000/getCustomToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      body: JSON.stringify({ apiKey: API_KEY})
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { customToken } = await response.json();
      // Step 2: Authenticate with Firebase using the custom token
      await firebase.auth().signInWithCustomToken(customToken);
      console.log('Successfully authenticated with Firebase');
      // Step 3: Check PIN in Firestore
      const db = firebase.firestore();
      const usersRef = db.collection('users');
      const snapshot = await usersRef.where('PIN', '==', pin).limit(1).get();
      if (snapshot.empty) {
        console.log('Invalid PIN');
        return false;
      } else {
        console.log('Valid PIN');
        return true;
      }
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  }
  // Usage
  authenticateAndCheckPin('12345678');