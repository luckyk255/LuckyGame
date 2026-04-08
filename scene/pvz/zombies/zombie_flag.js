// 旗帜僵尸 - 大波预警
class ZombieFlag extends ZombieBase {
    constructor(game, row, lawn) {
        super(game, row, lawn)
        this.maxHp = 15
        this.hp = this.maxHp
        this.baseSpeed = 0.8  // 稍快
        this.speed = this.baseSpeed

        // 动画帧
        this.animFrame = 0
        this.animTimer = 0
        this.animInterval = Math.floor(30 / 12)
    }

    static new(game, row, lawn) {
        return new ZombieFlag(game, row, lawn)
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
        // walk 12帧, attack 11帧
        return this.state === 'eat' ? 11 : 12
    }

    getTextureKey() {
        if (this.dying) {
            return 'zombie_die_' + this.animFrame
        }
        if (this.state === 'eat') {
            return 'flag_attack_' + this.animFrame
        }
        return 'flag_walk_' + this.animFrame
    }
}
