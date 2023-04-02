class Scene extends LuckyScene {
    constructor(game) {
        super(game)
        /*
        this.grounds = []
        for (var i = 0; i < 30; i++) {
            var g = LuckyImage.new(this.game, 'ground')
            g.x = i * 20
            g.y = 550
            this.addElement(g)
            this.grounds.push(g)
        }
        this.skipCount = 5
        */
        this.debugModeEnabled = true
        this.enableScored = false
        this.enableReplaced = false
        //
        this.sky = LuckyImage.new(game, 'sky')
        this.sky.y = -50
        this.addElement(this.sky)
        this.pipe = Pipes.new(game)
        this.addElement(this.pipe)
        this.ground = Ground.new(game)
        this.addElement(this.ground)
        //
        // this.hero = Hero.new(this.game, 'idle', 3)
        // this.addElement(this.hero)
        //
        this.bird = Bird.new(this.game)
        this.bird.enabelFell = false
        this.addElement(this.bird)
        this.score = Score.singleInstance(this.game)
        this.addElement(this.score)
        //
        // this.start = LuckyImage.new(this.game, 'start')
        // this.addElement(this.start)
        // this.end = LuckyImage.new(this.game, 'end')
        // this.addElement(this.end)
        this.setInput()
    }
    draw() {
        super.draw()
    }
    update() {
        super.update()
        // log('this.score', this.score)
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
        var b = this.bird
        for (var i = 0; i < this.pipe.pipes.length; i += 2) {
            var p = this.pipe.pipes[i]
            if (b.x == p.x + p.w  &&  b.alive) {
                this.game.score += 1
                // log('this.game.score', this.game.score)
            }
        }
        // log('scene.enableReplaced', this.enableReplaced)
        // 切换结束场景
        if (this.enableReplaced) {
            var g = this.game
            setTimeout(function(){
                // log('切换结束场景')
                var end = SceneEnd.new(g)
                g.replaceScene(end)
                log('game over')
            }, 500)
        }
    }
    setInput() {
        var p = this.hero
        var g = this.game
        var b = this.bird
        var speed = 2
        //
        g.registerAction('a', function(keyStatus){
            b.move(-speed, keyStatus)
            // p.move(-speed, keyStatus)
        })
        g.registerAction('d', function(keyStatus){
            b.move(speed, keyStatus)
            // p.move(speed, keyStatus)
        })
        g.registerAction('j', function(keyStatus){
            b.jump()
        })
        var self = this
        window.addEventListener('mousedown', function(event){
            // log(event.offsetX)
            var x = event.offsetX
            var y = event.offsetY
            // log(`position: (${x}, ${y})`)
            if (y > 0 && y < 520 && x > 0 && x < 450) {
                b.jump()
            }
        })
    }
}

