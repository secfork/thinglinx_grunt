// http://thinglinx-test.oss-cn-beijing.aliyuncs.com/10108.0/NyqTgJE-gi7=ffu630ns.jpeg

// http://thinglinx-test.oss-cn-beijing.aliyuncs.com/10108/system/Vke2gdxrluZ_x4f2u9fz2527

angular.module('app.account', [])

.controller("account_info", function($scope, $state, $source, $show, $q ) {
 
    //@if  append

    console.log($scope);
    //@endif 

    $scope.od = {};

    // 账户信息;  
    $source.$user.get({
        pk: "getaccount",
        op: $scope.user.account_id
    }, function(resp) {
        $scope.account = resp.ret;
    })

    // 得到 区域 数目;
    $source.$region.get({
            op: "total"
        }, function(resp) {
            $scope.regionNum = resp.ret;
        })
        // 得到 用户数目;
    $source.$user.get({
        op: "total"
    }, function(resp) {
        $scope.userNum = resp.ret;
    })

    // 得到系统 激活 , 非激活 数据; 
    $q.all([
        $source.$system.get({
            pk: "total"
        }).$promise,
        $source.$system.get({
            pk: "total",
            state: 1
        }).$promise
    ]).then(function(resp) {
        $scope.totalSys = resp[0].ret || 0;
        $scope.totalSys_act = resp[1].ret || 0;
        $scope.initChart_sys = true;
    })


    // 得到  本周 报警  数目( 总数, 未处理数目 )
    var date = new Date();
    var d = {
        end: date.getTime(),
        start: date.RtnMonByWeekNum(date.getWeekNumber()) - 604800000
    };

    $q.all([
        $show.alarm.get(angular.extend({
            op: "total"
        }, d)).$promise,
        $show.alarm.get(angular.extend({
            op: "total",
            active: 1
        }, d)).$promise
    ]).then(function(resp) {
        $scope.totalAlarm = resp[0].ret || 0;
        $scope.totalAlarm_act = resp[1].ret || 0;
        $scope.initChart_alarm = true;
    });





    // 得到日 用量; 
    $scope.daliyStat = { daily_alarms: 0 ,  daily_emails: 0 ,  daily_sms: 0 , daily_wechats: 0};
    $source.$account.daliyStatistic(function(resp){ 
        
        var ret =  resp.ret ;  

        // 计算   alarm , emeail ..  使用百分比 ,  显示不同颜色;
        ret.alarm_color =  caclColor( ret.daily_alarms_limit , ret.daily_alarms  );
        ret.email_color =  caclColor( ret.daily_emails_limit ,  ret.daily_emails );
        ret.sms_color =  caclColor( ret.daily_sms_limit ,  ret.daily_sms );
        ret.wechat_color =  caclColor( ret.daily_wechats_limit ,  ret.daily_emails );

        $scope.daliyStat =  ret ;  

    });

    function caclColor( total , use ){
            var  percent =   use/total ;
        return   percent < 0.5 ? "success": ( percent < 0.8? 'warning':"danger" )    
    }

})

