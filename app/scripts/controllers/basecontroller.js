/* Controllers   单独的modul  ; 其他控制器 属于app模块 */



angular.module('app.basecontroller', [])

.controller('AppCtrl', function(
    $scope, $translate, $localStorage, $window, $modal, $state,
    $timeout, $sessionStorage, $source, $q, $source, $animate,
    $location, $rootScope, $utils , $cookies )  {

    var S = $scope;


    $scope.$on('$stateChangeStart', function(event, a, b, c, d) {
        console.log( "stateChangeStart", event , a,b,c,d)

        angular.from = {
            text: c.text,
            url: $state.href(c.name, d)
        };

    });




    //@if  append

    console.log("app ctrl", $scope);
    //@endif
    //"f7846f55cf23e14eebeab5b4e1550cad5b509e3348fbc4efa3a1413d393cb650";

    // add 'ie' classes to html

    function isSmartDevice($window) {
        // Adapted from http://www.detectmobilebrowsers.com
        var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
        // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
        return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
    }

    var isIE = !!navigator.userAgent.match(/MSIE/i);
    isIE && angular.element($window.document.body).addClass('ie');
    isSmartDevice($window) && angular.element($window.document.body).addClass('smart');

    // config
    $scope.app = {
        name: 'Angulr',
        version: '1.3.0',
        // for chart colors
        color: {
            primary: '#7266ba',
            info: '#23b7e5',
            success: '#27c24c',
            warning: '#fad733',
            danger: '#f05050',
            light: '#e8eff0',
            dark: '#3a3f51',
            black: '#1c2b36'
        },
        settings: {

            themeID: 1,
            navbarHeaderColor: 'bg-black',
            navbarCollapseColor: 'bg-white-only',
            asideColor: 'bg-black',
            headerFixed: true,
            asideFixed: true,
            asideFolded: false
        }
    };


    // click 跳转 , 第一个  必须为 state ,
    //               第二个 必须是 params || null ; ,
    //              第三个以后 ( 可多个) 是 cache,
    // 参数可以是: ( a, b, c, d ) 或者 (a, b, [c,d])
    $scope.goto = function() {
        var state = arguments[0],
            params = arguments[1], //
            value = arguments[2];

        // if (value) {
        var v = angular.isArray(value) ? value : Array.prototype.splice.call(arguments, 2)
        $sessionStorage.cache = v;
        $scope.$$cache = v;
        // }
        $state.go(state, params);
    }

    var text_arr;
    $scope.jsonString2Text = function(jsonString) {
        text_arr = [];

        $.each(angular.fromJson(jsonString) || {
            "参数": "无"
        }, function(i, v) {
            text_arr.push(i)
            text_arr.push("=")
            text_arr.push(v + "; ")
        })
        return text_arr.join("");

    }


    // 赋初始值 ;
    $scope.$$cache = $sessionStorage.cache;


    //=========form 验证=====  默认 验证 form[ name = "form"] ;
    $scope.validForm = function(formName, scope) {
        formName = formName || "form";
        var that = scope || this;
        var valids = that[formName] || // 递归去找 ? 不了;
            that.$$childTail[formName] ||
            that.$$childTail.$$childTail[formName];

        if (valids && valids.$invalid) {
            // 处理 form 的 validate ;
            var errName;
            angular.forEach(valids.$error, function(e, k) {
                //@if  append

                console.log(e);
                //@endif
                angular.forEach(e, function(modelCtrl, k1) {
                    modelCtrl.$setDirty(true); // = true ; 

                    //modelCtrl.$setViewValue(modelCtrl.$viewValue);

                })
            });


            throw (" form invalid !!", valids.$error);

        }
    }

    $scope.ccPassWord = function() {
        $modal.open({
            templateUrl: "athena/cc_password.html",
            // size:"sm",
            controller: function($scope, $modalInstance, $source) {
                $scope.op = {},
                    $scope.od = {},
                    $scope.__proto__ = S,
                    $scope.$modalInstance = $modalInstance;



                $scope.done = function() {
                    $scope.validForm();

                    $source.$user.save({
                        op: "pwdreset"
                    }, $scope.op, function(resp) {
                        if (resp.msg) {
                            $scope.od.msg = resp.msg;
                            return;
                        }

                        angular.alert("修改成功!");
                        //@if  append

                        console.log("修改成功!");
                        //@endif
                        $scope.cancel();
                    })
                }
            }
        })
    }


    // save settings to local storage
    if (angular.isDefined($localStorage.settings)) {
        $scope.app.settings = $localStorage.settings;
    } else {
        $localStorage.settings = $scope.app.settings;
    }
    $scope.$watch('app.settings', function() {
        $localStorage.settings = $scope.app.settings;
    }, true);

    // angular translate
    $scope.lang = {
        isopen: false
    };
    $scope.langs = {
        en: 'English',
        zh_CN: '简体中文'
    };
    $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "简体中文";
    $scope.setLang = function(langKey, $event) {
        // set the current lang
        $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        $scope.lang.isopen = !$scope.lang.isopen;
    };



    //===================================================================================
    //===================================================================================
    //===================================================================================


    if (!$sessionStorage.navs) {
        $sessionStorage.navs = [];
    }

    $scope.navs = $sessionStorage.navs;
    //@if  append

    console.log($scope.navs);
    //@endif

    function transState($title, $state, tab) {
        //var msg = $translate.instant("valid." + type);
        if (angular.isString($state)) {
            return {
                id: $state,
                title: $title
            }
        } else {
            return {
                id: $state.current.name,
                title: $title,
                state: {
                    name: $state.current.name,
                    params: $state.params
                },
                tab: tab
            }
        };
    }


    function pushNav(nav) {
        var nc, index; // nc  意思 : 包包括;

        $.each($scope.navs, function(i, n) {
            index = i;
            return nc = (n.id != nav.id);
        });
        if (nc) {
            $scope.navs.push(nav);
        }
        return [nc, index]
    }

    // 管理  || 展示 根 ;
    $scope.$rootNav = function($title) {
        $scope.navs[0] = {
            title: $title,
            id: 'root'
        };
    };

    // 清空 nav ;
    $scope.$moduleNav = function($title, $state) {
        var s = transState($title, $state);
        $scope.navs = $sessionStorage.navs = $scope.navs.splice(0, 1);
        pushNav(s);
    };


    // 追加 nav  ;
    $scope.$appendNav = function($title, $state) {
        // if ($scope.navs[$scope.navs.length - 1].title != $title) {
        //     pushNav(transState($title, $state));
        // }
    };

    // (tab 类型 )替换最后一个 nav;
    $scope.$popNav = function($title, $state) {
        // var l, s, r;
        // l = $scope.navs[$scope.navs.length - 1];
        // s = transState($title, $state, true);

        // if (l.tab) {
        //     $scope.navs.pop();
        // }
        // r = pushNav(s);
        // if (!r[0]) {
        //     $scope.navs = $scope.navs.splice(0, r[1] + 1);
        // };
    };


    $scope.navGo = function(n) {
        if (!n.state) return;
        $state.go(n.state.name, n.state.params);
        //$state.go();
    };


    // 关闭弹出 window
    $scope.cancel = function() {
        this.$modalInstance && this.$modalInstance.dismiss('cancel');
    };

    // 登出;
    $scope.logout = function() { //ui-sref="access.signin"
        $source.$user.logout(
            function(ret) {
                //@if  append

                console.log(ret);

                console.log("注销!!");
                //@endif

                $cookies ;


                $scope.user = null;
                // $utils.delCookie('session_id'); 
                $state.go('access.signin');
                // $window.location ="/athena" ;
            }
        );
    };

    // 公共 采集站 模版 的  替换, 失败, 移除 ,  在  appCtrl中定义;

    // 替换;
    $scope.chaStation = function(scope, station, index) {

        $modal.open({
            templateUrl: 'athena/dastation/station_change.html',
            size: "md", //size  lg md  sm
            resolve: {
                station: function() {
                    return station
                }
            },
            controller: function($scope, station, $modalInstance, $source) {
                $scope.__proto__ = scope;
                //@if  append

                console.log("changeDastation");
                console.log($scope);
                //@endif

                $scope.station = station;
                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel')
                };
                // 替换逻辑;
                $scope.done = function(btn) {
                    //@if  append

                    console.log(111);
                    //@endif
                    //$scope.checkModalForm(btn, $scope);
                    // if (!$scope.$$childTail.form.$valid) return;
                    $scope.validForm();


                }
            }
        });
    };

    //  采集占失效   失败; effactive ;

    $scope.effStation = function(dastations, station, index, todel) {
        $scope.confirmInvoke({
            title: "失效系统 " + station.name,
            note: "失效将释放当前系统持有的采集资源, 如您的系统处于编程模式,将恢复到采集模式,失效后历史数据不会丢失,确认要失效该系统吗?"
        }, function(next) {
            var d = {
                uuid: station.uuid,
                state: 0
            };

            $source.$system.deactive({
                pk: station.uuid
            }, function() {
                station.state = 0;

                todel && (dastations.splice(index, 1));

                next();
            }, function() {
                next();
            })

        })
    };


    // 移除;
    $scope.delStation = function(dastations, station, index) {
        $scope.confirmInvoke({
            title: "您是否要删除系统:" + station.name,
            warn: "删除系统将会丢失此系统的全部历史数据"
        }, function(next) {
            $source.$system.delete({
                system_id: station.uuid
            }, function(resp) {

                dastations.splice(index, 1);

                next();
            }, function() {

                next()
            });
        })
    };

    //激活采集站;
    //  jump 是否 跳转;
    $scope.activateStation = function(dastations, station, index, jump) {


        $scope.confirmInvoke({
            // jjw 采集站->系统
            title: "激活系统 " + station.name,
            note: "确认要激活该系统吗?"
        }, function(next) {
            // 激活采集站;
            $source.$system.active({
                pk: station.uuid
            }, function(resp) {
                station.state = 1;
                dastations && (dastations.splice(index, 1));
                next();
                jump && $scope.goto('app.station.prop._basic', station, station);

            }, function() {
                angular.alert("激活失败!");
                next();
            });
        })
    };

    // 编辑采集站;

    $scope.editStation = function(scope, s) {
        //@if  append

        console.log("editStation");
        //@endif
        $modal.open({
            templateUrl: "athena/dastation/station_edit.html",
            controller: function($scope, $source, $modalInstance) {
                $scope.__proto__ = scope;
                //@if  append

                console.log(s, $scope);
                //@endif
                $scope.das = {
                    uuid: s.uuid,
                    name: s.name,
                    desc: s.desc
                }; //angular.copy(s) ;

                $scope.op = {};

                $source.$region.query({
                    currentPage: 1
                }, function(resp) {
                    $scope.projs = resp.data;
                    if (s.region_id) {
                        $.each($scope.projs, function(i, n) {
                            if (s.region_id == n.id) {
                                $scope.op._proj = n;
                                return false;
                            }
                        })
                    }

                })


                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel')
                };
                $scope.done = function() {
                    // $scope.checkModalForm(btn, $scope);
                    $scope.validForm();
                    var region = $scope.op._proj;
                    $scope.das.region_id = region.id,

                        $source.$system.put($scope.das, function(resp) {
                            //@if  append

                            console.log(resp);
                            //@endif
                            $scope.das.region_name = region.name;
                            angular.extend(s, $scope.das);
                            $scope.cancel();


                        }, $scope.cancel);
                }

            }
        });
    };


    // 同步 das 配置;
    $scope.syncSystem = function(das, e, scope) {


        // if( scope._$preventDefault){
        //     angular.alert("请不要频繁操作!");
        //     return ;
        // }
        // scope._$preventDefault = true ; 

        //@if  append 
        console.log(das, this, e.currentTarget);
        //@endif


        var that = this;
        this._show_sync_ok = false;
        this._show_sync_error = false;

        $source.$system.sync({
                pk: das.uuid
            },
            function(resp) {

                das.needsync = false;
                that._show_sync_ok = true;
            },
            function(resp) {
                that._show_sync_error = true;
            });
    };





    //  启动 采集站;
    //  在
    $scope.startSystem = function(sys, systems, index) {
        // var uuid = sys.uuid;

        function start() {
            return $source.$system.start({
                pk: sys.uuid
            }).$promise;
        }
        if (systems) {
            $scope.confirmInvoke({
                title: "启动系统 " + sys.name,
                note: "确认要启动该系统吗?"
            }, function(next) {
                start().then(function(resp) {
                    systems.splice(index, 1); // ?? 启动后移除; ???
                    next();
                    $scope.alert({
                        title: "启动成功"
                    });
                });
            })
        } else {
            start().then(function(resp) {
                $scope.alert({
                    title: "启动成功"
                });
            });
        }
    }

    // type => 召唤实时 : undefined ,  超换参数: 1  召唤 所有: 3   ,
    $scope.d_call = function(system, type, e) {
        //@if append
        console.log("召唤实时 : undefined ,  超换参数: 1  召唤 所有: 3  ");
        //@endif
        var $button = $(e.currentTarget);

        $button.css({
            opacity: 1
        });
        // var s = $animate.removeClass( button.children[1] ,"hide");
        $button.text("召唤中...").attr("disabled", true);

        $source.$system.post({
            pk: system.uuid,
            type: type
        }, {}, function(resp) {
            //                jjw 召唤成功不显示
            //                angular.alert("召唤成功");
            $button.text("召唤成功");
            $timeout(function() {
                $button.text("召唤").attr("disabled", false);
            }, 5000);
        }, function() {
            $button.text("召唤失败").toggleClass("btn-danger");
            $timeout(function() {
                $button.text("召唤").toggleClass("btn-danger").attr("disabled", false);
            }, 5000);
        });

    };


    // resp_err , info , warn ;
    angular.alert = $scope.alert = function(msg, fun, func) {
        $modal.open({
            templateUrl: "athena/debris/_alert.html",
            controller: function($scope, $modalInstance, $translate) {

                if (angular.isString(msg)) {
                    msg = {
                        title: msg
                    };
                };

                if (msg.type == "resp_err") {
                    msg.title = $translate.instant(msg.title);
                }

                $scope.msg = msg;
                var m = {
                    'resp_err': "fa-exclamation-circle text-info",
                    "info": "fa-exclamation-circle text-info",
                    "warn": "fa-exclamation-triangle"
                }
                $scope.msg.type = m[$scope.msg.type || 'info'] || m.info;


                $scope.cancel = function() {
                    //@if  append
                    console.log(" modal closed !");
                    //@endif

                    $modalInstance.dismiss('cancel');
                    func && func();
                };
                $scope.done = function() {
                    $scope.cancel();
                    fun && fun();
                };
            }
        })
    }

    /**
     * msg = { title : '标题' , note:  注释 , warn: 警告  ,
     *     todo: 确定按钮字符 ,
     *     undo : 取消按钮字符 }
     * handler : funcction  ;     handler 最好有 true false 返回值 , 以便derfer 处理 ;
     * @param msg
     * @param handler
     */
    $scope.confirmInvoke = function(msg, handler, cancelHandler) {
        $modal.open({
            templateUrl: 'athena/debris/confirm_invoke.html',
            //resolve:{ msg: function (){ return  msg } ,  handler: function (){ return handler} } ,
            //  controller: function( $scope ,$modalInstance , $q ,  msg , handler  ){
            controller: function($scope, $modalInstance) {
                $scope.cancel = function() {
                    cancelHandler && cancelHandler();
                    $modalInstance.dismiss();
                };



                $scope.todo = msg.todo || "do";
                $scope.undo = msg.undo || "cancel"

                $scope.done = function() {
                    // handler ? handler($scope.cancel) : $scope.cancel();
                    handler ? handler($modalInstance.dismiss) : $modalInstance.dismiss();
                };
                $scope.msg = msg;

            }
        });
    };


    //********************
    //

    $scope.showAlarmMsg = function(alarm, system_id) {
        $modal.open({
            templateUrl: "athena/show/alarm_msg.html",
            resolve: {
                // triger: function(){
                //    return  $source.$sysProfTrigger.get({pk:1}).$promise
                // }
                conformMsg: function($show) {
                    return $show.alarm.getConformMsg({
                        ack_id: alarm.ack_id,
                        system_id: alarm.system_id
                    }).$promise;
                }
            },
            controller: function($scope, $modalInstance, conformMsg) {
                $scope.__proto__ = S;
                $scope.$modalInstance = $modalInstance;
                // $scope.done = $scope.cancel;
                $scope.alarm = alarm;
                $scope.conformMsg = conformMsg.ret;

                conformMsg.ret.user_id && $source.$user.get({
                    pk: conformMsg.ret.user_id
                }, function(resp) {
                    $scope.conformMsg.username = resp.ret.username;
                })

            }
        });
    }

    $scope.conformAlarm = function(page, alarm, index, system_id, active) {
        $modal.open({
            templateUrl: "athena/show/alarm_conform.html",
            controller: function($scope, $modalInstance, $show) {
                $scope.__proto__ = S;
                $scope.$modalInstance = $modalInstance;
                // $scope.done = $scope.cancel;
                $scope.alarm = alarm;

                $scope.od = {
                    message: ""
                }

                $scope.done = function() {

                    $scope.validForm();
                    $show.alarm.conform(
                        angular.extend({
                            alarm_id: alarm.id,
                            system_id: alarm.system_id
                        }, $scope.od),
                        null,
                        function(resp) {
                            $scope.cancel();

                            alarm.active = -1;
                            alarm.ack_id = resp.ret;
                            alarm.close_time = new Date();

                            //angular.alert("确认报警成功");
                            page.total--;

                            if ("a" == active) {
                                page.data.splice(index, 1);
                            }


                        },
                        function() {
                            $scope.cancel();
                            //angular.alert("确认报警失败")
                        })
                }

            }
        });

    }

    // 接收邮件通知 ;
    $scope.acceptSMS = function(user) {
        //"mail_notice":0,"sms_notice":0

        // if( !user.mobile_phone_verified ){
        //     angular.alert("您的手机未通过验证,不可接收短信通知!");
        //     return ;
        // }

        $source.$user.save({
                op: "notice"
            }, {
                sms_notice: user.sms_notice ? 0 : 1
            },
            function() {
                user.sms_notice = !user.sms_notice;

            }
        )

    }


    // 接收短信通知;
    $scope.acceptEmail = function(user) {

        // if( !user.email_verified ){
        //     angular.alert("您的邮箱未通过验证,不可接收邮件通知!");
        //     return ;
        // }

        $source.$user.save({
            op: "notice"
        }, {
            mail_notice: user.mail_notice ? 0 : 1
        }, function() {
            user.mail_notice = !user.mail_notice;
        })
    }


})

