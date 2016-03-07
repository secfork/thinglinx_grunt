 


    angular.module('app.model.device', [])
        .controller("devmodel", function($scope, $compile, $state, $modal, $log, $http,
            $timeout, $source) {

            $scope.op = {
                f_n: ""
            };

            // $scope.status = {
            //     isFirstOpen: true,
            //     isFirstDisabled: false
            // };


            var tempScope = $scope;


            var $window = $(window);



            // 监视屏幕滚动;
            var _timeout, w_st, w_h, t_p, t_b, p_t, p_b,
                t_doms, $t_dom;

            $scope.$on("$destroy", function() {
                $window.off("scroll");
            })

            $window.scroll(function() {
                $timeout.cancel(_timeout);

                _timeout = $timeout(function() {
                    //@if  append

                    console.log("window scroll", _timeout);
                    console.log(w_st, w_h);
                    //@endif 

                    w_st = $(window).scrollTop();
                    w_h = $(window).innerHeight();

                    return;

                    // 判断 temp 滚动;  当 temp 超上限 判断是否展开;  若展开判断 point ;
                    t_doms = $("#temp_context .temp");


                    $.each(t_doms, function(i) {
                        $t_dom = $(this);
                        //@if  append

                        console.log($t_dom);
                        //@endif 
                        if ($dom.position().top < w_st) {
                            // 上超限 ;


                        }
                        if ($dom.position().top > (w_h + w_st)) {
                            // 下超限;

                        }
                    })

                    // 判断 point 滚动;

                }, 200);

            });

            // 加载 device model ;
            $scope.showMask = true;
            $source.$deviceModel.get(function(resp) {
                $scope.deviceModels = resp.ret;
                $scope.showMask = false;
            }, function() {
                $scope.showMask = false;
            });


            // 加载 device model  下 的 points ;
            $scope.loadPoints = function(scope, $event, index, devModel) {
                //@if  append

                console.log(arguments);
                //@endif 
                if (!scope.points) {
                    $source.$dmPoint.get({
                            device_model: devModel.uuid
                        },
                        function(resp) {
                            scope.points = resp.ret;
                        }
                    );
                }
            };

            // 添加 || 编辑  模版; 弹出框 ;=================================================
            $scope.add_edit_t = function(scope, t) { //  temp-scope , 或者; super-scope ;
                $modal.open({
                    templateUrl: 'athena/template/temp.html',
                    controller: function($scope, $modalInstance, $source, $filter) {
                        //@if  append

                        console.log("edit or new  temp ", t);
                        //@endif 
                        $scope.__proto__ = scope;
                        $scope.$modalInstance = $modalInstance;

                        $scope.isAdd = !t;

                        if (!t) { // 新建;
                            //$scope.drivers =
                            $source.$driver.get({
                                type: "device"
                            }, function(resp) {

                                $scope.drivers = $filter('filter')(resp.ret, {
                                    category: 'DEVICE'
                                });
                                $scope.T.driver_id = $scope.drivers[0].driver_id;
                            });
                        }



                        $scope.T = t ? angular.copy(t) : {};



                        // 编辑 新建 template ;
                        $scope.done = function(btn) {
                            $scope.validForm();

                            if (!t) {
                                // 新建;   
                                $source.$deviceModel.save($scope.T, function(resp) {

                                    $scope.T.uuid = resp.ret;
                                    $scope.deviceModels.push($scope.T);
                                    // $scope.page.total ++ ;
                                    $scope.cancel()
                                });
                            } else {
                                //更名;
                                $source.$deviceModel.put({
                                    uuid: t.uuid,
                                    name: $scope.T.name,
                                    desc: $scope.T.desc
                                }, function(resp) {
                                    t.name = $scope.T.name;
                                    t.desc = $scope.T.desc;
                                    $scope.cancel()
                                })
                            }
                        }
                    }
                });
            };


            // 上传模版;==================================================================================
            $scope.upload_t = function() {
                $modal.open({
                    templateUrl: 'athena/template/temp_upload.html',
                    controller: temp_upload,
                    size: "m", //size
                    resolve: {
                        $$scope: function() {
                            return $scope;
                        }
                    }
                });
            };






            // 导出模版;===============================================================================
            $scope.export_t = function(T) {
                $modal.open({
                    templateUrl: '../views/template/temp_export.html',
                    controller: temp_export,
                    size: "m", //size
                    resolve: {
                        $$scope: function() {
                            return $scope;
                        },
                        T: function() {
                            return T
                        }
                    }
                });
            };



            var temp_export = function($scope, $$scope, $modalInstance, T) {
                //@if  append

                console.log("export_t");
                //@endif 
                $scope.cancel = $$scope.closePopupWin($modalInstance);
                $scope.T = T;
            };


            // ============================= 用户删除 tempalte  group file ===========================
            // 删除 tempalte

            $scope.delTemp = function(index, obj) {

                var msg = {
                    title: "删除模版: " + obj.name,
                    warn: "确认要删除该设备模型吗?"
                };

                if (obj.ref)
                    msg.warn = "该模版被" + obj.ref + "个设备使用! 不可删除!";

                $scope.confirmInvoke(msg, function(next) {
                    if (obj.ref) return;
                    $source.$deviceModel.delete({
                        uuid: obj.uuid
                    }, function(resp) {

                        $scope.deviceModels.splice(index, 1);

                        next();
                    }, next)
                });
            };

            $scope.delPoint = function(scope, index, p, dm_uuid) {
                //@if  append

                console.log("delPoint", p);
                //@endif 
                $scope.confirmInvoke({
                    title: "删除点: " + p.name,
                    warn: "确认要删除该点吗?"
                }, function(next) {
                    $source.$dmPoint.delete({
                        id: p.id,
                        device_model: dm_uuid
                    }, function(resp) {
                        scope.points.splice(index, 1);
                        next();
                    }, next);
                })
            };


            //--------------
            //添加 point;

            $scope.addOrEditPoint = function(scope, p, index) {
                //@if  append

                console.log(" add_f or edit_f  ");
                //@endif 

                $modal.open({
                    templateUrl: 'athena/template/file.html',
                    controller: function($scope, $modalInstance, $sys) {

                        $scope.__proto__ = scope;
                        $scope.$modalInstance = $modalInstance;

                        $scope.point = {};
                        $scope.isAdd = !!p;

                        if (p) { //编辑; 
                            $scope.point = angular.copy(p);
                            $scope.point.params = angular.fromJson($scope.point.params);
                        } else {
                            var dm = scope.dm, // repeat 中的 属性;
                                driver = $sys.point[dm.driver_id];

                            var basic = $sys.point.entity;
                            // var  par =   driver.entity   ;     
                            var par = angular.copy(driver.entity);

                            $scope.point = angular.extend({},
                                basic,
                                par
                            );

                        };
                        //@if  append

                        console.log(p, $scope.point);
                        //@endif 

                        // $scope.g = {hex: "0001ffdf", show: "2", type: "2", mask: true};

                        $scope.done = function() {
                            $scope.validForm();
                            // 创建 ? || 编辑?
                            $scope.point.device_model = scope.dm.uuid;

                            if (p) {
                                // 编辑;
                                $source.$dmPoint.put($scope.point, function(resp) {

                                    $scope.points[index] = angular.copy($scope.point);
                                    $scope.cancel();

                                });
                            } else {
                                // 创建
                                $source.$dmPoint.save($scope.point, function(resp) {

                                    $scope.point.id = resp.ret;
                                    $scope.points.push($scope.point);
                                    $scope.cancel();

                                });
                            }
                            // $scope.cancel(); 
                        };
                    }
                });
            };
            $scope.clone_f = function(f_id) {
                //@if  append

                console.log(arguments)
                    //@endif 
            };

        });


 