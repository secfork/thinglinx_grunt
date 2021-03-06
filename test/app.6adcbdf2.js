 Date.prototype.dateAfter = function(a, b) {
    if (a = null == a ? 1 : a, "number" != typeof a) throw new Error(-1, "dateAfterDays(num,type)的num参数为数值类型.");
    b = null == b ? 0 : b;
    var c = [1e3, 864e5],
        d = this.valueOf();
    return d += a * c[b], new Date(d)
}, Date.prototype.RtnMonByWeekNum = function(a) {
    if ("number" != typeof a) throw new Error(-1, "RtnByWeekNum(weekNum)的参数是数字类型.");
    var b = new Date(this.getFullYear(), 0, 1),
        c = b.getDay();
    return c = 0 == c ? 7 : c, b.dateAfter(7 * a - c - 7 + 7, 1)
}, Date.prototype.RtnSunByWeekNum = function(a) {
    if ("number" != typeof a) throw new Error(-1, "RtnByWeekNum(weekNum)的参数是数字类型.");
    var b = new Date(this.getFullYear(), 0, 1),
        c = b.getDay();
    return c = 0 == c ? 7 : c, b.dateAfter(7 * a - c - 2 + 7, 1)
}, Date.prototype.getWeekNumber = function() {
    var a = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0),
        b = a.getDay();
    a.setDate(a.getDate() - (b + 6) % 7 + 3);
    var c = a.valueOf();
    return a.setMonth(0), a.setDate(4), Math.round((c - a.valueOf()) / 6048e5) + 1
}, angular.module("app.account", []).controller("account_info", ["$scope", "$state", "$source", "$show", "$q", function(a, b, c, d, e) {
    a.od = {}, c.$user.get({ pk: "getaccount", op: a.user.account_id }, function(b) { a.account = b.ret }), c.$region.get({ op: "total" }, function(b) { a.regionNum = b.ret }), c.$user.get({ op: "total" }, function(b) { a.userNum = b.ret }), e.all([c.$system.get({ pk: "total" }).$promise, c.$system.get({ pk: "total", state: 1 }).$promise]).then(function(b) { a.totalSys = b[0].ret || 0, a.totalSys_act = b[1].ret || 0, a.initChart_sys = !0 });
    var f = new Date,
        g = { end: f.getTime(), start: f.RtnMonByWeekNum(f.getWeekNumber()) - 6048e5 };
    e.all([d.alarm.get(angular.extend({ op: "total" }, g)).$promise, d.alarm.get(angular.extend({ op: "total", active: 1 }, g)).$promise]).then(function(b) { a.totalAlarm = b[0].ret || 0, a.totalAlarm_act = b[1].ret || 0, a.initChart_alarm = !0 })
}]).controller("account_users", ["$scope", "$state", "$source", "$sys", "$q", "$modal", "$modal", function(a, b, c, d, e, f, f) {
    a.$moduleNav("用户", b), a.page = {}, a.user = {}, a.op = {}, a.od = { groups: [] }, a.loadPageData = function(b) {
        var e = { currentPage: b || 1, itemsPerPage: d.itemsPerPage, username: a.op.f_name };
        e.username && (e.username += /.\*$/.test(e.username) ? "" : "*"), a.showMask = !0, c.$user.query(e, function(c) { a.page = c, a.page.currentPage = b, a.showMask = !1 }, function() { a.showMask = !1 })
    }, a.loadPageData(1);
    var g = a;
    a.updateUser = function(a) {
        return c.$user.put({}, a).$promise
    }, a.createUser = function() { f.open({ templateUrl: "athena/account/users_edit.html", controller: ["$scope", "$modalInstance", function(a, b) { a.__proto__ = g, a.$modalInstance = b, a.user = {}, a.isAdd = !0, a.done = function() { a.validForm(), c.$user.save(a.user, function(b) { a.user.id = b.ret, a.page.data.unshift(a.user), a.cancel() }) } }] }) }, a.delUser = function(b, d, e) { a.confirmInvoke({ title: "删除用户:" + d.username, note: "确认要删除该用户吗?" }, function(a) { c.$user.delByPk({ pk: d.id }, function(c) { b.splice(e, 1), a() }, a) }) }, a.verifyUser = function(a, b, d) {
        f.open({
            templateUrl: "phone" == d ? "athena/account/users_verify_phone.html" : "athena/account/users_verify_email.html",
            controller: ["$scope", "$modalInstance", "$interval", function(b, d, e) {
                function f(a, b) {
                    a.disabled = !0;
                    var c = 120;
                    h = e(function() { $(a).text(i.replace("%", c)), c--, 0 > c && (a.disabled = !1, $(a).text(j[b || "phone"]), e.cancel(h)) }, 1e3)
                }
                b.$modalInstance = d, b.__proto__ = g, b.u = angular.copy(a), b.ver = {};
                var h, i = "重新发送(%)",
                    j = { email: "发送验证邮件", phone: "发送验证码" };
                b.sendEmail = function(d) {
                    if (!b.u.email) return void angular.alert("请输入邮箱!");
                    f(d.currentTarget, "email");
                    var e = { id: a.id, email: b.u.email };
                    c.$user.save({ pk: "sendverifyemail" }, e)
                }, b.sendNote = function(a) {
                    return b.u.mobile_phone ? (f(a.currentTarget, "phone"), void c.$note.get({ op: "user", mobile_phone: b.u.mobile_phone }, function() {})) : void angular.alert("请输入手机号")
                }, b.verifyPhone = function() {
                    if (!b.u.mobile_phone) return void angular.alert("请输入手机号");
                    if (!b.ver.phone) return void angular.alert("请输入验证码");
                    var d = { id: a.id, mobile_phone: b.u.mobile_phone, verifi: b.ver.phone };
                    c.$user.save({ pk: "verifyphone" }, d, function(c) { a.mobile_phone_verified = !0, b.cancel(), a.mobile_phone = b.u.mobile_phone, b.user.mobile_phone_verified = !0 })
                }
            }]
        })
    }
}]).controller("account_userdetail", ["$scope", "$source", "$state", "$stateParams", "$modal", "$sys", "$translate", "$interval", "$localStorage", "$sessionStorage", "$q", function(a, b, c, d, e, f, g, h, i, j, k) {
    function l(b) { a.interval[b] = h(function() { $("#" + b).text(t.replace("%", a.intervalTimes[b])), j[b] = --a.intervalTimes[b], a.intervalTimes[b] < 0 && (a.intervalTimes[b] = s, h.cancel(a.interval[b]), a.interval[b] = void 0, $("#" + b).text(textCond[b])) }, 1e3) }
    var m = a,
        n = d.id || a.user.id;
    a.userself = !d.id, a.user = void 0;
    var o = b.$user.get({ pk: n }, function(b) { a.user = b.ret, a.user.sms_notice = !!a.user.sms_notice, a.user.mail_notice = !!a.user.mail_notice }).$promise,
        p = {},
        q = b.$role.get(function(b) { a.roles = b.ret || [], angular.forEach(a.roles, function(a, b) { p[a.id] = a }) }).$promise;
    a.acceptAlarm = function(c) {
        var d = {};
        d[c] = a.user[c] ? 1 : 0, b.$user.save({ op: "notice" }, d, function() {}, function() { a.user[c] = !a.user[c] })
    }, a.acceptRegionAlarm = function(a) {
        var c = { filter: { region_id: a.region_id || a.id, type: "alarm" }, sendee: { user_id: n } };
        a.acceptAlarm || void 0 == a.acceptAlarm ? b.$sub.save({}, c, function(b) { a.sub_id = b.ret }, function() { a.acceptAlarm = !a.acceptAlarm }) : b.$sub["delete"]({ pk: a.sub_id }, function() {}, function() { a.acceptAlarm = !a.acceptAlarm })
    }, b.$user.get({ pk: "getaccountrole", op: n }, function(b) {
        var c = b.ret.role_id;
        k.all([o, q]).then(function() {
            c && $.each(a.roles, function(b, d) {
                return c == d.id ? (a.user.accountRol = d, !1) : !0
            })
        })
    }), a.$watch("user.accountRol", function(b, c) { console.log("watch user.accountRol"), a.user && (a.user._$oldAccountRole = c) }), a.addAccountRole = function() { console.log(a.form.accountRol), a.user.accountRol ? b.$user.put({ pk: "addrole", op: n, isaccount: !0 }, { role_id: a.user.accountRol.id }, function(a) {}, function() { a.user.accountRol = a.user._$oldAccountRole }) : b.$user["delete"]({ pk: "delrole", op: n, isaccount: !0 }, null, function() {}, function() { a.user.accountRol = a.user._$oldAccountRole }) };
    var r = [];
    a.privilge2Text = function(a) {
        return r = [], a && a.forEach(function(a, b) { r.push(g.instant(a)) }), r.join(";")
    }, o.then(function() {
        function c(a) {
            if (a) {
                var c = [],
                    d = {};
                a.forEach(function(a, b) { d[a.region_id || a.id] = a, c.push(a.region_id) }), b.$sub.get({ op: "select", user: n }, function(a) { angular.forEach(a.ret, function(a, b) { angular.extend(d[a.region_id], { sub_id: a.id, acceptAlarm: !0 }) }) })
            }
        }
        var d;
        a.page = {}, a.user.is_super_user ? (a.loadPageData = function(e) { d = b.$region.query({ currentPage: e, itemsPerPage: f.itemsPerPage }).$promise, d.then(function(b) { a.page.total = b.total, a.page.data = b.data, a.page.currentPage = e, a.userself && c(a.page.data) }) }, a.loadPageData(1)) : (d = b.$user.get({ pk: "getpermissions", op: n }).$promise, d.then(function(b) { a.page.data = b.ret, a.userself && c(a.page.data) })), d.then(function(c) {
            if (a.userself) {
                var d = [],
                    e = {};
                a.user.regoinRoles.forEach(function(a, b) { e[a.region_id || a.id] = a, d.push(a.region_id) }), b.$sub.get({ op: "select", user: n }, function(a) { angular.forEach(a.ret, function(a, b) { angular.extend(e[a.region_id], { sub_id: a.id, acceptAlarm: !0 }) }) })
            }
        }), k.all([d, q]).then(function() { a.initPromieseTable = !0 })
    }), a.regions = void 0, a.addRegionAuthor = function() {
        e.open({
            templateUrl: "athena/account/author_region_add.html",
            size: "sm",
            controller: ["$scope", "$modalInstance", function(a, c) {
                a.__proto__ = m, a.$modalInstance = c, a.od = { region: void 0, role: void 0 }, m.regions || b.$region.query(function(a) { m.regions = a.data }), a.done = function() {
                    a.validForm();
                    var c = a.od.region.split("&"),
                        d = c[0],
                        e = c[1];
                    b.$user.put({ pk: "addrole", op: n, region_id: d }, { role_id: a.od.role.id }, function(b) { a.page.data.push({ role_id: a.od.role.id, role_name: a.od.role.name, privilege: a.od.role.privilege, region_name: e, region_id: d }), a.cancel() })
                }
            }]
        })
    }, a.delRegionAuthor = function(c, d) { a.confirmInvoke({ title: "删除权限", note: "您确定要删除用户" + a.user.username + "在区域" + c.region_name + "的" + c.role_name + "权限!" }, function(e) { b.$user["delete"]({ pk: "delpermissions", op: n, region_id: c.region_id }, function() { a.page.data.splice(d, 1), e() }) }) }, a.ccRegionRole = function(a) { b.$user.put({ pk: "addrole", op: n, region_id: a.region_id }, { role_id: a.role_id }, function() { a.privilege = angular.copy(p[a.role_id].privilege) }) }, a.editUser = function(a) { e.open({ templateUrl: "athena/account/users_edit.html", controller: ["$scope", "$modalInstance", function(b, c) { b.__proto__ = m, b.done = function() { b.updateUser(b.user).then(function() { angular.extend(a, b.user), b.cancel() }) }, b.$modalInstance = c, b.user = angular.copy(a), b.op = {} }] }) }, a.updateUser = function(a) {
        return b.$user.put(null, a).$promise
    }, a.reSetPW = function() {
        e.open({
            templateUrl: "athena/cc_password.html",
            controller: ["$scope", "$modalInstance", "$source", function(a, b, c) {
                a.op = {}, a.od = {}, a.__proto__ = m, a.$modalInstance = b, a.done = function() {
                    a.validForm(), c.$user.save({ op: "pwdreset" }, a.op, function(b) {
                        return b.msg ? void(a.od.msg = b.msg) : (angular.alert("修改成功!"), void a.cancel())
                    })
                }
            }]
        })
    }, a.ot = {};
    var s = 120,
        t = "重新发送(%)";
    textCond = { smsInterval: "发送验证码", emailInterval: "发送验证邮件" }, a.interval = { smsInterval: void 0, emailInterval: void 0 }, a.intervalTimes = { smsInterval: j.smsInterval > 0 ? j.smsInterval : s, emailInterval: j.emailInterval > 0 ? j.emailInterval : s }, j.smsInterval > 0 && l("smsInterval"), j.emailInterval > 0 && l("emailInterval"), a.validPhone = function() {
        e.open({
            templateUrl: "athena/account/users_verify_phone.html",
            controller: ["$scope", "$modalInstance", function(a, c) {
                a.$modalInstance = c, a.__proto__ = m, a.u = { mobile_phone: a.user.mobile_phone || j["user_phone_" + n] }, a.$watch("u.mobile_phone", function(a) { j["user_phone_" + n] = a }), a.sendNote = function(c) {
                    return a.u.mobile_phone ? (l("smsInterval"), void b.$note.get({ op: "user", mobile_phone: a.u.mobile_phone }, function() {})) : void angular.alert("请输入手机号")
                }, a.verifyPhone = function() { b.$user.save({ op: "verifyphone" }, a.u, function() { a.cancel(), angular.alert("验证成功!"), a.user.mobile_phone = a.u.mobile_phone, a.user.mobile_phone_verified = 1 }) }
            }]
        })
    }, a.validEmail = function() {
        e.open({
            templateUrl: "athena/account/users_verify_email.html",
            controller: ["$scope", "$modalInstance", function(a, c) {
                a.$modalInstance = c, a.__proto__ = m, a.u = { email: a.user.email || j["user_email_" + n] }, a.$watch("u.email", function(a) { j["user_email_" + n] = a }), a.sendEmail = function(c) {
                    return a.u.email ? (l("emailInterval"), void b.$user.save({ op: "sendverifyemail" }, { email: a.u.email }, function() {})) : void angular.alert("请正确输入邮箱")
                }
            }]
        })
    }, a.verifyUser = function(a) {
        e.open({
            templateUrl: "phone" == a ? "athena/account/users_verify_phone.html" : "athena/account/users_verify_email.html",
            controller: ["$scope", "$modalInstance", "$interval", function(a, c, d) {
                function e(a, b) {
                    a.disabled = !0;
                    var c = 120;
                    f = d(function() { $(a).text(g.replace("%", c)), c--, 0 > c && (a.disabled = !1, $(a).text(h[b || "phone"]), d.cancel(f)) }, 1e3)
                }
                a.$modalInstance = c, a.__proto__ = m, a.u = angular.copy(a.user), a.ver = {};
                var f, g = "重新发送(%)",
                    h = { email: "发送验证邮件", phone: "发送验证码" };
                a.sendEmail = function(c) {
                    if (!a.u.email) return void angular.alert("请输入邮箱!");
                    e(c.currentTarget, "email");
                    var d = { id: u.id, email: a.u.email };
                    b.$user.save({ pk: "sendverifyemail" }, d)
                }, a.verifyPhone = function() {
                    if (!a.u.mobile_phone) return void angular.alert("请输入手机号");
                    if (!a.ver.phone) return void angular.alert("请输入验证码");
                    var c = { id: u.id, mobile_phone: a.u.mobile_phone, verifi: a.ver.phone };
                    b.$user.save({ pk: "verifyphone" }, c, function(b) { u.mobile_phone_verified = !0, a.cancel(), u.mobile_phone = a.u.mobile_phone, a.user.mobile_phone_verified = !0 })
                }
            }]
        })
    }
}]).controller("usergroup", ["$scope", "$state", "$source", "$sys", "$sessionStorage", "$modal", function(a, b, c, e, f, g) {
    a.$moduleNav("用户组", b);
    var h = a;
    a.page = { currentPage: 1 }, a.loadPageData = function(b) { d = { itemsPerPage: e.itemsPerPage, currentPage: b || 1 }, a.showMask = !0, c.$userGroup.query(d, function(c) { c.data && (a.page.data = c.data, a.page.total = c.total, a.page.currentPage = b, a.showMask = !1) }, function() { a.showMask = !1 }) }, a.tabToGroup = function() { a.loadPageData(1) }, a.ug = {}, a.commit = function() { c.$userGroup.save(a.ug, function(a) { angular.alert("创建成功!") }) }, a.delGroup = function(b, d, e) { a.confirmInvoke({ title: "删除用户组:" + d.name, note: "确认要删除该用户组吗?" }, function(a) { c.$userGroup.delByPk({ pk: d.id }, function(c) { b.splice(e, 1), a() }, a) }) }, a.editGroup = function(a, b, d) { g.open({ templateUrl: "athena/account/usergroup_edit.html", controller: ["$scope", "$modalInstance", function(a, d) { a.__proto__ = h, a.$modalInstance = d, a.ug = angular.copy(b), a.done = function() { a.validForm(), c.$userGroup.put(a.ug, function(c) { angular.extend(b, a.ug), a.cancel() }, a.cancel) } }] }) }
}]).controller("usergroup_users", ["$scope", "$state", "$source", "$sys", "$localStorage", function(a, b, c, d, e) {
    a.usergroup = a.$$cache[0], a.$popNav(a.usergroup.name + "(用户)", b);
    var f = { itemsPerPage: d.itemsPerPage, pk: a.usergroup.id };
    a.page = {}, (a.loadPageData = function(b) { f.currentPage = b || 1, a.showMask = !0, c.$userGroup.queryUser(f, function(b) { a.page.data = b.ret, a.showMask = !1 }, function() { a.showMask = !1 }) })(1), a.removeUser = function(b, d, e) { a.confirmInvoke({ title: "移除用户:" + d.username, note: "确认从组中移除该用户吗?用户不会被删除!" }, function(f) { c.$userGroup["delete"]({ pk: a.usergroup.id, userid: d.id }, {}, function(a) { b.splice(e, 1), f() }, f) }) }
}]).controller("acco_role", ["$scope", "$state", "$stateParams", "$sys", "$source", "$modal", function(a, b, c, d, e, f) {}]).controller("acco_author", ["$scope", "$state", "$source", "$q", function(a, b, c, d) { a.$moduleNav("权限", b), a.gp = c.$userGroup.query({ currentPage: 1 }).$promise, a.rp = c.$role.get().$promise, d.all([a.gp, a.rp]).then(function(b) { a.allgroups = b[0].data, a.allroles = b[1].ret }) }]).controller("role_ctrl", ["$scope", "$state", "$stateParams", "$source", "$sys", "$modal", "$q", "$translate", function(a, b, c, d, e, f, g, h) {
    var i = a,
        j = b.$current.data.role_category;
    a.promise = 1 == j ? e.regionP : e.accountP;
    var k;
    a.toText = function(a) {
        return k = [], angular.forEach(a, function(a, b) { k.push(h.instant(a)) }), k.join("; ")
    }, a.addRole = function(a, b) {
        f.open({
            templateUrl: "athena/account/role_add.html",
            controller: ["$scope", "$modalInstance", function(c, e) {
                if (c.__proto__ = i, c.$modalInstance = e, a) {
                    var f = {};
                    c.r = angular.copy(a), angular.forEach(a.privilege, function(a, b) { f[a] = !0 }), c.r.authors = f
                } else c.r = { role_category: j, authors: {} };
                c.done = function() {
                    c.validForm();
                    var e = angular.copy(c.r);
                    return e.privilege = [], angular.forEach(c.r.authors, function(a, b) { a && e.privilege.push(b) }), e.privilege.length ? (delete e.authors, void(a ? d.$role.put({ pk: e.id }, e, function(a) { c.roles[b] = e, c.cancel() }, c.cancel) : d.$role.save(e, function(a) { e.id = a.ret, i.roles.unshift(e), c.cancel() }, c.cancel))) : void angular.alert("请选择权限!")
                }
            }]
        })
    }, a.delRole = function(b, c) { a.confirmInvoke({ title: "删除角色:" + b.name, note: "确认要删除该角色吗?" }, function(e) { d.$role["delete"]({ pk: b.id }, function(b) { a.roles.splice(c, 1), e() }, e) }) };
    var l = { role_category: j };
    a.loadPageData = function(b) { l.currentPage = b, a.showMask = !0, d.$role.get(l, function(b) { a.roles = b.ret || [], a.showMask = !1 }, function() { a.showMask = !1 }) }, a.loadPageData(1)
}]), angular.module("app.basecontroller", ["ng"]).controller("AppCtrl", ["$scope", "$translate", "$localStorage", "$window", "$modal", "$state", "$timeout", "$sessionStorage", "$source", "$q", "$source", "$animate", "$location", "$rootScope", function(a, b, c, d, e, f, g, h, i, j, i, k, l, m) {
    function n(a) {
        var b = a.navigator.userAgent || a.navigator.vendor || a.opera;
        return /iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/.test(b)
    }

    function o(a, b, c) {
        return angular.isString(b) ? { id: b, title: a } : { id: b.current.name, title: a, state: { name: b.current.name, params: b.params }, tab: c }
    }

    function p(b) {
        var c, d;
        return $.each(a.navs, function(a, e) {
            return d = a, c = e.id != b.id
        }), c && a.navs.push(b), [c, d]
    }
    var q = a;
    a.$on("$stateChangeStart", function(a, b, c, d, e) {
   
        //console.log("stateChangeStart", a, b, c, d, e)

    });
   

    var r = !!navigator.userAgent.match(/MSIE/i);
    r && angular.element(d.document.body).addClass("ie"), n(d) && angular.element(d.document.body).addClass("smart"), a.app = { name: "Angulr", version: "1.3.0", color: { primary: "#7266ba", info: "#23b7e5", success: "#27c24c", warning: "#fad733", danger: "#f05050", light: "#e8eff0", dark: "#3a3f51", black: "#1c2b36" }, settings: { themeID: 1, navbarHeaderColor: "bg-black", navbarCollapseColor: "bg-white-only", asideColor: "bg-black", headerFixed: !0, asideFixed: !0, asideFolded: !1 } }, a["goto"] = function() {
        var b = arguments[0],
            c = arguments[1],
            d = arguments[2],
            e = angular.isArray(d) ? d : Array.prototype.splice.call(arguments, 2);
        h.cache = e, a.$$cache = e, f.go(b, c)
    };
    var s;
    a.jsonString2Text = function(a) {
        return s = [], $.each(angular.fromJson(a) || { "参数": "无" }, function(a, b) { s.push(a), s.push("="), s.push(b + "; ") }), s.join("")
    }, a.$$cache = h.cache, a.validForm = function(a, b) {
        a = a || "form";
        var c = b || this,
            d = c[a] || c.$$childTail[a] || c.$$childTail.$$childTail[a];
        if (d && d.$invalid) {
            throw angular.forEach(d.$error, function(a, b) { angular.forEach(a, function(a, b) { a.$setDirty(!0) }) }), d.$error
        }
    }, a.ccPassWord = function() {
        e.open({
            templateUrl: "athena/cc_password.html",
            controller: ["$scope", "$modalInstance", "$source", function(a, b, c) {
                a.op = {}, a.od = {}, a.__proto__ = q, a.$modalInstance = b, a.done = function() {
                    a.validForm(), c.$user.save({ op: "pwdreset" }, a.op, function(b) {
                        return b.msg ? void(a.od.msg = b.msg) : (angular.alert("修改成功!"), void a.cancel())
                    })
                }
            }]
        })
    }, angular.isDefined(c.settings) ? a.app.settings = c.settings : c.settings = a.app.settings, a.$watch("app.settings", function() { c.settings = a.app.settings }, !0), a.lang = { isopen: !1 }, a.langs = { en: "English", zh_CN: "简体中文" }, a.selectLang = a.langs[b.proposedLanguage()] || "简体中文", a.setLang = function(c, d) { a.selectLang = a.langs[c], b.use(c), a.lang.isopen = !a.lang.isopen }, h.navs || (h.navs = []), a.navs = h.navs, a.$rootNav = function(b) { a.navs[0] = { title: b, id: "root" } }, a.$moduleNav = function(b, c) {
        var d = o(b, c);
        a.navs = h.navs = a.navs.splice(0, 1), p(d)
    }, a.$appendNav = function(a, b) {}, a.$popNav = function(a, b) {}, a.navGo = function(a) { a.state && f.go(a.state.name, a.state.params) }, a.cancel = function() { this.$modalInstance && this.$modalInstance.dismiss("cancel") }, a.logout = function() { i.$user.logout(function(b) { a.user = null, f.go("access.signin") }) }, a.chaStation = function(a, b, c) {
        e.open({
            templateUrl: "athena/dastation/station_change.html",
            size: "md",
            resolve: {
                station: function() {
                    return b
                }
            },
            controller: ["$scope", "station", "$modalInstance", "$source", function(b, c, d, e) { b.__proto__ = a, b.station = c, b.cancel = function() { d.dismiss("cancel") }, b.done = function(a) { b.validForm() } }]
        })
    }, a.effStation = function(b, c, d, e) {
        a.confirmInvoke({ title: "失效系统 " + c.name, note: "确认要失效该系统吗?" }, function(a) {
            ({ uuid: c.uuid, state: 0 });
            i.$system.deactive({ pk: c.uuid }, function() { c.state = 0, e && b.splice(d, 1), a() }, function() { a() })
        })
    }, a.delStation = function(b, c, d) { a.confirmInvoke({ title: "您是否要删除系统:" + c.name, warn: "删除系统将会丢失此系统的全部历史数据" }, function(a) { i.$system["delete"]({ system_id: c.uuid }, function(c) { b.splice(d, 1), a() }, function() { a() }) }) }, a.activateStation = function(b, c, d, e) { a.confirmInvoke({ title: "激活系统 " + c.name, note: "确认要激活该系统吗?" }, function(f) { i.$system.active({ pk: c.uuid }, function(g) { c.state = 1, b && b.splice(d, 1), f(), e && a["goto"]("app.station.prop._basic", c, c) }, function() { angular.alert("激活失败!"), f() }) }) }, a.editStation = function(a, b) {
        e.open({
            templateUrl: "athena/dastation/station_edit.html",
            controller: ["$scope", "$source", "$modalInstance", function(c, d, e) {
                c.__proto__ = a, c.das = { uuid: b.uuid, name: b.name, desc: b.desc }, c.op = {}, d.$region.query({ currentPage: 1 }, function(a) {
                    c.projs = a.data, b.region_id && $.each(c.projs, function(a, d) {
                        return b.region_id == d.id ? (c.op._proj = d, !1) : void 0
                    })
                }), c.cancel = function() { e.dismiss("cancel") }, c.done = function() {
                    c.validForm();
                    var a = c.op._proj;
                    c.das.region_id = a.id, d.$system.put(c.das, function(d) { c.das.region_name = a.name, angular.extend(b, c.das), c.cancel() }, c.cancel)
                }
            }]
        })
    }, a.syncSystem = function(a, b, c) {
        var d = this;
        i.$system.sync({ pk: a.uuid }, function(b) { a.needsync = !1, d._show_sync_ok = !0 }, function(a) { d._show_sync_error = !0 })
    }, a.startSystem = function(b, c, d) {
        function e() {
            return i.$system.start({ pk: b.uuid }).$promise
        }
        c ? a.confirmInvoke({ title: "启动系统 " + b.name, note: "确认要启动该系统吗?" }, function(b) { e().then(function(e) { c.splice(d, 1), b(), a.alert({ title: "启动成功" }) }) }) : e().then(function(b) { a.alert({ title: "启动成功" }) })
    }, a.d_call = function(a, b, c) {
        var d = $(c.currentTarget);
        d.css({ opacity: 1 }), d.text("召唤中...").attr("disabled", !0), i.$system.post({ pk: a.uuid, type: b }, {}, function(a) { d.text("召唤成功"), g(function() { d.text("召唤").attr("disabled", !1) }, 5e3) }, function() { d.text("召唤失败").toggleClass("btn-danger"), g(function() { d.text("召唤").toggleClass("btn-danger").attr("disabled", !1) }, 5e3) })
    }, angular.alert = a.alert = function(a, b, c) {
        e.open({
            templateUrl: "athena/debris/_alert.html",
            controller: ["$scope", "$modalInstance", "$translate", function(d, e, f) {
                angular.isString(a) && (a = { title: a }), "resp_err" == a.type && (a.title = f.instant(a.title)), d.msg = a;
                var g = { resp_err: "fa-exclamation-circle text-info", info: "fa-exclamation-circle text-info", warn: "fa-exclamation-triangle" };
                d.msg.type = g[d.msg.type || "info"] || g.info, d.cancel = function() { e.dismiss("cancel"), c && c() }, d.done = function() { d.cancel(), b && b() }
            }]
        })
    }, a.confirmInvoke = function(a, b, c) { e.open({ templateUrl: "athena/debris/confirm_invoke.html", controller: ["$scope", "$modalInstance", function(c, d) { c.cancel = function() { d.dismiss("cancel") }, c.todo = a.todo || "do", c.undo = a.undo || "cancel", c.done = function() { b ? b(c.cancel) : c.cancel() }, c.msg = a }] }) }, a.showAlarmMsg = function(a, b) {
        e.open({
            templateUrl: "athena/show/alarm_msg.html",
            resolve: {
                conformMsg: ["$show", function(b) {
                    return b.alarm.getConformMsg({ ack_id: a.ack_id, system_id: a.system_id }).$promise
                }]
            },
            controller: ["$scope", "$modalInstance", "conformMsg", function(b, c, d) { b.__proto__ = q, b.$modalInstance = c, b.alarm = a, b.conformMsg = d.ret, d.ret.user_id && i.$user.get({ pk: d.ret.user_id }, function(a) { b.conformMsg.username = a.ret.username }) }]
        })
    }, a.conformAlarm = function(a, b, c, d, f) { e.open({ templateUrl: "athena/show/alarm_conform.html", controller: ["$scope", "$modalInstance", "$show", function(d, e, g) { d.__proto__ = q, d.$modalInstance = e, d.alarm = b, d.od = { message: "" }, d.done = function() { d.validForm(), g.alarm.conform(angular.extend({ alarm_id: b.id, system_id: b.system_id }, d.od), null, function(e) { d.cancel(), b.active = -1, b.ack_id = e.ret, b.close_time = new Date, a.total--, "a" == f && a.data.splice(c, 1) }, function() { d.cancel() }) } }] }) }, a.acceptSMS = function(a) { i.$user.save({ op: "notice" }, { sms_notice: a.sms_notice ? 0 : 1 }, function() { a.sms_notice = !a.sms_notice }) }, a.acceptEmail = function(a) { i.$user.save({ op: "notice" }, { mail_notice: a.mail_notice ? 0 : 1 }, function() { a.mail_notice = !a.mail_notice }) }
}]).controller("access_signin", ["$scope", "$state", "$timeout", "$localStorage", "$sys", "$compile", "$source", "$modalStack", "$rootScope", "$modalStack", function(a, b, c, d, e, f, g, h, i, h) {
    h.dismissAll(), a.op = { t: 1, b: !1 }, g.$common.get({ op: "islogined" }, function(c) { c.ret ? b.go("app") : g.$common.get({ op: "logintimes" }, function(b) { a.op.need_idenfity = !!b.ret }) }, function() { console.log("log 404") }), a.user = {}, a.user.account = d.account, a.login = function() {
        var e = a.user;
        if (!e.account) throw angular.alert("请输入公司名称"), "";
        if (!e.username) throw angular.alert("请输用户名"), "";
        if (!e.password) throw angular.alert("请输入密码"), "";
        a.validForm(), a.op.b = !0, d.account = a.user.account, g.$user.login(a.user, function(c) { c.ret ? b.go("app.m_region") : (a.op.b = !1, a.resp = c) }, function(d) {
            return "login_yet" == d.err ? void c(function() { b.go("app.m_region"), h.dismissAll() }, 2e3) : (d.img && (a.op.need_idenfity = !0, $("#login_identify").attr("src", "data:image/jpg;base64," + d.img)), a.op.t++, void(a.op.b = !1))
        })
    }
}]).controller("access_signup", ["$scope", "$state", "$location", "$source", "$localStorage", "$interval", function(a, b, c, d, e, f) {
    a.comp = {}, a.op = {}, a.time = 0;
    var g = c.$$search.v;
    g ? d.$common.verifyUuid({ uuid: g }, function(c) { c.ret ? a.op.step = "step3" : b.go("access.signin") }) : a.op.step = "step1", a.signup = function(b) {
        a.validForm("form1"), a.showMask = !0;
        var c = b.currentTarget;
        c.disabled = !0, d.$account.save(a.comp, function(b) { a.op.step = "step2", a.showMask = !1 }, function() { a.showMask = !1, c.disabled = !1, a.op.t++ })
    }, a.reSendEmail = function() { a.validForm("form1"), d.$account.save(a.comp, function(a) { angular.alert("邮件重发成功") }) }, a.openEmail = function() { window.open("//mail." + a.comp.admin.email.replace(/.*@(.+)/, "$1")) }, a.create = function() { a.confirm_password != a.comp.admin.password && angular.alert("两次密码输入不一致"), a.validForm("form2"), a.showMask = !0, d.$account.save({ pk: "admin", uuid: g }, a.comp.admin, function(c) { a.showMask = !1, e.comp_name = a.comp.name, a.alert({ type: "info", title: "注册成功!" }, function() { a.showMask = !1, b.go("access.signin") }) }) }
}]).controller("access_fogpas", ["$scope", "$state", "$sessionStorage", "$source", "$interval", "$location", "$timeout", function(a, b, c, d, e, f, g) {
    a.od = {}, a.account = { op: "admin", account: null, identify: null }, a.admin = {}, a.t = 123111;
    var h = f.$$search.v;
    h ? d.$common.verifyUuid({ uuid: h }, function(c) { c.ret ? a.od.step = 3 : (a.od.step = 4, g(function() { b.go("access.signin") }, 5e3)) }) : a.od.step = 1, a.setp1 = function(b) { a.validForm("step1"), a.showMask = !0, b.currentTarget.disabled = !0, d.$common.get(a.account, function(c) { a.showMask = !1, a.od.step = 2, b.currentTarget.disabled = !1 }, function(c) { a.showMask = !1, a.t++, b.currentTarget.disabled = !1 }) }, a.cc_done = function() {
        a.validForm("form2"), a.admin.code = h, a.showMask = !0, d.$common.save({ op: "admin" }, a.admin, function(c) {
            a.showMask = !1, a.alert({ title: "修改成功", "do": "" }, function() { b.go("access.signin") }),
                function() { a.showMask = !1 }
        })
    }
}]).controller("verifyemail", ["$scope", "$state", "$source", "$timeout", "$location", function(a, b, c, d, e) {
    a.op = {};
    var f = e.$$search.code;
    f && c.$common.get(angular.extend({ op: "verifyemail" }, e.$$search), function(b) { b.err ? (a.op.verifyemail = 2, d(function() {}, 2e3)) : (a.op.verifyemail = 1, d(function(a) {}, 5e3)) })
}]).controller("service", ["$scope", "$modal", function(a, b) {
    var c = a;
    a.c = function() { b.open({ templateUrl: "athena/contactus.html" }) }, a.u = function() { b.open({ templateUrl: "athena/useclauses.html" }) }, a.feedback = function() { b.open({ templateUrl: "athena/feedback.html", controller: ["$scope", "$modalInstance", function(a, b) { a.$modalInstance = b, a.__proto__ = c }] }) }, a.support = function() {}
}]), angular.module("app.model.device", []).controller("devmodel", ["$scope", "$compile", "$state", "$modal", "$log", "$http", "$timeout", "$source", function(a, b, c, d, e, f, g, h) {
    a.$rootNav("管理"), a.$moduleNav("设备模型", c);
    var i, j, k, l = $(window);
    a.$on("$destroy", function() { l.off("scroll") }), l.scroll(function() { g.cancel(i), i = g(function() { j = $(window).scrollTop(), k = $(window).innerHeight() }, 200) }), a.showMask = !0, h.$deviceModel.get(function(b) { a.deviceModels = b.ret, a.showMask = !1 }, function() { a.showMask = !1 }), a.loadPoints = function(a, b, c, d) { a.points || h.$dmPoint.get({ device_model: d.uuid }, function(b) { a.points = b.ret }) }, a.add_edit_t = function(a, b) { d.open({ templateUrl: "athena/template/temp.html", controller: ["$scope", "$modalInstance", "$source", "$filter", function(c, d, e, f) { c.__proto__ = a, c.$modalInstance = d, c.isAdd = !b, b || e.$driver.get({ type: "device" }, function(a) { c.drivers = f("filter")(a.ret, { category: "DEVICE" }), c.T.driver_id = c.drivers[0].driver_id }), c.T = b ? angular.copy(b) : {}, c.done = function(a) { c.validForm(), b ? e.$deviceModel.put({ uuid: b.uuid, name: c.T.name, desc: c.T.desc }, function(a) { b.name = c.T.name, b.desc = c.T.desc, c.cancel() }) : e.$deviceModel.save(c.T, function(a) { c.T.uuid = a.ret, c.deviceModels.push(c.T), c.cancel() }) } }] }) }, a.upload_t = function() {
        d.open({
            templateUrl: "athena/template/temp_upload.html",
            controller: temp_upload,
            size: "m",
            resolve: {
                $$scope: function() {
                    return a
                }
            }
        })
    }, a.export_t = function(b) {
        d.open({
            templateUrl: "../views/template/temp_export.html",
            controller: m,
            size: "m",
            resolve: {
                $$scope: function() {
                    return a
                },
                T: function() {
                    return b
                }
            }
        })
    };
    var m = function(a, b, c, d) { a.cancel = b.closePopupWin(c), a.T = d };
    m.$inject = ["$scope", "$$scope", "$modalInstance", "T"], a.delTemp = function(b, c) {
        var d = { title: "删除模版: " + c.name, note: "确认要删除该设备模型吗?" };
        c.ref && (d.warn = "该模版被" + c.ref + "个设备使用! 不可删除!"), a.confirmInvoke(d, function(d) { c.ref || h.$deviceModel["delete"]({ uuid: c.uuid }, function(c) { a.deviceModels.splice(b, 1), d() }, d) })
    }, a.delPoint = function(b, c, d, e) { a.confirmInvoke({ title: "删除点: " + d.name, note: "确认要删除该点吗?" }, function(a) { h.$dmPoint["delete"]({ id: d.id, device_model: e }, function(d) { b.points.splice(c, 1), a() }, a) }) }, a.addOrEditPoint = function(a, b, c) {
        d.open({
            templateUrl: "athena/template/file.html",
            controller: ["$scope", "$modalInstance", "$sys", function(d, e, f) {
                if (d.__proto__ = a, d.$modalInstance = e, d.point = {}, d.isAdd = !!b, b) d.point = angular.copy(b), d.point.params = angular.fromJson(d.point.params);
                else {
                    var g = a.dm,
                        i = f.point[g.driver_id],
                        j = f.point.entity,
                        k = angular.copy(i.entity);
                    d.point = angular.extend({}, j, k)
                }
                d.done = function() { d.validForm(), d.point.device_model = a.dm.uuid, b ? h.$dmPoint.put(d.point, function(a) { d.points[c] = angular.copy(d.point), d.cancel() }) : h.$dmPoint.save(d.point, function(a) { d.point.id = a.ret, d.points.push(d.point), d.cancel() }) }
            }]
        })
    }, a.clone_f = function(a) {}
}]), angular.module("app.model.system", []).controller("sysmodel", ["$scope", "$state", "$modal", "$source", "$utils", function(a, b, c, d, e) {
    a.$moduleNav("系统模型", b);
    var f, g = a;
    a.showMask = !0, d.$sysModel.get(a.$sys.fristPage, function(b) { a.page = f = { data: b.ret }, a.showMask = !1 }, function() { a.showMask = !1 }), a.updateSysModel = function(a) {
        return d.$sysModel.put(null, a).$promise
    }, a.createSM = function() {
        c.open({
            templateUrl: "athena/sysmodel/add_sysmodel.html",
            controller: ["$scope", "$modalInstance", function(a, b) {
                a.__proto__ = g, a.$modalInstance = b, a.sm = { mode: "1", comm_type: "1" }, a.isAdd = !0, a.done = function() {
                    a.validForm(), d.$sysModel.save(a.sm, function(b) {
                        var c = { uuid: b.ret, create_time: new Date, device_count: 0, profile_count: 1 };
                        f.data.push(angular.extend(c, a.sm)), f.total++, a.cancel()
                    })
                }
            }]
        })
    }, a.deleteSM = function(b, c) { a.confirmInvoke({ title: "删除系统模型: " + c.name, note: "确认要删除该系统模型吗?" }, function(a) { d.$sysModel["delete"]({ uuid: c.uuid }, function(c) { f.data.splice(b, 1), f.total--, a() }, a) }) }, a.updateSM = function(a, b, e) {
        c.open({
            templateUrl: "athena/sysmodel/add_sysmodel.html",
            controller: ["$scope", "$modalInstance", function(b, c) {
                b.__proto__ = a, b.$modalInstance = c, b.sm = angular.copy(e), b.done = function() {
                    b.validForm();
                    var a = b.sm.name,
                        c = b.sm.mode,
                        f = b.sm.desc,
                        g = b.sm.comm_type,
                        h = { uuid: e.uuid, name: a, desc: f, comm_type: g, mode: c };
                    d.$sysModel.put(h, function(d) { e.name = a, e.desc = f, e.mode = c, e.comm_type = g, b.cancel() })
                }
            }]
        })
    }
}]).controller("sysmodelProp", ["$scope", "$source", "$q", function(a, b, c) {
    var d = a.$$cache[0];
    try { d.gateway_default = angular.fromJson(d.gateway_default || {}) } catch (e) { angular.alert("GateWay Default 严重错误!"), console.error("  SystemModel  gateway_default 字段 不合法!!") }
    a.sysmodel = d, a.title = d.name, a.tabs = [{ title: "tab.t16", icon: "icon icon-info", state: "app.sysmodel_p.basic" }], a.tabs.push({ title: "tab.t12", icon: "icon icon-wrench", state: "app.sysmodel_p.sysprofile" }), 1 == a.sysmodel.mode && a.tabs.push({ title: "tab.t10", icon: "icon icon-screen-desktop", state: "app.sysmodel_p.sysdevice" }), a.tabs = a.tabs.concat([{ title: "tab.t11", icon: "icon icon-tag", state: "app.sysmodel_p.systag" }, { title: "tab.t13", icon: "icon icon-rocket", state: "app.sysmodel_p.trigger" }]), a.user.viewPanel && a.tabs.push({ title: "信息板", icon: "icon icon-flag", state: "app.sysmodel_p.panel" }), 1 == a.sysmodel.mode && 2 == a.sysmodel.comm_type && a.tabs.push({ title: "tab.t15", icon: "glyphicon glyphicon-random", state: "app.sysmodel_p.gateway" }), a.odp = {}, a.loadProfilePromise = b.$sysProfile.get({ system_model: a.sysmodel.uuid }).$promise, a.loadProfilePromise.then(function(b) { a.profiles = b.ret, a.hasProfile = !!b.ret.length, a.odp.puuid = b.ret[0] && b.ret[0].uuid }), a.isModelState = !0;
    var f;
    a.loadSysDev = function() {
        return f || (f = b.$sysDevice.get({ system_model: a.sysmodel.uuid }).$promise, f.then(function(b) { a.sysdevices = b.ret })), f
    };
    var g;
    a.loadDevModels = function() {
        return g || (g = b.$deviceModel.get().$promise, g.then(function(b) { a.devmodels = b.ret })), g
    }
}]).controller("sysmodel_basic", ["$scope", "$source", "$state", function(a, b, c) { a.$popNav(a.sysmodel.name + "(信息)", c) }]).controller("sysmodel_profile", ["$scope", "$source", "$modal", "$filter", "$state", function(a, b, c, d, e) {
    a.$popNav(a.sysmodel.name + "(Profile)", e);
    var f = a.sysmodel,
        g = a;
    a.addSysProfile = function() { c.open({ templateUrl: "athena/sysmodel/add_sysprofile.html", controller: ["$scope", "$modalInstance", function(a, c) { a.$modalInstance = c, a.__proto__ = g, a.P = {}, a.isAdd = !0, a.done = function() { a.validForm(), a.P.system_model = f.uuid, b.$sysProfile.save(a.P, function(b) { a.P.uuid = b.ret, a.profiles.push(a.P), a.__proto__.$parent.hasProfile = !0, a.cancel() }) } }] }) }, a.updateSysProfile = function(a) {
        return b.$sysProfile.put(a).$promise
    }, a.deleteSysProfile = function(c, d, e) { a.confirmInvoke({ title: "删除配置项: " + e.name, note: "确认要删除该配置项吗?" }, function(c) { b.$sysProfile["delete"]({ uuid: e.uuid }, function() { a.profiles.splice(d, 1), a.odp.puuid == e.uuid && (a.odp.puuid = a.profiles[0] && a.profiles[0].uuid), a.$parent.hasProfile = !!a.profiles.length, c() }, c) }) }
}]).controller("sysmodel_device", ["$scope", "$sessionStorage", "$source", "$modal", "$sys", "$state", function(a, b, c, d, e, f) {
    console.log("sysmodel_device");
    var g = a.sysmodel;
    a.isG = 2 == g.comm_type;
    var h = a;
    a.showMask = !0, a.loadSysDev().then(function(a) {}), a.devModelKV = {}, a.loadDevModels().then(function() { a.showMask = !1, $.each(a.devmodels, function(b, c, d) { a.devModelKV[c.uuid] = c }) }, function() { a.showMask = !1 }), a.addOrEditDevice = function(b, f, g) {
        d.open({
            templateUrl: "athena/sysmodel/add_sysdevice.html",
            resolve: {
                data: function() {
                    return a.loadDevModels()
                }
            },
            controller: ["$scope", "$modalInstance", "data", function(a, d, i) {
                if (a.$modalInstance = d, a.__proto__ = h, a.isAdd = !g, a.devModels = a.devmodels, a.filterChannel = function(b, c) {
                        if (a._$channel = h.sysmodel.gateway_default[b], c) {
                            var d;
                            d = "ETHERNET" == b ? "LAN_1" : a._$channel ? Object.keys(a._$channel)[0] : null, a.D.network.params = { channel: d }
                        }
                    }, a.isAdd) {
                    if (a.devModel = a.devModelKV[Object.keys(a.devModelKV)[0]], !a.devModel) throw a.alert({ type: "info", title: "请先创建设备模型!" }), "_Error: No Device Model !";
                    a.D = angular.extend({ device_model: a.devModel.uuid }, e.device.entity, angular.copy(e.device[a.devModel.driver_id].entity)), 1 == a.sysmodel.mode && 2 == a.sysmodel.comm_type && (a.D.network = { type: "RS232" })
                } else g.network = angular.fromJson(g.network || {}), g.params = angular.fromJson(g.params || {}), a.D = angular.copy(g), a.devModel = a.devModelKV[a.D.device_model];
                a.$watch("D.device_model", function(b, c) {
                    var d, f;
                    d = a.devModelKV[b].driver_id, f = a.devModelKV[c].driver_id, d != f && (angular.extend(a.D, e.device[d].entity), a.devModel = a.devModelKV[b])
                }), a.done = function(d) {
                    a.validForm(), a.isG || delete a.D.network;
                    var e = angular.copy(a.D);
                    e.system_model = a.sysmodel.uuid, e.params = angular.toJson(e.params), e.network = angular.toJson(e.network), a.isAdd ? c.$sysDevice.save(e, function(b) { e.id = b.ret, a.sysdevices.push(e), a.cancel() }) : c.$sysDevice.put(e, function(c) { b[f] = e, a.cancel() })
                }
            }]
        })
    }, a.deleteSysD = function(b, d, e) { a.confirmInvoke({ title: "删除系统设备: " + e.name, note: "确认要删除该设备吗?" }, function(b) { c.$sysDevice["delete"]({ system_model: g.uuid, id: e.id }, function() { a.sysdevices.splice(d, 1), b() }, b) }) }
}]).controller("sysmodel_tag", ["$scope", "$source", "$modal", "$q", "$utils", "$sys", "$state", "$timeout", "$q", function(a, b, c, d, e, f, g, h, d) {
    function i(c) {
        var d;
        c.op = {};
        var e = a.loadSysDev();
        return c.loadPoint = function(e, f) {
            if (e && e.device_model != d) {
                c.showMask = !0, d = e.device_model;
                var g;
                return g = b.$dmPoint.get({ device_model: d }).$promise, g.then(function(a) {
                    if (c.points = a.ret, f) {
                        var b = a.ret[0];
                        c.op.point = b && b.id + "&" + b.name, c.T.name = b && b.name
                    }
                    c.showMask = !1
                }, function() { a.showMask = !1 }), g
            }
        }, c.addConnect = function(a) { a.connect = c.op.dev.id + "." + c.op.point.replace(/(.+)&(.+)/, "$1") }, e
    }
    a.$popNav(a.sysmodel.name + "(Tags)", g);
    var j = a.sysmodel,
        k = a;
    k.isManageMode = j.mode == f.manageMode;
    var l;
    a.splictC = function(a, b) { l = a.connect.split("."), a.dev_id = l[0], a.point_id = l[0] };
    var m, n;
    a.getDevName = function(b, c) { b.connect && (m = b.connect.replace(/(\d+).(\d+)/, "$1"), n = a.devicesKV[m], c.dev_name = n && n.name) }, a.loadSysDev().then(function() { a.devicesKV = {}, a.sysdevices.forEach(function(b, c) { a.devicesKV[b.id] = b }) }), a.showMask = !0, a.loadSysTag = function(c) {
        if (c) {
            var e = b.$sysLogTag.get({ profile: c }).$promise;
            d.all([e, a.loadSysDev()]).then(function(b) { a.systags = b[0].ret, a.showMask = !1 }, function() { a.showMask = !1 })
        } else b.$sysTag.get({ system_model: j.uuid }, function(b) { a.systags = b.ret, a.showMask = !1 }, function() { a.showMask = !1 })
    }, a.loadProfilePromise.then(function() { a.loadSysTag(a.odp.puuid) }), a.addTag = function() {
        return a.profiles.length ? void c.open({
            templateUrl: "athena/sysmodel/add_systag.html",
            controller: ["$scope", "$modalInstance", function(a, c) {
                k.isManageMode && i(a), a.$modalInstance = c, a.__proto__ = k, a.isAdd = !0, a.T = { type: void 0 }, a.L = { deviation: 0, scale: 1 }, a.copyName = function() { a.T.name = a.op.point.replace(/(.+)&(.+)/, "$2") }, a.done = function() {
                    a.validForm("form_tag"), a.validForm("form_log"), a.T.system_model = j.uuid, a.addConnect && a.addConnect(a.T), b.$sysTag.save(a.T, function(c) {
                        function d() {
                            var b;
                            b = k.hasProfile ? angular.extend(a.T, a.L) : angular.extend(a.T, { id: c.ret }), a.systags.push(b), a.cancel()
                        }
                        k.hasProfile ? (a.L.id = c.ret, a.L.profile = k.odp.puuid, b.$sysLogTag.save(a.L, d)) : d()
                    })
                }
            }]
        }) : void angular.alert("请先创建系统配置!")
    }, a.updateTag = function(a, d, f) {
        c.open({
            templateUrl: "athena/sysmodel/add_systag.html",
            controller: ["$scope", "$modalInstance", function(a, c) {
                var g, h, j, l;
                a.$modalInstance = c, a.__proto__ = k, a.T = g = angular.copy(d), a.true_conn = f.true_conn, k.isManageMode && (h = g.connect.split("."), j = h[0], l = h[1], i(a).then(function() {
                    $.each(a.sysdevices, function(b, c) {
                        return c.id == j ? (a.op.dev = c, !1) : !0
                    }), a.op.dev && a.loadPoint(a.op.dev).then(function() {
                        $.each(a.points, function(b, c) {
                            return l == c.id ? (a.op.point = c.id + "&" + c.name, !1) : !0
                        })
                    })
                })), a.done = function() {
                    a.validForm("form_tag");
                    var c = e.copyProp(g, "system_model", "id", "name", "type", "desc");
                    a.addConnect && a.addConnect(c), b.$sysTag.put(c, function(b) { k.isManageMode && (f.$parent.true_conn = !0, f.$parent.dev_name = a.devicesKV[a.op.dev.id].name), angular.extend(d, c), a.cancel() })
                }
            }]
        })
    }, a.deleteTag = function(c, d) { a.confirmInvoke({ title: "删除模型变量 : " + d.name + " ?", warn: "删除变量将会丢失此变量的全部历史数据!" }, function(e) { b.$sysTag["delete"]({ system_model: j.uuid, id: d.id }, function(b) { a.systags.splice(c, 1), e() }, e) }) }, a.add_update_Log = function(a, d) {
        return k.hasProfile ? void c.open({
            templateUrl: "athena/sysmodel/add_log_tag.html",
            controller: ["$scope", "$modalInstance", function(a, c) {
                var e, f, g;
                console.log(d), a.hasLog = f = d.profile, a.$modalInstance = c, a.__proto__ = k, a.L = e = angular.copy(d), a.T = angular.copy(d), f ? a.L.log_cycle += "" : a.L.log_cycle = "300", a.done = function() { a.validForm("form_log"), a.L.id = d.id, g = { id: e.id, tp_desc: e.tp_desc, unit: e.unit, scale: e.scale, deviation: e.deviation, save_log: e.save_log, log_cycle: e.log_cycle, log_type: e.log_type }, f ? (g.profile = e.profile, b.$sysLogTag.put(g, function() { angular.extend(d, g) })) : (g.profile = k.odp.puuid, b.$sysLogTag.save(g, function() { angular.extend(d, g) })), a.cancel() }
            }]
        }) : (angular.alert("请先创建 系统配置!"), void g.go("app.model.sysprofile"))
    }
}]).controller("sysmodel_prof_trigger", ["$scope", "$source", "$modal", "$state", "$q", "$sys", "$utils", function(a, b, c, d, e, f, g) {
    function h(a) { a.conditions = angular.fromJson(a.conditions), a.params = angular.fromJson(a.params) }
    a.$popNav(a.sysmodel.name + "(触发器)", d);
    var i = a.sysmodel,
        j = a;
    a["byte"] = 32;
    var k = b.$sysTag.get({ system_model: i.uuid }).$promise;
    k.then(function(b) { a.tags_arr = b.ret, a.tags_nv = {}, a.tags_arr.forEach(function(b, c, d) { a.tags_nv[b.name] = b }) }), a.page = {}, a.loadPageData = function(c) {
        var d = a.odp.puuid;
        if (d) {
            var g = { profile: d };
            g.currentPage = c, g.itemsPerPage = f.itemsPerPage, a.showMask = !0, e.all([b.$sysProfTrigger.get(g).$promise, k]).then(function(b) {
                var d = b[0];
                d.data.forEach(function(b) {
                    h(b), angular.isArray(b.conditions) && b.conditions.forEach(function(b) {
                        var c = b.exp.left,
                            d = b.exp.right;
                        "PV" != c.fn || a.tags_nv[c.args] || (c.args = null), "PV" != d.fn || a.tags_nv[d.args] || (d.args = null)
                    })
                }), a.page.data = d.data, a.page.currentPage = c, a.page.total = d.total, a.showMask = !1
            }, function() { a.showMask = !1 })
        }
    }, a.loadProfilePromise.then(function() { a.loadPageData(1) }), a.deleteTrigger = function(c, d) { a.confirmInvoke({ title: "删除触发器: " + d.name, note: "确认要删除该触发器吗?" }, function(e) { b.$sysProfTrigger["delete"]({ profile: d.profile, id: d.id }, function(b) { a.page.data.splice(c, 1), e() }, e) }) }, a.c_u_Trigger = function(b, e) {
        return a.profiles.length ? void c.open({
            templateUrl: "athena/sysmodel/add_proftrigger.html",
            size: "lg",
            controller: ["$scope", "$modalInstance", "$source", "$sys", "$webWorker", function(a, c, d, f, g) {
                var i, k;
                a.isAdd = k = "create" == b, a.__proto__ = j, a.$modalInstance = c, k ? a.T = i = { profile: j.odp.puuid, conditions: [angular.copy(f.trigger_c)], params: {} } : a.T = i = angular.copy(e), a.done = function() {
                    var c, e, f = angular.copy(a.T),
                        g = {};
                    angular.forEach(f.conditions, function(a, b) { c = a.exp.left, e = a.exp.right, "PV" == c.fn && (g[c.args] = !0), "PV" == e.fn && (g[e.args] = !0) }), f.conditions = angular.toJson(f.conditions), f.params.tags = Object.keys(g), f.params = angular.toJson(f.params), k ? d.$sysProfTrigger.save(f, function(b) { h(f), f.id = b.ret, a.page.data.unshift(f), a.cancel() }) : d.$sysProfTrigger.put(f, function(c) { h(f), a.page.data[b] = f, a.cancel() })
                }, a.appendVerb = function() {
                    var a = i.conditions.length ? f.trigger.verb_default : null;
                    i.conditions.push(angular.extend({ verb: a }, angular.copy(f.trigger_c)))
                }, a.delVerb = function(a) { i.conditions.splice(a, 1), 0 == a && (i.conditions[0].verb = null) }
            }]
        }) : (angular.alert("请先创建 系统配置!"), void d.go("app.model.sysprofile"))
    }, a.conditions = g.triggerConditions;
    var l = /^[0-9a-fA-F]$/;
    a.cc = function(a) {
        if (a.T.params) {
            var b = a["byte"],
                c = a.T.params,
                d = c.length,
                e = b / 4;
            if (d > e) return void(a.T.params = c.substring(0, e).toUpperCase());
            var f = c.charAt(d - 1);
            l.test(f) ? a.T.params = c.toUpperCase() : a.T.params = c.substring(0, d - 1).toUpperCase()
        }
    }
}]).controller("sysmodel_message", ["$scope", "$source", "$modal", "$sys", "$state", function(a, b, c, d, e) {
    a.$popNav(a.sysmodel.name + "(通知)", e);
    var f = (a.sysmodel, a),
        g = {};
    a.loadMessages = function(c) { c && b.$message.get({ profile_id: c }, function(b) { a.messages = b.ret }) }, a.loadProfilePromise.then(function() { a.loadMessages(a.odp.puuid) }), a.createMessage = function(d, e) {
        return a.profiles.length ? void c.open({
            templateUrl: "athena/sysmodel/add_message.html",
            resolve: {},
            controller: ["$scope", "$modalInstance", "$sys", function(a, c, h) {
                function i() { a.isAdd && (a.M.trigger_id = a.triggers[0] && a.triggers[0].id) }
                a.__proto__ = f, a.$modalInstance = c, a.M = angular.copy(e || h.message.entity), a.isAdd = !(d || 0 == d), a.op = {};
                var j = a.odp.puuid,
                    k = g[j];
                k ? (a.triggers = k, i()) : b.$sysProfTrigger.get({ profile: j }, function(b) {
                    var c = b.ret;
                    g[j] = c, a.triggers = c, i()
                }), a.done = function() { a.validForm(), a.isAdd ? (a.M.profile = j, b.$message.save(a.M, function(b) { a.M.message_id = b.ret, a.messages.push(a.M), a.cancel() })) : b.$message.put(a.M, function() { a.messages[d] = a.M, a.cancel() }) }
            }]
        }) : void angular.alert("请先创建 系统配置!")
    }, a.deleteMessage = function(c, d) { a.confirmInvoke({ title: "删除通知 " + d.name, note: "确认要删除通知吗?" }, function(e) { b.$message["delete"]({ profile_id: d.profile, message_id: d.message_id }, function() { a.messages.splice(c, 1), e() }, e) }) }
}]).controller("sysmodel_panel", ["$scope", "$source", "$modal", "$sys", "$state", "$http", "$filter", function(a, b, c, d, e, f, g) {
    var h = a;
    a.project = { name: null, description: null, createTime: null, modifyTime: null, systemModelUuid: null, accountId: null }, a.initPanel = function() {
        var b = "/v5/json/syalias/project.search?smid=" + a.sysmodel.uuid;
        f.get(b).success(function(a, b, c, d) {
            return a.err ? void console.log("Search Project Error") : void(h.project = a.ret[0])
        }).error(function(a, b, c, d) { console.log(a) })
    }, a.initPanel(), a.createProject = function() {
        c.open({
            templateUrl: "athena/sysmodel/add_syspanel.html",
            size: "lg",
            controller: ["$scope", "$modalInstance", "$source", "$sys", "$webWorker", "$http", function(a, b, c, d, e, f) {
                a.project = { name: null, description: null, createTime: null, modifyTime: null, systemModelUuid: null, accountId: null }, a.done = function(b) {
                    a.validForm();
                    var c = (new Date).getTime();
                    a.project.createTime = c, a.project.modifyTime = c, a.project.systemModelUuid = a.sysmodel.uuid, a.project.accountId = a.user.account_id, console.log(a.project);
                    var d = "/v5/json/syalias/project.search?smid=" + a.project.systemModelUuid,
                        e = "/v5/json/syalias/project.create";
                    f.get(d).success(function(b, c, d, g) {
                        return b.err ? void console.log("Search Project Error") : b.ret ? (h.project = b.ret, angular.alert({ title: "本模板已经存在视图，不能再次创建" }), void a.cancel()) : void f.put(e, a.project).success(function(b, c, d, e) { b.err ? (console.log("项目创建失败 1"), console.log(b.err)) : (console.log("项目创建成功"), h.initPanel(), a.cancel()) }).error(function(a, b, c, d) { console.log("项目创建失败 2") })
                    }).error(function(a, b, c, d) { console.log(a) })
                }, a.$modalInstance = b, a.__proto__ = h
            }]
        })
    }, a.modifyProjectMessage = function() {
        c.open({
            templateUrl: "athena/sysmodel/add_syspanel.html",
            size: "lg",
            controller: ["$scope", "$modalInstance", "$source", "$sys", "$webWorker", "$http", function(a, b, c, d, e, f) {
                a.project = angular.copy(h.project), a.done = function(b) {
                    var c = { name: a.project.name, description: a.project.description, modifyTime: (new Date).getTime(), systemModelUuid: a.project.systemModelUuid },
                        d = "/v5/json/syalias/project.update";
                    f.put(d, c).success(function(b, c, d, e) { b.err ? (console.log("项目修改失败 1"), console.log(b.err)) : (console.log("项目修改成功"), h.project.name = a.project.name, h.project.description = a.project.description, h.project.modifyTime = a.project.modifyTime, a.cancel()) }).error(function(a, b, c, d) { console.log("项目修改失败 2") }), a.cancel()
                }, a.$modalInstance = b, a.__proto__ = h
            }]
        })
    }, a.deleteProject = function() {
        a.confirmInvoke({ title: "删除信息板", note: "确认要删除该信息板吗?" }, function(b) {
            var c = "/v5/json/syalias/project.del",
                d = { systemModelUuid: a.project.systemModelUuid };
            f.put(c, d).success(function(c, d, e, f) { c.err ? (console.log("项目修改失败 1"), console.log(c.err)) : (a.project = { name: null, description: null, createTime: null, modifyTime: null, systemModelUuid: null, accountId: null }, a.initPanel(), b()) }).error(function(a, b, c, d) { console.log("项目修改失败 2") })
        })
    }, a.openDyaliasSystem = function() {
        b.$user.get({ op: "getack" }, function(b) {
            var c = b.ret,
                d = a.sysmodel.name,
                e = a.project.uuid,
                f = "/syalias/trunk/dyalias.html?ack=" + c + "&uuid=" + e + "&systemModelName=" + d;
            window.open(f)
        })
    }
}]).controller("sysmodel_gateway", ["$scope", "$modal", "$source", "$state", function(a, b, c, d) {
    console.log("sysmodel_gateway"), a.$popNav(a.sysmodel.name + "(网关)", d);
    var e = { distance: 100, baud_rate: 1200 },
        f = a;
    f.GateWay = angular.copy(a.sysmodel.gateway_default || {}), f.needUpdate = !1, f.enbaleGPS = !!f.GateWay.GPS, f.canAddPort = 0, f.$watch("GateWay", function(a, b) {
        var a = 0;
        angular.forEach(f.GateWay, function(b, c, d) { "GPS" != c && (f.canAddPort = 7 == a++) })
    }, !0), f.gpsChange = function() { f.enbaleGPS ? f.GateWay.GPS = e : (e = f.GateWay.GPS, delete f.GateWay.GPS), f.needUpdate = !0 };
    var g = f.$sys.gateway.types;
    f.c_u_Gateway = function(a, c, d) {
        b.open({
            templateUrl: "athena/sysmodel/add_gateway.html",
            controller: ["$scope", "$modalInstance", function(b, e) {
                b.__proto__ = f, b.$modalInstance = e, b.isAdd = !d, b.G = { t: c }, b.D = angular.copy(d || f.$sys.gateway.entity), b.filterType = function() {
                    if (b.isAdd) {
                        var a = {};
                        angular.forEach(g, function(b, c, d) { f.GateWay[b] && f.GateWay[b][c] || (a[c] = b) }), b.G.t = Object.keys(a)[0], b._$types = a
                    }
                }, b.done = function() { b.validForm(), c = c || b.G.t, a = a || b._$types[c], (b.GateWay[a] || (b.GateWay[a] = {}))[c] = b.D, f.needUpdate = !0, b.cancel() }
            }]
        })
    }, f.cc = function() { f.needUpdate = !0 }, f.deleteGateway = function(b, c, d) { a.confirmInvoke({ title: "删除串口: " + c, note: "确认要删除该串口吗?" }, function(a) { delete f.GateWay[b][c], f.needUpdate = !0, a() }) }, f.saveGateWay = function() { c.$sysModel.put({ uuid: f.sysmodel.uuid, gateway_default: angular.toJson(f.GateWay) }, function(a) { f.sysmodel.gateway_default = angular.copy(f.GateWay), f.haveSave = !0, f.needUpdate = !1 }) }
}]), angular.module("app.project", []).controller("manage_projs", ["$scope", "$source", "$state", "$utils", "$filter", "$timeout", "$sys", "$localStorage", "$modal", function(a, b, c, d, e, f, g, h, i) {
    function j(a) { b.$region.save({ pk: "sum", state: 1 }, a, function(a) { a.ret.forEach(function(a, b) { $("#act_" + a.region_id).text(a.count) }) }) }

    function k(a) { b.$region.save({ pk: "sum", state: 0 }, a, function(a) { a.ret.forEach(function(a, b) { $("#unact_" + a.region_id).text(a.count) }) }) }
    var l = a;
    a.pop = { templateUrl: "athena/debris/_edit_field.html" }, a.isShowModul = c.$current.data && c.$current.data.isShowModul, a._$nextState = a.isShowModul ? "app.s_region_system" : "app.m_region_prop.system", a.$moduleNav("全部区域", c);
    var m = g.itemsPerPage;
    a.page = {}, a.loadPageData = function(c) {
        a.showMask = !0;
        var d = { itemsPerPage: m, currentPage: c, name: a.f_projname };
        b.$region.query(d, function(b) { a.showMask = !1, a.page = b, a.page.currentPage = c }, function() { a.showMask = !1 })
    };
    var n = [];
    a.collectRegionId = function(b, c) { n.push(b.id), c && (j(n), !a.isShowModul && k(n)) }, a.loadPageData(1), a.delProject = function(c, d) { a.confirmInvoke({ title: "删除区域: " + c.name, note: "确认要删除该区域吗?" }, function(e) { b.$region["delete"]({ pk: c.id }, function(b) { a.page.data.splice(d, 1), e() }, e) }) }, a.addProj = function() { i.open({ templateUrl: "athena/region/project_add_temp.html", controller: ["$scope", "$modalInstance", function(a, c) { a.__proto__ = l, a.$modalInstance = c, a.proj = {}, a.done = function(c) { console.log(c), a.validForm(), a.showMask = !0, b.$region.save(a.proj, function(b) { a.showMask = !1, a.proj.id = b.ret, a.page.data.unshift(angular.copy(a.proj)), a.cancel() }, function() { a.showMask = !1 }) } }] }) }, a.updateRegion = function(a) {
        return b.$region.put({ pk: a.id }, a).$promise
    }
}]).controller("proj_prop", ["$scope", "$state", "$stateParams", function(a, b) { a.$appendNav("项目属性", "_project"), a.isShowModul = b.$current.data && b.$current.data.isShowModul, a._$mapState = a.isShowModul ? "app.show.system_prop.map" : "app.station.prop._map", a._$stationState = a.isShowModul ? "app.show.system_prop.current" : "app.station.prop._basic", a.project = a.$$cache[0], a.title = a.project.name }]).controller("proj_prop_station", ["$scope", "$state", "$map", "$source", "$window", "$compile", "$q", "$sys", function(a, b, c, d, e, f, g, h) {
    a.updataORdel = "updata", a.active2del = !1, d.$sysModel.get({ currentPage: 1 }).$promise.then(function(b) { a.sysModels = b.ret }), a.page = {}, a.od = {}, a.reset = function() { a.od = {}, a.loadPageData(1) }, a.rg_k_v = {}, a.rg_k_v[a.project.id + ""] = a.project, a.loadPageData = function(e) {
        a.page.currentPage = e, a.showMask = !0;
        var f = angular.extend({ options: "query", region_id: a.project.id, currentPage: e, itemsPerPage: h.itemsPerPage, isactive: b.includes("app.show") ? 1 : void 0 }, a.od);
        d.$system.query(f).$promise.then(function(b) {
            var e, f, h, j;
            e = {}, b.data.forEach(function(b, c, d) { b.proj_name = a.project.name, e[b.uuid] = b });
            var k = Object.keys(e);
            k.length && (f = d.$system.status(k).$promise, h = !a.isShowModul && d.$system.needSync(k).$promise), g.all([f, h]).then(function(d) { sysStatus = d[0] && d[0].ret, j = d[1] && d[1].ret, $.each(b.data, function(a, b) { b.online = sysStatus && sysStatus[a] && (sysStatus[a].daserver ? sysStatus[a].daserver.logon : sysStatus[a].online), b.needsync = j && j[b.uuid] }), angular.extend(a.page, b), "map" == a.list_map && c.flushMarkers(i, a.page.data), a.showMask = !1 })
        }, function() { a.showMask = !1 })
    };
    var i;
    a.initMap = function() { i = c.initMap(a, a.page.data, "bdmap", 175, a.project.name) }, a.page = { currentPage: 1 }, a.loadPageData(1), a.go2AddDas = function() { b.go("app.proj.prop.addstation") }
}]).controller("proj_prop_author", ["$scope", "$state", "$source", "$translate", function(a, b, c, d) {
    var e = [];
    a.privilge2Text = function(a) {
        return e = [], a && a.forEach(function(a, b) { e.push(d.instant(a)) }), e.join(";")
    }, c.$region.get({ op: "authoruser", region_id: a.project.id }, function(b) { a.users = b.ret }), a.getUser = function(a) { c.$user.get({ pk: a.user_id }, function(b) { a.username = b.ret && b.ret.username, a.is_super_user = b.ret && b.ret.is_super_user }) }
}]).controller("proj_prop_attr", ["$state", "$scope", "$source", function(a, b, c) {
    function d(a) { c.$sub.get({ op: "select", region: a, user: b.user.id }, function(a) { b.od.sub_id = a.ret[0] && a.ret[0].id, b.od.issubed = !!b.od.sub_id }) }

    function e() {
        var a = { filter: { region_id: b.proj.id, type: "alarm" }, sendee: { user_id: b.user.id } };
        c.$sub.save({ op: "create" }, a, function(a) { b.od.sub_id = a.ret, b.od.issubed = !0 })
    }

    function f() { c.$sub.get({ op: "delete", pk: b.od.sub_id }, function(a) { b.od.sub_id = undefind }) }
    b.$popNav(b.project.name + "(属性)", a), b.proj = angular.copy(b.project), b.od = {}, d(b.proj.id), b.editSub = function() {
        (b.od.issubed ? e : f)()
    }, b.commit = function() { b.validForm(), c.$region.put({ pk: b.project.id }, b.proj, function(a) { angular.alert("修改成功!"), angular.extend(b.project, b.proj) }) }
}]), angular.module("app.show.proj", []).controller("show_project", ["$scope", "$project", function(a, b) {}]), angular.module("app.show.system", []).controller("show_alarm", ["$scope", "$state", "$source", "$show", "$sys", "$q", "$filter", "$modal", function(a, b, c, d, e, f, g, h) {
    a.$moduleNav("报警", b);
    var i = a;
    a.openCalendar = function(a, b) { a.preventDefault(), a.stopPropagation(), this.$eval(b) }, a.page = {}, c.$region.query({ currentPage: 1 }, function(b) { a.regions = b.data }), a.loadSys = function() {
        return a.od.region_id ? void c.$system.query({ currentPage: 1, options: "query", isactive: 1, region_id: a.od.region_id }, function(b) { a.systems = b.data }) : (a.systems = [], void(a.od.system_id = void 0))
    }, a.op = { active: "a" }, a.$watch("op.active", function() { a.page.data = [], a.page.total = 0, a.page.currentPage = 0 }), a.od = { class_id: null, severity: null, end: new Date, start: new Date(new Date - 864e5), region_id: void 0, system_id: void 0 }, a.loadPageData = function(b) {
        if (b) {
            a.validForm();
            var c = angular.copy(a.od);
            if (!c.start) return void angular.alert("请输入起始时间");
            if (!c.end) return void angular.alert("请输入结束时间");
            if (c.start = c.start.getTime(), c.end = c.end.getTime(), c.start > c.end) return void angular.alert("起始时间不可超前与结束时间");
            c.itemsPerPage = e.itemsPerPage, c.currentPage = b, c.active = "a" == a.op.active ? "1" : void 0, c.uuid = "query", a.showMask = !0, d.alarm.query(c, function(c) { a.page.data = c.data, a.page.total = c.total, a.page.currentPage = b, c.data.length || angular.alert({ title: "无报警数据" }), a.showMask = !1 }, function() { a.showMask = !1 })
        }
    }, a.alarmMsg = function(a) { h.open({ templateUrl: "athena/show/alarm_msg.html", controller: ["$scope", "$modalInstance", function(b, c) { b.__proto__ = i, b.$modalInstance = c, b.alarm = a }] }) }
}]).controller("show_system_prop", ["$scope", "$state", "$stateParams", "_$system", "$source", "$show", "$q", "$sys", "$filter", "$interval", function(a, b, c, d, e, f, g, h, i, j) {
    function k() {
        e.$system.status([a.system.uuid], function(b) {
            var c = b.ret[0];
            a.system.online = c && (c.daserver ? c.daserver.logon : c.online)
        })
    }
    a.system = d.ret, e.$region.get({ pk: a.system.region_id }, function(b) { a.system.region_name = b.ret.name }), f.alarm.get({ uuid: a.system.uuid, op: "total", active: 1 }, function(b) { a.totalAlarm_act = b.ret }), f.alarm.get({ uuid: a.system.uuid, op: "lastalarm" }, function(b) { a.lastAlarm = b.ret[0] }), k();
    var l;
    l = j(k, h.state_inter_time), a.$on("$destroy", function() { j.cancel(l) }), a.tags = a.system.tags;
    var m = a.system.model;
    if (e.$sysModel.getByPk({ pk: m }, function(b) { a.systemModel = b.ret }), a.op = { start: "", num: 400, end: new Date, start: new Date(new Date - 864e5), ala: "a", pointSize: 60, c_int: 1e4, a_int: 1e4, progValue: 0 }, a.openCalendar = function(a, b) { a.preventDefault(), a.stopPropagation(), this.$eval(b) }, a.goHis = function(c) { a.op.his_tag = c, b.go("app.s_system_prop.history") }, a.system.latitude) {
        var n = new BMap.Geocoder;
        n.getLocation(new BMap.Point(a.system.longitude, a.system.latitude), function(b) { b && (console.log(b), a.$apply(function() { a.system.map_address = b.address })) })
    }
}]).controller("show_system_basic", ["$scope", "$sys", "$show", "$state", function(a, b, c, d) { a.$popNav(a.system.name + "", d) }])

// show  system current controller  --old ;  
// .controller("show_system_current", ["$scope", "$show", "$interval", "$sys", "$state", "$filter", "$timeout", function(a, b, c, d, e, f, g) {
//     function h(c) {
//         console.log(k);
//         var d;
//         k.length && (c && (d = $(c.currentTarget), d.text("刷新中").attr("disabled", !0)), b.live.get({ uuid: a.system.uuid, tag: k }, function(a) { $.each(a.ret, function(a, b) { b = b || m, l = f("date")(b.src, "MM-dd HH:mm:ss"), $("#_val_" + a).text(null == b.pv ? "" : b.pv), l && $("#_time_" + a).text(l) }), d && (d.text("刷新成功"), g(function() { d.text("刷新").attr("disabled", !1) }, 3e3)) }, function() { d && d.text("刷新").attr("disabled", !1) }))
//     }
//     a.$popNav(a.system.name + "(实时数据)", e);
//     var i;
//     a.$on("$destroy", function() { c.cancel(i) }), a.auto_r = !0;
//     var j, k = [];
//     a.filtTags = [], a.filterTags = function(b) {
//         k = [], j = new RegExp(b), a.filtTags = a.tags.filter(function(a) {
//             return j.test(a.name) ? (k.push(a.name), !0) : !1
//         }), h()
//     }, a.filterTags(""), a.$watch("auto_r", function(b) { b ? a.liveData() : c.cancel(i) }), a.progValue = 0, a.liveData = function() { c.cancel(i), i = c(function() { a.progValue += 1e3, a.progValue == a.op.c_int && h(), a.progValue > a.op.c_int && (a.progValue = 0) }, 1e3) };
//     var l, m = { src: null, pv: null };
//     a.getCurrent = h, a.liveWrite = function(c, d, e, f) {
//         if (!d) return void angular.alert("请输入下置数据");
//         if (c) {
//             var g = {};
//             $(e.currentTarget);
//             g[c.name] = d, f.showSpinner = !0, b.liveWrite.save({ uuid: a.system.uuid }, g, function(a) { f.showSpinner = !1 }, function() { f.showSpinner = !1 })
//         }
//     }
// }])


// show system controller -- new ; 
.controller("show_system_current", ["$scope", "$show", "$interval", "$sys", "$state", "$filter", "$timeout", function(a, b, c, d, e, f, g) {
    function h(c) {
       // console.log(k);
        var d;
        k.length && (c && (d = $(c.currentTarget), d.text("刷新中").attr("disabled", !0)), b.live.get({ uuid: a.system.uuid, tag: k }, function(b) { m = a.decimal, m && (0 == a.fractionSize ? (n = new RegExp("(\\d+).(\\d+)"), o = "$1") : (n = new RegExp("(\\d+).(\\d{" + a.fractionSize + "})(\\d*)"), o = "$1.$2")), $.each(b.ret, function(a, b) { b = b || p, l = f("date")(b.src, "MM-dd HH:mm:ss"), l && $("#_time_" + a).text(l), $("#_val_" + a).text(null == b.pv ? "" : m ? (b.pv + "").replace(n, o) : b.pv) }), d && (d.text("刷新成功"), g(function() { d.text("刷新").attr("disabled", !1) }, 3e3)) }, function() { d && d.text("刷新").attr("disabled", !1) }))
    }
    a.$popNav(a.system.name + "(实时数据)", e);
    var i;
    a.$on("$destroy", function() { c.cancel(i) }), a.auto_r = !0, a.decimal = !1, a.fractionSize = 4, a.progValue = 0;
    var j, k = [];
    a.filtTags = [], a.filterTags = function(b) {
        k = [], j = new RegExp(b), a.filtTags = a.tags.filter(function(a) {
            return j.test(a.name) ? (k.push(a.name), !0) : !1
        }), h()
    }, a.filterTags(""), a.$watch("auto_r", function(b) { b ? a.liveData() : c.cancel(i) }), a.liveData = function() { c.cancel(i), i = c(function() { a.progValue += 1e3, a.progValue == a.op.c_int && h(), a.progValue > a.op.c_int && (a.progValue = 0) }, 1e3) };
    var l, m, n, o, p = { src: null, pv: null };
    a.getCurrent = h, a.liveWrite = function(c, d, e, f) {
        if (!d) return void angular.alert("请输入下置数据");
        if (c) {
            var g = {};
            $(e.currentTarget);
            g[c.name] = d, f.showSpinner = !0, b.liveWrite.save({ uuid: a.system.uuid }, g, function(a) { f.showSpinner = !1, console.log(a) }, function() { f.showSpinner = !1 })
        }
    }
}])


.controller("show_system_history", ["$scope", "$show", "$sys", "$state", function(a, b, c, d) {
    function e(b, c, d) {
        Highcharts.setOptions({ global: { useUTC: !1 }, lang: { resetZoom: "重置" } }), $("#show_live_data").highcharts({
            chart: { zoomType: "x", events: { load: function() { a.showMask = !1 } } },
            title: { text: !1 },
            xAxis: { type: "datetime" },
            yAxis: { title: { text: "" } },
            legend: { enabled: !1 },
            tooltip: {
                formatter: function() {
                    return Highcharts.dateFormat("%Y-%m-%d %H:%M:%S", this.x) + "<br/><b>" + this.series.name + "</b>：" + this.y
                }
            },
            credits: { enabled: !1 },
            exporting: { enabled: !1 },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get("rgba")]
                        ]
                    },
                    marker: { radius: 2 },
                    lineWidth: 1,
                    states: { hover: { lineWidth: 1 } },
                    threshold: null
                }
            },
            series: [{ name: b, step: c, data: d }]
        }), h = $("#show_live_data").highcharts()
    }

    function f() {
        if (h || (h = $("#show_live_data").highcharts()), 0 != h.series.length)
            for (var a = 0; a < h.series.length; a++) h.series[a].remove()
    }
    a.$popNav(a.system.name + "(历史数据)", d), a.$on("$destroy", function() { a.op.his_tag = null });
    angular.copy(c.plotChartConfig);
    a.initFlotChart = function(b) { a.op.his_tag ? (a.op.start = new Date(new Date - 216e5), a.op.end = new Date) : e("模拟点", !0), e("模拟点", !0) };
    var g = 1;
    a.leftTime = function() { 1 == g || 2 == g ? a.op.end = new Date(a.op.end.getTime() - 864e5) : 3 == g || 4 == g || 5 == g ? 0 == a.op.end.getMonth() ? a.op.end = new Date(a.op.end.getFullYear() - 1 + "/12/" + a.op.end.getDate()) : a.op.end = new Date(a.op.end.getFullYear() + "/" + a.op.end.getMonth() + "/" + a.op.end.getDate()) : 6 == g && (a.op.end = new Date(a.op.end.getFullYear() - 1 + "/" + (a.op.end.getMonth() + 1) + "/" + a.op.end.getDate())), a.queryData(g) }, a.rightTime = function() { 1 == g || 2 == g ? a.op.end = new Date(a.op.end.getTime() + 864e5) : 3 == g || 4 == g || 5 == g ? 11 == a.op.end.getMonth() ? a.op.end = new Date(a.op.end.getFullYear() + 1 + "/1/" + a.op.end.getDate()) : a.op.end = new Date(a.op.end.getFullYear() + "/" + (a.op.end.getMonth() + 2) + "/" + a.op.end.getDate()) : 6 == g && (a.op.end = new Date(a.op.end.getFullYear() + 1 + "/" + (a.op.end.getMonth() + 1) + "/" + a.op.end.getDate())), a.queryData(g) }, a.dateStr = (new Date).getFullYear() + "." + ((new Date).getMonth() + 1) + "." + (new Date).getDate(), a.$watch("op.end", function(b, c) { a.changeTemp && a.queryData(g) }, !0), a.$watch("op.his_tag", function(b, c) { a.queryData(g) }, !0), a.changeTemp, a.queryData = function(b) {
        if (a.changeTemp = !1, 2 == arguments.length && (a.op.end = new Date), a.op.his_tag) {
            $("button[data-name='" + b + "']").css({ "background-color": "#edf1f2", "border-color": "#c7d3d6", "box-shadow": "inset 0 3px 5px rgba(0, 0, 0, .125)" }).prop("disabled", !0).siblings().css({ "background-color": "#fff", "border-color": "#dee5e7", "box-shadow": "0 1px 1px rgba(90,90,90,0.1)" }).prop("disabled", !1), a.op.end.getTime() > (new Date).getTime() && (angular.alert("结束时间不能晚于当前时间"), a.op.end = new Date);
            var c, d, e = new Date,
                f = { year: e.getFullYear(), month: e.getMonth() + 1, day: e.getDate(), time: e.getTime() },
                h = a.op,
                i = h.end.getTime();
            1 == b ? (f.time - h.end.getTime() < 864e5 ? (c = new Date(f.year + "/" + f.month + "/" + f.day).getTime(), i = f.time, a.dateStr = new Date(i).getFullYear() + "." + (new Date(i).getMonth() + 1) + "." + new Date(i).getDate()) : (c = new Date(h.end.getFullYear() + "/" + (h.end.getMonth() + 1) + "/" + h.end.getDate()).getTime(), i = new Date(h.end.getFullYear() + "/" + (h.end.getMonth() + 1) + "/" + h.end.getDate()).getTime() + 864e5, a.dateStr = new Date(c).getFullYear() + "." + (new Date(c).getMonth() + 1) + "." + new Date(c).getDate()), d = 1500, g = 1) : 2 == b ? (f.time - h.end.getTime() < 864e5 ? (c = new Date(f.year + "/" + f.month + "/" + f.day).getTime() - 5184e5, i = f.time, i -= (i - c) % 18e5, a.dateStr = new Date(c).getFullYear() + "." + (new Date(c).getMonth() + 1) + "." + new Date(c).getDate() + "-" + new Date(i).getFullYear() + "." + (new Date(i).getMonth() + 1) + "." + new Date(i).getDate()) : (i = new Date(h.end.getFullYear() + "/" + (h.end.getMonth() + 1) + "/" + h.end.getDate()).getTime() + 864e5, c = i - 6048e5, a.dateStr = new Date(c).getFullYear() + "." + (new Date(c).getMonth() + 1) + "." + new Date(c).getDate() + "-" + new Date(i - 864e5).getFullYear() + "." + (new Date(i - 864e5).getMonth() + 1) + "." + new Date(i - 864e5).getDate()), d = parseInt((i - c) / 18e5), g = 2) : 3 == b ? (h.end.getFullYear() == f.year && h.end.getMonth() + 1 == f.month ? (c = new Date(f.year + "/" + f.month).getTime(), i = f.time, i -= (i - c) % 72e5, a.dateStr = new Date(i).getFullYear() + "." + (new Date(i).getMonth() + 1)) : (c = new Date(h.end.getFullYear() + "/" + (h.end.getMonth() + 1)).getTime(), i = 11 == h.end.getMonth() ? new Date(h.end.getFullYear() + 1 + "").getTime() : new Date(h.end.getFullYear() + "/" + (h.end.getMonth() + 2)).getTime(), a.dateStr = new Date(c).getFullYear() + "." + (new Date(c).getMonth() + 1)), d = parseInt((i - c) / 72e5), g = 3) : 4 == b ? (h.end.getFullYear() == f.year && h.end.getMonth() + 1 == f.month ? (c = f.month <= 2 ? new Date(f.year - 1 + "/" + (10 + f.month)).getTime() : new Date(f.year + "/" + (f.month - 2)).getTime(), i = f.time, i -= (i - c) % 216e5, a.dateStr = new Date(c).getFullYear() + "." + (new Date(c).getMonth() + 1) + "-" + new Date(i).getFullYear() + "." + (new Date(i).getMonth() + 1)) : (c = h.end.getMonth() < 2 ? new Date(h.end.getFullYear() - 1 + "/" + (11 + h.end.getMonth())).getTime() : new Date(h.end.getFullYear() + "/" + (h.end.getMonth() - 1)).getTime(), i = 11 == h.end.getMonth() ? new Date(h.end.getFullYear() + 1 + "").getTime() : new Date(h.end.getFullYear() + "/" + (h.end.getMonth() + 2)).getTime(), a.dateStr = new Date(c).getFullYear() + "." + (new Date(c).getMonth() + 1) + "-" + h.end.getFullYear() + "." + (h.end.getMonth() + 1)), d = parseInt((i - c) / 216e5), g = 4) : 5 == b ? (h.end.getFullYear() == f.year && h.end.getMonth() + 1 == f.month ? (c = f.month <= 5 ? new Date(f.year - 1 + "/" + (7 + f.month)).getTime() : new Date(f.year + "/" + (f.month - 5)).getTime(), i = f.time, i -= (i - c) % 432e5, a.dateStr = new Date(c).getFullYear() + "." + (new Date(c).getMonth() + 1) + "-" + new Date(i).getFullYear() + "." + (new Date(i).getMonth() + 1)) : (c = h.end.getMonth() < 5 ? new Date(h.end.getFullYear() - 1 + "/" + (8 + h.end.getMonth())).getTime() : new Date(h.end.getFullYear() + "/" + (h.end.getMonth() - 4)).getTime(), i = 11 == h.end.getMonth() ? new Date(h.end.getFullYear() + 1 + "").getTime() : new Date(h.end.getFullYear() + "/" + (h.end.getMonth() + 2)).getTime(), a.dateStr = new Date(c).getFullYear() + "." + (new Date(c).getMonth() + 1) + "-" + h.end.getFullYear() + "." + (h.end.getMonth() + 1)), d = parseInt((i - c) / 432e5), g = 5) : 6 == b && (h.end.getFullYear() == f.year ? (c = new Date(f.year + "").getTime(), i = f.time, i -= (i - c) % 864e5, a.dateStr = new Date(c).getFullYear()) : (c = new Date(h.end.getFullYear() + "").getTime(), i = new Date(h.end.getFullYear() + 1 + "").getTime(), a.dateStr = new Date(c).getFullYear()), d = parseInt((i - c) / 864e5), g = 6);
            var j = { start: c, end: i, count: d };
            a.queryHistory(j)
        }
    }, a.queryHistory = function(c) {
        a.validForm();
        var d = a.op,
            g = {};
        g.uuid = a.system.uuid, g.tag = d.his_tag.name, g.mode = "Analog" == d.his_tag.type ? "linear" : "last_value", g.start = c.start, g.end = c.end, g.count = c.count, a.showMask = !0, b.his.get(g, function(b) {
            var c = [];
            if (b.ret[0].length > 0) {
                for (var d = 0; d < b.ret[0].length; d++) {
                    var h = [];
                    g.end - g.start < 1728e5 ? h[0] = b.ret[0][d].rcv : h[0] = b.ret[0][d].ts, h[1] = b.ret[0][d].pv, c[d] = h
                }
                var i = "linear" == g.mode ? !1 : !0;
                e(g.tag, i, c)
            } else a.showMask = !1, f(), angular.alert("当前时间段，无历史数据，请选择其他时间")
        }, function() { a.showMask = !1 })
    };
    var h
}]).controller("show_system_alarm", ["$scope", "$show", "$interval", "$modal", "$sys", "$state", function(a, b, c, d, e, f) {
    a.$popNav(a.system.name + "(报警)", f), a.page = {};
    var g = { uuid: a.system.uuid };
    a.$watch("op.ala", function(b) { "a" == b ? a.loadPageData(1) : (a.page.data = [], a.page.total = 0, a.page.currentPage = 0) }), a.getActiveAlarm = function(c, d) {
        var f = { currentPage: c, itemsPerPage: e.itemsPerPage };
        a.showMask = !0, b.alarm.get(angular.extend(g, f), function(b) { d && d.toggleClass("show"), a.page.data = b.data, a.page.total = b.total, a.page.currentPage = c, !b.data.length, a.showMask = !1 }, function() { a.showMask = !1 })
    }, a.loadPageData = function(b, c) {
        if (b) {
            var d;
            c && (d = $(c.currentTarget).find("i"), d.toggleClass("show")), "a" == a.op.ala ? a.getActiveAlarm(b, d) : a.queryAlarm(b, d)
        }
    }, a.queryAlarm = function(c, d) {
        var f = {},
            g = a.op;
        return f.start = g.start.getTime(), f.end = g.end.getTime(), f.start > f.end ? void angular.alert("起始时间不可超前与结束时间!") : (f.uuid = a.system.uuid, f.currentPage = c, f.itemsPerPage = e.itemsPerPage, a.showMask = !0, void b.alarm.save(f, null, function(b) { d && d.toggleClass("show"), a.page.data = b.data, a.page.total = b.total, a.page.currentPage = c, b.data.length || angular.alert({ title: "无报警数据" }), a.showMask = !1 }, function() { a.showMask = !1 }))
    }
}]).controller("show_system_map", ["$scope", "$map", "$state", function(a, b, c) {
    a.$popNav(a.system.name + "(地图)", c);
    var d;
    a.initMap = function() { d = b.initMap(a, [a.system], "station_map", 135, "$stateParams.projname") }
}]).controller("show_system_panel", ["$scope", "$map", "$state", "$source", "$http", function(a, b, c, d, e) {
    var f = "/v5/json/syalias/project.search?smid=" + a.system.model;
    e.get(f).success(function(b, c, e, f) {
        if (b.err) return void console.log("Get Panel Err");
        if (b.ret) {
            var g = b.ret[0].uuid;
            d.$user.get({ op: "getack" }, function(b) {
                if (b.ret) {
                    var c = b.ret,
                        d = a.system.name;
                    a.currentProjectUrl = "/syalias/trunk/syalias.html?ack=" + c + "&uuid=" + g + "&systemName=" + d
                }
            })
        }
    }).error(function(a, b, c, d) { console.log(a) })
}]), angular.module("app.system", []).controller("dastation_ignore_active", ["$scope", "$state", "$stateParams", "$source", "$modal", "$q", "$map", "$sys", "$timeout", "$interval", function(a, b, c, d, e, f, g, h, i, j) {
    c.id && d.$region.get({ pk: c.id }, function(b) { a.title = b.ret.name });
    var k = a,
        l = c.id;
    a.isShowModul = b.$current.data && b.$current.data.isShowModul, a._$projState = a.isShowModul ? "app.s_region_system" : "app.m_region_prop.system", a._$mapState = a.isShowModul ? "app.s_system_prop.map" : "app.m_system_prop._map", a._$stationState = a.isShowModul ? "app.s_system_prop.basic" : "app.m_system_prop._basic", a._$showRegionTH = b.includes("app.m_system") || b.includes("app.s_system"), a.active2del = !0, a.isShowModul ? a.$moduleNav("系统", b) : a.$moduleNav("1" == c.isactive ? "已激活系统" : "未激活系统", b), a.updataORdel = "del", a.od = { state: a.isShowModul ? 1 : void 0, region_id: l }, a.page = {};
    var m = d.$region.get({
            currentPage: 1
        }).$promise,
        n = d.$sysModel.get({ currentPage: 1 }).$promise;
    a.rg_k_v = {};
    var o = m.then(function(b) { a.regions = b.data, a.regions.forEach(function(b) { a.rg_k_v[b.id] = b }) });
    n.then(function(b) { a.sysModels = b.ret }), a.reset = function() { a.od = { state: 1, region_id: l }, a.loadPageData(1) };
    var p;
    a.$on("$destroy", function() { j.cancel(p) }), a.loadPageData = function(b) {
        a.showMask = !0, a.page.currentPage = b;
        var c = angular.extend({ options: "query", currentPage: b, itemsPerPage: h.itemsPerPage }, a.od);
        d.$system.query(c).$promise.then(function(b) {
            var e, i, k, l;
            e = {}, b.data.forEach(function(a, b, c) { e[a.uuid] = a }), i = {};
            var m = Object.keys(e);
            "1" != c.state && void 0 != c.state || !m.length || (i = d.$system.status(m).$promise, k = !a.isShowModul && d.$system.needSync(m).$promise, j.cancel(p), p = j(function() {
                d.$system.status(m, function(a) {
                    var c = a.ret;
                    $.each(b.data, function(a, b) { b.online = c && c[a] && (c[a].daserver ? c[a].daserver.logon : c[a].online) })
                })
            }, h.state_inter_time)), f.all([i, k, o]).then(function(c) { sysStatus = c[0] && c[0].ret, l = c[1] && c[1].ret, $.each(b.data, function(b, c) { c.online = sysStatus && sysStatus[b] && (sysStatus[b].daserver ? sysStatus[b].daserver.logon : sysStatus[b].online), c.needsync = l && l[c.uuid], c.region_name = a.rg_k_v[c.region_id].name }), angular.extend(a.page, b), "map" == a.lm && g.flushMarkers(q, a.page.data), a.showMask = !1 }, function() { a.showMask = !1 })
        }, function() { a.showMask = !1 })
    }, a.loadPageData(1);
    var q;
    a.initMap = function() { q = g.initMap(a, a.page.data, "bdmap", 268, c.projname) }, a.createSystem = function() {
        e.open({
            templateUrl: "athena/dastation/dastation_add_temp.html",
            controller: ["$scope", "$modalInstance", function(a, b) {
                a.__proto__ = k, a.$modalInstance = b;
                var c = k.project && k.project.id;
                a.system = { region_id: c }, a.od = { systemModel: void 0, selectRegion: !!c }, a.$watch("od.systemModel", function(b, c) { b && (2 == b.mode && delete a.system.network, a.showMask = !0, d.$sysProfile.get({ system_model: b.uuid }, function(b) { a.profiles = b.ret, a.system.profile = b.ret[0] && b.ret[0].uuid, a.showMask = !1 }, function() { a.showMask = !1 })) }), a.done = function() {
                    a.validForm(), a.showMask = !0;
                    var b = angular.extend({ model: a.od.systemModel.uuid }, a.system);
                    d.$system.save(b, function(c) { b.uuid = c.ret, b.state = 0, a.page.data.unshift(b), a.cancel(), a.confirmInvoke({ title: "配置系统", note: "创建成功,是否去配置该系统?", todo: "是", undo: "不用了" }, function(c) { a["goto"]("app.m_system_prop._config", b, b), c() }), a.showMask = !1 }, function() { a.showMask = !1 })
                }
            }]
        })
    }, a.updateSystem = function(a) {
        return d.$system.put({}, a).$promise
    }
}]).controller("dastation_add", ["$state", "$scope", "$stateParams", "$source", "$q", function(a, b, c, d, e) {
    b.showMask = !0, b.system = {};
    var f = b.$$cache && b.$$cache[0] && b.$$cache[0].id;
    e.all([d.$region.query({ currentPage: 1, itemsPerPage: 5e3 }).$promise, d.$sysModel.get().$promise]).then(function(a) { b.projects = a[0].data, b.system.region_id = f ? f : b.projects[0] && b.projects[0].id, b.sysmodels = a[1].ret, b.systemModel = a[1].ret[0], b.showMask = !1 }, function() { b.showMask = !1 }), b.$watch("systemModel", function(a, c) { a && (2 == a.mode && delete b.system.network, b.showMask = !0, d.$sysProfile.get({ system_model: a.uuid }, function(a) { b.profiles = a.ret, b.system.profile = a.ret[0] && a.ret[0].uuid, b.showMask = !1 }, function() { b.showMask = !1 })) }), b.dastation = {}, b.commit = function() {
        b.validForm(), b.showMask = !0;
        var a = angular.extend({ model: b.systemModel.uuid }, b.system);
        d.$system.save(a, function(c) { a.uuid = c.ret, a.state = 0, b.confirmInvoke({ title: "配置系统", note: "创建成功,是否去配置该系统?", todo: "是", undo: "不用了" }, function(c) { b["goto"]("app.station.prop._config", a, a), c() }), b.showMask = !1 }, function() { b.showMask = !1 })
    }
}]), angular.module("app.system.prop", []).controller("dastation_prop", ["$scope", "$state", "$source", "$stateParams", "$interval", "$sys", function(a, b, c, d, e, f) {
    function g() {
        c.$system.status([a.station.uuid], function(b) {
            var c = b.ret[0];
            a.station.online = c && (c.daserver ? c.daserver.logon : c.online)
        })
    }

    function h(b) {
        try { a.$apply(function() { a.progressVisible = !1, a.station.pic_url = angular.fromJson(b.target.response).ret }) } catch (c) {}
    }

    function i(b) { a.$apply(function() { b.lengthComputable ? a.progress = Math.round(100 * b.loaded / b.total) : a.progress = "unable to compute" }) }
    a.station = a.$$cache[0], a.Sta_Data = a.$$cache[1], a.loadSystemData = function() { c.$system.get({ system_id: a.station.uuid }, function(b) { a.Sta_Data = b.ret.profile, a.$$cache[1] = b.ret.profile }) }, a.station && a.loadSystemData(), a.station.region_id && c.$region.get({ pk: a.station.region_id }, function(b) { a.station.region_name = b.ret.name }), g();
    var j;
    j = e(g, f.state_inter_time), a.$on("$destroy", function() { e.cancel(j) }), a.l_m_P = c.$sysModel.getByPk({ pk: a.station.model }).$promise, a.l_m_P.then(function(b) { a.sysmodel = b.ret, a.deviceKV = {}, a.sysmodel.devices.forEach(function(a, b, c) { this[a.id] = a.name }, a.deviceKV) }), a.op = { rightfile: !0 }, a.setFiles = function(b) {
        a.canupload = !0, a.$apply(function(a) {
            a.files = [];
            var c = b.files[0];
            a.op.rightfile = c.size < 512e3, a.op.rightfile && a.files.push(b.files[0])
        })
    }, a.uploadFile = function() {
        a.progress = 1;
        var b = new FormData;
        b.append("sys_picture", a.files[0]), b.append("old_pic_url_", a.station.pic_url), b.append("system_id", a.station.uuid);
        var c = new XMLHttpRequest;
        c.upload.addEventListener("progress", i, !1), c.addEventListener("load", h, !1), c.open("POST", angular.rootUrl + "picture/system"), c.setRequestHeader("Accept", "application/json"), a.progressVisible = !0, c.send(b)
    };
    if (a.station.latitude && BMap) {
        var k = new BMap.Geocoder;
        k.getLocation(new BMap.Point(a.station.longitude, a.station.latitude), function(b) { b && (console.log(b), a.$apply(function() { a.station.map_address = b.address })) })
    }
}]).controller("das_basic", ["$scope", "$filter", "$state", "$stateParams", function(a, b, c, d) {}])

 
// system config  controller  -- old ; 
// .controller("das_config", ["$scope", "$state", "$stateParams", "$source", "$modal", "$filter", function(a, b, c, d, e, f) {
//     function g(a) { i[a] = !0, j[a] = !1 }

//     function h(a) { i[a] = !1, j[a] = !0 }
//     a.t = {};
//     var i, j, k = a;
//     k.needUpdate = i = {}, k.hasSave = j = {}, a.createTicket = function() {
//         return a.t.sn ? (a.t.privilege = ["SYSTEM_MANAGE", "SYSTEM_CONTROL"], void d.$ticket.save({ system_id: a.station.uuid }, a.t, function(b) { a.t.ticket = b.ret })) : void angular.alert("请输入SN号")
//     }, a.unBindTicket = function() { d.$ticket["delete"]({ system_id: a.station.uuid }, void 0, function(b) { a.t.ticket = void 0, a.t.sn = void 0 }) }, a.l_m_P.then(function(b) {
//         var c = b.ret;
//         a.nT = !(1 == c.mode && 1 == c.comm_type), a.nT && d.$ticket.get({ system_id: a.station.uuid }, function(b) { a.t = b.ret || {} }, function() { a.t = {} })
//     }), a.toUpdate = g, a.toSave = h, a.$popNav(a.station.name + "(配置)", b);
//     try { a.network = angular.fromJson(a.station.network || {}) } catch (l) { console.error(" system . network 字段 不是 json 格式", a.station.network) }
//     try { a.gateway = angular.fromJson(a.station.gateway || {}) } catch (l) { console.error(" system . gateway  字段 不是 json 格式", a.station.gateway) }
//     a.initDaServer = function() {
//         a.daserver = angular.copy(k.network.daserver || (k.network.daserver = {})), a.l_m_P.then(function() {
//             if (1 == a.sysmodel.mode && 1 == a.sysmodel.comm_type && a.daserver.params && a.station.state) {
//                 var b = { options: "getassign", proj_id: a.station.uuid };
//                 d.$system.getDtuServer(b, function(b) { a.cmway_port = b.ret })
//             }
//         })
//     }, a.loadSupportDtus = function() { a.dutList || d.$driver.get({ type: "dtu" }, function(b) { a.dtuList = f("filter")(b.ret, { category: "CHANNEL" }) }) }, a.applyDtuData = function(b) {
//         b.port = void 0, b.cmway = void 0, $.each(a.dtuList, function(a, c) {
//             return c.driver_id == b.driverid ? (b.port = c.port, b.cmway = c.cmway, g("daserver"), !1) : void 0
//         })
//     }, d.$sysProfile.get({ system_model: a.station.model }, function(b) {
//         a.profiles = b.ret;
//         var c = a.station.profile;
//         $.each(a.profiles, function(b, d, e) { d.uuid == c && (a.profile = d) })
//     }), a.initGatewayDevs = function() {
//         var b = k.network.devices || (k.network.devices = []);
//         a.gatewayDevs = angular.copy(b)
//     }, a.devRef = {}, a.delete_dev = function(b, c, d) { a.confirmInvoke({ title: "删除设备网络配置:" + a.deviceKV[d.id], note: " 确认要删除该设备的网络配置吗?" }, function(e) { b.splice(c, 1), delete a.devRef[d.id], g("gatewayDevs"), e() }) }, a.c_u_dev = function(a, b, c) {
//         e.open({
//             templateUrl: "athena/dastation/add_gateway_device.html",
//             controller: ["$scope", "$modalInstance", function(d, e) {
//                 d.__proto__ = k, d.$modalInstance = e, d.isAdd = !c, d.dev = angular.copy(c || {}), d.op = {}, d.done = function() { d.validForm(), d.isAdd ? a.push(d.dev) : a[b] = d.dev, g("gatewayDevs"), d.cancel() }, d.filterDev = function() {
//                     var a = k.sysmodel.devices.filter(function(a, b, c) {
//                         return !d.devRef[a.id]
//                     });
//                     d.dev.id = a[0] && a[0].id, d._$devs = a
//                 }, d.filterChannel = function(a) {
//                     var b = {},
//                         c = d.dev.type;
//                     "ETHERNET" == c ? b = { LAN_1: null, WLAN_1: null } : angular.forEach(k.sysmodel.gateway_default, function(a, d, e) { c == d && (b = a) }), a && (d.dev.params = { channel: Object.keys(b)[0] }), d._$channel = b
//                 }
//             }]
//         })
//     }, a.c_u_way = function(a, b, c) {
//         e.open({
//             templateUrl: "athena/dastation/_prop_gateway_addgateway.html",
//             controller: ["$scope", "$modalInstance", function(d, e) {
//                 d.__proto__ = k, d.$modalInstance = e, d.isAdd = !c;
//                 var f = c && c.dns && c.gateway ? "WLAN" : "LAN";
//                 d.op = { T: a || "ETHERNET", t: b, x: f, way: angular.copy(c || {}) }, d.done = function() {
//                     d.validForm();
//                     var a = d.op;
//                     d.isAdd && (a.way.enable = !1), d.isAdd || delete d.gateway[a.T][b], (d.gateway[a.T] || (d.gateway[a.T] = {}))[a.t] = d.op.way, g("gateway"), d.cancel()
//                 }
//             }]
//         })
//     }, a.del_way = function(b, c, d) { a.confirmInvoke({ title: " 删除网关: " + c, note: "确认要删除该网关吗?" }, function(d) { delete a.gateway[b][c], g("gateway"), d() }) }, a.updateSystem = function(b, c) {
//         function e(a) {
//             return d.$system.put(a).$promise
//         }

//         function f() {
//             var b = { pk: a.station.uuid, driver_id: a.daserver.params.driverid },
//                 c = d.$system.assign(b).$promise;
//             return c.then(function(b) { a.cmway_port = b.ret }), c
//         }

//         function g() {
//             return i.network = angular.toJson({ daserver: a.daserver }), e(i).then(function(b) { h("daserver"), a.station.network = i.network })
//         }
//         var i = { uuid: a.station.uuid };
//         "gatewayDevs" == b && (a.validForm(), i.network = angular.toJson({ devices: a.gatewayDevs }), e(i).then(function(b) { h("gatewayDevs"), a.station.network = i.network })), "daserver" == b && (a.validForm("form_daserver", c), 0 == a.station.state ? a.confirmInvoke({ title: "激活系统", note: "该系统处于未激活状态,确认要激活该系统吗?" }, function(b) { d.$system.active({ pk: a.station.uuid }, function(c) { a.station.state = 1, b(), f().then(function() { g().then(b) }) }, b) }) : 1 != a.station.state || a.cmway_port ? g() : f().then(function() { g() })), "gateway" == b && (a.validForm("form_gateway"), i.gateway = angular.toJson(a.gateway), e(i).then(function() { h("gateway"), a.station.gateway = i.gateway })), "profile" == b && (i.profile = a.profile.uuid, e(i).then(function() { h("profile"), a.station.profile = i.profile }).then(function() { a.loadSystemData() }))
//     }, a.d_stop = function() { d.$system.stop({ pk: a.station.uuid }, function(a) { angular.alert(angular.toJson(a)) }) }
// }])


// system config controller - new ; 
.controller("das_config", ["$scope", "$state", "$stateParams", "$source", "$modal", "$filter", "$sys", "$utils", function(a, b, c, d, e, f, g, h) {
    function i(a) { k[a] = !0, l[a] = !1 }

    function j(a) { k[a] = !1, l[a] = !0 }
    a.t = {};
    var k, l, m = a;
    a.op = { plcstate: !1, enAblePlcProg: !1 }, m.needUpdate = k = {}, m.hasSave = l = {}, a.createTicket = function() {
        return a.t.sn ? (a.t.privilege = ["SYSTEM_MANAGE", "SYSTEM_CONTROL"], void d.$ticket.save({ system_id: a.station.uuid }, a.t, function(b) { a.t.ticket = b.ret })) : void angular.alert("请输入SN号")
    }, a.unBindTicket = function() { d.$ticket["delete"]({ system_id: a.station.uuid }, void 0, function(b) { a.t.ticket = void 0, a.t.sn = void 0 }) };
    try { a.network = angular.fromJson(a.station.network || {}) } catch (n) { console.error(" system . network 字段 不是 json 格式", a.station.network) }
    try { a.gateway = angular.fromJson(a.station.gateway || {}) } catch (n) { console.error(" system . gateway  字段 不是 json 格式", a.station.gateway) }
    a.daserver = angular.copy(m.network.daserver || (m.network.daserver = {})), h.isEnablePlcProg(a.daserver.params && a.daserver.params.driverid) && (a.op.enAblePlcProg = !0, d.$system.getPLC({ system_id: a.station.uuid }, function(b) { a.op.plcstate = b.ret })), a.setPLC = function(b) { a.op.plcstate = !a.op.plcstate, g.plcProg.indexOf(a.daserver.params && a.daserver.params.driverid) >= 0 && a.confirmInvoke({ title: b ? "开启编程模式" : "关闭编程模式", note: b ? "开启编程模式当前系统将停止采集相关功能, 是否确定开启编程模式?" : "关闭编程模式当前系统将不再允许通过工具同步PLC工程, 同时恢复采集相关功能, 是否确定关闭编程模式?" }, function(c) { d.$system.setPLC({ system_id: a.station.uuid, plc_programming: b ? 1 : 2 }, function(d) { a.op.plcstate = b, c() }, function() { c() }) }) }, a.l_m_P.then(function(b) {
        var c = b.ret;
        a.nT = !(1 == c.mode && 1 == c.comm_type), a.nT && d.$ticket.get({ system_id: a.station.uuid }, function(b) { a.t = b.ret || {} }, function() { a.t = {} })
    }), a.toUpdate = i, a.toSave = j, a.$popNav(a.station.name + "(配置)", b), a.initDaServer = function() {
        a.l_m_P.then(function() {
            if (1 == a.sysmodel.mode && 1 == a.sysmodel.comm_type && a.daserver.params && a.station.state) {
                var b = { options: "getassign", proj_id: a.station.uuid };
                d.$system.getDtuServer(b, function(b) { a.cmway_port = b.ret })
            }
        })
    }, a.loadSupportDtus = function() { a.dutList || d.$driver.get({ type: "dtu" }, function(b) { a.dtuList = b.ret }) }, a.applyDtuData = function(b) {
        b.port = void 0, b.cmway = void 0, $.each(a.dtuList, function(a, c) {
            return c.driver_id == b.driverid ? (b.port = c.port, b.cmway = c.cmway, i("daserver"), !1) : void 0
        })
    }, d.$sysProfile.get({ system_model: a.station.model }, function(b) {
        a.profiles = b.ret;
        var c = a.station.profile;
        $.each(a.profiles, function(b, d, e) { d.uuid == c && (a.profile = d) })
    }), a.initGatewayDevs = function() {
        var b = m.network.devices || (m.network.devices = []);
        a.gatewayDevs = angular.copy(b)
    }, a.devRef = {}, a.delete_dev = function(b, c, d) { a.confirmInvoke({ title: "删除设备网络配置:" + a.deviceKV[d.id], note: " 确认要删除该设备的网络配置吗?" }, function(e) { b.splice(c, 1), delete a.devRef[d.id], i("gatewayDevs"), e() }) }, a.c_u_dev = function(a, b, c) {
        e.open({
            templateUrl: "athena/dastation/add_gateway_device.html",
            controller: ["$scope", "$modalInstance", function(d, e) {
                d.__proto__ = m, d.$modalInstance = e, d.isAdd = !c, d.dev = angular.copy(c || {}), d.op = {}, d.done = function() { d.validForm(), d.isAdd ? a.push(d.dev) : a[b] = d.dev, i("gatewayDevs"), d.cancel() }, d.filterDev = function() {
                    var a = m.sysmodel.devices.filter(function(a, b, c) {
                        return !d.devRef[a.id]
                    });
                    d.dev.id = a[0] && a[0].id, d._$devs = a
                }, d.filterChannel = function(a) {
                    var b = {},
                        c = d.dev.type;
                    "ETHERNET" == c ? b = { LAN_1: null, WLAN_1: null } : angular.forEach(m.sysmodel.gateway_default, function(a, d, e) { c == d && (b = a) }), a && (d.dev.params = { channel: Object.keys(b)[0] }), d._$channel = b
                }
            }]
        })
    }, a.c_u_way = function(a, b, c) {
        e.open({
            templateUrl: "athena/dastation/_prop_gateway_addgateway.html",
            controller: ["$scope", "$modalInstance", function(d, e) {
                d.__proto__ = m, d.$modalInstance = e, d.isAdd = !c;
                var f = c && c.dns && c.gateway ? "WLAN" : "LAN";
                d.op = { T: a || "ETHERNET", t: b, x: f, way: angular.copy(c || {}) }, d.done = function() {
                    d.validForm();
                    var a = d.op;
                    d.isAdd && (a.way.enable = !1), d.isAdd || delete d.gateway[a.T][b], (d.gateway[a.T] || (d.gateway[a.T] = {}))[a.t] = d.op.way, i("gateway"), d.cancel()
                }
            }]
        })
    }, a.del_way = function(b, c, d) { a.confirmInvoke({ title: " 删除网关: " + c, note: "确认要删除该网关吗?" }, function(d) { delete a.gateway[b][c], i("gateway"), d() }) }, a.updateSystem = function(b, c) {
        function e(a) {
            return d.$system.put(a).$promise
        }

        function f() {
            var b = a.daserver.params.driverid,
                c = { pk: a.station.uuid, driver_id: b },
                e = d.$system.assign(c).$promise;
            return e.then(function(c) { a.cmway_port = c.ret, a.op.enAblePlcProg = h.isEnablePlcProg(b) }), e
        }

        function g() {
            return i.network = angular.toJson({ daserver: a.daserver }), e(i).then(function(b) { j("daserver"), a.station.network = i.network })
        }
        var i = { uuid: a.station.uuid };
        "gatewayDevs" == b && (a.validForm(), i.network = angular.toJson({ devices: a.gatewayDevs }), e(i).then(function(b) { j("gatewayDevs"), a.station.network = i.network })), "daserver" == b && (a.validForm("form_daserver", c), 0 == a.station.state ? a.confirmInvoke({ title: "激活系统", note: "该系统处于未激活状态,确认要激活该系统吗?" }, function(b) { d.$system.active({ pk: a.station.uuid }, function(c) { a.station.state = 1, b(), f().then(function() { g().then(b) }) }, b) }) : 1 != a.station.state || a.cmway_port ? g() : f().then(function() { g() })), "gateway" == b && (a.validForm("form_gateway"), i.gateway = angular.toJson(a.gateway), e(i).then(function() { j("gateway"), a.station.gateway = i.gateway })), "profile" == b && (i.profile = a.profile.uuid, e(i).then(function() { j("profile"), a.station.profile = i.profile }).then(function() {}))
    }, a.d_stop = function() { d.$system.stop({ pk: a.station.uuid }, function(a) { angular.alert(angular.toJson(a)) }) }
}])





.controller("das_tag", ["$scope", "$source", "$state", "$q", function(a, b, c, d) {
    var e = a.station;
    if (a.$popNav(a.station.name + "(变量)", c), a.getDevName = function(b, c) {
            var d = b.connect.replace(/(\d+).(\d+)/, "$1");
            c.dev_name = a.deviceKV[d], b.type = c.dev_name ? b.type : null
        }, e.profile) {
        var f = b.$sysLogTag.get({ profile: e.profile }).$promise;
        d.all([f, a.l_m_P]).then(function(b) { a.systags = b[0].ret })
    } else b.$sysTag.get({ system_model: e.model }, function(b) { a.systags = b.ret })
}]).controller("das_trigger", ["$scope", "$source", "$state", "$sys", "$utils", function(a, b, c, d, e) {
    var f = a.station;
    a.$popNav(a.station.name + "(触发器)", c), a.page = {};
    var g = { itemsPerPage: d.itemsPerPage, profile: f.profile };
    a.loadPageData = function(c) { g.currentPage = c, b.$sysProfTrigger.get(g, function(b) { a.page.currentTarget = c, a.page.data = b.data, a.page.total = b.total }) }, a.conditions = e.triggerConditions, a.loadPageData(1)
}]).controller("das_message", ["$scope", "$source", "$state", function(a, b, c) {
    var d = a.station;
    a.$popNav(a.station.name + "(通知)", c), d.profile && b.$message.get({ profile_id: d.profile }, function(b) { a.messages = b.ret })
}]).controller("das_contact", ["$scope", "$source", "$state", "$http", "$interval", "$timeout", "$sessionStorage", function(a, b, c, d, e, f, g) {
    function h() { i = e(function() { g.connect_wate = --a.op.second, a.op.second <= 0 && (e.cancel(i), a.op.send = !1) }, 1e3) }
    a.$popNav(a.station.name + "(联系人)", c), a.op = { second: parseInt(g.connect_wate) || 0 };
    var i;
    a.op.second && (a.op.send = !0, h()), a.sendVer = function() { b.$note.get({ op: "connect", mobile_phone: a.C.mobile_phone }, function(b) { a.op.second = 120, a.op.send = !0, h() }) }, a.validVer = function(a) {
        return !0
    }, b.$contact.get({ pk: a.station.uuid }).$promise.then(function(c) {
        function d() { b.$contact.put({ pk: a.station.uuid }, a.C, function(a) { angular.alert("修改成功!") }) }

        function e() { a.C.system_id = a.station.uuid, b.$contact.save({ pk: a.station.uuid }, a.C, function(b) { a.C.contact_id = b.ret || a.C.contact_id, a.isAdd = !1, angular.alert("添加成功!") }) }
        a.isAdd = !c.ret, a.C = c.ret || {}, a.commit = function() { a.validForm(), (a.isAdd ? e : d)() }
    })
}]).controller("das_map", ["$scope", "$state", "$stateParams", "$map", "$localStorage", "$timeout", "$document", "$window", "$source", function(a, b, c, d, e, f, g, h, i) {
    function j(b) {
        var c = { uuid: a.station.uuid, latitude: b.lat, longitude: b.lng };
        i.$system.put(c, function(c) { a.station.latitude = b.lat, a.station.longitude = b.lng, p.clearOverlays(), q = d.mapMarker(b.lat, b.lng, a.station.name), k.apply(q), m.apply(q), p.addOverlay(q) })
    }

    function k() {
        var a = new BMap.ContextMenu;
        a.addItem(new BMap.MenuItem("移动位置", l.bind(this))), this.addContextMenu(a)
    }

    function l(a, b, c) { this.enableDragging(), this.removeContextMenu(), n.apply(this), this.setAnimation(2) }

    function m() {
        this.addEventListener("mouseup", function(b) {
            var c = b.currentTarget.point;
            a.$apply(function() { a.station.latitude = c.lat, a.station.longitude = c.lng })
        })
    }

    function n() {
        var a = new BMap.ContextMenu;
        a.addItem(new BMap.MenuItem("使用此新位置", o.bind(this))), this.addContextMenu(a)
    }

    function o(b) {
        var c = this,
            d = { uuid: a.station.uuid, longitude: b.lng, latitude: b.lat };
        i.$system.put(d, function(a) { c.setAnimation(0), c.disableDragging(), c.removeContextMenu(), k.apply(c) })
    }
    a.$popNav(a.station.name + "(地图)", b);
    var p, q, r;
    a.$on("$destroy", function() { $(window).off("resize") });
    var s = g.find("#station_map");
    s.css({ height: h.innerHeight - 175 }), $(h).on("resize", function() { s.css({ height: h.innerHeight - 175 }) }), a.pos = {}, a.createMap = function() { a.station.latitude && (q = d.mapMarker(a.station.latitude, a.station.longitude, a.station.name), k.apply(q), m.apply(q)), p = d.createMap("station_map", [q]), d.addSearch(p, "suggestId", "searchResultPanel"), r = new BMap.ContextMenu, r.addItem(new BMap.MenuItem("定位位于此处", j, 100)), p.addContextMenu(r) }, a.locatedStation = function() {
        var b = { uuid: a.station.uuid, longitude: a.station.longitude, latitude: a.station.latitude };
        return b.longitude && b.latitude ? void i.$system.put(b, function(b) { p.clearOverlays(), q = d.mapMarker(a.station.latitude, a.station.longitude, a.station.name), k.apply(q), m.apply(q), p.addOverlay(q), p.centerAndZoom(q.point) }) : void angular.alert("请正确输入坐标数据")
    }, a.removePostion = function() {
        var b = { uuid: a.station.uuid, longitude: "", latitude: "" };
        i.$system.put(b, function() { a.station.longitude = null, a.station.latitude = null, p.clearOverlays() })
    }
}]), angular.module("app.support", []).controller("tech", ["$scope", function(a) {}]).controller("techdetail", ["$scope", function(a) { a.data = ' <div><span style="line-height: 1.42857143;">1: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;fga3ef 1-- <script>alert(12) </script> ---</span><br>222</div>' }]), angular.module("app.directives", ["pascalprecht.translate"]).directive("popwin", ["$compile", "$templateCache", "$http", function(a, b, c) {
    return {
        restrict: "E",
        require: "?^ngModel",
        scope: {},
        template: ' <a class="glyphicon  glyphicon-edit m-l-xs  text-muted "  popover-placement="bottom"  popover-template =" pop.templateUrl "  popover-title=" {{ pop.title }}" />',
        link: function(a, b, c, d) {
            var e, f = c.prop,
                g = {};
            d.$formatters.push(function(b) { e = c.pk || "id", g[e] = b[e], a.$ov = { value: b[f] } }), a.done = function() { g[f] = a.$ov.value, b.parent().scope()[c.handler](g).then(function() { d.$modelValue[f] = a.$ov.value, d.$commitViewValue(), a.cancel() }) }
        },
        controller: ["$scope", "$element", "$attrs", "$timeout", function(a, b, c, d) {
            a.pop = { templateUrl: "athena/debris/_edit_field.html" }, a.cancel = function() {
                d(function() {
                    b.find(".glyphicon-edit");
                    b.find(".glyphicon-edit").trigger("click")
                }, 0)
            }
        }]
    }
}]).directive("uiModule", ["MODULE_CONFIG", "uiLoad", "$compile", function(a, b, c) {
    return {
        restrict: "A",
        compile: function(d, e) {
            var f = d.contents().clone();
            return function(d, e, g) { e.contents().remove(), b.load(a[g.uiModule]).then(function() { c(f)(d, function(a, b) { g.to ? $(g.to).append(a) : e.append(a) }) }) }
        }
    }
}]).directive("uiShift", ["$timeout", function(a) {
    return {
        restrict: "A",
        link: function(b, c, d) {
            function e() {
                a(function() {
                    var a = d.uiShift,
                        b = d.target;
                    h.hasClass("in") || h[a](b).addClass("in")
                })
            }

            function f() { g && g.prepend(c), !g && h.insertAfter(j), h.removeClass("in") }
            var g, h = $(c),
                i = $(window),
                j = h.prev(),
                k = i.width();
            !j.length && (g = h.parent()), 768 > k && e() || f(), i.resize(function() { k !== i.width() && a(function() { i.width() < 768 && e() || f(), k = i.width() }) })
        }
    }
}]).directive("uiToggleClass", ["$timeout", "$document", function(a, b) {
    return {
        restrict: "AC",
        link: function(a, b, c) {
            b.on("click", function(a) {
                function d(a, b) {
                    for (var c = new RegExp("\\s" + a.replace(/\*/g, "[A-Za-z0-9-_]+").split(" ").join("\\s|\\s") + "\\s", "g"), d = " " + $(b)[0].className + " "; c.test(d);) d = d.replace(c, " ");
                    $(b)[0].className = $.trim(d)
                }
                a.preventDefault();
                var e = c.uiToggleClass.split(","),
                    f = c.target && c.target.split(",") || Array(b),
                    g = 0;
                angular.forEach(e, function(a) {
                    var b = f[f.length && g]; - 1 !== a.indexOf("*") && d(a, b), $(b).toggleClass(a), g++
                }), $(b).toggleClass("active")
            })
        }
    }
}]).directive("uiNav", ["$timeout", function(a) {
    return {
        restrict: "AC",
        link: function(a, b, c) {
            var d, e = $(window),
                f = 768,
                g = $(".app-aside"),
                h = ".dropdown-backdrop";
            b.on("click", "a", function(a) {
                d && d.trigger("mouseleave.nav");
                var b = $(this);
                b.parent().siblings(".active").toggleClass("active"), b.next().is("ul") && b.parent().toggleClass("active") && a.preventDefault(), b.next().is("ul") || e.width() < f && $(".app-aside").removeClass("show off-screen")
            }), b.on("mouseenter", "a", function(a) {
                if (d && d.trigger("mouseleave.nav"), $(".app-aside-fixed.app-aside-folded").length && !(e.width() < f)) {
                    var b, c = $(a.target),
                        i = $(window).height(),
                        j = 50,
                        k = 150;
                    !c.is("a") && (c = c.closest("a")), c.next().is("ul") && (d = c.next(), c.parent().addClass("active"), b = c.parent().position().top + j, d.css("top", b), b + d.height() > i && d.css("bottom", 0), b + k > i && d.css("bottom", i - b - j).css("top", "auto"), d.appendTo(g), d.on("mouseleave.nav", function(a) { $(h).remove(), d.appendTo(c.parent()), d.off("mouseleave.nav").css("top", "auto").css("bottom", "auto"), c.parent().removeClass("active") }), $(".smart").length && $('<div class="dropdown-backdrop"/>').insertAfter(".app-aside").on("click", function(a) { a && a.trigger("mouseleave.nav") }))
                }
            }), g.on("mouseleave", function(a) { d && d.trigger("mouseleave.nav") })
        }
    }
}]).directive("uiScroll", ["$location", "$anchorScroll", function(a, b) {
    return { restrict: "AC", link: function(c, d, e) { d.on("click", function(c) { console.log(e.uiScroll), a.hash(e.uiScroll), b() }) } }
}]).directive("uiFullscreen", ["uiLoad", function(a) {
    return {
        restrict: "AC",
        template: '<i class="fa fa-expand fa-fw text"></i><i class="fa fa-compress fa-fw text-active"></i>',
        link: function(b, c, d) {
            c.addClass("hide"), a.load("lib/js/screenfull.min.js").then(function() {
                screenfull.enabled && c.removeClass("hide"), c.on("click", function() {
                    var a;
                    d.target && (a = $(d.target)[0]), c.toggleClass("active"), screenfull.toggle(a)
                })
            })
        }
    }
}]).directive("uiButterbar", ["$rootScope", "$location", "$anchorScroll", function(a, b, c) {
    return { restrict: "AC", template: '<span class="bar" ></span>', link: function(a, d, e) { d.addClass("butterbar hide"),
     a.$on("$stateChangeStart", function(a) { b.hash("app"), c(), d.removeClass("hide").addClass("active") }), a.$on("$stateChangeSuccess", function(a, b, c, e) { a.targetScope.$watch("$viewContentLoaded", function() { d.addClass("hide").removeClass("active") }) }) } }
}]).directive("setNgAnimate", ["$animate", function(a) {
    return {
        link: function(b, c, d) {
            b.$watch(function() {
                return b.$eval(d.setNgAnimate, b)
            }, function(b, d) { a.enabled(!!b, c) })
        }
    }
}]).directive("draggable", ["$document", function(a) {
    return function(b, c, d) {
        function e(a) { j = a.pageY - h, i = a.pageX - g, c.css({ top: j + "px", left: i + "px" }) }

        function f() { a.unbind("mousemove", e), a.unbind("mouseup", f) }
        var g = 0,
            h = 0,
            i = 0,
            j = 0;
        c.css({ position: "relative", border: "1px solid red", backgroundColor: "lightgrey", cursor: "pointer" }), c.on("mousedown", function(b) { b.preventDefault(), g = b.pageX - i, h = b.pageY - j, a.on("mousemove", e), a.on("mouseup", f) })
    }
}]).directive("token", ["$compile", "$timeout", function(a, b) {
    var c = '<i class="fa fa-spin hide fa-spinner pull-right" ></i>';
    return {
        restrict: "A",
        require: ["?^ngDisabled"],
        link: function(a, d, e, f) {
            d.css({ opacity: 1 }), void 0 != e.spinner && d.append(c), d.on("click", function() {
                var a = this;
                a.disabled = !0, $(a).find("i").toggleClass("show"), b(function() { a.disabled = !1, $(a).find("i").toggleClass("show") }, e.token || 2e3)
            })
        }
    }
}]).directive("mark", function() {
    return { restrict: "E", replace: !0, template: '<span class="text-danger font-bold">*</span>', link: function() {} }
}).directive("centered", ["$timeout", function(a) {
    return function(b, c, d) {
        var e, f, g;
        e = $(window).height(), g = $(window).scrollTop(), c.css({ display: "none" }), c.ready(function() { a(function() { f = c.height(), f ? c.offset({ top: e > f ? g + (e - f) / 2 : 0 }) : c.offset({ top: 10 }), c.css({ display: "block" }) }, 200) })
    }
}]).directive("wrap", function() {
    return
}).directive("wrapL", function() {
    var a = '<div class="form-group"><div class="col-sm-3 col-sm-offset-1 control-label"></div></div>';
    return function(b, c, d) { c.wrap(a) }
}).directive("tlWrap", ["$compile", "$translate", "valid", function(a, b, c) {
    return {
        restrict: "A",
        priority: 90,
        require: "?^ngModel",
        scope: !0,
        link: function(d, e, f, g) {
            var h, i, j = '<label class= " col-sm-3 col-sm-offset-1 control-label   "  >  <span   translate="' + f.label + '"  ></span>  </label>',
                k = ('<label class= " col-sm-3 col-sm-offset-1 control-label   "  >  <span   translate="' + f.label + '"  ></span>  <span class="text-danger font-bold">*</span> </label>', '<div class="form-group " ><div class=" col-sm-7"></div></div>');
            e.attr("required");
            e.is("input , textarea, select") && (i = "form-control", e.addClass(i).wrap(a(k)(d)), h = a(j)(d), e.parent().before(h), c(d, e, f, b, a, g))
        }
    }
}]).value("valid", function(a, b, c, d, e, f) {
    function g(c, f) {
        var g = d.instant("valid." + c);
        f && (g = g.replace("X", f)), b.after(e("<p class='text-danger m-n " + c + " '   ng-if=' m.$dirty &&  m.$error." + c + "' >" + g + " </p>")(a))
    }
    if (a.m = f, c.required)
        if (c.type) {
            var h = d.instant("valid." + c.type);
            b.after(e("<p class='text-danger' ng-if=' m.$dirty &&  m.$error.required' >" + h + " </p>")(a))
        } else g("required");
    c.type && g(c.type), c.max && g("max", c.max), c.min && g("min", c.min), c.ngMinlength && g("minlength", c.ngMinlength), c.ngMaxlength && g("maxlength", c.ngMaxlength)
}).directive("tlWrapL", ["$compile", "$translate", "valid", function(a, b, c) {
    return {
        restrict: "A",
        priority: 90,
        require: "ngModel",
        scope: { label: "@" },
        link: function(d, e, f, g) {
            var h, i, j = '<label class= " col-sm-3 control-label "  >  <span translate="' + f.label + '"  ></span>  </label>',
                k = ('<label class= " col-sm-3 control-label   "  >  <span translate="' + f.label + '"  ></span>  <span class="text-danger font-bold">*</span> </label>', '<div class="form-group"    ><div class=" col-sm-9"></div></div>'),
                l = (e.attr("required"), e[0].tagName);
            i = "INPUT" === l || "TEXTAREA" === l || "SELECT" === l ? "form-control" : " no-border", e.addClass(i).wrap(a(k)(d)), h = a(j)(d), e.parent().before(h), c(d, e, f, b, a, g)
        }
    }
}]).directive("hexSimulator", function() {
    return {
        restrict: "E",
        scope: { data: "=", notation: "=" },
        replace: !0,
        template: "<div  class='row hex' > <ul class='col-xs-2 col-xs-offset-2 text-right'> <li ng-if='notation>16' >高16位</li><li>低16位</li></ul><ul class=' col-xs-7 hex-ul ' > <li  ng-repeat='  b in byte track  by $index '   class='btn'     ng-class='{ \"btn-default\":b==0,\"btn-info\":b==1   ,\"m-l-sm\": !($index%8)  } '         ng-click = ' updataHex(  $index ) '   popover='{{notation -$index-1 || 0 }}' popover-trigger='mouseenter'   >     {{b}}     </li> </ul></div> ",
        link: function(a, b, c) {
            a.$watch("notation", function(b, c) {
                for (b != c && (a.data = void 0), a["byte"] = []; a["byte"].length < b;) a["byte"].unshift(0)
            }), a.$watch("data", function(b, c) {
                if (a["byte"] = [], b)
                    for (var d = parseInt(b, 16).toString(2), e = 0; e < d.length; ++e) a["byte"].push(parseInt(d[e]));
                for (; a["byte"].length < a.notation;) a["byte"].unshift(0)
            }), a.updataHex = function(b) { a["byte"][b] = a["byte"][b] ? 0 : 1, a.data = parseInt(a["byte"].join(""), 2).toString(16).toUpperCase() }
        }
    }
}).directive("nofocus", function() {
    return function(a, b) { b.focus(function() { $(this).blur() }) }
}).directive("html", ["$sce", function(a) {
    return function(a, b, c) {
        var d = $(a[c.html]);
        d.find("script").remove(), b.html(d)
    }
}]).directive("table", function() {
    return { restrict: "E", link: function(a, b, c) {} }
}).directive("params", ["$sys", "$translate", function(a, b) {
    var c, d, e, f, g;
    return function(h, i, j) {
        var k = h.$eval(j.params),
            l = angular.fromJson(k),
            m = [];
        h.dm && (e = h.dm, g = a.point, c = g[e.driver_id], c ? (angular.forEach(l, function(a, e) { d = c[e], "type_ex" == e ? m.push("额外配置值:" + a) : (f = b.instant("params." + e) + ":" + (d ? d[a].k : a), m.push(f)) }), i.text(m.join(" , "))) : (console.error("无匹配的驱动数据: 驱动 id =  ", e.driver_id, " 驱动版本 = ", e.driver_ver), i.text(k)))
    }
}]).directive("panelclass", function() {
    return function(a, b, c) { b.addClass(" col-md-7 col-md-offset-2 col-sm-10 col-sm-offset-1  col-xs-12 m-t") }
}).directive("tlDefault", ["$parse", function(a) {
    return {
        restrict: "A",
        require: "?^ngModel",
        priority: 110,
        link: function(b, c, d, e) {
            var f = (a(d.tlDefault)(b), a(d.tlDefault)(b) || d.tlDefault),
                g = a(d.ngModel)(b);
            f = g ? g : f, "number" == d.type || "Number" == d.type ? e.$setViewValue(f) : e.$setViewValue(f + ""), e.$render(), d.whenChange && e.$viewChangeListeners.push(function() { b.$eval(d.whenChange) })
        }
    }
}]).directive("acrollLimit", function() {
    var a = 2;
    return p_offset = 10,
        function(b, c, d) { d.$attr.temp ? b.$index % a === 0 && c.addClass("temp") : b.$index % p_offset === 0 && c.addClass("point") }
}).directive("loadMask", ["$timeout", function(a) {
    return {
        restrict: "A",
        link: function(a, b, c) {
            function d() { f.addClass("show") }

            function e() { f.removeClass("show") }
            var f = $('<i class="fa fa-spin fa-3x  text-info fa-spinner hide pos-abt" style="top:50%;left:50%;z-index:9999" ></i>'),
                g = c.loadMask || "showMask";
            b.append(f), a.$watch(g, function(a) {
                (a ? d : e)()
            })
        }
    }
}]).directive("tlSel", function() {
    return { restrict: "A", translate: !0, scope: !0, template: '<div class="form-group col-md-4"><label>{{label}}</label> {{translate}} </div>', link: function(a, b, c) { alert(888), a.label = c.label } }
}), angular.module("app.filters", []).filter("fromNow", function() {
    return function(a) {
        return moment(a).fromNow()
    }
}).filter("hour", function() {
    return function(a) {
        return a + "时"
    }
}).filter("log_cycle", function() {
    return function(a) {
        return a ? 60 >= a ? a + "秒" : a / 60 + "分钟" : "不保存历史"
    }
}).filter("params", ["$sys", "$translate", function(a, b) {
    return function(a) {
        var c, d;
        a = angular.fromJson(a);
        var e = [];
        for (c in a) d = b.instant("params." + c), e.push(d + "=" + a[c]);
        return e.join(", ")
    }
}]).filter("pageLimit", ["$sys", function(a) {
    var b = a.pager.itemsPerPage;
    return function(a, c) {
        return s = (c - 1) * b, a.slice(s, s + b)
    }
}]).filter("acrollLimit", function() {
    return function(a, b, c) {
        return a
    }
}).filter("driverValueTrans", ["$sys", function(a) {
    return function(b, c, d, e) {
        return console._log(b, "---", c, "---", d, "----", e), "device" === d ? a.device_modbus[b + ""] ? a.device_modbus[b + ""][c].k : c : "log" === d ? a.temp_point[0][b] ? a.temp_point[0][b][c].k : c : "alarm" === d ? c : c
    }
}]), angular.module("app.services", ["ngResource"], function() { ingorErr = { DEVICE_NOT_EXIST: !0, ER_CONTACT_NOT_EXIST: !0, ER_SYSTEM_HAS_NOT_BOUND: !0, ACK_MESSAGE_NOT_EXIST: !0 }, angular.rootUrl = "node/" }).service("$source", ["$resource", function(a) {
    function b(b, c, d) {
        return a(angular.rootUrl + b, c, d)
    }
    this.$deviceModel = b("devmodel/:pk"), this.$dmPoint = b("devmodel/points/:pk"), this.$sysProfile = b("profile/:pk"), this.$sysLogTag = b("profile/tags/:pk"), this.$sysTag = b("sysmodel/tags/:pk"), this.$sysProfTrigger = b("profile/triggers/:pk"), this.$sysModel = b("sysmodel/:pk"), this.$sysDevice = b("sysmodel/devices/:pk"), this.$message = b("sysmodel/messages/:pk"), this.$contact = b("system/contacts/:pk"), this.$region = b("region/:pk/:op"), this.$account = b("account/:pk"), this.$role = b("role/:pk"), this.$driver = b("driver/:type"), this.$sub = b("subscribe/:pk/:op"), this.$note = b("sms/:op/:sou"), this.$common = b("common/:op", {}, { verifyUuid: { params: { op: "vuuid" } }, verify: { url: angular.rootUrl + "common/verify" } }), this.$user = b("user/:pk/:op", {}, { login: { url: angular.rootUrl + "common/login", method: "POST" }, logout: { url: angular.rootUrl + "user/logout" } }), this.$userGroup = b("usergroup/:pk/:userid", {}, { queryUser: { url: angular.rootUrl + "usergroup/:pk/users" } }), this.$ticket = b("ticket/:system_id"), 

    this.$system = b("system/:pk/:options/:proj_id", {}, {
                    

                    setPLC: { method: "PUT", params: { options: "set_plc_prog" } }, 
                    getPLC: { params: { options: "get_plc_prog" } },

                    sync: { method: "GET", params: { options: "sync" } },
                    stop: { method: "GET", params: { cmd: "stop" } },
                    start: { method: "GET", params: { cmd: "start" } },
                    call: { method: "POST" },
                    active: { params: { options: "active" } },
                    deactive: { params: { options: "deactive" } },
                    assign: { params: { options: "assign" } },
                    getDtuServer: { method: "GET" },
                    status: { method: "POST", params: { options: "status" } },
                    needSync: { method: "POST", params: { options: "needsync" } }
                 }),

    this.$permission = b("permission/:source/:source_id/:group_id")
 }])

.service("$show", ["$resource", function(a) {
    var b = angular.rootUrl + "show/live/:uuid",
        c = angular.rootUrl + "show/livewrite/:uuid",
        d = angular.rootUrl + "line/:uuid/:method",
        e = angular.rootUrl + "show/alarm/:uuid/:op";
    this.live = a(b), this.his = a(d), this.alarm = a(e, {}, { conform: { method: "POST", params: { uuid: "confirm" } }, getConformMsg: { params: { uuid: "confirm" } } }), this.liveWrite = a(c)
}]).factory("jsorder", ["$sys", "$cookies", function(a, b) {
    return { login: function() { console.log(b), window.location.hash = "#/access/signin" } }
}]).factory("Interceptor", ["$q", "jsorder", "$location", "$anchorScroll", "$timeout", "$sys", function(a, b, c, d, e, f) {
    var g, h = 0,
        i = !1,
        j = [];
    return {
        request: function(b) {
            return ++h, f.$debug && !i && (i = !i, j = j.length ? j : $("#ajax_modal")), /(.html)$/.test(b.url) || (b.headers["Accept-Language"] = localStorage.NG_TRANSLATE_LANG_KEY || "en", b.console = !0), b || a.when(b)
        },
        response: function(a) {
            var c = a.data;
            if (f.$debug && !--h && (e.cancel(g), g = e(function() { i = !i }, 100)), c.err && (console.error("_ERR_:" + c.err), !ingorErr[c.err])) throw angular.alert({ type: "resp_err", title: c.err }), c;
            return 0 == c.total && 0 == c.data.length, c.order && b[c.order](), a
        },
        responseError: function(a) {
            if (--h || (e.cancel(g), g = e(function() { j.addClass("hide").removeClass("active"), i = !1 }, 200)), a.config.console) throw a.status + "--" + a;
            return a
        }
    }
}]).factory("$brower", ["$window", function(a) {
    function b(a) {
        var b = a.navigator.userAgent || a.navigator.vendor || a.opera;
        return /iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/.test(b)
    }
    var c, d = {},
        e = navigator.userAgent.toLowerCase();
    return (c = e.match(/rv:([\d.]+)\) like gecko/)) ? d.ie = c[1] : (c = e.match(/msie ([\d.]+)/)) ? d.ie = c[1] : (c = e.match(/firefox\/([\d.]+)/)) ? d.firefox = c[1] : (c = e.match(/chrome\/([\d.]+)/)) ? d.chrome = c[1] : (c = e.match(/opera.([\d.]+)/)) ? d.opera = c[1] : (c = e.match(/version\/([\d.]+).*safari/)) ? d.safari = c[1] : 0, d.isSmart = b(a), d
}])

.factory("$utils", function( $sys ) {
    return {

        // 添加 函数; 
        isEnablePlcProg: function(a) {
            return $sys.plcProg.indexOf(a) >= 0
        },

        triggerConditions: function(a) {
            var b = angular.copy(a);
            angular.isString(b) && (b = angular.fromJson(b), console.log(b));
            var c, d = [];
            return $.each(b, function(a, b) { c = b.exp, d.push(b.verb || ""), d.push(c.left.args), d.push(c.op), d.push(c.right.args) }), d.join(" ")
        },
        copyProp: function() {
            var a, b, c = {};
            return a = arguments[0], b = Array.prototype.splice.call(arguments, 1), b.forEach(function(b, d, e) { c[b] = angular.copy(a[b]) }), c
        },
        findTempByid: function(a, b) {
            var c;
            return $.each(a, function(a, d) {
                return d.template_id == b ? (c = d, !1) : void 0
            }), c
        },
        containTemp: function(a, b) {
            var c = !1;
            return $.each(a, function(a, d) {
                return d.template_id == b ? (c = !0, !1) : void 0
            }), c
        }
    }
}).service("$map", ["$http", "$templateCache", "$sys", "$filter", "$interpolate", function(a, b, c, d, e) {
    function f(c, f) {
        var g = [];
        return angular.forEach(c, function(c, f) {
            if (c.latitude) {
                var i = h.mapMarker(c.latitude, c.longitude, c.name);
                ! function(c) {
                    i.addEventListener("click", function(f) {
                        var g = this;
                        a({ method: "GET", url: "athena/dastation/prop_map_popup.html", cache: b }).success(function(a) {
                            var b = angular.copy(c);
                            b.create_time = d("date")(b.create_time, "yyyy-MM-dd hh:mm:ss");
                            var f = e(a)(b),
                                h = new BMap.InfoWindow(f);
                            g.openInfoWindow(h)
                        }).error(function(a) {
                            throw alert("error"), "加载异常  athena/views/dastation/prop_map_popup.html?"
                        })
                    })
                }(c), g.push(i)
            }
        }), g
    }

    function g(a, b) {
        if (b && b[0]) angular.forEach(b, function(b, c) { 0 == c && a.centerAndZoom(b.point, 12), a.addOverlay(b) });
        else {
            var c = new BMap.LocalCity;
            c.get(function(b) { a.centerAndZoom(b.center, 12), a.setCurrentCity(b.name) })
        }
    }
    var h = this;
    this.createMap = function(a, b) {
        var c = new BMap.Map(a);
        g(c, b), c.enableScrollWheelZoom(!0);
        var d = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_TOP_LEFT }),
            e = new BMap.NavigationControl;
        new BMap.NavigationControl({ anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL });
        return c.addControl(d), c.addControl(e), c
    }, this.flushMarkers = function(a, b) { a.clearOverlays(), g(a, f(b)) }, this.mapMarker = function(a, b, c) {
        var d = new BMap.Marker(new BMap.Point(b, a));
        return c && (label = new BMap.Label(c, { offset: new BMap.Size(20, -10) }), label.setStyle({ "border-width": 0, "font-weight": 700 }), d.setLabel(label)), d
    }, this.addSearch = function(a, b, c) {
        function d(a) {
            return document.getElementById(a)
        }

        function e() {
            function b() {
                var b = c.getResults().getPoi(0).point;
                a.centerAndZoom(b, 18)
            }
            a.clearOverlays();
            var c = new BMap.LocalSearch(a, { onSearchComplete: b });
            c.search(g)
        }
        var f = new BMap.Autocomplete({ input: b, location: a });
        f.addEventListener("onhighlight", function(a) {
            var b = "",
                c = a.fromitem.value,
                e = "";
            a.fromitem.index > -1 && (e = c.province + c.city + c.district + c.street + c.business), b = "FromItem<br />index = " + a.fromitem.index + "<br />value = " + e, e = "", a.toitem.index > -1 && (c = a.toitem.value, e = c.province + c.city + c.district + c.street + c.business), b += "<br />ToItem<br />index = " + a.toitem.index + "<br />value = " + e, d("searchResultPanel").innerHTML = b
        });
        var g;
        f.addEventListener("onconfirm", function(a) {
            var b = a.item.value;
            g = b.province + b.city + b.district + b.street + b.business, d(c).innerHTML = "onconfirm<br />index = " + a.item.index + "<br />myValue = " + g, e()
        })
    }, this.initMap = function(a, b, c, d, e) {
        var g, i, j;
        return g = $("#" + c), a.$on("$destroy", function() { $(window).off("resize") }), g.css({ height: window.innerHeight - d }), $(window).on("resize", function() { g.css({ height: window.innerHeight - d }) }), i = f(b, e), j = h.createMap(c, i)
    }
}]).factory("$workerConfig", function() {
    return { baseUrl: "athena/webworker/" }
}).factory("$webWorker", ["$q", "$workerConfig", function(a, b) {
    return function(c) {
        var d = new Worker(b.baseUrl + c),
            e = a.defer();
        return d.addEventListener("message", function(a) { e.resolve(a.data) }, !1), {
            postMessage: function() {
                return e = a.defer(), d.postMessage(arguments), e.promise
            },
            terminate: function() { d.terminate() }
        }
    }
}]), angular.module("app.sysconfig", [], function() {})

.service("$sys", ["$translate", function(a) {
    return {
        manageMode: 1,
        // plc 编程 的 driver_id; 
        plcProg: ["DTU_ETUNG"],

        itemsPerPage: 20,
        state_inter_time: 6e4,
        yesOrNo: [{ k: "是", v: 1 }, { k: "否", v: 0 }],
        sysState: { "激活": 1, "未激活": [0, 2] },
       
        permissionDesc: { READ_DATA: "读取系统变量的数据", WRITE_DATA: "将数据写入系统变量中", ALARM_VIEW: "查看系统产生的报警", ACK_ALARM: "确认系统产生的报警", SYSTEM_MANAGE: "创建、删除系统，修改系统基本信息", TICKET_MANAGE: "创建及删除系统的ticket", REGION_USER_MANAGE: "为区域创建用户，以及管理用户权限", SYN_CONFIG: "将系统工程同步到DAServer或网关", SYSTEM_CONTROL: "系统数据下置及召唤，系统的激活及失效，切换系统配置项，保存网络参数等", PLC_PROGRAMMING: "PLC编程", REGION_MANAGE: "创建、删除区域，修改区域基本信息", MODEL_MANAGE: "创建、修改以及删除系统模型和设备模型", USER_MANAGE: "创建、删除用户，修改用户基本信息以及管理用户权限", ROLE_MANAGE: "创建、修改以及删除角色" },
        accountP: ["REGION_MANAGE", "MODEL_MANAGE", "USER_MANAGE"], 
        regionP: ["READ_DATA", "WRITE_DATA", "ALARM_VIEW", "ACK_ALARM", "SYSTEM_MANAGE", "TICKET_MANAGE", "REGION_USER_MANAGE", "SYN_CONFIG", "SYSTEM_CONTROL", "PLC_PROGRAMMING"],


        plotChartConfig: { colors: ["#23b7e5"], series: { points: { radius: 1, show: !0, fill: !0, fillColor: "red" }, lines: { show: !0 } }, grid: { hoverable: !0, clickable: !0, borderWidth: 1, color: "#ccc" }, tooltip: !0, xaxis: { mode: "time" }, yaxis: { tickDecimals: 4 }, legend: { position: "nw", show: !0 }, tooltipOpts: { content: "%x - %y", defaultTheme: !1, shifts: { x: 0, y: 15 } } },
        roleType: { "账户角色": 0, "区域角色": 1 },
        rootState: "app.m_region",
        alarmtype: { defalut: 0, values: [{ k: "越限值报警 > ", v: 0 }, { k: "越限值报警 >= ", v: 1 }, { k: "越限值报警 <", v: 2 }, { k: "越限值报警 <=", v: 3 }, { k: "变化报警  = ", v: 4 }, { k: "变化报警 !=", v: 5 }, { k: "位报警 按位与", v: 6 }, { k: "位报警 按位或", v: 7 }, { k: "位报警 按位异或", v: 8 }, { k: "位报警 按位与 取反", v: 9 }, { k: "位报警 按位或 取反 ", v: 10 }, { k: "位报警 按位异或 取反", v: 11 }] },
        trigger: { origin_default: "0", origin: { 0: "ThingLinx Cloud" }, action_default: "alarm", action: { alarm: "Alarm" }, action_alarm: "alarm", action_event: "event", action_task: "task", type_default: "1", type: { 0: "状态持续触发", 1: "状态变化触发" }, fn_default: "PV", fn: { PV: "PV" }, op_default: ">", op: [">", "<", "==", ">=", "<=", "!=", "&", "|", "xor"], verb_default: "and", verb: ["and", "or"], severity_default: "0", severity: { 0: "不确定的", 1: "紧急的", 2: "重要的", 3: "一般的", 4: "警告" }, class_id_default: "1", class_id: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], desc: "" },
        trigger_c: { exp: { left: { fn: "PV", args: null }, op: ">=", right: { fn: "PV", args: null } } },
        sysManageMode: 1,
        sysModelMode: { "default": "1", values: { 1: "托管模式", 2: "非托管模式" } },
        save_his: { desc: " prof pint 是否保存历史!", "default": 0, values: [{ v: 0, k: "不保存历史" }, { v: 1, k: "保存历史" }] },
        log_period: { desc: " prof pint 的 日志周期!", "default": 300, values: [{ v: "60", k: "1分钟" }, { v: "300", k: "5分钟" }, { v: "600", k: "10分钟" }, { v: "900", k: "15分钟" }, { v: "1800", k: "30分钟" }, { v: "3600", k: "60分钟" }] },
        log_type: { "default": "", values: { RAW: "周期保存", CHANGED: "变化时保存" } },
        device_type: [],

        device: {
            entity: { dev_cycle: 2, cycle_unit: 1, slow_cycle: 59, slow_cycle_unit: 1, dev_timeout: 15, dev_retry: 1, delay: 1 },
            timeUnit: [{ k: "Second", v: 0 }, { k: "Minute", v: 1 }, { k: "Hour", v: 2 }],
            PI_SHCYA: { entity: { params: { link_address: 2 } } },

            FCS_MODBUS: { entity: { params: { address: 1, protocol_type: 0, offset_format: 0, max_packet_length: 64, packet_offset: 4, int_order: 0, int64_order: 0, float_order: 0, double_order: 0, crc_order: 0 } }, protocol: [{ k: "ModbusRtu", v: 0 }, { k: "ModbusTcp", v: 1 }], offsetformat: [{ k: "10进制", v: 0 }, { k: "Modbus格式", v: 1 }], reglength: [{ k: "1 字节", v: 0 }, { k: "2 字节", v: 1 }, { k: "4 字节", v: 2 }], order_a: [{ k: "FFH4_FFH3_FFH2_FFH1", v: 0 }, { k: "FFH3_FFH4_FFH1_FFH2", v: 1 }, { k: "FFH1_FFH2_FFH3_FFH4", v: 2 }, { k: "FFH2_FFH1_FFH4_FFH3", v: 3 }], order_b: [{ k: "正序", v: 0 }, { k: "逆序", v: 1 }], order_c: [{ k: "高前低后", v: 0 }, { k: "低前高后", v: 1 }] },

            PLC_SIEMENS_PPI: { entity: { params: { address: 1, max_packet_length: 150, packet_offset: 10 } } },

            PLC_MITSUBISHI_FX_COM: { entity: { params: { address: 1, type: 2, format: 1, sum: 1 } } },
           
            PLC_MITSUBISHI_FX_PG: { entity: { params: { type: 0 } } }
        },

        point: {
            entity: { poll: 0, is_packet: 0 },
            pointPoll: [{ k: "Normal", v: 0 }, { k: "Slow", v: 1 }, { k: "Call", v: 2 }],
            packet: [{ k: "False", v: 0 }, { k: "True", v: 1 }],

            PI_SHCYA: { th: ["app_address", "type_id", "infor_address"], entity: { params: { app_address: 1, type_id: 0, infor_address: 1 } }, type_id: [{ v: 0, k: "遥信" }] },

            FCS_MODBUS: {
                th: ["area", "offset", "type", "type_ex", "access"],
                entity: { params: { area: 0, offset: 0, type: 0, type_ex: 0, access: 0 } },
                AreaCC: function(a, b, c) {
                    function d() {
                        return 0 == a.params.area || 1 == a.params.area ? [{ k: "Bool", v: 0 }] : f
                    }

                    function e() {
                        return 0 == a.params.area || 2 == a.params.area ? g : [{ v: 0, k: "Read" }]
                    } 
                    var f = this.type,
                        g = this.access;
                    if (c ? (b._dataType = d(), b._accerssType = e()) : (b.$parent._dataType = d(), b.$parent._accerssType = e()), !c) {
                        a.params.area < 2 ? (a.params.type = 0, a.params.type_ex = 0) : (a.params.type = 3, a.params.type_ex = 0);
                        var h = { 1: 0, 3: 0, 0: 2, 2: 2 };
                        a.params.access = h[a.params.area]
                    }
                },
                TypeCC: function(a) {},
                type: [{ k: "Bool", v: 0 }, { k: "Char", v: 1 }, { k: "Byte", v: 2 }, { k: "Short", v: 3 }, { k: "Word", v: 4 }, { k: "Int", v: 5 }, { k: "DWord", v: 6 }, { k: "Float", v: 7 }, { k: "BCD码", v: 8 }, { k: "Int64", v: 9 }, { k: "UInt64", v: 10 }, { k: "Double", v: 11 }, { k: "String", v: 12 }, { k: "Buffer", v: 13 }],
                area: [{ k: "CO区", v: 0 }, { k: "DI区", v: 1 }, { k: "HR区", v: 2 }, { k: "AI区", v: 3 }],
                hlbyte: [{ k: "HightByte", v: 0 }, { k: "LowByte", v: 1 }],
                access: [{ k: "Read", v: 0 }, { k: "Write", v: 1 }, { k: "ReadWrite", v: 2 }]
            },

            PLC_SIEMENS_PPI: {
                th: ["area", "offset", "type", "type_ex"],
                entity: { params: { area: 0, offset: 0, type: 0, type_ex: 0 } },
                areaCC: function(a, b, c) {
                    function d(b) { c ? a._dataType = b : a.$parent._dataType = b }
                    var e, f = this.type,
                        g = b.params.area;
                    3 >= (g >= 0) && (e = angular.copy(this.type), e.splice(9, 1), d(e), !c && (b.params.type = 0)), 4 == g && (d(f), !c && (b.params.type = 0)), (5 == g || 9 == g) && (d([f[6], f[7], f[8]]), !c && (b.params.type = 6)), (6 == g || 8 == g) && !c && (b.params.type = 0, b.params.type_ex = 0), (7 == g || 10 == g || 11 == g) && (d([f[3], f[4], f[5]]), !c && (b.params.type = 3))
                },
                typeCC: function(a) {
                    var b = (a.params.area, a.params.type);
                    return 0 == b ? void(a.params.type_ex = 0) : 9 == b ? void(a.params.type_ex = 1) : void(a.params.type_ex = 0)
                },
                area: [{ k: "I 离散输入", v: 0 }, { k: "Q 离散输出", v: 1 }, { k: "M 内部内存位", v: 2 }, { k: "SM 特殊内存位", v: 3 }, { k: "V 内存变量", v: 4 }, { k: "T 定时器当前值", v: 5 }, { k: "T 定时器位", v: 6 }, { k: "C 计数器当前值", v: 7 }, { k: "C 计数器位", v: 8 }, { k: "HC 高速计数器当前值", v: 9 }, { k: "AI 模拟输入", v: 10 }, { k: "AO 模拟输出", v: 11 }],
                type: [{ k: "BIT(位 0~7)", v: 0 }, { k: "BY (8位无符号整型,0~255)", v: 1 }, { k: "CH (8位有符号整型,-128~127)", v: 2 }, { k: "US (16位无符号整型, 0~65535)", v: 3 }, { k: "SS (16位有符号整型, -32768~32767)", v: 4 }, { k: "SB (16位 BCD 整型, 0~9999)", v: 5 }, { k: "LG (32位长整型, -2147483648~2147483647)", v: 6 }, { k: "LB (32位 BCD 格式整型 , 0~99999999)", v: 7 }, { k: "FL (32位IEEE格式单精度浮点型)", v: 8 }, { k: "STR(ASCII 字符串型,1~127个字符)", v: 9 }]
            },

            PLC_MITSUBISHI_FX_PG: {
                th: ["area", "offset", "type", "type_ex"],
                entity: { params: { area: 0, offset: 0, type: 0, type_ex: 0, access: 0 } },
                area: [{ k: "X-开关量输入", v: 0 }, { k: "Y-开关量输出", v: 1 }, { k: "M-辅组继电器", v: 2 }, { k: "S-状态寄存器", v: 3 }, { k: "T-定时器接点", v: 4 }, { k: "C-计数器接点", v: 5 }, { k: "D-数据寄存器", v: 6 }, { k: "SM-特殊辅组继电器", v: 7 }, { k: "TN-定时器当前值", v: 8 }, { k: "CN-计数器当前值", v: 9 }],
                type: [{ k: "位读写", v: 0 }, { k: "8位有符号", v: 1 }, { k: "8位无符号", v: 2 }, { k: "16位有符号", v: 3 }, { k: "16位无符号", v: 4 }, { k: "32位有符号", v: 5 }, { k: "32位无符号", v: 6 }, { k: "32位浮点数", v: 7 }, { k: "16位BCD", v: 8 }, { k: "32位BCD", v: 9 }, { k: "浮点数BCD", v: 10 }, { k: "字符串", v: 11 }],
                access: [
                    { k: "Read", v: 0 },
                    { k: "Write", v: 1 },
                    { k: "ReadWrite", v: 2 }
                ],
                hlbyte: [{ k: "HightByte", v: 0 },
                    { k: "LowByte", v: 1 }
                ],
                AreaCC: function(a, b, c) {
                    var d = { 6: !0, 8: !0, 9: !0 },
                        e = { 0: !0, 4: !0, 5: !0, 8: !0, 9: !0 },
                        f = a.params.area;


                    b = c ? b : b.$parent;

                    d[f] ? b._dataType = this.type : (
                            b._dataType = [{ k: "位读写", v: 0 }], !c && (a.params.type = 0)
                        ),
                        e[f] ? (b._accessType = [{ k: "Read", v: 0 }], !c && (a.params.access = 0)) : b._accessType = this.access


                },
                TypeCC: function(a) {
                    var b = (a.params.area, a.params.type);
                    return 0 == b ? void(a.params.type_ex = 0) : 11 == b ? void(a.params.type_ex = 1) : 1 == b || 2 == b ? void(a.params.type_ex = 1) : void(a.params.type_ex = 0)
                }
            },

            PLC_MITSUBISHI_FX_COM: {
                th: ["area", "offset", "type", "type_ex"],
                entity: { params: { area: 0, offset: 0, type: 0, type_ex: 0, access: 0 } },
                access: [{ k: "Read", v: 0 }, { k: "Write", v: 1 }, { k: "ReadWrite", v: 2 }],
                hlbyte: [{ k: "HightByte", v: 0 }, { k: "LowByte", v: 1 }],
                area: [{ k: "X-开关量输入", v: 0 }, { k: "Y-开关量输出", v: 1 }, { k: "M-辅组继电器", v: 2 }, { k: "S-状态寄存器", v: 3 }, { k: "SM-特殊辅组继电器", v: 4 }, { k: "T-定时器接点", v: 5 }, { k: "C-计数器接点", v: 6 }, { k: "D-数据寄存器", v: 7 }, { k: "TN-定时器当前值", v: 8 }, { k: "CN-计数器当前值", v: 9 }],
                type: [{ k: "位读写", v: 0 }, { k: "8位有符号", v: 1 }, { k: "8位无符号", v: 2 }, { k: "16位有符号", v: 3 }, { k: "16位无符号", v: 4 }, { k: "32位有符号", v: 5 }, { k: "32位无符号", v: 6 }, { k: "32位浮点数", v: 7 }, { k: "16位BCD", v: 8 }, { k: "32位BCD", v: 9 }, { k: "浮点数BCD", v: 10 }, { k: "字符串", v: 11 }],
                areaCC: function(a, b, c) {
                    var d = { 7: !0, 8: !0, 9: !0 },
                        e = { 0: !0, 5: !0, 6: !0, 8: !0, 9: !0 },
                        f = a.params.area;
                    
                        b =  c? b:b.$parent ;

                    d[f] ? b._dataType = this.type : (b._dataType = [{ k: "位读写", v: 0 }], !c && (a.params.type = 0)), e[f] ? (b._accessType = [{ k: "Read", v: 0 }], !c && (a.params.access = 0)) : b._accessType = this.access
                
                },

                typeCC: function(a) {
                    var b = (a.params.area, a.params.type);
                    return 0 == b ? void(a.params.type_ex = 0) : 11 == b ? void(a.params.type_ex = 1) : 1 == b || 2 == b ? void(a.params.type_ex = 1) : void(a.params.type_ex = 0)
                }
            }

        },
        tag: { type: ["Analog", "Digital"] },
        message: { entity: { user_category: "0" }, category: { 0: "平台用户", 1: "联系人用户" } },
        gateway: { types: { RS232_1: "RS232", RS232_2: "RS232", RS232_3: "RS232", RS232_4: "RS232", RS485_1: "RS485", RS485_2: "RS485", RS422_1: "RS422", RS422_2: "RS422" }, baud_rate: [1200, 2400, 4800, 9600, 19200, 38400], data_bits: [7, 8], stop_bits: [1, 2], parity: { none: "无校验", even: "偶校验", odd: "奇校验" }, gps_distance: [50, 100, 250, 500], gps_baud_rate: [300, 600, 1200, 2400, 4800, 9600, 19200], entity: { enable: !0, baud_rate: 9600, data_bits: 8, stop_bits: 1, parity: "none", delay: 10 } },
        desc: ""
    }
}]);
var app = angular.module("thinglinx", ["ngAnimate", "ngCookies", "ngMessages", "ngStorage", "ui.router", "ui.bootstrap", "ui.bootstrap.datetimepicker", "ui.load", "ui.jq", "ui.validate", "pascalprecht.translate", "app.basecontroller", "app.account", "app.model.device", "app.model.system", "app.project", "app.show.proj", "app.show.system", "app.system", "app.system.prop", "app.support", "app.directives", "app.filters", "app.services", "app.sysconfig"]).run(["$rootScope", "$state", "$stateParams", "$sys", "$compile", "$localStorage", "$cacheFactory", "$translate", "$sce", "$sessionStorage", function(a, b, c, d, e, f, g, h, i, j) { $("#preload").fadeOut("slow"), a.$state = b, a.$stateParams = c, a.$sys = d, a.$translate = h, a.$sceHtml = i.trustAsHtml, a.$session = j, a.fromJson = angular.fromJson, a.ossRoot = "http://thinglinx-net.oss-cn-beijing.aliyuncs.com/", window.onbeforeunload = function() { alert("关闭窗口") }, a.$debug = d.$debug, a.funtest = function() {} }]).config(["$stateProvider", "$urlRouterProvider", "$controllerProvider", "$compileProvider", "$filterProvider", "$provide", "$httpProvider", "$resourceProvider", function(a, b, c, d, e, f, g, h) {
    g.interceptors.push("Interceptor"), h.defaults.actions = { put: { method: "PUT" }, get: { method: "GET" }, post: { method: "POST" }, "delete": { method: "DELETE" }, remove: { method: "DELETE" }, getByPk: { method: "GET" }, delByPk: { method: "DELETE" }, save: { method: "POST" }, getArr: { method: "GET", isArray: !0 }, query: { method: "GET" } }, app.controller = c.register, app.directive = d.directive, app.filter = e.register, app.factory = f.factory, app.service = f.service, app.constant = f.constant, app.value = f.value, b.otherwise("/app"), a.state("app", {
        url: "/app",
        templateUrl: "athena/app.html",
        resolve: {
            $user: ["$source", function(a) {
                return a.$common.get({ op: "islogined" }).$promise
            }]
        },
        controller: ["$scope", "$state", "$sys", "$user", function(a, b, c, d) {
            var e = d.ret;
            e ? (e.sms_notice = !!e.sms_notice, e.mail_notice = !!e.mail_notice, a.user = e, a.$$user = e, b.is("app") ? b.go(c.rootState) : void 0, a.user = e) : b.go("access.signin")
        }]
    }).state("app.s_region", { url: "/s_region", controller: "manage_projs", data: { isShowModul: !0 }, templateUrl: "athena/region/project_temp.html" }).state("app.s_region_system", { url: "/s_region/{id}", data: { isShowModul: !0 }, controller: "dastation_ignore_active", templateUrl: "athena/show/region_system.html" }).state("app.s_system", { url: "/s_system", templateUrl: "athena/dastation/dastation_temp.html", data: { isShowModul: !0 }, controller: "dastation_ignore_active" }).state("app.s_system_prop", {
        url: "/s_system_prop/:uuid",
        resolve: {
            _$system: ["$source", "$stateParams", function(a, b) {
                return a.$system.get({ system_id: b.uuid, tag: !0 }).$promise
            }]
        },
        controller: "show_system_prop",
        templateUrl: "athena/show/system_prop.html"
    }).state("app.s_system_prop.basic", { url: "/_basic", templateUrl: "athena/show/system_prop_basic.html", controller: "show_system_basic" }).state("app.s_system_prop.current", { url: "/_current", templateUrl: "athena/show/system_prop_current.html", controller: "show_system_current" }).state("app.s_system_prop.history", { url: "/_history", templateUrl: "athena/show/system_prop_history.html", controller: "show_system_history" }).state("app.s_system_prop.alarm", { url: "/_alarm", templateUrl: "athena/show/system_prop_alarm.html", controller: "show_system_alarm" }).state("app.s_system_prop.map", { url: "/_map", templateUrl: "athena/show/system_prop_map.html", controller: "show_system_map" }).state("app.s_system_prop.panel", { url: "/_panel", templateUrl: "athena/show/system_prop_panel.html", controller: "show_system_panel" }).state("app.s_alarm", { url: "/alarm", templateUrl: "athena/show/alarm.html", controller: "show_alarm" }).state("app.my_detail", { url: "/userself", templateUrl: "athena/account/user_detail.html", controller: "account_userdetail" }).state("app.devmodel", { url: "/devmodel", templateUrl: "athena/template/template.html", controller: "devmodel" }).state("app.sysmodel", { url: "/sysmodel", templateUrl: "athena/sysmodel/sysmodel.html", controller: "sysmodel" }).state("app.sysmodel_p", { url: "/sysmodel_p/{uuid}", templateUrl: "athena/debris/_tabs.html", controller: "sysmodelProp" }).state("app.sysmodel_p.basic", { url: "/basic", templateUrl: "athena/sysmodel/sys_basic.html", controller: "sysmodel_basic" }).state("app.sysmodel_p.sysdevice", { url: "/sysdevice", templateUrl: "athena/sysmodel/sys_device.html", controller: "sysmodel_device" }).state("app.sysmodel_p.systag", { url: "/systag", templateUrl: "athena/sysmodel/sys_tag.html", controller: "sysmodel_tag" }).state("app.sysmodel_p.sysprofile", { url: "/sysprofile", templateUrl: "athena/sysmodel/sys_profile.html", controller: "sysmodel_profile" }).state("app.sysmodel_p.trigger", { url: "/trigger", templateUrl: "athena/sysmodel/sys_proftrigger.html", controller: "sysmodel_prof_trigger" }).state("app.sysmodel_p.message", { url: "/message", templateUrl: "athena/sysmodel/sys_message_center.html", controller: "sysmodel_message" }).state("app.sysmodel_p.gateway", { url: "/gateway", templateUrl: "athena/sysmodel/sys_gateway.html", controller: "sysmodel_gateway" }).state("app.sysmodel_p.panel", { url: "/panel", templateUrl: "athena/sysmodel/sys_panel.html", controller: "sysmodel_panel" }).state("app.m_region", { url: "/m_region", controller: "manage_projs", templateUrl: "athena/region/project_temp.html" }).state("app.m_region_prop", { url: "/m_regipn/{id}", controller: "proj_prop", templateUrl: "athena/region/pro_man_prop.html" }).state("app.m_region_prop.system", { url: "/system", controller: "dastation_ignore_active", templateUrl: "athena/dastation/dastation_temp_panel.html" }).state("app.m_region_prop.author", { url: "/author", controller: "proj_prop_author", templateUrl: "athena/region/prop_author.html" }).state("app.m_system", { url: "/m_system", controller: "dastation_ignore_active", templateUrl: "athena/dastation/dastation_temp.html" }).state("app.m_system_prop", { url: "/m_system/{uuid}", controller: "dastation_prop", templateUrl: "athena/dastation/dastation_prop.html" }).state("app.m_system_prop._basic", { url: "/_basic", controller: "das_basic", templateUrl: "athena/dastation/prop_basic.html" }).state("app.m_system_prop._config", { url: "/_config", controller: "das_config", templateUrl: "athena/dastation/prop_config.html" }).state("app.m_system_prop.tag", { url: "/_tag", controller: "das_tag", templateUrl: "athena/sysmodel/sys_tag.html" }).state("app.m_system_prop.trigger", { url: "/_trigger", controller: "das_trigger", templateUrl: "athena/sysmodel/sys_proftrigger.html" }).state("app.m_system_prop.message", { url: "/_message", controller: "das_message", templateUrl: "athena/sysmodel/sys_message_center.html" }).state("app.m_system_prop.contact", { url: "/_contact", templateUrl: "athena/dastation/prop_contact.html", controller: "das_contact" }).state("app.m_system_prop._map", { url: "/_map", controller: "das_map", templateUrl: "athena/dastation/prop_map.html" }).state("app.account.info", { url: "/info", controller: "account_info", templateUrl: "athena/account/info.html" }).state("app.user", { url: "/user", templateUrl: "athena/account/users.html", controller: "account_users" }).state("app.userdetail", { url: "/userdetail/:id", templateUrl: "athena/account/user_detail.html", controller: "account_userdetail" }).state("app.role", { url: "/role", templateUrl: "athena/account/role.html" }).state("app.role.region", { url: "/region", data: { role_category: 1 }, templateUrl: "athena/account/role_panel.html", controller: "role_ctrl" }).state("app.role.account", { url: "/account", data: { role_category: 0 }, templateUrl: "athena/account/role_panel.html", controller: "role_ctrl" }).state("app.account_info", { url: "/account", controller: "account_info", templateUrl: "athena/account/account_info.html" }).state("access", { url: "/access", template: '<div ui-view class="   h-full smooth"></div>', resolve: { $user: function() {} } }).state("access.signin", { url: "/signin", controller: "access_signin", templateUrl: "athena/page_signin.html" }).state("access.signup", { url: "/signup", controller: "access_signup", templateUrl: "athena/page_signup.html" }).state("access.forgotpwd", { url: "/forgotpwd", controller: "access_fogpas", templateUrl: "athena/page_forgotpwd.html" }).state("access.verifyemail", { url: "/verifyemail", controller: "verifyemail", templateUrl: "athena/page_verifyemail.html" }).state("access.404", { url: "/404", templateUrl: "tpl/page_404.html" }).state("conncet", {}).state("app.tech", { url: "/tech", templateUrl: "athena/support/tech.html", controller: "tech" }).state("app.tech_detail", { url: "/techdetail", templateUrl: "athena/support/techdetail.html", controller: "techdetail" }).state("protocol", {}).state("htlp", {})
}]).constant("JQ_CONFIG", { easyPieChart: ["lib/flot/jquery.easy-pie-chart.js"], chosen: ["lib/chosen/chosen.jquery.min.js", "lib/chosen/chosen.css"], filestyle: ["lib/file/bootstrap-filestyle.min.js"] }).config(["$translateProvider", function(a) { a.useStaticFilesLoader({ prefix: "l10n/", suffix: ".json" }), a.preferredLanguage("zh_CN"), a.useLocalStorage() }]);
angular.module("thinglinx").run(["$templateCache", function(a) {
    "use strict";
    a.put("athena/_device/FCS_MODBUS.html", '<div class=hide ng-init="   _config =  $sys.device[devModel.driver_id] ;  "></div><input tl-wrap label=设备地址 ng-model=D.params.address type=number max=254 min=1 placeholder=" 1 - 254 " required><select tl-wrap ng-model=D.params.protocol_type label=协议类型 ng-options=" o.v as o.k for  o in _config.protocol "></select><select tl-wrap ng-model=" D.params.offset_format" label=偏移格式 ng-options=" o.v as o.k for o in _config.offsetformat"></select><input tl-wrap ng-model=" D.params.max_packet_length" label=最大包长度 min=1 max=100 type=number required><input tl-wrap ng-model=" D.params.packet_offset" label=包偏移间隔 min=1 max=20 type=number required><select tl-wrap label=整数字节排序 ng-model=D.params.int_order ng-options=" o.v as o.k for  o in _config.order_a "></select><select tl-wrap label=浮点数字节排序 ng-model=D.params.float_order ng-options=" o.v as o.k for  o in _config.order_a "></select><select tl-wrap label=双精度字节排序 ng-model=D.params.double_order ng-options=" o.v as o.k for  o in _config.order_b "></select><select tl-wrap label=64位整数字节排序 ng-model=D.params.int64_order ng-options=" o.v as o.k for  o in _config.order_b "></select><select tl-wrap label=校验字节排序 ng-model=D.params.crc_order ng-options=" o.v as o.k for  o in _config.order_c "></select>'),
        a.put("athena/_device/PI_SHCYA.html", ' <input tl-wrap label=链路地址 ng-model=D.params.link_address type=number max=255 min=0 placeholder=" 0 - 255" required>'), a.put("athena/_device/PLC_SIEMENS_PPI.html", '<input tl-wrap label=目标地址 ng-model=D.params.address type=number max=254 min=1 placeholder=" 1 - 254 " required><input tl-wrap label=最大包长度 ng-model=D.params.max_packet_length type=number max=249 min=1 placeholder=" 1 - 249 " required><input tl-wrap label=包偏移间隔 ng-model=D.params.packet_offset type=number max=20 min=1 placeholder=" 1 - 20 " required>'), a.put("athena/_device/dev_network.html", "<div ng-init=\"  _$types = [ 'ETHERNET','RS232','RS485','RS422'  ] ; \r\n" + '                 _proto  = [\'tcp\' , \'udp\'] ;  "></div><select tl-wrap ng-options=" t for t in _$types" ng-model=" D.network.type" label=" 通信类型" ng-init=" filterChannel ( D.network.type , false ) " ng-change=" filterChannel ( D.network.type , true  ) "></select><div ng-if="  D.network.type == \'ETHERNET\' "><input tl-wrap ng-model=D.network.params.channel label=network tl-default=LAN_1 readonly><select tl-wrap ng-model=D.network.params.proto label=proto ng-options="  p for p in _proto" tl-default=tcp></select><input tl-wrap ng-model=D.network.params.ip label=ip required> <input tl-wrap ng-model=D.network.params.port label=port required></div><div ng-if="  D.network.type != \'ETHERNET\' "><select tl-wrap ng-model=D.network.params.channel ng-options=" k as k  for (k,v) in  _$channel " label=串口 required><option value="">请选择串口</option></select></div>'), a.put("athena/_dtu/DTU_ETUNG.html", "<input tl-wrap-l label=终端ID required ng-model=daserver.params.simid ng-change=\" toUpdate('daserver') \">"), a.put("athena/_dtu/DTU_HONGDIAN.html", "<input tl-wrap-l label=终端ID required ng-model=daserver.params.simid ng-change=\" toUpdate('daserver') \">"), a.put("athena/_dtu/DTU_SHCYA.html", " <input tl-wrap-l label=终端ID required ng-model=daserver.params.simid ng-change=\" toUpdate('daserver') \" ng-maxlength=14 ng-minlength=14>"), a.put("athena/_dtu/DTU_TEST.html", "<input tl-wrap-l label=终端ID required ng-model=daserver.params.simid ng-change=\" toUpdate('daserver') \">"), a.put("athena/_dtu/DTU_etung_test.html", "<input tl-wrap-l label=终端ID required ng-model=daserver.params.simid ng-change=\" toUpdate('daserver') \">"), a.put("athena/_dtu/DTU_hongdian_test.html", "<input tl-wrap-l label=终端ID required ng-model=daserver.params.simid ng-change=\" toUpdate('daserver') \">"),

        a.put("athena/_point/FCS_MODBUS.html", '<div class=hidden ng-init=" _config = $sys.point[ dm.driver_id] ;  _config.AreaCC( point , this  , true ) "></div><select tl-wrap label=数据区1 ng-model=point.params.area ng-change="   _config.AreaCC( point , this ) " ng-options="  o.v as o.k for  o in  _config.area  "></select><input tl-wrap label=偏移地址 required type=Number max=65535 min=0 ng-model="point.params.offset"><select tl-wrap label=数据类型 ng-model=point.params.type ng-change="  _config.TypeCC( point  , this ) " ng-options=" o.v as o.k for o  in   _dataType "></select><div ng-if="  point.params.area  >1  && point.params.type == 0    "><input tl-wrap required label=位偏移 type=number max=15 min=0 placeholder=" 0 - 15 " tl-default=0 ng-model="point.params.type_ex"></div><div ng-if="  point.params.area  >1 && (point.params.type == 1 || point.params.type == 2)  "><select tl-wrap label=字节偏移 ng-model=point.params.type_ex ng-options=" o.v as o.k for o  in  _config.hlbyte "></select></div><div ng-if="  point.params.area  >1  &&    point.params.type >= 12  "><input tl-wrap required label=字节长度 type=number max=128 min=1 placeholder="1 - 128 " ng-model="point.params.type_ex"></div><div ng-if=" point.params.area >1 && point.params.type == 8  "><input tl-wrap required label=BCD码长度 type=number max=63 min=1 placeholder="1 - 63 " ng-model=point.params.type_ex></div><select tl-wrap label=访问方式 ng-model=point.params.access ng-options=" o.v as o.k for o in  _accerssType "></select>'), a.put("athena/_point/PI_SHCYA.html", '<div ng-init=" _config = $sys.point[ dm.driver_id] "></div><input tl-wrap label=公共地址 required type=Number max=65535 min=0 ng-model=point.params.app_address><select tl-wrap label=类型标识 ng-model=point.params.type_id ng-options=" o.v as o.k for  o  in _config.type_id"></select><input tl-wrap label=信息体地址 required type=Number max=65535 min=0 ng-model=point.params.infor_address>'),
        a.put("athena/_point/PLC_SIEMENS_PPI.html", '<div ng-init="\r\n _config = $sys.point[ dm.driver_id] ;  \r\n\r\n _config.areaCC( this ,point , true) ; \r\n\r\n"></div><select tl-wrap label="数据区 " ng-model=point.params.area ng-options=" o.v as o.k for  o  in _config.area" ng-change=" _config.areaCC( this, point  ) "></select><input tl-wrap label=偏移地址 required type=Number max=65535 min=0 ng-model=point.params.offset><div ng-if="point.params.area != 6  && point.params.area != 8 "><select tl-wrap label="数据类型 " ng-model=point.params.type ng-options="  o.v as o.k for  o  in _dataType" ng-change="_config.typeCC( point )"></select></div><div ng-if=" point.params.type ==9 "><input tl-wrap label=字符串长度 required type=Number max=127 min=1 ng-model=point.params.type_ex></div><div ng-if=" point.params.type== 0 "><input tl-wrap label=位偏移 required type=Number max=65535 min=0 ng-model=point.params.type_ex></div>'), a.put("athena/account/_user_form.html", '<input tl-wrap-l label=用户名 ng-model=" user.username  " required> <input tl-wrap-l label=昵称 ng-model=" user.nickname   "><div class=form-group ng-if=!isAdd><label class="col-sm-3 control-label"><span>更改密码</span></label><div class=col-sm-9><label class="i-checks m-t-xs"><input type=checkbox ng-model=op.ccpass> <i></i></label></div></div><div ng-if=op.ccpass><input tl-wrap-l label=新密码 name=password ng-minlength=6 ng-maxlength=20 ng-model=" user.password " required></div><div class=form-group ng-if=isAdd><label class="col-sm-3 control-label text-base">密码 <mark></label><div class=col-sm-9><input type=password placeholder=密码(至少六位) name=password ng-maxlength=20 ng-minlength=6 class=form-control ng-model=" user.password " required></div></div><div class=form-group ng-if=isAdd><label class="col-sm-3 control-label text-base">确认密码 <mark></label><div class=col-sm-9><input type=password class=form-control name=confirm_password required ng-model=op.confirm_password placeholder=" 确认密码 " ui-validate=" \'$value==user.password\' "></div></div><input tl-wrap-l label=手机号码 ng-model=user.mobile_phone ng-pattern="/^1\\d{10}$/"> <input tl-wrap-l label=电子信箱 ng-model=user.email type=email ng-disabled=" user.is_super_user"> <input tl-wrap-l label=地址 ng-model=user.address><textarea tl-wrap-l label=备注 ng-maxlength=100 ng-model=user.desc>\r\n</textarea>'), a.put("athena/account/account_info.html", '<div class="bg-light lter b-b wrapper-md ng-scope"><h2 class="m-n font-thin h4">{{user.account }}</h2></div><div class=wrapper-md><div class=row><div class="col-md-4 col-sm-12"><div class="panel panel-default"><div class=panel-heading>账户信息</div><div class="list-group no-radius alt" style="color: #1f2427"><span class=list-group-item><span class=pull-right style="color: #333333">{{account.create_time | date:"yyyy-MM-dd HH:mm Z" }}</span> 创建时间</span> <span class=list-group-item><span class="badge bg-info">{{regionNum}}</span> 区域数量</span> <span class=list-group-item><span class="badge bg-info">{{userNum }}</span> 用户数量</span> <span class=list-group-item><span class=pull-right style="color: #333333">{{user.username}}</span> 管理员</span></div></div></div><div class="col-md-4 col-sm-6 col-xs-12"><div class="panel panel-default" ng-if=" initChart_sys "><div class=panel-heading>系统数量</div><div class="panel-body text-center"><h4 style="color: #333333">{{ totalSys }}</h4><small class="text-muted block">系统数量</small><div class=inline><div ui-jq=easyPieChart ui-options="{\r\n                      percent: {{ totalSys_act*100 /  totalSys }},\r\n                      lineWidth: 10,\r\n                      trackColor: \'#e8eff0\',\r\n                      barColor: \'#7266ba\',\r\n                      scaleColor: \'#e8eff0\',\r\n                      size: 188,\r\n                      lineCap: \'butt\'\r\n\r\n                    }" class=easyPieChart style="width: 188px; height: 188px; line-height: 188px"><div style="color: #333333"><span class="h2 m-l-sm step">{{ totalSys_act }}</span>个<div class="text text-sm">已激活</div></div><canvas width=188 height=188></canvas></div></div></div></div></div><div class="col-md-4 col-sm-6 col-xs-12"><div class="panel panel-default" ng-if=" initChart_alarm "><div class=panel-heading>报警数量</div><div class="panel-body text-center"><h4 style="color: #333333">{{totalAlarm }}</h4><small class="text-muted block">本周报警</small><div class=inline><div ui-jq=easyPieChart ui-options="{\r\n                      percent:  {{ totalAlarm_act*100 / totalAlarm }},\r\n                      lineWidth: 10,\r\n                      trackColor: \'#e8eff0\',\r\n                      barColor: \'red\',\r\n                      scaleColor: \'#e8eff0\',\r\n                      size: 188,\r\n                      lineCap: \'butt\'\r\n                    }" class=easyPieChart style="width: 188px; height: 188px; line-height: 188px"><div style="color: #333333"><span class="h2 m-l-sm step">{{totalAlarm_act }}</span>个<div class="text text-sm">未处理</div></div><canvas width=188 height=188></canvas></div></div></div></div></div></div></div>'), a.put("athena/account/author.html", '<div class="panel-body no-padder bg-light bg-white card"><h4 class=center>账户信息</h4><div class="col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3 m-b-lg m-t-l text-base"><div class="b-b line-dashed jbox"><span>账户名称</span> <span class="float-right color-5">{{account.name}}</span></div><div class="b-b line-dashed jbox"><span>注册时间</span> <span class="float-right color-5">{{account.create_time | date:"yyyy-MM-dd HH:mm Z" }}</span></div><div class="b-b line-dashed jbox"><span>系统数量</span> <span class="float-right color-5">{{system.group_id}}</span></div><div class="b-b line-dashed jbox"><span>用户数量</span> <span class="float-right color-5">{{ $sys.sysModelMode.values[systemModel.mode] }}</span></div><div class="b-b line-dashed jbox"><span>用户组数量</span> <span class="float-right color-5">{{ systemModel.comm_type }}</span></div><div class="b-b line-dashed jbox"><span>购买系统数量</span> <span class="float-right color-5">{{ system.network.daserver.network.type}}</span></div><div class=jbox><div class=inline>存储空间占用</div><div class="inline w-xl float-right m-t"></div></div></div></div>'), a.put("athena/account/author_region_add.html", '<div class=modal-header><h4>添加区域权限</h4></div><div class=modal-body><form name=form class="form-validation form-horizontal"><select ng-if=regions tl-wrap-l label=区域 ng-model=" od.region " class=form-control ui-jq=chosen source-arr=regions k=name v=id&name required><option value>-请选择区域-</option></select><select tl-wrap-l ng-model=od.role label=角色 required ng-options=" r as r.name for r in  roles| filter:{\'role_category\': 1 } "><option value="">-请选角色-</option></select><div class=form-group><div class="col-sm-3 control-label">权限</div><div class=col-sm-8><a class="badge bg-info" ng-repeat="p in  od.role.privilege" translate={{p}}></a></div></div></form></div><ng-include src=" \'athena/debris/_modal_footer.html\' "></ng-include>'), a.put("athena/account/edit_user_popwin.html", '<span class=pos-rlt><div class="w bg-light dk border well" style="position: absolute;\r\n                                top: 100%;\r\n                              left: 0;\r\n                                z-index: 9000; \r\n                             float: left"><form role=form class="ng-pristine ng-valid"><div class=form-group><label>Email address</label><input type=email class=form-control placeholder="Enter email"></div><div class=form-group><label>Password</label><input type=password class=form-control placeholder=Password></div><div class=checkbox><label class=i-checks><input type=checkbox checked disabled><i></i> Check me out</label></div><button type=submit class="btn btn-sm btn-primary">Submit</button></form></div></span>'), a.put("athena/account/role.html", '<div class="bg-light lter b-b wrapper-md ng-scope"><h2 class="m-n font-thin h4">角色管理</h2></div><div class=wrapper-md><ul class="nav nav-tabs m-t-xxs bg-normal"><li ui-sref-active=active><a ui-sref=app.role.region><i class="icon icon-screen-desktop"></i> <span translate=区域></span></a></li><li ui-sref-active=active><a ui-sref=app.role.account><i class="icon icon-user"></i> <span translate=账户></span></a></li></ul><div ui-view class="panel panel-default b-t-none"></div></div>'), a.put("athena/account/role_add.html", '<div class=modal-header><h4>添加角色</h4></div><div class=modal-body><form name=form class="form-validation form-horizontal"><input tl-wrap ng-model=r.name required label=角色名称><div class="row m-b"><div class="col-sm-3 col-sm-offset-1 text-right">权限</div><div class=col-sm-8><label class="i-checks inline w-sm" ng-repeat=" a in promise"><input type=checkbox ng-model="r.authors[ a]"> <i></i> <span translate={{a}} style=margin-left:0 popover-trigger=mouseenter popover=" {{ $sys.permissionDesc[a] }} " popover-placement=right></span></label></div></div></form></div><ng-include src=" \'athena/debris/_modal_footer.html\' "></ng-include>'), a.put("athena/account/role_panel.html", '<div class="panel-body table-responsive no-padder no-border b-t" load-mask><table class="table table-hover table-striped b-t-none"><thead class=flip-content><tr><th width=15%>名称</th><th width=75%>权限</th><th width=5%>修改</th><th width=5%>删除</th></tr></thead><tbody><tr ng-repeat="  role in  roles"><td>{{role.name}}</td><td class=text-left>{{ toText (role.privilege) }}</td><td><a class=text-info ng-click="addRole( role , $index)">修改</a></td><td><a class=text-info ng-click="delRole( role, $index )">删除</a></td></tr></tbody></table></div><div class=panel-footer>&nbsp; <button class="btn btn-primary btn-sm w-70 m-l-sm" ng-click="  addRole(  page.data ) ">添加角色</button> &nbsp;<div ng-if=false class="text-center m-t-sm m-b-sm height-30" ng-include src=" \'athena/debris/_pager.html\'  "></div></div>'), a.put("athena/account/user_detail.html", '<div class="bg-light lter b-b wrapper-md"><h2 class="m-n font-thin h4">{{ user.username }}</h2></div><div class=wrapper-md><div class=row><div class="col-md-7 col-xs-12" ng-if=user><div class="panel panel-default"><div class=panel-heading><ul class="nav nav-pills pull-right"><li ng-if=!userself><button class="btn btn-sm btn-default m-t-xs m-r-xs" ng-click="editUser( user )">修改用户</button></li><li ng-if=userself><button class="btn btn-sm btn-default m-t-xs m-r-xs" ng-click=reSetPW()>重设密码</button></li></ul>用户信息</div><div class="list-group no-radius alt" style="color: #1f2427"><span class=list-group-item><span class=pull-right>{{user.nickname}}<popwin ng-model=user pk=id prop=nickname handler="updateUser "></span> 昵称</span> <span class=list-group-item><span class=pull-right><button ng-if=userself class="btn btn-xs btn-default" ng-click=validPhone()>变更/验证</button> {{user.mobile_phone}} <i class=fa ng-if=user.mobile_phone ng-class="{\r\n                                                    \'fa-check text-success\':user.mobile_phone_verified ==1 ,\r\n                                                    \'fa-times text-danger\': user.mobile_phone_verified ==0\r\n                                        }"></i></span> 电话</span> <span class=list-group-item><span class=pull-right><button ng-if=userself class="btn btn-xs btn-default" ng-click=validEmail()>变更/验证</button> {{user.email}} <i class=fa ng-if=user.email ng-class="{\r\n                                        \'fa-check text-success\':user.email_verified ==1 ,\r\n                                        \'fa-times text-danger\': user.email_verified ==0\r\n                                     }"></i></span> 邮箱</span> <span class=list-group-item><span class=pull-right>{{user.address}}</span> 地址</span> <span class=list-group-item ng-if=userself><label class="i-switch bg-info pull-right"><input type=checkbox ng-model=user.sms_notice ng-change=" acceptAlarm(\'sms_notice\')" class="ng-pristine ng-valid"> <i></i></label>接收短信报警</span> <span class=list-group-item ng-if=userself><label class="i-switch bg-info pull-right"><input type=checkbox ng-model=user.mail_notice ng-change=" acceptAlarm(\'mail_notice\')" class="ng-pristine ng-valid"> <i></i></label>接收邮件报警</span></div></div></div><div class="col-md-5 col-xs-12"><div class="panel panel-default"><div class=panel-heading>账户权限</div><div class=panel-body><div class="form-group m-b"><label class="col-sm-4 control-label m-t-xs">角色</label><div class=col-sm-8><form name=form><span ng-if=userself>{{ user.accountRol.name }}</span><select class=form-control name=accountRol ng-model=user.accountRol ng-if=!userself ng-change=addAccountRole() ng-options=" r as r.name for r  in roles |filter:{\'role_category\': 0 }  "><option value="">--无--</option></select></form></div></div><div class="line line-lg b-b" style=height:10px></div><div></div><div style=height:75px class="col-xs-8 {{ userself && \'userself\' }}"><div class="col-xs-6 m-t" ng-repeat="p in  user.accountRol.privilege"><span class="btn btn-xs m-l-xs {{p}}" translate={{p}}></span></div></div></div></div></div><div class="col-xs-12 m-t-none" load-mask=""><div class="panel panel-default table-responsive"><div class=panel-heading>区域权限设置</div><table class="table table-condensed table-hover table-striped b-t-none"><thead class=flip-content><tr><th width=10%>区域</th><th width=25%>角色</th><th>权限</th><th ng-if=userself width=10%>接收报警</th><th ng-if=!userself width=10%>移除</th></tr></thead><tbody ng-if=" page.data && roles "><tr ng-repeat="  rr in  page.data "><td>{{:: rr.region_name || rr.name }}</td><td ng-class="{\'no-padder\': !userself }"><span ng-if=userself>{{ rr.role_name }}</span><select ng-if=!userself ng-model=rr.role_id class=form-control ng-change="ccRegionRole( rr )" ng-options=" r.id as r.name for r  in roles |filter:{\'role_category\': 1 } "></select></td><td>{{ privilge2Text( rr.privilege) }}</td><td ng-if=userself><label class="checkbox i-checks m-t-none m-b-none"><input type=checkbox ng-model=" rr.acceptAlarm " ng-change="acceptRegionAlarm( rr )"> <i></i></label></td><td ng-if=!userself><a href="" class=text-info ng-click="delRegionAuthor( rr , $index )">移除</a></td></tr><tr></tr></tbody></table><div class=panel-footer><button ng-if=!userself class="btn btn-info btn-sm" ng-click=addRegionAuthor()>添加区域权限</button><div ng-if=user.is_super_user class=text-center ng-include src=" \'athena/debris/_pager.html\'  "></div></div></div></div></div></div>'),
        a.put("athena/account/users.html", '<div class="bg-light lter b-b wrapper-md ng-scope"><h2 class="m-n font-thin h4">用户管理</h2></div><div class=wrapper-md><div class="panel panel-default"><div class=panel-heading>全部用户</div><div class="panel-body no-padder no-border table-responsive" load-mask><div class="input-group-sm col-md-5 col-xs-12 wrapper"><div class="col-md-8 col-sm-6 col-xs-8 no-padder"><input style="border-radius: 2px" class="form-control input-sm" ng-model=op.f_name></div><div class="col-md-4 col-sm-6 col-xs-4 text-base"><button class="btn btn-info btn-sm" ng-click=" loadPageData(1)">搜索</button></div></div><table class="table table-hover table-condensed table-striped b-t"><thead class=flip-content><tr><th style="text-align: left;padding-left: 30px" width=20%>名称</th><th>昵称</th><th>手机有效</th><th>电子邮件有效</th><th>上次登录时间</th><th>操作</th></tr></thead><tbody><tr ng-repeat=" u in page.data" ng-if=!u.is_super_user><td><a ui-sref="app.userdetail({id: u.id })" class=text-info>{{ u.username }}</a><popwin ng-model=u prop=username handler=" updateUser "></td><td>{{ u.nickname }}<popwin ng-model=u prop=nickname handler=" updateUser "></td><td><i class="fa {{ u.mobile_phone_verified?\'fa-check text-success\':\'fa-times text-danger\' }}"></i></td><td><i class="fa {{ u.email_verified?\'fa-check text-success\':\'fa-times text-danger\' }}"></i></td><td>{{u.last_login_time| date:\'yyyy-MM-dd HH:mm:ss\'}}</td><td><a href="" class=text-info ng-click="delUser( page.data, u , $index)" translate=del>删除用户</a></td></tr></tbody></table></div><div class=panel-footer><button class="btn btn-primary btn-sm pos-abt" ng-click=" createUser() ">添加用户</button><div class=text-center ng-include src=" \'athena/debris/_pager.html\'  "></div></div></div></div>'), a.put("athena/account/users_edit.html", '<div class=modal-header><h4 ng-if=isAdd>添加用户</h4><h4 ng-if=!isAdd>编辑用户</h4></div><div class=modal-body style="padding:10px 12% 0"><form name=form class="form-horizontal form-validation no-border"><ng-include src=" \'athena/account/_user_form.html\' "></ng-include></form></div><ng-include src=" \'athena/debris/_modal_footer.html\' "></ng-include>'), a.put("athena/account/users_verify_email.html", '<div class=modal-header><h4>验证邮箱</h4></div><div class=modal-body style="padding:10px 12% 0"><form name=form class="form-horizontal form-validation no-border"><div class=form-group><label class="col-sm-3 control-label text-base">电子信箱</label><div class=col-sm-9><input type=email class=form-control name=email ng-model=u.email ng-disabled=" u.is_super_user"></div></div><div class=form-group><div class="col-sm-10 col-sm-offset-3"><button class="btn w-xsm btn-info" type=button ng-click="sendEmail( $event )" ng-disabled="!form.email.$valid || interval.emailInterval " id=emailInterval popover=请在30分钟内完成您的邮箱验证! popover-trigger=mouseenter popover-placement=right>发送验证邮件</button></div></div></form></div><div class=modal-footer><button class="btn btn-sm btn-default w-60" ng-click=" cancel(  ) ">关闭</button></div>'), a.put("athena/account/users_verify_phone.html", '<div class=modal-header><h4>验证手机</h4></div><div class=modal-body><form name=form class="form-horizontal form-validation no-border"><div class=form-group><label class="col-sm-3 control-label text-base">手机号码</label><div class=col-sm-6><div class=input-group><input class=form-control name=phone ng-model=u.mobile_phone ng-pattern="/^1\\d{10}$/"> <span class=input-group-btn><button class="btn btn-info w-xsm btn-default" type=button id=smsInterval ng-click="sendNote( $event )" ng-disabled=" !form.phone.$valid || interval.smsInterval ">发送验证码</button></span></div></div><div class=col-sm-3><input class=form-control ng-model=u.verifi placeholder=验证码></div></div><div class=form-group><div class="col-sm-9 col-sm-offset-3"><button class="btn btn-info" ng-click=verifyPhone()>验证手机</button></div></div></form></div><div class=modal-footer><button class="btn btn-sm btn-default w-60" ng-click=" cancel(  ) ">关闭</button></div>'), a.put("athena/app.html", '<div data-ng-include=" \'athena/header.html\' " class="app-header navbar" style="box-shadow: 0 2px 2px rgba(0,0,0,0.05)"></div><div data-ng-include=" \'athena/aside.html\' " class="app-aside hidden-xs {{app.settings.asideColor}}"></div><div class=app-content><div ui-butterbar></div><a href class="off-screen-toggle hide" ui-toggle-class=off-screen data-target=.app-aside></a><div class="app-content-body bg-normal" ui-view></div></div><div class="app-footer wrapper b-t text-xs bg-normal"><span class=pull-right ng-controller=service><a class=m-r-xs href=//www.thinglinx.net target=_blank>联系我们</a> <a href=javascript:scroll(0,0) ui-scroll=header class="m-l-sm m-r-sm"><i class="fa fa-long-arrow-up"></i></a></span> <span class=p-l>京ICP备14040729号-3</span></div>'), a.put("athena/aside.html", "<div class=aside-wrap><div class=navi-wrap><nav ui-nav class=navi ng-include=\"'athena/nav.html'\"></nav></div></div>"), a.put("athena/cc_password.html", '<div class="modal-header text-center"><h4>修改密码</h4></div><div class=modal-body><form class="bs-example form-validation form-horizontal padding-10" name=form><div class=form-group><label class="col-sm-3 col-sm-offset-1 control-label"><span>原始密码</span></label><div class=col-sm-7><input onfocus="this.type=\'password\'" ng-model=" op.old_password" required ng-change=" od.msg= false " class=form-control><div class=text-danger ng-show=" od.msg ">{{od.msg}}</div></div></div><div class=form-group><label class="col-sm-3 col-sm-offset-1 control-label"><span>新密码</span></label><div class=col-sm-7><input onfocus="this.type=\'password\'" ng-model=" op.new_password" required class=form-control></div></div><div class=form-group><label class="col-sm-3 col-sm-offset-1 control-label"><span>确认新密码</span></label><div class=col-sm-7><input onfocus="this.type=\'password\'" ng-model=" confirm_password" required name=confirm_password class=form-control ui-validate=" \'$value==op.new_password\' " ui-validate-watch=" \'op.new_password\' "></div></div><div class=form-group><div class="col-sm-7 col-sm-offset-4"><span ng-show=form.confirm_password.$error.validator class=text-danger>新密码输入不一致</span></div></div></form></div><ng-include src=" \'athena/debris/_modal_footer.html\' "></ng-include>'), a.put("athena/contactus.html", '<pre style="margin:0; font-size:15px">\r\n\r\n  总部地址：北京市海淀区农大南路33号兴天海园201\r\n   邮编：100193\r\n   总机：86-10-59835588\r\n   传真：86-10-59835566\r\n   企业邮箱：thinglinx@sunwayland.com.cn\r\n    全国服务投诉监督电话：13911598805\r\n\r\n</pre>'), a.put("athena/dastation/_prop_daserver_network.html", '<div class="panel-heading b-t b-b m-b-lg">设备网络参数</div><div><form name=form_daserver class="form-horizontal form-validation m-b-md col-md-8 padder-md" ng-init="  initDaServer() ; loadSupportDtus();"><div ng-if=" daserver.type ==\'DTU\' " class="wrap-text-l padder"><select tl-wrap-l label=DTU驱动 required ng-disabled="  cmway_port  " ng-model=daserver.params.driverid ng-change=" applyDtuData(daserver.params ) ;\r\n              " ng-options=" o.driver_id as o.name  for o  in dtuList "><option value="">--请选择DTU驱动--</option></select><div ng-if=daserver.params.driverid ng-include="  \'athena/_dtu/\' +daserver.params.driverid + \'.html\' "></div><input readonly tl-wrap-l label=中心域名 ng-model=cmway_port.inet_ipv4> <input readonly tl-wrap-l label=端口 ng-model=cmway_port.inet_port><div class="text-muted col-md-9 col-md-offset-3 padding-0"><i class="fa fa-warning text-warning pos-rlt"></i> DSC地址和端口需要设置到指定的DTU设备中</div></div><div ng-if="daserver.type ==\'TcpClient\' "><input tl-wrap-l label=SIM卡手机 required ng-model=a type=number> <input tl-wrap-l label=APN required ng-model=a type=number> <input tl-wrap-l label=APN用户名 ng-model=a> <input tl-wrap-l label=APN密码 ng-model=a></div><div ng-if="daserver.type ==\'TcpServer\' "><div class="col-sm-12 m-t-xs m-b-sm text-left" style="padding-left: 0px"><div class=checkbox><label class=i-checks><input type=checkbox ng-checked=true ng-model=isvpn><i></i> 是否使用VPN</label></div></div><div ng-if=true><input tl-wrap-l label=VPN服务器 ng-model=a required type=number> <input tl-wrap-l label=用户名 ng-model=a required> <input tl-wrap-l label=密码 ng-model=a required type=password></div></div><div class=row><div class="col-md-9 col-md-offset-3 padding m-t"><span><button token=5000 class="btn btn-sm m-l-xs w-94 btn-success" ng-click="  updateSystem( \'daserver\' ,this);  ">保存网络参数</button></span> <span ng-show=" needUpdate.daserver " class=text-danger><i class="fa fa-exclamation-triangle"></i> 编辑完成后请保存网络参数</span> <span ng-show=" hasSave.daserver "><strong class="text-info m-lg"><i class="fa fa-thumbs-o-up"></i> <span>保存成功!</span></strong></span></div></div></form></div>'), a.put("athena/dastation/_prop_gateway_addgateway.html", '<div class=modal-header><h4 ng-if=isAdd>添加网络配置</h4><h4 ng-if=!isAdd>编辑网络配置</h4></div><div ng-init="   _type =  [\'ETHERNET\' ,\'GPRS\' , \'WIFI\' ]  "></div><div class=modal-body><form name=form_gateway class="form-validation form-horizontal"><select tl-wrap ng-if=isAdd ng-model=op.T ng-options=" t for t in  _type   " label=类型 ng-change="  op.t = undefined ; op.way = {} " required></select><div ng-if=" op.T == \'ETHERNET\' " ng-init="  op.x =  op.x||\'LAN\' "><select tl-wrap ng-model=op.x ng-options=" x as x  for x in [\'LAN\',\'WLAN\'] " label=以太网类型></select><input tl-wrap label=名称 ng-model=" op.t " required> <input tl-wrap label=ip ng-model=" op.way.ip " required> <input tl-wrap label=subnet ng-model=" op.way.subnet " required><div ng-if=" op.x == \'WLAN\'  "><input tl-wrap label=gateway ng-model=" op.way.gateway " required> <input tl-wrap label=dns ng-model=" op.way.dns " required></div></div><div ng-if=" op.T == \'GPRS\' "><input tl-wrap label=名称 ng-model=" op.t " required> <input tl-wrap label=simid ng-model=" op.way.simid " required> <input tl-wrap label=apn ng-model=" op.way.apn " required> <input tl-wrap label=apn_user ng-model=" op.way.apn_user " required> <input tl-wrap label=apn_password ng-model=" op.way.apn_password " required></div><div ng-if=" op.T == \'WIFI\' "><input tl-wrap label=名称 ng-model=" op.t " required> <input tl-wrap label=simid ng-model=" op.way.router " required> <input tl-wrap label=user ng-model=" op.way.user " required> <input tl-wrap label=password ng-model=" op.way.password " required></div></form></div><ng-include src=" \'athena/debris/_modal_footer.html\' "></ng-include>'), a.put("athena/dastation/_prop_gateway_device.html", '<div class="panel-heading b-t b-b">设备网络参数</div><table class="table b-b" ng-init="  initGatewayDevs()"><thead class=flip-content><tr><th width=15%>device_id</th><th width=15%>类型</th><th width=15%>Channel</th><th width=15%>Ip</th><th width=15%>Port</th><th width=15%>proto</th><th width=10%>操作</th></tr></thead><tbody><tr ng-repeat="   dev  in gatewayDevs  " class=hover ng-init="  devRef[dev.id] = true  "><td>{{ deviceKV[ dev.id ] }}</td><td>{{ dev.type }}</td><td>{{ dev.params.channel }}</td><td>{{ dev.params.ip }}</td><td>{{ dev.params.port }}</td><td>{{ dev.params.proto }}</td><td><a class="text-info m-r-xs" ng-click="c_u_dev( gatewayDevs,  $index , dev   )">编辑</a> <a class="text-info m-r-xs" translate=bu.bu4 ng-click="delete_dev( gatewayDevs , $index , dev   )">移除</a></td></tr><tr><td colspan=7 class=text-left><button class="btn btn-primary btn-sm m-l-lmg w-70" ng-show=" gatewayDevs.length !=  sysmodel.devices.length " ng-click=" c_u_dev(  gatewayDevs  ) ">添加设备</button> <span class=text-danger ng-show=" needUpdate.gatewayDevs "><button class="btn btn-sm w-94 m-l btn-success" ng-click="  updateSystem( \'gatewayDevs\' );  ">保存网络参数</button> <i class="fa fa-exclamation-triangle"></i> 编辑完成后请保存网络参数</span> <span ng-show=" hasSave.gatewayDevs "><strong class="text-info m-lg"><i class="fa fa-thumbs-o-up"></i> <span>保存成功!</span></strong></span></td></tr></tbody></table>'), a.put("athena/dastation/_prop_gateway_gateway.html", '<div class="panel-heading b-t b-b">网络参数</div><div class="b-b m-b-lg"><table class="table table-striped m-b-none" ng-init=" initGateWay() "><thead class=flip-content><tr><th width=10%>类型</th><th width=10%>名称</th><th width=10%>是否可用</th><th width=10%>参数</th><th width=10%>操作</th></tr></thead><tbody ng-repeat=" ($T,$d)  in gateway  "><tr ng-repeat="  ($t,$way)  in $d  " class=hover><td>{{$T}}</td><td>{{ $t }}</td><td>{{ $way.enable }}</td><td>{{ $way }}</td><td><a class="text-info m-r-xs" ng-click="c_u_way ( $T , $t,  $way   )">编辑</a> <a class="text-info m-r-xs" translate=bu.bu4 ng-click="del_way ( $T , $t,  $way  )">移除</a></td></tr></tbody><tbody><tr><td colspan=5 class=text-left><button class="btn btn-primary btn-sm w-94 m-l-lmg" ng-click=" c_u_way( ) ">添加网络参数</button> <span class=text-danger ng-show=" needUpdate.gateway "><button class="btn btn-sm m-l w-94 btn-success" ng-click="  updateSystem( \'gateway\' );  ">保存网络参数</button> <i class="fa fa-exclamation-triangle"></i> 编辑完成后请保存网络参数</span> <span ng-show=" hasSave.gateway "><strong class="text-info m-lg"><i class="fa fa-thumbs-o-up"></i> <span>保存成功!</span></strong></span></td></tr><tr><td class=text-left><div class="checkbox m-l m-t-none m-b-none"><label class=i-checks><input type=checkbox ng-model=enbaleGPS ng-change=enbaleGpsChange()> <i></i> GPS</label></div></td><td ng-if="enbaleGPS " colspan=2><span>Distance</span><select ng-model=GateWay.GPS.distance class="input-sm w inline" ng-options="  k for k  in $sys.gateway.gps_distance" ng-change=" cc() " label=Distance></select></td><td ng-if="enbaleGPS " colspan=2><span>波特率</span><select ng-model=GateWay.GPS.baud_rate class="input-sm w inline" ng-change=" cc() " ng-options="  k for k  in $sys.gateway.gps_baud_rate"></select></td></tr></tbody></table></div>'), a.put("athena/dastation/add_gateway_device.html", "<div class=modal-header><h4 ng-if=isAdd>添加Gateway Device</h4><h4 ng-if=!isAdd>编辑Gateway Device</h4></div><div class=hiden ng-init=\"\r\n_type  =  [ 'ETHERNET' , 'RS232' , 'RS485' , 'RS422' ] ;\r\n_proto =  ['tcp' , 'udp'] ;\r\n\r\n" + '"></div><div class=modal-body><form name=form class="form-validation form-horizontal"><div class="text-center text-danger m-b" ng-show=" iaAdd && ! _$devs.length"><i class="fa fa-exclamation-triangle"></i> 无可添加设备!</div><select tl-wrap ng-if=isAdd ng-init="  filterDev()" ng-model=dev.id ng-options=" d.id as d.name for d in _$devs " label=设备 required><option value="">--请选择设备--</option></select><select tl-wrap ng-model=dev.type label=type ng-options=" t for t in _type" tl-default=ETHERNET when-change=" filterChannel( true ) " required></select><select tl-wrap ng-model=" dev.params.channel " ng-options="  k as k  for  (k,v)  in  _$channel ||  filterChannel( false )   " label=channel tl-default=LAN_1 when-change=" op._$$edit = true ; " required></select><div ng-if=" dev.params.channel == \'LAN_1\'   " ng-init="op._$$edit  &&  ( dev.params = { channel: dev.params.channel , type:\'static\'} ) "><input tl-wrap ng-model=dev.params.ip label=ip required> <input tl-wrap ng-model=dev.params.port label=port required><select tl-wrap ng-model=dev.params.proto label=proto ng-options="  p for p in _proto" tl-default=tcp required></select></div><div ng-if=" dev.params.channel == \'WLAN_1\'   " ng-init=" op._$$edit  && ( dev.params = { channel: dev.params.channel , type:\'static\'} ) "><input tl-wrap ng-model=dev.params.ip label=ip required> <input tl-wrap ng-model=dev.params.subnet label=subnet required> <input tl-wrap ng-model=dev.params.gateway label=gateway required> <input tl-wrap ng-model=dev.params.dns label=dns required></div></form></div><ng-include src=" \'athena/debris/_modal_footer.html\' "></ng-include>'), a.put("athena/dastation/dastation_add_temp.html", '<div class=modal-header><span>添加系统</span></div><div class=modal-body load-mask><form name=form class="form-horizontal form-validation j_form_15"><input tl-wrap label=系统名称 required ng-model=system.name><select tl-wrap label=所属区域 ng-model=system.region_id ng-disabled=od.selectRegion required ng-options="  proj.id  as  proj.name  for  proj   in regions "><option value="">-请选择区域-</option></select><select tl-wrap ng-model=od.systemModel ng-options=" s  as s.name for s in sysModels" label=系统模型 required><option value="">-请选择系统模型-</option></select><select tl-wrap ng-model=system.profile ng-options="  p.uuid as p.name for  p  in  profiles " label=系统配置项 required><option value="">--请选择配置项--</option></select><div class=form-group ng-if=" od.systemModel.mode==1 && od.systemModel.comm_type == 1 " ng-init=" system.network= { daserver: { type:\'DTU\'}  }; "><label class="col-sm-3 col-sm-offset-1 control-label"><span>网络类型</span></label><div class=col-sm-7><div class=radio><label class=i-checks><input type=radio value=DTU ng-model=system.network.daserver.type> <i></i> DTU</label></div></div></div><textarea tl-wrap label=备注 ng-maxlength=100 placeholder=" 不应超过100字符" ng-model=" system.desc ">\r\n        </textarea></form></div><ng-include src=" \'athena/debris/_modal_footer.html\' "></ng-include>'), a.put("athena/dastation/dastation_prop.html", '<div class="bg-light lter b-b wrapper-md"><span class="m-n font-thin h4">{{station.name}}</span> <i class="m-l fa fa-circle {{ station.online==1 ?\'text-success\' : \'text-danger\' }}"></i> <button class="btn btn-info m-l-lg" ng-if="station.state != 1" ng-click="activateStation(  null , station )">激活</button> <button class="btn btn-sm btn-danger m-l" ng-if="station.state  ==1" ng-click="effStation( null , station )">失效</button></div><div class=wrapper-md><ul class="nav nav-tabs m-t-xxs bg-normal text-base" ng-if=" !isShowModul "><li ui-sref-active=active><a ui-sref=app.m_system_prop._basic><i class="icon icon-info"></i> 状态</a></li><li ui-sref-active=active><a ui-sref=app.m_system_prop._config><i class="icon icon-wrench"></i> 配置</a></li><li ui-sref-active=active><a ui-sref=app.m_system_prop.tag><i class="icon icon-bar-chart"></i> 变量</a></li><li ui-sref-active=active><a ui-sref=app.m_system_prop.trigger><i class="icon icon-rocket"></i> 触发器</a></li><li ui-sref-active=active><a ui-sref=app.m_system_prop._map><i class="icon icon-pointer"></i> 位置</a></li></ul><div ui-view></div></div>'), a.put("athena/dastation/dastation_temp.html", '<div class="bg-light lter b-b wrapper-md ng-scope"><h2 class="m-n font-thin h4">{{::isShowModul?"系统":"系统管理" }}</h2></div><div class=wrapper-md><ng-include src=" \'athena/dastation/dastation_temp_panel.html\' "></ng-include></div>'), a.put("athena/dastation/dastation_temp_panel.html", '<div class="panel panel-default" ng-class=" {\'b-t-none\':  $state.includes(\'app.m_region_prop\')}"><div class=panel-heading ng-if="!$state.includes(\'app.m_region_prop\')">系统列表</div><div class="panel-body table-responsive no-padder" ng-switch on=lm load-mask><div class="row m-l-xs m-r-xs m-t"><div class="form-group col-lg-2-4 col-sm-6"><label>名称</label><input class=form-control ng-model="od.name"></div><div class="form-group col-lg-2-4 col-sm-6"><label>ID</label><input class=form-control ng-model=od.uuid></div><div class="form-group col-lg-2-4 col-sm-6" ng-if=_$showRegionTH><label>区域</label><select class=form-control ng-model=od.region_id ng-options="  r.id as r.name for r in  regions"><option value="">-所有区域-</option></select></div><div class="form-group col-lg-2-4 col-sm-6"><label>模型</label><select class=form-control ng-model=od.model ng-options=" s.uuid as s.name for s in  sysModels"><option value="">-所有模型-</option></select></div><div class="form-group col-lg-2-4 col-sm-6" ng-if=!isShowModul><label>活跃状态</label><select class=form-control label=活跃状态 ng-model=od.state ng-options=" v as k for (k,v) in  $sys.sysState"><option value="">-全部-</option></select></div><div class=col-xs-12 ng-init=" lm = \'list\' "><button class="btn btn-sm btn-info float-right w-46" ng-click=" loadPageData(1)" token>搜索</button> <button class="btn btn-sm btn-info m-l float-right w-46" ng-click="  reset();  ">复位</button><div class="radio pull-right m-r"><label class=i-checks><input type=radio value=map checked ng-model=" lm "> <i></i> 地图</label></div><div class="radio pull-right m-r m-t"><label class=i-checks><input type=radio value=list ng-model=lm> <i></i> 列表</label></div></div></div><table ng-switch-when=list class="table table-striped table-hover b-t"><thead class=flip-content><tr><th width=5%>状态</th><th width=10%>系统名称</th><th width=10%>ID</th><th width=10% ng-if=_$showRegionTH>区域</th><th width=10% ng-if=!isShowModul>活跃状态</th><th width=20%>备注</th><th width=1% ng-if=" !isShowModul  ">激活</th><th width=1% ng-if=" !isShowModul  ">同步</th><th width=1% ng-if=" !isShowModul  ">删除</th></tr></thead><tbody><tr ng-repeat="  das  in page.data "><td><i class="fa fa-circle {{ das.online==1 ?\'text-success\' : \'text-danger\' }}"></i></td><td><a class=text-info-dk ng-click="goto( _$stationState , das , das )">{{ das.name }}</a><popwin ng-if=" !isShowModul" ng-model=das pk=uuid prop=name handler="updateSystem "></td><td>{{ :: das.uuid }}</td><td ng-if=_$showRegionTH><a class=text-info-dk ng-click=" goto( _$projState ,   rg_k_v[ das.region_id] ,  rg_k_v[ das.region_id] ) ">{{ :: das.region_name }}</a></td><td ng-if=!isShowModul>{{ das.state ==1?"激活":"未激活" }}</td><td>{{das.desc}}<popwin ng-model=das ng-if=" !isShowModul" pk=uuid prop=desc handler=" updateSystem  "></td><td ng-if=" !isShowModul  "><a class="text-info-dk m-r-xs" ng-if="das.state ==1 " ng-click=" effStation(page.data , das  ,$index  ) ">失效</a> <a class="text-info-dk m-r-xs" ng-if=" das.state ==0 " ng-click=" activateStation( null,das,$index ,false ) ">激活</a></td><td ng-if=" !isShowModul   "><a class=text-info ng-if=" das.state==1 && das.needsync " ng-click=" syncSystem( das , $event , this )" token=5000>同步</a> <span class=text-muted ng-if=" das.state !=1  ">同步</span> <i ng-if=" das.state ==1 && !das.needsync " class="fa fa-check text-success"></i> <i class="fa fa-spin fa-spinner text-info" style=display:none></i></td><td ng-if=" !isShowModul "><a class=text-info ng-if="das.state != 1 " ng-click=" delStation( page.data  ,das , $index  ) ">删除</a> <span ng-if="das.state == 1" class=text-muted>删除</span></td></tr></tbody></table><div ng-switch-when=map id=bdmap ng-init=" initMap(); "></div></div><div class=panel-footer ng-if="lm==\'list\'"><button ng-if=" !isShowModul " class="btn btn-info btn-sm m-l-sm pos-abt" ng-click=" createSystem() ">添加系统</button><div class=text-center ng-include src=" \'athena/debris/_pager.html\'  "></div></div></div>'), a.put("athena/dastation/prop_basic.html", '<div class="panel panel-default b-t-none"><div class=panel-body><div class=row><div class="col-md-6 col-xs-12"><div class=list-group><span class="list-group-item no-border">系统Id <span class=pull-right>{{ :: station.uuid }}</span></span> <span class="list-group-item no-border">所属区域 <span class=pull-right><a class=text-info ui-sref="app.m_region_prop.system({id: station.region_id })">{{ station.region_name }}</a></span></span> <span class="list-group-item no-border">活跃状态 <span class=pull-right>{{ station.state == 1 ? "激活":"未激活" }}</span></span> <span class="list-group-item no-border">使用的模型 <span class=pull-right><a ng-click=" goto( \'app.sysmodel_p.basic\' , sysmodel , sysmodel  )" class=text-info-dk>{{ sysmodel.name}}</a></span></span> <span class="list-group-item no-border">通讯类型 <span class=pull-right>{{ sysmodel.comm_type == 1 ? \'DaServer\':\'GateWay\' }}</span></span> <span class="list-group-item no-border">创建时间 <span class=pull-right>{{ station.create_time | date:"yyyy-MM-dd HH:mm Z" }}</span></span> <span class="list-group-item no-border">配置同步状态 <span class="pull-right fa">{{ station.needsync ? "需要同步":"已同步" }}</span></span> <span class="list-group-item no-border">位置 <span class=pull-right>{{ station.map_address }}</span></span> <span class="list-group-item no-border">备注<div class="b-a m-t-sm alert" style="color: #a0a0a0;height:100px">{{station.desc }}</div></span> <span class="list-group-item no-border"><button class="btn btn-sm btn-primary" ng-click="editStation( this, station  )">修改信息</button></span></div></div><div class="col-md-6 col-xs-12"><img ng-src="{{ station.pic_url?( ossRoot + station.pic_url):\'img/system_null.png\'  }}" class="pag-5 m-t-lg w-full b" style=height:400px><form class="hbox m-t"><label class="col w-xs m-t-n p-t-10">上传系统图片</label><div class=col><input ui-jq=filestyle type=file id=file_sys ng-model-instant class=input-sm onchange="angular.element(this).scope().setFiles(this)"><div style=height:10px><progressbar class="progress-xs active m-b-sm m-t-xxs" ng-show=progressVisible value=progress type=success>{{progress}}%</progressbar></div><div class=text-muted>支持不超过500K的jpeg,png,jpg格式图片!</div><div ng-show=!op.rightfile class=text-danger>文件过大!</div></div><div class="col w-xs"><button class="btn btn-info m-l w-70" ng-click=uploadFile() ng-disabled=" ! op.rightfile ">上传</button></div></form></div></div></div></div>'),


        // system  config html  - old ; 
        // a.put("athena/dastation/prop_config.html", '<div class="panel panel-default b-t-none"><div class="panel-body no-padder"><div class="col-md-8 col-xs-12 text-left m-b-sm m-t padder-md"><label class="col-md-3 control-label m-t-xs color-4">配置项</label><div class=col-md-9><select ng-model=profile class=form-control ng-options="   p as p.name for p in profiles  " ng-change="toUpdate(\'profile\')" required></select><span class="help-block m-b-none m-b-xs" ng-show=" profile.desc"><i class="fa fa-warning text-success pos-rlt"></i> {{profile.desc}}</span></div><div class="col-md-9 col-md-offset-3 m-t-xs m-b"><span class=text-danger ng-show=" needUpdate.profile "><button class="btn btn-sm w-94 btn-success" ng-click="  updateSystem( \'profile\' );  ">保存系统配置</button> <i class="fa fa-exclamation-triangle"></i> 编辑完成后请保存系统配置</span> <span ng-show=" hasSave.profile "><strong class=text-info><i class="fa fa-thumbs-o-up"></i> <span>保存成功!</span></strong></span></div><div ng-if="  nT "><label class="col-md-3 control-label m-t-xs color-4">SN</label><div class=col-md-9><div class=input-group><input class=form-control ng-model=t.sn ng-disabled=t.ticket> <span class=input-group-btn ng-show=" !t.ticket  " style=padding-left:10px><button class="btn btn-info btn-default w-xs" type=button ng-click=createTicket()>注册</button></span> <span class=input-group-btn ng-show=t.ticket style=padding-left:10px><button class="btn btn-info btn-default w-xs" type=button ng-click=unBindTicket()>解除绑定</button></span></div></div><label class="col-md-3 col-lg-offet-1 control-label m-t color-4">Ticket</label><div class="col-md-9 m-t"><textarea ng-model="  t.ticket " class="input w-full panel bg-light lter b" style="resize: none" readonly></textarea></div></div></div><div class=line ng-if=!nT></div><ng-include ng-if=" !nT " src="  \'athena/dastation/_prop_daserver_network.html\'  "></ng-include><ng-include ng-if=" sysmodel.mode ==1 && sysmodel.comm_type ==2   " src=" \'athena/dastation/_prop_gateway_gateway.html\'  "></ng-include><ng-include ng-if=" sysmodel.devices.length && sysmodel.mode ==1 && sysmodel.comm_type ==2 " src="  \'athena/dastation/_prop_gateway_device.html\'  "></ng-include><div class="line b-b" ng-if=!nT></div><div ng-if=" sysmodel.mode ==1 "><div class="col-md-8 col-xs-12 text-left padder-md"><div class="col-md-3 col-xs-6 text-left m-t-sm m-b-sm color-4"><span>上次配置更新</span></div><div class="col-md-9 col-xs-6 m-t-sm m-b-sm">{{ station.last_modify_time| date:"yyyy-MM-dd HH:mm" }}</div></div><div class="col-md-8 col-xs-12 text-left padder-md"><div class="col-md-3 col-xs-6 text-left m-t-xs m-t-sm m-b-sm color-4">上次同步</div><div class="col-md-9 col-xs-6 m-t-xs m-t-sm m-b-sm"><span>{{station.last_sync_time | date:"yyyy-MM-dd HH:mm" }}</span></div></div><div class="col-md-8 col-xs-12 text-left m-b padder-md"><div class="col-xs-6 m-t-sm col-md-6 m-t-sm m-b-sm"><button class="btn btn-sm btn-info" ng-click=" syncSystem( station , $event , this )" token spinner>同步配置</button> <span class=text-info ng-show=_show_sync_ok>同步成功</span> <span class=text-danger ng-show=_show_sync_error>同步失败</span></div></div></div></div></div>'),

        // system  config html - new ; 
        a.put("athena/dastation/prop_config.html", '<div class="panel panel-default b-t-none"><div class="panel-body no-padder"><div class="col-md-8 col-xs-12 text-left m-b-sm m-t padder-md"><label class="col-md-3 control-label m-t-xs color-4">配置项</label><div class=col-md-9><select ng-model=profile class=form-control ng-options="   p as p.name for p in profiles  " ng-change="toUpdate(\'profile\')" required></select><span class="help-block m-b-none m-b-xs" ng-show=" profile.desc"><i class="fa fa-warning text-success pos-rlt"></i> {{profile.desc}}</span></div><div class="col-md-9 col-md-offset-3 m-t-xs m-b"><span class=text-danger ng-show=" needUpdate.profile "><button class="btn btn-sm w-94 btn-success" ng-click="  updateSystem( \'profile\' );  ">保存系统配置</button> <i class="fa fa-exclamation-triangle"></i> 编辑完成后请保存系统配置</span> <span ng-show=" hasSave.profile "><strong class=text-info><i class="fa fa-thumbs-o-up"></i> <span>保存成功!</span></strong></span></div><label class="col-md-3 control-label m-t-xs color-4">PLC编程模式</label><div class=col-md-9><label class="i-switch i-switch-md bg-info m-t-xs m-r"><input type=checkbox checked ng-model=op.plcstate ng-change="setPLC( op.plcstate )"> <i></i></label><div class=text-muted ng-if=" op.enAblePlcProg  "><span ng-show=op.plcstate>当前系统处于编程模式, 您可以使用工具向PLC同步工程, 如您想恢复采集, 请关闭编程模式;</span> <span ng-show=!op.plcstate>当前处于采集模式, 如您希望向PLC同步工程 , 请切换到编程模式</span></div></div><div ng-if="  nT "><label class="col-md-3 control-label m-t-xs color-4">SN</label><div class=col-md-9><div class=input-group><input class=form-control ng-model=t.sn ng-disabled=t.ticket> <span class=input-group-btn ng-show=" !t.ticket  " style=padding-left:10px><button class="btn btn-info btn-default w-xs" type=button ng-click=createTicket()>注册</button></span> <span class=input-group-btn ng-show=t.ticket style=padding-left:10px><button class="btn btn-info btn-default w-xs" type=button ng-click=unBindTicket()>解除绑定</button></span></div></div><label class="col-md-3 col-lg-offet-1 control-label m-t color-4">Ticket</label><div class="col-md-9 m-t"><textarea ng-model="  t.ticket " class="input w-full panel bg-light lter b" style="resize: none" readonly></textarea></div></div></div><div class=line ng-if=!nT></div><ng-include ng-if=" !nT " src="  \'athena/dastation/_prop_daserver_network.html\'  "></ng-include><ng-include ng-if=" sysmodel.mode ==1 && sysmodel.comm_type ==2   " src=" \'athena/dastation/_prop_gateway_gateway.html\'  "></ng-include><ng-include ng-if=" sysmodel.devices.length && sysmodel.mode ==1 && sysmodel.comm_type ==2 " src="  \'athena/dastation/_prop_gateway_device.html\'  "></ng-include><div class="line b-b" ng-if=!nT></div><div ng-if=" sysmodel.mode ==1 "><div class="col-md-8 col-xs-12 text-left padder-md"><div class="col-md-3 col-xs-6 text-left m-t-sm m-b-sm color-4"><span>上次配置更新</span></div><div class="col-md-9 col-xs-6 m-t-sm m-b-sm">{{ station.last_modify_time| date:"yyyy-MM-dd HH:mm" }}</div></div><div class="col-md-8 col-xs-12 text-left padder-md"><div class="col-md-3 col-xs-6 text-left m-t-xs m-t-sm m-b-sm color-4">上次同步</div><div class="col-md-9 col-xs-6 m-t-xs m-t-sm m-b-sm"><span>{{station.last_sync_time | date:"yyyy-MM-dd HH:mm" }}</span></div></div><div class="col-md-8 col-xs-12 text-left m-b padder-md"><div class="col-xs-6 m-t-sm col-md-6 m-t-sm m-b-sm"><button class="btn btn-sm btn-info" ng-click=" syncSystem( station , $event , this )" token spinner>同步配置</button> <span class=text-info ng-show=_show_sync_ok>同步成功</span> <span class=text-danger ng-show=_show_sync_error>同步失败</span></div></div></div></div></div>'),




        a.put("athena/dastation/prop_contact.html", '<div class="panel-body table-responsive no-padder no-border bg-light" id=ccc><h4 class="text-center m-t-l"></h4><form name=form class="form-horizontal form-validation col-md-7 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 m-t ccc"><div class="form-group col-md-6"><label class="col-sm-12 control-label"><span translate=姓>姓</span></label><div class=col-sm-12><input label=姓 ng-model=" C.first_name " class=form-control required></div></div><div class="form-group col-md-6"><label class="col-sm-12 control-label"><span translate=名字>名字</span></label><div class=col-sm-12><input label=名字 ng-model=" C.last_name " class=form-control required></div></div><div class="form-group col-md-6"><label class="col-sm-12 control-label"><span translate=邮箱>邮箱</span></label><div class=col-sm-12><input label=邮箱 ng-model=" C.email " type=email class=form-control required></div></div><div class="form-group col-md-6"><label class="col-sm-12 control-label"><span translate=固定电话>固定电话</span></label><div class=col-sm-12><input label=固定电话 ng-model=" C.tel " class=form-control ng-pattern="/^\\d{4}-\\d{7,8}$/" placeholder=xxxx-xxxxxxxx></div></div><div class="form-group col-md-6" ng-if=!isAdd><label class="col-sm-12 control-label"><span>更改联系人号码</span></label><div class=col-sm-9><div class="checkbox inline"><label class=i-checks><input type=checkbox ng-model="op.cc_phone " checked><i></i></label></div></div></div><div class="form-group col-md-6" ng-if=" isAdd ||  op.cc_phone "><label class="col-sm-12 control-label"><span translate=手机号码 class=ng-scope>手机号码</span> <mark></label><div class=col-sm-12><div class=input-group><input name=mobile_phone ng-model=" C.mobile_phone " class=form-control ng-pattern="/^1\\d{10}$/" required> <span class=input-group-btn ng-show=!op.send><button class="btn btn-default" type=button ng-disabled=!form.mobile_phone.$valid ng-click=sendVer()>发送验证码</button></span> <span class=input-group-btn ng-show=op.send><button class="btn btn-default" type=button ng-disabled=true>重新发送({{op.second}})</button></span></div></div></div><div class="form-group col-md-6" ng-if=" isAdd || op.cc_phone "><label class="col-sm-12 control-label"><span translate=验证码 class=ng-scope>验证码</span> <mark></label><div class=col-sm-12><input ng-model=" C.code " class="form-control inline" ui-validate=" \'validVer($value)\' "></div></div><div class="form-group col-md-6"><label class="col-sm-12 control-label"><span translate=国家>国家</span></label><div class=col-sm-12><input label=国家 class=form-control ng-model=" C.country "></div></div><div class="form-group col-md-6"><label class="col-sm-12 control-label"><span translate=省>省</span></label><div class=col-sm-12><input label=省 class=form-control ng-model=" C.province "></div></div><div class="form-group col-md-6"><label class="col-sm-12 control-label"><span translate=城市>城市</span></label><div class=col-sm-12><input label=城市 class=form-control ng-model=" C.city "></div></div><div class="form-group col-md-6"><label class="col-sm-12 control-label"><span translate=邮政编码>邮政编码</span></label><div class=col-sm-12><input label=邮政编码 class=form-control ng-model=" C.zip_code "></div></div><div class="form-group col-md-12"><label class="col-sm-12 control-label"><span translate=详细地址>详细地址</span></label><div class=col-sm-12 style="padding-right: 40px"><input label=详细地址 class=form-control ng-model=" C.address "></div></div><div class="form-group col-md-12"><label class="col-sm-6 control-label"><span>通知形式</span></label><div class=col-sm-6 style="padding-right: 40px"><div class="checkbox inline float-right m-l"><label class=i-checks><input type=checkbox ng-model=" C.mail_notice " checked ng-true-value=1 ng-false-value=0><i></i> <span>邮件通知</span></label></div><div class="checkbox inline float-right m-l"><label class=i-checks><input type=checkbox ng-model=" C.sms_notice " checked ng-true-value=1 ng-false-value=0><i></i> <span>短信通知</span></label></div></div></div></form><div class="text-right col-md-7 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12" ng-if=" !isShowModul "><button style="margin-right: 65px" class="btn btn-success btn-block-middle w-46 m-b m-t" ng-click=commit() token>保存</button></div></div>'),
        a.put("athena/dastation/prop_map.html", '<div class="panel panel-default b-t-none"><div class="panel-heading bg-white-only no-padder"><form class=form-inline><div class="row padder"><div class="form-group col-md-3 col-sm-6 col-xs-12 m-t-sm m-b-sm"><label class="w-50 text-center">搜索</label><input type=email class=form-control id=suggestId><div id=searchResultPanel style="border:1px solid #C0C0C0 ;height:auto; display:none"></div></div><div class="form-group col-md-3 col-sm-6 col-xs-12 m-t-sm m-b-sm"><label class="w-50 text-center">经度</label><input class=form-control ng-model=" station.latitude "></div><div class="form-group col-md-3 col-sm-6 col-xs-12 m-t-sm m-b-sm"><label class="w-50 text-center">纬度</label><input class=form-control ng-model=" station.longitude "></div><div class="form-group col-md-3 col-sm-6 col-xs-12"><button class="btn btn-info m-t-sm m-b-sm m-l-sm" ng-click=" locatedStation()" token>定位 {{ station.name }}</button> <button class="btn btn-info m-t-sm m-b-sm m-l-sm" ng-click=" removePostion()" token>删除定位</button></div></div></form></div><div class="panel-body well m-b-none" id=station_map ng-init=createMap()></div></div>'), a.put("athena/dastation/prop_map_popup.html", '<div style="padding-top : 10px; width:300px"><div class="row m-n b-b line-dashed"><div class=col-sm-5>系统:</div><div class=col-sm-7><a>{{name}}</a> <i class="glyphicon glyphicon-signal text-info"></i></div></div><div class="row m-n b-b line-dashed" ng-if=false><div class=col-sm-5>id:</div><div class=col-sm-7>{{uuid}}</div></div><div class="row m-n b-b line-dashed"><div class=col-sm-5>所属区域:</div><div class=col-sm-7>{{region_name}}</div></div><div class="row m-n b-b line-dashed"><div class=col-sm-5>创建时间:</div><div class=col-sm-7>{{create_time}}</div></div></div>'), a.put("athena/dastation/prop_prop.html", '<div class=panel-body><form name=form class="form-horizontal form-validation tl-center-form"><input type=submit class=hidden> <input tl-wrap-l label=系统名称 required ng-model=station.name> <span ng-if=false tl-wrap-l label=激活码 ng-model=dastation.activeno></span> <input tl-wrap-l label=项目 readonly ng-model=dastation.activeno> <input tl-wrap-l label=联系人 ng-model=" project.linkman "> <input tl-wrap-l label=电话号码 ng-model=" project.tel " placeholder=XXXX-XXXXXXX ng-pattern="/^[0-9]{3,4}-[0-9]{7,8}$/"> <input tl-wrap-l label=手机 ng-model=" project.cellphone " ng-pattern="/^[0-9]{11}$/"> <input tl-wrap-l label=电子邮件 ng-model=" project.email " type=email> <input tl-wrap-l label=地址 ng-model=" project.address "><textarea tl-wrap-l label=备注 ng-model=" project.msg " style="resize: none" placeholder=" 不应超过100字符"></textarea><div class="line line-dashed b-b line-chart m-l-n-sm"></div><div class="row m-t-xs"><div class=col-xs-12><button class="btn btn-success btn-sm w-46" ng-click=setNetWork()>保存</button></div></div></form></div>'), a.put("athena/dastation/station_activate.html", '<div class="modal-header text-center"><h4>激活系统: {{ station.name }} ?</h4></div><div class=modal-body><form name=form class="form-validation form-horizontal padding-10"><input type=submit class=hidden> <input tl-wrap label=系统名称 ng-model=" station.name " disabled><div class="line line-dashed b-b"></div>Select primary usage for this system This can be changed later.<div class=radio><label class=i-checks><input type=radio value=option1 name=a> <i></i> Use system for View & Control (Remote management)<br><div class=text-muted>Primary usage will be logging, viewing live values and alarm management of the devices connected to the EC product.</div></label></div><div class=radio><label class=i-checks><input type=radio checked value=option2 name=a> <i></i> Use system for Remote Access<br><div class=text-muted>Primary usage will be remote access and use of the EC product for access to connected devices via own software tools.</div></label></div></form></div><ng-include src=" \'athena/debris/_modal_footer.html\' "></ng-include>'), a.put("athena/dastation/station_change.html", '<div class="modal-header text-center"><h4>更换系统 {{ station.name }}</h4></div><div class=modal-body><div class=text-muted>更换系统将在两个系统间交换所有信息.<br>更换后，新系统要采用旧系统相同的日志参数和警告设置进行配置.<br>一般来讲，系统更换是本地化地将配置备份恢复到该系统.</div><div class="line line-dashed b-b"></div><form class="form-horizontal form-validation" name=form><input type=submit class=hidden> <span tl-wrap label=已更换的系统>{{ station.name }}</span> <input tl-wrap label=已更换系统激活码 ng-model=xxx><div class="line line-dashed b-b"></div><div class=text-muted>在待定列表中没有相同类型的系统。如需更换一个系统，首先添加一个新的活跃系统.</div><input tl-wrap label=更换系统激活码 required ng-model=xxx1></form></div><ng-include src=" \'athena/debris/_modal_footer.html\' "></ng-include>'), a.put("athena/dastation/station_delete.html", '<div class="modal-body text-center"><i class="fa fa-warning fa-2x text-warning pos-rlt"></i> <span class=modal-title>请确认是否要移除该系统( {{ station.name }} ) ?</span><div class="text-center text-danger">注：系统日志和历史数据将做删除标志。</div></div><ng-include src=" \'athena/debris/_modal_footer.html\' "></ng-include>'), a.put("athena/dastation/station_edit.html", '<div class="modal-header text-center">编辑系统</div><div class=modal-body><form name=form class="form-validation form-horizontal padding-10"><input tl-wrap label=系统名称 required ng-model="das.name " ng-change=" ch( \'name\' , das.name )"><select tl-wrap label=区域 ng-model=op._proj ng-options="p as p.name  for p in projs " required><option value="">--请选择区域--</option></select><textarea ng-model=" das.desc " style="resize: none" label=备注 tl-wrap ng-change=" ch( \'desc\' , das.desc )"></textarea></form></div><ng-include src=" \'athena/debris/_modal_footer.html\' "></ng-include>'), a.put("athena/dastation/station_efficacy.html", '<div class="modal-header text-center"><h4>请确认是否要使采集站 {{ station.name }} 失效 ?</h4></div><div class=modal-body><div class="col-sm-5 text-right"><span>删除日志历史</span></div><div class=col-sm-7><label class=i-checks><input type=checkbox checked><i></i></label></div><div class="text-center text-muted">系统历史数据和警告将做删除标志。</div></div><ng-include src=" \'athena/debris/_modal_footer.html\' "></ng-include>'), a.put("athena/debris/_alert.html", '<div class="modal-body text-center"><h4>{{msg.title}}</h4><div class="small text-muted">{{msg.note}}</div><div class="small text-danger">{{msg.warn }}</div></div><div class=modal-footer><button class="btn btn-sm btn-primary w-46" ng-click=" done() " token>确定</button></div>'), a.put("athena/debris/_device_base.html", '<div class="form-group m-b-xxs"><label class="col-sm-3 control-label">设备类型</label><div class=col-sm-9><input class="form-control height-30" ng-model=dev.type ng-if=" isedit "><div ng-if="! isedit">{{ dev.type }}</div></div></div><div class="form-group m-b-xxs"><label class="col-sm-3 control-label">模板</label><div class=col-sm-9><input class="form-control height-30" ng-model=dev.template ng-if=" isedit "><div ng-if="! isedit">{{ dev.template }}</div></div></div><div class="form-group m-b-xxs"><label class="col-sm-3 control-label">设备名称</label><div class=col-sm-9><input class="form-control height-30" ng-model=dev.name></div></div>'), a.put("athena/debris/_device_modbus.html", '<div class="form-group m-b-xxs"><label class="col-sm-5 control-label">Modbus总线从设备*</label><div class=col-sm-7><input class="form-control height-30" ng-model=dev.type></div></div><div class="form-group m-b-xxs"><label class="col-sm-5 control-label">Modbus总线IP</label><div class=col-sm-7><input class="form-control height-30" ng-model=dev.type></div></div><div class="form-group m-b-xxs"><label class="col-sm-5 control-label">Modbus总线端口</label><div class=col-sm-7><input class="form-control height-30" ng-model=dev.type></div></div>'), a.put("athena/debris/_driver_temp_point.html", '<select tl-wrap ng-model=" opt.D " label=驱动类型 required ng-options="o.id as o.description  for o in drivers" ng-change="driverTypeChange( this )"></select><select ng-options=" o.template_id as o.name  for  o in temps  " tl-wrap ng-model=" opt.temp_id " label=模版 required></select><select ng-options=" o as o.name  for  o in temppoints   " tl-wrap ng-model="opt.point " label=模版点 required></select>'), a.put("athena/debris/_edit_field.html", '<div><div class=form-group><label>编辑</label><input ng-model="$ov.value " class=form-control></div><button class="btn btn-info btn-sm" ng-click=done() token>确定</button> <button class="btn btn-sm" ng-click=cancel()>取消</button></div>'), a.put("athena/debris/_modal_footer.html", '<div class=modal-footer><button class="btn btn-sm btn-primary w-46" ng-click=" done( $event ) " token=2000>确定</button> <button class="btn btn-sm btn-default w-46" ng-click=" cancel(  ) ">取消</button></div>'), a.put("athena/debris/_pager.html", '<pagination class=pagination-sm total-items=page.total ng-model=page.currentPage items-per-page=" $sys.itemsPerPage " ng-change=" loadPageData( page.currentPage   ) " num-pages=" page.numPages " max-size=10 boundary-links=true rotate=false first-text=&laquo; previous-text=&lsaquo; next-text=&rsaquo; last-text=&raquo;></pagination>'), a.put("athena/debris/_tabs.html", '<div class="bg-light lter b-b wrapper-md ng-scope"><h2 class="m-n font-thin h4">{{ title }}</h2></div><div class=wrapper-md><ul class="nav nav-tabs m-t-xxs bg-normal"><li ui-sref-active=active ng-repeat="t in tabs "><a ui-sref={{t.state}}><i class="{{t.icon }}"></i> <span translate={{t.title}}>系统配置</span></a></li></ul><div ui-view></div></div>'), a.put("athena/debris/confirm_invoke.html", '<div class=modal-header>{{ msg.title }}</div><div class="modal-body m-b"><div ng-if=msg.note class=m-l-lg><i class="fa fa-warning fa-2x text-warning"></i> {{ msg.note }}</div><div ng-if="msg.warn " class="m-l-lg text-danger"><i class="fa fa-exclamation-triangle fa-2x"></i> {{ msg.warn}}</div></div><div class=modal-footer><button class="btn btn-sm btn-primary w-46" ng-click=" done() " token translate={{todo}}></button> <button class="btn btn-sm btn-default w-46" ng-click=" cancel() " translate="{{ undo }}">取消</button></div>'), a.put("athena/debris/edit_dev.html", '<div class="modal-header text-center">参数编辑</div><div class=modal-body ng-init=" isedit = true "><form class="bs-example form-horizontal padding-10"><ng-include src=" \'athena/debris/_device_base.html\' "></ng-include><ng-include src=" \'athena/debris/_device_\' +  devtype  + \'.html\' "></ng-include></form></div><ng-include src=" \'athena/debris/_modal_footer.html\' "></ng-include>'), a.put("athena/debris/log_visual.html", '<div class="modal-header text-center">参数编辑</div><div class=modal-body><form class="bs-example form-horizontal padding-10"><div class="form-group m-b-xxs"><label class="col-sm-4 control-label">模板</label><div class=col-sm-8><input class="form-control height-30" ng-model=g.gname></div></div><div class="form-group m-b-xxs"><label class="col-sm-4 control-label">分组</label><div class=col-sm-8><input class="form-control height-30" ng-model=g.gname></div></div><div class="form-group m-b-xxs"><label class="col-sm-4 control-label">参数*</label><div class=col-sm-8><input class="form-control height-30" ng-model=g.gname></div></div><div class="form-group m-b-xxs"><label class="col-sm-4 control-label">描述</label><div class=col-sm-8><input class="form-control height-30" ng-model=g.gname></div></div><div class="form-group m-b-xxs"><label class="col-sm-4 control-label">单元</label><div class=col-sm-8><input class="form-control height-30" ng-model=g.gname></div></div><div class="form-group m-b-xxs"><label class="col-sm-4 control-label">比例缩放</label><div class=col-sm-8><input class="form-control height-30" ng-model=g.gname></div></div><div class="form-group m-b-xxs"><label class="col-sm-4 control-label">偏差</label><div class=col-sm-8><input class="form-control height-30" ng-model=g.gname></div></div><div class="form-group m-b-xxs"><label class="col-sm-4 control-label">Tag</label><div class=col-sm-8><input class="form-control height-30" ng-model=g.gname></div></div><div class="form-group m-b-xxs"><label class="col-sm-4 control-label">十进制数量</label><div class=col-sm-8><input class="form-control height-30" ng-model=g.gname></div></div><div class="form-group m-b-xxs"><label class="col-sm-4 control-label">有效范围</label><div class=col-sm-8><input class="form-control height-30" ng-model=g.gname></div></div><div class="form-group m-b-xxs"><label class="col-sm-4 control-label">枚举</label><div class=col-sm-8><input class="form-control height-30" ng-model=g.gname></div></div><div class="form-group m-b-xxs"><label class="col-sm-4 control-label">日志记录间隔</label><div class=col-sm-8><input class="form-control height-30" ng-model=g.gname></div></div><div class="form-group m-b-xxs"><label class="col-sm-4 control-label">日志类型</label><div class=col-sm-8><input class="form-control height-30" ng-model=g.gname></div></div></form></div><ng-include src=" \'athena/debris/_modal_footer.html\' "></ng-include>'), a.put("athena/debris/prop_view.html", '<div class="modal-header text-center">{{ title }}</div><div class=modal-body><form class="bs-example form-horizontal padding-10"><div class="form-group m-b-xxs" ng-repeat="  (k , v) in props "><label class="col-sm-5 control-label">{{ k }}</label><div class="col-sm-7 m-t-xs">{{ v }}</div></div></form></div><ng-include src=" \'athena/debris/_modal_footer.html\' "></ng-include>'), a.put("athena/debris/regist_no.html", '<div class="modal-body text-center"><i class="fa fa-warning fa-2x text-warning pos-rlt"></i> <span class=modal-title>输入注册码 {{ myform.k0.$valid }} ccccc</span><form class=text-center><input id=regno_in_0 class="form-control w-xxs" ng-keyup=" keyUp( 0, $event ) " ng-change="changeV( 0,  No[0] )" ng-model=" No[0] "> - <input id=regno_in_1 class="form-control w-xxs" ng-keyup=" keyUp( 1,$event  ) " ng-change="changeV( 1,  No[1] )" ng-model=No[1]> - <input id=regno_in_2 class="form-control w-xxs" ng-keyup=" keyUp( 2 ,$event   ) " ng-change="changeV( 2,  No[2] )" ng-model=No[2]> - <input id=regno_in_3 class="form-control w-xxs" ng-keyup=" keyUp( 3 , $event  ) " ng-change="changeV( 3,  No[3] )" ng-model=No[3]></form></div><ng-include src=" \'athena/debris/_modal_footer.html\' "></ng-include>'), a.put("athena/feedback.html", '<div class=modal-header><h4>问题反馈</h4></div><div class=modal-body><form class="bs-example form-validation form-horizontal padding-10" name=form><input tl-wrap-l label=类型: ng-model=point.name><textarea tl-wrap-l ng-model=point.desc label=描述:></textarea></form></div><ng-include src=" \'athena/debris/_modal_footer.html\' "></ng-include>'), a.put("athena/header.html", '<div class="navbar-header {{app.settings.navbarHeaderColor}}"><button class="pull-right visible-xs dk" ui-toggle-class=show data-target=.navbar-collapse><i class=icon-map></i></button> <button class="pull-right visible-xs" ui-toggle-class=off-screen data-target=.app-aside ui-scroll=app><i class="fa fa-bars"></i></button> <span class=navbar-brand><i class="fa fa-cloud fa-fw" ng-class=" {hide : !app.settings.asideFolded  }"></i> <img class=hidden-folded src=img/logo_3.png style="width: 150px"></span></div><div class="collapse navbar-collapse box-shadow {{app.settings.navbarCollapseColor}}"><div class="nav navbar-nav m-l-sm hidden-xs"><a href class="btn no-shadow navbar-btn" ng-click="app.settings.asideFolded = !app.settings.asideFolded"><i class="fa {{app.settings.asideFolded ? \'fa-indent\' : \'fa-dedent\'}} fa-fw"></i></a></div><ul class="nav navbar-nav navbar-right"><li class=dropdown dropdown><a href class="dropdown-toggle clear" dropdown-toggle><span class="thumb-sm avatar pull-right m-t-n-sm m-b-n-sm m-l-sm"><img src=img/a0.jpg alt=...> <i class="on md b-white bottom"></i></span> <span>{{user.username}}</span> <b class=caret></b></a><ul class="dropdown-menu w-lg"><li class="b-b bg-light m-t-n-xs"><p class="text-base m-b-none wrapper">上次登录时间: <span>{{user.last_login_time |date :"yyyy-MM-dd HH:mm"}}</span></p></li><li class=b-b><a ui-sref=" app.my_detail " style="padding: 10px 15px">用户设置</a></li><li class=text-center><a ng-click=logout() style="padding: 10px 15px">注销</a></li></ul></li></ul></div>'), a.put("athena/nav.html", '<ul class=nav><li class="hidden-folded padder m-t m-b-sm text-muted text-xs"><span><h5 translate=nav.a>展1示</h5></span></li><li ui-sref-active=active><a ui-sref=app.s_region><i class="icon icon-grid text-info-dk"></i> <span>区域</span></a></li><li ui-sref-active=active><a ui-sref=app.s_system><i class="icon icon-screen-desktop text-info-dk"></i> <span>系统</span></a></li><li ui-sref-active=active><a ui-sref=app.s_alarm><i class="icon icon-fire text-info-dk"></i> <span>报警</span></a></li><li class="line dk hidden-folded"></li><li class="hidden-folded padder m-t m-b-sm text-muted text-xs"><h5 translate=nav.b>管理</h5></li><li><a ui-sref=app.m_region><i class="icon icon-grid text-info-dk"></i> <span>区域</span></a></li><li><a ui-sref=app.m_system><i class="icon icon-screen-desktop text-info-dk"></i> <span translate=nav.g>系统</span></a></li><li><a href class=auto><span class="pull-right text-muted"><i class="fa fa-fw fa-angle-right text"></i> <i class="fa fa-fw fa-angle-down text-active"></i></span> <i class="icon icon-puzzle text-info-dker"></i> <span translate=nav.c>模型 , 配置项</span></a><ul class="nav nav-sub dk"><li ui-sref-active=active><a ui-sref=app.sysmodel><span translate=nav.c2>系统模型</span></a></li><li ui-sref-active=active><a ui-sref=app.devmodel><span translate=nav.c1>设备模型</span></a></li></ul></li><li><a href class=auto><span class="pull-right text-muted"><i class="fa fa-fw fa-angle-right text"></i> <i class="fa fa-fw fa-angle-down text-active"></i></span> <i class="icon icon-user text-info-dker"></i> <span>用户</span></a><ul class="nav nav-sub dk"><li ui-sref-active=active><a ui-sref=app.user><span>用户管理</span></a></li><li ui-sref-active=active><a ui-sref=app.role.region><span>角色管理</span></a></li></ul></li><li ng-if=user.is_super_user><a ui-sref=app.account_info><i class="icon icon-trophy text-info-dk"></i> <span>账户</span></a></li></ul>'), a.put("athena/page_footer.html", '<p><small class=text-muted><a class=text-muted href="http://www.sunwayland.com/" target=_blank>北京力控元通科技有限公司</a> &copy; 2014<br>京ICP备14040729号-3</small></p>'), a.put("athena/page_forgotpwd.html", '<div class="text-center m-t-lg m-b-sm"><img src=img/logo_2.png class=logo></div><div ng-show=" od.step == \'1\' " load-mask class="m-b-lg container w-xxl w-auto-xs m-t-lg"><form name=step1 class=form-validation><strong>请输入您要找回密码的账户名称</strong> <input ng-model=account.account class="form-control m-t-xs" required> <input name=password ng-model=account.identify class="form-control inline m-t-xs" style=width:55% ng-minlength=4 ng-maxlength=4 placeholder=请输入验证码 required> <img ng-src="node/common/identify/admin?t={{t||123}}" class="inline m-l" style="width: 100px;height: 35px"> <a class="fa fa-refresh text-info" ng-click=" t = t+1 ; od.identiok = false "></a> <button type=submit ng-disabled=" !step1.$valid" class="btn btn-lg btn-primary btn-block m-t" ng-click=" setp1( $event )">下一步</button> <a ui-sref=access.signin class="btn btn-lg btn-default btn-block">返回登录</a></form></div><div ng-show=" od.step == \'2\' " class="m-g-lg m-t-lg"><div class="wrapper text-center"><h4 class=m-t-lg>邮件已经发送至管理员的邮箱</h4><h4>请点击邮件中的连接完成管理员用户密码修改</h4><i class="fa fa-check-circle text-success fa-3x"></i><br><a ui-sref=access.signin class="btn btn-lg w btn-default w-xxm">返回登录</a></div></div><div ng-show=" od.step == \'3\' " load-mask class="m-b-lg m-t-lg container w-xxl w-auto-xs"><form name=form2 class="form-validation m-t"><div class="wrapper text-center"><strong>修改管理员用户密码</strong></div><div class="list-group list-group-sm"><div class=list-group-item><input name=username ng-model=admin.username placeholder=管理员用户名,至少2个字符 ng-minlength=2 ng-maxlength=16 class="form-control no-border" required></div><div class=list-group-item><input name=password ng-model=admin.password placeholder=管理员密码,至少6个字符 ng-minlength=6 ng-maxlength=16 onfocus="this.type=\'password\'" class="form-control no-border" required></div><div class=list-group-item><input type=password class="form-control no-border" name=confirm_password required ng-model=confirm_password placeholder=" 确认密码 " ui-validate=" \'$value==admin.password\' " ui-validate-watch=" \'admin.password\' "><div ng-show=form2.confirm_password.$error.validator class=text-danger>密码输入不一致</div></div></div><button type=submit class="btn btn-lg btn-primary btn-block" ng-click=cc_done()>完成</button> <a ui-sref=access.signin class="btn btn-lg btn-default btn-block">返回登录</a></form></div><div ng-show=" od.step == \'4\' " class="m-b-lg m-t-lg container w-xxl w-auto-xs"><div class="m-g-lg text-center"><h4>页面失效!</h4><h5>5秒后返回登录页面!</h5></div></div><div class="pos-abt w-full text-center" style=bottom:0><div ng-include="\'athena/page_footer.html\'"></div></div>'), a.put("athena/page_signin.html", '<div class="container w-xxl w-auto-xs"><div class="text-center m-t-lg m-b-lg"><img src=img/logo_2.png class=logo></div><div ng-show=op.b class=pos-abt style="z-index:999;top:30%; left:49%"><i class="fa fa-spin fa-3x text-info fa-spinner"></i></div><form name=form class="form-validation m-t-lg"><div class="list-group list-group-sm"><div class=list-group-item><input placeholder=账户名称 class="form-control no-border" name=accountname id=accountname required ng-model=user.account ng-keydown="showErr = false"></div><div class=list-group-item><input placeholder=用户名 class="form-control no-border" name=username id=username ng-keydown="showErr = false" ng-model=user.username required></div><div class=list-group-item><input onfocus="this.type=\'password\'" autocomplete=off placeholder=密码 class="form-control no-border" ng-keydown="showErr =false " id=password name=password ng-model=user.password required></div><div class=list-group-item ng-if="op.need_idenfity "><input name=password ng-model=user.verifi class="form-control inline m-t-xs" style=width:50% placeholder=请输入验证码 required> <img id=login_identify ng-src="node/common/identify/login?t={{op.t||123}}" class="inline m-l" style="width: 80px;height: 30px"> <a class="fa fa-refresh text-info" ng-click=" op.t = op.t+1"></a></div></div><div class="text-danger wrapper text-center" ng-show=" resp.err==\'pass_error\' ">帐号或密码不正确!</div><div class="text-danger wrapper text-center" ng-show=" resp.err==\'verifi_error\' ">验证码不正确!</div><button type=submit class="btn btn-lg btn-primary btn-block" ng-click=login() ng-disabled=op.b>登录</button><div class="text-center m-t m-b"><a ui-sref=access.forgotpwd class="text-primary font-normal">忘记管理员密码?</a></div><div class="line line-dashed"></div><a ui-sref=access.signup class="btn btn-lg btn-default btn-block">企业注册</a></form><div class="text-center m-t" ng-include=" \'athena/page_footer.html\' "></div></div>'), a.put("athena/page_signup.html", '<div class="text-center m-t-lg m-b-sm"><img src=img/logo_2.png class=logo></div><div ng-show=" op.step == \'step1\' " load-mask class="m-b-lg container w-xxl w-auto-xs m-t-lg"><div class="wrapper text-center"><strong>1/3&nbsp;&nbsp;注册account用户</strong></div><form name=form1 class=form-validation><div class="list-group list-group-sm"><div class=list-group-item><input name=username ng-model=comp.name placeholder=账户名称(2至20个字符) class="form-control no-border" required ng-minlength=2 ng-maxlength=20></div><div class=list-group-item><input name=invicode ng-model=comp.invitation_code placeholder=激活码 class="form-control no-border" required></div><div class=list-group-item><input name=email ng-model=comp.admin.email type=email placeholder=邮箱 class="form-control no-border" required></div><div class=list-group-item><input name=password ng-model=comp.identifyCode class="form-control inline m-t-xs" style=width:50% placeholder=请输入验证码 required> <img ng-src="node/common/identify/account?t={{op.t||123}}  " class="inline m-l" style="width: 100px;height: 30px"> <a class="fa fa-refresh text-info" ng-click=" op.t = op.t+1"></a></div></div><div class="checkbox m-b-md m-t-none"><label class="i-checks small"><input type=checkbox name=check ng-model=agree required><i></i> 我已阅读并同意 <a href="ThingLinx Terms.pdf" target=_blank style="text-decoration: underline">&lt;&lt;ThingLinx工业云使用条款&gt;&gt;</a></label></div><button type=submit class="btn btn-lg btn-primary btn-block" ng-click="signup( $event )">注册</button> <a ui-sref=access.signin class="btn btn-lg btn-default btn-block">返回登录</a></form></div><div ng-show=" op.step == \'step2\' " class="m-g-lg m-t-lg"><div class="wrapper text-center"><strong>2/3&nbsp;&nbsp;验证邮箱</strong><h4 class=m-t-lg>激活邮件已经发送至您的邮箱{{comp.admin.email}}</h4><h4>请点击邮件中的连接完成注册</h4><button class="btn btn-info btn-lg w-lg" ng-show=true ng-click=openEmail()>登录邮箱</button><br><i class="fa fa-check-circle text-success fa-3x" ng-show=""></i></div><div class="text-left b-t p-t-20 pos-abt color-5" style="bottom:130px;width: 80%;margin-left: 10%"><div><span>没有收到邮件?</span> <a href="" class=text-info ng-click="reSendEmail();  op.showe=true" ng-show=!op.showe>点此重发邮件</a></div><div class="m-l-lg m-t-xs m-b-xs">看看是否在邮箱的回收站, 垃圾邮件中</div><div class=m-l-lg>请尝试更换其他的邮箱注册</div></div></div><div ng-show=" op.step == \'step3\' " load-mask class="m-b-lg m-t-lg container w-xxl w-auto-xs"><form name=form2 class="form-validation m-t"><div class="wrapper text-center"><strong>3/3&nbsp;&nbsp;完成注册</strong></div><div class="list-group list-group-sm"><div class=list-group-item><input name=password ng-model=comp.admin.username placeholder=管理用户名,至少2个字符 ng-minlength=2 ng-maxlength=16 class="form-control no-border" required></div><div class=list-group-item><input name=password ng-model=comp.admin.password placeholder=管理员密码,至少6个字符 ng-minlength=6 ng-maxlength=16 onfocus="this.type=\'password\'" class="form-control no-border" required></div><div class=list-group-item><input type=password class="form-control no-border" name=confirm_password required ng-model=confirm_password placeholder=" 确认密码 " ui-validate=" \'$value==comp.admin.password\' " ui-validate-watch=" \'comp.admin.password\' "><div ng-show=form2.confirm_password.$error.validator class=text-danger>密码输入不一致</div></div></div><button type=submit class="btn btn-lg btn-primary btn-block" ng-click=create()>完成</button> <a ui-sref=access.signin class="btn btn-lg btn-default btn-block">返回登录</a></form></div><div ng-show=!op.step class="wrapper text-center"><i class="fa fa"></i></div><div class="pos-abt w-full text-center" style=bottom:0><div ng-include="\'athena/page_footer.html\'"></div></div>'), a.put("athena/page_verifyemail.html", '<div class="text-center m-t-lg m-b-sm"><img src=img/logo_2.png class=logo></div><div class="wrapper text-center"><div class="m-g-lg m-t-lg" ng-show=" op.verifyemail ==1 "><h4>用户邮箱验证成功</h4><i class="fa fa-check-circle text-success fa-3x"></i><br></div><div class=m-g-lg ng-show="op.verifyemail == 2 "><h4>页面失效!</h4></div></div>'), a.put("athena/region/msg_add.html", '<div class="form-group col-lg-12" style="margin-top  : 30px"><label>信息板名称:</label><input ng-model=data.panel_name class=form-control></div><div class="form-group col-lg-12"><label>访问级别:</label><select class=form-control ng-model=data.access_level ng-options=" k as v  for  (k,v) in types"></select></div><div class="form-group col-lg-12"><label>类型:</label><button class="btn btn-sm w-46 btn-default" ng-click="">资料</button></div><div id=frofile class="form-group col-lg-12"><label>资料:</label><select class=form-control ng-model=obj ng-options=" obj as obj.name  for obj in type_name "></select></div><div class="form-group col-lg-12"><button class="btn m-b-xs w-60 btn-dark btn-success" ng-click=save()>保存</button></div>'), a.put("athena/region/msg_desc.html", '<div class="form-group col-lg-12" ng-repeat="panel  in panelList" style="margin-top :  10px"><a ng-click=panel_edit(panel) class="text-info col-sm-8">{{ panel.panel_name }}</a> <a class="fa fa-times col-sm-4" ng-click="panel_del( panel , panelList , $index)"></a></div>'), a.put("athena/region/panel_edit.html", '<div class=col-sm-6 style="margin-top : 30px"><button class="btn m-b-xs w-60 btn-dark btn-success" ng-click=save()>保存</button></div><div id=panel_content class=col-sm-12></div>'), a.put("athena/region/pro_addproject.html", '<div class="col-lg-10 col-lg-offset-1"><form name=forma class="form-horizontal form-validation"><div class="panel panel-default"><div class=panel-heading><strong>添加项目</strong></div><div class=panel-body><div class="line line-dashed b-b line-lg pull-in"></div><div class=form-group><label class="col-sm-3 control-label">项目名称</label><div class=col-sm-9><input class=form-control ng-model=g.b required></div></div><div class="line line-dashed b-b line-lg pull-in"></div><div class=form-group><label class="col-sm-3 control-label">开始查看</label><div class=col-sm-9><select class="form-control m-t" ng-model=f.b required><option value=foo>列表视图</option><option value=bar>地图试图</option></select></div></div><div class=form-group><label class="col-sm-3 control-label">公司</label><div class=col-sm-9><input type=email class=form-control placeholder=email ng-model=g.a required></div></div><div class=form-group><label class="col-sm-3 control-label">联系人</label><div class=col-sm-9><input type=email class=form-control placeholder=email ng-model=g.a required></div></div><div class=form-group><label class="col-sm-3 control-label">电话号码</label><div class=col-sm-9><input class=form-control placeholder="(XXX) XXXX XXX" ng-model=g.g ng-pattern="/\\([0-9]{3}\\) ([0-9]{3}) ([0-9]{3})$/" required></div></div><div class=form-group><label class="col-sm-3 control-label">手机</label><div class=col-sm-9><input type=number class=form-control placeholder=email ng-model=g.a required></div></div><div class=form-group><label class="col-sm-3 control-label">电子邮件</label><div class=col-sm-9><input type=email class=form-control placeholder=email ng-model=g.a required></div></div><div class=form-group><label class="col-sm-3 control-label">地址</label><div class=col-sm-9><input type=email class=form-control ng-model=g.a required></div></div><div class=form-group><label class="col-sm-3 control-label">邮编</label><div class=col-sm-9><input type=number class=form-control ng-model=g.a required></div></div><div class=form-group><label class="col-sm-3 control-label">城市</label><div class=col-sm-9><input class=form-control ng-model=g.a required></div></div><div class=form-group><label class="col-sm-3 control-label">省/县</label><div class=col-sm-9><input class=form-control ng-model=g.a required></div></div><div class=form-group><label class="col-sm-3 control-label">国家</label><div class=col-sm-9><input class=form-control ng-model=g.a required></div></div><div class=form-group><label class="col-sm-3 control-label">其他信息</label><div class=col-sm-9><input class=form-control ng-model=g.a required></div></div><footer class="panel-footer text-center bg-light lter"><button type=submit class="btn w-60 btn-success">Submit</button></footer></div></div></form></div>'), a.put("athena/region/pro_man_prop.html", '<div class="bg-light lter b-b wrapper-md ng-scope"><h2 class="m-n font-thin h4">{{title}}</h2></div><div class=wrapper-md><ul class="nav nav-tabs m-t-xxs bg-normal"><li ui-sref-active=active><a ui-sref=app.m_region_prop.system><i class="icon icon-screen-desktop"></i> <span>系统</span></a></li><li ui-sref-active=active><a ui-sref=app.m_region_prop.author><i class="icon icon-user"></i> <span>权限</span></a></li></ul><div ui-view class=b-t-none></div></div>'), a.put("athena/region/project_add_temp.html", '<div class=modal-header>创建区域</div><div class=modal-body load-mask><form name=form class="form-horizontal form-validation"><input tl-wrap label=区域名称 required ng-model=" proj.name "><textarea tl-wrap label=备注 ng-model=" proj.desc " style="resize: none" ng-maxlength=100 placeholder=" 不应超过100字符"></textarea></form></div><ng-include src=" \'athena/debris/_modal_footer.html\' "></ng-include>'), a.put("athena/region/project_info.html", '<div class="panel-body no-padder bg-light bg-white"><div class="col-md-8 col-md-offset-2 col-lg-5 col-lg-offset-3 m-b-lg m-t-l text-base"><div class="b-b line-dashed jbox"><span>区域名称</span> <span class="float-right color-5">{{proj.name}}</span></div><div class="b-b line-dashed jbox"><span>联系人</span> <span class="float-right color-5">{{proj.contact_user}}</span></div><div class="b-b line-dashed jbox"><span>电话号码</span> <span class="float-right color-5">{{proj.mobile_phone}}</span></div><div class="b-b line-dashed jbox"><span>电子邮件</span> <span class="float-right color-5">{{proj.email}}</span></div><div class="b-b line-dashed jbox"><span>地址</span> <span class="float-right color-5">{{proj.address}}</span></div><div class=jbox><span>备注</span> <span class="float-right color-5">{{proj.desc}}</span></div></div></div>'),
        a.put("athena/region/project_temp.html", '<div class="bg-light lter b-b wrapper-md ng-scope"><h2 class="m-n font-thin h4">{{::isShowModul?"区域":"区域管理" }}</h2></div><div class=wrapper-md><div class="panel panel-default"><div class=panel-heading>区域列表</div><div class="panel-body no-border table-responsive no-padder" load-mask><div class="col-md-4 m-t m-b"><div class=input-group><input class=form-control ng-model=f_projname> <span class=input-group-btn><button class="btn btn-default" type=button ng-click=" loadPageData(1)">搜索</button></span></div></div><table class="table table-hover table-striped b-t"><thead class=flip-content><tr class=background><th width=20%><a translate=th.th2>名称</a></th><th width=30%><a translate=th.th3>创建时间</a></th><th width=10%>已激活系统</th><th width=10% ng-if=" ! isShowModul ">未激活系统</th><th width=30%>备注</th><th width=10% ng-if=" ! isShowModul ">删除</th></tr></thead><tbody><tr ng-repeat="  proj  in page.data  " ng-init=" collectRegionId( proj , $last )"><td><a class=text-info-dk ng-click="  goto ( _$nextState ,  proj  , proj ); ">{{ proj.name }}</a><popwin ng-model=proj ng-if=" !isShowModul" prop=name handler=" updateRegion  "></td><td>{{ :: proj.create_time | date:"yyyy-MM-dd HH:mm Z" }}</td><td class=numeric id=act_{{proj.id}}>0</td><td class=numeric ng-if=" ! isShowModul " id=unact_{{proj.id}}>0</td><td>{{ proj.desc}}<popwin ng-model=proj ng-if=" !isShowModul" prop=desc handler=" updateRegion  "></td><td class=numeric ng-if=" ! isShowModul "><a class="text-info-dk m-r-xs" ng-disabled=true ng-click="delProject( proj  , $index   )">删除</a></td></tr></tbody></table></div><div class=panel-footer><button class="btn btn-primary btn-sm pos-abt m-l-sm" ng-if=" !isShowModul" ng-click="  addProj() ">添加区域</button><div class=text-center ng-include src=" \'athena/debris/_pager.html\'  "></div></div></div></div>'),
        a.put("athena/region/prop_author.html", '<div class="panel panel-default b-t-none"><div class="panel-body no-border table-responsive no-padder"><table class="table table-striped j_table b-t-none"><thead class=flip-content><tr><th>用户</th><th>角色</th><th>权限</th></tr></thead><tbody><tr ng-repeat="u in users " ng-init=" getUser(u )" ng-if=!u.is_super_user><td><a ui-sref="app.userdetail({id: u.user_id })" class=text-info>{{:: u.username}}</a></td><td>{{ :: u.role_name}}</td><td>{{ :: privilge2Text ( u.privilege ) }}</td></tr></tbody></table></div></div>'),


        a.put("athena/_device/PLC_MITSUBISHI_FX_PG.html", "<select tl-wrap label=设备型号 ng-model=D.params.type ng-options=\" o.v as o.k for  o in [ {k:'FX1S' , v:0} , {k:'FX2N' , v:1} ]\" required></select>"),

        a.put("athena/_point/PLC_MITSUBISHI_FX_PG.html", '<div class=hidden ng-init=" _config = $sys.point[ dm.driver_id] ; \n              _config.AreaCC( point , this  , true ) "></div><select tl-wrap label=数据区 ng-model=point.params.area ng-change="   _config.AreaCC( point , this ) " ng-options="  o.v as o.k for  o in  _config.area  "></select><div ng-if=" point.params.area  <= 1 "><input tl-wrap label=偏移地址 required type=Number max=377 min=0 pattern=^[0-7]*$ ng-model="point.params.offset"></div><div ng-if="  point.params.area==4 || point.params.area==5 || point.params.area==8 || point.params.area==9 "><input tl-wrap label=偏移地址 required type=Number max=255 min=0 ng-model="point.params.offset"></div><div ng-if=" point.params.area == 2 "><input tl-wrap label=偏移地址 required type=Number max=3071 min=0 ng-model="point.params.offset"></div><div ng-if=" point.params.area == 3 "><input tl-wrap label=偏移地址 required type=Number max=999 min=0 ng-model="point.params.offset"></div><div ng-if=" point.params.area == 6 "><input tl-wrap label=偏移地址 required type=Number max=8999 min=0 ng-model="point.params.offset"></div><div ng-if=" point.params.area == 7 "><input tl-wrap label=偏移地址 required type=Number max=8255 min=8000 ng-model="point.params.offset"></div><select tl-wrap label=数据类型 ng-model=point.params.type ng-change="  _config.TypeCC( point  , this ) " ng-options=" o.v as o.k for o  in   _dataType "></select><div ng-if="  point.params.area == 6 || point.params.area == 8  || point.params.area == 9 "><div ng-if=" point.params.type == 0    "><input tl-wrap required label=位偏移 type=number max=15 min=0 placeholder=" 0 - 15 " tl-default=0 ng-model="point.params.type_ex"></div><div ng-if=" point.params.type == 11   "><input tl-wrap required label=长度 type=number max=31 min=1 placeholder=" 1 - 31 " tl-default=0 ng-model="point.params.type_ex"></div><div ng-if=" point.params.type  == 1 ||  point.params.type  == 2   "><select tl-wrap label=高低字节 ng-model=point.params.type_ex ng-options=" o.v as o.k for o  in  _config.hlbyte "></select></div></div><select tl-wrap label=访问方式 ng-model=point.params.access ng-options=" o.v as o.k for o in  _accessType "></select>'),




        a.put("athena/settings.html", ' <button class="btn btn-default no-shadow pos-abt" ui-toggle-class=active target=.settings><i class="fa fa-gear"></i></button><div class=panel-heading>Settings</div><div class=panel-body><div class=m-b-sm><label class="i-switch bg-info pull-right"><input type=checkbox ng-model=app.settings.headerFixed> <i></i></label>Fixed header</div><div class=m-b-sm><label class="i-switch bg-info pull-right"><input type=checkbox ng-model=app.settings.asideFixed> <i></i></label>Fixed aside</div><div><label class="i-switch bg-info pull-right"><input type=checkbox ng-model=app.settings.asideFolded> <i></i></label>Folded aside</div></div><div class="wrapper b-t b-light bg-light lter r-b"><div class="row row-sm"><div class=col-xs-6><label class="i-checks block m-b" ng-click="\r\n          app.settings.navbarHeaderColor=\'bg-black\'; \r\n          app.settings.navbarCollapseColor=\'bg-white-only\'; \r\n          app.settings.asideColor=\'bg-black\';\r\n         "><input type=radio name=a ng-model=app.settings.themeID value=1> <span class="block bg-light clearfix pos-rlt"><span class="active pos-abt w-full h-full bg-black-opacity text-center"><i class="glyphicon glyphicon-ok text-white m-t-xs"></i></span> <b class="bg-black header"></b> <b class="bg-white header"></b> <b class=bg-black></b></span></label><label class="i-checks block m-b" ng-click="\r\n          app.settings.navbarHeaderColor=\'bg-white-only\'; \r\n          app.settings.navbarCollapseColor=\'bg-white-only\'; \r\n          app.settings.asideColor=\'bg-black\';\r\n         "><input type=radio ng-model=app.settings.themeID value=2> <span class="block bg-light clearfix pos-rlt"><span class="active pos-abt w-full h-full bg-black-opacity text-center"><i class="glyphicon glyphicon-ok text-white m-t-xs"></i></span> <b class="bg-white header"></b> <b class="bg-white header"></b> <b class=bg-black></b></span></label><label class="i-checks block m-b" ng-click="\r\n          app.settings.navbarHeaderColor=\'bg-primary\'; \r\n          app.settings.navbarCollapseColor=\'bg-white-only\'; \r\n          app.settings.asideColor=\'bg-dark\';\r\n         "><input type=radio ng-model=app.settings.themeID value=3> <span class="block bg-light clearfix pos-rlt"><span class="active pos-abt w-full h-full bg-black-opacity text-center"><i class="glyphicon glyphicon-ok text-white m-t-xs"></i></span> <b class="bg-primary header"></b> <b class="bg-white header"></b> <b class=bg-dark></b></span></label><label class="i-checks block m-b" ng-click="\r\n          app.settings.navbarHeaderColor=\'bg-info\'; \r\n          app.settings.navbarCollapseColor=\'bg-white-only\'; \r\n          app.settings.asideColor=\'bg-black\';\r\n         "><input type=radio ng-model=app.settings.themeID value=4> <span class="block bg-light clearfix pos-rlt"><span class="active pos-abt w-full h-full bg-black-opacity text-center"><i class="glyphicon glyphicon-ok text-white m-t-xs"></i></span> <b class="bg-info header"></b> <b class="bg-white header"></b> <b class=bg-black></b></span></label><label class="i-checks block m-b" ng-click="\r\n          app.settings.navbarHeaderColor=\'bg-success\'; \r\n          app.settings.navbarCollapseColor=\'bg-white-only\'; \r\n          app.settings.asideColor=\'bg-dark\';\r\n         "><input type=radio ng-model=app.settings.themeID value=5> <span class="block bg-light clearfix pos-rlt"><span class="active pos-abt w-full h-full bg-black-opacity text-center"><i class="glyphicon glyphicon-ok text-white m-t-xs"></i></span> <b class="bg-success header"></b> <b class="bg-white header"></b> <b class=bg-dark></b></span></label><label class="i-checks block" ng-click="\r\n          app.settings.navbarHeaderColor=\'bg-danger\'; \r\n          app.settings.navbarCollapseColor=\'bg-white-only\'; \r\n          app.settings.asideColor=\'bg-dark\';\r\n         "><input type=radio ng-model=app.settings.themeID value=6> <span class="block bg-light clearfix pos-rlt"><span class="active pos-abt w-full h-full bg-black-opacity text-center"><i class="glyphicon glyphicon-ok text-white m-t-xs"></i></span> <b class="bg-danger header"></b> <b class="bg-white header"></b> <b class=bg-dark></b></span></label></div><div class=col-xs-6><label class="i-checks block m-b" ng-click="\r\n          app.settings.navbarHeaderColor=\'bg-primary\'; \r\n          app.settings.navbarCollapseColor=\'bg-primary\'; \r\n          app.settings.asideColor=\'bg-white b-r\';\r\n         "><input type=radio ng-model=app.settings.themeID value=7> <span class="block bg-light clearfix pos-rlt"><span class="active pos-abt w-full h-full bg-black-opacity text-center"><i class="glyphicon glyphicon-ok text-white m-t-xs"></i></span> <b class="bg-primary header"></b> <b class="bg-primary header"></b> <b class=bg-white></b></span></label><label class="i-checks block m-b" ng-click="\r\n          app.settings.navbarHeaderColor=\'bg-info dker\'; \r\n          app.settings.navbarCollapseColor=\'bg-info dker\'; \r\n          app.settings.asideColor=\'bg-light dker b-r\';\r\n         "><input type=radio ng-model=app.settings.themeID value=8> <span class="block bg-light clearfix pos-rlt"><span class="active pos-abt w-full h-full bg-black-opacity text-center"><i class="glyphicon glyphicon-ok text-white m-t-xs"></i></span> <b class="bg-info dker header"></b> <b class="bg-info dker header"></b> <b class="bg-light dker"></b></span></label><label class="i-checks block m-b" ng-click="\r\n          app.settings.navbarHeaderColor=\'bg-primary\'; \r\n          app.settings.navbarCollapseColor=\'bg-primary\'; \r\n          app.settings.asideColor=\'bg-dark\';\r\n         "><input type=radio ng-model=app.settings.themeID value=9> <span class="block bg-light clearfix pos-rlt"><span class="active pos-abt w-full h-full bg-black-opacity text-center"><i class="glyphicon glyphicon-ok text-white m-t-xs"></i></span> <b class="bg-primary header"></b> <b class="bg-primary header"></b> <b class=bg-dark></b></span></label><label class="i-checks block m-b" ng-click="\r\n          app.settings.navbarHeaderColor=\'bg-info dker\'; \r\n          app.settings.navbarCollapseColor=\'bg-info dk\'; \r\n          app.settings.asideColor=\'bg-black\';\r\n         "><input type=radio ng-model=app.settings.themeID value=10> <span class="block bg-light clearfix pos-rlt"><span class="active pos-abt w-full h-full bg-black-opacity text-center"><i class="glyphicon glyphicon-ok text-white m-t-xs"></i></span> <b class="bg-info dker header"></b> <b class="bg-info dk header"></b> <b class=bg-black></b></span></label><label class="i-checks block m-b" ng-click="\r\n          app.settings.navbarHeaderColor=\'bg-success\'; \r\n          app.settings.navbarCollapseColor=\'bg-success\';\r\n          app.settings.asideColor=\'bg-dark\';\r\n          "><input type=radio ng-model=app.settings.themeID value=11> <span class="block bg-light clearfix pos-rlt"><span class="active pos-abt w-full h-full bg-black-opacity text-center"><i class="glyphicon glyphicon-ok text-white m-t-xs"></i></span> <b class="bg-success header"></b> <b class="bg-success header"></b> <b class=bg-dark></b></span></label><label class="i-checks block" ng-click="\r\n          app.settings.navbarHeaderColor=\'bg-danger dker bg-gd\'; \r\n          app.settings.navbarCollapseColor=\'bg-danger dker bg-gd\'; \r\n          app.settings.asideColor=\'bg-dark\';\r\n         "><input type=radio ng-model=app.settings.themeID value=12> <span class="block bg-light clearfix pos-rlt"><span class="active pos-abt w-full h-full bg-black-opacity text-center"><i class="glyphicon glyphicon-ok text-white m-t-xs"></i></span> <b class="bg-danger dker header"></b> <b class="bg-danger dker header"></b> <b class=bg-dark></b></span></label></div></div></div>'), a.put("athena/show/alarm.html", '<div class="bg-light lter b-b wrapper-md ng-scope"><h2 class="m-n font-thin h4">报警</h2></div><div class=wrapper-md><div class="panel panel-default"><div class=panel-heading style="padding-bottom: 0"><div class=row><form class=form-validation name=form><div class="col-md-4 col-xs-6 m-t-sm tl-wrap-r wrap-label-span-30"><div class=form-group><label class="col-sm-4 no-padder control-label"><span>区域</span></label><div class=col-sm-8><select class="input input-sm form-control" ng-model=od.region_id ng-options="p.id as p.name  for p in  regions" ng-change=" loadSys()"><option value="">全部区域</option></select></div></div></div><div class="col-md-4 col-xs-6 m-t-sm tl-wrap-r wrap-label-span-30"><div class=form-group><label class="col-sm-4 no-padder control-label"><span>系统</span></label><div class=col-sm-8><select class="input input-sm form-control" ng-model=" od.system_id" ng-options="s.uuid as s.name  for s in systems"><option value="">全部系统</option></select></div></div></div><div class="col-md-4 col-xs-6 m-t-sm tl-wrap-r wrap-label-span-30"><div class=form-group><label class="col-sm-4 no-padder control-label"><span>严重性</span></label><div class=col-sm-8><select class="input input-sm form-control" ng-model=od.severity name=serverify ng-options=" k as v for (k,v) in $sys.trigger.severity"><option value="">全部</option></select></div></div></div><div class="col-md-4 col-xs-6 m-t-sm tl-wrap-r wrap-label-span-30"><div class=form-group><label class="col-sm-4 no-padder control-label"><span>起始时间</span></label><div class=col-sm-8><input class="input input-sm form-control" datetime-picker date-format="yyyy-MM-dd HH:mm" nofocus data-readonly-input=false ng-model=od.start is-open="op.showS"> <span class=float-left><button type=button style="position: absolute;top: 0;right: 10px" class="btn btn-default btn-sm" ng-click="openCalendar($event, \'op.showS=true\')"><i class="fa fa-calendar"></i></button></span></div></div></div><div class="col-md-4 col-xs-6 m-t-sm tl-wrap-r wrap-label-span-30"><div class=form-group><label class="col-sm-4 no-padder control-label"><span>结束时间</span></label><div class=col-sm-8><input class="input input-sm form-control" datetime-picker date-format="yyyy-MM-dd HH:mm" nofocus data-readonly-input=false ng-model=od.end is-open="op.showE"> <span class=float-left><button type=button style="position: absolute;top: 0;right: 10px" class="btn btn-default btn-sm" ng-click="openCalendar($event, \'op.showE=true\')"><i class="fa fa-calendar"></i></button></span></div></div></div><div class="col-md-4 col-xs-6 m-t-sm tl-wrap-r wrap-label-span-30"><div class=form-group><label class="col-sm-4 no-padder control-label"><span>类别</span></label><div class=col-sm-8><select class="input input-sm form-control" ng-model=od.class_id ng-options=" v for v in [1,2,3,4,5,6,7,8,9,0]"><option value="">全部</option></select></div></div></div><div class="col-md-4 col-xs-12 m-t-sm padder float-right"><div class="form-group m-t-xs"><button class="btn btn-info btn-sm w-46" ng-click=loadPageData(1) token>查询</button></div></div></form></div><div class="row bg-white m-t-sm b-t"><p class="h4 pull-left padder" style="height: 60px;line-height: 60px;font-weight: 100">报警详情</p><div class="radio pull-right m-r"><label class=i-checks><input type=radio value=b checked ng-model="op.active "> <i></i> 全部报警</label></div><div class="radio pull-right m-r m-t"><label class=i-checks><input type=radio value=a ng-model=op.active> <i></i> 活跃报警</label></div></div></div><div class="panel-body table-responsive no-padder no-border" load-mask ng-init=" _$A = $sys.trigger.op"><table class="table table-hover table-striped j_table" ng-init="_config = $sys.trigger.severity"><thead class=flip-content><tr class=background><th>报警ID</th><th width=10%>报警时间</th><th>系统ID</th><th>报警描述</th><th>重要性</th><th>类别</th><th>活跃状态</th><th class=w-xs style="padding-right: 20px">操作</th></tr></thead><tbody><tr ng-repeat="  a  in page.data  "><td>{{ :: a.id }}</td><td>{{ :: a.timestamp | date:"yyyy-MM-dd HH:mm:ss" }}</td><td><a ui-sref="app.s_system_prop.basic({uuid: a.system_id })" class=text-info>{{ :: a.system_id }}</a></td><td>{{ :: a.desc }}</td><td>{{ :: _config[a.severity] }}</td><td>{{ :: a.class_id }}</td><td>{{ a.active? "活跃":"关闭" }}</td><td style="padding-right: 20px"><a class=text-info ng-if=" a.active!=1 " ng-click="showAlarmMsg(a , od.system_id )">详细信息</a> <a ng-if=" a.active == 1 " class=text-info ng-click="conformAlarm( page, a , $index , od.system_id , op.active )">确认报警</a></td></tr></tbody></table></div><div class=panel-footer><div class=text-center ng-include src=" \'athena/debris/_pager.html\'  "></div></div></div></div>'), a.put("athena/show/alarm_bb.html", '<div class="panel panel-default"><div class=panel-heading style=padding-top:0px><form class="form-inline form-validation ng-pristine ng-valid" name=form><div class="form-group m-t-xs"><label class="i-checks m-t-xs" style=padding-left:0>活跃报警 <input type=checkbox ng-model=xxx> <i style=margin-left:0></i></label></div><div class="form-group m-t-xs"><label>区域</label><select class="input input-sm" ng-model=od.orgin ng-options="p.id as p.name  for p in  projs"><option value="">所有区域</option></select><label>系统</label><select class="input input-sm"><option value="">所有系统</option></select></div><div class="form-group m-t-xs"><label>严重性</label><select class="input input-sm" ng-model=od.severity ng-options=" k as v for (k,v) in $sys.trigger.severity"><option value="">全部</option></select><label>类别</label><select class="input input-sm" ng-model=od.class ng-options=" v for v in [1,2,3,4,5,6,7,8,9,0]"><option value=""></option></select></div><div class="form-group m-t-xs"><label class="w-xxs text-right control-label float-left m-t-xs">起始时间:</label><input class="input input-sm float-left" datetime-picker date-format="yyyy-MM-dd HH:mm" nofocus data-readonly-input=false ng-model=od.start is-open="op.showS"> <span class=float-left><button type=button class="btn btn-default btn-sm" ng-click="openCalendar($event, \'op.showS=true\')"><i class="fa fa-calendar"></i></button></span><label class="w-xxs text-right control-label float-left m-t-xs">结束时间:</label><input class="input input-sm float-left" datetime-picker date-format="yyyy-MM-dd HH:mm" nofocus ng-model=od.end is-open="op.showE"> <span class=float-left><button type=button class="btn btn-default btn-sm" ng-click="openCalendar($event, \'op.showE=true\')"><i class="fa fa-calendar"></i></button></span></div><div class="form-group m-t-xs"><span ng-if=" op.ala !=\'a\' " class="btn btn-info btn-sm w-46 m-l" ng-click=queryAlarm() token=5000>查询</span></div></form><div ng-if=$debug>od = {{od}}<br>op ={{op}}</div></div><div class="panel-body table-responsive no-padder" ng-init=" _$A = $sys.trigger.op"><table class="table table-bordered" ng-init="_config = $sys.trigger.severity"><thead class=flip-content><tr class=background><th>报警ID</th><th>报警时间</th><th>报警描述</th><th>重要性</th><th>类别</th><th>活跃状态</th><th class=w-xs></th></tr></thead><tbody class=text-center><tr ng-repeat="  a  in alarms  " class=hover><td>{{ a.id }}</td><td>{{ a.timestamp | date:"yyyy-MM-dd HH:mm:ss" }}</td><td>{{ a.desc }}</td><td>{{ _config[a.severity] }}</td><td>{{ a.class_id }}</td><td>{{ a.active?"活跃":"关闭" }}</td><td><a class=text-link ng-click=alarmMsg(a)>详细信息</a></td></tr></tbody></table></div></div>'), a.put("athena/show/alarm_conform.html", '<div class=modal-header><h4>确认报警</h4></div><div class=modal-body><form name=form class="form-validation form-horizontal"><textarea tl-wrap ng-model=od.message label=确认信息 ng-maxlength=50 placeholder=请输入确认信息> </textarea></form></div><ng-include src=" \'athena/debris/_modal_footer.html\' "></ng-include>'), a.put("athena/show/alarm_msg.html", '<div class="well lt row" style=margin-bottom:0px><div class="text-center m-b m-t"><strong>详细信息</strong></div><div class="col-xs-6 p-15 m-b"><div class=p-l>报警Id: {{alarm.id}}<br>触发器Id: {{ alarm.trigger_id}}<br>报警时间:{{ alarm.timestamp | date:"yyyy-MM-dd HH:mm:ss" }}<br>重要性:{{ $sys.trigger.severity[ alarm.severity ] }}<br>报警描述: {{alarm.desc}}<br>类别: {{alarm.class_id}}<br></div></div><div class=col-xs-6><div class=p-l>活跃状态:{{ alarm.active==1?"活跃":"关闭" }}<br>关闭时间: {{ alarm.close_time | date:"yyyy-MM-dd HH:mm:ss" }}<br>确认信息: {{ conformMsg.message }}<br>确认人: {{ conformMsg.username }}<br></div></div></div>'), a.put("athena/show/region_system.html", '<div class="bg-light lter b-b wrapper-md ng-scope"><h2 class="m-n font-thin h4">{{title}}</h2></div><div class=wrapper-md><ng-include src=" \'athena/dastation/dastation_temp_panel.html\' "></ng-include></div>'), a.put("athena/show/system_prop.html", '<div class="bg-light lter b-b wrapper-md ng-scope"><span class="m-n font-thin h4">{{ system.name }}</span> <i class="m-l fa fa-circle {{ system.online==1 ?\'text-success\' : \'text-danger\' }}"></i></div><div class=wrapper-md><ul class="nav nav-tabs m-t-xxs bg-normal"><li ui-sref-active=active><a class=inline ui-sref=app.s_system_prop.basic><i class="icon icon-info"></i> <span>系统概览</span></a></li><li ui-sref-active=active><a class=inline ui-sref=app.s_system_prop.current><i class="icon icon-graph"></i> <span>实时</span></a></li><li ui-sref-active=active><a ui-sref=app.s_system_prop.history><i class="fa fa-history"></i> <span>历史</span></a></li><li ui-sref-active=active><a ui-sref=app.s_system_prop.alarm><i class="icon icon-fire"></i> <span>报警</span></a></li><li ui-sref-active=active><a ui-sref=app.s_system_prop.map><i class="icon icon-pointer"></i> 地图</a></li><li ui-sref-active=active ng-if=user.viewPanel><a ui-sref=app.s_system_prop.panel><i class="icon icon-flag"></i> 信息板</a></li></ul><div ui-view></div></div>'), a.put("athena/show/system_prop_alarm.html", '<div class="panel panel-default b-t-none"><div class="panel-heading bg-white-only" style=padding-top:0px><form class="form-validation ng-pristine ng-valid padding-10" name=form><div class=row><div class="radio pull-right m-r"><label class=i-checks><input type=radio ng-model=op.ala value=b> <i></i> 全部报警</label></div><div class="radio pull-right m-r m-t"><label class=i-checks><input type=radio ng-model=op.ala value=a checked> <i></i> 活跃报警</label></div><div ng-if=" op.ala == \'b\' " class="inline col-md-8 col-sm-8 col-xs-12"><div class="col-md-5 col-sm-6 m-t-sm"><label class="w-xxs text-right control-label m-t-xs col-sm-3 no-padder">起始时间</label><div class=col-sm-9><input class="form-control input input-sm col-xs-12" datetime-picker date-format="yyyy-MM-dd HH:mm" nofocus data-readonly-input=false ng-model=op.start is-open="od.showS"> <span class=float-left style="position: absolute;top: 0px;right:0px"><button type=button class="btn btn-default btn-sm" ng-click="openCalendar($event, \'od.showS=true\')"><i class="fa fa-calendar"></i></button></span></div></div><div class="col-md-5 col-sm-6 m-t-sm"><label class="w-xxs text-right control-label m-t-xs col-sm-3 no-padder">结束时间</label><div class=col-sm-9><input class="form-control input input-sm col-xs-12" datetime-picker date-format="yyyy-MM-dd HH:mm" nofocus ng-model=op.end is-open="od.showE"> <span class=float-left style="position: absolute;top: 0px;right:0px"><button type=button class="btn btn-default btn-sm" ng-click="openCalendar($event, \'od.showE=true\')"><i class="fa fa-calendar"></i></button></span></div></div><div ng-if=false><label class="w-30 text-right" for=exampleInputPassword2>条数</label><select ng-model=op.num class="form-control w-xs inline m-t-xs" ng-options=" n for n in [50,100,200,300,400,500] " required></select></div><div class="col-md-2 col-sm-6 float-right"><span ng-if=" op.ala !=\'a\' " class="btn btn-info btn-sm w-46 m-l m-t-sm float-right pos-rlt" ng-click="loadPageData(1 , $event  )" token>查询 <i class="fa fa-spin fa-spinner hide float-right pos-abt" style="right: -20px;top:5px;color: #333"></i></span></div></div><div ng-if=" op.ala==\'a\' " class="inline p-t"><span class="btn btn-info btn-sm w-46 m-l-sm m-t-sm pos-rlt" ng-click="loadPageData(1 , $event )" token>刷新 <i class="fa fa-spin fa-spinner hide pull-right pos-abt" style="right: -20px;color: #333;top: 5px"></i></span></div></div></form></div><div class="panel-body table-responsive no-padder" load-mask ng-init=" _$A = $sys.trigger.op"><table class="table j_table table-striped b-t-none b-b-none" ng-init="_config = $sys.trigger.severity"><thead class=flip-content><tr class=background><th>报警ID</th><th>报警时间</th><th>报警描述</th><th>重要性</th><th>类别</th><th>活跃状态</th><th class=w-xs style="padding-right: 20px">操作</th></tr></thead><tbody class=text-left><tr ng-repeat="  a  in  page.data  "><td>{{ :: a.id }}</td><td>{{ :: a.timestamp | date:"yyyy-MM-dd HH:mm:ss" }}</td><td>{{ :: a.desc }}</td><td>{{ :: _config[a.severity] }}</td><td>{{ :: a.class_id }}</td><td translate="alarm_active.{{ a.active}}"></td><td style="padding-right: 20px"><a class=text-info ng-if=" a.active!=1 " ng-click="showAlarmMsg(a , system.uuid)">详细信息</a> <a ng-if=" a.active == 1 " class=text-info ng-click="conformAlarm( page, a , $index , system.uuid , op.ala )">确认报警</a></td></tr></tbody></table></div><div class=panel-footer><div class=text-center ng-include src=" \'athena/debris/_pager.html\'  "></div></div></div>'), a.put("athena/show/system_prop_basic.html", '<div class="panel-body bg-light b-a b-t-none bg-white text-base"><div class="col-md-6 m-b padder-md"><div class="m-b hbox"><div class="col w-sm">系统Id</div><div class="col text-right">{{:: system.uuid }}</div></div><div class="m-b hbox"><div class="col w-sm">所属区域</div><div class="col text-right">{{ :: system.region_name }}</div></div><div class="m-b hbox"><div class="col w-sm">创建时间</div><div class="col text-right">{{ :: system.create_time | date:"yyyy-MM-dd HH:mm"}}</div></div><div class=m-b><div class="col w-sm m-b-sm">备注</div><div class="w-full wrapper-sm b-a" style="height: 100px;color: #a0a0a0">{{ :: system.desc}}</div></div><div class="m-b col-xs-12 no-padder"><div class="col-xs-4 no-padder"><div class="panel padder-v item bg-primary text-center r-2x"><span class="text-white font-thin h1 block">{{ :: totalAlarm_act }}</span> <span class=text-xs style="color: #d3cfea">活跃报警数</span></div></div><div class="col-xs-7 no-padder pull-right"><div class="alert alert-danger r-2x"><span class="text-danger text-sm m-t-xs block" style="color: #a94442">最新报警：{{ :: lastAlarm.timestamp | date:"yyyy-MM-dd HH:mm" }}</span> <span class="text-danger text-sm block" style="color: #a94442">具体报警: {{ :: lastAlarm.desc }}</span> <span class="text-danger text-sm block" style="color: #a94442">严重性 ：{{ lastAlarm.severity }}<a ui-sref=app.s_system_prop.alarm class=pull-right><span class=text-info-dk>查看报警</span></a></span></div></div></div></div><div class="col-md-6 gap-5 pull-right no-padder" style="height: auto"><img ng-src="{{ system.pic_url?( ossRoot + system.pic_url):\'img/system_null.png\'}}" style="width:100%;height: auto;max-width: 500px"></div></div>'), 

        // shwo  system current -- old ; 
        //a.put("athena/show/system_prop_current.html", '<div class="panel panel-default b-t-none"><div class="panel-heading b-b-none no-padder bg-white-only"><form class="form-inline row m-l m-r"><div class="col-md-3 col-sm-5 col-xs-12 m-t-sm m-b-sm"><label class="col-xs-4 float-left no-padder" style="line-height: 30px"><span>搜索</span></label><div class="col-xs-8 no-padder float-right"><input class="form-control input-sm col-xs-12" ng-model=f_name ng-change=filterTags(f_name)></div></div><div class="col-md-6 col-sm-7 col-xs-12 m-t-sm m-b-sm" style="line-height: 30px;min-width: 350px"><label class="i-checks col-sm-5 text-center"><input type=checkbox ng-model=auto_r> <i></i> 自动刷新</label><span class="col-sm-7 float-right"><progressbar class="progress-striped m-b-n-xs w-sm inline" animate=false value=" progValue / 100  " type=success></progressbar></span></div><div class="col-md-3 col-sm-6 m-t-sm m-b-sm float-right no-padder"><button ng-if="systemModel.mode !=2 " class="btn btn-sm btn-info w-xs float-right m-l m-t-xs" ng-click="d_call( system  , 2 , $event )">召唤</button> <button class="btn btn-sm btn-info w-xs float-right m-l m-t-xs" ng-click=" getCurrent(  $event ) " style=opacity:1>刷新</button></div></form></div><div class="panel-body table-responsive no-padder"><table class="table table-striped j_table b-b-none"><thead class=flip-content><th class=w>变量</th><th class=w>值</th><th class=w>时间戳</th><th class=w-lg ng-if=" systemModel.mode ==1 ">下置</th><th class=w>描述</th><th>查看历史</th></thead><tbody id=current-table><tr ng-repeat="t in   filtTags " class=hover><td class=full-td>{{ :: t.name}}</td><td id=_val_{{$index}}></td><td id=_time_{{$index}}></td><td ng-if=" systemModel.mode ==1 "><input class="input input-s" ng-model=v> <button class="btn btn-info btn-xs btn-s w-48" ng-click="liveWrite( t, v , $event , this )" token=5000>下置</button> <i class="fa fa-spin text-info fa-spinner" ng-if=showSpinner></i> <span id=current_msg_{{t}} class=w>{{ msg }}</span></td><td>{{:: t.desc}}</td><td><button class="btn btn-info btn-xs btn-s w-60" ng-click=goHis(t)>查看历史</button></td></tr></tbody></table></div></div>'),
        
        // show system  current  -- new ; 
        a.put("athena/show/system_prop_current.html", '<div class="panel panel-default b-t-none"><div class="panel-heading b-b-none bg-white-only"><form class=form-inline role=form><div class="form-group m-l"><div class=input-group><input class=form-control ng-model=f_name ng-change=filterTags(f_name)> <span class=input-group-btn><button class="btn btn-default" type=button>搜索</button></span></div></div><div class="form-group m-l m-r-xs m-r-l"><label class=i-checks><input type=checkbox ng-model=decimal><i></i> <span class=text style="margin-left: 0px">保留</span></label><input class=form-control style="min-width: 60px" placeholder=0-10 type=number ng-disabled=!decimal ng-model=fractionSize max=10 min=0><label class=text>位小数</label></div><div class="checkbox m-l m-r-xs"><label class=i-checks><input type=checkbox ng-model=auto_r><i></i> <span class=text style="margin-left: 0px">自动刷新</span></label><progressbar class="progress-striped m-b-n-xs w-sm inline" animate=false value=" progValue / 100  " type=success></progressbar></div><button ng-if="systemModel.mode !=2 " class="btn btn-sm btn-info w-xs float-right m-l" ng-click="d_call( system  , 2 , $event )">召唤</button> <button class="btn btn-sm btn-info w-xs float-right m-l" ng-click=" getCurrent(  $event ) " style=opacity:1>刷新</button></form></div><div class="panel-body table-responsive no-padder"><table class="table table-striped j_table b-b-none"><thead class=flip-content><th class=w>变量</th><th class=w>值</th><th class=w>时间戳</th><th class=w-lg>下置</th><th class=w>描述</th><th>查看历史</th></thead><tbody id=current-table><tr ng-repeat="t in   filtTags " class=hover><td class=full-td>{{ :: t.name}}</td><td id=_val_{{$index}}></td><td id=_time_{{$index}}></td><td><input class="input input-s" ng-model=v> <button class="btn btn-info btn-xs btn-s w-48" ng-click="liveWrite( t, v , $event , this )" token=5000>下置</button> <i class="fa fa-spin text-info fa-spinner" ng-if=showSpinner></i> <span id=current_msg_{{t}} class=w>{{ msg }}</span></td><td>{{:: t.desc}}</td><td><button class="btn btn-info btn-xs btn-s w-60" ng-click=goHis(t)>查看历史</button></td></tr></tbody></table></div></div>'),




        a.put("athena/show/system_prop_history.html", '<div class="panel panel-default b-t-none"><div class="panel-heading bg-white-only no-padder"><form class="form-validation ng-pristine ng-valid" name=form><div class="row padder"><div class="form-group col-md-6 col-sm-6 col-xs-12 m-t-sm m-b-none"><div class=w><select ng-model=op.his_tag class="height-30 inline col-xs-12 form-control input-sm" ng-options=" t as t.name  for t in tags  " required><option value="">-请选择变量-</option></select></div></div><div class="form-group col-md-6 col-sm-6 col-xs-12 m-t-sm m-b-none"><button class="btn btn-sm btn-default pull-right" ng-click=queryData(6,$event) data-name=6>1年</button> <button class="btn btn-sm btn-default pull-right" ng-click=queryData(5,$event) data-name=5>6月</button> <button class="btn btn-sm btn-default pull-right" ng-click=queryData(4,$event) data-name=4>3月</button> <button class="btn btn-sm btn-default pull-right" ng-click=queryData(3,$event) data-name=3>1月</button> <button class="btn btn-sm btn-default pull-right" ng-click=queryData(2,$event) data-name=2>7天</button> <button class="btn btn-sm btn-default pull-right" ng-click=queryData(1,$event) data-name=1>1天</button></div><div class="form-group col-md-12 col-sm-12 col-xs-12 m-t-sm no-padder m-b-none"><div class="padder wrapper progress-bar-info r-2x" style="height: 48px"><span class="pull-left text-white glyphicon glyphicon-chevron-left" style="cursor: pointer" ng-click=leftTime()></span><div class="col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3 col-xs-8 col-xs-offset-2 m-t-n-xs"><div class="w item bg-white" style="margin: 0 auto"><p class="padder b-a m-b-none" style="height: 30px;line-height: 30px">{{dateStr}}</p><input style=display:none class="input input-sm form-control float-left col-xs-12" datetime-picker date-format="yyyy-MM-dd HH:mm" nofocus data-readonly-input=false ng-model=op.end is-open="od.showS"> <span class=float-left style="position: absolute;top: 0px;right: 0px"><button type=button class="btn btn-default btn-sm" ng-click="openCalendar($event, \'od.showS=true\');changeTemp=true"><i class="fa fa-calendar"></i></button></span></div></div><span class="pull-right text-white glyphicon glyphicon-chevron-right" style="cursor: pointer" ng-click=rightTime()></span></div></div></div></form></div><div class=panel-body><div class="col-lg-12 col-md-12" id=show_live_data ng-init=initFlotChart() style="height: 540px; padding: 0px; position: relative" load-mask></div></div></div>'), a.put("athena/show/system_prop_map.html", '<div class="panel-body well m-b-none no-border" id=station_map ng-init=initMap()></div>'), a.put("athena/show/system_prop_panel.html", '<iframe class="b b-t-none m-b-none" ng-src={{currentProjectUrl}} style="width: 100%;height: 700px"></iframe>'), a.put("athena/support/tech.html", '<div class="panel b-a gap-5"><div class="panel-heading b-b b-light"><div class="input-group col-md-6 col-lg-4"><span class=input-group-btn><span class="btn btn-default height-30 disabled" translate=common.search></span></span> <input class="form-control input-sm" ng-model=f_projname></div></div><ul class="list-group list-group-lg no-bg auto"><li class="list-group-item clearfix"><span class="pull-left thumb-sm m-r"><img src=../../img/a4.jpg alt=...> <i class="on b-white bottom"></i></span> <span class=clear><a href="">发噶尔啊发噶尔啊发噶尔啊发噶尔啊发噶尔啊发噶尔啊发放</a><div class="pull-right text-muted text-sm">一个月前</div><small class="text-muted clear text-ellipsis">方法为噶尔啊</small> <small class="text-muted clear text-ellipsis">方法为噶尔啊</small></span></li><li class="list-group-item clearfix"><span class="pull-left thumb-sm m-r"><img src=../../img/a5.jpg alt=...> <i class="on b-white bottom"></i></span> <span class=clear><span><i class="glyphicon glyphicon-bell text-info"></i> <a ui-sref=app.tech_detail class=h5></a><div class="pull-right text-muted text-sm">11:30 <span class="badge bg-warning pull-right m-l-xs">10</span></div><small class="text-muted clear">user_1 user_1 user_1</small> <small class="text-muted clear">Come online and we need talk about the plans that we have discussed Come online and we need talk about the plans that we have discussed Come online and we need talk about the plans that we have discussed Come online and we need talk about the plans that</small></span></span></li></ul><div class="clearfix panel-footer"><ng-include src=" \'athena/debris/_pager.html\'  "></ng-include><button class="btn btn-success btn-sm w-70 m-l" ng-if=" !isShowModul" ng-click="  goto( \'app.proj.addproj\' ) ">添加区域</button></div></div>'), a.put("athena/support/techdetail.html", '<div class="panel panel-default gap-5" style="width:60%; margin: 5px auto"><div class=panel-body><div class=m-b><a href="" class="pull-left thumb-sm"><img src=../../img/a2.jpg alt=...></a><div class=m-l-xxl><div class="pos-rlt wrapper b b-light r r-2x"><span class="arrow left pull-up"></span><p class=m-b-none>Hi John, What\'s up..i John, What\'s up..i John, What\'s up..i John, What\'s up.. i John, What\'s up..i John, What\'s up..i John, What\'s up..v i John, What\'s up..i John, What\'s up..i John, What\'s up.. i John, What\'s up..i John, What\'s up..i John, What\'s up..i John, What\'s up..i John, What\'s up.. i John, What\'s up..i John, What\'s up..i John, What\'s up..i John, What\'s up.. i John, What\'s up..i John, What\'s up..i John, What\'s up.. i John, What\'s up..i John, What\'s up..i John, What\'s up.. i John, What\'s up..i John, What\'s up.. .</p></div><small class=text-muted><i class="fa fa-ok text-success"></i> 2 minutes ago</small></div></div><div class=m-b><a href="" class="pull-left thumb-sm"><img src=../../img/a2.jpg alt=...></a><div class=m-l-xxl><div class="pos-rlt wrapper b b-light r r-2x"><span class="arrow left pull-up"></span><p html=data></p></div><small class=text-muted><i class="fa fa-ok text-success"></i> 2 minutes ago</small></div></div><div class=m-b><a href="" class="pull-right thumb-sm"><img src=../../img/a3.jpg class=img-circle alt=...></a><div class=m-r-xxl><div class="pos-rlt wrapper bg-primary r r-2x"><span class="arrow right pull-up arrow-primary"></span><p class=m-b-none>Lorem ipsum dolor sit amet, conse<br>adipiscing eli...<br>:)</p></div><small class=text-muted>1 minutes ago</small></div></div><div class=gap-5 ng-if=false><div ng-if=false class="btn-toolbar m-b-sm btn-editor" data-role=editor-toolbar data-target=#editor><div class="btn-group dropdown"><a class="btn btn-sm btn-default dropdown-toggle ng-scope" data-toggle=dropdown tooltip=Font aria-haspopup=true aria-expanded=false><i class="fa text-base fa-font"></i><b class=caret></b></a><ul class=dropdown-menu><li><a href="" dropdown-toggle="" data-edit="fontName Serif" style="font-family:\'Serif\'" aria-haspopup=true aria-expanded=false>Serif</a></li><li><a href="" dropdown-toggle="" data-edit="fontName Sans" style="font-family:\'Sans\'" aria-haspopup=true aria-expanded=false>Sans</a></li><li><a href="" dropdown-toggle="" data-edit="fontName Arial" style="font-family:\'Arial\'" aria-haspopup=true aria-expanded=false>Arial</a></li></ul></div><div class="btn-group dropdown"><a class="btn btn-sm btn-default dropdown-toggle ng-scope" data-toggle=dropdown tooltip="Font Size" aria-haspopup=true aria-expanded=false><i class="fa text-base fa-text-height"></i>&nbsp;<b class=caret></b></a><ul class=dropdown-menu><li><a href="" dropdown-toggle="" data-edit="fontSize 5" style=font-size:24px aria-haspopup=true aria-expanded=false>Huge</a></li><li><a href="" dropdown-toggle="" data-edit="fontSize 3" style=font-size:18px aria-haspopup=true aria-expanded=false>Normal</a></li><li><a href="" dropdown-toggle="" data-edit="fontSize 1" style=font-size:14px aria-haspopup=true aria-expanded=false>Small</a></li></ul></div><div class=btn-group><a class="btn btn-sm btn-default ng-scope" data-edit=bold tooltip="Bold (Ctrl/Cmd+B)"><i class="fa text-base fa-bold"></i></a> <a class="btn btn-sm btn-default ng-scope" data-edit=italic tooltip="Italic (Ctrl/Cmd+I)"><i class="fa text-base fa-italic"></i></a> <a class="btn btn-sm btn-default ng-scope" data-edit=strikethrough tooltip=Strikethrough><i class="fa text-base fa-strikethrough"></i></a> <a class="btn btn-sm btn-default ng-scope" data-edit=underline tooltip="Underline (Ctrl/Cmd+U)"><i class="fa text-base fa-underline"></i></a></div><div class=btn-group><a class="btn btn-sm btn-default ng-scope" data-edit=insertunorderedlist tooltip="Bullet list"><i class="fa text-base fa-list-ul"></i></a> <a class="btn btn-sm btn-default ng-scope" data-edit=insertorderedlist tooltip="Number list"><i class="fa text-base fa-list-ol"></i></a> <a class="btn btn-sm btn-default ng-scope" data-edit=outdent tooltip="Reduce indent (Shift+Tab)"><i class="fa text-base fa-dedent"></i></a> <a class="btn btn-sm btn-default ng-scope" data-edit=indent tooltip="Indent (Tab)"><i class="fa text-base fa-indent"></i></a></div><div class=btn-group><a class="btn btn-sm btn-default ng-scope btn-info" data-edit=justifyleft tooltip="Align Left (Ctrl/Cmd+L)"><i class="fa text-base fa-align-left"></i></a> <a class="btn btn-sm btn-default ng-scope" data-edit=justifycenter tooltip="Center (Ctrl/Cmd+E)"><i class="fa text-base fa-align-center"></i></a> <a class="btn btn-sm btn-default ng-scope" data-edit=justifyright tooltip="Align Right (Ctrl/Cmd+R)"><i class="fa text-base fa-align-right"></i></a> <a class="btn btn-sm btn-default ng-scope" data-edit=justifyfull tooltip="Justify (Ctrl/Cmd+J)"><i class="fa text-base fa-align-justify"></i></a></div></div></div></div><footer class=panel-footer><div><a class="pull-left thumb-xs"><img src=../../img/a3.jpg class=img-circle alt=...></a><div class=m-l-xl><div ui-jq=wysiwyg class="form-control h-auto" style=min-height:150px contenteditable=true></div><span class=input-group-btn><button class="btn btn-default m-t-xs" type=button>SEND</button></span></div></div></footer></div>'),
        a.put("athena/sysmodel/_log_part.html", ' <input tl-wrap ng-if=" !isAdd " disabled ng-model=L.name label=text.name><select tl-wrap ng-init="L.log_type = L.save_log? L.log_type : undefined " ng-options="  k as v for (k,v) in $sys.log_type.values" ng-model=L.log_type label=保存日志 ng-change=" L.save_log =  L.log_type ? 1: 0 "><option value="">--不保存日志--</option></select><div ng-if=" L.save_log && L.log_type==\'RAW\'"><select ng-options="  o.v as o.k  for o in  $sys.log_period.values" tl-wrap ng-model=L.log_cycle label=日志记录间隔></select></div><div ng-if=" T.type ==\'Analog\' "><input ng-model=L.deviation label="偏差 " type=number tl-wrap required> <input ng-model=L.scale label=text.scale type=number tl-wrap required></div><input tl-wrap ng-model=L.unit label=text.unit>'), a.put("athena/sysmodel/add_gateway.html", '<div class=modal-header><span ng-if=isAdd>添加串口配置</span> <span ng-if=!isAdd>编辑串口配置</span></div><div class=modal-body><form name=form class="form-validation form-horizontal" ng-init=" _config = $sys.gateway ;\r\n               filterType()\r\n            "><select tl-wrap ng-if=isAdd ng-model=G.t ng-options=" t as t group by T for (t,T) in _$types   " label=串口 required></select><select tl-wrap ng-model=" D.baud_rate " ng-options="  k for k in _config.baud_rate" label=波特率 required></select><select tl-wrap ng-model=" D.data_bits " ng-options="  k for k  in _config.data_bits" label=数据位 required></select><select tl-wrap ng-model=" D.stop_bits " ng-options="  k for k  in _config.stop_bits" label=停止位 required></select><select tl-wrap ng-model=" D.parity " ng-options="  k  as v  for (k,v)  in _config.parity" label=校验 required></select><input type=number tl-wrap ng-model=D.delay label=延迟(毫秒)></form></div><ng-include src=" \'athena/debris/_modal_footer.html\' "></ng-include>'), a.put("athena/sysmodel/add_log_tag.html", '<div class=modal-header><span ng-if=isAdd>添加系统模型点</span> <span ng-if=!isAdd>编辑系统模型点</span></div><div class=modal-body><form name=form_log class="form-validation form-horizontal"><ng-include src="  \'athena/sysmodel/_log_part.html\'  "></ng-include></form></div><ng-include src=" \'athena/debris/_modal_footer.html\' "></ng-include>'), a.put("athena/sysmodel/add_message.html", '<div class=modal-header><span ng-if=isAdd>添加通知</span> <span ng-if=!isAdd>编辑通知</span></div><div class=modal-body><form name=form class="form-validation form-horizontal" ng-init="_config = $sys.message "><input tl-wrap ng-model=M.name label=text.name required><select tl-wrap ng-model=M.trigger_id ng-options=" t.id as t.name for t in   triggers" label=触发器 required><option value="">选择触发器</option></select><div class="form-group ng-scope"><label class="col-sm-3 col-sm-offset-1 control-label"><span>接收用户</span></label><div class=col-sm-7><div class="radio inline"><label class=i-checks><input type=radio ng-model="M.user_category " value=1><i></i> <span>平台用户</span></label></div><div class="radio inline m-l"><label class=i-checks><input type=radio ng-model=" M.user_category " value=0><i></i> <span>联系人用户</span></label></div></div></div><textarea tl-wrap ng-model=M.message_params label=消息体> </textarea></form></div><ng-include src=" \'athena/debris/_modal_footer.html\' "></ng-include>'), a.put("athena/sysmodel/add_proftrigger.html", '<div class=modal-header><span ng-if=isAdd>新建触发器</span> <span ng-if=!isAdd>编辑触发器</span></div><div class=modal-body ng-init="stepx={ step:0}"><progressbar value=(stepx.step+1)*34 class="progress-xs m-b m-t-n-xs" type=success></progressbar><form name=step0 ng-show="stepx.step == 0" class="form-validation form-horizontal" ng-init="_config = $sys.trigger "><input tl-wrap ng-model=T.name label=text.name required><select tl-wrap ng-options=" k as v for (k,v) in _config.type " ng-model=T.type tl-default=_config.type_default label=触发类型></select><select tl-wrap ng-if="   sysmodel.mode == 1" ng-options="  k as v  for (k,v) in _config.origin" ng-model=T.origin label=触发源 tl-default=_config.origin_default></select><select tl-wrap ng-if="   sysmodel.mode == 2" ng-options="  k as v  for (k,v) in  { 0 :_config.origin[\'0\'] } " ng-model=T.origin label=触发源 tl-default=0></select><textarea tl-wrap ng-model=T.desc label=text.desc></textarea></form><form name=step1 ng-show="stepx.step == 1" ng-init="_config = $sys.trigger " class=form-validation><table class=table><thead><tr><th width=10%>条件1</th><th width=10%>变量</th><th width=20%>参数</th><th width=10%>运算符</th><th width=10%>变量</th><th width=20%>参数</th><th width=10%></th></tr></thead><tbody class=text-left><tr ng-repeat=" c in  T.conditions " ng-init="  l = c.exp.left ;\r\n                                                                r = c.exp.right ;\r\n                                                                exp = c.exp ;\r\n                                                                "><td><select ng-options="  l for l in _config.verb " class=form-control ng-model=c.verb ng-if="$index != 0 "></select></td><td><input class=form-control ng-model=" l.fn " readonly></td><td><select ng-if=" l.fn  == \'PV\' " ng-model=" l.args " class=form-control ui-validate="  \'$value != r.args\'   " ui-validate-watch=" \'r.args\' " ui-jq=chosen source-arr=tags_arr k=name v=name required><option value>请选择变量</option></select><input ng-if=" l.fn  == null || l.fn == \'null\' " ng-model=l.args class=form-control type="{{ tags_nv[r.args].type }}" placeholder="{{ typer }}" ui-validate="  \' $value != r.args\' " ui-validate-watch=" \'r.args\' " required></td><td><select ng-options=" o for o in _config.op" tl-default=_config.op_default ng-model=exp.op class=form-control></select></td><td><select ng-options=" v as k for (k,v) in _config.fn" ng-model=r.fn ng-change=" r.args = null ;" class=form-control><option value>数值</option></select></td><td ng-if="  r.fn == \'PV\' "><select ng-model=r.args class=form-control ui-validate="  \'$value != l.args\' " ui-validate-watch=" \'l.args\'  " ui-jq=chosen source-arr=tags_arr v=name k=name required><option value>请选择变量</option></select></td><td ng-if=" r.fn == null || r.fn == \'null\' "><input ng-model=" r.args" class=form-control placeholder="{{ typel }}" type="{{ tags_nv[l.args].type }}" ui-validate="  \'$value!= l.args\' " ui-validate-watch=" \'l.args\' " required></td><td><a class="fa fa-minus-circle pull-right text-danger m-t-xs" ng-show=" $index != 0 " ng-click="delVerb( $index )"></a></td></tr><tr class=b-t><td colspan=7 class=text-left><span class="btn btn-primary btn-sm w-46 dropdown-toggle" ng-click=appendVerb()>添加</span></td></tr></tbody></table></form><form name=step2 ng-show="stepx.step == 2" ng-init="_config = $sys.trigger " class="form-validation form-horizontal"><select tl-wrap ng-options=" k as v for (k,v) in _config.action " ng-model=T.action tl-default=_config.action_default label=行为></select><div ng-if="T.action == _config.action_alarm "><select tl-wrap ng-options=" k as v for (k,v) in _config.severity " ng-model=T.params.severity tl-default=_config.severity_default label=严重性></select><select tl-wrap ng-options=" k as v for (k,v) in $sys.trigger.class_id " ng-model=T.params.class_id tl-default=_config.class_id_default label=类别></select><textarea tl-wrap ng-model=T.params.desc ng-max=50 ng-maxlength=50 label=报警描述 required></textarea></div><div ng-if="T.action == _config.action_event">Event Event Event Event Input .....</div><div ng-if="T.action == _config.action_task">Task Task Task Task Task Input .....</div></form></div><div class="modal-footer text-center"><div ng-show="stepx.step == 0"><button type=submit class="btn btn-default btn-sm btn-primary w-60" ng-click="validForm(\'step0\') ;stepx.step = 1 ; ">下一步</button> <button type=submit class="btn btn-default btn-sm btn-primary w-60" ng-click=cancel()>取消</button></div><div ng-show="stepx.step == 1"><button class="btn btn-primary btn-sm w-60" ng-click="stepx.step = 0 ;   ">上一步</button> <button class="btn btn-primary btn-sm w-60" ng-disabled=form.$invalid ng-click=" validForm(\'step1\') ; stepx.step = 2   ; ">下一步</button> <button class="btn btn-default btn-sm btn-primary w-60" ng-click=cancel()>取消</button></div><div ng-show="stepx.step == 2"><button class="btn btn-primary btn-sm w-60" ng-click="stepx.step = 1 ;   ">上一步</button> <button ng-disabled=step1.$invalid class="btn btn-primary btn-sm w-60" ng-click=" validForm(\'step2\');done();" ng-show=isAdd>创建</button> <button ng-disabled=step1.$invalid ng-show=!isAdd class="btn btn-primary btn-sm w-60" ng-click=" validForm(\'step2\');done();">更新</button> <button class="btn btn-default btn-sm btn-primary w-60" ng-click=cancel()>取消</button></div></div>'), a.put("athena/sysmodel/add_sysdevice.html", '<div class=modal-header><span ng-if=isAdd>添加系统设备</span> <span ng-if=!isAdd>编辑系统设备</span></div><div class=modal-body ng-init="stepx={  step: 0 } ;  "><progressbar value="(stepx.step +1 )* ( isG?34:50) " class="progress-xs m-t-n-xs m-b" type=success></progressbar><div ng-show="stepx.step == 0"><form name=step0 class="form-validation form-horizontal"><input tl-wrap required ng-model=D.name label=设备名称> <input tl-wrap ng-model=D.dev_cycle type=number label=采样周期 min=1 max=59 required><select tl-wrap ng-model=D.cycle_unit label=采样周期单位 ng-options="o.v as o.k for o in $sys.device.timeUnit "></select><input tl-wrap ng-model=D.slow_cycle type=number label=慢速周期 min=1 max=59 required><select tl-wrap ng-model=D.slow_cycle_unit label=慢速周期单位 ng-options="o.v as o.k for o in $sys.device.timeUnit "></select><input tl-wrap ng-model=D.dev_timeout type=number label=连接超时时间(秒) max=60 min=8 required> <input tl-wrap ng-model=D.dev_retry type=number label=连接重试次数 min=0 max=3 required> <input tl-wrap ng-model=D.delay type=number label=命令延时(毫秒) min=0 max=1000 required><textarea tl-wrap ng-model=D.desc label=备注> </textarea></form></div><form name=step1 ng-show="stepx.step == 1" class="form-validation form-horizontal"><select tl-wrap ng-model=D.device_model ng-options="  k  as v.name for (k,v) in devModelKV" ng-change=changeModel() ng-disabled=" !isAdd" label=设备模型></select><ng-include src=" \'athena/_device/\'+ devModel.driver_id +\'.html\' "></ng-include></form><form name=step2 ng-show=" isG && stepx.step == 2 " class="form-validation form-horizontal"><ng-include src=" \'athena/_device/dev_network.html\' "></ng-include></form></div><div class="modal-footer text-center"><div ng-show="stepx.step == 0"><button class="btn btn-default btn-sm btn-primary w-60" ng-click="validForm(\'step0\') ;stepx.step = 1 ; ">下一步</button> <button class="btn btn-default btn-sm btn-primary w-60" ng-click=cancel()>取消</button></div><div ng-show="stepx.step == 1 && isG "><button class="btn btn-primary btn-sm w-60" ng-click="stepx.step = 0 ;   ">上一步</button> <button class="btn btn-primary btn-sm w-60" ng-click=" validForm(\'step1\') ; stepx.step = 2   ; ">下一步</button> <button class="btn btn-default btn-sm btn-primary w-60" ng-click=cancel()>取消</button></div><div ng-show="stepx.step == 2 && isG "><button class="btn btn-primary btn-sm w-60" ng-click="stepx.step = 1 ;   ">上一步</button> <button class="btn btn-primary btn-sm w-60" ng-click=" validForm(\'step2\');done();" ng-show=isAdd>创建</button> <button ng-show=!isAdd class="btn btn-primary btn-sm w-60" ng-click=" validForm(\'step2\');done();">更新</button> <button class="btn btn-default btn-sm btn-primary w-60" ng-click=cancel()>取消</button></div><div ng-show="stepx.step == 1 && !isG "><button class="btn btn-primary btn-sm w-60" ng-click="stepx.step = 0 ;   ">上一步</button> <button class="btn btn-primary btn-sm w-60" ng-click=" validForm(\'step1\');done();" ng-show=isAdd>创建</button> <button ng-show=!isAdd class="btn btn-primary btn-sm w-60" ng-click=" validForm(\'step1\');done();">更新</button> <button class="btn btn-default btn-sm btn-primary w-60" ng-click=cancel()>取消</button></div></div>'), a.put("athena/sysmodel/add_sysmodel.html", '<div class=modal-header><span ng-if=isAdd>新建系统模型</span> <span ng-if=!isAdd>编辑系统模型</span></div><div class=modal-body><form name=form class="form-validation form-horizontal"><input tl-wrap ng-model=sm.name label=系统模型名称 required><select tl-wrap ng-model=sm.mode ng-if=isAdd ng-options=" k as v  for (k,v) in $sys.sysModelMode.values" ng-change=" sm.comm_type=sm.mode==\'1\'?\'1\':undefined " label=text.mode required></select><div class=form-group ng-if=" sm.mode == 1"><label class="col-sm-3 col-sm-offset-1 control-label"><span>通讯类型</span></label><div class=col-sm-7><div class="radio inline m-l"><label class=i-checks><input type=radio value=1 ng-model=sm.comm_type> <i></i> DAServer</label></div></div></div><textarea tl-wrap ng-model=sm.desc label=备注> </textarea></form></div><ng-include src=" \'athena/debris/_modal_footer.html\' "></ng-include>'), a.put("athena/sysmodel/add_syspanel.html", '<div class=modal-header>添加系统信息板</div><div class=modal-body><form name=form class="form-validation form-horizontal"><input type=submit class=hidden> <input tl-wrap required ng-model=project.name name=input label=名称><textarea tl-wrap ng-model=project.description label=备注>  </textarea></form></div><ng-include src=" \'athena/debris/_modal_footer.html\' "></ng-include>'), a.put("athena/sysmodel/add_sysprofile.html", '<div class=modal-header><span ng-if=isAdd>添加系统配置</span> <span ng-if=!isAdd>编辑系统配置</span></div><div class=modal-body><form name=form class="form-validation form-horizontal"><input type=submit class=hidden> <input tl-wrap required ng-model=P.name name=input label=系统配置名称><textarea tl-wrap ng-model=P.desc label=备注>  </textarea></form></div><ng-include src=" \'athena/debris/_modal_footer.html\' "></ng-include>'), a.put("athena/sysmodel/add_systag.html", '<div class=modal-header><span ng-if=isAdd>添加变量</span> <span ng-if=!isAdd>编辑变量</span></div><div class=modal-body load-mask><form name=form_tag class="form-validation form-horizontal"><div ng-if="isManageMode "><select ng-options=" o as o.name  for  o in sysdevices   " tl-wrap ng-model=" op.dev " label=设备 ng-change=" loadPoint( op.dev , true ) " required><option value="">--请选择设备--</option></select><select ui-jq=chosen tl-wrap label="connect 点" ng-model=op.point ui-refresh=points ng-change=" copyName() " id=7fa574fa44awe k=name v=id&name required><option value="">--请选择点--</option></select></div><input tl-wrap ng-model=T.name ng-disabled=" !isAdd" label=text.name required><select tl-wrap ng-model=T.type ng-options="  k  for k in $sys.tag.type" label=text.type required ng-disabled=!isAdd><option value="">--选择点类型--</option></select><textarea tl-wrap ng-model=T.desc label=备注> </textarea></form><form name=form_log class="form-validation form-horizontal"><ng-include ng-if=" L && hasProfile" src="  \'athena/sysmodel/_log_part.html\'  "></ng-include></form></div><ng-include src=" \'athena/debris/_modal_footer.html\' "></ng-include>'), a.put("athena/sysmodel/device_point_ganged.html", ""), a.put("athena/sysmodel/sys_basic.html", '<div class="panel panel-default b-t-none"><div class="panel-body bg-light bg-white text-base"><div class="col-md-6 no-padder"><div class=list-group><span class="list-group-item no-border">ID <span class=pull-right>{{ :: sysmodel.uuid }}</span></span> <span class="list-group-item no-border">模式 <span class=pull-right>{{ :: $sys.sysModelMode.values[sysmodel.mode] }}</span></span> <span class="list-group-item no-border">通信类型 <span class=pull-right>{{ :: sysmodel.comm_type == 1 ? "DAServer":"Gateway" }}</span></span> <span class="list-group-item no-border">变量数量 <span class=pull-right>{{ :: sysmodel.tag_count }}</span></span> <span class="list-group-item no-border">配置项数量 <span class=pull-right>{{ profiles.length }}</span></span> <span class="list-group-item no-border">创建时间 <span class=pull-right>{{ :: sysmodel.create_time | date:"yyyy-MM-dd HH:mm Z" }}</span></span> <span class="list-group-item no-border">最后更新时间 <span class=pull-right>{{ :: sysmodel.create_time | date:"yyyy-MM-dd HH:mm Z" }}</span></span> <span class="list-group-item no-border">备注<div class="b-a alert m-t-sm" style="color: #a0a0a0;height:100px">{{ :: sysmodel.desc }}</div></span></div></div></div></div>'), a.put("athena/sysmodel/sys_device.html", '<div class="panel panel-default b-t-none"><div class="panel-body table-responsive no-padder b-t-none b-b-none" load-mask><table class="table table-hover table-striped j_table b-t-none"><thead class=flip-content><tr class=background><th width=15%>名称</th><th width=15%>系统模型</th><th width=15%>设备模型</th><th width=20%>配置参数</th><th width=20%>网络参数</th><th width=20%>备注</th><th width=1%>编辑</th><th width=1%>删除</th></tr></thead><tbody><tr ng-repeat="  sysd  in sysdevices  "><td>{{sysd.name}}</td><td>{{sysmodel.name}}</td><td>{{ devModelKV[ sysd.device_model ] . name }}</td><td><i class="fa fa-android text-info-dker" popover-trigger=mouseenter popover=" {{ jsonString2Text ( sysd.params ) }}" popover-placement=top></i></td><td><i class="fa fa-android text-info-dker" popover-trigger=mouseenter popover=" {{ jsonString2Text ( sysd.networ ) }}" popover-placement=top></i></td><td>{{sysd.desc}}</td><td><a class=text-info ng-click="addOrEditDevice( sysdevices , $index , sysd )" translate=bu.bu3></a></td><td><a class=text-info ng-click="deleteSysD( this , $index , sysd )" translate=bu.bu4></a></td></tr></tbody></table></div><div class=panel-footer><button class="btn btn-primary btn-sm w-70 m-l-xs" ng-click=" addOrEditDevice() " token>添加设备</button></div></div>'), a.put("athena/sysmodel/sys_gateway.html", '<div class="panel panel-default b-t-none"><div class="panel-body table-responsive no-padder"><table class="table table-hover table-striped"><thead class=flip-content><tr><th width=15%>串口</th><th width=15%>波特率</th><th width=15%>data_bits</th><th width=15%>stop_bits</th><th width=15%>parity</th><th width=15%>delay</th><th width=10%>操作</th></tr></thead><tbody class=text-center ng-repeat=" ($T,$W) in GateWay " class=b-b-none ng-if=" $T !=\'GPS\' "><tr ng-repeat="($t,$data) in $W" class=hover><td>{{ $t }}</td><td>{{$data.baud_rate}}</td><td>{{$data.data_bits}}</td><td>{{$data.stop_bits}}</td><td>{{$data.parity}}</td><td>{{$data.delay}}</td><td><a class="text-info m-r-xs" ng-click="c_u_Gateway(  $T , $t , $data  )">编辑</a> <a class="text-info m-r-xs" translate=bu.bu4 ng-click="deleteGateway( $T, $t, $data   )">移除</a></td></tr></tbody><tbody><tr><td colspan=7 class=text-left ng-if=!canAddPort><button class="btn btn-primary btn-sm w-70 m-l m-t-sm m-b-sm" ng-click=" c_u_Gateway( ) ">添加串口</button></td></tr><tr><td class="text-left in-line" colspan=3><div class="checkbox m-l m-t-sm m-b-sm"><label class=i-checks><input type=checkbox ng-init="enbaleGPS=false" ng-model=enbaleGPS ng-change=gpsChange()> <i></i> GPS</label></div></td><td ng-if="enbaleGPS " colspan=2><span>Distance</span><select ng-model=GateWay.GPS.distance class="form-control input-sm w inline m-t-sm m-b-sm" ng-options="  k for k  in $sys.gateway.gps_distance" ng-change=" cc() " label=Distance></select></td><td ng-if="enbaleGPS " colspan=2><span>波特率</span><select ng-model=GateWay.GPS.baud_rate class="form-control input-sm w inline m-t-sm m-b-sm" ng-change=" cc() " ng-options="  k for k  in $sys.gateway.gps_baud_rate"></select></td></tr></tbody></table></div><div ng-show=enbaleGPS class="panel-footer b-t-none b-b b-l b-r"><div ng-show=needUpdate class="m-t-sm m-b-sm"><button class="btn btn-success btn-sm w-94 m-l" token ng-click=" saveGateWay( ) ">保存网关设置</button> <strong class="text-danger m-l"><i class="fa fa-exclamation-triangle"></i><span>网关配置需要保存!!</span></strong></div><div ng-show=" haveSave  &&  !needUpdate " class="m-t-sm m-b-sm" style="height: 30px"><strong class="text-info m-lg"><i class="fa fa-thumbs-o-up"></i> <span>保存成功!</span></strong></div></div></div>'), a.put("athena/sysmodel/sys_message_center.html", '<div class="panel-heading w-full" ng-if=isModelState><div class="form-group m-t-sm m-b-sm m-l-xs"><span style="margin-right: 30px">配置项</span><select ng-model=odp.puuid class="input input-sm w form-control inline" ng-options="   p.uuid as p.name for p in profiles  " ng-change="loadMessages( odp.puuid  )"></select></div></div><div class="panel-body table-responsive no-padder" ng-class="{\'b-t-none\': !isModelState}"><table class="table table-striped j_table b-t-none"><thead class=flip-content><tr class=background><th>Message名称</th><th>触发器 Id</th><th>发送方式</th><th>发送对象</th><th width=30%>消息体</th><th ng-if=isModelState>操作</th></tr></thead><tbody class=text-center><tr ng-repeat="  m  in messages  "><td>{{m.name}}</td><td>{{m.trigger_id}}</td><td>{{m.user_category}}</td><td>{{m.user_id }}</td><td>{{m.message_params}}</td><td ng-if=isModelState><a class="text-info m-r-xs" ng-click="createMessage(  $index  , m   )">编辑</a> <a class="text-info m-r-xs" translate=bu.bu4 ng-click="deleteMessage(  $index  , m   )">移除</a></td></tr></tbody></table></div><div class="panel-footer b-t-none" ng-if=isModelState><button class="btn btn-primary btn-sm w-70 m-t-sm m-b-sm m-l-xs" ng-click=" createMessage( ) ">添加通知</button></div>'), a.put("athena/sysmodel/sys_panel.html", '<div class="panel panel-default b-t-none"><div class="panel-body bg-light bg-white text-base"><div class="col-md-6 m-b padder-md"><div class="m-b hbox"><div class="col w-sm">信息板</div><div class="col text-right">{{ project.name}}</div></div><div class="m-b hbox"><div class="col w-sm">创建时间</div><div class="col text-right">{{ project.createTime | date:\'yyyy-MM-dd HH:mm:ss\'}}</div></div><div class="m-b hbox"><div class="col w-sm">上次修改时间</div><div class="col text-right">{{ project.modifyTime | date:\'yyyy-MM-dd HH:mm:ss\'}}</div></div><div class=m-b><div class="col w-sm m-b-sm">备注</div><div class="b-a m-t-sm alert ng-binding" style="color: #a0a0a0;height:100px">{{project.description}}</div></div><div class="col-xs-12 no-padder"><button class="btn btn-primary btn-sm m-b-sm pull-left" style=margin-right:20px ng-disabled=project.name ng-click=createProject()>创建信息板</button> <button class="btn btn-primary btn-sm m-b-sm pull-left" style=margin-right:20px ng-disabled=!project.name ng-click=openDyaliasSystem()>配置</button> <button class="btn btn-primary btn-sm m-b-sm pull-left" style=margin-right:20px ng-disabled=!project.name ng-click=deleteProject()>移除</button> <button class="btn btn-primary btn-sm m-b-sm pull-left" style=margin-right:20px ng-disabled=!project.name ng-click=modifyProjectMessage()>修改信息</button></div></div></div></div>'), a.put("athena/sysmodel/sys_profile.html", '<div class="panel panel-default b-t-none"><div class="panel-body table-responsive no-padder"><table class="table table-hover table-striped"><thead class=flip-content><tr class=background><th>名称</th><th>ID</th><th>触发器数目</th><th><a translate=th.th3>创建时间</a></th><th><a>最后更新时间</a></th><th>备注</th><th>删除</th></tr></thead><tbody><tr ng-repeat="  prof  in profiles  "><td>{{ prof.name }}<popwin ng-model=prof pk=uuid prop=name handler="updateSysProfile "></td><td>{{ :: prof.uuid }}</td><td>{{ :: prof.trigger_count || 0 }}</td><td class=numeric>{{ :: prof.create_time | date:"yyyy-MM-dd HH:mm Z"}}</td><td class=numeric>{{ :: prof.last_modify_time| date:"yyyy-MM-dd HH:mm Z" }}</td><td class=numeric>{{ prof.desc }}<popwin ng-model=prof pk=uuid prop=desc handler="updateSysProfile "></td><td><a class=text-info ng-click="deleteSysProfile( this, $index, prof)">删除</a></td></tr></tbody></table></div><div class=panel-footer><button class="btn btn-primary btn-sm" ng-click=" addSysProfile() ">添加系统配置</button></div></div>'), a.put("athena/sysmodel/sys_proftrigger.html", '<div class="panel panel-default b-t-none"><div class="panel-heading bg-white-only" ng-if=isModelState><div class="form-group m-b-none m-l-xs"><span style="margin-right: 30px">配置项</span><select ng-model=odp.puuid class="input input-sm w form-control inline" ng-options="p.uuid as p.name for p in profiles  " ng-change="loadPageData( 1 )"></select></div></div><div class="panel-body table-responsive no-padder b-t-none b-b-none" load-mask><table class="table table-hover table-striped j_table b-t-none"><thead class=flip-content><tr class=background><th>ID</th><th>名称</th><th>触发类型</th><th>行为</th><th>触发源</th><th>条件</th><th width=20%>备注</th><th ng-if=isModelState width=1%>编辑</th><th ng-if=isModelState width=1%>删除</th></tr></thead><tbody ng-init=" _config = $sys.trigger "><tr ng-repeat="    t in page.data  "><td>{{t.id}}</td><td>{{t.name}}</td><td>{{ _config.type[t.type] }}</td><td>{{ _config.action[t.action] }}</td><td>{{ _config.origin[t.origin] }}</td><td ng-style=t.lose_tag><i class="fa fa-android text-info-dker" popover-trigger=mouseenter popover="{{ conditions( t.conditions ) }}" popover-placement=top popover-title=触发条件></i></td><td>{{t.desc }}</td><td ng-if=isModelState><a class="text-info m-r-xs" ng-click="c_u_Trigger(  $index  , t   )">编辑</a></td><td ng-if=isModelState><a class="text-info m-r-xs" translate=bu.bu4 ng-click="deleteTrigger(  $index  , t   )">移除</a></td></tr></tbody></table></div><div class="panel-footer text-center"><button class="btn btn-primary btn-sm pull-left" ng-if=isModelState ng-click=" c_u_Trigger(\'create\') ">添加触发器</button><div class=text-center ng-include src=" \'athena/debris/_pager.html\'  "></div></div></div>'), a.put("athena/sysmodel/sys_tag.html", '<div class="panel panel-default b-t-none"><div class="panel-heading bg-white-only w-full" ng-if=isModelState><div class="form-group m-l-xs m-b-none"><span style="margin-right: 30px">配置项</span><select ng-model=odp.puuid class="input input-sm w form-control inline" ng-options="   p.uuid as p.name for p in profiles  " ng-change="loadSysTag( odp.puuid  )"></select></div></div><div load-mask class="panel-body table-responsive no-padder b-b-none"><table class="table table-hover table-striped b-t-none"><thead class=flip-content><tr class=background><th>变量名称</th><th>设备</th><th>类型</th><th>缩放</th><th>偏差</th><th>单位</th><th>保存日志</th><th>日志类型</th><th>日志间隔(秒)</th><th width=15%>备注</th><th ng-if=isModelState width=1%>编辑</th><th ng-if=isModelState width=1%>配置</th><th ng-if=isModelState width=1%>删除</th></tr></thead><tbody ng-init="_$type = $sys.log_type.values"><tr ng-repeat="  tag  in systags  " ng-init="getDevName(tag , this )"><td>{{tag.name}}</td><td>{{ dev_name }}</td><td>{{ tag.type }}</td><td><span ng-show=" tag.type == \'Analog\' ">{{tag.scale}}</span></td><td><span ng-show=" tag.type == \'Analog\' ">{{tag.deviation}}</span></td><td>{{tag.unit}}</td><td><i ng-if=tag.save_log class="glyphicon glyphicon-ok text-success"></i></td><td><span ng-show=tag.save_log>{{ _$type[tag.log_type] }}</span></td><td><span ng-show=tag.save_log>{{ tag.log_type=="RAW" ? tag.log_cycle : undefined }}</span></td><td>{{ tag.desc||"" }}</td><td ng-if=isModelState><a class="text-info m-r-xs" ng-click="updateTag(  $index  , tag , this  )">编辑</a></td><td ng-if=isModelState><a class="text-info m-r-xs" ng-click="add_update_Log(  $index  , tag   )">配置</a></td><td ng-if=isModelState><a class="text-info m-r-xs" translate=bu.bu4 ng-click="deleteTag(  $index  , tag   )">移除</a></td></tr></tbody></table></div><div class="panel-footer b-b b-l b-r"><button class="btn btn-primary btn-sm w-70" ng-if=isModelState ng-click=" addTag(\'add\') ">添加变量</button></div></div>'), a.put("athena/sysmodel/sysmodel.html", '<div class="bg-light lter b-b wrapper-md ng-scope"><h2 class="m-n font-thin h4">系统模型</h2></div><div class=wrapper-md><div class="panel panel-default"><div class=panel-heading ng-show="page.data.length >15"><div class="input-group col-sm-4 col-sm-push-8"><span class=input-group-btn><span class="btn btn-default w-46 height-30" translate=common.search>搜索</span></span> <input class="form-control input-sm" ng-model=f_n></div></div><div load-mask class="panel-body table-responsive no-padder no-border"><table class="table table-hover table-striped b-t-none"><thead class=flip-content><tr class=background><th><span>名称</span></th><th><a>模式</a></th><th><span>通信类型</span></th><th><a>创建时间</a></th><th><a>最后更新时间</a></th><th>设备个数</th><th>配置项个数</th><th width=20%>备注</th><th>删除</th></tr></thead><tbody><tr ng-repeat=" sm in page.data   "><td class=text-left><a ng-click=" goto( \'app.sysmodel_p.basic\' , sm , sm  )" class=text-info-dk>{{sm.name}}</a><popwin ng-model=sm pk=uuid prop=name handler="updateSysModel"></td><td>{{ :: $sys.sysModelMode.values[sm.mode] }}</td><td>{{ :: sm.comm_type==1?"DAServer":"Gateway" }}</td><td>{{ :: sm.create_time | date:"yyyy-MM-dd HH:mm" }}</td><td>{{ :: sm.last_modify_time | date:"yyyy-MM-dd HH:mm" }}</td><td>{{ :: sm.device_count }}</td><td>{{ :: sm.profile_count }}</td><td>{{sm.desc }}<popwin ng-model=sm pk=uuid prop=desc handler="updateSysModel"></td><td><a class=text-info-dk ng-click="deleteSM( $index , sm  )">删除</a></td></tr></tbody></table></div><div class=panel-footer><button class="btn btn-primary btn-sm w-94 m-l-sm" ng-click=" createSM() ">新建系统模型</button></div></div></div>'), a.put("athena/template/delete.html", '<div class=modal-header>{{title}}</div><div class=modal-body>请确认您是否要删除参数?<br>* {{ T.name }} 被 x个设备资料引用, 是否要删除!</div><div class="modal-footer m-t-n-sm"><div class=text-center><button class="btn btn-sm btn-primary w-60" ng-click=" done() ">是</button> <button class="btn btn-sm btn-default w-60" ng-click=" cancel() ">否</button></div></div>'), a.put("athena/template/file.html", '<div class="modal-header text-center"><span ng-if=isAdd>编辑点</span> <span ng-if=!isAdd>添加点</span></div><div class=modal-body><form name=form class="form-validation form-horizontal"><input tl-wrap label=点名称 ng-model=point.name required><select tl-wrap label=轮询方式 ng-model=point.poll ng-options=" o.v as o.k  for  o in $sys.point.pointPoll  "></select><select tl-wrap label=独立分包 ng-model=point.is_packet ng-options="  o.v as o.k for o in  $sys.point.packet"></select><div class=m-t></div><ng-include src=" \'athena/_point/\'+ dm.driver_id+\'.html\' "></ng-include><textarea tl-wrap ng-model=point.desc label=text.desc></textarea></form></div><ng-include src=" \'athena/debris/_modal_footer.html\' "></ng-include>'), a.put("athena/template/group.html", '<div class=modal-body><div class="text-center font"><h4>编辑分组</h4><h4 translate="{{ titl }}"></h4></div><form class="bs-example form-horizontal padding-10"><div class=form-group><label class="col-sm-3 control-label">名称 Name *</label><div class=col-sm-9><input class=form-control ng-model=g.name></div></div></form></div><div class="modal-footer m-t-n-sm"><div class=text-center><button class="btn btn-sm btn-info w-60" ng-click=" done() ">保存</button> <button class="btn btn-sm btn-info w-60" ng-click=" cancel() ">取消</button></div></div>'), a.put("athena/template/temp.html", '<div class=modal-header><span ng-if=isAdd>添加设备模型</span> <span ng-if=!isAdd>编辑设备模型</span></div><div class=modal-body><form name=form class="form-validation form-horizontal"><input type=submit class=hidden><select tl-wrap label=模型类型 required ng-model=" T.driver_id " ng-if=isAdd ng-options=" o.driver_id  as o.name   for o in drivers  "></select><input tl-wrap required ng-model=T.name label=模型名称><textarea tl-wrap ng-model=T.desc label=text.desc>\r\n        </textarea></form></div><ng-include src=" \'athena/debris/_modal_footer.html\' "></ng-include>'), a.put("athena/template/temp_export.html", '<div class=modal-body>请确认您是否要导出模板?<br>* {{ T.name }}<br>导出模板可用于上传到其他帐户。<br><div><a class=text-info-dker>xxxxxxxxxxxxxxxx</a></div></div><div class="modal-footer m-t-n-sm"><div class=text-center><a class="btn btn-sm btn-primary w-60" href=template/{{T.t_id}}/download>是</a> <button class="btn btn-sm btn-default w-60" ng-click=" cancel() ">否</button></div></div>'), a.put("athena/template/temp_upload.html", '<div class=modal-header><h5 class=modal-title>模版上传</h5></div><div class=modal-body><form class="bs-example form-horizontal padding-10"><div class=form-group><label class="col-sm-3 control-label">文件</label><div class=col-sm-9><input ui-jq=filestyle type=file ng-model-instant onchange="angular.element(this).scope().setFiles(this)"></div></div><div ng-show="progress > 1 "><progressbar class="progress-striped active m-b-sm" value=progress type=success>{{progress}}%</progressbar></div><div ng-show="showmsg ">文件超过 10M , 无法上传!</div><div class="form-group text-center"><div class=col-sm-12><button class="btn btn-primary btn-sm w-xs" ng-click=uploadFile() ng-disabled=" ! rightfile ">上传</button> <button class="btn btn-default btn-sm w-xs" ng-click=cancel()>取消</button></div></div></form></div>'),
        a.put("athena/template/template.html", '<div class="bg-light lter b-b wrapper-md ng-scope"><h2 class="m-n font-thin h4">设备模型</h2></div><div class=wrapper-md><div class="panel-body no-padder" id=temp_context load-mask><div class="input-group col-sm-6 col-md-4" ng-show="deviceModels.length > 15"><span class=input-group-btn><span class="btn btn-default height-30 w-46" translate=common.search>搜索</span></span> <input class="form-control input-sm" ng-model=f_n></div><div ng-repeat="dm in deviceModels  " class="panel panel-default m-b-xs"><div class=panel-heading><a ng-class="{\'fa\':true ,\'fa-angle-down\': showp, \'fa-angle-right\': !showp}"></a> <a ng-click=" loadPoints ( this , $event,  $index , dm  ) ; showp = !showp ">{{dm.name }}</a><ul class="nav nav-pills pull-right"><li><a ng-click="add_edit_t( this, dm )" class=text-info>编辑</a></li><li><a ng-click=" delTemp(   $index , dm )" class=text-info>删除</a></li></ul></div><div ng-show="showp " class="panel-body no-border table-responsive no-padder" load-mask><table class="table table-hover table-striped b-b" ng-init="_$config =  $sys.point[dm.driver_id] ;  _$point = $sys.point ;"><thead><tr><td>名称</td><td translate=params.poll></td><td translate=params.is_packet></td><td ng-repeat=" th in  _$config.th " translate=params.{{th}}></td><td>编辑</td><td>删除</td></tr></thead><tbody><tr ng-repeat=" p in points " ng-init="  pa =  fromJson(p.params); "><td>{{p.name}}</td><td>{{ _$point.pointPoll[p.poll].k }}</td><td>{{ _$point.packet[p.is_packet].k }}</td><td ng-repeat=" th in  _$config.th ">{{ _$config[th][pa[th]].k || pa[th] }}</td><td><a ng-click="addOrEditPoint( this ,p , $index  ,t  )" class=text-info>编辑</a>&nbsp; <a ng-click=add_f(p) class=text-info ng-if=false>克隆</a>&nbsp;</td><td><a ng-click="delPoint ( this ,$index , p  , dm.uuid  )" class=text-info>删除</a></td></tr></tbody></table><div class="col-xs-12 m-t-sm m-b-sm"><button class="btn btn-sm w-70 m-l-sm w-xxm j_addp" ng-click="addOrEditPoint( this )">添加点</button></div></div></div><button class="btn btn-sm w-94 btn-primary m-t-sm m-b-sm" ng-click="add_edit_t( this  )">添加设备模型</button></div></div>'), a.put("athena/useclauses.html", '<div class=gap-10><blockquote style="text-align: center; margin: 0px 0px 0px 40px; border: none; padding: 0px"><span style="color: rgb(123, 123, 123); font-size: 12px; line-height: 23px"><b><font face=Arial>说明 &nbsp; &nbsp;</font></b></span></blockquote><div><span>&nbsp; &nbsp; &nbsp; ForceControl V7.0 是力控科技根据当前制造业和信息技术的融合发展日益深化的趋势，总结多年来的行业工程实践经验，以及对行业领军用户需求进行深度分析的基础上设计开发的自动化软件产品...</span></div></div>'), a.put("athena/user/custom.html", "custom.html"), a.put("athena/user/info.html", '<div class="m-l-sm m-r-sm"><i class="fa fa-apple fa fa-3x"></i><div class=row><div class="col-md-4 col-xs-6"><strong>基本信息:</strong><p class=m-l-lg>项目数量 &nbsp;:&nbsp;&nbsp; 2<br>活跃系统数量 &nbsp;:&nbsp;&nbsp; 2<br>发送系统数量 &nbsp;:&nbsp;&nbsp; 2<br>GPS跟踪使能系统数量 &nbsp;:&nbsp;&nbsp; 2<br>用户数量 &nbsp;:&nbsp;&nbsp; 2<br></p></div><div class="col-md-4 col-xs-6"><strong>登录信息:</strong><p class=m-l-lg>登录帐号&nbsp;&nbsp;:xxxxxxxxx<br>登录时间&nbsp;&nbsp;:<br></p></div><div class="line b-b"></div></div><strong>为注册级别计算配置限额</strong><form name=forma class="form-horizontal form-validation"><div class=form-group><label class="col-md-2 col-sm-3 control-label">选择产品</label><div class="col-md-2 col-sm-3"><select class=form-control ng-model="  project.projectname  " ng-options="  obj.id as obj.name  for obj in product "></select></div></div><div class=form-group><label class="col-md-2 col-sm-3 control-label">慢日志记录</label><div class="col-md-2 col-sm-2"><input ui-jq=TouchSpin value=10 class=w-xs data-min=0 data-max=20 data-verticalbuttons=true data-verticalupclass="fa fa-caret-up" data-verticaldownclass="fa fa-caret-down"></div><div class="col-md-2 col-sm-2"><select class="form-control w-xs" ng-class=" " ng-model=log.s1 ng-options="   a  for  a   in s1 "></select><span class=pos-fix>分钟</span></div></div><div class=form-group><label class="col-md-2 col-sm-3 control-label">中速日志记录</label><div class="col-md-2 col-sm-2"><input ui-jq=TouchSpin value=10 class=w-xs data-min=0 data-max=20 data-verticalbuttons=true data-verticalupclass="fa fa-caret-up" data-verticaldownclass="fa fa-caret-down"></div><div class="col-md-2 col-sm-2"><select class=form-control ng-class=" w-sm" ng-model=log.s2 ng-options="   a  for  a   in s2 "></select></div></div><div class=form-group><label class="col-md-2 col-sm-3 control-label">快速日志记录</label><div class="col-md-2 col-sm-2"><input ui-jq=TouchSpin value=10 class=w-xs data-min=0 data-max=20 data-verticalbuttons=true data-verticalupclass="fa fa-caret-up" data-verticaldownclass="fa fa-caret-down"></div><div class="col-md-2 col-sm-2"><select class=form-control ng-class=" w-sm" ng-model=log.s3 ng-options="   a  for  a   in s3 "></select></div></div></form><strong>历史数据的存储时间</strong></div>'), a.put("athena/user/promise.html", '<tabset class=tab-container><tab><tab-heading><i class="glyphicon glyphicon-bell"></i> Biling</tab-heading><div>Biling</div></tab><tab><tab-heading><i class="glyphicon glyphicon-bell"></i> 注册</tab-heading><div>注册</div></tab><tab><tab-heading><i class="glyphicon glyphicon-bell"></i> 短信</tab-heading><div>短信</div></tab><tab><tab-heading><i class="glyphicon glyphicon-bell"></i> 用户</tab-heading><div>用户</div></tab></tabset>'), a.put("athena/user/users.html", "<tabset class=tab-container><tab><tab-heading><i class=\"glyphicon glyphicon-bell\"></i> 所有用户</tab-heading><table ui-jq=dataTable ui-options=\"{\r\n                  sAjaxSource: 'datatable.json',\r\n                  aoColumns: [\r\n                    { mData: 'browser' },\r\n                    { mData: 'browser' },\r\n                    { mData: 'gps' },\r\n                    { mData: 'tb' },\r\n                    { mData: 'platform' }\r\n                  ]  }\" class=\"table table-striped m-b-none table-bordered table-striped\"><thead><tr><th>用户名</th><th>全名</th><th>有效手机</th><th>有效电子邮件</th><th>上次在线时间</th></tr></thead><tbody></tbody></table></tab><tab><tab-heading><i class=\"glyphicon glyphicon-bell\"></i> 按项目划分用户</tab-heading><table ui-jq=dataTable ui-options=\"{\r\n                  sAjaxSource: 'datatable.json',\r\n                  aoColumns: [\r\n                    { mData: 'engine' },\r\n                    { mData: 'browser' },\r\n                    { mData: 'platform' },\r\n                    { mData: 'version' },\r\n                    { mData: 'version' },\r\n                    { mData: 'gps' },\r\n                    { mData: 'tb' },\r\n                    { mData: 'grade' }\r\n" + '                  ]  }" class="table table-striped m-b-none table-bordered table-striped"><thead><tr><th>全名</th><th>项目访问</th><th>读数据</th><th>些数据</th><th>确认警告</th><th>离线警告</th><th>gps警告</th><th>短信警告</th></tr></thead><tbody></tbody></table></tab><tab><tab-heading><i class="glyphicon glyphicon-bell"></i> 添加用户</tab-heading><div ng-include=" \'athena/manage/pro_addproject.html\'  "></div></tab></tabset>'), a.put("athena/user/visdata.html", "<tabset class=tab-container><tab><tab-heading><i class=\"glyphicon glyphicon-bell\"></i> 网络服务</tab-heading><div class=\"panel panel-danger\"><div class=panel-heading style=\"height: 45px\"><button class=\"btn btn-sm btn-success\">添加</button></div><table ui-jq=dataTable ui-options=\"{\r\n                  sAjaxSource: 'datatable.json',\r\n                  aoColumns: [\r\n                    { mData: 'browser' },\r\n                    { mData: 'browser' },\r\n                    { mData: 'gps' },\r\n                    { mData: 'gps' },\r\n                    { mData: 'tb' },\r\n                    { mData: 'grade' }\r\n                  ]  }\" class=\"table table-striped m-b-none table-bordered table-striped\"><thead><tr><th>码类型</th><th>信息</th><th>码</th><th>合格者列表</th><th>活跃</th><th>活动</th></tr></thead><tbody></tbody></table></div></tab><tab><tab-heading><i class=\"glyphicon glyphicon-bell\"></i> RSS摘要</tab-heading><div class=\"panel panel-primary\"><div class=\"panel-heading pan\"><button class=\"btn btn-sm btn-success\">添加</button></div><table ui-jq=dataTable ui-options=\"{\r\n                  sAjaxSource: 'datatable.json',\r\n                  aoColumns: [\r\n                    { mData: 'browser' },\r\n                    { mData: 'browser' },\r\n                    { mData: 'gps' },\r\n                    { mData: 'gps' },\r\n                    { mData: 'tb' },\r\n                    { mData: 'grade' }\r\n" + '                  ]  }" class="table table-striped m-b-none table-bordered table-striped"><thead><tr><th>码类型</th><th>信息</th><th>码</th><th>合格者列表</th><th>活跃</th><th>活动</th></tr></thead><tbody></tbody></table></div></tab><tab><tab-heading><i class="glyphicon glyphicon-bell"></i> Published Profiles</tab-heading><div class="panel panel-info"><div class="panel-heading pan"><button class="btn btn-sm btn-success">添加</button></div><table ui-jq=dataTable ui-options="{\r\n                  sAjaxSource: \'datatable.json\',\r\n                  aoColumns: [\r\n                    { mData: \'browser\' },\r\n                    { mData: \'version\' },\r\n                    { mData: \'grade\' }\r\n                  ]  }" class="table table-striped m-b-none table-bordered table-striped"><thead><tr><th>Publicshed profiles</th><th>码</th><th>活动</th></tr></thead><tbody></tbody></table></div></tab></tabset>'), a.put("athena/xxx/file_upload_temp.html", '<div class=modal-header><h5 class=modal-title>文件上传!</h5></div><div class=modal-body><form class="bs-example form-horizontal padding-10"><div class=form-group><label class="col-sm-2 control-label">名称</label><div class=col-sm-10><input class="form-control input-sm" ng-model=" file.filename "></div></div><div class=form-group><label class="col-sm-2 control-label">描述</label><div class=col-sm-10><input class="form-control input-sm" ng-model="  file.filedesc"></div></div><div class=form-group><label class="col-sm-2 control-label">文件</label><div class=col-sm-10><input ui-jq=filestyle type=file ng-model-instant class=input-sm onchange="angular.element(this).scope().setFiles(this)"></div></div><div ng-show="progress > 1 "><progressbar class="progress-striped active m-b-sm" value=progress type=success>{{progress}}%</progressbar></div><div ng-show="showmsg ">文件超过 10M , 无法上传!</div><div class="form-group text-center"><div class=col-sm-12><button class="btn btn-primary btn-sm" ng-click=uploadFile() ng-disabled=" ! rightfile ">上传</button> <button class="btn btn-default btn-sm" ng-click=" cancel() ">取消</button></div></div></form></div>'), a.put("athena/xxx/fileregion_temp.html", '<div class="panel panel-default b-white"><div class="panel-heading padding-5"><div class=col-xs-8><button class="btn m-t-xxsm btn-sm btn-success" ng-click="openFileUploadWin(\'lg\')">添加文件</button></div><div class="input-group col-lg-4"><span class=input-group-btn><button class="btn btn-default btn-sm" type=button>Search!</button></span> <input class=form-control ng-model=filename></div></div><div class="panel-body padding-0 table-responsive"><table class="table table-hover table-bordered table-striped table-bordered table-striped table-condensed flip-content"><thead class=flip-content><tr><th width=40%>文件名</th><th width=40%>大小</th><th width=10%></th></tr></thead><tbody><tr ng-repeat="  file  in fileregions | filter :  { filename : filename } "><td><a class=text-info-dk href="{{\'project/\'+$stateParams.projid +\'/file/\' +file.id +\'/download\'  }}">{{ file.filename }}</a></td><td class=numeric>{{ file.size/1024 | number : 0 }} k</td><td><a class=text-info-lter ng-disabled=true translate=dastation_grid.del ng-click="delFile( { fileid:file.id } , $index  )">移</a></td></tr></tbody></table></div></div>')
}]);
//# sourceMappingURL=app.6adcbdf2.js.map
