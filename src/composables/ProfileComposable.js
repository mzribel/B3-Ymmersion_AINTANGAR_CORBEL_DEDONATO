import { ref } from 'vue';
import { ref as dbRef, onValue, update } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase';

export const profileComposable = (userUid) => {
    const profile = ref(null);
    const loading = ref(true);
    const errorMessage = ref('');
    const defaultPhoto = 'https://via.placeholder.com/100';

    const fetchUserProfile = async () => {
        try {
            const userRef = dbRef(db, `users/${userUid}`);
            onValue(userRef, (snapshot) => {
                if (snapshot.exists()) {
                    profile.value = snapshot.val();
                } else {
                    profile.value = null;
                }
                loading.value = false;
            }, (error) => {
                errorMessage.value = `Erreur lors de la récupération du profil : ${error.message}`;
                loading.value = false;
            });
        } catch (error) {
            errorMessage.value = `Erreur : ${error.message}`;
            loading.value = false;
        }
    };

    const updateUserProfile = async () => {
        try {
            const userRef = dbRef(db, `users/${userUid}`);
            await update(userRef, {
                displayName: profile.value.displayName || '',
                photoURL: profile.value.photoURL || null,
            });
            alert('Profil mis à jour avec succès !');
        } catch (error) {
            errorMessage.value = `Erreur lors de la mise à jour du profil : ${error.message}`;
        }
    };

    const handleFileChange = async (file) => {
        if (file) {
            const storage = getStorage();
            const storageReference = storageRef(storage, `profile_photos/${userUid}`);
            try {
                await uploadBytes(storageReference, file);
                const photoURL = await getDownloadURL(storageReference);
                profile.value.photoURL = photoURL;
            } catch (error) {
                errorMessage.value = `Erreur lors de l'upload de la photo : ${error.message}`;
            }
        }
    };

    return {
        profile,
        loading,
        errorMessage,
        defaultPhoto,
        fetchUserProfile,
        updateUserProfile,
        handleFileChange,
    };
};
