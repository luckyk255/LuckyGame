class LuckyScene {
    constructor(game) {
        this.game = game
        this.elements = []
    }
    static new(game) {
        var instance = new this(game)
        return instance
    }
    addElement(luckyImage) {
        // 添加 img 时将场景同时添加
        luckyImage.scene = this
        this.elements.push(luckyImage)
    }
    draw() {
        for (var i = 0; i < this.elements.length; i++) {
            var e = this.elements[i]
            //
            e.draw()
        }
    }
    update() {
        // log('LuckyScene update')
        // log('this.game.score', this.game.score)
        if (window.paused) {
            return
        }
        if (this.debugModeEnabled) {
            for (var i = 0; i < this.elements.length; i++) {
                var e = this.elements[i]
                e.debug && e.debug()
            }
        }
        //
        for (var i = 0; i < this.elements.length; i++) {
            var e = this.elements[i]
            // log('LuckyScene.update.e', this.elements)
            e.update()
        }
    }
    remove(element) {
        if (element != undefined) {
            // var bs = this.player.bullets
            var bs = element
            for (var b of bs) {
                if (!b.alive) {
                    var pos = bs.indexOf(b)
                    bs.splice(pos, 1)
                }
                // log(bs)
            }
        }
    }
}
