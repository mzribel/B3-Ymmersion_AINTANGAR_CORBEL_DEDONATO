<template>
    <div class="chat">
        <div class="messages">
            <div v-for="(message, index) in messages" :key="index" class="message">
                <strong>{{ message.username }}:</strong> {{ message.text }}
            </div>
        </div>
        <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Tapez votre message..." />
    </div>
</template>

<script>
import { db } from '../firebase'; // Importer Firebase Realtime Database

export default {
    data() {
        return {
            messages: [],      // Stocke les messages récupérés de la base de données
            newMessage: '',    // Nouveau message à envoyer
            username: 'Anonyme'  // Nom d'utilisateur par défaut
        };
    },
    created() {
        // Récupérer les messages en temps réel depuis Firebase Realtime Database
        const messagesRef = db.ref('messages');

        // Récupérer les nouveaux messages ajoutés à la base de données
        messagesRef.on('child_added', snapshot => {
            // Ajouter chaque message à la liste des messages
            this.messages.push(snapshot.val());
        });
    },
    methods: {
        sendMessage() {
            if (this.newMessage.trim() === '') return;

            // Référence à l'emplacement des messages dans la Realtime Database
            const messagesRef = db.ref('messages');

            // Ajouter le message à la base de données
            messagesRef.push({
                text: this.newMessage,
                username: this.username,
                timestamp: Date.now()
            });

            // Réinitialiser l'input après envoi
            this.newMessage = '';
        }
    }
};
</script>

<style scoped>
.chat {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.messages {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 1rem;
}

.message {
    margin: 0.5rem 0;
}

input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    width: 100%;
}
</style>
