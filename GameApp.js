const SocketManager = require('SocketManager');
const AudioManager = require('AudioManager');
const UIManager = require('UIManager');
const DataManager = require('DataManager');
const HttpManager = require('HttpManager');
const EventManager = require('EventManager');

let GameApp = cc.Class({
    properties: {
        eventManager: EventManager,
        dataManager: DataManager,
        audioManager: AudioManager,
        httpManager: HttpManager,
        socketManager: SocketManager,
        uiManager: UIManager,
    },

    ctor () {
        this.eventManager = new EventManager();
        this.dataManager = new DataManager();
        this.audioManager = new AudioManager();
        this.httpManager = new HttpManager();
        this.socketManager = new SocketManager();
        this.uiManager = null;
        this.protocol = require("Protocol");
    },

    Start() {
        this.protocol.Initialize();
        cc.debug.setDisplayStats(false);   // 关闭Creator调试的时候左下角的fps面板
    },
});
if (!CC_EDITOR) {
    window.GameApp = new GameApp();
    window.GameApp.Start();
}
