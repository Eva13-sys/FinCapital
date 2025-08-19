// // utils/authToken.js
// import { getAuth } from "firebase/auth";
// /**
//  * Get the Firebase ID token of the currently logged-in user.
//  * This token will be sent to your backend for authentication.
//  */
// export const getFirebaseIdToken = async () => {
//   try {
//     const auth = getAuth();
//     const user = auth.currentUser;

//     if (!user) {
//       console.warn("No user logged in");
//       return null;
//     }

//     // Get the current ID token (forces refresh if expired)
//     return await user.getIdToken(true);
//   } catch (err) {
//     console.error("Error getting Firebase ID token:", err);
//     return null;
//   }
// };
import { getAuth } from "firebase/auth";

export const getFirebaseIdToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken(true);
};
