// 植物大战僵尸主菜单场景
class ScenePvZTitle extends LuckyScene {
    constructor(game) {
        super(game)
        this.alive = true

        // 按钮区域（基于 MainMenu.png 布局）
        this.startBtn = { x: 320, y: 385, w: 160, h: 50 }
        this.editorBtn = { x: 320, y: 445, w: 160, h: 42 }
        this.soundBtn = { x: 650, y: 20, w: 120, h: 34 }

        var self = this
        this._clickHandler = function(event) {
            var x = event.offsetX
            var y = event.offsetY
            SoundManager.instance().unlock()
            var btn = self.startBtn
            if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
                self.game.canvas.removeEventListener('mousedown', self._clickHandler)
                // 进入第一关
                var level = ScenePvZ.new(self.game, 0)
                self.game.replaceScene(level)
                SoundManager.instance().playBGM()
                return
            }
            btn = self.editorBtn
            if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
                self.game.canvas.removeEventListener('mousedown', self._clickHandler)
                self.game.replaceScene(ScenePvZEditor.new(self.game, 0))
                SoundManager.instance().playBGM()
                return
            }
            btn = self.soundBtn
            if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
                var sound = SoundManager.instance()
                sound.setEnabled(!sound.enabled)
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

        btn = this.editorBtn
        ctx.fillStyle = '#345b8c'
        ctx.fillRect(btn.x, btn.y, btn.w, btn.h)
        ctx.strokeStyle = '#8cb6ff'
        ctx.lineWidth = 2
        ctx.strokeRect(btn.x + 1, btn.y + 1, btn.w - 2, btn.h - 2)
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 16px Arial'
        ctx.fillText('关卡编辑器', btn.x + btn.w / 2, btn.y + 25)

        btn = this.soundBtn
        ctx.fillStyle = SoundManager.instance().enabled ? '#2f7d32' : '#555'
        ctx.fillRect(btn.x, btn.y, btn.w, btn.h)
        ctx.strokeStyle = '#ddd'
        ctx.lineWidth = 1
        ctx.strokeRect(btn.x + 1, btn.y + 1, btn.w - 2, btn.h - 2)
        ctx.fillStyle = '#fff'
        ctx.font = '14px Arial'
        ctx.fillText('声音: ' + (SoundManager.instance().enabled ? '开' : '关'), btn.x + btn.w / 2, btn.y + 22)

        // 提示
        ctx.fillStyle = 'rgba(255,255,255,0.7)'
        ctx.font = '12px Arial'
        ctx.fillText('开始冒险、打开编辑器，或切换声音', this.game.canvas.width / 2, 520)
    }
}
