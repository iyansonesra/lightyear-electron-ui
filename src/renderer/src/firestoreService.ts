
import { db } from './firebaseConfig';
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// const BASE_URL = `https://firestore.googleapis.com/v1/projects/lightyear-app-login/databases/(default)/documents/users`;

export const firestoreService = {
  // Get all documents from a collection
  getAll: async (collectionName: string) => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Get a single document by ID
  getById: async (collectionName: string, id: string) => {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Document not found");
    }
  },

  // Add a new document
  add: async (collectionName: string, data: any) => {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  },

  // Update a document
  update: async (collectionName: string, id: string, data: any) => {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
  },

  // Delete a document
  delete: async (collectionName: string, id: string) => {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  }
};