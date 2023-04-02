class SceneEnd extends LuckyScene {
    constructor(game) {
        super(game)
        this.sky = LuckyImage.new(game, 'sky')
        this.sky.y = -50
        this.addElement(this.sky)
        this.end = LuckyImage.new(game, 'end')
        this.end.x = 120
        this.end.y = 200
        this.addElement(this.end)
        this.ground = Ground.new(game)
        this.addElement(this.ground)
        this.score = Score.singleInstance(game)
        this.addElement(this.score)
        this.bird = Bird.new(game)
        this.bird.y = 320
        this.enableClicked = true
        this.addElement(this.bird)
        this.setInput()
    }
    draw() {
        super.draw()
    }
    update() {
        super.update()
    }
    setInput() {
        var self = this
        window.addEventListener('mousedown', function(event){
            // log(event.offsetX)
            var x = event.offsetX
            var y = event.offsetY
            // log(`position: (${x}, ${y})`)
            if (self.enableClicked) {
                if (y > 0 && y < 520 && x > 0 && x < 450) {
                    log('重新开始')
                    self.enableClicked = false
                    var title = SceneTitle.new(self.game)
                    self.game.replaceScene(title)
                }
            }
        })
    }
}
