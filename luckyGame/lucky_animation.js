class LuckyAnimation {
    constructor(game, name, count) {
        this.game = game
        this.animationName = name
        this.animations = {}
        // log(`LuckyAnimation this.animations<${this.animations}>, this.animationName<${this.animationName}>`)
        this.addAnimation(name, count)
        //
        this.framesCount = 5
        this.framesIndex = 0
        // this.texture = this.frames[0]
        this.texture = this.frames()[0]
        this.alpha = 1
        //
        this.x = 0
        this.y = 0
        this.w = this.texture.width
        this.h = this.texture.height
        //
        this.flipX = false
        this.rotation = 0
    }
    frames() {
        var l = this.animations[this.animationName]
        // log('framesframesframes', l, this.animations, this.animationName)
        return l
    }
    static new(game, name, count) {
        var i = new this(game, name, count)
        return i
    }
    update() {
        this.framesCount--
        if (this.framesCount == 0) {
            this.framesCount = 5
            this.framesIndex = (this.framesIndex + 1) % this.frames().length
            this.texture = this.frames()[this.framesIndex]
        }
    }
    draw() {
        this.game.drawImage(this)
    }
    flipHorizontal() {
        var context = this.game.context
        // 保存原有状态
        context.save()
        var w = this.w / 2
        var h = this.h / 2
        // 将 canvas 原点设置到 玩家中心
        context.translate(this.x + w, this.y + h)
        if (this.flipX) {
            // 对象水平反转 scale(x, y) x, y 进行缩放
            context.scale(-1, 1)
        }
        // 回到原来canvas
        context.translate(-w, -h)
        context.drawImage(this.texture, 0, 0)
        // 回复到原有状态
        context.restore()
    }
    changeAnimation(name) {
        this.animationName = name
    }
    addAnimation(name, count) {
        // log('addAnimation', this.animations, name, count)
        this.animations[name] = []
        for (var i = 0; i < count; i++) {
            var n = name + String(i)
            var t = this.game.textureByName(n)
            this.animations[name].push(t)
        }
        // log('this.animations', this.animations)
    }
}

class Hero extends LuckyAnimation {
    constructor(game) {
        super(game, 'idle', 3)
        this.setup()
    }
    setup() {
        /*
        for (var i = 0; i < 6; i++) {
            var name = `run${i}`
            var t = this.game.textureByName(name)
            this.animations['run'].push(t)
        }
        for (var i = 0; i < 3; i++) {
            var name = `idle${i}`
            var t = this.game.textureByName(name)
            this.animations['idle'].push(t)
        }
        */
        this.addAnimation('run', 6)
    }
    move(x, keyStatus) {
        // log('move keyStatus', keyStatus)
        /*不好的写法
        if (x < 0) {
            this.flipX = true
        } else {
            this.flipX = false
        }
        */
        this.flipX = (x < 0)
        this.x += x
        //
        /*不好的写法
        if (keyStatus == 'down') {
            this.changeAnimation('run')
        } else if (keyStatus == 'up') {
            this.changeAnimation('idle')
        }
        */
        // ifelseif => dic
        var animationNames = {
            down: 'run',
            up: 'idle',
        }
        var name = animationNames[keyStatus]
        this.changeAnimation(name)
    }
}

class Bird extends LuckyAnimation {
    constructor(game) {
        super(game, 'b', 3)
        this.setup()
    }
    setup() {
        this.x = 200
        this.y = 300
        this.vy = 0
        this.gy = 10
        //
        this.alive = true
        this.enabelFell = false
        this.isCollided = false
    }
    update() {
        super.update()
        if (this.enabelFell) {
            this.fall()
        }
        if (this.enabelFell && this.rotation < 90) {
            this.rotation += 2
            if (this.rotation > 20) {
                this.rotation += 10
            }
        }
        // log('bird this.scene', this.scene, this.scene.enableReplaced)
        var h = 430
        if (this.y > h) {
            this.y = h
            this.kill()
            this.scene.enableReplaced = true
        }
    }
    draw() {
        // this.game.drawImage(this)
        // this.flipHorizontal()
        var context = this.game.context
        // 保存原有状态
        context.save()
        //
        var w = this.w / 2
        var h = this.h / 2
        // 将 canvas 原点设置到 玩家中心
        context.translate(this.x + w, this.y + h)
        if (this.flipX) {
            // 对象水平反转 scale(x, y) x, y 进行缩放
            context.scale(-1, 1)
        }
        // context.globalAlpha = this.alpha
        context.rotate(this.rotation * Math.PI / 180)
        // 回到原来canvas
        context.translate(-w, -h)
        context.drawImage(this.texture, 0, 0)
        // 回复到原有状态
        context.restore()
    }
    jump() {
        if (this.alive) {
            this.enabelFell = true
            this.vy = -7
            this.rotation = -45
        }
    }
    fall() {
        this.y += this.vy
        this.vy += this.gy * 0.05
    }
    move(x) {
        // log('move keyStatus', keyStatus)
        this.flipX = (x < 0)
        this.x += x
    }
    kill() {
        this.alive = false
    }
}
