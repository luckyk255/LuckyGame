// 植物大战僵尸主场景 - 多关卡系统
class ScenePvZ extends LuckyScene {
    constructor(game, levelIndex) {
        super(game)

        // 关卡配置
        this.levelIndex = levelIndex || 0
        this.levelConfig = this._getLevelConfig(this.levelIndex)

        // 阳光
        this.sun = this.levelConfig.startSun

        // 草坪（带背景类型）
        this.lawn = Lawn.new(game, this.levelConfig.bgType)
        this.lawn.scene = this

        // 植物/僵尸/子弹/太阳 数组
        this.plants = []
        this.zombies = []
        this.projectiles = []
        this.suns = []

        // 选中的植物类型
        this.selectedCard = null
        this.hoverTile = null

        // 植物卡片（根据关卡解锁）
        this.cards = this._buildCards()

        // 波次系统
        this.wave = 0
        this.waveConfig = this.levelConfig.waves
        this.waveTimer = 0
        this.pendingSpawns = []
        this.allWavesLaunched = false
        this.bigWaveAlert = false
        this.alertTimer = 0

        // 太阳自然掉落计时
        this.sunDropTimer = 0
        this.sunDropInterval = 330  // 11秒一颗

        // 游戏结束标志
        this.gameOver = false
        this.gameWin = false
        this.endTimer = 0

        // 爆炸效果
        this.booms = []

        // 鼠标事件
        this._setupInput()
    }

    static new(game, levelIndex) {
        return new ScenePvZ(game, levelIndex)
    }

    // ---- 关卡配置 ----
    _getLevelConfig(level) {
        var configs = [
            // 第1关：白天，基础僵尸
            {
                startSun: 150,
                bgType: 0,  // 白天
                unlock: ['peashooter', 'sunflower', 'wallnut'],
                waves: [
                    { startDelay: 300, spawns: [
                        {delay: 0, row: 2, type: 'basic'},
                        {delay: 90, row: 1, type: 'basic'},
                        {delay: 180, row: 3, type: 'basic'},
                    ]},
                    { startDelay: 600, spawns: [
                        {delay: 0, row: 0, type: 'basic'},
                        {delay: 60, row: 4, type: 'basic'},
                        {delay: 120, row: 2, type: 'flag'},
                    ]},
                ]
            },
            // 第2关：白天，加入路障和报纸
            {
                startSun: 100,
                bgType: 0,
                unlock: ['peashooter', 'sunflower', 'wallnut', 'snowpea'],
                waves: [
                    { startDelay: 300, spawns: [
                        {delay: 0, row: 2, type: 'basic'},
                        {delay: 90, row: 1, type: 'cone'},
                    ]},
                    { startDelay: 600, spawns: [
                        {delay: 0, row: 3, type: 'basic'},
                        {delay: 60, row: 0, type: 'paper'},
                        {delay: 120, row: 4, type: 'cone'},
                    ]},
                    { startDelay: 1000, spawns: [
                        {delay: 0, row: 1, type: 'flag'},
                        {delay: 30, row: 2, type: 'cone'},
                        {delay: 60, row: 3, type: 'paper'},
                    ]},
                ]
            },
            // 第3关：黑夜，全类型
            {
                startSun: 100,
                bgType: 2,  // 黑夜
                unlock: ['peashooter', 'sunflower', 'wallnut', 'snowpea', 'cherrybomb', 'repeaterpea'],
                waves: [
                    { startDelay: 240, spawns: [
                        {delay: 0, row: 2, type: 'cone'},
                        {delay: 90, row: 1, type: 'basic'},
                    ]},
                    { startDelay: 540, spawns: [
                        {delay: 0, row: 0, type: 'bucket'},
                        {delay: 60, row: 4, type: 'cone'},
                        {delay: 120, row: 2, type: 'paper'},
                    ]},
                    { startDelay: 900, spawns: [
                        {delay: 0, row: 1, type: 'flag'},
                        {delay: 30, row: 3, type: 'bucket'},
                        {delay: 60, row: 0, type: 'cone'},
                        {delay: 90, row: 4, type: 'paper'},
                        {delay: 120, row: 2, type: 'bucket'},
                    ]},
                ]
            }
        ]
        return configs[level] || configs[0]
    }

