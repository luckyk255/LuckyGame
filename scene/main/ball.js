 Ball = function(game) {
    var o = game.imageByName('ball')
    o.x = 215
    o.y = 330
    o.fired = false
    o.speedX = 5
    o.speedY = 5

    // var image = imageFormPath('image/ball.png')
    // var o = {
    //     image: image,
    //     x: 250,
    //     y: 250,
    //     fired: false,
    //     speedX: 5,
    //     speedY: 5,
    // }
    o.fire = function() {
        o.fired = true
    }
    o.move = function() {
        if (o.fired) {
            // log('move')
            o.x += o.speedX
            o.y += o.speedY

            if (o.x < 0 || o.x + o.image.width > 500) {
                o.speedX *= -1
            }
            if (o.y < 0 || o.y + o.image.height > 400) {
                o.speedY *= -1
            }
        }
    }
    o.bounce = function() {
        log('反弹')
        o.speedY *= -1
    }
    o.inBall = function(x, y) {
        var xIn = x >= o.x && x <= o.x + o.w
        var yIn = y >= o.y && y <= o.y + o.h
        return xIn && yIn
    }

    return o
}
