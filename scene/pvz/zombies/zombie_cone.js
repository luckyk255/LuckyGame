// 路障僵尸 - 使用真实帧动画
class ZombieCone extends ZombieBase {
    constructor(game, row, lawn) {
        super(game, row, lawn)
        this.maxHp = 20  // 10路障 + 10本体
        this.hp = this.maxHp
        this.baseSpeed = 0.7
        this.speed = this.baseSpeed

        // 路障护甲
        this.hasCone = true
        this.coneHp = 10

        // 动画帧
        this.animFrame = 0
        this.animTimer = 0
        this.animInterval = Math.floor(30 / 12)
    }

    static new(game, row, lawn) {
        return new ZombieCone(game, row, lawn)
    }

    takeDamage(dmg) {
        if (this.dying) return
        if (this.hasCone) {
            this.coneHp -= dmg
            this.hp = 10 + Math.max(0, this.coneHp)
            this.hitFlash = 5
            if (this.coneHp <= 0) {
                this.hasCone = false
                this.hp = 10  // 剩余本体HP
                this.maxHp = 10
            }
        } else {
            super.takeDamage(dmg)
        }
    }

    getDeathFrameCount() {
        return 10
    }

    update() {
        super.update()
        if (!this.alive || this.dying) return

        var frameCount = this.getFrameCount()
        if (this.animFrame >= frameCount) {
            this.animFrame = 0
        }

        this.animTimer++
        if (this.animTimer >= this.animInterval) {
            this.animTimer = 0
            this.animFrame = (this.animFrame + 1) % frameCount
        }
    }

    getFrameCount() {
        if (this.dying) return 10
        // 有路障时: walk 21帧, attack 11帧
        // 无路障时: 使用普通僵尸帧数 walk 22帧, attack 21帧
        if (this.hasCone) {
            return this.state === 'eat' ? 11 : 21
        } else {
            return this.state === 'eat' ? 21 : 22
        }
    }

    getTextureKey() {
        if (this.dying) {
            return 'zombie_die_' + this.animFrame
        }
        if (this.hasCone) {
            if (this.state === 'eat') {
                return 'cone_attack_' + this.animFrame
            }
            return 'cone_walk_' + this.animFrame
        } else {
            if (this.state === 'eat') {
                return 'zombie_attack_' + this.animFrame
            }
            return 'zombie_walk_' + this.animFrame
        }
    }
}
