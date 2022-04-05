var vue;
var grid;

const GRID_BACKGROUND = 250

function loadGrid(id){
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "grid", true);

  // when the server returns the todos put them in the list
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          let data = JSON.parse(this.responseText);

          console.log(data);
          // load the grid with id
          grid.fromJson(data[id]);
      }
  };

  xhttp.send();
}



// when the user selects an unallocated emoji
function select_unallocated_item(item){
  if (vue.selected_unallocated_item === undefined) {
    vue.selected_unallocated_item = item;
  }
}

// when the users wants to move an item already placed in the grid
function moveGridItem(item) {
  vue.emojiDialogOpen = false;
  vue.selected_unallocated_item = item;

  grid.removeObj(item);
}

function deleteGrid(){
  // delete grid from server and reload to grid 1
  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "grid", true);
  xhttp.setRequestHeader('Content-type', 'application/json');

  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          loadGrid(1);
      }
  }

  xhttp.send(JSON.stringify(grid.toJson()));
}

function setup() {
  // create a new vue instance
  vue = new Vue({
    el: "#app_vue",
    data: {
        unallocated_items: undefined,
        selected_unallocated_item: undefined,
        selectedGridItem: undefined,
        emojiDialogOpen: false,
        isGridEmpty: false,
    },
    methods: {
      select_unallocated_item: select_unallocated_item,
      moveGridItem: moveGridItem,
      move_world_left: function(){grid.move_world_left();},
      move_world_right: function(){grid.move_world_right();},
      move_world_up: function(){grid.move_world_up();},
      move_world_down: function(){grid.move_world_down();},
      deleteGrid: deleteGrid,
    }
  });

  load_unallocated_items();
  
  // put p5 setup code here
  let myCanvas = createCanvas(windowWidth, windowWidth);
  myCanvas.parent("canvas");

  textSize(EMOJI_SIZE);

  grid = new Grid(windowWidth, windowWidth);
  loadGrid(1);
}

function draw() {
  // put drawing code here
  background(GRID_BACKGROUND);
  
  grid.showGrid();
  grid.show();

  if (grid.objs.length === 0 && grid.grid_id !== 1) {
    vue.isGridEmpty = true;
  } else {
    vue.isGridEmpty = false;
  }
}

function checkAndPlaceNewEmoji(){
  if (vue.selected_unallocated_item !== undefined) {
    // place emoji in grid
    let grid_pos = grid.get_grid_pos(mouseX, mouseY);

    // check that the grid position is not already occupied
    let obj = grid.getObj(grid_pos.x, grid_pos.y);
    if (!obj) {
      // retrieve the unallocated item
      let emoji = new Emoji(vue.selected_unallocated_item.emoji, grid_pos.x, grid_pos.y);
      emoji.setInfo(vue.selected_unallocated_item.info);

      grid.addObj(emoji);
      vue.selected_unallocated_item = undefined;

      // remove the emoji from unallocated emojis
      for (let i = 0; i < vue.unallocated_items.length; i++) {
        if (vue.unallocated_items[i].emoji === emoji.emoji) {
          vue.unallocated_items.splice(i, 1);
          break;
        }
      }

      save_unallocated_items();
      saveGrid(grid);
    }
  }
}

function checkAndSelectGridEmoji(){
  let grid_pos = grid.get_grid_pos(mouseX, mouseY);

  let obj = grid.getObj(grid_pos.x, grid_pos.y);
  if (obj) {
    vue.emojiDialogOpen = true;
    vue.selectedGridItem = obj;
  }
}

function mouseClicked() {
  // check if the mouse is inside the grid
  if (grid.isInsideGrid(mouseX, mouseY)) {
    checkAndSelectGridEmoji();
    checkAndPlaceNewEmoji();
  }
}


