/**
 * Variables
 */

const chatRoom = document.querySelector('#room_uuid').textContent.replaceAll('"', '')

let chatSocket = null


/**
 * Elements
 */

const chatLogElement = document.querySelector('#chat_log')
const chatInputElement = document.querySelector('#chat_message_input')
const chatSubmitElement = document.querySelector('#chat_message_submit')


/**
 * Functions
 */

function scrollToBottom() {
    chatLogElement.scrollTop = chatLogElement.scrollHeight
}

function sendMessage() {
    if (chatInputElement.value !== '') {
        chatSocket.send(JSON.stringify({
            'type': 'message',
            'message': chatInputElement.value,
            'name': document.querySelector('#user_name').textContent.replaceAll('"', ''),
            'agent': document.querySelector('#user_id').textContent.replaceAll('"', ''),
        }))
    }

    chatInputElement.value = ''
}

function onChatMessage(data) {
    console.log('onChatMessage', data)

    if (data.type === 'chat_message') {
        let tmpInfo = document.querySelector('.tmp-info')

        if (tmpInfo) {
            tmpInfo.remove()
        }

        if (!data.agent) {
            chatLogElement.innerHTML += `
                <div class="flex w-full mt-2 space-x-3 max-w-md">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-200 text-center pt-2">
                        ${data.initials}
                    </div>
                    <div>
                        <div class="bg-gray-300 dark:bg-gray-200 p-3 rounded-l-lg rounded-br-lg">
                            <p class="text-sm">${data.message}</p>
                        </div>
                        <span class="text-xs text-gray-500 dark:text-gray-300 leading-none">
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
                            <p class="text-sm">${data.message}</p>
                        </div>
                        <span class="text-xs text-gray-500 dark:text-gray-300 leading-none">
                            ${data.created_at} ago
                        </span>
                    </div>
                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-200 text-center pt-2">
                        ${data.initials}
                    </div>
                </div>
            `
        }
    } else if (data.type === 'writing_active') {
        if (!data.agent) {
            let tmpInfo = document.querySelector('.tmp-info')

            if (tmpInfo) {
                tmpInfo.remove()
            }

            chatLogElement.innerHTML += '<p class="mt-2 tmp-info text-xs justify-end dark:text-gray-300">The client is typing...</p>'
        }
    } else if (data.type === 'writing_unactive') {
        if (!data.agent) {
            let tmpInfo = document.querySelector('.tmp-info')

            if (tmpInfo) {
                tmpInfo.remove()
            }
        }
    }

    scrollToBottom()
}

/**
 * Web socket
 */

chatSocket = new WebSocket(`ws://${window.location.host}/ws/${chatRoom}/`)

chatSocket.onmessage = function (e) {
    console.log('onMessage')

    onChatMessage(JSON.parse(e.data))
}

chatSocket.onopen = function (e) {
    console.log('onOpen')
}

chatSocket.onclose = function (e) {
    console.log('chat socket closed unexpectadly')
}

/**
 * Event listeners
 */

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
        'name': document.querySelector('#user_name').textContent.replaceAll('"', ''),
        'agent': document.querySelector('#user_id').textContent.replaceAll('"', ''),
    }))
})

chatInputElement.addEventListener('focusout', (event) =>  {
    chatSocket.send(JSON.stringify({
        'type': 'update_writing_unactive',
        'message': 'writing_unactive',
        'name': document.querySelector('#user_name').textContent.replaceAll('"', ''),
        'agent': document.querySelector('#user_id').textContent.replaceAll('"', ''),
    }))
})