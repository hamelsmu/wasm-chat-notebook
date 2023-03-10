document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.emit('page-loaded', 'test')

    // This is the hardcoded bot message
    function sendBotMessage(){
        const time = new Date().toLocaleString();
        socket.emit('message', {'user': 'HamML Bot', 'message': 'Sure, I can help you with that!  Here is some code:', 'time':time})
    };

    // Construct the message to broadcast
    function sendMessage(){
        const message = document.querySelector('#msg').value
        const name = document.querySelector("#name").innerText
        const time = new Date().toLocaleString();
        socket.emit('message', {'user': name, 'message': message, 'time':time})
        document.getElementById("msg").value = "";
        sendBotMessage();
    };


    document.getElementById("message-form")
    .addEventListener("submit", function(event) {
        event.preventDefault();
        document.getElementById("send").click();
        document.getElementById("msg").value = "";
    });

    socket.on('connect', () => {
        document.querySelector('button').onclick = sendMessage; 
    });

    socket.on('get-message', data => {
        // get current user for color
        var current_user = document.getElementById("name").textContent

        if (current_user === data.user) {
            var color = 'red';
        } else {
            var color = 'blue';
        };

        // create scaffolding for card
        var new_row = document.createElement('div')
        new_row.classList.add('card')

        // make card body
        var card = `<div class="card-body">
                        <span class="card-title" style="color:${color}">${data.user}</span>
                        <small class="card-subtitle text-muted"> at ${data.time}</small>
                        <p class="card-text">${data.message}</p>
                    </div>`;
        
        var code_block = `<div style="margin-right: 3rem;">
                             <py-repl id="my-repl" output="replOutput">print('hello')</py-repl>
                             <div class="card-body">
                                <p class="card-text code-output" id="replOutput"></p>
                             </div>
                         </div>`;
        
        // inject the REPL if the user is HamML Bot
        if (data.user == 'HamML Bot') {
            card = card + code_block;
        };                
        // populate the card    
        new_row.innerHTML = card;

        // display the messages on the page!
        document.querySelector('#messages').append(new_row);
        window.scrollTo(0,document.body.scrollHeight);
    });

    socket.on('burn', data => {
        document.querySelector('#messages').innerHTML = '';
    });
});