//登录
.controller("access_signin", function($scope, $state, $timeout, $localStorage, $sys,
    $compile, $source, $modalStack, $rootScope, $modalStack) {

    $modalStack.dismissAll();

    $scope.op = {
        t: 1, // 图片验证码;
        b: false, // 登录按钮是否可用; 
    };
  
    // 获取登录次数;
    $source.$common.get({
        op: 'logintimes'
    }, function(resp) {
        $scope.op.need_idenfity = !!resp.ret;
    });


    //@if  append
    console.log("sign controller");
    console.log($scope);
    //@endif

    $scope.user = {};

    //@if  append
    $scope.user = {
        // username: "administrator",
        // password: "111111"

        username: "123123",
        password: "123123"
    };
    //@endif


    $scope.user.account = $localStorage.account;



    // $scope.st.login_errtimes ++ ;

    $scope.login = function() {

        //@if  append
        console.log($scope.user);
        //@endif

        var u = $scope.user;
        if (!u.account) {
            angular.alert("请输入公司名称");
            throw ("");
        }
        if (!u.username) {
            angular.alert("请输用户名");
            throw ("");
        }
        if (!u.password) {
            angular.alert("请输入密码");
            throw ("");
        }


        $scope.validForm();

        $scope.op.b = true;

        $localStorage.account = $scope.user.account;

        $source.$user.login($scope.user,
            function(resp) {
                //@if  append
                console.log(resp.ret);
                //@endif

                // resp.ret.sms_notice = !!resp.ret.sms_notice;
                // resp.ret.mail_notice = !!resp.ret.mail_notice;
                // $("body").scope().user  = resp.ret ;

                if (resp.ret) {

                    //@if  append
                    console.log("log in ok ");

                    //@endif
                    //$state.go( $sys.rootState );
                    $state.go("app.m_region");
                    //$state.go("app.template");
                } else {
                    $scope.op.b = false;
                    $scope.resp = resp;
                }
            },

            function(resp) { // {err:.. , ret: ... }
                if (resp.err == "login_yet") {
                    $timeout(function() {
                        $state.go("app.m_region");
                        $modalStack.dismissAll();

                    }, 2000)

                    return;
                }
                if (resp.img) {
                    $scope.op.need_idenfity = true;
                    $("#login_identify").attr("src", "data:image/jpg;base64," + resp.img)
                }

                $scope.op.t++;

                $scope.op.b = false;



            }

        );
    };

})


