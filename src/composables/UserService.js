import { getDoc, doc, getDocs, collection, where, query } from 'firebase/firestore';

const UserService = () => {

    const getCurrentUser = async (db, uuid) => {
        const docRef = doc(db, "servers", data);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            //console.log("one channel: ", docSnap.data());
        } else {
            console.log("No such document!");
        }

        return docSnap.data();
    }
}