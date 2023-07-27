
// Test these! and modify the postAPI.js
export const getChat = async(recipientId, pageNum) => {
    try {
        const url = `http://127.0.0.1:3000/chat/get-chat?` + new URLSearchParams({ recipientId: recipientId, page : pageNum }).toString()

        const response = await fetch(url, {
            mode: 'cors',
            credentials: 'include',
            method: 'GET'
        });

        const result = await response.json();
        return result;
    } catch(err) {
        console.log('Could not proccess your request at the moment. Try again later!');
    }
}

export const getChats = async(pageNum) => {
    try {
        const url = (
            'http://127.0.0.1:3000/chat/user-contacts?' +
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
        const url = `http://127.0.0.1:3000/create-chat`;
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
            `http://127.0.0.1:3000/chat/${chatId}` 
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