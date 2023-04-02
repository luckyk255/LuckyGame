class Game {
    constructor(default_fps, images, runCallback) {
        window.fps = default_fps
        this.score = 0

        this.images = images
        this.runCallback = runCallback
        //
        this.actions = {}
        this.keydowns = {}
        this.paused = false
        this.scene = null
        //
        this.canvas = document.querySelector('#id-canvas')
        this.context = this.canvas.getContext('2d')
        // events
        var self = this
        // 回调函数中的 this 会改变
        window.addEventListener("keydown", event => {
            // this.keydowns[event.key] = true
            this.keydowns[event.key] = 'down'

        })
        window.addEventListener("keyup", function(event){
            // self.keydowns[event.key] = false
            self.keydowns[event.key] = 'up'
        })
        this.__init()
    }
    // 单例
    static singleInstance(...args) {
        log('singleInstance')
        this.instance = this.instance || new this(...args)
        return this.instance
    }
    drawImage(luckyImage) {
        this.context.drawImage(luckyImage.texture, luckyImage.x, luckyImage.y, luckyImage.w, luckyImage.h)
    }
    // register
    registerAction(key, callback) {
        this.actions[key] = callback
    }
    // 加载图片
    __init() {
        var g = this
        // loadImages 载入所有图片后运行程序
        var names = Object.keys(g.images)
        var loads = []
        for (var i = 0; i < names.length; i++) {
            let name = names[i]
            var path = g.images[name]
            let img = new Image()
            img.src = path
            // log('img', img)
            img.onload = function() {
                // 存取名字和图片的对应信息
                g.images[name] = img
                loads.push(1)
                    // log('load images', names.length, loads.length)
                // 所有图片都载入成功后运行程序
                if (names.length == loads.length) {
                    log('finsh loading start run')
                    g.__start()
                }
            }
        }
    }
    textureByName(name) {
        // log('g.images', g.images)
        var img = this.images[name]
        return img
    }
    update() {
        this.scene.update()
    }
    draw() {
        this.scene.draw()
    }
    replaceScene(scene) {
        this.scene = scene
    }
    // timer
    runloop() {
        // events
        // log('FPS: default_fps, window.fps, fps', default_fps, window.fps, fps)
        var g = this
        var actions = Object.keys(g.actions)
        for (var i = 0; i < actions.length; i++) {
            var key = actions[i]
            var status = g.keydowns[key]
            // 如果按键被按下调用被注册按键的回调函数
            // if (g.keydowns[key]) {
            //     g.actions[key]()
            // }
            //
            if (status == 'down') {
                g.actions[key]('down')
            } else if (status == 'up') {
                g.actions[key]('up')
                // 删除按键状态
                // g.actions[key] = null
                g.keydowns[key] = null
            }
        }
        // update
        g.update()
        // clear
        g.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        // draw
        g.draw()

        setTimeout(function(){
            g.runloop()
        }, 1000/window.fps)
    }
    // 开始运行程序
    __start() {
        // 第一次执行调用
        this.runCallback(this)
    }
    // 初始化场景并运行程序
    startWithScene(scene) {
        var slef = this
        slef.scene = scene
        //
        setTimeout(function(){
            // 延迟一秒后执行只执行该函数
            slef.runloop()
        }, 1000/window.fps)
    }
}
