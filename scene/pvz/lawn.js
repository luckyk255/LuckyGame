// 草坪 - 5行 x 9列 格子管理
// 适配真实背景图 (1400x600)，在 800x600 canvas 上显示
class Lawn {
    constructor(game, bgType) {
        this.game = game
        // 背景类型 (0=白天, 2=黑夜)
        this.bgType = bgType || 0

        // 草坪格子配置 (基于原游戏 800x600 的 9x5 布局)
        this.scale = this.game.canvas.width / 800
        this.rows = 5
        this.cols = 9

        // 格子大小（缩放后）
        this.cellW = Math.floor(80 * this.scale)
        this.cellH = Math.floor(100 * this.scale)

        // 草坪起始坐标（顶部留出 UI 区，底部留出空间）
        this.offsetX = Math.floor(35 * this.scale)
        this.offsetY = Math.floor(100 * this.scale)

        // 草坪二维数组，存放植物引用 null = 空格
        this.grid = []
        for (var r = 0; r < this.rows; r++) {
            this.grid[r] = []
            for (var c = 0; c < this.cols; c++) {
                this.grid[r][c] = null
            }
        }
        this.alive = true
    }

    static new(game, bgType) {
        return new Lawn(game, bgType)
    }

    // 格子左上角像素坐标
    cellX(col) {
        return this.offsetX + col * this.cellW
    }

    cellY(row) {
        return this.offsetY + row * this.cellH
    }

    // 格子中心坐标
    cellCenterX(col) {
        return this.cellX(col) + this.cellW / 2
    }

    cellCenterY(row) {
        return this.cellY(row) + this.cellH / 2
    }

    // 根据像素坐标找格子 [row, col]，点击越界返回 null
    getTile(px, py) {
        var col = Math.floor((px - this.offsetX) / this.cellW)
        var row = Math.floor((py - this.offsetY) / this.cellH)
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            return null
        }
        return [row, col]
    }

    // 该格是否空闲
    isEmpty(row, col) {
        return this.grid[row][col] === null
    }

    // 放置植物
    setPlant(row, col, plant) {
        this.grid[row][col] = plant
    }

    // 移除植物（植物死亡时调用）
    clearPlant(row, col) {
        this.grid[row][col] = null
    }

    // 获取某行所有存活的植物
    plantsInRow(row) {
        var result = []
        for (var c = 0; c < this.cols; c++) {
            if (this.grid[row][c] !== null && this.grid[row][c].alive) {
                result.push(this.grid[row][c])
            }
        }
        return result
    }

    update() {
        // 草坪本身无需逻辑更新
    }

    draw() {
        var ctx = this.game.context

        // 绘制背景图（裁剪显示草坪区域）
        var bgKey = this.bgType === 2 ? 'bg_night' : 'bg_day'
        var bg = this.game.textureByName(bgKey)
        if (bg) {
            // 背景图 1400x600，裁剪中间 800x600 区域，然后缩放到 canvas
            var srcX = 300  // 裁剪起始 x
            var srcW = 800  // 裁剪宽度
            var srcH = 600  // 裁剪高度
            ctx.drawImage(bg, srcX, 0, srcW, srcH, 0, 0, this.game.canvas.width, this.game.canvas.height)
        } else {
            // 备用：绘制草坪格子
            for (var r = 0; r < this.rows; r++) {
                for (var c = 0; c < this.cols; c++) {
                    var x = this.cellX(c)
                    var y = this.cellY(r)
                    if ((r + c) % 2 === 0) {
                        ctx.fillStyle = '#7ec850'
                    } else {
                        ctx.fillStyle = '#6db844'
                    }
                    ctx.fillRect(x, y, this.cellW, this.cellH)
                }
            }
        }
    }
}
