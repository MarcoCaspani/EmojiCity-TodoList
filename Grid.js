const EMOJI_SIZE = 20;
const EMOJI_WIDTH = 25;
const EMOJI_HEIGHT = 24;
const EMOJI_Y_OFFSET = -5;

const GRID_LINE_COLOR = 10;

function Grid () {
    this.gridWidth = Math.floor(windowWidth / EMOJI_WIDTH);
    this.gridHeight = Math.floor(windowWidth / EMOJI_HEIGHT);

    this.grid_id = Math.floor(Math.random()*1000000000000000);
    this.objs = [];

    this.gridLeftId = undefined;
    this.gridRightId = undefined;
    this.gridUpId = undefined;
    this.gridDownId = undefined;

    this.addObj = function (obj) {
        this.objs.push(obj);
    }

    this.removeObj = function (obj) {
        var index = this.objs.indexOf(obj);
        if (index > -1) {
            this.objs.splice(index, 1);
        }
    }

    this.getObj = function (x, y) {
        for (var i = 0; i < this.objs.length; i++) {
            if (this.objs[i].x === x && this.objs[i].y === y) {
                return this.objs[i];
            }
        }
        return undefined;
    }
    
    this.showGrid = function () {
        stroke(color(GRID_LINE_COLOR, GRID_LINE_COLOR, GRID_LINE_COLOR, 25));
        strokeWeight(0.5);

        for (var i = 0; i <= this.gridWidth; i++) {
            // draw a vertical line
            line(i * EMOJI_WIDTH, 0, i * EMOJI_WIDTH, windowWidth);    
        }

        for (var i = 0; i <= this.gridHeight; i++) {
            // draw a horizontal line
            line(0, i * EMOJI_HEIGHT, windowWidth, i * EMOJI_HEIGHT);
        }

        // show borders of grid if adjacent grids exist
        strokeWeight(3);

        if (this.gridLeftId) {stroke(0, 255, 0);} else {stroke(255, 0, 0);}
        line(0, 0, 0, windowHeight);

        if (this.gridRightId) {stroke(0, 255, 0);} else {stroke(255, 0, 0);}
        line(windowWidth, 0, windowWidth, windowHeight);
        
        if (this.gridUpId) {stroke(0, 255, 0);} else {stroke(255, 0, 0);}
        line(0, 1, windowWidth, 1);
        
        if (this.gridDownId) {stroke(0, 255, 0);} else {stroke(255, 0, 0);}
        line(0, windowWidth, windowWidth, windowWidth);
        

    }

    this.show = function () {
        // show every object in the grid
        for (var i = 0; i < this.objs.length; i++) {
            this.objs[i].show(EMOJI_WIDTH, EMOJI_HEIGHT, EMOJI_Y_OFFSET);
        }
    }

    this.get_grid_pos = function (x, y) {
        // get the grid position of the mouse
        let grid_pos = {
            x: Math.floor(x / EMOJI_WIDTH),
            y: Math.floor(y / EMOJI_HEIGHT),
        }
        return grid_pos;
    }

    this.isInsideGrid = function (x, y) {
        // check if the mouse is inside the grid
        let grid_pos = this.get_grid_pos(x, y);
        if (grid_pos.x >= 0 && grid_pos.x <= this.gridWidth && grid_pos.y >= 0 && grid_pos.y <= this.gridHeight) {
            return true;
        }
        return false;
    }

    this.toJson = function () {
        let json = {
            grid_id: this.grid_id,
            gridWidth: this.gridWidth,
            gridHeight: this.gridHeight,

            gridLeftId: this.gridLeftId,
            gridRightId: this.gridRightId,
            gridUpId: this.gridUpId,
            gridDownId: this.gridDownId,

            objs: this.objs
        }
        
        return json;
    }
    
    this.fromJson = function (json) {
        this.grid_id = json.grid_id;
        this.gridWidth = json.gridWidth;
        this.gridHeight = json.gridHeight;
        this.objs = [];

        // assign pointers to adjacent grids
        this.gridLeftId = json.gridLeftId
        this.gridRightId = json.gridRightId
        this.gridUpId = json.gridUpId
        this.gridDownId = json.gridDownId

        // inflate with objects
        for (var i = 0; i < json.objs.length; i++) {
            let obj = json.objs[i];
            let emoji = new Emoji(obj.emoji, obj.x, obj.y);
            emoji.setInfo(obj.info);
            this.objs.push(emoji);
        }
    }

    this.move_world_left = function () {
        // check if there is already a left grid
        if (!this.gridLeftId) {
            // create a new grid
            let newGrid = new Grid();
            this.gridLeftId = newGrid.grid_id;
            newGrid.gridRightId = this.grid_id;

            saveGrid(newGrid);
            saveGrid(this);
        } 

        // move to left grid
        loadGrid(this.gridLeftId);
    }
    this.move_world_right = function () {
        // check if there is already a right grid
        if (!this.gridRightId) {
            // create a new grid
            let newGrid = new Grid();
            this.gridRightId = newGrid.grid_id;
            newGrid.gridLeftId = this.grid_id;

            saveGrid(newGrid);
            saveGrid(this);
        } 

        // move to right grid
        loadGrid(this.gridRightId);
    }
    this.move_world_up = function () {
        // check if there is already an up grid
        if (!this.gridUpId) {
            // create a new grid
            let newGrid = new Grid();
            this.gridUpId = newGrid.grid_id;
            newGrid.gridDownId = this.grid_id;

            saveGrid(newGrid);
            saveGrid(this);
        }

        // move to up grid
        loadGrid(this.gridUpId);
    }
    this.move_world_down = function () {
        // check if there is already a down grid
        if (!this.gridDownId) {
            // create a new grid
            let newGrid = new Grid();
            this.gridDownId = newGrid.grid_id;
            newGrid.gridUpId = this.grid_id;

            saveGrid(newGrid);
            saveGrid(this);
        }

        // move to down grid
        loadGrid(this.gridDownId);
    }
}