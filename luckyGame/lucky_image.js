class LuckyImage {
    constructor(game, name) {
        this.game = game
        this.texture = game.textureByName(name)
        this.x = 0
        this.y = 0
        this.w = this.texture.width
        this.h = this.texture.height
        this.name = name
        //
        this.frames = []
        this.framesIndex = 0
        this.framesCount = 3
        //
        this.flipY = false
    }
    static new(game, name) {
        var instance = new this(game, name)
        return instance
    }
    draw() {
        // log('draw LuckyImage')
        this.game.drawImage(this)
    }
    update() {
    }
    // 添加素材图片
    addImages(name) {
        for (var i = 0; i < 4; i++) {
            var n = name + String(i)
            var t = this.game.textureByName(n)
            this.frames.push(t)
        }
        this.texture = this.frames[0]
        // log('this.texture', frames[0], this.texture)
    }
    // 通过切换图片 爆炸后动画效果
    crash() {
        if (this.isCollided && this.framesIndex < 4) {
            this.framesCount--
            if (this.framesCount == 0) {
                this.framesCount = 3
                // this.framesIndex = (this.framesIndex + 1) % this.frames.length
                this.framesIndex += 1

                this.texture = this.frames[this.framesIndex]
            }
            if (this.framesIndex == 4) {
                this.kill()
            }
        }
    }
}

class Background extends LuckyImage {
    constructor(game) {
        var type = randomBetween(0, 1)
        var name = '' + String(type)
        super(game, 'bg')
        // this.h = 1400
        this.setup()
    }
    setup() {
        this.speed = 3
        this.x = 0
        this.y = -700
        this.alive = true
    }
    draw() {
        super.draw()
    }
    update() {
        this.y += this.speed
        if (this.y > 0) {
            this.setup()
        }
    }
    debug() {
        this.speed = config.bg_speed
    }
}

class Bullet extends LuckyImage {
    constructor(game) {
        super(game, 'bullet')
        this.setup()
    }
    setup() {
        this.speed = 10
        // this.speed = config.bullet_speed
        this.alive = true
        this.firedByPlayer = true
    }
    draw() {
        if (this.alive) {
            this.game.drawImage(this)
        }
    }
    update() {
        //
        if (this.firedByPlayer) {
            this.y -= this.speed

        } else {
            this.speed =  10
            this.y += this.speed
        }
        if (this.y < 0 || this.y > 650) {
            this.kill()
        }
        if (this.alive && this.firedByPlayer) {
            this.killEnemy()
            this.killSelf()
        }
        if (!this.firedByPlayer) {
            this.killPlayer()
        }
    }
    debug() {
        this.speed = config.bullet_speed
    }
    kill() {
        this.alive = false
    }
    killEnemy() {
        var es = this.scene.enemies
        for (var e of es) {
            if (e.alive && rectIntersects(e, this)) {
                log('击中敌机')
                e.kill()
                // e.isCollided = true
                // 敌机无敌
                // e.isCollided = false
                this.game.score += 100
                this.kill()
            }
        }
    }
    killSelf() {
        var bsOfEnemy = this.scene.bulletsOfEnemies
        var bsOfPlayer = this.scene.bulletsOfPlayer
        // log('bsOfEnemy, bsOfPlayer', bsOfEnemy, bsOfPlayer)
        for (var be of bsOfEnemy) {
            for (var bp of bsOfPlayer) {
                if (rectIntersects(be, bp)) {
                    be.kill()
                    bp.kill()
                }
            }
        }
    }
    killPlayer() {
        var bs = this.scene.bulletsOfEnemies
        var p = this.scene.player
        for (var b of bs) {
            if (rectIntersects(b, p)) {
                p.isCollided = true
                // 无敌模式
                // p.isCollided = false
                b.kill()
            }
        }
    }
}

