class SoundManager {
    constructor() {
        this.enabled = localStorage.getItem('pvz_sound_enabled') !== '0'
        this.masterVolume = 0.18
        this.ctx = null
        this.bgmTimer = null
        this.bgmBeat = 0
        this.bgmStarted = false
    }

    static instance() {
        if (!SoundManager._inst) {
            SoundManager._inst = new SoundManager()
        }
        return SoundManager._inst
    }

    _ensureContext() {
        if (this.ctx) return this.ctx
        var AC = window.AudioContext || window.webkitAudioContext
        if (!AC) return null
        this.ctx = new AC()
        return this.ctx
    }

    unlock() {
        var ctx = this._ensureContext()
        if (!ctx) return
        if (ctx.state === 'suspended') {
            ctx.resume()
        }
    }

    _createGainNode(gainValue, when, duration) {
        var ctx = this._ensureContext()
        if (!ctx) return null
        var gain = ctx.createGain()
        gain.gain.setValueAtTime(0.0001, when)
        gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, gainValue), when + 0.01)
        gain.gain.exponentialRampToValueAtTime(0.0001, when + duration)
        gain.connect(ctx.destination)
        return gain
    }

    _playTone(freq, opts) {
        var ctx = this._ensureContext()
        if (!ctx || !this.enabled) return
        var options = opts || {}
        var when = options.when || ctx.currentTime
        var duration = options.duration || 0.18
        var type = options.type || 'sine'
        var gainValue = (options.gain || 0.2) * this.masterVolume
        var gain = this._createGainNode(gainValue, when, duration)
        if (!gain) return

        var osc = ctx.createOscillator()
        osc.type = type
        osc.frequency.setValueAtTime(freq, when)
        if (options.slideTo) {
            osc.frequency.exponentialRampToValueAtTime(options.slideTo, when + duration)
        }
        osc.connect(gain)
        osc.start(when)
        osc.stop(when + duration + 0.02)
    }

    _playNoise(opts) {
        var ctx = this._ensureContext()
        if (!ctx || !this.enabled) return
        var options = opts || {}
        var when = options.when || ctx.currentTime
        var duration = options.duration || 0.12
        var buffer = ctx.createBuffer(1, Math.max(1, Math.floor(ctx.sampleRate * duration)), ctx.sampleRate)
        var data = buffer.getChannelData(0)
        for (var i = 0; i < data.length; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
        }

        var source = ctx.createBufferSource()
        source.buffer = buffer

        var filter = ctx.createBiquadFilter()
        filter.type = options.filterType || 'lowpass'
        filter.frequency.setValueAtTime(options.frequency || 1000, when)

        var gain = this._createGainNode((options.gain || 0.12) * this.masterVolume, when, duration)
        if (!gain) return

        source.connect(filter)
        filter.connect(gain)
        source.start(when)
        source.stop(when + duration + 0.02)
    }

    play(name) {
        if (!this.enabled) return
        this.unlock()
        var ctx = this._ensureContext()
        if (!ctx) return
        var now = ctx.currentTime

        if (name === 'shoot') {
            this._playTone(720, { when: now, duration: 0.08, type: 'square', gain: 0.18, slideTo: 520 })
        } else if (name === 'plant') {
            this._playTone(260, { when: now, duration: 0.12, type: 'triangle', gain: 0.28, slideTo: 330 })
        } else if (name === 'collect') {
            this._playTone(880, { when: now, duration: 0.08, type: 'triangle', gain: 0.2 })
            this._playTone(1180, { when: now + 0.06, duration: 0.12, type: 'triangle', gain: 0.18 })
        } else if (name === 'sun') {
            this._playTone(660, { when: now, duration: 0.14, type: 'sine', gain: 0.16 })
        } else if (name === 'zombie_die') {
            this._playTone(210, { when: now, duration: 0.25, type: 'sawtooth', gain: 0.24, slideTo: 90 })
            this._playNoise({ when: now, duration: 0.18, frequency: 500, gain: 0.08 })
        } else if (name === 'paper_break') {
            this._playNoise({ when: now, duration: 0.12, frequency: 2200, gain: 0.16 })
            this._playTone(420, { when: now + 0.02, duration: 0.08, type: 'square', gain: 0.1 })
        } else if (name === 'explode') {
            this._playNoise({ when: now, duration: 0.38, frequency: 700, gain: 0.4 })
            this._playTone(110, { when: now, duration: 0.35, type: 'sawtooth', gain: 0.22, slideTo: 55 })
        }
    }

    _scheduleBgmBeat(when) {
        var bass = [196, 220, 174, 164, 196, 220, 246, 220]
        var lead = [392, 440, 392, 349, 392, 440, 392, 330]
        var index = this.bgmBeat % bass.length
        this._playTone(bass[index], {
            when: when,
            duration: 0.24,
            type: 'triangle',
            gain: 0.11,
        })
        if (index % 2 === 0) {
            this._playTone(lead[index], {
                when: when + 0.02,
                duration: 0.16,
                type: 'square',
                gain: 0.06,
            })
        }
        this.bgmBeat++
    }

    playBGM() {
        if (!this.enabled || this.bgmStarted) return
        this.unlock()
        var ctx = this._ensureContext()
        if (!ctx) return
        this.bgmStarted = true
        this.bgmBeat = 0
        this._scheduleBgmBeat(ctx.currentTime)
        var self = this
        this.bgmTimer = setInterval(function() {
            if (!self.enabled) return
            self._scheduleBgmBeat(self.ctx.currentTime + 0.02)
        }, 260)
    }

    stopBGM() {
        if (this.bgmTimer) {
            clearInterval(this.bgmTimer)
            this.bgmTimer = null
        }
        this.bgmStarted = false
    }

    setEnabled(en) {
        this.enabled = en
        localStorage.setItem('pvz_sound_enabled', en ? '1' : '0')
        if (!en) {
            this.stopBGM()
        } else {
            this.playBGM()
        }
    }
}

var playSound = function(name) {
    SoundManager.instance().play(name)
}
