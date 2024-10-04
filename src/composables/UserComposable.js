import { set, ref } from 'firebase/database';
import { db } from '../firebase';

const UserComposable = () => {

    const CreateUserData = (data) => {
        let uid = data.user.uid;
        const userRef = ref(db, `users/${uid}`);
        set(userRef, {
            uid: uid,
            createdAt: Date.now(),
            username: data.user.email,
        }).then();
    }

    return { CreateUserData };
}
export default UserComposable;


