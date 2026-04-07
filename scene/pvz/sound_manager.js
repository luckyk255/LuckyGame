/**
 * SoundManager - 音乐/音效管理器
 *
 * 当前状态：资源包中无音频文件，仅预留接口
 * 后续添加音频后，取消注释相关代码即可启用
 */
class SoundManager {
    constructor() {
        this.enabled = false
        this.sounds = {}
        this.bgm = null
        this.volume = 0.5

        // TODO: 当添加音频文件后，初始化 Audio 对象
        // this._initSounds()
    }

    static instance() {
        if (!SoundManager._inst) {
            SoundManager._inst = new SoundManager()
        }
        return SoundManager._inst
    }

    // 预留：初始化音效（后续填入真实路径）
    _initSounds() {
        // 示例：
        // this.sounds.shoot = new Audio('audio/shoot.mp3')
        // this.sounds.explode = new Audio('audio/explode.mp3')
        // this.sounds.collect = new Audio('audio/collect.mp3')
        // this.sounds.plant = new Audio('audio/plant.mp3')
        // this.sounds.groan = new Audio('audio/groan.mp3')
        // this.bgm = new Audio('audio/bgm.mp3')
        // this.bgm.loop = true
    }

    // 播放音效
    play(name) {
        if (!this.enabled) return
        var s = this.sounds[name]
        if (s) {
            s.currentTime = 0
            s.play().catch(() => {})
        }
    }

    // 播放背景音乐
    playBGM() {
        if (!this.enabled || !this.bgm) return
        this.bgm.volume = this.volume
        this.bgm.play().catch(() => {})
    }

    // 停止背景音乐
    stopBGM() {
        if (!this.bgm) return
        this.bgm.pause()
        this.bgm.currentTime = 0
    }

    // 设置音量 0-1
    setVolume(v) {
        this.volume = Math.max(0, Math.min(1, v))
        if (this.bgm) this.bgm.volume = this.volume
    }

    // 启用/禁用音效
    setEnabled(en) {
        this.enabled = en
        if (!en) this.stopBGM()
        else this.playBGM()
    }
}

// 全局快捷函数
var playSound = (name) => SoundManager.instance().play(name)
