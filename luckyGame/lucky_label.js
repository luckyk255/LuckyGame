class LuckyLabel {
    constructor(game, text) {
        this.game = game
        this.text = text
        this.x = 0
        this.y = 0
    }
    static new(game, text) {
        var instance = new this(game, text)
        return instance
    }
    draw() {
        this.game.context.fillText(this.text, this.x, this.y)
    }
    update() {
    }
}
