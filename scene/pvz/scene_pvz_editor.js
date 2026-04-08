class ScenePvZEditor extends LuckyScene {
    constructor(game, levelIndex) {
        super(game)
        this.game = game
        this.levelIndex = Math.max(0, levelIndex || 0)
        this.zombieTypes = ['basic', 'cone', 'bucket', 'flag', 'paper']
        this._buttons = []
        this._loadLevel()

        var self = this
        this._clickHandler = function(event) {
            self._onClick(event.offsetX, event.offsetY)
        }
        this.game.canvas.addEventListener('mousedown', this._clickHandler)
    }

    static new(game, levelIndex) {
        return new ScenePvZEditor(game, levelIndex)
    }

    _removeInput() {
        this.game.canvas.removeEventListener('mousedown', this._clickHandler)
    }

    _loadLevel() {
        var all = ScenePvZ.allLevelConfigs()
        this.totalLevels = all.length
        this.levelIndex = Math.max(0, Math.min(this.levelIndex, this.totalLevels - 1))
        this.levelConfig = ScenePvZ.cloneConfig(all[this.levelIndex] || all[0])
    }

    _isBuiltinLevel() {
        return this.levelIndex < ScenePvZ.builtinLevelConfigs().length
    }

    _saveCurrentLevel() {
        if (this._isBuiltinLevel()) {
            return
        }
        var custom = ScenePvZ.loadCustomLevels()
        var customIndex = this.levelIndex - ScenePvZ.builtinLevelConfigs().length
        custom[customIndex] = ScenePvZ.cloneConfig(this.levelConfig)
        ScenePvZ.saveCustomLevels(custom)
        this._loadLevel()
    }

    _createCustomFromCurrent() {
        var custom = ScenePvZ.loadCustomLevels()
        custom.push(ScenePvZ.cloneConfig(this.levelConfig))
        ScenePvZ.saveCustomLevels(custom)
        this.levelIndex = ScenePvZ.builtinLevelConfigs().length + custom.length - 1
        this._loadLevel()
    }

    _deleteCurrentCustom() {
        if (this._isBuiltinLevel()) return
        var custom = ScenePvZ.loadCustomLevels()
        var customIndex = this.levelIndex - ScenePvZ.builtinLevelConfigs().length
        custom.splice(customIndex, 1)
        ScenePvZ.saveCustomLevels(custom)
        this.levelIndex = Math.max(0, this.levelIndex - 1)
        this._loadLevel()
    }

    _cycleZombieType(type, step) {
        var index = this.zombieTypes.indexOf(type)
        if (index === -1) index = 0
        index = (index + step + this.zombieTypes.length) % this.zombieTypes.length
        return this.zombieTypes[index]
    }

    _clamp(val, min, max) {
        return Math.max(min, Math.min(max, val))
    }

    _adjustWaveDelay(waveIndex, delta) {
        var wave = this.levelConfig.waves[waveIndex]
        wave.startDelay = Math.max(0, wave.startDelay + delta)
    }

    _adjustSpawn(waveIndex, spawnIndex, key, delta) {
        var spawn = this.levelConfig.waves[waveIndex].spawns[spawnIndex]
        if (key === 'row') {
            spawn.row = this._clamp(spawn.row + delta, 0, 4)
        } else if (key === 'delay') {
            spawn.delay = Math.max(0, spawn.delay + delta)
        }
    }

    _addWave() {
        var waves = this.levelConfig.waves
        var startDelay = 600
        if (waves.length > 0) {
            startDelay = waves[waves.length - 1].startDelay + 360
        }
        waves.push({
            startDelay: startDelay,
            spawns: [{ delay: 0, row: 2, type: 'basic' }],
        })
    }

    _removeWave(waveIndex) {
        if (this.levelConfig.waves.length <= 1) return
        this.levelConfig.waves.splice(waveIndex, 1)
    }

    _addSpawn(waveIndex) {
        this.levelConfig.waves[waveIndex].spawns.push({
            delay: 60,
            row: 2,
            type: 'basic',
        })
    }

    _removeSpawn(waveIndex, spawnIndex) {
        var spawns = this.levelConfig.waves[waveIndex].spawns
        if (spawns.length <= 1) return
        spawns.splice(spawnIndex, 1)
    }

    _addButton(x, y, w, h, label, action, fillStyle) {
        this._buttons.push({ x: x, y: y, w: w, h: h, label: label, action: action, fillStyle: fillStyle || '#4a9a00' })
    }

    _drawButton(ctx, button) {
        ctx.fillStyle = button.fillStyle
        ctx.fillRect(button.x, button.y, button.w, button.h)
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 1
        ctx.strokeRect(button.x + 0.5, button.y + 0.5, button.w - 1, button.h - 1)
        ctx.fillStyle = '#fff'
        ctx.font = '12px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(button.label, button.x + button.w / 2, button.y + button.h / 2 + 4)
    }

    _onClick(x, y) {
        for (var i = 0; i < this._buttons.length; i++) {
            var b = this._buttons[i]
            if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
                b.action()
                return
            }
        }
    }

    update() {
    }

    draw() {
        var ctx = this.game.context
        this._buttons = []

        ctx.fillStyle = '#20321a'
        ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height)

        ctx.fillStyle = '#f4e7b3'
        ctx.font = 'bold 28px Arial'
        ctx.textAlign = 'left'
        ctx.fillText('PvZ 关卡编辑器', 20, 38)

        ctx.font = '14px Arial'
        ctx.fillText('用途：调整任意关卡并直接测试。内置关卡不能覆盖，只能复制为自定义关卡后保存。', 20, 64)

        ctx.fillStyle = '#d8d8d8'
        ctx.fillText('当前关卡: ' + (this.levelIndex + 1) + '/' + this.totalLevels + (this._isBuiltinLevel() ? '  内置' : '  自定义'), 20, 95)
        ctx.fillText('起始阳光: ' + this.levelConfig.startSun, 20, 120)
        ctx.fillText('背景: ' + (this.levelConfig.bgType === 2 ? '黑夜' : '白天'), 190, 120)
        ctx.fillText('已解锁植物: ' + this.levelConfig.unlock.join(', '), 320, 120)

        this._addButton(20, 140, 36, 26, '<', () => {
            this.levelIndex = (this.levelIndex - 1 + this.totalLevels) % this.totalLevels
            this._loadLevel()
        }, '#555')
        this._addButton(62, 140, 36, 26, '>', () => {
            this.levelIndex = (this.levelIndex + 1) % this.totalLevels
            this._loadLevel()
        }, '#555')
        this._addButton(120, 140, 50, 26, '-25', () => {
            this.levelConfig.startSun = Math.max(25, this.levelConfig.startSun - 25)
        }, '#7a5c00')
        this._addButton(176, 140, 50, 26, '+25', () => {
            this.levelConfig.startSun += 25
        }, '#7a5c00')
        this._addButton(248, 140, 70, 26, '切背景', () => {
            this.levelConfig.bgType = this.levelConfig.bgType === 2 ? 0 : 2
        }, '#345b8c')
        this._addButton(338, 140, 92, 26, '复制为新关', () => {
            this._createCustomFromCurrent()
        }, '#2f7d32')
        this._addButton(438, 140, 70, 26, '保存', () => {
            this._saveCurrentLevel()
        }, '#2f7d32')
        this._addButton(516, 140, 78, 26, '删自定义', () => {
            this._deleteCurrentCustom()
        }, '#8b2f2f')
        this._addButton(602, 140, 82, 26, '进入测试', () => {
            if (!this._isBuiltinLevel()) {
                this._saveCurrentLevel()
            }
            this._removeInput()
            this.game.replaceScene(ScenePvZ.new(this.game, this.levelIndex, this.levelConfig))
        }, '#4a9a00')
        this._addButton(692, 140, 88, 26, '返回菜单', () => {
            this._removeInput()
            this.game.replaceScene(ScenePvZTitle.new(this.game))
        }, '#555')

        this._addButton(20, 176, 90, 24, '+ 新波次', () => {
            this._addWave()
        }, '#4a9a00')

        var y = 220
        for (var w = 0; w < this.levelConfig.waves.length; w++) {
            var wave = this.levelConfig.waves[w]
            ctx.fillStyle = '#eecf76'
            ctx.font = 'bold 16px Arial'
            ctx.fillText('波次 ' + (w + 1), 20, y)
            ctx.font = '13px Arial'
            ctx.fillStyle = '#fff'
            ctx.fillText('开始时间: ' + wave.startDelay, 100, y)

            this._addButton(210, y - 15, 28, 20, '-', (() => {
                var index = w
                return () => this._adjustWaveDelay(index, -60)
            })(), '#555')
            this._addButton(242, y - 15, 28, 20, '+', (() => {
                var index = w
                return () => this._adjustWaveDelay(index, 60)
            })(), '#555')
            this._addButton(278, y - 15, 66, 20, '+ 僵尸', (() => {
                var index = w
                return () => this._addSpawn(index)
            })(), '#2f7d32')
            this._addButton(350, y - 15, 52, 20, '删波', (() => {
                var index = w
                return () => this._removeWave(index)
            })(), '#8b2f2f')

            y += 24
            for (var s = 0; s < wave.spawns.length; s++) {
                var spawn = wave.spawns[s]
                ctx.fillStyle = '#cbd5e1'
                ctx.font = '12px Arial'
                ctx.fillText('僵尸' + (s + 1) + ': ' + spawn.type + '  行 ' + spawn.row + '  延迟 ' + spawn.delay, 40, y)

                this._addButton(250, y - 14, 24, 18, 'T', (() => {
                    var waveIndex = w
                    var spawnIndex = s
                    return () => {
                        this.levelConfig.waves[waveIndex].spawns[spawnIndex].type = this._cycleZombieType(this.levelConfig.waves[waveIndex].spawns[spawnIndex].type, 1)
                    }
                })(), '#345b8c')
                this._addButton(280, y - 14, 24, 18, '行-', (() => {
                    var waveIndex = w
                    var spawnIndex = s
                    return () => this._adjustSpawn(waveIndex, spawnIndex, 'row', -1)
                })(), '#555')
                this._addButton(308, y - 14, 24, 18, '行+', (() => {
                    var waveIndex = w
                    var spawnIndex = s
                    return () => this._adjustSpawn(waveIndex, spawnIndex, 'row', 1)
                })(), '#555')
                this._addButton(338, y - 14, 28, 18, '延-', (() => {
                    var waveIndex = w
                    var spawnIndex = s
                    return () => this._adjustSpawn(waveIndex, spawnIndex, 'delay', -30)
                })(), '#555')
                this._addButton(370, y - 14, 28, 18, '延+', (() => {
                    var waveIndex = w
                    var spawnIndex = s
                    return () => this._adjustSpawn(waveIndex, spawnIndex, 'delay', 30)
                })(), '#555')
                this._addButton(404, y - 14, 42, 18, '删除', (() => {
                    var waveIndex = w
                    var spawnIndex = s
                    return () => this._removeSpawn(waveIndex, spawnIndex)
                })(), '#8b2f2f')
                y += 22
            }
            y += 10
        }

        for (var i = 0; i < this._buttons.length; i++) {
            this._drawButton(ctx, this._buttons[i])
        }
    }
}
