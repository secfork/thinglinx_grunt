Date.prototype.dateAfter = function(num, type) {
    num = (num == null ? 1 : num);
    if (typeof(num) != "number") throw new Error(-1, "dateAfterDays(num,type)的num参数为数值类型.");
    type = (type == null ? 0 : type);
    var arr = [1000, 86400000];
    var dd = this.valueOf();
    dd += num * arr[type];
    return new Date(dd);
}

//根据当前日期所在年和周数返回周一的日期
Date.prototype.RtnMonByWeekNum = function(weekNum) {
        if (typeof(weekNum) != "number")
            throw new Error(-1, "RtnByWeekNum(weekNum)的参数是数字类型.");
        var date = new Date(this.getFullYear(), 0, 1);
        var week = date.getDay();
        week = (week == 0 ? 7 : week);
        return date.dateAfter(weekNum * 7 - week - 7 + 7, 1);
    }
    //根据当前日期所在年和周数返回周日的日期
Date.prototype.RtnSunByWeekNum = function(weekNum) {
        if (typeof(weekNum) != "number")
            throw new Error(-1, "RtnByWeekNum(weekNum)的参数是数字类型.");
        var date = new Date(this.getFullYear(), 0, 1);
        var week = date.getDay();
        week = (week == 0 ? 7 : week);
        return date.dateAfter(weekNum * 7 - week - 2 + 7, 1);
    }
    //通过当前时间计算当前周数
Date.prototype.getWeekNumber = function() {
    var d = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
    var DoW = d.getDay();
    d.setDate(d.getDate() - (DoW + 6) % 7 + 3); // Nearest Thu
    var ms = d.valueOf(); // GMT
    d.setMonth(0);
    d.setDate(4); // Thu in Week 1
    return Math.round((ms - d.valueOf()) / (7 * 864e5)) + 1;
}
