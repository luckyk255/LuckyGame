class SceneEditor extends LuckyScene {
    constructor(game) {
        super(game)
        this.block = Block([30, 360], game)
        this.cloneBlocks = []
        this.movingBlock = null
        this.number = 100
        this.level = []
        //
        this.inint()
        this.action()
    }
    inint() {
        for (var i = 0; i < this.number; i++) {
            // this.cloneBlocks.push(this.block)
            this.cloneBlocks.push(Block([30, 360], this.game))
        }
    }
    action() {
        /*
        1 底下有基础砖块 可以任意拖放
        2 上面的砖块可以 随意拖放调整位置
        3 点 k 后 保存 上面砖块的位置 生成关卡
        mousedown
            1 遍历所有砖块
            2 满足条件 设置 可拖拽 temp记录该对象
            3 防止 所有砖块移动 break
        mousemove
            1 temp 对象满足非空 可拽条件时
            2 鼠标坐标等于对象坐标
        movedown
            1 temp 对象满足非空 可拽条件时
            2 设置不可拽
        */
        // mouse events
        var self = this
        window.addEventListener('mousedown', function(event){
            // log('event', event)
            var x = event.offsetX
            var y = event.offsetY
            for (var i = 0; i < self.cloneBlocks.length; i++) {
                var b = self.cloneBlocks[i]
                if (inObject(b, x, y)) {
                    b.enableDurg = true
                    log('mousedown', x, y, b)
                    self.movingBlock = b
                    break
                }
            }
        })
        window.addEventListener('mousemove', function(event){
            window.x = event.offsetX
            window.y = event.offsetY
            if (self.movingBlock != null && self.movingBlock.enableDurg) {
                log('mousemove', x, y, self.movingBlock)
                self.movingBlock.x = window.x
                self.movingBlock.y = window.y
            }
        })
        window.addEventListener('mouseup', function(event){
            var x = event.offsetX
            var y = event.offsetY
            // log('up x, y', x, y)
            if (self.movingBlock != null && self.movingBlock.enableDurg) {
                self.movingBlock.enableDurg = false
                log('mouseup', x, y, self.movingBlock)
            }
        })
        this.game.registerAction('k', function(){
            var position = []
            for (var i = 0; i < self.cloneBlocks.length; i++) {
                var b = self.cloneBlocks[i]
                log('self.block.y', self.block.y)
                if (b.y < self.block.y) {
                    // log(b.x, b.y)
                    position.push(b.x)
                    position.push(b.y)
                    log('position', position)
                }
                self.level.push(position)
                position = []
            }
            // log('level', self.level)

            // 总关卡
            // log('levels', levels)
            log('保存成功')
            levels.push(self.level)
        })
    }
    draw() {
        this.game.context.fillText('关卡编辑器 按 K 保存后 按 S 开始游戏 ', 200, 380)
        this.game.context.fillText( `(${window.x}, ${window.y})`, 420, 380)
        this.game.drawImage(this.block)
        for (var i = 0; i < this.cloneBlocks.length; i++) {
            var block = this.cloneBlocks[i]
            this.game.drawImage(block)
        }
        // log('this.cloneBlocks', this.cloneBlocks)
    }
    update() {
    }
}
