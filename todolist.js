var vue;
const NOT_EMOJI_RE = /^[a-z0-9._\!\"\£\$\%\&\/\|\(\)\=\?\^\#\@\§\[\]\à\è\é\ì\ò\ù\*\ç\°\-\:\;\s]+$/i
const RANDOM_EMOJIS = ['🪵', '🪨', '🛤', '🧱']
const MAX_SPAWN_EMOJI = 2

function Todo(text){
    this.id = Math.floor(Math.random()*1000000000000000);
    this.text = text;
    this.done = false;
}

function load_todos(){
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "todos", true);

    // when the server returns the todos put them in the list
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText);
            vue.todos = data;
        }
    };

    xhttp.send();
}

function save_todos(){
    var xhttp = new XMLHttpRequest();
    
    xhttp.open("POST", "save_todos", true);
    xhttp.setRequestHeader('Content-type', 'application/json');

    xhttp.send(JSON.stringify(vue.todos));
}

function new_todo() {
    // when the user pressed enter in the
    // new todo input field
    // add the new todo to the todo list
    let new_todo = new Todo(this.new_todo_text);
    this.todos.push(new_todo);
    this.new_todo_text = "";

    save_todos();
}

function toggle_todo(id) {
    
    for (let i = 0; i < vue.todos.length; i++) {
        if (vue.todos[i].id == id) {
            // when the user clicked on the checkbox
            // get the emojis

            let text = vue.todos[i].text

            // ask the server to filter emoji and text
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "emojis", true);
            xhttp.setRequestHeader('Content-type', 'application/json');

            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    let data = JSON.parse(this.responseText);
                    console.log(data);
                    newEmojis = data.emojis
                    onlyText = data.text

                    // save the EMOJIS in the unallocated_items list   
                    for (let j = 0; j < newEmojis.length; j++) {
                        let emoji = {
                            emoji: newEmojis[j],
                            info: onlyText
                        }
                        vue.unallocated_items.push(emoji);
                    }
                    // add RANDOM EMOJIS to the unallocated_items list
                    let amountToSpawn = Math.floor(Math.random() * (MAX_SPAWN_EMOJI));
                    for (let j = 0; j < amountToSpawn && amountToSpawn > 0; j++) {
                        let randomEmoji = RANDOM_EMOJIS[Math.floor(Math.random() * RANDOM_EMOJIS.length)];
                        let emoji = {
                            emoji: randomEmoji,
                            info: onlyText
                        }
                        vue.unallocated_items.push(emoji);
                    }

                    // and remove the todo
                    vue.todos.splice(i, 1);
                    
                    save_todos();
                    load_todos();
                    save_unallocated_items()
                }
            }
            
            xhttp.send(JSON.stringify({text: text}));
            
            return;
        }
    }

}

function setup() {
    // create a new vue instance
    vue = new Vue({
        el: "#app_vue",
        data: {
            message: "🐵 Hello World 🔮",
            todos: [],
            unallocated_items: [],
            new_todo_text: ""
        },
        methods: {
            new_todo: new_todo,
            toggle_todo: toggle_todo
        }
    })

    load_todos();
    load_unallocated_items();
}


window.onload = setup




