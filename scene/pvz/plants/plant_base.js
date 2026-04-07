// 植物基类 - 支持帧动画
class PlantBase {
    constructor(game, row, col, lawn) {
        this.game = game
        this.lawn = lawn
        this.row = row
        this.col = col
        // 像素位置（格子中心）
        this.x = lawn.cellCenterX(col)
        this.y = lawn.cellCenterY(row)
        // 尺寸（由子类根据图片设置）
        this.w = 40
        this.h = 40
        // 生命值
        this.maxHp = 5
        this.hp = this.maxHp
        this.alive = true
        // 植物类型（子类覆盖）
        this.type = 'base'
        // 费用
        this.cost = 0
        // 帧计数
        this.frame = 0
        // 受伤闪白计时器
        this.hitFlash = 0
        // 动画缩放比例（适配 canvas）
        this.scale = 0.6
    }

    takeDamage(dmg) {
        this.hp -= dmg
        this.hitFlash = 5
        if (this.hp <= 0) {
            this.hp = 0
            this.die()
        }
    }

    die() {
        this.alive = false
        this.lawn.clearPlant(this.row, this.col)
    }

    update() {
        this.frame++
        if (this.hitFlash > 0) this.hitFlash--
    }

    // 绘制血条（可选）
    drawHpBar(ctx) {
        var barW = 30
        var barH = 3
        var bx = this.x - barW / 2
        var by = this.y + this.h * this.scale * 0.5 + 2
        ctx.fillStyle = '#333'
        ctx.fillRect(bx, by, barW, barH)
        var ratio = this.hp / this.maxHp
        ctx.fillStyle = ratio > 0.5 ? '#2ecc40' : ratio > 0.25 ? '#ff851b' : '#ff4136'
        ctx.fillRect(bx, by, barW * ratio, barH)
    }

    // 绘制当前帧（子类调用）
    drawSprite(ctx, texture) {
        if (!texture) return
        var w = texture.width * this.scale
        var h = texture.height * this.scale

        ctx.save()
        if (this.hitFlash > 0) {
            ctx.globalAlpha = 0.6
        }
        ctx.translate(this.x, this.y)
        ctx.drawImage(texture, -w / 2, -h / 2, w, h)
        ctx.restore()
    }

    draw() {
        // 子类实现
    }
}
