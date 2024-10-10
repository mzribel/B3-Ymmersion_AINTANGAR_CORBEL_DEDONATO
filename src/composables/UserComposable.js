import {set, ref, get} from 'firebase/database';
import { db } from '../firebase';
import {getAuth, onAuthStateChanged} from "firebase/auth";

const UserComposable = () => {

    const CreateUserData = (data) => {
        let uid = data.user.uid;
        const userRef = ref(db, `users/${uid}`);
        set(userRef, {
            createdAt: Date.now(),
            username: data.user.displayName ? data.user.displayName : "",
            email: data.user.email,
            uid: data.user.uid
        }).then();
    }

    const GetCurrentUser = () => {
        return getAuth().currentUser;
    }

    const GetCurrentUserData = async (userID) => {
        if (!getAuth().currentUser) {
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

    return { CreateUserData, GetCurrentUser, GetCurrentUserData, GetAsyncUser };
}
export default UserComposable;


