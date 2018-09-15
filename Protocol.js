cc.Class({
    statics: {

        // 初始化需要实时监听的协议
        Initialize() {

        },

        /**
         * 账号登录请求
         */
        AccountLogin() {
            var code = GameApp.dataManager.getMD5Code()
            GameApp.socketManager.send('Account', 'Login', {
                securetCode: code,
                sex: GameApp.dataManager.isFemale() ? 0 : 1
            });
        },

        /**
         * 获取选择IP列表接口
         * @param { ... } data - 发送的数据
         * @param { Function } cb - 成功回调函数
         * @param { Function } eb - 失败回调函数
         */
        GetSelectIPList(data, cb, eb) {

        },
    }

});