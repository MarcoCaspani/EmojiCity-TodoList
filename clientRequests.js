function load_unallocated_items(){
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "unallocated_items", true);

    // when the server returns the todos put them in the list
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText);
            vue.unallocated_items = data;
            }
    };

    xhttp.send();
}

function save_unallocated_items(){
    var xhttp = new XMLHttpRequest();
    
    xhttp.open("POST", "unallocated_items", true);
    xhttp.setRequestHeader('Content-type', 'application/json');

    xhttp.send(JSON.stringify(vue.unallocated_items));
}

function saveGrid(grid){
    var xhttp = new XMLHttpRequest();

    xhttp.open("POST", "grid", true);
    xhttp.setRequestHeader('Content-type', 'application/json');

    xhttp.send(JSON.stringify(grid.toJson()));
}