class Pipes {
    constructor(game) {
        this.game = game
        //
        this.pipes = []
        this.pipeSpaceY = 100
        this.pipeSpaceX = 200
        this.cloumsOfPipe = 3
        this.enabelMoved = true
        this.init()
    }
    static new(game) {
        var i = new this(game)
        return i
    }
    init() {
        for (var i = 0; i < this.cloumsOfPipe; i++) {
            var pipeUp = LuckyImage.new(this.game, 'pipe')
            pipeUp.w = 2 * pipeUp.w
            pipeUp.h = 2 * pipeUp.h
            pipeUp.x = 800 + i * this.pipeSpaceX
            pipeUp.flipY = true
            //
            var pipeDown = LuckyImage.new(this.game, 'pipe')
            pipeDown.w = 2 * pipeDown.w
            pipeDown.h = 2 * pipeDown.h
            pipeDown.x = pipeUp.x
            // pipeDown.y = pipeUp.y + pipeUp.h  + this.pipeSpaceY
            // log('pipeDown.y', pipeDown.y)
            this.resetPipesPositon(pipeUp, pipeDown)
            this.pipes.push(pipeUp)
            this.pipes.push(pipeDown)
        }
    }
    resetPipesPositon(p1, p2) {
        p1.y = -randomBetween(0, 250)
        p2.y = p1.y + p1.h + this.pipeSpaceY
    }
    update() {
        var b = this.scene.bird
        if (b.enabelFell && this.enabelMoved && b.alive) {
            this.move()
        }
        this.isCollidedBird()
        //
        // for (var i = 0; i < this.pipes.length / 2; i += 2) {
        //     // pipeUp
        //     var p1 = this.pipes[i]
        //     p1.x += -5
        //     // log('位置', p.x)
        //     if (p1.x < 50) {
        //         p1.x = 4 * this.pipeSpaceX
        //     }
        //     // pipeDown
        //     var p2 = this.pipes[i+1]
        //     p2.x += -5
        //     // log('位置', p.x)
        //     if (p2.x < 50) {
        //         p2.x = 4 * this.pipeSpaceX
        //         this.resetPipesPositon(p1, p2)
        //     }
        // }
    }
    draw() {
        // for (var p of this.pipes) {
        //     this.game.drawImage(p)
        // }
        // return
        for (var p of this.pipes) {
            var context = p.game.context
            // 保存原有状态
            context.save()
            var w = p.w / 2
            var h = p.h / 2
            // 将 canvas 原点设置到 玩家中心
            context.translate(p.x + w, p.y + h)
            if (p.flipX) {
                // 对象水平反转 scale(x, y) x, y 进行缩放
                context.scale(-1, 1)
            }
            if (p.flipY) {
                // 对象竖直反转 scale(x, y) x, y 进行缩放
                context.scale(1, -1)
            }
            // 回到原来 canvas
            context.translate(-w, -h)
            //
            var w = p.texture.width
            var h = p.texture.height
            context.drawImage(p.texture, 0, 0, 2 * w, 2 * h)
            // this.game.drawImage(p)
            // 回复到原有状态
            context.restore()
        }
    }
    debug() {
        // log('this.pipeSpaceX', this.pipeSpaceX)
        // this.pipeSpaceX = config.pipe_spaceX.value
        // this.pipeSpaceY = config.pipe_spaceY.value
    }
    move() {
        for (var p of this.pipes) {
            p.x += -5
            // log('位置', p.x)
            if (p.x < -100) {
                p.x = 2.5 * this.pipeSpaceX
            }
        }
    }
    isCollidedBird() {
        // log('this.scene', this.scene.bird)
        var b = this.scene.bird
        var ground = this.scene.ground
        for (var p of this.pipes) {
            if (rectIntersects(b, p)) {
                // log('collide the bird')
                this.enabelMoved = false
                ground.enabelMoved = false
                b.kill()
            }
        }
    }
}

class Score {
    constructor(game) {
        this.game = game
        this.scoreList = []
        // var numberOfScores
        this.init()
    }
    // static new(game) {
    //     var i = new this(game)
    //     return i
    // }
    static singleInstance(...args) {
        // log('singleInstance')
        this.instance = this.instance || new this(...args)
        return this.instance
    }
    draw() {
        for (var i = 0; i < this.scoreList.length / 2; i += 2) {
            if (this.game.score > 9) {
                var s2 = this.scoreList[i+1]
                this.game.drawImage(s2)
            }
            var s1 = this.scoreList[i]
            this.game.drawImage(s1)
        }
    }
    update() {
        var score = this.game.score
        var g = this.game
        for (var i = 0; i < this.scoreList.length / 2; i += 2) {
            if (score > 9 && score < 100) {
                var s2 = this.scoreList[i+1]
                var n = Math.floor(score / 10)
                //
                var name = 's' + String(n)
                s2.texture = g.textureByName(name)
                g.drawImage(s2)
            }
            var s1 = this.scoreList[i]
            var n = score % 10
            var name = 's' + String(n)
            s1.texture = g.textureByName(name)
            g.drawImage(s1)
        }
    }
    init() {
        for (var i = 0; i < 2; i++) {
            var s1 = LuckyImage.new(this.game, 's0')
            // s1.x = 220
            s1.x = 200
            s1.y = 80
            var s2 = LuckyImage.new(this.game, 's1')
            s2.x = s1.x - 25
            s2.y = s1.y
            s2.w = 1.5 * s2.w
            this.scoreList.push(s1)
            this.scoreList.push(s2)
        }
    }
}
