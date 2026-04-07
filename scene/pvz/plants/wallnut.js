// 坚果墙 - 使用真实帧动画，3级破损状态
class Wallnut extends PlantBase {
    constructor(game, row, col, lawn) {
        super(game, row, col, lawn)
        this.type = 'wallnut'
        this.cost = 50
        this.maxHp = 30
        this.hp = this.maxHp
        this.scale = 0.6

        // 破损状态: 0=完好, 1=轻微破损, 2=严重破损
        this.damageState = 0

        // 帧动画（不同破损状态的资源帧数不同，12fps）
        this.animFrame = 0
        this.animTimer = 0
        this.animInterval = Math.floor(30 / 12)
    }

    static new(game, row, col, lawn) {
        return new Wallnut(game, row, col, lawn)
    }

    update() {
        super.update()

        // 更新破损状态
        var ratio = this.hp / this.maxHp
        if (ratio > 0.67) {
            this.damageState = 0
        } else if (ratio > 0.33) {
            this.damageState = 1
        } else {
            this.damageState = 2
        }

        var frameCount = this.getFrameCount()
        if (this.animFrame >= frameCount) {
            this.animFrame = 0
        }

        // 帧动画更新
        this.animTimer++
        if (this.animTimer >= this.animInterval) {
            this.animTimer = 0
            this.animFrame = (this.animFrame + 1) % frameCount
        }
    }

    getFrameCount() {
        if (this.damageState === 1) return 11
        if (this.damageState === 2) return 15
        return 16
    }

    draw() {
        var ctx = this.game.context
        var key = 'wallnut' + (this.damageState === 0 ? '' : '_cracked' + this.damageState) + '_' + this.animFrame
        var tex = this.game.textureByName(key)
        this.drawSprite(ctx, tex)
    }
}
