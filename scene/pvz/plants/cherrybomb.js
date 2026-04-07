// 樱桃炸弹 - 3x3范围爆炸
class CherryBomb extends PlantBase {
    constructor(game, row, col, lawn) {
        super(game, row, col, lawn)
        this.type = 'cherrybomb'
        this.cost = 150
        this.maxHp = 5
        this.hp = this.maxHp
        this.scale = 0.8

        // 爆炸动画（7帧，10fps，不循环）
        this.animFrame = 0
        this.animTimer = 0
        this.animInterval = Math.floor(30 / 10)
        this.exploding = false
        this.exploded = false
    }

    static new(game, row, col, lawn) {
        return new CherryBomb(game, row, col, lawn)
    }

    update() {
        super.update()

        if (this.exploding) {
            this.animTimer++
            if (this.animTimer >= this.animInterval) {
                this.animTimer = 0
                if (this.animFrame < 6) {
                    this.animFrame++
                } else {
                    // 动画结束，植物死亡
                    this.alive = false
                    this.lawn.clearPlant(this.row, this.col)
                }
            }
        } else {
            // 放置后立即开始爆炸
            this.exploding = true
            this.doExplosion()
        }
    }

    doExplosion() {
        // 3x3范围伤害
        var startRow = Math.max(0, this.row - 1)
        var endRow = Math.min(4, this.row + 1)
        var startCol = Math.max(0, this.col - 1)
        var endCol = Math.min(8, this.col + 1)

        // 伤害范围内的僵尸
        for (var z of this.scene.zombies) {
            if (!z.alive) continue
            // 检查僵尸是否在范围内
            var zCol = Math.floor((z.x - this.lawn.offsetX) / this.lawn.cellW)
            if (z.row >= startRow && z.row <= endRow &&
                zCol >= startCol && zCol <= endCol) {
                z.takeDamage(100) // 高伤害秒杀普通僵尸
            }
        }

        // 显示爆炸效果
        this.scene.showBoom(this.x, this.y)
        playSound('explode')
    }

    draw() {
        var ctx = this.game.context
        var tex = this.game.textureByName('cherrybomb_' + this.animFrame)
        this.drawSprite(ctx, tex)
    }
}
