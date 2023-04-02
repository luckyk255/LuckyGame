var test_arrowFunction = function() {
    var name = [
        "Hydrogen",
        "Helium",
        "Lithium",
        "Beryllium",
    ]
    var length1 = name.map(function(s){
        return s.length
    })
    var length2 = name.map(s => s.length)
    log(`
        length1<${length2}>
        length2<${length2}>
        `)
}

var sayName = function(name) {
    log('姓名:', name)
}

var say = function() {
    log('saysaysay')
}

var run = function() {
    log('runrunrun')
}

var test = function() {
    test_arrowFunction()
    //

    const testConfig = {
        bg_speed: 5,
        player_speed: 10,
        bullet_speed: 10,
        enemy_speed: 8,
        fire_cooldown: 5,
    }

    var s = `
    <div class="">
        <label>
            <input class="kai-auto-slider" type="range"
            value=""
            data-value="config.player_speed"
            >
            玩家速度: <span class="kai-label"></span>
        </label>
    </div>
    `
    var s = `
        <div class="">
            <label>
                <input class="kai-auto-slider" type="range"
                value=""
                data-value="${item.value}"
                >
                ${item._comment}: <span class="kai-label"></span>
            </label>
        </div>
    `
}


// test()