class Player extends LuckyImage {
    constructor(game) {
        var name = 'player'
        super(game, name+'0')
        this.setup()
        this.addImages('player')
    }
    setup() {
        this.speed = 20
        this.cooldown = 0
        this.alive = true
        this.isCollided = false
        // 动画效果
        /*
        this.frames = []
        for (var i = 0; i < 4; i++) {
            var name = `player${i}`
            var t = this.game.textureByName(name)
            log('name, t', name, t)
            this.frames.push(t)
        }
        //
        this.texture = this.frames[0]
        log('this.texture', frames[0], this.texture)
        this.framesIndex = 1
        this.framesCount = 5
        */
    }
    draw() {
        // super.draw()
        if (this.alive) {
            this.game.drawImage(this)
        }
    }
    update() {
        // 滑条速度
        this.speed = config.player_speed
        // 冷却
        // log('this.cooldown', this.cooldown)
        if (this.cooldown > 0) {
            this.cooldown--
        }
        //
        super.crash()
    }
    fire() {
        if (this.alive && this.cooldown == 0) {
            this.cooldown = 4
            //
            var b = Bullet.new(this.game)
            var x = this.x + this.w / 2 - b.w / 2
            var y = this.y
            b.x = x
            b.y = y
            this.scene.bulletsOfPlayer.push(b)
            this.scene.addElement(b)
        }
    }
    moveLeft() {
        this.x -= this.speed
    }
    moveRight() {
        this.x += this.speed
    }
    moveUp() {
        this.y -= this.speed
    }
    moveDown() {
        this.y += this.speed
    }
    debug() {
        this.speed = config.player_speed
    }
    kill() {
        this.alive = false
        // 产生粒子效果
        this.ps = LuckyParticleSystem.new(this.game)
        this.ps.x = this.x + this.w / 2
        this.ps.y = this.y + this.h / 2
        this.scene.addElement(this.ps)
    }
    mouseInPlayer(x, y) {
        var o = this
        var xIn = x >= o.x && x <= o.x + o.w
        var yIn = y >= o.y && y <= o.y + o.h
        return xIn && yIn
    }
}

class Enemy extends LuckyImage {
    constructor(game) {
        var type = randomBetween(0, 1)
        var name = 'enemy' + String(type) + '_0'
        super(game, name)
        //
        // this.addImages('enemy1_')
        var n =  'enemy' + String(type) + '_'
        this.addImages(n)
        this.setup()

    }
    setup() {
        this.speed = 3
        this.alive = true
        this.isCollided = false
        this.cooldown = 0
        this.x = randomBetween(0, 450)
        this.y = -randomBetween(0, 200)
        //
        this.framesIndex = 0
        this.framesCount = 3
        //
        this.cooldown = 0
    }
    draw() {
        // super.draw()
        // log('敌机状态', this.alive, this)
        if (this.alive) {
            this.game.drawImage(this)
        }
    }
    update() {
        // 冷却
        if (this.cooldown > 0) {
            this.cooldown--
        }
        this.move()
        //
        if (this.y > 550 && this.alive) {
            this.setup()
        }
        if (this.alive && this.name == 'enemy1_0') {
            this.fire()
        }
        if (this.alive) {
            this.killPlayer()
        }
        //
        // super.crash()
    }
    move() {
        this.y += this.speed
    }
    kill() {
        this.alive = false
    }
    fire() {
        if (this.cooldown == 0) {
            this.cooldown = 40
            //
            var b = Bullet.new(this.game)
            b.firedByPlayer = false
            b.texture = this.game.textureByName('bullet1')
            var x = this.x + this.w / 2 - b.w / 2
            var y = this.y + this.h
            b.x = x
            b.y = y
            this.scene.addElement(b)
            this.scene.bulletsOfEnemies.push(b)
            // log('this.scene.bulletsOfEnemies.push(b)', this.scene.bulletsOfEnemies)
        }
    }
    killPlayer() {
        var p = this.scene.player
        if (p.alive && rectIntersects(p, this)) {
            p.isCollided = true
            // 无敌模式
            // p.isCollided = false
        }
    }
    debug() {
        this.speed = config.enemy_speed
    }
}

// http://192.168.43.98:8000/
