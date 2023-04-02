class SceneTitle extends LuckyScene {
    constructor(game) {
        super(game)
        this.enableClicked = true
        this.sky = LuckyImage.new(game, 'sky')
        this.sky.y = -50
        this.addElement(this.sky)
        this.start = LuckyImage.new(game, 'start')
        this.start.x = 120
        this.start.y = 120
        this.addElement(this.start)
        this.ground = Ground.new(game)
        this.addElement(this.ground)
        this.game.score = 0
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
            // x 160 - 280
            // y 300 - 400
            // log(event.offsetX)
            var x = event.offsetX
            var y = event.offsetY
            // log(`(${x}, ${y})`)
            if (self.enableClicked) {
                if (y > 0 && y < 520 && x > 0 && x < 450) {
                    self.enableClicked = false
                    var main = Scene.new(self.game)
                    self.game.replaceScene(main)
                    log('开始游戏')
                }
            }
        })
    }
}

class Ground extends LuckyImage {
    constructor(game) {
        super(game, 'land')
        this.y = 450
        this.enabelMoved = true
    }
    draw() {
        super.draw()
        // log('Ground draw')
    }
    update() {
        /*初始化land
        this.skipCount--
        var offsetX = -5
        if (this.skipCount == 0) {
            // 重置
            this.skipCount = 5
            // 向右移动
            offsetX = 20
        }
        for (var g of this.grounds) {
            g.x += offsetX
            this.addElement(g)
        }
        */
        //  && this.scene.bird.alive
        super.update()
        var b = this.scene.bird
        if (this.enabelMoved && b) {
            if (b.alive) {
                this.move()
            }
        }
    }
    move() {
        this.x -= 5
        // 让地板连贯移动
        if (-this.x == this.w / 2) {
            this.x = 0
        }
    }
}
