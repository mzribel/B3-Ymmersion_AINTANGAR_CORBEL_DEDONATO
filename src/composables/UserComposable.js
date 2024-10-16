import {set, ref, get} from 'firebase/database';
import { db } from '../firebase';
import {getAuth, onAuthStateChanged} from "firebase/auth";

const UserComposable = () => {

    const CreateUserData = async (data, displayName) => {
        const email = data.user.email;
        if (await CheckUserExists(email)) {
            console.log("User already exists");
            return;
        }
        let uid = data.user.uid;
        const userRef = ref(db, `users/${uid}`);
        set(userRef, {
            createdAt: Date.now(),
            displayName: displayName ? displayName : "",
            email: email,
            uid: data.user.uid
        }).then();
    }

    const CheckUserExists = async (email) => {
        const usersRef = ref(db, 'users');
        return await get(usersRef).then(snapshot => {
            const users = snapshot.val();
            for (let key in users) {
                if (users[key].email === email) {
                    return true;
                }
            }
            return false;
        });
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
        const userRef = ref(db, `users/${userID}`);
        return (await get(userRef)).val();
    }


    const GetAllUsers = async (currentUserID = null) => {
        const userRef = ref(db, `users/`);
        return await get(userRef).then(snapshot => {
            const users = snapshot.val();
            if (!users) { return null; }
            return users;
        })
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


    return { GetAllUsers, GetUserByID, CreateUserData, GetCurrentUser, GetAsyncUser, GetUserByEmail, CheckUserExists };

}
export default UserComposable;


