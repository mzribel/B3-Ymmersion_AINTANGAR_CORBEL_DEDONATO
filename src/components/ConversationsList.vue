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
  </div>
</template>

<script>
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
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
              .filter(key => data[key].createdBy === user.uid) 
              .map(key => ({
                id: key,
                name: data[key].name
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
</style>