.controller("access_signup", function($scope, $state, $location, $source, $localStorage, $interval) {

    // signup ;
    $scope.comp = {};
    $scope.op = {};

    $scope.time = 0;
    var inter, time = 0;

    //@if  append
    console.log($location.$$search.v)
        //@endif

    // 是否是 第三部;
    var uuid = $location.$$search.v;

    if (uuid) {

        $source.$common.verifyUuid({
            uuid: uuid
        }, function(resp) {

            // verify uuid ;
            // $source.$account.get({
            //     pk: "admin",
            //     uuid: uuid
            // }, function(resp) {

            if (resp.ret) {
                $scope.op.step = "step3"
            } else {
                $state.go("access.signin");
            }
        })
    } else {
        $scope.op.step = "step1";
    }

    // 发送 account 验证码;
    //@if append
    $scope.sendNote = function() {

            var ph = $scope.comp.admin && $scope.comp.admin.mobile_phone;
            if (!/^1[0-9]{10}$/.test(ph)) {
                $scope.alert({
                    type: "info",
                    title: "手机号码格式错误!"
                })
                return;
            }

            $source.$note.get({
                    op: "account",
                    mobile_phone: $scope.comp.admin.mobile_phone
                },
                function(resp) {

                    inter = $interval(
                        function() {
                            ++$scope.time == 120 && (
                                $interval.cancel(inter),
                                $scope.time = 0
                            )
                        },
                        1000
                    )
                },
                function() {

                }
            )
        }
        //@endif


    // 去缓存account,到 website ;
    // setp1
    $scope.signup = function($event) {



        $scope.validForm('form1');

        $scope.showMask = true;

        var dom = $event.currentTarget;
        dom.disabled = true;


        $source.$account.save($scope.comp, function(resp) {


            $scope.op.step = "step2";
            $scope.showMask = false;

            // 注册成功;
            //$localStorage.comp_name = $scope.comp.name;
            // $scope.alert({  type: 'info',   title: "注册成功!"  }, function() {
            //     $state.go("access.signin");
            // })

        }, function() {
            $scope.showMask = false;
            dom.disabled = false;
            $scope.op.t++;
        })
    };


    $scope.reSendEmail = function() {
        $scope.validForm("form1");
        $source.$account.save($scope.comp, function(resp) {
            angular.alert("邮件重发成功");
        })
    }

    $scope.openEmail = function() {
        window.open("//mail." + $scope.comp.admin.email.replace(/.*@(.+)/, "$1"))
    }


    // 创建 account ; step3 ;
    $scope.create = function() {

        if ($scope.confirm_password != $scope.comp.admin.password) {
            angular.alert("两次密码输入不一致");
        }

        $scope.validForm("form2");





        $scope.showMask = true;

        $source.$account.save({
            pk: 'admin',
            uuid: uuid
        }, $scope.comp.admin, function(resp) {

            $scope.showMask = false;
            // 注册成功;
            $localStorage.comp_name = $scope.comp.name;

            $scope.alert({
                type: 'info',
                title: "注册成功!"
            }, function() {
                $scope.showMask = false;
                $state.go("access.signin");
            })

        })
    }


})


