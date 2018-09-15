cc.Class({
    name: "DataManager",

    properties: {
        MD5Code: null,
        userData: {
            default: {},
        },
        noticeCount: 0,
    },

    ctor() {
        this.userData = {
            uid: -1,
            nickname: "女神",
            gender: 0, // 性别 1:男 0:女
            photoID: 0,
            money: 0,
            diamond: 0, //钻石
            charm: 0, //魅力值
            fatigue: 0, //疲劳值
            fatigueMax: 0,//上限
            malePetData:null,
            canUseMaleNum:0,// 可用的男宠数量

            // 下面是男性专属的
            power: 0, //体力 
            bearing: 0, //仪态
            knowledge: 0, //学识
            communication: 0, //沟通
        }
    },

    isFemale() {
        return this.userData.gender == 0 ? true : false
    },

    setMD5Code(_data) {
        this.MD5Code = _data
    },

    getMD5Code() {
        return this.MD5Code
    },

    setUserData(data) {
        this.userData.uid = data.id
        this.userData.nickname = data.nickName
        this.userData.gender = parseInt(data.sex)
        this.userData.photoID = parseInt(data.iconCode)
        this.userData.money = data.gold
        this.userData.diamond = data.diamond
        this.userData.charm = data.charm
        this.userData.fatigue = data.fatigueValue
        this.userData.fatigueMax = data.fatigueValueMax

        GameApp.eventManager.emit(EventNames.EVENT_UPDATE_USERINFO)
    },

    setMalePetListData(data) {
        this.userData.malePetData = data

        this.userData.canUseMaleNum = 0
        for (let i = 0; i < data.length; i++) {
            if (data[i].isBusy == "0") {
                this.userData.canUseMaleNum++
            }
        }

        GameApp.eventManager.emit(EventNames.EVENT_UPDATE_MALEPET)
    },

    getMalePetListData() {
        return this.userData.malePetData
    },

    setNotice(_data) {
        this.noticeCount = _data
        GameApp.eventManager.emit(EventNames.EVENT_UPDATE_NOTICERED)

    },

});