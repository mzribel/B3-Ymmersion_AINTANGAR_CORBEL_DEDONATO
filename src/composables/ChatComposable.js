import {get, onValue, push, ref, ref as fbRef, remove, set, update} from "firebase/database";
import { db } from "../firebase.js";

import UserComposable from "../composables/UserComposable.js";
const { GetUserByID } = UserComposable();

const ChatComposable = () => {

    // Récupère une conversation par son ID
    const GetConversationByID = async (conversationID = "") => {
        if (!conversationID) { return null; }
        const groupRef = ref(db, `groups/${conversationID}`);
        return await (await get(groupRef)).val();
    }

    // Récupère toutes les conversations
    const GetAllConversations = async () => {
        const conversationRef = ref(db, `groups/`);
        return (await get(conversationRef)).val();
    }

    // Récupère, si elle existe, une conversation privée entre deux utilisateurs
    const GetPrivateConversationBetweenUsers = async (users = []) => {
        if (!users || users.length != 2) {
            return;
        }
        return await GetAllConversations().then((conversations) => {
            if (!conversations) { return null; }

            for (let key of Object.keys(conversations)) {
                if (conversations[key].isPrivate &&
                    conversations[key].members.sort().toString() == users.sort().toString()) {
                    return {[key]: conversations[key]};
                }
            }
            return null;
        })
    }

    // Crée, si elle n'existe pas, une conversation entre deux utilisateurs
    const CreatePrivateConversation = async (users = []) => {
        if (!users || users.length != 2) {
            return;
        }
        const pm = await GetPrivateConversationBetweenUsers(users)
        if (pm) {
            console.log("Le MP existe déjà : "+users)
            return Object.keys(pm)[0];
        }
        const conversationRef = ref(db, `groups/`);
        const newConversationRef = push(conversationRef);
        console.log(newConversationRef)
        await set(newConversationRef, {
            members: users,
            isPrivate: true
        });
        console.log("MP crée avec succès : "+users)
        return newConversationRef.key;
    }

    // Crée une conversation de groupe
    // Todo : pour l'instant, elle est vide et il faut la peupler après-coup
    const CreateGroupConversation = async (ownerID, groupName="") => {
        const conversationRef = ref(db, `groups/`);
        const newGroupRef = push(conversationRef);
        await set(newGroupRef, {
            groupName: groupName ? groupName.trim() : "",
            ownerID: ownerID,
            members: [ownerID],
            isPrivate: false
        });
    }

    // Supprime une conversation de groupe
    const DeleteGroupConversation = async (groupID) => {
        const conversation = await GetConversationByID(groupID);
        if (!conversation) {
            console.log("La conversation n'existe pas")
            return;
        }
        if (conversation.isPrivate) {
            console.log("Impossible de supprimer une conversation privée")
            return;
        }
        remove(ref(db, `groups/${groupID}`)).then(()=> {
            console.log("Groupe supprimé avec succès")
        });
    }

    // Ajoute un membre à une conversation de groupe
    const AddUserToGroupConversation = async (groupID, newUserID) => {
        const conversation = await GetConversationByID(groupID);
        if (!conversation) {
            console.log("La conversation n'existe pas")
            return;
        } else if (conversation.isPrivate) {
            console.log("Impossible d'ajouter un membre à une conversation privée")
            return;
        }

        let memberList = conversation.members;
        if (memberList.includes(newUserID)) {
            console.log("Le membre fait déjà partie du groupe")
            return;
        }

        const newMember = await GetUserByID(newUserID);
        if (!newMember) {
            console.log("L'id du membre est invalide");
            return;
        }

        memberList.push(newUserID);
        update(ref(db, `groups/${groupID}/`), {members: memberList}).then(() => {
            console.log("Groupe mis à jour")
        });
    }

    const DeleteUserFromGroupConversation = async (groupID, userID) => {
        const conversation = await GetConversationByID(groupID);
        if (!conversation) {
            console.log("La conversation n'existe pas")
            return;
        } else if (conversation.isPrivate) {
            console.log("Impossible de supprimer un membre d'une conversation privée")
            return;
        }

        if (conversation.ownerId == userID) {
            console.log("Impossible de supprimer le propriétaire du groupe")
            return;
        }

        let memberList = conversation.members.filter((member) => {
            return member !== userID
        });

        update(ref(db, `groups/${groupID}/`), {members: memberList}).then(() => {
            console.log("Groupe mis à jour")
        });
    }

    const GetUserConversations = async (userID) => {
        const conversations = (await get(ref(db, `groups/`))).val();
        if (!conversations) { return null; }

        let userConversations = [];
        for (let key of Object.keys(conversations)) {
            if (!conversations[key].members.includes(userID)) { continue }

            let members = [];
            for (const member of conversations[key].members) {
                await GetUserByID(member).then(result => {
                    if (result) {
                        members.push(result);
                    }
                });
            }
            conversations[key].members = members;
            userConversations[key] = conversations[key];
        }
        console.log(userConversations)
    }

    return {
        GetConversationByID,
        GetAllConversations,
        GetPrivateConversationBetweenUsers,
        CreatePrivateConversation,
        CreateGroupConversation,
        DeleteGroupConversation,
        AddUserToGroupConversation,
        DeleteUserFromGroupConversation,
        GetUserConversations
        // Todo : UpdateGroupConversation
    }
}

export default ChatComposable;