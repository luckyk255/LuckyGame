var loadLevel = function(n, game) {
    var n = n - 1
    var level = levels[n]
    var blocks = []
    for (var i = 0; i < level.length; i++) {
        var b = Block(level[i], game)
        blocks.push(b)
    }
    return blocks
}

// 构建 PvZ 图片资源列表
var buildPvZImages = function() {
    var images = {}
    var basePath = 'resources/graphics'

    // 背景
    images['bg_day'] = basePath + '/Items/Background/Background_0.jpg'
    images['bg_night'] = basePath + '/Items/Background/Background_2.jpg'

    // UI
    images['screen_mainmenu'] = basePath + '/Screen/MainMenu.png'
    images['screen_victory'] = basePath + '/Screen/GameVictory.png'
    images['screen_loose'] = basePath + '/Screen/GameLoose.png'
    images['panel_bg'] = basePath + '/Screen/PanelBackground.png'
    images['boom'] = basePath + '/Screen/Boom.png'

    // 卡片
    var cards = ['peashooter', 'sunflower', 'wallnut', 'snowpea', 'cherrybomb', 'repeaterpea']
    for (var c of cards) {
        images['card_' + c] = basePath + '/Cards/card_' + c + '.png'
    }

    // 豌豆射手 (13帧)
    for (var i = 0; i < 13; i++) {
        images['peashooter_' + i] = basePath + '/Plants/Peashooter/Peashooter_' + i + '.png'
    }

    // 向日葵 (18帧)
    for (var i = 0; i < 18; i++) {
        images['sunflower_' + i] = basePath + '/Plants/SunFlower/SunFlower_' + i + '.png'
    }

    // 坚果墙: 完好 16帧，轻微破损 11帧，严重破损 15帧
    for (var i = 0; i < 16; i++) {
        images['wallnut_' + i] = basePath + '/Plants/WallNut/WallNut/WallNut_' + i + '.png'
    }
    for (var i = 0; i < 11; i++) {
        images['wallnut_cracked1_' + i] = basePath + '/Plants/WallNut/WallNut_cracked1/WallNut_cracked1_' + i + '.png'
    }
    for (var i = 0; i < 15; i++) {
        images['wallnut_cracked2_' + i] = basePath + '/Plants/WallNut/WallNut_cracked2/WallNut_cracked2_' + i + '.png'
    }

    // 寒冰射手 (15帧)
    for (var i = 0; i < 15; i++) {
        images['snowpea_' + i] = basePath + '/Plants/SnowPea/SnowPea_' + i + '.png'
    }

    // 樱桃炸弹 (7帧)
    for (var i = 0; i < 7; i++) {
        images['cherrybomb_' + i] = basePath + '/Plants/CherryBomb/CherryBomb_' + i + '.png'
    }

    // 双发豌豆 (15帧)
    for (var i = 0; i < 15; i++) {
        images['repeaterpea_' + i] = basePath + '/Plants/RepeaterPea/RepeaterPea_' + i + '.png'
    }

    // 太阳 (22帧)
    for (var i = 0; i < 22; i++) {
        images['sun_' + i] = basePath + '/Plants/Sun/Sun_' + i + '.png'
    }

    // 子弹
    images['pea_normal'] = basePath + '/Bullets/PeaNormal/PeaNormal_0.png'
    images['pea_ice'] = basePath + '/Bullets/PeaIce/PeaIce_0.png'

    // 普通僵尸 (22帧 walk, 21帧 attack, 10帧 die)
    for (var i = 0; i < 22; i++) {
        images['zombie_walk_' + i] = basePath + '/Zombies/NormalZombie/Zombie/Zombie_' + i + '.png'
    }
    for (var i = 0; i < 21; i++) {
        images['zombie_attack_' + i] = basePath + '/Zombies/NormalZombie/ZombieAttack/ZombieAttack_' + i + '.png'
    }
    for (var i = 0; i < 10; i++) {
        images['zombie_die_' + i] = basePath + '/Zombies/NormalZombie/ZombieDie/ZombieDie_' + i + '.png'
    }

    // 路障僵尸: walk 21帧, attack 11帧
    for (var i = 0; i < 21; i++) {
        images['cone_walk_' + i] = basePath + '/Zombies/ConeheadZombie/ConeheadZombie/ConeheadZombie_' + i + '.png'
    }
    for (var i = 0; i < 11; i++) {
        images['cone_attack_' + i] = basePath + '/Zombies/ConeheadZombie/ConeheadZombieAttack/ConeheadZombieAttack_' + i + '.png'
    }

    // 铁桶僵尸: walk 15帧, attack 11帧
    for (var i = 0; i < 15; i++) {
        images['bucket_walk_' + i] = basePath + '/Zombies/BucketheadZombie/BucketheadZombie/BucketheadZombie_' + i + '.png'
    }
    for (var i = 0; i < 11; i++) {
        images['bucket_attack_' + i] = basePath + '/Zombies/BucketheadZombie/BucketheadZombieAttack/BucketheadZombieAttack_' + i + '.png'
    }

    // 旗帜僵尸: walk 12帧, attack 11帧
    for (var i = 0; i < 12; i++) {
        images['flag_walk_' + i] = basePath + '/Zombies/FlagZombie/FlagZombie/FlagZombie_' + i + '.png'
    }
    for (var i = 0; i < 11; i++) {
        images['flag_attack_' + i] = basePath + '/Zombies/FlagZombie/FlagZombieAttack/FlagZombieAttack_' + i + '.png'
    }

    // 报纸僵尸
    // walk: 19帧, attack: 8帧, nopaper walk: 14帧, nopaper attack: 7帧
    for (var i = 0; i < 19; i++) {
        images['paper_walk_' + i] = basePath + '/Zombies/NewspaperZombie/NewspaperZombie/NewspaperZombie_' + i + '.png'
    }
    for (var i = 0; i < 8; i++) {
        images['paper_attack_' + i] = basePath + '/Zombies/NewspaperZombie/NewspaperZombieAttack/NewspaperZombieAttack_' + i + '.png'
    }
    for (var i = 0; i < 14; i++) {
        images['paper_no_walk_' + i] = basePath + '/Zombies/NewspaperZombie/NewspaperZombieNoPaper/NewspaperZombieNoPaper_' + i + '.png'
    }
    for (var i = 0; i < 7; i++) {
        images['paper_no_attack_' + i] = basePath + '/Zombies/NewspaperZombie/NewspaperZombieNoPaperAttack/NewspaperZombieNoPaperAttack_' + i + '.png'
    }

    return images
}

// 启动 PvZ（植物大战僵尸）
var __mainPvZ = function() {
    var images = buildPvZImages()

    var game = Game.singleInstance(30, images, function(g){
        var title = ScenePvZTitle.new(g)
        g.startWithScene(title)
    })
    enableDebugMode(true, game)
}

// 启动原版 Flappy Bird
var __mainBird = function() {
    var images = {
        b0: 'img/bird/bird-01.png',
        b1: 'img/bird/bird-02.png',
        b2: 'img/bird/bird-03.png',
        b3: 'img/bird/bird-04.png',
        ground: 'img/bird/ground.png',
        land: 'img/bird/land.png',
        pipe: 'img/bird/pipe.png',
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
        var scene = SceneTitle.new(g)
        g.startWithScene(scene)
    })
    enableDebugMode(true, game)
}

// 当前启动的游戏：PvZ
__mainPvZ()