// 更改管理员密码;
.controller("access_fogpas", function($scope, $state, $sessionStorage, $source, $interval, $location, $timeout) {

    $scope.od = {};
    $scope.account = {
        op: "admin",
        account: null, // account  name ;
        identify: null, // 图片验证码;
    }
    $scope.admin = {};


    $scope.t = 123111;

    var uuid = $location.$$search.v;
    if (uuid) {
        $source.$common.verifyUuid({
            uuid: uuid
        }, function(resp) {
            // })

            // verify uuid ;
            // $source.$account.get({
            //     pk: "admin",
            //     uuid: uuid
            // }, function(resp) {
            if (resp.ret) {
                $scope.od.step = 3;
            } else {
                $scope.od.step = 4;
                $timeout(function() {

                    $state.go("access.signin");
                }, 5000)
            }

        })
    } else {
        $scope.od.step = 1;
    }



    $scope.setp1 = function($event) {

        $scope.validForm("step1");


        $scope.showMask = true;

        $event.currentTarget.disabled = true;

        //$scope.od.identi.length <4  return ;
        $source.$common.get(
            $scope.account,
            function(resp) {
                // $scope.od.phone = resp.ret;

                $scope.showMask = false;
                $scope.od.step = 2;
                $event.currentTarget.disabled = false;
            },
            function(resp) {
                $scope.showMask = false;
                $scope.t++;
                $event.currentTarget.disabled = false;
            }
        )
    };


    // 更改密码;
    $scope.cc_done = function() {

        $scope.validForm("form2");

        $scope.admin.code = uuid;

        $scope.showMask = true;
        $source.$common.save({
                op: "admin"
            },
            $scope.admin,
            function(resp) {
                $scope.showMask = false;
                $scope.alert({
                        title: "修改成功",
                        do: ""
                    }, function() {
                        $state.go('access.signin');
                    }),
                    function() {
                        $scope.showMask = false;
                    }
            });
    };
})


