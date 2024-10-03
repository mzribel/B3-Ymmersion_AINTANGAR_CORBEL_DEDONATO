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
import { ref, onChildAdded, push } from 'firebase/database'; 
import { db } from '../firebase';

export default {
    data() {
        return {
            messages: [],
            newMessage: '',
            username: 'Anonyme'
        };
    },
    created() {
        const messagesRef = ref(db, 'messages');
        onChildAdded(messagesRef, (snapshot) => {
            const message = snapshot.val();
            this.messages.push(message);
        });
        
            },
    methods: {
        sendMessage() {
            if (this.newMessage.trim() === '') return;

            const messagesRef = ref(db, 'messages');

            push(messagesRef, {
                text: this.newMessage,
                username: this.username,
                timestamp: Date.now()
            });

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
