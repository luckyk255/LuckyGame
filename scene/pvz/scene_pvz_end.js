// 胜利/失败结算场景 - 使用真实图片
class ScenePvZEnd extends LuckyScene {
    constructor(game, win, levelIndex) {
        super(game)
        this.win = win
        this.levelIndex = levelIndex || 0
        this.alive = true

        // 点击处理
        var self = this
        this._clickHandler = function(event) {
            var x = event.offsetX
            var y = event.offsetY
            self._onClick(x, y)
        }
        this.game.canvas.addEventListener('mousedown', this._clickHandler)

        this.frame = 0
    }

    static new(game, win, levelIndex) {
        return new ScenePvZEnd(game, win, levelIndex)
    }

    _onClick(x, y) {
        var x1 = this.game.canvas.width / 2 - 100
        var x2 = this.game.canvas.width / 2 + 100
        // 再玩一次按钮区域
        if (x >= x1 && x <= x2 && y >= 380 && y <= 430) {
            this.game.canvas.removeEventListener('mousedown', this._clickHandler)
            var scene = ScenePvZ.new(this.game, this.levelIndex)
            this.game.replaceScene(scene)
            return
        }
        // 下一关按钮（胜利时）
        if (this.win && this.levelIndex < 2) {
            if (x >= x1 && x <= x2 && y >= 320 && y <= 370) {
                this.game.canvas.removeEventListener('mousedown', this._clickHandler)
                var scene = ScenePvZ.new(this.game, this.levelIndex + 1)
                this.game.replaceScene(scene)
                return
            }
        }
        // 返回主菜单
        if (x >= x1 && x <= x2 && y >= 440 && y <= 480) {
            this.game.canvas.removeEventListener('mousedown', this._clickHandler)
            var title = ScenePvZTitle.new(this.game)
            this.game.replaceScene(title)
        }
    }

    update() {
        this.frame++
    }

    draw() {
        var ctx = this.game.context
        var win = this.win

        // 使用真实胜负画面
        var screenKey = win ? 'screen_victory' : 'screen_loose'
        var tex = this.game.textureByName(screenKey)
        if (tex) {
            ctx.drawImage(tex, 0, 0, this.game.canvas.width, this.game.canvas.height)
        } else {
            // 备用背景
            ctx.fillStyle = win ? '#1a6600' : '#330000'
            ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height)
        }

        // 按钮区域（在图片下方）
        var btnY = 380
        var btnX = this.game.canvas.width / 2 - 100

        // 下一关按钮（胜利且有下一关时）
        if (win && this.levelIndex < 2) {
            ctx.fillStyle = '#4a9a00'
            ctx.fillRect(btnX, 320, 200, 45)
            ctx.strokeStyle = '#88cc44'
            ctx.lineWidth = 2
            ctx.strokeRect(btnX + 1, 321, 198, 43)
            ctx.fillStyle = '#fff'
            ctx.font = 'bold 18px Arial'
            ctx.textAlign = 'center'
            ctx.fillText('下一关', this.game.canvas.width / 2, 350)
            btnY = 380
        }

        // 再玩一次按钮
        ctx.fillStyle = win ? '#4a9a00' : '#8b0000'
        ctx.fillRect(btnX, btnY, 200, 45)
        ctx.strokeStyle = win ? '#88cc44' : '#ff6666'
        ctx.lineWidth = 2
        ctx.strokeRect(btnX + 1, btnY + 1, 198, 43)
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 18px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('再玩一次', this.game.canvas.width / 2, btnY + 28)

        // 返回主菜单按钮
        ctx.fillStyle = '#555'
        ctx.fillRect(btnX, btnY + 60, 200, 40)
        ctx.strokeStyle = '#888'
        ctx.lineWidth = 1
        ctx.strokeRect(btnX + 1, btnY + 61, 198, 38)
        ctx.fillStyle = '#fff'
        ctx.font = '16px Arial'
        ctx.fillText('返回主菜单', this.game.canvas.width / 2, btnY + 85)
    }
}
