var log = console.log.bind(console)
// var log = function() {
//     console.log.apply(console, arguments)
// }

var imageFormPath = function(path) {
    var image = new Image()
    image.src = path

    return image
}

const randomBetween = function(start, end) {
    var result = Math.random() * (end - start + 1)
    return Math.floor(result + start)
}

var inObject = function(o, mouseX, mouseY) {
    var xIn = x >= o.x && x <= o.x + o.w
    var yIn = y >= o.y && y <= o.y + o.h
    return xIn && yIn
}

var aInb = function(x, x1, x2) {
    return x >= x1 && x <= x2
}

var rectIntersects = function(a, b) {
    if (aInb(a.x, b.x, b.x + b.w) || aInb(b.x, a.x, a.x + a.w)) {
        if (aInb(a.y, b.y, b.y + b.h) || aInb(b.y, a.y, a.y + a.h)) {
            // log('碰撞')
            return true
        }
    }
    return false
    /*
    var o = a
    var ball = b
    // log('o, ball', o, ball)
    if (ball.y > o.y && ball.y < o.y + o.h) {
        if (ball.x > o.x && ball.x < o.x + o.w) {
            // log('碰撞')
            return true
        }
    }
    return false
    */
}

window.blocks = []
window.paused = false

var enableDebugMode = function(debuged, game) {
    if (!debuged) {
        return
    }
    window.addEventListener('keydown', function(event) {
        var k = event.key
        if (k == 'p') {
            log('暂停')
            window.paused = !window.paused
        } else if ('123456789'.includes(k)) {
            log('选择关卡', k)
            blocks = loadLevel(Number(k), game)
        }
    })

    window.input = document.querySelector('#id-input-speed')
    input.addEventListener('input', function(event){
        log(input.value)
        v = Number(window.input.value)
        if (v == 0) {
            v = 0
        }
        window.fps = v
    })
}
