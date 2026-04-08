// 报纸僵尸 - 报纸被打掉后速度翻倍
class ZombieNewspaper extends ZombieBase {
    constructor(game, row, lawn) {
        super(game, row, lawn)
        this.maxHp = 15  // 5报纸 + 10本体
        this.hp = this.maxHp
        this.baseSpeed = 0.7
        this.speed = this.baseSpeed

        // 报纸护甲
        this.hasPaper = true
        this.paperHp = 5

        // 动画帧
        this.animFrame = 0
        this.animTimer = 0
        this.animInterval = Math.floor(30 / 12)
    }

    static new(game, row, lawn) {
        return new ZombieNewspaper(game, row, lawn)
    }

    takeDamage(dmg) {
        if (this.dying) return
        if (this.hasPaper) {
            this.paperHp -= dmg
            this.hp = 10 + Math.max(0, this.paperHp)
            this.hitFlash = 5
            if (this.paperHp <= 0) {
                this.hasPaper = false
                this.hp = 10  // 剩余本体HP
                this.maxHp = 10
                // 报纸掉落，速度翻倍！
                this.baseSpeed = 1.4
                this.speed = this.iceSlow > 0 ? this.baseSpeed * 0.5 : this.baseSpeed
                playSound('paper_break')
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
        // 有报纸时: walk 19帧, attack 8帧
        // 无报纸时: walk 14帧, attack 7帧
        if (this.hasPaper) {
            return this.state === 'eat' ? 8 : 19
        } else {
            return this.state === 'eat' ? 7 : 14
        }
    }

    getTextureKey() {
        if (this.dying) {
            return 'zombie_die_' + this.animFrame
        }
        if (this.hasPaper) {
            if (this.state === 'eat') {
                return 'paper_attack_' + this.animFrame
            }
            return 'paper_walk_' + this.animFrame
        } else {
            if (this.state === 'eat') {
                return 'paper_no_attack_' + this.animFrame
            }
            return 'paper_no_walk_' + this.animFrame
        }
    }
}
