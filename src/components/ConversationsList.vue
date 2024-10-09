<template>
  <div class="conversations-list">
    <h3>Vos Groupes</h3>
    <ul>
      <li v-for="group in groups" :key="group.id">
        <router-link :to="`/group/${group.id}`">{{ group.name }}</router-link>
      </li>
    </ul>
    <p v-if="loading">Chargement des groupes...</p>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <p v-if="!loading && groups.length === 0">Aucun groupe trouvé.</p>
    
    <h3>Conversations privées</h3>
    <ul>
      <li v-for="conversation in privateMessages" :key="conversation.id">
        <router-link :to="`/conversation/${conversation.id}`">{{ conversation.title }}</router-link>
      </li>
    </ul>
    <p v-if="loading">Chargement des conversations...</p>

    <button @click="showUserSelectionModal">Démarrer une conversation privée</button>

    <!-- Modal pour sélectionner des utilisateurs -->
    <div v-if="isModalVisible" class="modal">
      <h4>Sélectionner des utilisateurs</h4>
      <ul>
        <li v-for="user in users" :key="user.id">
          <label>
            <input type="checkbox" v-model="selectedUsers" :value="user.id" />
            {{ user.displayName }}
          </label>
        </li>
      </ul>
      <button @click="startPrivateConversation">Démarrer la conversation</button>
      <button @click="closeModal">Annuler</button>
    </div>
  </div>
</template>

<script>
import { ref, onValue, push, set } from 'firebase/database';
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
  data() {
    return {
      groups: [],
      privateMessages: [],
      users: [], 
      selectedUsers: [], 
      loading: true,
      errorMessage: '',
      isModalVisible: false, 
    };
  },
  created() {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.loadGroups(user.uid);
        this.loadPrivateMessages(user.uid);
        this.loadUsers();
      } else {
        this.groups = [];
        this.privateMessages = [];
        this.users = [];
        this.loading = false;
      }
    });
  },
  methods: {
    loadGroups(userId) {
      const groupsRef = ref(db, 'groups');
      onValue(groupsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          this.groups = Object.keys(data)
            .filter(key => !data[key].privateconv && Array.isArray(data[key].members) && data[key].members.includes(userId))
            .map(key => ({
              id: key,
              name: data[key].name,
            }));
        } else {
          this.groups = [];
        }
      });
    },
    loadPrivateMessages(userId) {
      const groupsRef = ref(db, 'groups');
      onValue(groupsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          this.privateMessages = Object.keys(data)
            .filter(key => data[key].privateconv && Array.isArray(data[key].members) && data[key].members.includes(userId))
            .map(key => ({
              id: key,
              title: data[key].name,
            }));
        } else {
          this.privateMessages = [];
        }
        this.loading = false;
      }, (error) => {
        this.errorMessage = `Erreur lors de la récupération des groupes: ${error.message}`;
        this.loading = false;
      });
    },
    loadUsers() {
      const usersRef = ref(db, 'users'); 

      onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          this.users = Object.keys(data).map(key => ({
            id: key,
            displayName: data[key].displayName
          }));
        } else {
          this.users = []; 
        }
      }, (error) => {
        this.errorMessage = `Erreur lors de la récupération des utilisateurs: ${error.message}`;
      });
    },
    showUserSelectionModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false; 
      this.selectedUsers = [];
    },
    async startPrivateConversation() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (this.selectedUsers.length > 0) {
        const newConversationRef = push(ref(db, 'groups')); 
        await set(newConversationRef, {
          title: 'Nouvelle conversation',
          members: [user.uid, ...this.selectedUsers], 
          privateconv: true 
        });

        this.$router.push(`/conversation/${newConversationRef.key}`); 
        this.closeModal(); 
      } else {
        alert("Veuillez sélectionner au moins un utilisateur."); 
      }
    }
  }
};
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}

li {
  margin: 10px 0;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
</style>
