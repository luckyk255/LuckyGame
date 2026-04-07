// 太阳 - 使用真实帧动画
class Sun {
    constructor(game, x, y, fromSky) {
        this.game = game
        this.x = x
        this.y = y
        this.w = 40
        this.h = 40
        this.alive = true
        this.value = 25

        // 目标落点 Y
        this.fromSky = fromSky
        if (fromSky) {
            this.targetY = randomBetween(120, 400)
        } else {
            this.targetY = y + 30
        }
        this.fallSpeed = 1.2
        this.falling = true

        // 存在时间
        this.lifeTimer = 0
        this.lifeLimit = 300  // 10秒后消失

        // 帧动画（22帧，12fps）
        this.animFrame = 0
        this.animTimer = 0
        this.animInterval = Math.floor(30 / 12)
    }

    static new(game, x, y, fromSky) {
        return new Sun(game, x, y, fromSky)
    }

    update() {
        if (!this.alive) return

        // 帧动画
        this.animTimer++
        if (this.animTimer >= this.animInterval) {
            this.animTimer = 0
            this.animFrame = (this.animFrame + 1) % 22
        }

        if (this.falling) {
            this.y += this.fallSpeed
            if (this.y >= this.targetY) {
                this.y = this.targetY
                this.falling = false
            }
        } else {
            this.lifeTimer++
            if (this.lifeTimer >= this.lifeLimit) {
                this.alive = false
            }
        }
    }

    isClicked(mx, my) {
        var cx = this.x
        var cy = this.y
        var dist = Math.sqrt((mx - cx) * (mx - cx) + (my - cy) * (my - cy))
        return dist <= 20
    }

    draw() {
        if (!this.alive) return
        var ctx = this.game.context

        // 快消失时闪烁
        if (this.lifeTimer > this.lifeLimit - 60 && Math.floor(this.lifeTimer / 6) % 2 === 0) {
            ctx.globalAlpha = 0.4
        }

        var tex = this.game.textureByName('sun_' + this.animFrame)
        if (tex) {
            var scale = 0.5
            var w = tex.width * scale
            var h = tex.height * scale
            ctx.drawImage(tex, this.x - w / 2, this.y - h / 2, w, h)
        }

        ctx.globalAlpha = 1.0
    }
}
