import {set, ref, get} from 'firebase/database';
import { db } from '../firebase';
import {getAuth, onAuthStateChanged} from "firebase/auth";

const UserComposable = () => {

    const CreateUserData = (data, displayName) => {
        let uid = data.user.uid;
        const userRef = ref(db, `users/${uid}`);
        set(userRef, {
            createdAt: Date.now(),
            displayName: displayName ? displayName : "est",
            email: data.user.email,
            uid: data.user.uid
        }).then();
    }

    const GetUserByEmail = async (email) => {
      const usersRef = ref(db, 'users');
      let userid = null;
      return await get(usersRef).then(snapshot => {
          const users = snapshot.val();
          for (let key in users) {
              if (users[key].email === email) {
                  return users[key].uid;
              }
          }
          return null;
        });
    }

    const GetCurrentUser = () => {
        return getAuth().currentUser;
    }

    const GetUserByID = async (userID) => {
        if (!userID) {
            return null;
        }
        ;
        const userRef = ref(db, `users/${userID}`);
        return (await get(userRef)).val();
    }

    async function GetAsyncUser(){
      return new Promise((resolve, reject) => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          resolve(user);
        }, reject);
      });
    }

    return { GetUserByID, CreateUserData, GetCurrentUser, GetCurrentUserData: GetUserByID, GetAsyncUser, GetUserByEmail };
}
export default UserComposable;


