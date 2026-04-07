// 寒冰射手 - 发射冰冻豌豆，减速僵尸
class SnowPea extends PlantBase {
    constructor(game, row, col, lawn) {
        super(game, row, col, lawn)
        this.type = 'snowpea'
        this.cost = 175
        this.maxHp = 5
        this.hp = this.maxHp
        this.scale = 0.6

        // 射击冷却（2秒 = 60帧）
        this.shootCooldown = 0
        this.shootInterval = 60

        // 帧动画（15帧，12fps）
        this.animFrame = 0
        this.animTimer = 0
        this.animInterval = Math.floor(30 / 12)
    }

    static new(game, row, col, lawn) {
        return new SnowPea(game, row, col, lawn)
    }

    update() {
        super.update()

        // 帧动画更新
        this.animTimer++
        if (this.animTimer >= this.animInterval) {
            this.animTimer = 0
            this.animFrame = (this.animFrame + 1) % 15
        }

        // 射击逻辑
        if (this.scene && this.hasZombieInRow()) {
            this.shootCooldown--
            if (this.shootCooldown <= 0) {
                this.shoot()
                this.shootCooldown = this.shootInterval
            }
        }
    }

    hasZombieInRow() {
        var zombies = this.scene.zombies
        for (var z of zombies) {
            if (z.row === this.row && z.alive && z.x > this.x) {
                return true
            }
        }
        return false
    }

    shoot() {
        var px = this.x + 20
        var py = this.y - 10
        var pea = Projectile.new(this.game, this.row, px, py, 'ice')
        this.scene.addProjectile(pea)
        playSound('shoot')
    }

    draw() {
        var ctx = this.game.context
        var tex = this.game.textureByName('snowpea_' + this.animFrame)
        this.drawSprite(ctx, tex)
    }
}
