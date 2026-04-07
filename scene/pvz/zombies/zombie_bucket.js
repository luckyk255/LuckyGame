// 铁桶僵尸 - 使用真实帧动画
class ZombieBucket extends ZombieBase {
    constructor(game, row, lawn) {
        super(game, row, lawn)
        this.maxHp = 30  // 20铁桶 + 10本体
        this.hp = this.maxHp
        this.baseSpeed = 0.6  // 稍慢
        this.speed = this.baseSpeed

        // 铁桶护甲
        this.hasBucket = true
        this.bucketHp = 20

        // 动画帧
        this.animFrame = 0
        this.animTimer = 0
        this.animInterval = Math.floor(30 / 12)
    }

    static new(game, row, lawn) {
        return new ZombieBucket(game, row, lawn)
    }

    takeDamage(dmg) {
        if (this.dying) return
        if (this.hasBucket) {
            this.bucketHp -= dmg
            this.hitFlash = 5
            if (this.bucketHp <= 0) {
                this.hasBucket = false
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
        if (!this.alive && !this.dying) return

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
        // 有铁桶时: walk 15帧, attack 11帧
        // 无铁桶时: 使用普通僵尸帧数 walk 22帧, attack 21帧
        if (this.hasBucket) {
            return this.state === 'eat' ? 11 : 15
        } else {
            return this.state === 'eat' ? 21 : 22
        }
    }

    getTextureKey() {
        if (this.dying) {
            return 'zombie_die_' + this.animFrame
        }
        if (this.hasBucket) {
            if (this.state === 'eat') {
                return 'bucket_attack_' + this.animFrame
            }
            return 'bucket_walk_' + this.animFrame
        } else {
            if (this.state === 'eat') {
                return 'zombie_attack_' + this.animFrame
            }
            return 'zombie_walk_' + this.animFrame
        }
    }
}
