
cc.Class({
    name:"AudioManager",

    properties: {
        _musicOn: true,
        _musicAudioID: 0,
        _musicName: '',

        _effectOn: true,
        _effectAudioID: 0,
    },

    // 暂时未调用,代码有待细化
    init () {
        cc.game.on(cc.game.EVENT_HIDE, function () {
            console.log("cc.audioEngine.pauseAll");
            cc.audioEngine.pauseAll();
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            console.log("cc.audioEngine.resumeAll");
            cc.audioEngine.resumeAll();
        });
    },

    getMusicName(name) {
        return cc.url.raw('resources/audio/music/' + name + '.mp3')
    },

    getEffectName(name) {
        return cc.url.raw('resources/audio/effect/' + name + '.mp3')
    },

    playMusic (name, restart) {
        if (name === '' || this._musicName === name && !restart) {
            return;
        }
        this._musicName = name;
        if (this._musicOn) {
            cc.audioEngine.stop(this._musicAudioID);
            this._musicAudioID = cc.audioEngine.play(this.getMusicName(name), true, 1);
        }
    },

    setMusic (on) {
        this._musicOn = on;
        cc.sys.localStorage.setItem('MUSIC_ON', '' + on);
        if (on) {
            this.playMusic(this._musicName, true);
        } else {
            cc.audioEngine.stop(this._musicAudioID);
        }
    },

    playEffect (name) {
        if (this._effectOn) {
            //cc.audioEngine.stop(this._effectAudioID);
            this._effectAudioID = cc.audioEngine.play(this.getEffectName(name), false, 1);
        }
    },

    setEffect (on) {
        this._effectOn = on;
        cc.sys.localStorage.setItem('EFFECT_ON', '' + on);
        if (!on) {
            cc.audioEngine.stop(this._effectAudioID);
        }
    },
});
