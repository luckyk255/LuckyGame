// 植物选择卡片 - 使用真实图片
class PlantCard {
    constructor(game, plantType, cost, index) {
        this.game = game
        this.plantType = plantType
        this.cost = cost
        this.index = index
        // 使用真实卡片图片尺寸 (65x90)
        this.w = 65
        this.h = 90
        this.x = 8 + index * (this.w + 6)
        this.y = 0  // 紧贴顶部
        this.selected = false
        this.alive = true
        // 冷却
        this.cooldown = 0
        this.cooldownMax = 225  // 7.5秒
    }

    static new(game, plantType, cost, index) {
        return new PlantCard(game, plantType, cost, index)
    }

    isReady(sun) {
        return this.cooldown <= 0 && sun >= this.cost
    }

    startCooldown() {
        this.cooldown = this.cooldownMax
    }

    update() {
        if (this.cooldown > 0) this.cooldown--
    }

    isClicked(mx, my) {
        return mx >= this.x && mx <= this.x + this.w &&
               my >= this.y && my <= this.y + this.h
    }

    draw(sun) {
        var ctx = this.game.context
        var x = this.x, y = this.y, w = this.w, h = this.h

        // 绘制卡片图片
        var cardKey = 'card_' + this.plantType
        var tex = this.game.textureByName(cardKey)
        if (tex) {
            ctx.drawImage(tex, x, y, w, h)
        } else {
            // 备用：纯色背景
            ctx.fillStyle = '#e8f4c8'
            ctx.fillRect(x, y, w, h)
        }

        // 冷却遮罩（从底部往上遮）
        if (this.cooldown > 0) {
            var ratio = this.cooldown / this.cooldownMax
            ctx.fillStyle = 'rgba(0,0,0,0.6)'
            ctx.fillRect(x, y + h * (1 - ratio), w, h * ratio)
        }

        // 没钱时变暗
        if (sun < this.cost && this.cooldown <= 0) {
            ctx.fillStyle = 'rgba(0,0,0,0.4)'
            ctx.fillRect(x, y, w, h)
        }

        // 费用文字（在卡片底部）
        ctx.fillStyle = sun >= this.cost ? '#ffff00' : '#ff4444'
        ctx.font = 'bold 12px Arial'
        ctx.textAlign = 'center'
        ctx.shadowColor = '#000'
        ctx.shadowBlur = 2
        ctx.fillText(this.cost, x + w / 2, y + h - 4)
        ctx.shadowBlur = 0

        // 选中高亮边框
        if (this.selected) {
            ctx.strokeStyle = '#ffff00'
            ctx.lineWidth = 2
            ctx.strokeRect(x, y, w, h)
        }
    }
}
