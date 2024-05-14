let chatName = ''
let chatSocket = null
let chatWindowUrl = window.location.href
let chatRoomUuid = Math.random().toString(36).slice(2, 12)

const chatElement = document.querySelector('#chat')
const chatOpenElement = document.querySelector('#chat_open')
const chatJoinElement = document.querySelector('#chat_join')
const chatIconElement = document.querySelector('#chat_icon')
const chatWelcomeElement = document.querySelector('#chat_welcome')
const chatRoomElement = document.querySelector('#chat_room')
const chatNameElement = document.querySelector('#chat_name')
const chatLogElement = document.querySelector('#chat_log')
const chatInputElement = document.querySelector('#chat_message_input')
const chatSubmitElement = document.querySelector('#chat_message_submit')

function scrollToBottom() {
    chatLogElement.scrollTop = chatLogElement.scrollHeight
}

function getCookie(name) {
    var cookieValue = null

    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';')

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim()

            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1))

                break
            }
        }
    }

    return cookieValue
}

function sendMessage() {
    if (chatInputElement.value !== '') {
        chatSocket.send(JSON.stringify({
            'type': 'message',
            'message': chatInputElement.value,
            'name': chatName,
        }))
    }

    chatInputElement.value = ''
}

function onChatMessage(data) {
    if (data.type === 'chat_message') {
        let tmpInfo = document.querySelector('.tmp-info')

        if (tmpInfo) {
            tmpInfo.remove()
        }

        if (data.agent) {
            chatLogElement.innerHTML += `
                <div class="flex w-full mt-2 space-x-3 max-w-md">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-200 dark:text-gray-700 text-center pt-2">
                        ${data.initials}
                    </div>
                    <div>
                        <div class="bg-gray-300 dark:bg-gray-200 p-3 rounded-l-lg rounded-br-lg">
                            <p class="text-sm dark:text-gray-700">${data.message}</p>
                        </div>
                        <span class="text-xs leading-none text-gray-500 dark:text-gray-300">
                            ${data.created_at} ago
                        </span>
                    </div>
                </div>
            `
        } else {
            chatLogElement.innerHTML += `
                <div class="flex w-full mt-2 space-x-3 max-w-md ml-auto justify-end">
                    <div>
                        <div class="bg-blue-300 p-3 rounded-l-lg rounded-br-lg">
                            <p class="text-sm dark:text-gray-700">${data.message}</p>
                        </div>
                        <span class="text-xs leading-none text-gray-500 dark:text-gray-300">
                            ${data.created_at} ago
                        </span>
                    </div>
                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-200 text-center dark:text-gray-700 pt-2">
                        ${data.initials}
                    </div>
                </div>
            `
        }
    } else if (data.type === 'users_update') {
        let join = document.querySelector('#join')

        if (join) {
            join.remove()
        }
        chatLogElement.innerHTML += '<p id="join" class="mt-2 text-xs">The admin has joined the chat.</p>'
    } else if (data.type === 'writing_active') {
        if (data.agent) {
            let tmpInfo = document.querySelector('.tmp-info')

            if (tmpInfo) {
                tmpInfo.remove()
            }

            chatLogElement.innerHTML += '<p class="mt-2 tmp-info text-xs">The admin is typing...</p>'
        }
    } else if (data.type === 'writing_unactive') {
        if (data.agent) {
            let tmpInfo = document.querySelector('.tmp-info')

            if (tmpInfo) {
                tmpInfo.remove()
            }
        }
    }

    scrollToBottom()
}

async function joinChatRoom() {
    chatName = chatNameElement.value
    const data = new FormData()
    data.append('name', chatName)
    data.append('url', chatWindowUrl)

    await fetch(`/api/create-room/${chatRoomUuid}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: data
    })
    .then(function (res) {
        return res.json()
    })
    .then(function (data) {
        console.log('data', data)
    })

    chatSocket = new WebSocket(`ws://${window.location.host}/ws/${chatRoomUuid}/`)

    chatSocket.onmessage = function (e) {
        console.log('onMessage')

        onChatMessage(JSON.parse(e.data))
    }

    chatSocket.onopen = function (e) {
        console.log('onOpen - chat socket was opened')

        scrollToBottom()
    }

    chatSocket.onclose = function (e) {
        console.log('onClose - chat socket was closed')
    }
}

chatOpenElement.onclick = function (e) {
    e.preventDefault()

    chatIconElement.classList.add('hidden')
    chatWelcomeElement.classList.remove('hidden')

    return false
}

chatJoinElement.onclick = function (e) {
    if (chatNameElement.value === '') {
        return false
    }

    e.preventDefault()

    chatWelcomeElement.classList.add('hidden')
    chatRoomElement.classList.remove('hidden')

    joinChatRoom()

    return false
}

chatSubmitElement.onclick = function (e) {
    e.preventDefault()

    sendMessage()

    return false
}

chatInputElement.onkeyup = function (e) {
    if (e.keyCode === 13) {
        sendMessage()
    }
}

chatInputElement.addEventListener('focusin', (event) =>  {
    chatSocket.send(JSON.stringify({
        'type': 'update',
        'message': 'writing_active',
        'name': chatName,
    }))
})

chatInputElement.addEventListener('focusout', (event) =>  {
    chatSocket.send(JSON.stringify({
        'type': 'update_writing_unactive',
        'message': 'writing_unactive',
        'name': chatName,
    }))
})