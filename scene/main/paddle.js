var Paddle = function(game) {
    var o = game.imageByName('paddle')
    o.x = 200
    o.y = 350
    o.speed = 8

    // var o = {
    //     image: image,
    //     x: 200,
    //     y: 350,
    //     speed: 5,
    // }

    o.move = function(x) {
        if (x < 0) {
            o.x = 0
        }
        if (x + o.image.width > 500) {
            o.x = 500 - o.image.width
        }
    }
    o.moveLeft = function() {
        o.x -= o.speed
        o.move(o.x )
    }
    o.moveRight = function() {
        o.x += o.speed
        o.move(o.x)
    }
    o.collide = function(ball) {
        // return rectIntersects(ball, o) || rectIntersects(o, ball)
        return rectIntersects(ball, o)
    }
    return o
}
