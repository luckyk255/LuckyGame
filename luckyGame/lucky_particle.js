class LuckyParticleSystem {
    constructor(game) {
        this.game = game
        this.setup()
    }
    static new(game) {
        var instance = new this(game)
        return instance
    }
    draw() {
        if (this.alive) {
            for (var p of this.paricles) {
                p.draw()
            }
        }
    }
    update() {
        if (this.paricles.length < this.numberOfParicle) {

            var p = Paricle.new(this.game)
            var s = 2
            var vx = randomBetween(-s, s)
            var vy = randomBetween(-s, s)
            p.init(this.x, this.y, vx, vy)
            this.paricles.push(p)
        }
        //
        for (var p of this.paricles) {
            p.update()
        }
        // 保留生命值大于 0
        this.paricles = this.paricles.filter(p => p.life > 0)
    }
    setup(){
        this.x = 200
        this.y = 300
        this.paricles = []
        this.numberOfParicle = 20
        this.alive = true
        this.life = 30
    }
}


class Paricle extends LuckyImage {
    constructor(game) {
        super(game, 'spark')
        this.life = 20
    }
    init(x, y, vx, vy) {
        this.x = x
        this.y = y
        this.vx = vx
        this.vy = vy
    }
    update() {
        this.life--
        this.x +=  this.vx
        this.y +=  this.vy
        var factor = 0.02
        this.vx += factor * this.vx
        this.vy += factor * this.vy
    }
}
