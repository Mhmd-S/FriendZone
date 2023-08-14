
// Test these! and modify the postAPI.js
export const getChat = async(chatId, pageNum) => {
    try {
        const url = `https://friend-zone-2rm0.onrender.com/chat/get-chat?` + new URLSearchParams({ chatId: chatId, page : pageNum }).toString()

        const response = await fetch(url, {
            mode: 'cors',
            credentials: 'include',
            method: 'GET'
        });

        const result = await response.json();
        console.log(12222)
        return result;
    } catch(err) {
        console.log('Could not proccess your request at the moment. Try again later!');
    }
}

export const getChats = async(pageNum) => {
    try {
        const url = (
            'https://friend-zone-2rm0.onrender.com/chat/user-contacts?' +
            new URLSearchParams({ page : pageNum }).toString()
        )

        const response = await fetch(url, {
            mode: 'cors',
            credentials: 'include',
            method: 'GET'
        });

        const result = await response.json();
        return result;
    } catch (err) {
        console.log('Could not proccess your request at the moment. Try again later!')
    }
}

export const createChat = async(participants) => {
    try {
        const url = `https://friend-zone-2rm0.onrender.com/create-chat`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: participants.toString(),
            credentials: 'include',
            mode: 'cors',
        });

        const res = await response.json();
        return res;
    } catch(err) {
        console.log('Could not proccess your requrest at the moment. Please try again later.');
    }
}


export const addToChat = async(chatId, message) => {
    try {
        const url = (
            `https://friend-zone-2rm0.onrender.com/chat/${chatId}` 
        )

        const response = await fetch(url, {
            mode: 'cors',
            credentials: 'include',
            method: 'GET',
            body: message.toString()
        });

        const result = await response.json();
        return result;
    } catch (err) {
        console.log('Could not proccess your request at the moment. Try again later!')
    }
}