import { get, onValue, push, ref, ref as fbRef, remove, set, update } from "firebase/database";
import { db } from "../firebase.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import UserComposable from "../composables/UserComposable.js";
const { GetUserByID } = UserComposable();
import FormatComposable from "../composables/FormatComposable.js";
const { ToArray } = FormatComposable();

const ChatComposable = () => {
    const GetConversationByID = async (conversationID = "") => {
        if (!conversationID) { return null; }
        return await get(ref(db, `conversations/${conversationID}`)).then(snapshot => {
            if (!snapshot.val()) { return null; }
            let conversation = snapshot.val();
            conversation["uid"] = conversationID;
            return conversation;
        });
    };

    const GetAllConversations = async () => {
        const conversationRef = ref(db, `conversations/`);
        return ToArray((await get(conversationRef)).val());
    };

    const GetPrivateConversationBetweenUsers = async (users = []) => {
        if (!users || users.length != 2) {
            return;
        }
        return await GetAllConversations().then((conversations) => {
            if (!conversations) { return null; }
            for (let conversation of conversations) {
                if (conversation.isPrivate &&
                    conversation.members.sort().toString() == users.sort().toString()) {
                    return conversation;
                }
            }
            return null;
        });
    };

    const CreatePrivateConversation = async (users = []) => {
        if (!users || users.length != 2) {
            return;
        }
        const pm = await GetPrivateConversationBetweenUsers(users);
        if (pm) {
            console.log("Le MP existe déjà : " + users);
            return pm["uid"];
        }
        const conversationRef = ref(db, `conversations/`);
        const newConversationRef = push(conversationRef);
        await set(newConversationRef, {
            members: users,
            isPrivate: true,
            lastUpdateAt: null,
        });
        console.log("MP créé avec succès : " + users);
        return newConversationRef.key;
    };

    const CreateGroupConversation = async (ownerID, groupName = "") => {
        const conversationRef = ref(db, `conversations/`);
        const newGroupRef = push(conversationRef);
        await set(newGroupRef, {
            groupName: groupName ? groupName.trim() : "",
            ownerID: ownerID,
            members: [ownerID],
            isPrivate: false,
            createdAt: Date.now(),
            lastUpdateAt: Date.now(),
        });
        return newGroupRef.key;
    };

    const DeleteGroupConversation = async (groupID) => {
        const conversation = await GetConversationByID(groupID);
        if (!conversation) {
            console.log("La conversation n'existe pas");
            return;
        }
        if (conversation.isPrivate) {
            console.log("Impossible de supprimer une conversation privée");
            return;
        }
        remove(ref(db, `conversations/${groupID}`)).then(() => {
            console.log("Groupe supprimé avec succès");
        });
    };

    const AddUserToGroupConversation = async (groupID, newUserID) => {
        const conversation = await GetConversationByID(groupID);
        if (!conversation) {
            console.log("La conversation n'existe pas");
            return;
        } else if (conversation.isPrivate) {
            console.log("Impossible d'ajouter un membre à une conversation privée");
            return;
        }

        let memberList = conversation.members;
        if (memberList.includes(newUserID)) {
            console.log("Le membre fait déjà partie du groupe");
            return;
        }

        const newMember = await GetUserByID(newUserID);
        if (!newMember) {
            console.log("L'ID du membre est invalide");
            return;
        }

        memberList.push(newUserID);
        update(ref(db, `conversations/${groupID}/`), { members: memberList }).then(() => {
            console.log("Groupe mis à jour");
        });
    };

    const RenameGroup = async (groupID, newName) => {
        const conversation = await GetConversationByID(groupID);
        if (!conversation) {
            console.log("La conversation n'existe pas");
            return;
        } else if (conversation.isPrivate) {
            console.log("Impossible de renommer une conversation privée");
            return;
        }

        update(ref(db, `conversations/${groupID}/`), { groupName: newName }).then(() => {
            console.log("Groupe mis à jour");
        });
    };

    const DeleteUserFromGroupConversation = async (groupID, userID) => {
        const conversation = await GetConversationByID(groupID);
        if (!conversation) {
            console.log("La conversation n'existe pas");
            return;
        } else if (conversation.isPrivate) {
            console.log("Impossible de supprimer un membre d'une conversation privée");
            return;
        }

        if (conversation.ownerID == userID) {
            console.log("Impossible de supprimer le propriétaire du groupe");
            return;
        }

        let memberList = conversation.members.filter((member) => {
            return member !== userID;
        });

        update(ref(db, `conversations/${groupID}/`), { members: memberList }).then(() => {
            console.log("Groupe mis à jour");
        });
    };

    const GetUserConversations = async (userID) => {
        const conversations = (await get(ref(db, `conversations/`))).val();
        if (!conversations) { return null; }

        let userConversations = [];
        for (let key of Object.keys(conversations)) {
            if (!conversations[key].members.includes(userID)) { continue; }

            let members = [];
            for (const member of conversations[key].members) {
                await GetUserByID(member).then(result => {
                    if (result) {
                        members.push(result);
                    }
                });
            }
            conversations[key].members = members;
            Object.assign(conversations[key], { isOwner: conversations[key].ownerID == userID });
            Object.assign(conversations[key], { uid: key });
            userConversations.push(conversations[key]);
        }
        return userConversations;
    };

    const SendMessageToConversation = async (conversationID, userID, message, fileUrl = null) => {
        if (!message && !fileUrl) {
            console.log("Pas de message ou de fichier");
            return false;
        }

        const conversation = await GetConversationByID(conversationID);
        if (!conversation || !conversation.members.includes(userID)) {
            console.log("Pas de conversation ou utilisateur non membre du groupe");
            return false;
        }

        const messagesRef = fbRef(db, `conversations/${conversationID}/messages`);
        push(messagesRef, {
            text: message ? message.trim() : null,
            fileUrl: fileUrl || null,  
            sender: userID,
            sentAt: Date.now(),
            lastEditedAt: null
        });

        update(ref(db, `conversations/${conversationID}/`), { lastUpdateAt: Date.now() }).then(() => { });

        console.log("Message envoyé avec succès");
        return true;
    };

    const UpdateMessageInConversation = async (conversationID, messageID, userID = null, newMessage = "Le poison de Kuzco") => {
        if (!newMessage || !newMessage.trim()) {
            console.log("Pas de message");
            return false;
        }
        const messageRef = fbRef(db, `conversations/${conversationID}/messages/${messageID}`);
        const message = (await get(messageRef)).val();
        if (!message) { return; }
        if (userID && userID != message.sender) {
            console.log("Impossible de modifier les messages d'un autre utilisateur");
            return;
        }
        update(messageRef, {
            text: newMessage.trim(),
            lastEditedAt: Date.now(),
        }).then(() => {
            console.log("Message mis à jour !");
        });
    };

    const DeleteMessageFromConversation = async (conversationID, messageID, userID = null) => {
        const messageRef = fbRef(db, `conversations/${conversationID}/messages/${messageID}`);
        const message = (await get(messageRef)).val();
        if (!message) { return; }
        if (userID && userID != message.sender) {
            console.log("Impossible de modifier les messages d'un autre utilisateur");
            return;
        }
        await remove(messageRef);
    };

    return {
        GetConversationByID,
        GetAllConversations,
        GetPrivateConversationBetweenUsers,
        CreatePrivateConversation,
        CreateGroupConversation,
        DeleteGroupConversation,
        AddUserToGroupConversation,
        DeleteUserFromGroupConversation,
        GetUserConversations,
        RenameGroup,
        SendMessageToConversation,
        UpdateMessageInConversation,
        DeleteMessageFromConversation
    };
};

export default ChatComposable;