    _buildCards() {
        var allCards = [
            { type: 'peashooter', cost: 100 },
            { type: 'sunflower', cost: 50 },
            { type: 'wallnut', cost: 50 },
            { type: 'snowpea', cost: 175 },
            { type: 'cherrybomb', cost: 150 },
            { type: 'repeaterpea', cost: 200 },
        ]
        var unlock = this.levelConfig.unlock
        var cards = []
        var idx = 0
        for (var c of allCards) {
            if (unlock.includes(c.type)) {
                cards.push(PlantCard.new(this.game, c.type, c.cost, idx++))
            }
        }
        return cards
    }

    // ---- 输入 ----
    _setupInput() {
        var self = this
        this._mousedownHandler = function(event) {
            var x = event.offsetX
            var y = event.offsetY
            self._onClick(x, y)
        }
        this._mousemoveHandler = function(event) {
            self._onMouseMove(event.offsetX, event.offsetY)
        }
        this.game.canvas.addEventListener('mousedown', this._mousedownHandler)
        this.game.canvas.addEventListener('mousemove', this._mousemoveHandler)
    }

    _removeInput() {
        this.game.canvas.removeEventListener('mousedown', this._mousedownHandler)
        this.game.canvas.removeEventListener('mousemove', this._mousemoveHandler)
    }

    _onMouseMove(mx, my) {
        if (!this.selectedCard) {
            this.hoverTile = null
            return
        }
        this.hoverTile = this.lawn.getTile(mx, my)
    }

    _onClick(mx, my) {
        if (this.gameOver || this.gameWin) return

        // 点击太阳
        for (var s of this.suns) {
            if (s.alive && s.isClicked(mx, my)) {
                this.sun += s.value
                s.alive = false
                playSound('collect')
                return
            }
        }

        // 点击植物卡片
        for (var card of this.cards) {
            if (card.isClicked(mx, my)) {
                if (card.isReady(this.sun)) {
                    if (this.selectedCard === card) {
                        this.selectedCard = null
                        card.selected = false
                    } else {
                        if (this.selectedCard) this.selectedCard.selected = false
                        this.selectedCard = card
                        card.selected = true
                    }
                }
                return
            }
        }

        // 点击草坪格子放置植物
        if (this.selectedCard) {
            var tile = this.lawn.getTile(mx, my)
            this.hoverTile = tile
            if (tile) {
                var [row, col] = tile
                if (this.lawn.isEmpty(row, col)) {
                    this._placePlant(this.selectedCard.plantType, row, col)
                    this.sun -= this.selectedCard.cost
                    this.selectedCard.startCooldown()
                    this.selectedCard.selected = false
                    this.selectedCard = null
                }
            }
        }
    }

    _placePlant(type, row, col) {
        var plant = null
        switch (type) {
            case 'peashooter': plant = Peashooter.new(this.game, row, col, this.lawn); break
            case 'sunflower': plant = Sunflower.new(this.game, row, col, this.lawn); break
            case 'wallnut': plant = Wallnut.new(this.game, row, col, this.lawn); break
            case 'snowpea': plant = SnowPea.new(this.game, row, col, this.lawn); break
            case 'cherrybomb': plant = CherryBomb.new(this.game, row, col, this.lawn); break
            case 'repeaterpea': plant = RepeaterPea.new(this.game, row, col, this.lawn); break
        }
        if (plant) {
            plant.scene = this
            this.lawn.setPlant(row, col, plant)
            this.plants.push(plant)
            playSound('plant')
        }
    }

    // ---- 生成僵尸 ----
    addProjectile(pea) {
        pea.scene = this
        this.projectiles.push(pea)
    }

    spawnSun(x, y, fromSky) {
        var s = Sun.new(this.game, x, y, fromSky)
        this.suns.push(s)
    }

    showBoom(x, y) {
        this.booms.push({ x: x, y: y, timer: 30 })
    }

    _spawnZombie(row, type) {
        var z = null
        switch (type) {
            case 'basic': z = ZombieBasic.new(this.game, row, this.lawn); break
            case 'cone': z = ZombieCone.new(this.game, row, this.lawn); break
            case 'bucket': z = ZombieBucket.new(this.game, row, this.lawn); break
            case 'flag': z = ZombieFlag.new(this.game, row, this.lawn); break
            case 'paper': z = ZombieNewspaper.new(this.game, row, this.lawn); break
        }
        if (z) {
            z.scene = this
            this.zombies.push(z)
        }
    }

