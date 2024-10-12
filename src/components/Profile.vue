<template>
  <div class="profile">
    <h3>Profil de l'utilisateur</h3>

    <div v-if="profile">
      <div>
        <div v-if="isModifying" class="pfp-div">
          <label for="profile-pic-input" class="clickable-pfp-label">
            <img :src="profile.photoURL || defaultPhoto" alt="Photo de profil" class="pfp-img img-modifiable" />
          </label>
          <input id="profile-pic-input" type="file" accept="image/*" @change="onFileChange" class="file-input" />
        </div>
        <div v-else>
          <img :src="profile.photoURL || defaultPhoto" alt="Photo de profil" width="100" class="pfp-img"/>
        </div>
      </div>

      <div class="display-name-div">
        <label><strong>Pseudo:</strong></label>
        <div v-if="isModifying">
          <input v-model="profile.displayName" type="text" placeholder="Nom d'affichage" />
        </div>
        <div v-else>
          <p>{{ profile.displayName || 'Anonyme' }}</p>
        </div>
      </div>

      <button @click="toggleModification">
        {{ isModifying ? 'Annuler' : 'Modifier le profil' }}
      </button>

      <button v-if="isModifying" @click="updateConfirmation">Enregistrer</button>
    </div>

    <p v-if="loading">Chargement du profil...</p>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <p v-if="!loading && !profile">Aucun profil trouvé.</p>
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
.profile {
  padding: 20px;
}

p {
  margin: 5px 0;
}

strong {
  color: #333;
}

button {
  margin-top: 10px;
}

.pfp-div {
  display: flex;
  flex-direction: column;
}

.display-name-div {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.clickable-pfp-label {
  display: inline-block;
  cursor: pointer;
}

.pfp-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
}

.img-modifiable {
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.img-modifiable:hover {
  opacity: 1;
}

.file-input {
  display: none;
}
</style>
