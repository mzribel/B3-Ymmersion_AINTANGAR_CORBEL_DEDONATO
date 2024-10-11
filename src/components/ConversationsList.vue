<template>
  <div class="conversations-list">
    <h3>Vos Groupes</h3>
    <ul>
      <li v-for="group in groups" :key="group.id">
        <router-link :to="`/chat/${group.id}`">{{ group.name }}</router-link>
        <button @click="toggleGroupMembers(group.id)">
          {{ group.showMembers ? 'Masquer les membres' : 'Afficher les membres' }}
        </button>
        <button @click="addUserToGroup(group.id)">Ajouter une personne</button>
        <button @click="deleteGroup(group.id)">Supprimer</button>

        <MembersList v-if="group.showMembers" :groupId="group.id" />
      </li>
    </ul>

    <p v-if="loading">Chargement des groupes...</p>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <p v-if="!loading && groups.length === 0">Aucun groupe trouvé.</p>
  </div>
</template>

<script>
import {ref, onValue, set, push, get, update} from 'firebase/database';
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import MembersList from './MembersList.vue'; 
import UserComposable  from "../composables/UserComposable.js"
const { GetUserByEmail } = UserComposable();
export default {
  components: {
    MembersList,
  },
  data() {
    return {
      groups: [],      
      loading: true,     
      errorMessage: ''  
    };
  },
  created() {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const groupsRef = ref(db, 'groups');

        onValue(groupsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            this.groups = Object.keys(data)
              .filter(key => {
                const group = data[key];

                const isCreator = group.createdBy === user.uid;
                const isMember = group.members && Object.values(group.members).includes(user.uid);

                return isCreator || isMember;
              })
              .map(key => ({
                id: key,
                name: data[key].name,
                members: [],
                showMembers: false 
              }));
          } else {
            this.groups = [];
          }
          this.loading = false;
        }, (error) => {
          this.errorMessage = `Erreur lors de la récupération des groupes: ${error.message}`;
          this.loading = false;
        });
      } else {
        this.groups = [];
        this.loading = false;
      }
    });
  },
  methods: {

    toggleGroupMembers(groupId) {
      this.groups = this.groups.map(group => {
        if (group.id === groupId) {
          group.showMembers = !group.showMembers;
        }
        return group;
      });
    },

    addUserToGroup(groupId) {
      const personEmail = prompt('Entrez l\'adresse e-mail de la personne à ajouter:');
      if (!personEmail) return;

      let personId = null;
      // Retrouver l'ID utilisateur par l'email
      GetUserByEmail(personEmail).then((result) => {
        personId = result;

        if (!personId) {
          alert("Membre non trouvable");
          return;
        }

        const membersRef = ref(db, `groups/${groupId}/members/`);
        get(membersRef).then((snapshot) => {
          let userList = Object.values(snapshot.val());
          if (userList.includes(personId)) {
            alert("Membre déjà membre lol");
            return;
          }

          userList.push(personId);
          update(ref(db, `groups/${groupId}/`), {members: userList}).then(() => {
            alert('Groupe mis à jour');
          });
        })
      })
    },
    deleteGroup(groupId) {
      if (confirm('Voulez-vous vraiment supprimer ce groupe?')) {
        const groupRef = ref(db, `groups/${groupId}`);
        set(groupRef, null);
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

button {
  margin: 5px;
}
</style>
