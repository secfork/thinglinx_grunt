// dastation  配置  网关离线报警:开:  配置 form 的控制器   das_conf_gateway 写死在 模版上!!!
//       关:  设备, 日志, .... 网关配置; 的各个控制器 写死在 模版上;


// controller  分的太细了 ! 完全可以合并 部分 controller ;
 


    angular.module('app.system.prop', [])

    .controller("dastation_prop", function($scope, $state, $source, $stateParams, $interval,
        $sys, $sessionStorage, $utils, systemResp) {
        //@if  append

        console.log("dastation_prop");
        //@endif

        $scope.from = $state.current.from = $utils.backState('dastation_prop');



        // $stateParams.state =="unactive"  时  需要激活 station ;

        // 未激活的采集站 处理 ;
        // $scope.setActive = function() {
        //     $scope.activateStation($scope, null, $scope.station, null, "updata");
        // };
        // 改变 station 会自动存到 sessionStorage ; AppScope.$watch("$$cache", fun... ,  true)


        $scope.station = systemResp.ret;
        // $scope.Sta_Data = $scope.$$cache[1];  // ?????


        //??????????????
        // $scope.loadSystemData = function() {

        //     $source.$system.get({
        //         system_id: $scope.station.uuid
        //     }, function(resp) {

        //         $scope.Sta_Data = resp.ret.profile; 

        //     })
        // }

        // if ($scope.station) {
        //     $scope.loadSystemData();
        // }




        // 得到 region 信息; 
        if ($scope.station.region_id) {
            $source.$region.get({
                pk: $scope.station.region_id
            }, function(resp) {
                $scope.station.region_name = resp.ret.name;
            })
        }




        // 加载是否在线;  
        function getState() {
            $source.$system.status([$scope.station.uuid], function(resp) {
                var state = resp.ret[0];
                $scope.station.online = state && (state.daserver ? state.daserver.logon : state.online);
            })
        }
        getState();

        // 每分钟更新次 在线状态; 
        var state_interval;
        state_interval = $interval(getState, $sys.state_inter_time);

        $scope.$on("$destroy", function() {
            $interval.cancel(state_interval);
        })





        // 得到systemModel 数据 ; 便于配置 gateway , network ;

        $scope.l_m_P = $source.$sysModel.getByPk({
            pk: $scope.station.model
        }).$promise;

        $scope.l_m_P.then(function(resp) {
            // sysmodel ;
            $scope.sysmodel = resp.ret;

            // 转换 sysmodel Device = [{}], 为 k-v(name) 形式; 便于 回显;
            $scope.deviceKV = {};

            $scope.sysmodel.devices.forEach(function(v, i, t) {
                this[v.id] = v.name;
            }, $scope.deviceKV);
        });



        // // ticket ;
        // $scope.t = {
        //     sn: undefined,
        //     ticket: undefined
        // };

        // 获得文件路径;
        $scope.op = {
            rightfile: true
        };

        $scope.setFiles = function(element) {
            $scope.canupload = true;
            $scope.$apply(function($scope) {
                //@if  append

                console.log(element.files);



                //@endif
                // Turn the FileList object into an Array   form 中家 multiple  就是多文件上传;
                $scope.files = [];

                var file = element.files[0]; 

              
 
                // 值上传 第一个; 单位 B ;  // 1G
                // $scope.rightfile = (element.files[0].size < 10240000);
                //   /.[png,jpg]$/.test( file.name ) &&
                $scope.op.rightfile = (file.size < 1024 * 500); //500k ;



                // $scope.showmsg = !$scope.rightfile;
                if ($scope.op.rightfile) {
                    $scope.files.push(element.files[0]) //  文件路径;
                }
            });
        };


        $scope.uploadFile = function() {


              if( ! /^image/.test( $scope.files[0].type )  ){
                    angular.alert( "请选择jpeg,png,jpg格式的图片文件!");
                    return ; 
                }


            $scope.progress = 1;




            var fd = new FormData();
            // for (var i in $scope.files) {
            fd.append("sys_picture", $scope.files[0]);
            fd.append("old_pic_url_", $scope.station.pic_url);
            // } ;
            // 添加参数;
            // fd.append("filename", $scope.files[0].name );
            fd.append("system_id", $scope.station.uuid);

            var xhr = new XMLHttpRequest();


            xhr.upload.addEventListener("progress", uploadProgress, false);
            xhr.addEventListener("load", uploadComplete, false);

            //  xhr.addEventListener("error", uploadFailed, false) ;
            //  xhr.addEventListener("abort", uploadCanceled, false) ;

            xhr.open("POST", angular.rootUrl + "picture/system");
            xhr.setRequestHeader("Accept", 'application/json');

            $scope.progressVisible = true;
            xhr.send(fd);
        };


        // 上传完成;  刷新 fileregion 视图;
        function uploadComplete(evt) {
            try {
                $scope.$apply(function() {
                    $scope.progressVisible = false;
                    $scope.station.pic_url = angular.fromJson(evt.target.response).ret;
                    // 清空  file input ; 
                    console.log("  empty file  input!! 一般情况下，不允许通过脚本来对文件上传框赋值 "); 
                })


            } catch (e) {}
        }

        // 进程条滚动;
        function uploadProgress(evt) {
            $scope.$apply(function() {
                if (evt.lengthComputable) {
                    $scope.progress = Math.round(evt.loaded * 100 / evt.total)
                } else {
                    $scope.progress = 'unable to compute'
                }
            })
        }

        var temp_upload = function($scope, $$scope, $modalInstance) {

            $scope.file = {};
            $scope.progress = 1;
            $scope.showmsg = false;

        };


        //  var map = new BMap.Map("l-map");
        // map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
        // // 创建地理编码实例
        if ($scope.station.latitude && BMap) {

            var myGeo = new BMap.Geocoder();
            // // 根据坐标得到地址描述
            myGeo.getLocation(new BMap.Point($scope.station.longitude, $scope.station.latitude), function(result) {
                if (result) {
                    console.log(result);
                    $scope.$apply(function() {
                        $scope.station.map_address = result.address;
                    })
                }
            });

        }

    })

    .controller("das_basic", function($scope, $filter, $state, $stateParams) {
        //@if  append

        console.log(" das_basic ");
        console.log($stateParams, $state); // $stateParams.dastationid
        //@endif

    })


    .controller("das_config",
        function($scope, $state, $stateParams, $source, $modal, $filter) {
            //@if  append

            console.log("das_config");
            console.log($stateParams);
            //@endif

            // // ticket ;
            $scope.t = {};

            var S = $scope,
                needUpdate, hasSave;

            S.needUpdate = needUpdate = {},
                S.hasSave = hasSave = {};


            // 生成 ticket ; //createTicket
            $scope.createTicket = function() {

                if (!$scope.t.sn) {
                    angular.alert("请输入SN号");
                    return;
                }

                // 先 写死 ticket 的 选前;
                $scope.t.privilege = ['SYSTEM_MANAGE', 'SYSTEM_CONTROL'];

                $source.$ticket.save({
                        system_id: $scope.station.uuid
                    },
                    $scope.t,
                    function(resp) {
                        // $scope.ticket = { sn: $scope.t.sn , ticket: resp.ret };
                        $scope.t.ticket = resp.ret;
                    }
                )
            }

            // 删除ticket ;
            $scope.unBindTicket = function() {

                $source.$ticket.delete({
                    system_id: $scope.station.uuid
                }, undefined, function(resp) {
                    $scope.t.ticket = undefined;
                    $scope.t.sn = undefined;
                })
            }


            //  就 托管的 daServer 不用  box ticket
            // <div ng-if=" !(sysmodel.mode ==1  && sysmodel.comm_type ==1 ) ">

            $scope.l_m_P.then(function(resp) {
                var model = resp.ret;
                $scope.nT = !(model.mode == 1 && model.comm_type == 1);

                if ($scope.nT) {
                    $source.$ticket.get({
                            system_id: $scope.station.uuid
                        },
                        function(resp) {
                            //$scope.$parent.t = resp.ret;
                            $scope.t = resp.ret || {};

                        },
                        function() { // 无 ticket 时;
                            $scope.t = {};
                        }
                    );
                }
            })


            // 控制 编辑按钮 显隐 ;
            function toUpdate(field) {
                needUpdate[field] = true;
                hasSave[field] = false;

            }

            function toSave(field) {
                needUpdate[field] = false;
                hasSave[field] = true;
            }

            $scope.toUpdate = toUpdate;
            $scope.toSave = toSave;
            //------

            $scope.$popNav($scope.station.name + "(配置)", $state);

            // var  network , gateway ;

            try {
                $scope.network = angular.fromJson($scope.station.network || {});
            } catch (e) {
                console.error(" system . network 字段 不是 json 格式", $scope.station.network);
            }

            try {
                $scope.gateway = angular.fromJson($scope.station.gateway || {});
            } catch (e) {
                console.error(" system . gateway  字段 不是 json 格式", $scope.station.gateway);
            }



            //========================================================================================
            // ================ 托管 -- Daserver类型;  , Dtu| tcpclient | ctpServer  模式 :
            //                                                    netwrok.dssever  ===================
            //   system.network.daserver  = {  network:{} ,daserver_id : 1024 }
            //========================================================================================


            // 托管 Daserver 类型; Dtu模式;

            $scope.initDaServer = function() {
                $scope.daserver = angular.copy(S.network.daserver || (S.network.daserver = {}));

                // 加载  assign 的   dtu server  信息;
                $scope.l_m_P.then(function() { // 还要是激活的;
                    if (
                        $scope.sysmodel.mode == 1 // 托管;
                        && $scope.sysmodel.comm_type == 1 // dtu ;
                        && $scope.daserver.params // 指定了daserver ;
                        && $scope.station.state // 激活的;
                    ) {
                        var d = {
                            options: "getassign",
                            proj_id: $scope.station.uuid
                        };
                        $source.$system.getDtuServer(d, function(resp) {
                            $scope.cmway_port = resp.ret;
                        })
                    }
                })
            }

            // 加载支持的 dtu 驱动;
            $scope.loadSupportDtus = function() {
                if ($scope.dutList) return;
                $source.$driver.get({
                    type: "dtu"
                }, function(resp) {

                    $scope.dtuList =  resp.ret ;
                    // $filter("filter")(resp.ret, {
                    //     category: "CHANNEL"
                    // });

                });
            }

            // 托管 -- DaSErver类型 --Dtu 模式;  ;
            //  dtu驱动ng-change时 ;  dut_name  字段待定; v.name 待定;
            $scope.applyDtuData = function(params) { // params  =
                //@if  append

                console.log("--组装 DAServer ,  dtu network --");
                //@endif

                params.port = undefined;
                params.cmway = undefined;
                $.each($scope.dtuList, function(i, v) {
                    if (v.driver_id == params.driverid) {
                        //@if  append

                        console.log(" dtu 数据", i, v);
                        //@endif
                        params.port = v.port;
                        params.cmway = v.cmway;
                        toUpdate('daserver'); //
                        return false;
                    }
                })
            }







            //========================================================================================
            //======================================  profile =======================================
            //========================================================================================
            // 托管 | 非托管;  profile 更换操作
            // ; op 在 操作 system 的 profile 更改;


            $source.$sysProfile.get({
                system_model: $scope.station.model
            }, function(resp) {
                $scope.profiles = resp.ret;
                var p_uuid = $scope.station.profile;
                $.each($scope.profiles, function(i, v, t) {
                    if (v.uuid == p_uuid) {
                        $scope.profile = v;
                    }
                })
            })



            //========================================================================================
            //====================================== Gateway 模式 :   system.network.devices ================
            //========================================================================================
            // 托管 , gateway 类型; 初始化 network 下的devices ;
            $scope.initGatewayDevs = function() {
                var b = S.network.devices || (S.network.devices = []);
                $scope.gatewayDevs = angular.copy(b)
            }

            // 便于过滤 devs ;
            $scope.devRef = {};

            // 托管-- Gatwway类型 ;
            // 删除 gatewway dev , 删除 devRef 引用  ;
            $scope.delete_dev = function(gateway_devs, idnex, dev) {
                $scope.confirmInvoke({
                    title: "删除设备网络配置:" + $scope.deviceKV[dev.id],
                    note: " 确认要删除该设备的网络配置吗?"
                }, function(next) {
                    gateway_devs.splice(idnex, 1);
                    delete $scope.devRef[dev.id];
                    // gateway Network 字段 更新;
                    // update_+   $scope.gateweayDevs ;不要乱起名;
                    toUpdate("gatewayDevs");
                    next();
                });
            }

            // 托管  -- gatwway类型;
            // 添加|编辑  gateway类型的  network.device;  属性;
            // 添加  devfef 引用; 在 ng-repeat 中自动添加了;

            $scope.c_u_dev = function(gateway_devs, index, dev) {
                $modal.open({
                    templateUrl: "athena/dastation/add_gateway_device.html",
                    controller: function($scope, $modalInstance) {
                        $scope.__proto__ = S,
                            $scope.$modalInstance = $modalInstance,
                            $scope.isAdd = !dev,
                            $scope.dev = angular.copy(dev || {});

                        $scope.op = {};

                        $scope.done = function() {
                            $scope.validForm();
                            if ($scope.isAdd) {
                                gateway_devs.push($scope.dev);

                            } else {
                                gateway_devs[index] = $scope.dev;
                            }
                            // gateway Network 字段 更新;
                            toUpdate("gatewayDevs");
                            $scope.cancel();
                        }


                        // _$devs ;
                        $scope.filterDev = function() {
                            //@if  append

                            console.log("filte dev");
                            //@endif
                            var arr = S.sysmodel.devices.filter(function(v, i, t) {
                                return !$scope.devRef[v.id];
                            })

                            // $scope._$devs = arr ;
                            $scope.dev.id = arr[0] && arr[0].id;
                            $scope._$devs = arr;
                        }

                        // _$channel ;
                        // bool 来判断是否 刷新 parmas ;
                        $scope.filterChannel = function(bool) {
                            var obj = {},
                                w = $scope.dev.type,
                                c;

                            if (w == 'ETHERNET') {
                                obj = {
                                    LAN_1: null,
                                    WLAN_1: null
                                };
                            } else {
                                angular.forEach(S.sysmodel.gateway_default, function(v, i, t) {
                                    w == i && (obj = v);
                                })
                            }
                            bool && ($scope.dev.params = {
                                channel: Object.keys(obj)[0]
                            });
                            $scope._$channel = obj;
                        }
                    }
                })
            }



            //========================================================================================
            //====================================== Gateway 模式  :  system.gateway   ;  ====================
            //========================================================================================
            // sysmodel 下默认的 gateway_default ;


            // 托管 -- gateway 类型;
            // 添加 | 编辑   gateway 类型的  gatwway 字段属性;

            $scope.c_u_way = function(T, t, way) {
                $modal.open({
                    templateUrl: "athena/dastation/_prop_gateway_addgateway.html",
                    controller: function($scope, $modalInstance) {

                        $scope.__proto__ = S,
                            $scope.$modalInstance = $modalInstance,
                            $scope.isAdd = !way;

                        var x = (way && way.dns && way.gateway) ? ('WLAN') : ('LAN');

                        $scope.op = {
                            T: T || 'ETHERNET',
                            t: t,
                            x: x,
                            way: angular.copy(way || {})
                        };

                        // 我去 ng-change 还不好使了;
                        // $scope.$watch('op.T' , function( n, o ){
                        //     $scope.way = {} ;
                        //     op.t = undefined ;
                        // })

                        $scope.done = function() {
                            $scope.validForm();
                            // 添加||编辑;
                            var op = $scope.op;
                            $scope.isAdd && (op.way.enable = false);

                            if (!$scope.isAdd) {
                                delete $scope.gateway[op.T][t];
                            }

                            ($scope.gateway[op.T] || ($scope.gateway[op.T] = {}))[op.t] = $scope.op.way;

                            toUpdate('gateway');

                            $scope.cancel();

                        }
                    }
                })
            }

            // 托管 -- gateway 类型;
            // 删除  gateway类型 中的 数据;
            $scope.del_way = function(T, t, way) {
                $scope.confirmInvoke({
                    title: " 删除网关: " + t,
                    note: "确认要删除该网关吗?"
                }, function(next) {
                    delete $scope.gateway[T][t]
                    toUpdate('gateway');
                    next();
                })
            }



            // c_u_dev

            //======================================================================
            //================================   保存 配置 ======================================
            //======================================================================

            // 更新 system :
            //                daserver模式 - nentwork  .  daserver ; (  $scope.daserver    )
            //                geteway模式 -  network   .  devices  ; (  $scope.gatewayDevs )
            //                gateway模式 -  gateway              ; ( $scope.gateway )
            //                 profile , ($scope.op.profile )
            // 字段;
            $scope.updateSystem = function(field, scope) {


                var d = {
                    uuid: $scope.station.uuid
                };

                function update(d) {
                    return $source.$system.put(d).$promise;
                }

                if (field == 'gatewayDevs') {
                    $scope.validForm();
                    d.network = angular.toJson({
                        devices: $scope.gatewayDevs
                    });
                    update(d).then(function(resp) {
                        toSave("gatewayDevs");
                        $scope.station.network = d.network;
                    });
                }

                if (field == 'daserver') {
                    // 此处 validForm 不好使;  故增加了个 scope 参数;
                    $scope.validForm("form_daserver", scope);


                    // 未激活的话 提示激活;
                    if ($scope.station.state == 0) {
                        $scope.confirmInvoke({
                            title: "激活系统",
                            note: "该系统处于未激活状态,确认要激活该系统吗?"
                        }, function(next) {
                            // 激活系统;
                            $source.$system.active({
                                    pk: $scope.station.uuid
                                },
                                function(resp) {
                                    $scope.station.state = 1;
                                    next();
                                    //assgin  系统;
                                    assignSystem().then(function() {
                                        // 保存网络参数;
                                        saveDaServer().then(next);
                                    })
                                },
                                next
                            )

                        })
                    } else if ($scope.station.state == 1 && (!$scope.cmway_port)) {
                        // 激活的话 , 但是没有指定 daserver( 没assign过的) ;
                        assignSystem().then(function() {
                            // 保存网络参数;
                            saveDaServer();
                        })
                    } else {
                        // 激活 的 , 并且指定了 daserver ; (assign过的)
                        saveDaServer();
                    }


                    // 激活 , 指定 dtu system 的daserver ;
                    function assignSystem() {
                        var d = {
                            pk: $scope.station.uuid,
                            driver_id: $scope.daserver.params.driverid
                        };
                        var b = $source.$system.assign(d).$promise;
                        b.then(function(resp) {
                            $scope.cmway_port = resp.ret; // 数据中心 , 端口数据 ;
                        })
                        return b;
                    }

                    // 为激活的system , 保存 systen 的 network 参数;
                    function saveDaServer() { // resp
                        d.network = angular.toJson({
                            daserver: $scope.daserver
                        });
                        return update(d).then(function(resp) {
                            toSave("daserver");
                            $scope.station.network = d.network;
                        })
                    }
                }

                if (field == 'gateway') {
                    $scope.validForm("form_gateway");
                    d.gateway = angular.toJson($scope.gateway);
                    update(d).then(function() {
                        toSave("gateway");
                        $scope.station.gateway = d.gateway;
                    })
                }

                if (field == 'profile') {
                    d.profile = $scope.profile.uuid;
                    update(d).then(function() {
                        toSave("profile");
                        $scope.station.profile = d.profile;
                    }).then(function() {
                        //  重新 获取下  sys_data ;
                        //$scope.loadSystemData(); //???
                    })
                }

            }


            //=============================================================================================
            //=============================================================================================
            //=============================================================================================

            $scope.d_stop = function() {
                $source.$system.stop({
                    pk: $scope.station.uuid
                }, function(resp) {
                    angular.alert(angular.toJson(resp));
                });
            }


        }
    )


    .controller('das_tag', function($scope, $source, $state, $q) {

        var station = $scope.station;

        $scope.$popNav($scope.station.name + "(变量)", $state);



        $scope.getDevName = function(tag, scope) {
            var d_id = tag.connect.replace(/(\d+).(\d+)/, "$1");
            scope.dev_name = $scope.deviceKV[d_id]
            tag.type = scope.dev_name ? tag.type : null;
        }

        if (station.profile) {

            var loadProfileTagPromise = $source.$sysLogTag.get({
                profile: station.profile
            }).$promise;


            $q.all([loadProfileTagPromise, $scope.l_m_P]).then(function(resp) {

                $scope.systags = resp[0].ret;

            })


        } else {
            // query ;
            $source.$sysTag.get({
                system_model: station.model
            }, function(argument) {
                $scope.systags = argument.ret;
            })
        }

    })

    .controller('das_trigger', function($scope, $source, $state, $sys, $utils) {

        var station = $scope.station;
        $scope.$popNav($scope.station.name + "(触发器)", $state);

        $scope.page = {};

        var d = {
            itemsPerPage: $sys.itemsPerPage,
            profile: station.profile
        };

        $scope.loadPageData = function(pageNo) {
            d.currentPage = pageNo,
                $source.$sysProfTrigger.get(d, function(resp) {
                    //$scope.triggers = resp.ret;
                    $scope.page.currentTarget = pageNo;
                    $scope.page.data = resp.data;
                    $scope.page.total = resp.total;
                })
        }

        // 显示 触发器的 condition ;
        $scope.conditions = $utils.triggerConditions;

        $scope.loadPageData(1);

    })

    .controller('das_message', function($scope, $source, $state) {

        var station = $scope.station;
        $scope.$popNav($scope.station.name + "(通知)", $state);


        station.profile && $source.$message.get({
            profile_id: station.profile
        }, function(resp) {
            $scope.messages = resp.ret;
        })

    })

    .controller('das_contact', function($scope, $source, $state, $http, $interval,
        $timeout, $sessionStorage) {



        // 加载 system 的 contact ;
        // pk ~=   system_uuid ;
        $scope.$popNav($scope.station.name + "(联系人)", $state);


        $scope.op = {
            second: parseInt($sessionStorage.connect_wate) || 0
        };

        var interval, timeout;

        function wait_interval() {
            interval = $interval(function() {
                $sessionStorage.connect_wate = --$scope.op.second;
                if ($scope.op.second <= 0) {
                    $interval.cancel(interval);
                    $scope.op.send = false;
                }
            }, 1000);

        }

        function remove_interval() {

        }

        if ($scope.op.second) {
            $scope.op.send = true;
            wait_interval();
        }


        // 获取 短信验证码;
        $scope.sendVer = function() {
            $source.$note.get({
                op: "connect",
                mobile_phone: $scope.C.mobile_phone
            }, function(resp) {
                $scope.op.second = 120;
                $scope.op.send = true;
                wait_interval();

            })
        }


        //验证 短信吗;   ui-validate 当前版本不支持 异步验证;
        $scope.validVer = function(code) {
            return true;
            $timeout.cancel(timeout);

            timeout = $timeout(function() {

            }, 1000);

            return;

            $source.$note.get({
                op: "verify_connect"
            }, function(resp) {

            })
        }



        $source.$contact.get({
            pk: $scope.station.uuid
        }).$promise.then(function(resp) {

            $scope.isAdd = !resp.ret;

            $scope.C = resp.ret || {};
            // $scope.C.mail_notice = $scope.C.mail_notice + '' ||'0';
            // $scope.C.sms_notice = $scope.C.sms_notice + ''||'0';




            // 更新 system 的 contact ;
            $scope.commit = function() {
                $scope.validForm();
                ($scope.isAdd ? createContact : updateContact)();
            }

            // 更新联系人;
            function updateContact() {

                $source.$contact.put({
                    pk: $scope.station.uuid
                }, $scope.C, function(resp) {
                    angular.alert("修改成功!");
                })
            }
            // 创建联系人;
            function createContact() {
                $scope.C.system_id = $scope.station.uuid;
                $source.$contact.save({
                    pk: $scope.station.uuid
                }, $scope.C, function(resp) {

                    $scope.C.contact_id = resp.ret || $scope.C.contact_id;
                    $scope.isAdd = false;
                    angular.alert('添加成功!');

                })
            }

        });

    })

    .controller("das_map", function($scope, $state, $stateParams, $map, $localStorage,
        $timeout, $document, $window, $source, $http, $templateCache, $compile) {


        var map, marker, mapContextMenu;


        $scope.pos = {};
        $scope.msg = {};
        $scope.op = {};


        // 点击 标记位置; 
        var marker, infoWindow;
        $scope.createMap = function() {

            map = $map.createMap($scope, 'station_map', 280, "markers");

            $map.addSearch(map, "suggestId", "searchResultPanel");


            // 有定位时 ,  markLocation 无用; 
            if ($scope.station.latitude) {
                marker = $map.mapMarker($scope.station.latitude, $scope.station.longitude, $scope.station.name)
                map.addOverlay(marker);
                map.centerAndZoom(marker.point, 12);
                openWinInfo();
            }

            // 无定位时 , ; 

            return;

        }


        $scope.markLocation = function() {

            if (marker) return;

            marker = $map.mapMarker(0, 0, $scope.station.name);
            marker.enableDragging();

            map.addOverlay(marker);

            $scope.op.toNewLocation = true;

            map.addEventListener('mousemove', moveMarker);
            map.addEventListener('click', toLocationSystem)

        }

        // 移动定位把;
        function moveMarker(e) {
            marker && marker.setPosition(e.point)
        }


        // 初始定位,松开移动 , 坐落 定位把 位置; 
        function toLocationSystem() {

            openWinInfo();

            map.removeEventListener("mousemove", moveMarker);
            map.removeEventListener("click", toLocationSystem);

        }

        function openWinInfo() {
            if (!infoWindow) {
                $http({
                    url: "athena/dastation/prop_map_location.html",
                    cache: $templateCache
                }).success(function(html) {
                    infoWindow = new BMap.InfoWindow($compile(html.replace(/(\n)+|(\r)+/g, ""))($scope).get(0), {
                        enableCloseOnClick: false,
                        enableAutoPan: false
                    });

                    marker.addEventListener("click", function() {
                        marker.openInfoWindow(infoWindow, marker.point)
                    });
                    marker.addEventListener("mouseup", openWinInfo);

                    marker.openInfoWindow(infoWindow, marker.point)

                })

            } else {
                marker.openInfoWindow(infoWindow, marker.point)
            }


            $map.getLocation(marker.point, function(result) {
                $scope.$apply(function() {
                    angular.extend($scope.msg, marker.point, {
                        address: result.address
                    })
                })
            });

            // marker.openInfoWindow( infoWindow , marker.point)
        }


        // 确定位置; 
        $scope.locatedSation = function() {

            var d = {
                uuid: $scope.station.uuid,
                longitude: marker.point.lng,
                latitude: marker.point.lat
            };

            $source.$system.put(d, function(resp) {
                marker.disableDragging();
                $scope.op.toNewLocation = false;
                angular.extend($scope.station, d);
                // angular.alert("定位成功!")

            });

        }

        // 移动 ; 使 定位把 可移动 ; 
        $scope.letMarkerMove = function() {
            marker.enableDragging();
            $scope.op.toNewLocation = true;
            map.removeEventListener("mousemove", moveMarker);
            map.removeEventListener("click", toLocationSystem);
        }


        //  删除marker ,若station有坐标也删除 staation定位; 
        $scope.delMarker = function() {

            if (!marker) return;

            marker.removeEventListener('click');
            marker.removeEventListener('mouseup', openWinInfo);

            marker = null;
            infoWindow = null;

            if ($scope.station.latitude) {
                var d = {
                    uuid: $scope.station.uuid,
                    longitude: "",
                    latitude: ""   //  0 0 坐标既是 删除 坐标位置, 易出 bug ; 
                };
                $source.$system.put(d, function() {
                    $scope.station.longitude = 0;
                    $scope.station.latitude = 0;
                    map.clearOverlays();
                    // angular.alert("成功移除定位!");

                })
            } else {
                map.clearOverlays();
            }
        }

    }) 