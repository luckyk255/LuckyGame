/**
 * SpriteAnimation - 通用帧动画管理器
 * 支持多状态（walk/attack/die等）帧序列播放
 *
 * 用法：
 *   var anim = new SpriteAnimation(game, {
 *     walk:   { prefix: 'zombie_walk_', count: 22, fps: 12 },
 *     attack: { prefix: 'zombie_attack_', count: 21, fps: 12 },
 *     die:    { prefix: 'zombie_die_', count: 10, fps: 10, loop: false }
 *   }, 'walk')
 *
 *   每帧调用 anim.update()
 *   绘制时用   anim.currentTexture()
 */
class SpriteAnimation {
    constructor(game, states, initialState) {
        this.game = game
        this.states = states    // { stateName: { prefix, count, fps, loop } }
        this.state = initialState || Object.keys(states)[0]
        this.frameIndex = 0
        this.timer = 0
        this.finished = false   // 单次播放结束标志（loop:false时）
        this._onFinish = null   // 单次播放结束回调
    }

    // 切换状态（自动重置帧索引）
    setState(name) {
        if (this.state === name) return
        if (!this.states[name]) return
        this.state = name
        this.frameIndex = 0
        this.timer = 0
        this.finished = false
    }

    // 设置单次播放结束回调
    onFinish(cb) {
        this._onFinish = cb
    }

    // 每帧调用
    update() {
        var cfg = this.states[this.state]
        if (!cfg) return
        if (this.finished) return

        var interval = Math.floor(30 / (cfg.fps || 12))  // 游戏30fps，转换为帧间隔
        if (interval < 1) interval = 1

        this.timer++
        if (this.timer >= interval) {
            this.timer = 0
            var loop = cfg.loop !== false  // 默认循环
            if (loop) {
                this.frameIndex = (this.frameIndex + 1) % cfg.count
            } else {
                if (this.frameIndex < cfg.count - 1) {
                    this.frameIndex++
                } else {
                    this.finished = true
                    if (this._onFinish) this._onFinish()
                }
            }
        }
    }

    // 获取当前帧的纹理
    currentTexture() {
        var cfg = this.states[this.state]
        if (!cfg) return null
        var key = cfg.prefix + this.frameIndex
        return this.game.textureByName(key)
    }

    // 绘制当前帧（居中于 cx,cy，按 scale 缩放，可水平翻转）
    draw(ctx, cx, cy, scale, flipX) {
        var tex = this.currentTexture()
        if (!tex) return
        var w = tex.width * scale
        var h = tex.height * scale
        ctx.save()
        ctx.translate(cx, cy)
        if (flipX) ctx.scale(-1, 1)
        ctx.drawImage(tex, -w / 2, -h / 2, w, h)
        ctx.restore()
    }
}
