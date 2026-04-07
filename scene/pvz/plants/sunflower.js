// 向日葵 - 使用真实帧动画
class Sunflower extends PlantBase {
    constructor(game, row, col, lawn) {
        super(game, row, col, lawn)
        this.type = 'sunflower'
        this.cost = 50
        this.maxHp = 5
        this.hp = this.maxHp
        this.scale = 0.6

        // 产阳光速度由调试滑片控制
        this.produceInterval = Math.floor(720 * 100 / window.configValue('pvz_sunflower_rate', 100))
        this.produceCooldown = this.produceInterval

        // 帧动画（18帧，12fps）
        this.animFrame = 0
        this.animTimer = 0
        this.animInterval = Math.floor(30 / 12)
    }

    static new(game, row, col, lawn) {
        return new Sunflower(game, row, col, lawn)
    }

    update() {
        super.update()

        // 帧动画更新
        this.animTimer++
        if (this.animTimer >= this.animInterval) {
            this.animTimer = 0
            this.animFrame = (this.animFrame + 1) % 18
        }

        // 产阳光倒计时
        this.produceInterval = Math.floor(720 * 100 / window.configValue('pvz_sunflower_rate', 100))
        this.produceCooldown--
        if (this.produceCooldown <= 0) {
            this.produceSun()
            this.produceCooldown = this.produceInterval
        }
    }

    produceSun() {
        if (this.scene) {
            // 在植物上方产生一个太阳
            var sx = this.x
            var sy = this.y - 20
            this.scene.spawnSun(sx, sy, false)
        }
    }

    draw() {
        var ctx = this.game.context
        var tex = this.game.textureByName('sunflower_' + this.animFrame)
        this.drawSprite(ctx, tex)
    }
}
