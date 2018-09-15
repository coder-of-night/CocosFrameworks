const PREFAB_PATH = require('PrefabPath')

cc.Class({
    extends: cc.Component,

    properties: {
        uiRoot: cc.Node,
        popupRoot: cc.Node,
        toastRoot: cc.Node,
        toastPrefab: cc.Prefab,
        loadingMask: cc.Node,
        headRoot: cc.Node,
        bottomRoot: cc.Node,

        loadingProgress: cc.ProgressBar,

        _Prefabs: {
            default: {},
        },
    },

    onLoad() {
        if (GameApp.uiManager !== null) {
            return this.node.destroy();
        }
        GameApp.uiManager = this;
        cc.game.addPersistRootNode(this.node);

        this.setLoadingMaskVisible(false);

        this.loadingProgress.progress = 0
        this.startLoading()
    },

    startLoading: function() {
        this.loadingProgress.node.active = true;
        this.loadAll(function(completedCount, totalCount) {
            var per = completedCount / totalCount
            if (per && !isNaN(per)) {
                this.loadingProgress.progress = per
            }
        }.bind(this), function() {
            GameApp.uiManager.showHead('Head')
            GameApp.uiManager.showBottom('Bottom')
            GameApp.uiManager.setHeadVisible(false)
            GameApp.uiManager.setBottomVisible(false)
            this.loadingProgress.node.active = false
            this.showUI('LoginUI')
            
        }.bind(this))
    },

    loadAll(cbProgress, cbComplete) {
        let paths = [];
        for (let name in PREFAB_PATH) {
            paths.push(PREFAB_PATH[name]);
        }
        cc.loader.loadResArray(paths, function(completedCount, totalCount) {
            cbProgress(completedCount, totalCount);
        }, function(err, prefabs) {
            let names = Object.keys(PREFAB_PATH);
            for (let i in prefabs) {
                this._Prefabs[names[i]] = prefabs[i];
            }
            cbComplete();
        }.bind(this));
    },

    load(name, cb) {
        cc.loader.loadRes(PREFAB_PATH[name], function(err, prefab) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            this._Prefabs[name] = prefab;
            cb && cb(name);
        }.bind(this));
    },

    showUI(name, cb) {
        //未加载
        if (this._curName == name) {
            cc.log("---showUI.repeat----")
            return;
        }

        if (!this._Prefabs[name]) {
            this.load(name, function() {
                this.showUI(name, cb);
            }.bind(this));
            return;
        }
        //已加载
        this.uiRoot.removeAllChildren();
        for (let i = this.popupRoot.children.length - 1; i >= 0; i--) {
            if (this.popupRoot.children[i]._tag !== 10086) {
                this.popupRoot.children[i].removeFromParent();
            }
        }
        let node = cc.instantiate(this._Prefabs[name]);
        this.uiRoot.addChild(node);
        this._curName = name;

        cb && cb(node);
    },

    getUI(name) {
        return this.uiRoot.getChildByName(name);
    },

    showPopup(name, cb, clean = true) {
        //未加载
        if (!this._Prefabs[name]) {
            this.load(name, function() {
                this.showPopup(name, cb);
            }.bind(this));
            return;
        }
        //已加载
        let node = cc.instantiate(this._Prefabs[name]);
        this.popupRoot.addChild(node);
        //切换场景时不被清理
        if (!clean) {
            node._tag = 10086;
        }
        cb && cb(node);
    },

    getPopup(name) {
        return this.popupRoot.getChildByName(name);
    },

    popPopup() {
        let popups = this.popupRoot.children;
        if (popups.length > 0) {
            popups[popups.length - 1].removeFromParent();
        }
    },

    clearPopup(name) {
        for (let node of this.popupRoot.children) {
            if (node.name === name) {
                node.removeFromParent();
                break;
            }
        }
    },

    clearPopups() {
        this.popupRoot.removeAllChildren();
    },

    showToast(s, callback) {
        if (!this.toastPrefab) return;

        var toast = cc.instantiate(this.toastPrefab);
        this.toastRoot.addChild(toast);
        toast.getComponent('ToastUI').show(s, callback);
    },

    setLoadingMaskVisible(isShow) {
        if (isShow) {
            this.loadingMask.active = true
        } else {
            this.loadingMask.active = false
        }
    },

    showHead(name, cb) {
        //未加载
        if (!this._Prefabs[name]) {
            this.load(name, function() {
                this.showHead(name, cb);
            }.bind(this));
            return;
        }
        //已加载
        let node = cc.instantiate(this._Prefabs[name]);
        this.headRoot.addChild(node);

        cb && cb(node);
    },

    showBottom(name, cb) {
        //未加载
        if (!this._Prefabs[name]) {
            this.load(name, function() {
                this.showBottom(name, cb);
            }.bind(this));
            return;
        }
        //已加载
        let node = cc.instantiate(this._Prefabs[name]);
        this.bottomRoot.addChild(node);

        cb && cb(node);
    },

    setHeadVisible(isShow) {
        if (isShow) {
            this.headRoot.active = true
        } else {
            this.headRoot.active = false
        }
    },

    setBottomVisible(isShow, resetSelectID) {
        if (isShow) {
            this.bottomRoot.active = true
            if (resetSelectID) {
                this.bottomRoot.getChildByName("Bottom").getComponent("Bottom").btnTap(null, resetSelectID)
            }

        } else {
            this.bottomRoot.active = false
        }
    },

});