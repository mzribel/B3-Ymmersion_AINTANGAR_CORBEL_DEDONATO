<template>
  <div class="profile">
    <div class="profile-card">
      <h3>Profil de l'utilisateur</h3>

      <div v-if="profile">
        <div class="pfp-container">
          <div v-if="isModifying" class="pfp-div">
            <label for="profile-pic-input" class="clickable-pfp-label">
              <img :src="profile.photoURL || defaultPhoto" alt="Photo de profil" class="pfp-img img-modifiable" />
            </label>
            <input id="profile-pic-input" type="file" accept="image/*" @change="onFileChange" class="file-input" />
          </div>
          <div v-else>
            <img :src="profile.photoURL || defaultPhoto" alt="Photo de profil" class="pfp-img" />
          </div>
        </div>

        <div class="display-name-div">
          <label><strong>Pseudo:</strong></label>
          <div v-if="isModifying">
            <input v-model="profile.displayName" type="text" class="input-field" placeholder="Nom d'affichage" />
          </div>
          <div v-else>
            <p class="pseudo-text">{{ profile.displayName || 'Anonyme' }}</p>
            <p class="email-text">({{ profile.email }})</p>
          </div>
        </div>

        <div class="profile-actions">
          <button @click="toggleModification" class="btn edit-btn">
            {{ isModifying ? 'Annuler' : 'Modifier le profil' }}
          </button>
          <button v-if="isModifying" @click="updateConfirmation" class="btn save-btn">
            Enregistrer
          </button>
        </div>
      </div>

      <p v-if="loading">Chargement du profil...</p>
      <p v-if="errorMessage">{{ errorMessage }}</p>
      <p v-if="!loading && !profile">Aucun profil trouvé.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { profileComposable } from '../composables/ProfileComposable.js';

const props = defineProps({
  userUid: {
    type: String,
    required: true
  }
});

const {
  profile,
  loading,
  errorMessage,
  defaultPhoto,
  fetchUserProfile,
  updateUserProfile,
  handleFileChange
} = profileComposable(props.userUid);

const isModifying = ref(false);

const updateConfirmation = () => {
  updateUserProfile();
  toggleModification();
};

const toggleModification = () => {
  isModifying.value = !isModifying.value;
};

onMounted(() => {
  fetchUserProfile();
});

const onFileChange = (event) => {
  const file = event.target.files[0];
  handleFileChange(file);
};
</script>

<style scoped>


.profile-card {
  background: rgb(244, 244, 244);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 12px 12px rgba(0, 0, 0, 0.2);
  width: 300px;
  text-align: center;

}

h3 {
  margin-bottom: 20px;
  color: #333;
}

.pfp-container {
  margin-bottom: 20px;
  width: 100%;
  justify-content: center;
}

.pfp-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #e0e0e0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.clickable-pfp-label {
  cursor: pointer;
  opacity: 0.8;
}

.img-modifiable:hover {
  transform: scale(1.05);
}
.display-name-div {
  margin-bottom: 20px;
}

.pseudo-text {
  font-size: 18px;
  font-weight: bold;
  color: #555;
  margin-top: 10px;
}

.email-text {
  font-size: 12px;
  color: #777;
}

.input-field {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 100%;
  font-size: 16px;
  margin-top: 10px;
}

.profile-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.edit-btn {
  background-color: #4a90e2;
  color: white;
}

.edit-btn:hover {
  background-color: #357abd;
}

.save-btn {
  background-color: #2ecc71;
  color: white;
}

.save-btn:hover {
  background-color: #27ae60;
}

.file-input {
  display: none;
}
</style>
