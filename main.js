var loadLevel = function(n, game) {
    var n = n - 1
    var level = levels[n]
    var blocks = []
    for (var i = 0; i < level.length; i++) {
        // var b = Block()
        // b.x = level[i][0]
        // b.y = level[i][1]
        var b = Block(level[i], game)
        blocks.push(b)
    }
    return blocks
}

var __main = function() {
    var images = {
        b0: 'img/bird/bird-01.png',
        b1: 'img/bird/bird-02.png',
        b2: 'img/bird/bird-03.png',
        b3: 'img/bird/bird-04.png',
        ground: 'img/bird/ground.png',
        land: 'img/bird/land.png',
        pipe: 'img/bird/pipe.png',
        // pipe: 'img/bird/PipeUp.png',
        // pipe: 'img/bird/pipe-green.png',
        sky: 'img/bird/sky.png',
        s0: 'img/bird/0.png',
        s1: 'img/bird/1.png',
        s2: 'img/bird/2.png',
        s3: 'img/bird/3.png',
        s4: 'img/bird/4.png',
        s5: 'img/bird/5.png',
        s6: 'img/bird/6.png',
        s7: 'img/bird/7.png',
        s8: 'img/bird/8.png',
        s9: 'img/bird/9.png',
        start: 'img/bird/start.png',
        end: 'img/bird/end.png',
        //
        run0: 'img/run/adventurer-run-00.png',
        run1: 'img/run/adventurer-run-01.png',
        run2: 'img/run/adventurer-run-02.png',
        run3: 'img/run/adventurer-run-03.png',
        run4: 'img/run/adventurer-run-04.png',
        run5: 'img/run/adventurer-run-05.png',
        idle0: 'img/idle/adventurer-idle-00.png',
        idle1: 'img/idle/adventurer-idle-01.png',
        idle2: 'img/idle/adventurer-idle-02.png',
    }

    var game = Game.singleInstance(30, images, function(g){
        // 1 初始化 game, 先载入图片
        // 2 图片载入完成后, 回调, 初始化游戏场景
        // 3 场景加载后再运行
        // var scene = Scene.new(g)
        var scene = SceneTitle.new(g)
        // var l = Label.new(g, 'hello')
        g.startWithScene(scene)
    })
    enableDebugMode(true, game)
}


__main()