.controller("account_users", function($scope, $state, $source, $sys, $q, $modal, $modal) {

    //$scope.$moduleNav("用户pop", "_user");
    // $scope.$moduleNav("账户信息", $state);
    $scope.$moduleNav("用户", $state);



    // 分页 加载 users ;

    $state.current.text = "用户管理";


    $scope.page = {};
    // $scope.user = {};
    $scope.op = {};
    $scope.od = {
        groups: []
    };

    // var loadAllGroupsPromise = $source.$userGroup.query({
    //     currentPage: 1
    // }).$promise;



    $scope.loadPageData = function(pageNo) {



        var d = {
            currentPage: pageNo || 1,
            itemsPerPage: $sys.itemsPerPage,
            username: $scope.op.f_name
        };

        d.username && (d.username += /.\*$/.test(d.username) ? "" : "*");



        $scope.showMask = true;

        $source.$user.query(d, function(resp) {
                $scope.page = resp;
                $scope.page.currentPage = pageNo;
                $scope.showMask = false;
            },
            function() {
                $scope.showMask = false;
            }
        );
    };
    $scope.loadPageData(1);

    // 加载所有 角色 信息;


    // 更改user ;
    var S = $scope;

    console.log(1111111, $scope.user)


    $scope.updateUser = function(idObj) {
        return $source.$user.put({}, idObj).$promise;

    }

    $scope.createUser = function() {
        $modal.open({
            templateUrl: "athena/account/users_edit.html",
            controller: function($scope, $modalInstance) {
                $scope.__proto__ = S;
                $scope.$modalInstance = $modalInstance;
                $scope.user = {};
                $scope.isAdd = true;


                // 验证 user.username 是否已经存在;  // 创建者是否有 区域管理权限; 
                $scope.ccField = function() {
                    console.log(S.user);
                    // if( S.user.is_super_user ){
                    //     return ; 
                    // }

                    // $scope.user.username && $source.$user.get( 
                    //     { op:"getbyname" , name: $scope.user.username , account_id: S.user.account_id  } ,

                    //     function(resp){ 

                    //     }
                    // )
                }

                $scope.done = function() {

                    $scope.validForm();

                    $source.$user.save($scope.user, function(resp) {

                        $scope.user.id = resp.ret;
                        $scope.page.data.unshift($scope.user)
                        $scope.cancel();

                    }, function(resp) {
                        // 用户已存在, 或其他错误; 
                        // 用户存在 , 且有区域管理权限; 
                        $scope.cancel();
                        if (resp.err == "ER_USER_EXIST") {
                            depuName2addUser($scope);
                        }



                        // return ;
                        // if( resp.err =="ER_USER_EXIST"   ){  // 名字被占用; 

                        //     var exist_user = resp.ret ; 
                        //     var title = $scope.$translate.instant('ER_USER_EXIST');

                        //     if( S.user.is_super_user  ||
                        //      exist_user.is_super_user  ||
                        //       exist_user.id == S.user.id ){
                        //         angular.alert(   title   );
                        //         return ;
                        //     } 

                        //     // 有没有 区域管理权限;   
                        //     // &&  S.user.accountRol.privilege.indexOf( 'REGION_MANAGE') > 0   'REGION_MANAGE' S.user.accountRol.privilege
                        //     if( S.user.accountRol.privilege.indexOf( 'REGION_MANAGE') >= 0  ){
                        //         $scope.confirmInvoke( { title: title , note:  "是否将用户 " +  exist_user.username+ ' 加入您所管理的区域?' } , function( close ){

                        //             $source.$user.get( { op:"appendregionrole" , user_id: exist_user.id } , function(){
                        //                 close();
                        //                 $scope.cancel();

                        //                 // angular.alert("附加成功!") ;

                        //                 $scope.page.data.unshift( exist_user )

                        //             } ,  function(){
                        //                  close();
                        //                  $scope.cancel();
                        //             }) 
                        //         })
                        //         return ;
                        //     } 
                        // }; 

                    });
                }

            }
        })
    };

    // 名字被占用时  , 且 区域用户管理 时, 添加user ; 
    function depuName2addUser(scope) {

        var title = $scope.$translate.instant('ER_USER_EXIST'),
            username = scope.user.username,
            loadTheUser;

        if (S.user.is_super_user || username == S.user.username) {
            angular.alert(title);
            return;
        }

        $scope.confirmInvoke({ title: title, note: "是否将用户 " + username + '加入您所管理的区域?' },
            function(close) {

                // 返回 exist_user 对象; 
                $source.$user.get({ op: "appendregionrole", name: username }, function(resp) {
                    close();

                    // angular.alert("附加成功!") ;

                    $scope.page.data.unshift(resp.ret)

                }, function() {
                    close();
                })
            })


    }


    $scope.delUser = function(arr, u, i) {
        $scope.confirmInvoke({
            title: "删除用户:" + u.username,
            warn: "确认要删除该用户吗?"
        }, function(next) {
            $source.$user.delByPk({
                    pk: u.id
                },
                function(resp) {
                    arr.splice(i, 1);
                    next();
                },
                next
            );
        });
    };



    // 验证联系方式;
    //        jjw 添加参数temp，标记是phone还是email
    $scope.verifyUser = function(u, i, temp) {
        $modal.open({
            templateUrl: temp == 'phone' ? "athena/account/users_verify_phone.html" : "athena/account/users_verify_email.html",
            controller: function($scope, $modalInstance, $interval) {
                $scope.$modalInstance = $modalInstance;

                $scope.__proto__ = S;
                $scope.u = angular.copy(u);
                $scope.ver = {};

                var smsInterval, emailInterval;

                var text = "重新发送(%)";


                var cofText = {
                    "email": "发送验证邮件",
                    "phone": '发送验证码'
                };

                function setInter(btnDom, type) {
                    btnDom.disabled = true;
                    var times = 120;
                    smsInterval = $interval(function() {
                        $(btnDom).text(text.replace("%", times));
                        times--;
                        if (times < 0) {
                            btnDom.disabled = false;

                            $(btnDom).text(cofText[type || "phone"]);

                            $interval.cancel(smsInterval);
                        }
                    }, 1000)
                }



                $scope.sendEmail = function(e) {

                    if (!$scope.u.email) {
                        angular.alert("请输入邮箱!");
                        return;
                    }
                    setInter(e.currentTarget, "email");

                    var d = {
                        id: u.id,
                        email: $scope.u.email
                    };

                    $source.$user.save({
                        pk: "sendverifyemail"
                    }, d);

                }

                $scope.sendNote = function(e) {
                    if (!$scope.u.mobile_phone) {
                        angular.alert("请输入手机号");
                        return;
                    }

                    setInter(e.currentTarget, "phone");

                    $source.$note.get({
                            op: "user",
                            mobile_phone: $scope.u.mobile_phone
                        },
                        function() {

                        });

                }




                $scope.verifyPhone = function() {
                    if (!$scope.u.mobile_phone) {
                        angular.alert("请输入手机号");
                        return;
                    }
                    if (!$scope.ver.phone) {
                        angular.alert("请输入验证码");
                        return;
                    }

                    var d = {
                        id: u.id,
                        mobile_phone: $scope.u.mobile_phone,
                        verifi: $scope.ver.phone
                    };

                    $source.$user.save({
                        pk: "verifyphone"
                    }, d, function(resp) {
                        u.mobile_phone_verified = true;
                        $scope.cancel();

                        u.mobile_phone = $scope.u.mobile_phone;

                        $scope.user.mobile_phone_verified = true;
                    });


                }


            }
        })
    }

})

