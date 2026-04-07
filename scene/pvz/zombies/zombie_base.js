// 僵尸基类 - 支持多状态帧动画
class ZombieBase {
    constructor(game, row, lawn) {
        this.game = game
        this.lawn = lawn
        this.row = row
        // 初始位置：草坪右侧外
        this.x = this.game.canvas.width + 40
        this.y = lawn.cellCenterY(row)
        this.w = 60
        this.h = 80
        this.alive = true

        // 生命值（子类覆盖）
        this.maxHp = 10
        this.hp = this.maxHp

        // 移动速度（像素/帧）
        this.speed = 1  // 基础速度，会被 iceSlow 影响
        this.baseSpeed = 1

        // 状态: 'walk' | 'eat' | 'die' | 'losthead'
        this.state = 'walk'

        // 正在啃食的植物
        this.targetPlant = null

        // 受伤闪红计时器
        this.hitFlash = 0

        // 冰冻减速效果
        this.iceSlow = 0  // 减速剩余帧数
        this.iceSlowDuration = 120  // 4秒减速

        // 动画缩放
        this.scale = 0.5

        // 死亡动画
        this.dying = false
        this.deathTimer = 0
    }

    takeDamage(dmg) {
        if (!this.alive) return
        this.hp -= dmg
        this.hitFlash = 5
        if (this.hp <= 0) {
            this.hp = 0
            this.startDie()
        }
    }

    startDie() {
        this.dying = true
        this.state = 'die'
        this.animFrame = 0
        this.animTimer = 0
        playSound('zombie_die')
    }

    die() {
        this.alive = false
    }

    // 检测正前方（当前格）是否有植物
    checkPlantAhead() {
        var lawn = this.lawn
        var tile = lawn.getTile(this.x - 10, this.y)
        if (!tile) return null
        var [r, c] = tile
        if (r !== this.row) return null
        return lawn.grid[r][c]
    }

    update() {
        if (!this.alive) return

        // 更新冰冻减速
        if (this.iceSlow > 0) {
            this.iceSlow--
            this.speed = this.baseSpeed * window.configValue('pvz_zombie_speed', 55) / 100 * 0.5
        } else {
            this.speed = this.baseSpeed * window.configValue('pvz_zombie_speed', 55) / 100
        }

        if (this.hitFlash > 0) this.hitFlash--

        // 死亡动画处理
        if (this.dying) {
            this.updateDeathAnimation()
            return
        }

        // 检测前方植物
        var plant = this.checkPlantAhead()
        if (plant && plant.alive) {
            this.state = 'eat'
            this.targetPlant = plant
        } else {
            this.state = 'walk'
            this.targetPlant = null
        }

        if (this.state === 'walk') {
            this.x -= this.speed
        } else if (this.state === 'eat') {
            this.eat()
        }
    }

    updateDeathAnimation() {
        this.animTimer++
        if (this.animTimer >= this.animInterval) {
            this.animTimer = 0
            if (this.animFrame < this.getDeathFrameCount() - 1) {
                this.animFrame++
            } else {
                this.deathTimer++
                if (this.deathTimer > 30) {
                    this.die()
                }
            }
        }
    }

    // 子类覆盖
    getDeathFrameCount() {
        return 10
    }

    eat() {
        if (this.targetPlant && this.targetPlant.alive) {
            // 每秒造成1点伤害（30fps）
            if (this.frame % 30 === 0) {
                this.targetPlant.takeDamage(1)
            }
        } else {
            this.targetPlant = null
            this.state = 'walk'
        }
    }

    // 被冰冻减速
    applyIceSlow() {
        this.iceSlow = this.iceSlowDuration
    }

    // 获取当前动画帧的纹理键名（子类覆盖）
    getTextureKey() {
        return ''
    }

    draw() {
        if (!this.alive && !this.dying) return
        var ctx = this.game.context

        var key = this.getTextureKey()
        if (!key) return

        var tex = this.game.textureByName(key)
        if (!tex) return

        var w = tex.width * this.scale
        var h = tex.height * this.scale

        ctx.save()

        // 冰冻效果：变蓝半透明
        if (this.iceSlow > 0) {
            ctx.filter = 'hue-rotate(180deg) saturate(200%)'
            ctx.globalAlpha = 0.8
        }

        // 受伤闪红
        if (this.hitFlash > 0) {
            ctx.globalAlpha = 0.6
        }

        // 死亡时淡出
        if (this.dying) {
            ctx.globalAlpha = Math.max(0.3, 1 - this.deathTimer / 30)
        }

        ctx.translate(this.x, this.y)
        ctx.drawImage(tex, -w / 2, -h / 2, w, h)
        ctx.restore()
    }
}
