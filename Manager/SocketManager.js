const EventEmitter = require('events').EventEmitter;

cc.Class({
    name: 'SocketManager',
    extends: EventEmitter,

    properties: {
        MockNet: false,
        _webSocket: WebSocket,
        _retryCount: 5,
        _retryTimer: 0,
    },

    ctor() {
        this.setMaxListeners(256);
        window.addEventListener('online', function() {
            cc.log('网络恢复');
            if (this._retryCount < 0) {
                cc.log('重连结束，主动连接');
                this.firstConnect();
            }
        }.bind(this));
    },

    connect() {
        this._retryCount--;
        cc.log('-------初始化连接-------');
        clearInterval(this._retryTimer);
        this.init(WS_SERVERS[SERVER]);
    },

    firstConnect() {
        if (this.MockNet) {
            //模拟环境下等待100ms
            setTimeout(function() {
                GameApp.uiManager.showUI('SelectLeaderUI')
            }, 100);

            GameApp.uiManager.showToast('登录成功！')
        } else {
            if (!this._webSocket || this._webSocket.readyState === WebSocket.CLOSED) {
                // this.resetReconnect();
                this.connect();
            }
        }
    },

    // reconnect() {
    //     this._retryCount--;
    //     cc.log('Retry Count：' + this._retryCount);
    //     if (this._retryCount >= 0) {
    //         this._retryTimer = setInterval(this.connect.bind(this), 3000);
    //     }
    // },

    resetReconnect() {
        this._retryCount = 5;
    },

    init(server) {
        this._webSocket = new WebSocket(server);

        this._webSocket.onopen = function(event) {
            cc.log('网络open！！！');
            this.resetReconnect();
            //直接登录
            GameApp.protocol.AccountLogin();
        }.bind(this);

        this._webSocket.onmessage = function(event) {
            let data = JSON.parse(event.data);
            if ("Heart" != data.scmd && "Sys" != data.mcmd) {
                cc.log('recieve------<<');
                cc.log(data);
            }
            if (data.data && data.data.code != 0) {
                cc.warn("服务端处理异常！ code: " + data.data.code + "  msg: " + data.data.message)
            }
            return this.emit(data.mcmd + data.scmd, data.data);
        }.bind(this);

        this._webSocket.onclose = function(event) {
            cc.log('网络close！！！ code:' + event.code);
            if (Number(event.code) !== 1000) {
                // setTimeout(function () {
                    GameApp.uiManager.showToast('网络连接已中断，正在尝试重新连接！!');
                    if (this._retryCount > 0) {
                        this.firstConnect();
                    }
                // }, 1000);
                // this.reconnect();
            }
        }.bind(this);
        this._webSocket.onerror = function(event) {};
    },

    close() {
        if (this._webSocket) {
            this._webSocket.onclose = null;
            this._webSocket.close();
            this._webSocket = null;
        }
    },

    send(mcmd, scmd, data) {
        if (this.MockNet) {
            this.emit(mcmd + scmd, data);
        } else {
            if (!this._webSocket || this._webSocket.readyState !== WebSocket.OPEN) {
                cc.log('重连结束，主动连接');
                this.firstConnect();

                return GameApp.uiManager.showToast('网络连接已中断，正在尝试重新连接！');
            }
            let msg = {
                mcmd: mcmd,
                scmd: scmd
            };
            if (data) {
                msg.data = data;
            }

            var jsonMsg = JSON.stringify(msg);
            if ("Heart" != msg.scmd && "Sys" != msg.mcmd) {
                cc.log('send------->>');
                cc.log(msg);
            }
            this._webSocket.send(jsonMsg);
        }
    },

});