// 普通僵尸 - 使用真实帧动画
class ZombieBasic extends ZombieBase {
    constructor(game, row, lawn) {
        super(game, row, lawn)
        this.maxHp = 10
        this.hp = this.maxHp
        this.baseSpeed = 0.7
        this.speed = this.baseSpeed

        // 动画帧
        this.animFrame = 0
        this.animTimer = 0
        this.animInterval = Math.floor(30 / 12)  // 12fps
    }

    static new(game, row, lawn) {
        return new ZombieBasic(game, row, lawn)
    }

    getDeathFrameCount() {
        return 10
    }

    update() {
        super.update()
        if (!this.alive || this.dying) return

        // 帧动画更新
        this.animTimer++
        if (this.animTimer >= this.animInterval) {
            this.animTimer = 0
            var frameCount = this.getFrameCount()
            this.animFrame = (this.animFrame + 1) % frameCount
        }
    }

    getFrameCount() {
        if (this.dying) return 10
        if (this.state === 'walk') return 22
        if (this.state === 'eat') return 21
        return 22
    }

    getTextureKey() {
        if (this.dying) {
            return 'zombie_die_' + this.animFrame
        }
        if (this.state === 'eat') {
            return 'zombie_attack_' + this.animFrame
        }
        return 'zombie_walk_' + this.animFrame
    }
}
