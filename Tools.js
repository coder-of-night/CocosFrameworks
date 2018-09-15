window.Tools = {
    addClickEvent: function(node, target, component, handler, customEventData) {
        // cc.log(component + ":" + handler);
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;
        if (customEventData != undefined) {
            eventHandler.customEventData = customEventData
        }

        node.getComponent(cc.Button).clickEvents = [];
        node.getComponent(cc.Button).clickEvents.push(eventHandler);
    },

    // 时间戳->2018/8/8
    toDateString: function(timeStamp) {
        if (timeStamp == undefined || timeStamp == null) {
            return ""
        }
        let date = new Date(timeStamp);
        return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    },

    // 秒->08:08:08
    toTimeString: function(s) {
        if (s <= 0) {
            return "00:00:00";
        }
        s = Math.floor(s);
        let hour = Math.floor(s / (60 * 60));
        s -= hour * (60 * 60);
        let minute = Math.floor(s / 60);
        s -= minute * 60;
        let ret = '';
        if (hour > 0) {
            ret += hour < 10 ? '0' + hour : hour
        } else {
            ret += '00'
        }
        ret += ':'
        if (minute > 0) {
            ret += minute < 10 ? '0' + minute : minute
        } else {
            ret += '00'
        }
        ret += ':'
        if (s > 0) {
            ret += s < 10 ? '0' + s : s
        } else {
            ret += '00'
        }
        return ret;
    },

    //生成从minNum到maxNum的随机数
    randomNum: function(minNum, maxNum) {
        return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
    },

    // 将数字转换有单位的显示
    // 万、十万、百万、千万、亿、十亿、百亿
    numChangeDisPlay: function(num) {
        if (num === undefined || isNaN(num)) {
            cc.log("数字转换出错，num为undefined或不是数字！");
            return "";
        }

        var isNegative = false;
        if (num < 0) {
            isNegative = true;
            num = -num;
        }

        if (num < 10000) {
            return isNegative ? -num : num;
        } else if (num < 100000) {
            return this.addNegativeCaculation(isNegative, num, 10000, "万")
        } else if (num < 1000000) {
            return this.addNegativeCaculation(isNegative, num, 100000, "十万")
        } else if (num < 10000000) {
            return this.addNegativeCaculation(isNegative, num, 1000000, "百万")
        } else if (num < 100000000) {
            return this.addNegativeCaculation(isNegative, num, 10000000, "千万")
        } else if (num < 1000000000) {
            return this.addNegativeCaculation(isNegative, num, 100000000, "亿")
        } else if (num < 10000000000) {
            return this.addNegativeCaculation(isNegative, num, 1000000000, "十亿")
        } else if (num < 100000000000) {
            return this.addNegativeCaculation(isNegative, num, 10000000000, "百亿")
        } else if (num < 1000000000000) {
            return this.addNegativeCaculation(isNegative, num, 100000000000, "千亿")
        } else if (num < 10000000000000) {
            return this.addNegativeCaculation(isNegative, num, 1000000000000, "万亿")
        } else {
            return this.addNegativeCaculation(isNegative, num, 10000000000000, "亿亿")
        }
    },

    addNegativeCaculation: function(isNegative, num, rate, strName) {
        return isNegative ? "-" + this.calculation(num, rate, strName) : this.calculation(num, rate, strName);
    },

    // calculation number
    calculation: function(num, rate, strName) {
        var n1 = Math.floor(num / rate);
        var n2 = Math.floor(num % rate / rate * 10);
        if (n2 === 0) {
            return n1 + strName;
        } else {
            return n1 + "." + n2 + strName;
        }
    },
};