    // ---- 更新 ----
    update() {
        if (window.paused) return
        var steps = Math.max(1, Math.floor(window.configValue('pvz_fast_forward', 1)))
        for (var i = 0; i < steps; i++) {
            this._updateStep()
            if (this.gameOver || this.gameWin) break
        }
    }

    _updateStep() {
        if (this.gameOver || this.gameWin) {
            this.endTimer++
            if (this.endTimer >= 90) {
                this._removeInput()
                var end = ScenePvZEnd.new(this.game, this.gameWin, this.levelIndex)
                this.game.replaceScene(end)
            }
            return
        }

        this.waveTimer += window.configValue('pvz_game_speed', 100) / 100

        // 波次触发
        if (!this.allWavesLaunched) {
            for (var w = 0; w < this.waveConfig.length; w++) {
                var wc = this.waveConfig[w]
                if (!wc.started && this.waveTimer >= wc.startDelay) {
                    wc.started = true
                    // 检测是否是大波（有旗帜僵尸）
                    for (var sp of wc.spawns) {
                        if (sp.type === 'flag') {
                            this.bigWaveAlert = true
                            this.alertTimer = 90
                        }
                        this.pendingSpawns.push({
                            countdown: wc.startDelay + sp.delay,
                            row: sp.row,
                            type: sp.type
                        })
                    }
                }
            }
            // 最后一波触发后标记
            var lastWave = this.waveConfig[this.waveConfig.length - 1]
            var lastSpawn = lastWave.spawns[lastWave.spawns.length - 1]
            if (this.waveTimer >= lastWave.startDelay + lastSpawn.delay) {
                this.allWavesLaunched = true
            }
        }

        // 警报计时
        if (this.alertTimer > 0) this.alertTimer--
        if (this.alertTimer <= 0) this.bigWaveAlert = false

        // 执行待生成队列
        for (var sp of this.pendingSpawns) {
            if (this.waveTimer >= sp.countdown && !sp.done) {
                this._spawnZombie(sp.row, sp.type)
                sp.done = true
            }
        }

        // 太阳自然掉落
        this.sunDropTimer++
        this.sunDropInterval = Math.floor(420 * 100 / window.configValue('pvz_sky_sun_rate', 100))
        if (this.sunDropTimer >= this.sunDropInterval) {
            this.sunDropTimer = 0
            var sx = randomBetween(this.lawn.offsetX + 20, this.lawn.offsetX + this.lawn.cols * this.lawn.cellW - 20)
            this.spawnSun(sx, 70, true)
        }

        // 更新爆炸效果
        for (var i = this.booms.length - 1; i >= 0; i--) {
            this.booms[i].timer--
            if (this.booms[i].timer <= 0) {
                this.booms.splice(i, 1)
            }
        }

        // 更新卡片
        for (var card of this.cards) card.update()

        // 更新植物
        for (var p of this.plants) {
            if (p.alive) p.update()
        }

        // 更新僵尸
        for (var z of this.zombies) {
            if (z.alive || z.dying) z.update()
        }

        // 更新子弹
        for (var pea of this.projectiles) {
            if (pea.alive) pea.update()
        }

        // 更新太阳
        for (var sun of this.suns) {
            if (sun.alive) sun.update()
        }

        // 子弹碰撞检测
        this._checkProjectileCollisions()

        // 检测失败
        for (var z of this.zombies) {
            if (z.alive && z.x <= this.lawn.offsetX - 20) {
                this.gameOver = true
                return
            }
        }

        // 检测胜利
        if (this.allWavesLaunched) {
            var anyAlive = false
            for (var z of this.zombies) {
                if (z.alive) { anyAlive = true; break }
            }
            if (!anyAlive) {
                this.gameWin = true
            }
        }

        // 清理死亡对象
        this.remove(this.plants)
        this.remove(this.zombies)
        this.remove(this.projectiles)
        this.remove(this.suns)
    }

    _checkProjectileCollisions() {
        for (var pea of this.projectiles) {
            if (!pea.alive) continue
            for (var z of this.zombies) {
                if (!z.alive || z.dying) continue
                if (z.row === pea.row && rectIntersects(pea, z)) {
                    z.takeDamage(pea.damage)
                    // 冰冻效果
                    if (pea.type === 'ice') {
                        z.applyIceSlow()
                    }
                    pea.alive = false
                    break
                }
            }
        }
    }