.controller("verifyemail", function($scope, $state, $source, $timeout, $location) {

    $scope.op = {};

    var code = $location.$$search.code;


    if (code) {
        $source.$common.get(angular.extend({
            op: "verifyemail"
        }, $location.$$search), function(resp) {


            if (!resp.err) {
                $scope.op.verifyemail = 1;
                $timeout(function(argument) {
                    // $state.go("access.signin");
                }, 5000)

            } else {

                $scope.op.verifyemail = 2;

                $timeout(function() {
                    //    $state.go("access.signin");

                }, 2000);
            }


        });


    } else {
        //$scope.op.verifyemail = false ;
        //$state.go("access.signin");
    }





})

//========================================================================
//========================================================================


// 联系我们; 技术支持; 问题反馈, 帮助;
// 在 app.html 中!
.controller('service', function($scope, $modal) {

    var S = $scope;
    //联系我们;
    $scope.c = function() {
        $modal.open({
            templateUrl: 'athena/contactus.html'
        })
    }

    //使用条框;
    $scope.u = function() {
        $modal.open({
            templateUrl: 'athena/useclauses.html'
        })
    }

    // 问题反馈;
    $scope.feedback = function() {
        $modal.open({
            templateUrl: 'athena/feedback.html',
            controller: function($scope, $modalInstance) {
                $scope.$modalInstance = $modalInstance;
                $scope.__proto__ = S;


            }
        })
    }


    // 技术支持;
    $scope.support = function() {


    }


})



//========================================================================

;