.controller("account_userdetail", function($scope, $source, $state, $stateParams,
    $modal, $sys, $translate, $interval, $localStorage, $sessionStorage, $q, $utils) {

    $scope.from = $utils.backState('account_userdetail');


    var thatScope = $scope;

    var user_id = $stateParams.id || $scope.user.id;


    // $scope.userself = $state.includes("app.my_detail"); 
    $scope.userself = !$stateParams.id;


    $scope.user = undefined;

    // 得 id 用户; 
    var loadUserPromise = $source.$user.get({
        pk: user_id
    }, function(resp) {
        $scope.user = resp.ret;
        $scope.user.sms_notice = !!$scope.user.sms_notice;
        $scope.user.mail_notice = !!$scope.user.mail_notice;
    }).$promise;

    // 得到 所有 角色;  
    var role_KV = {};

    var loadRolesPromise = $source.$role.get(function(resp) {

        $scope.roles = resp.ret || [];
        // $scope.roles.unshift( {  name:"-无-" , id:null ,  role_category: 0 } )

        angular.forEach($scope.roles, function(v, i) {
            role_KV[v.id] = v;
        })


    }).$promise;

    // 报警总开关; 
    // 接收 报警;  // type = "sms_notice" || "mail_notice"
    $scope.acceptAlarm = function acceptAlarm(type) {

        var d = {};
        d[type] = $scope.user[type] ? 1 : 0;
        $source.$user.save({
                op: "notice"
            }, d,
            function() {

            },
            function() {
                $scope.user[type] = !$scope.user[type]
            }
        )

    }

    // 报警区域开关; 
    // 编辑是否接收 某个 region 报警; 
    $scope.acceptRegionAlarm = function(rr) {

        var sub = {
            filter: {
                region_id: rr.region_id || rr.id,
                type: "alarm"
            },
            sendee: {
                user_id: user_id
            }
        };

        if (rr.acceptAlarm || rr.acceptAlarm == undefined) {
            // 创建 , 
            $source.$sub.save({}, sub, function(resp) {
                rr.sub_id = resp.ret;
                subScribKV[rr.id || rr.region_id] = true;

            }, function() {
                rr.acceptAlarm = !rr.acceptAlarm;  
            })

        } else {
            // 删除;  

            $source.$sub.delete({
                pk: rr.sub_id
            }, function() {
                subScribKV[rr.id || rr.region_id] = false;
            }, function() {
                rr.acceptAlarm = !rr.acceptAlarm;

            })

        }

    }


    // 得到用户的 账户权限; 
    $source.$user.get({
        pk: "getaccountrole",
        op: user_id
    }, function(resp) {

        //$scope.user.accountRoleId = req.ret.role_id ; 
        var id = resp.ret.role_id;

        $q.all([loadUserPromise, loadRolesPromise]).then(function() {
            id && $.each($scope.roles, function(i, v) {
                if (id == v.id) {
                    $scope.user.accountRol = { id: v.id }; //= v;
                    $scope.privilge2Text($scope.user.accountRol)
                    return false;
                }
                return true;
            })

        })
    })


    $scope.$watch("user.accountRol.id", function(n, o) {

        console.log("watch user.accountRol", n, o);
        $scope.user && ($scope.user._$oldAccountRole_id = o);

    });

    $scope.addAccountRole = function() {

        var n = $scope.user.accountRol.id,
            note = n ? "将用户" + $scope.user.username + " 的账户角色修改为 " + role_KV[n].name + "?" : "删除账户角色!";
        $scope.confirmInvoke({ title: "更改账户角色", note: note },
            function(next) {
                if (n) {
                    $source.$user.put({
                        pk: "addrole",
                        op: user_id,
                        isaccount: true
                    }, {
                        role_id: $scope.user.accountRol.id
                    }, function(resp) {
                        $scope.privilge2Text($scope.user.accountRol);
                        next();
                    }, function() {
                        $scope.user.accountRol.id = $scope.user._$oldAccountRole_id;
                        $scope.privilge2Text($scope.user.accountRol);

                        next();
                    })
                } else {
                    $source.$user.delete({
                        pk: "delrole",
                        op: user_id,
                        isaccount: true
                    }, null, function() {
                        $scope.privilge2Text($scope.user.accountRol)
                        next()
                    }, function() {
                        $scope.user.accountRol.id = $scope.user._$oldAccountRole_id;
                        $scope.privilge2Text($scope.user.accountRol)
                        next();
                    })
                }
            },
            function() {
                $scope.user.accountRol.id = $scope.user._$oldAccountRole_id;
                $scope.privilge2Text($scope.user.accountRol)
            }
        )
    }


    var textArr = [];
    $scope.privilge2Text = function(rr, scope) {

        // 超级管理员时;  rr 不是 role , 而是 区域 region ;  
        if (!$scope.user.is_super_user) {
            scope && scope.$watch('rr.role_id', function(n, o) {
                rr._$old_role_id = o;
            })

            console.log('privilge2Text', rr)

            textArr = [];
            if (rr.id) {
                role_KV[rr.id].privilege.forEach(function(v, i) {
                    textArr.push($translate.instant(v));
                })
            } else if (rr.privilege) {
                rr.privilege.forEach(function(v, i) {
                    textArr.push($translate.instant(v));
                })
            }

            rr.prText = textArr.join(" ; ");
        }
    }


    // 得到 所有 区域 权限;   /getpermissions/:user_id
    //  admin 用户 得到所有区域, 普通用户得:getPermisseion ; 

    var loadRegionPromise,
        loadPermissionPromise,
        loadAllRegionPromise,
        subItems,
        Allregions,
        subScribKV, //  删除 添加 报警 要维护 该对象;  
        obj_ref = {}; //  添加 删除 区域权限时 需要维护 该对象 ;  obj = region  || promisesion  ; 

    loadUserPromise.then(function() {
        // regionIdkey = !!$scope.user.is_super_user?"id":"region_id" ;

        $scope.page = {};
        // 超级管理员时,  不用加载区域角色 , 有所有权限 ; 
        if ($scope.user.is_super_user) {

            $scope.loadPageData = function(pageNo) {
                // 得到  分页 区域; 
                loadRegionPromise = $source.$region.query({
                    currentPage: pageNo,
                    itemsPerPage: 7
                }).$promise;

                loadRegionPromise.then(function(resp) {
                    $scope.page.total = resp.total;
                    $scope.page.data = resp.data;
                    $scope.page.currentPage = pageNo;

                    // $scope.userself &&  getIsSubAlarm($scope.page.data);
                    getIsSubAlarm($scope.page.data);

                })
            }

            $scope.loadPageData(1);
        } else {
            // 加载所有 区域;  

            // 得到  user_id 的  所有  promissions ;    promission 分页 就无法添加过滤; 
            // 还要 加载   subscript ; 
            $source.$user.get({
                pk: "getpermissions",
                op: user_id,
                // currentPage: pageNo ,
                // itemsPerPage: 5 
            }, function(resp) {
                // $scope.page.total = resp.total;
                $scope.page.data = resp.ret;
                // $scope.page.currentPage = pageNo;

                // 加载 所有的 订阅  subscritt ; 
                $scope.userself && getIsSubAlarm($scope.page.data)

                if ($scope.userself) {
                    getIsSubAlarm($scope.page.data)
                } else {
                    // obj_ref 用来 添加 region author 时过滤   region.id , promission.region_id ;
                    $scope.page.data.forEach(function(v, i) {
                        obj_ref[v.id || v.region_id] = v;
                    });
                }

            });
        }



        //  admin 用户时 , 根据 page.data   的  region_id 去查询 订阅 ; 回显 ;   
        // regionArray 中 带有region_id ; 

        // 第一次就 查询除了 所有订阅?   
        function getIsSubAlarm(objArray) {

            if (!objArray) {
                return;
            };

            // 单例查询; 所有订阅 ; 
            if (!subScribKV) {

                loadPermissionPromise = $source.$sub.get({
                    op: "select",
                    user: user_id,
                }, function(resp) {
                    subScribKV = {};
                    resp.ret.forEach(function(v, i) {
                        subScribKV[v.region_id] = v;
                    })
                }).$promise;

            };

            loadPermissionPromise.then(function() {
                // acceptAlarm 
                var x;
                objArray.forEach(function(v, i) {
                    x = subScribKV[v.id || v.region_id];
                    v.sub_id = x && x.id;
                    v.acceptAlarm = !!x;
                })

            })

        }


        $scope.addRegionAuthor = function() {
            $scope.showMask = true;
            $modal.open({
                templateUrl: "athena/account/author_region_add.html",
                size: "sm",
                resolve: {
                    regions: function() {
                        return $q(function(resolve, reject) {
                            loadAllRegionPromise = loadAllRegionPromise || $source.$region.query({
                                currentPage: 1
                            }).$promise;

                            loadAllRegionPromise.then(function(resp) {
                                // allregion = resp.data ;  
                                resolve(
                                    resp.data.filter(function(v, i) {
                                        console.log(obj_ref)
                                        return !obj_ref[v.id]
                                    })
                                );
                            })
                        });
                    }
                },
                controller: function($scope, $modalInstance, regions) {
                    $scope.__proto__ = thatScope;
                    $scope.$modalInstance = $modalInstance;
                    thatScope.showMask = false;


                    $scope.od = {
                        region: undefined,
                        role: undefined
                    };

                    $scope.filter_regions = regions;


                    $scope.done = function() {

                        $scope.validForm();

                        // 添加  region role 信息; 
                        // dev_id = tag.connect.replace(/(\d+).(\d+)/, "$1");
                        var region_id_name = $scope.od.region.split("&"),
                            region_id = region_id_name[0],
                            region_name = region_id_name[1];

                        // regionid_role_ref[region_id] = {
                        //     id: region_id,
                        //     name: region_name
                        // };

                        $source.$user.put({
                                pk: "addrole",
                                op: user_id,
                                // region_id: $scope.od.region.id
                                region_id: region_id
                            }, {
                                role_id: $scope.od.role.id
                            },
                            function(resp) {

                                // page.data  ,  obj_ref 内 添加数据 ; 
                                var d = {
                                    role_id: $scope.od.role.id,
                                    role_name: $scope.od.role.name,

                                    privilege: $scope.od.role.privilege,

                                    region_name: region_name,
                                    region_id: region_id
                                }

                                $scope.page.data.push(d);
                                obj_ref[region_id] = d; // obj = promission ;

                                $scope.cancel();

                            })
                    }
                }
            })

        }

    });



    // del region author ()
    $scope.delRegionAuthor = function(rr, $index) {

        $scope.confirmInvoke({
            title: "移除用户",
            note: "您确定将用户" + $scope.user.username + "从区域" + rr.region_name + "中移除?"

        }, function(next) {
            $source.$user.delete({
                pk: "delpermissions",
                op: user_id,
                region_id: rr.region_id
            }, function() {
                $scope.page.data.splice($index, 1);

                delete obj_ref[rr.region_id];
                next();
            })

        })

    }

    // 更改  user region 的 Role
    $scope.ccRegionRole = function(rr, scope) {
        // 在创建一次; 覆盖原先的; 
        console.log(scope);

        var note = "将用户" + $scope.user.username + " 在区域 " + (rr.region_name || rr.name) + " 的角色修改为" + role_KV[rr.role_id].name + "?";

        $scope.confirmInvoke({ title: "更改区域角色", note: note },
            function(next) {
                $source.$user.put({
                        pk: "addrole",
                        op: user_id,
                        region_id: rr.region_id
                    }, {
                        role_id: rr.role_id
                    },
                    function() {
                        rr.privilege = angular.copy(role_KV[rr.role_id].privilege);
                        $scope.privilge2Text(rr);
                        next();
                    }
                );
            },
            function() {
                console.log(rr)
                rr.role_id = rr._$old_role_id;
            }
        )

    }


    // editUser()
    $scope.editUser = function(u) {
        $modal.open({
            templateUrl: "athena/account/users_edit.html",
            controller: function($scope, $modalInstance) {
                $scope.__proto__ = thatScope;

                var  toupdate = false ;
                $scope.ccField = function(k, v) {
                    toupdate = true ; 
                    $scope.od[k] = v;
                }
                $scope.done = function() {
                    if(!toupdate){
                        $scope.cancel();
                        return ;
                    }

                    $scope.od.id = u.id;
                    $scope.updateUser($scope.od).then(function() {
                        angular.extend(u, $scope.user);
                        $scope.cancel();
                    })

                }

                $scope.$modalInstance = $modalInstance;
                $scope.user = angular.copy(u);
                $scope.op = {};
                $scope.od = {}; // 接受 changeuser 字段; 
            }
        })

    }

    $scope.updateUser = function(idObj) {
        return $source.$user.put(null, idObj).$promise;
    }


    // resetPassword ()
    $scope.reSetPW = function() {
        $modal.open({
            templateUrl: "athena/cc_password.html",
            // size:"sm",
            controller: function($scope, $modalInstance, $source) {
                $scope.op = {},
                    $scope.od = {},
                    $scope.__proto__ = thatScope,
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

    // sms , emial  xx秒后 重发;     
    $scope.ot = {};

    var t_ = 120;

    var text = "重新发送(%)";
    textCond = {
        smsInterval: "发送验证码",
        emailInterval: "发送验证邮件"
    };
    // 
    window.interval = window.interval || {
        smsInterval: undefined,
        emailInterval: undefined
    }
    $scope.interval = window.interval;

    window.intervalTimes = {
        smsInterval: $sessionStorage.smsInterval > 0 ? $sessionStorage.smsInterval : t_,
        emailInterval: $sessionStorage.emailInterval > 0 ? $sessionStorage.emailInterval : t_
    };

    //  type = smsInterval || emailInterval
    function startInterval(type) {

        window.interval[type] = window.interval[type] || $interval(function() {
            //@if append 
            console.log(type, window.intervalTimes[type], window.interval[type]);
            //@endif

            $("#" + type).text(text.replace("%", window.intervalTimes[type]));
            $sessionStorage[type] = --window.intervalTimes[type]

            if (window.intervalTimes[type] < 0) {
                window.intervalTimes[type] = t_;
                $interval.cancel(window.interval[type]);
                window.interval[type] = undefined;
                $("#" + type).text(textCond[type])
            }
        }, 1000);
    }

    $sessionStorage.smsInterval > 0 && startInterval("smsInterval");
    $sessionStorage.emailInterval > 0 && startInterval("emailInterval");



    $scope.validPhone = function() {
        $modal.open({
            templateUrl: "athena/account/users_verify_phone.html",
            controller: function($scope, $modalInstance) {
                $scope.$modalInstance = $modalInstance;
                $scope.__proto__ = thatScope;

                $scope.u = {
                    mobile_phone: $scope.user.mobile_phone || $sessionStorage["user_phone_" + user_id]
                };

                $scope.$watch('u.mobile_phone', function(u) {
                    $sessionStorage["user_phone_" + user_id] = u;
                })

                $scope.sendNote = function(e) {
                    if (!$scope.u.mobile_phone) {
                        angular.alert("请输入手机号");
                        return;
                    }
                    startInterval("smsInterval");
                    $source.$note.get({
                            op: "user",
                            mobile_phone: $scope.u.mobile_phone
                        },
                        function() {

                        });
                }

                // 去 验证  用户 手机;  userself ; 
                $scope.verifyPhone = function() {

                    $source.$user.save({
                        op: "verifyphone"
                    }, $scope.u, function() {

                        $scope.cancel();

                        angular.alert("验证成功!");
                        $scope.user.mobile_phone = $scope.u.mobile_phone;
                        $scope.user.mobile_phone_verified = 1;
                    })
                }
            }
        })
    }

    $scope.validEmail = function() {
        $modal.open({
            templateUrl: "athena/account/users_verify_email.html",
            controller: function($scope, $modalInstance) {
                $scope.$modalInstance = $modalInstance;
                $scope.__proto__ = thatScope;

                $scope.u = {
                    email: $scope.user.email || $sessionStorage["user_email_" + user_id],
                    num: undefined
                };

                $scope.$watch('u.email', function(e) {
                    $sessionStorage["user_email_" + user_id] = e;
                })

                var trueEmail;

                $scope.sendEmail = function(e) {

                    if (!$scope.u.email) {
                        angular.alert("请正确输入邮箱");
                        return;
                    }
                    startInterval("emailInterval");


                    $source.$user.save({
                            op: "sendverifyemail"
                        }, {
                            email: $scope.u.email
                        },
                        function() {
                            trueEmail = angular.copy($scope.u.email);

                        }
                    );
                }

                $scope.verifyEmail = function() {

                    $source.$user.save({ op: 'verifyuseremail' }, { num: $scope.u.num }, function(resp) {

                        $scope.cancel();

                        angular.alert("验证成功!");
                        $scope.user.email = trueEmail;
                        $scope.user.email_verified = 1;

                    })

                }

            }
        })
    }


    // 验证联系方式;
    //        jjw 添加参数temp，标记是phone还是email
    $scope.verifyUser = function(temp) {
        $modal.open({
            templateUrl: temp == 'phone' ? "athena/account/users_verify_phone.html" : "athena/account/users_verify_email.html",
            controller: function($scope, $modalInstance, $interval) {
                $scope.$modalInstance = $modalInstance;

                $scope.__proto__ = thatScope;

                $scope.u = angular.copy($scope.user);
                $scope.ver = {};

                var smsInterval, emailInterval;

                var text = "重新发送(%)";


                var cofText = {
                    "email": "发送验证邮件",
                    "phone": '发送验证码'
                };

                function setInter(btnDom, type) {
                    btnDom.disabled = true;
                    var times = 120;
                    smsInterval = $interval(function() {
                        $(btnDom).text(text.replace("%", times));
                        times--;
                        if (times < 0) {
                            btnDom.disabled = false;

                            $(btnDom).text(cofText[type || "phone"]);

                            $interval.cancel(smsInterval);
                        }
                    }, 1000)
                }



                $scope.sendEmail = function(e) {

                    if (!$scope.u.email) {
                        angular.alert("请输入邮箱!");
                        return;
                    }
                    setInter(e.currentTarget, "email");

                    var d = {
                        id: u.id,
                        email: $scope.u.email
                    };

                    $source.$user.save({
                        pk: "sendverifyemail"
                    }, d);

                }






                $scope.verifyPhone = function() {
                    if (!$scope.u.mobile_phone) {
                        angular.alert("请输入手机号");
                        return;
                    }
                    if (!$scope.ver.phone) {
                        angular.alert("请输入验证码");
                        return;
                    }

                    var d = {
                        id: u.id,
                        mobile_phone: $scope.u.mobile_phone,
                        verifi: $scope.ver.phone
                    };

                    $source.$user.save({
                        pk: "verifyphone"
                    }, d, function(resp) {
                        u.mobile_phone_verified = true;
                        $scope.cancel();

                        u.mobile_phone = $scope.u.mobile_phone;

                        $scope.user.mobile_phone_verified = true;
                    });


                }


            }
        })
    }

})

.controller('acco_role', function($scope, $state, $stateParams, $sys, $source, $modal) {

})

.controller('acco_author', function($scope, $state, $source, $q) {
    // 预先加载 所有组;
    $scope.$moduleNav("权限", $state);


    $scope.gp = $source.$userGroup.query({
        currentPage: 1
    }).$promise;

    // 预先加载所有 角色 ;
    $scope.rp = $source.$role.get().$promise;



    $q.all([$scope.gp, $scope.rp]).then(function(resp) {
        $scope.allgroups = resp[0].data;
        $scope.allroles = resp[1].ret;


    })

    // $scope.gp.then(function(resp) {
    //     $scope.allgroups = resp.data;
    // })

    // $scope.rp.then(function(resp) {
    //     $scope.allroles = resp.ret;
    // })

})

.controller("role_ctrl", function($scope, $state, $stateParams, $source, $sys, $modal, $q, $translate) {


    var thatScope = $scope;
    var role_category = $state.$current.data.role_category;

    $scope.promise = role_category == 1 ? $sys.regionP : $sys.accountP;

    var text_arr;
    $scope.toText = function(privileges) {
        text_arr = [];
        angular.forEach(privileges, function(k, v) {
            text_arr.push($translate.instant(k))
        })
        return text_arr.join("; ")

    }


    // type = 1 , region ;  =0 , account ;
    // add or update 
    $scope.addRole = function(role, index) {
        $modal.open({
            templateUrl: "athena/account/role_add.html",
            controller: function($scope, $modalInstance) {

                $scope.__proto__ = thatScope;
                $scope.$modalInstance = $modalInstance;


                if (role) {
                    var o = {};
                    $scope.r = angular.copy(role);

                    angular.forEach(role.privilege, function(k, v) {
                        o[k] = true;
                    })

                    $scope.r.authors = o;
                } else {
                    $scope.r = {
                        role_category: role_category,
                        authors: {}
                    }
                }


                $scope.done = function() {



                    $scope.validForm();

                    var r = angular.copy($scope.r);
                    r.privilege = [];

                    angular.forEach($scope.r.authors, function(v, i) {
                        v && (r.privilege.push(i))
                    });

                    if (!r.privilege.length) {
                        angular.alert("请选择权限!")
                        return;
                    }


                    delete r.authors;

                    if (role) {
                        $source.$role.put({
                            pk: r.id
                        }, r, function(resp) {
                            $scope.roles[index] = r;
                            $scope.cancel();
                        }, $scope.cancel)
                    } else {
                        $source.$role.save(
                            r,
                            function(resp) {
                                r.id = resp.ret;
                                thatScope.roles.unshift(r);

                                $scope.cancel();
                            },
                            $scope.cancel
                        )

                    }

                }
            }
        })
    }

    $scope.delRole = function(r, index) {
        $scope.confirmInvoke({
            title: '删除角色:' + r.name,
            note: "确认要删除该角色吗?"
        }, function(next) {

            $source.$role.delete({
                pk: r.id
            }, function(resp) {

                $scope.roles.splice(index, 1)

                next();
            }, next)
        })
    }



    var d = {
        role_category: role_category
    };
    $scope.loadPageData = function(pageNo) {
        d.currentPage = pageNo;
        $scope.showMask = true;

        $source.$role.get(d, function(resp) {
            // $scope.page = resp;
            // $scope.page.currentPage = pageNo;
            $scope.roles = resp.ret || [];
            $scope.showMask = false;

        }, function() {
            $scope.showMask = false;
        });
    }

    $scope.loadPageData(1);

})

.controller('account_weichat', function($scope, $sessionStorage, $source, $timeout, $localStorage) {

    console.log(" account_weichat", $scope.user);

    $scope.wei = {}; // weiChatNo , serverUrl  // 第一步; 

    $scope.op = { step: undefined };

    $scope.menu = ["查看区域" , "报警查询" , "系统信息查询"];
    $scope.data = {}; // 第二部; 

    $scope.showMask = true;

    // 注销 微信服务号; 
    $scope.unBindServer = function() {
        $source.$weChat.unBindServer(function() {
            angular.alert('注销成功!');
            $scope.wei = {};
            $scope.op.step = 0;
        })
    }

    // $scope.op.step = -1;
    // $scope.showMask = false ;
    // return;

    // 得到  weChatServer  信息;  
    $source.$weChat.getServerInfo(function(resp) {
        console.log(resp.ret);
        $scope.showMask = false;

        // resp.ret =  angular.fromJson( resp.ret );
        
       


        $scope.wei = JSON.parse(resp.ret || '{}');

        $scope.menu = $scope.wei.menu && $scope.wei.menu.split(",") ||  $scope.menu ;
 
        if (!!resp.ret && ( $scope.wei.status == 4  || $scope.wei.status == "True"  )  ) {
            $scope.op.step = -1;
        } else {
            $scope.op.step = 0 ;
        }


    }, function() {
        $scope.showMask = false;
    })

    // $scope.op.step  = $sessionStorage.weichat_step ; 

    // $scope.$watch('op.step' , function( n ){
    //     $sessionStorage.weichat_step = n ; 
    // });

    $scope.enbaleCopy = function() { // copy_url
        new Clipboard('#copy_url');
    }

    // wechat logo 图片; 
    var pictureFile;
    $scope.setFiles = function(ele) {

        console.log("file change ", ele);
        pictureFile = ele.files[0],

            setPicture(URL.createObjectURL(pictureFile));

    }

    function setPicture(data) {


        img = new Image(),

            url = img.src = data;

        img.height = 66,
            img.width = 296;

        var $img = $(img)
        img.onload = function() {
            URL.revokeObjectURL(url)
            $('#weichat_logo_preview').empty().append($img)
        }

    }



    // 第一步;
    // 输入 
    $scope.createUrl = function() {

        $scope.validForm('form1')

        //$scope.wei.serverUrl = 'gaefaefffffff'
        // 
        $source.$weChat.createUrl({ wechat_id: $scope.wei.wechat_id }, function(resp) {
            $scope.wei.server_url = resp.ret;
        })

    }


    // 验证 serverurl；
    var status = {
        0: "该账号微信服务器地址不存在",
        1: "该账号微信服务器地址已存在",
        2: "该账号微信服务器地址已通过微信验证", // 验证通过 , 
        4: "该账号微信服务器地址已通过微信验证，并且服务器已激活"
    };

    $scope.verifyUrl = function() {

        $source.$weChat.getServerStatus(function(resp) {

            if (resp.ret == 2) { // 4 该账号微信服务器地址已通过微信验证，并且服务器已激活
                $scope.op.verifySuccess = true;
                $timeout(function() {
                    $scope.op.step = 2;
                    // $timeout( function(){ 
                    $scope.wei.logo && setPicture($scope.wei.logo);
                    // } , 1000)     
                }, 1000)
            } else {
                $scope.op.verifyError = true;
                // $scope.op.weChatStatusMsg = status[resp.ret ] || "server 无返回数据" ;
            }

            // dele --!!!!! 
            // $timeout( function(){
            //     $scope.op.step = 2 ;  
            //     $scope.wei.logo  &&  setPicture( $scope.wei.logo ) ;     
            // },1000)


        })

    }


    // 第二步 提交;  // menu=1,2,3&logo=xxx&email=xxx&phoneno=xxx
    // 1: 上传图片,
    // 2: 调用 借口激活 server;
    // 1 
    $scope.setp2Commit = function() {

        if (!($scope.wei.logo || pictureFile)) {
            angular.alert("请设置微信LOGO图片")
            return;
        }


        $scope.validForm("step2");

        if (pictureFile) {

            var fd = new FormData();
            if ($scope.wei.logo) {
                // http://thinglinx-test.oss-cn-beijing.aliyuncs.com/10108/wechat/logo_fnmgh3
                var old_logo = $scope.wei.logo;
                old_logo = old_logo.subString(old_logo.lastIndexOf('/') + 1);
                // 删除老的 logo 图片;  
                fd.append("old_logo", old_logo)
            }
            // for (var i in $scope.files) {
            fd.append("wechat_picture", pictureFile);

            var xhr = new XMLHttpRequest();

            xhr.addEventListener("load", configWeiChat, false);

            //  xhr.addEventListener("error", uploadFailed, false) ;
            //  xhr.addEventListener("abort", uploadCanceled, false) ;

            xhr.open("POST", angular.rootUrl + "picture/wechat");
            xhr.setRequestHeader("Accept", 'application/json');

            xhr.send(fd);
        } else {
            configWei();
        }




    }

    //  2 微信图片上传完后,提交;
    function configWeiChat(evt) {
        var resp = JSON.parse(evt.target.response);
        if (resp.ret) {
            $scope.wei.logo = $scope.ossRoot + resp.ret;
            configWei();
        } else {
            alert('错误')
        }
    }

    function configWei() {
        $scope.wei.menu = $scope.menu.join(',');
        var accountname = $localStorage.account;
        if (!accountname) {
            alert("no account name !");
            return;
        }
        $source.$weChat.activeServer(angular.extend({ accountname: accountname }, $scope.wei), function(resp) {
            pictureFile = null;
            $scope.op.step = 3;
        })
    }

})