    // ---- 绘制 ----
    draw() {
        var ctx = this.game.context

        // 草坪（包含背景图）
        this.lawn.draw()

        // 选中植物时显示目标格子，减少放偏
        this._drawPlacementPreview()

        // 植物
        for (var p of this.plants) {
            if (p.alive) p.draw()
        }

        // 僵尸（按 x 从右到左排序）
        var sortedZ = this.zombies.slice().sort((a, b) => b.x - a.x)
        for (var z of sortedZ) {
            z.draw()
        }

        // 子弹
        for (var pea of this.projectiles) {
            if (pea.alive) pea.draw()
        }

        // 爆炸效果
        for (var boom of this.booms) {
            var tex = this.game.textureByName('boom')
            if (tex) {
                var scale = 0.6
                var w = tex.width * scale
                var h = tex.height * scale
                ctx.drawImage(tex, boom.x - w / 2, boom.y - h / 2, w, h)
            }
        }

        // 太阳
        for (var sun of this.suns) {
            if (sun.alive) sun.draw()
        }

        // UI 顶栏背景（使用 PanelBackground）
        var panel = this.game.textureByName('panel_bg')
        if (panel) {
            ctx.drawImage(panel, 0, 0, this.game.canvas.width, 90)
        } else {
            ctx.fillStyle = '#4a9a00'
            ctx.fillRect(0, 0, this.game.canvas.width, 90)
        }

        // 植物卡片
        for (var card of this.cards) card.draw(this.sun)

        // 阳光显示
        var sunX = this.cards.length > 0 ? this.cards[this.cards.length - 1].x + this.cards[this.cards.length - 1].w + 20 : 20
        var sunTex = this.game.textureByName('sun_0')
        if (sunTex) {
            ctx.drawImage(sunTex, sunX, 15, 25, 25)
        }
        ctx.fillStyle = '#ffff00'
        ctx.font = 'bold 16px Arial'
        ctx.textAlign = 'left'
        ctx.shadowColor = '#000'
        ctx.shadowBlur = 2
        ctx.fillText(this.sun, sunX + 30, 34)
        ctx.shadowBlur = 0

        // 波次提示
        ctx.fillStyle = '#fff'
        ctx.font = '12px Arial'
        ctx.textAlign = 'right'
        var waveText = this.allWavesLaunched ? '最终波！' : ('波次 ' + (this.wave + 1))
        ctx.fillText(waveText, this.game.canvas.width - 15, 20)

        // 大波警报
        if (this.bigWaveAlert) {
            ctx.fillStyle = 'rgba(255,0,0,0.7)'
            ctx.fillRect(0, 260, this.game.canvas.width, 70)
            ctx.fillStyle = '#ffff00'
            ctx.font = 'bold 36px Arial'
            ctx.textAlign = 'center'
            ctx.fillText('大波僵尸来袭！', this.game.canvas.width / 2, 305)
        }

        // 游戏结束/胜利遮罩
        if (this.gameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.6)'
            ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height)
            ctx.fillStyle = '#ff4444'
            ctx.font = 'bold 40px Arial'
            ctx.textAlign = 'center'
            ctx.fillText('僵尸入侵！', this.game.canvas.width / 2, this.game.canvas.height / 2)
        }

        if (this.gameWin) {
            ctx.fillStyle = 'rgba(0,80,0,0.6)'
            ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height)
            ctx.fillStyle = '#88ff44'
            ctx.font = 'bold 40px Arial'
            ctx.textAlign = 'center'
            ctx.fillText('胜利！', this.game.canvas.width / 2, this.game.canvas.height / 2)
        }
    }

    _drawPlacementPreview() {
        if (!this.selectedCard || !this.hoverTile) return

        var [row, col] = this.hoverTile
        var ctx = this.game.context
        var x = this.lawn.cellX(col)
        var y = this.lawn.cellY(row)
        var canPlace = this.lawn.isEmpty(row, col)

        ctx.save()
        ctx.fillStyle = canPlace ? 'rgba(255,255,0,0.28)' : 'rgba(255,0,0,0.25)'
        ctx.fillRect(x, y, this.lawn.cellW, this.lawn.cellH)
        ctx.strokeStyle = canPlace ? '#ffff00' : '#ff3333'
        ctx.lineWidth = 3
        ctx.strokeRect(x + 1, y + 1, this.lawn.cellW - 2, this.lawn.cellH - 2)
        ctx.restore()
    }

    remove(arr) {
        if (!arr) return
        for (var i = arr.length - 1; i >= 0; i--) {
            if (!arr[i].alive) {
                arr.splice(i, 1)
            }
        }
    }
}
