var Block = function(position, game) {
    // position [0, 0]
    var img = game.imageByName('block')
    var p = position
    var o = {
        x: p[0],
        y: p[1],
        alive: true,
        lifes: p[2] || 1,
        enableDurg: false,
    }
    o.image = img.image
    o.w = img.w
    o.h = img.h
    // var image = imageFormPath('image/block.png')
    // var p = position
    // var o = {
    //     image: image,
    //     x: p[0],
    //     y: p[1],
    //     alive: true,
    //     lifes: p[2] || 1,
    // }
    o.kill = function() {
        o.lifes--
        if (o.lifes == 0) {
            o.alive = false
        }
    }
    o.collide = function(ball) {
        // return o.alive && (rectIntersects(ball, o) || rectIntersects(o, ball))
        return o.alive && rectIntersects(ball, o)
    }
    return o
}
