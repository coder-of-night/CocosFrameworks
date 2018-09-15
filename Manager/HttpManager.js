cc.Class({
    name: 'HttpManager',

    properties: {},

    send (route, data, cbSuccess, cbFail) {
        let xhr = new XMLHttpRequest();
        xhr.timeout = 15000;
        xhr.open('post', HTTP_SERVERS[SERVER] + route);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            let res = JSON.parse(xhr.responseText);
            cc.log(res);
            if (!res.success) {
                cbFail && cbFail(res.code, res.data);
                return;
            }
            cbSuccess && cbSuccess(res.data);
        };
        xhr.ontimeout = function () {
            cc.log('网络连接超时');
        };
        xhr.onerror = function () {
            cc.log('网络连接出错');
        };
        xhr.onabort = function () {
            cc.log('网络连接中断');
        };
        xhr.send(JSON.stringify(data));
    },
});
