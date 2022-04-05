function Emoji(emoji, x, y) {
    this.emoji = emoji;
    this.x = x;
    this.y = y;

    this.info = "";

    this.show = function(xUnit, yUnit, yOffset) {
        text(this.emoji, this.x * xUnit, this.y * yUnit + yUnit + yOffset);
    }

    this.setInfo = function(info) {
        this.info = info;
    }
}