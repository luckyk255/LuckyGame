// 植物大战僵尸主菜单场景
class ScenePvZTitle extends LuckyScene {
    constructor(game) {
        super(game)
        this.alive = true

        // 按钮区域（基于 MainMenu.png 布局）
        this.startBtn = { x: 320, y: 385, w: 160, h: 50 }

        var self = this
        this._clickHandler = function(event) {
            var x = event.offsetX
            var y = event.offsetY
            var btn = self.startBtn
            if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
                self.game.canvas.removeEventListener('mousedown', self._clickHandler)
                // 进入第一关
                var level = ScenePvZ.new(self.game, 0)
                self.game.replaceScene(level)
            }
        }
        this.game.canvas.addEventListener('mousedown', this._clickHandler)
    }

    static new(game) {
        return new ScenePvZTitle(game)
    }

    update() {
        // 主菜单无需更新逻辑
    }

    draw() {
        var ctx = this.game.context

        // 绘制主菜单背景（MainMenu.png 900x600，需缩放适配 canvas）
        var bg = this.game.textureByName('screen_mainmenu')
        if (bg) {
            ctx.drawImage(bg, 0, 0, this.game.canvas.width, this.game.canvas.height)
        } else {
            // 备用：纯色背景
            ctx.fillStyle = '#2d5016'
            ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height)
        }

        // 底部区域（草坪风格）
        ctx.fillStyle = '#5a8c1c'
        ctx.fillRect(0, 530, this.game.canvas.width, 70)

        // 标题
        ctx.fillStyle = '#f9d32a'
        ctx.font = 'bold 36px Arial'
        ctx.textAlign = 'center'
        ctx.shadowColor = '#000'
        ctx.shadowBlur = 4
        ctx.fillText('植物大战僵尸', this.game.canvas.width / 2, 120)
        ctx.shadowBlur = 0

        // 开始按钮
        var btn = this.startBtn
        ctx.fillStyle = '#4a9a00'
        ctx.fillRect(btn.x, btn.y, btn.w, btn.h)
        ctx.strokeStyle = '#88cc44'
        ctx.lineWidth = 2
        ctx.strokeRect(btn.x + 1, btn.y + 1, btn.w - 2, btn.h - 2)

        ctx.fillStyle = '#fff'
        ctx.font = 'bold 18px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('开始冒险', btn.x + btn.w / 2, btn.y + 26)

        // 提示
        ctx.fillStyle = 'rgba(255,255,255,0.7)'
        ctx.font = '12px Arial'
        ctx.fillText('点击按钮开始游戏', this.game.canvas.width / 2, 470)
    }
}
