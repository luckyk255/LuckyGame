// 豌豆子弹 - 使用真实图片
class Projectile {
    constructor(game, row, x, y, type) {
        this.game = game
        this.row = row
        this.x = x
        this.y = y
        this.type = type || 'normal'  // 'normal' | 'ice'
        this.w = 20
        this.h = 12
        this.speed = 4
        this.damage = 1
        this.alive = true
        this.scale = 0.5
    }

    static new(game, row, x, y, type) {
        return new Projectile(game, row, x, y, type)
    }

    update() {
        if (!this.alive) return
        this.x += this.speed
        // 飞出屏幕右侧则消失
        if (this.x > this.game.canvas.width + 20) {
            this.alive = false
        }
    }

    draw() {
        if (!this.alive) return
        var ctx = this.game.context

        var key = this.type === 'ice' ? 'pea_ice' : 'pea_normal'
        var tex = this.game.textureByName(key)
        if (!tex) return

        var w = tex.width * this.scale
        var h = tex.height * this.scale

        ctx.drawImage(tex, this.x - w / 2, this.y - h / 2, w, h)
    }
}
