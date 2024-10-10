<template>
  <div class="conversations-list">
    <h3>Vos Groupes</h3>
    <ul>
      <li v-for="group in groups" :key="group.id">
        <router-link :to="`/chat/${group.id}`">{{ group.name }}</router-link>
        <button @click="toggleGroupMembers(group.id)">
          {{ group.showMembers ? 'Masquer les membres' : 'Afficher les membres' }}
        </button>
        <button @click="addPersonToGroup(group.id)">Ajouter une personne</button>
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
import { ref, onValue, set, push, get } from 'firebase/database';
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import MembersList from './MembersList.vue'; 

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

    addPersonToGroup(groupId) {
      const personEmail = prompt('Entrez l\'adresse e-mail de la personne à ajouter:');
      if (!personEmail) return;

      const usersRef = ref(db, 'users');
      let personId = null;

      get(usersRef).then(snapshot => {
        const users = snapshot.val();
        for (let key in users) {
          if (users[key].email === personEmail) {
            personId = key;
            break;
          }
        }

        if (personId) {
          const groupMembersRef = ref(db, `groups/${groupId}/members/`);

          for (let group of this.groups) {
            if (group.id === groupId) {
              if (group.members.find(m => m.id === personId)) {
                alert('Personne déjà membre du groupe.');
                return;
              }
            }
          }

          push(groupMembersRef, personId).then(() => {
            alert('Personne ajoutée au groupe.' + personId);
          }).catch(error => {
            alert(`Erreur lors de l'ajout de la personne au groupe : ${error.message}`);
          });

        } else {
          alert('Utilisateur non trouvé.');
        }

      }).catch(error => {
        alert(`Erreur lors de la recherche de l'utilisateur: ${error.message}`);
      });
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
