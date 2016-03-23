// 激活的采集器  控制器;

// 激活  未激活 公用控制器
 

    angular.module('app.system', [])


    .controller("dastation_ignore_active", function($scope, $state, $stateParams, $source,
        $modal, $q, $map, $sys, $timeout, $interval, $utils, $http, $templateCache, $templateRequest,
        $filter, $interpolate) {

        //是否为 show 模块;
        $scope.isShowModul = $state.$current.data && $state.$current.data.isShowModul;

        $state.current.text = ($scope.project && $scope.project.name) || ($scope.isShowModul ? '系统' : '系统管理');

        $scope.from = $utils.backState("dastation_ignore_active");


        //@if  append
        console.log("dastation_ignore_active   $stateParams = ", $stateParams, $state)
            //@endif 




        var thatScope = $scope;

        var region_id = $stateParams.id;




        $scope._$projState = $scope.isShowModul ? 'app.s_region_system' : 'app.m_region_prop.system';
        $scope._$mapState = $scope.isShowModul ? 'app.s_system_prop.map' : 'app.m_system_prop._map';
        $scope._$stationState = $scope.isShowModul ? "app.s_system_prop.basic" : "app.m_system_prop._basic";

        $scope._$showRegionTH = $state.includes('app.m_system') || $state.includes('app.s_system');


        $scope.active2del = true;

        if ($scope.isShowModul) {
            $scope.$moduleNav("系统", $state);
        } else {
            $scope.$moduleNav($stateParams.isactive == '1' ? "已激活系统" : "未激活系统", $state);
        }


        $scope.updataORdel = "del";

        $scope.op = { lm:"list"};

        $scope.od = {
            state: $scope.isShowModul ? 1 : undefined,
            region_id: region_id
        };
        $scope.page = {};

        // 加载 system , 然后 , 加载 region信息, 同步信息, 在线信息; 
        var loadRegionPromise = $source.$region.get({
                currentPage: 1
            }).$promise,
            loadSysModelPromise = $source.$sysModel.get({
                currentPage: 1
            }).$promise;

        $scope.rg_k_v = {};

        var analyzeRegionPromise = loadRegionPromise.then(function(resp) {
            $scope.regions = resp.data;
            $scope.regions.forEach(function(r) {
                $scope.rg_k_v[r.id] = r; // rg_k_v  在  region.prop - systom中 也要是 该名: rg_k_v;
            })
        });
        loadSysModelPromise.then(function(resp) {
            $scope.sysModels = resp.ret;
        })


        $scope.reset = function() {
            $scope.od = {
                state: undefined,
                region_id: region_id
            };
            $scope.loadPageData(1);
        }

        var state_interval;
        $scope.$on("$destroy", function() {
            $interval.cancel(state_interval);
        })

        $scope.loadPageData = function(pageNo) {

            $scope.showMask = true;

            if( $scope.op.lm == "map"){

                forMapPromise = $source.$system.get(  angular.extend( {options:"queryformap"} , $scope.od ), function(resp){
                    map.clearOverlays(); 
                      
                    map.addOverlay(  ceratePointOverlay( resp.ret )     );

                    $scope.showMask = false ;

                }).$promise;  
                return ; 
            }
 

            $scope.page.currentPage = pageNo;
            // 分页加载 系统数据;
            var d = angular.extend({
                options: "query",

                currentPage: pageNo,
                itemsPerPage: $sys.itemsPerPage
            }, $scope.od );

            $source.$system.query(d).$promise.then(function(resp) {

                var sys_ref,
                    promise_A, promise_B, sysState, sta2sync;

                sys_ref = {};

                resp.data.forEach(function(n, i, a) {
                    sys_ref[n.uuid] = n;
                })
                promise_A = {} //  状态 是否在线, 挂起 ; 
                    // $source.$region.getProjNameByIdS(Object.keys(projids)).$promise;

                // 激活的系统;
                var ids = Object.keys(sys_ref);


                if ((d.state == '1' || d.state == undefined) && ids.length) {

                    // 在线状态 ; 
                    promise_A = $source.$system.status(ids).$promise;

                    // proj name ;
                    // 是否要 同步;
                    promise_B = !$scope.isShowModul && $source.$system.needSync(ids).$promise;


                    // 没分钟 刷新 状态; 
                    $interval.cancel(state_interval);

                    state_interval = $interval(function() {
                        $source.$system.status(ids, function(resp_x) {
                            var sysStatus = resp_x.ret;
                            $.each(resp.data, function(i, n) {
                                n.online = sysStatus &&  $utils.handlerOnlineData( sysStatus[i] ) ;
                            })

                        });

                    }, $sys.state_inter_time)

                }


                // 非激活的system; 或者 展示模块;
                // 加载 state , needsysnc ,  拆分 region数据;  ,
                $q.all([promise_A, promise_B, analyzeRegionPromise]).then(function(resp_B) {

                    sysStatus = resp_B[0] && resp_B[0].ret;
                    sta2sync = resp_B[1] && resp_B[1].ret; //在 未激活,  展示 模块 为 undefind ;

                    // 组装是否需要 同步 ; 
                    $.each(resp.data, function(i, n) {
                        //  不是这个 系统状态(0:未激活,1:活跃,2:挂起)
                        // 而是系统在线在线状态; 

                        n.online = sysStatus &&   $utils.handlerOnlineData( sysStatus[i]);


                        n.needsync = sta2sync && sta2sync[n.uuid];

                        n.region_name = $scope.rg_k_v[n.region_id].name;

                    });

                    angular.extend($scope.page, resp);

                    
                    $scope.showMask = false;

                }, function() {
                    $scope.showMask = false;
                })

            }, function() {
                $scope.showMask = false;
            })
        }

      

        $scope.loadPageData(1);

        //  切换到 地图; 
        var map, points;


        // 得到我所有管理的 system  制作展示 ,必要字段, 避免 大流量数据; 
        var forMapPromise  , pointCollection , 
            collenTionOptions = {
                        size: 7,
                        shape:  BMAP_POINT_SHAPE_WATERDROP,
                        color: 'red'
            }  ;

  

        // 展示 system  属性; 

        var  timeOutGetSystemStatus ; 
        function  pointMouseOver (e){
            var point = e.point ,
                system =  point.system  ;

                system.regionName =  system.regionName ||  $scope.rg_k_v[system.region_id].name ;
                system.createTime =  system.createTime || $filter("date")(system.create_time, "yyyy-MM-dd hh:mm:ss");
                     

                $map.showSystemProp(  map , point ,  system   , $scope  )
 
              
        }

        // mouse 移出时判断 是否 打开了 infowin , 若打开, 则不溢出 marker , closeWin时 才移除 marker ; 
        //                  没有打开 infowin , 则直接溢出 marker ; 
        function  pointMouseOut (e){ 
                var point = e.point  ; 
                    point.marker.closeInfoWindow(); 
                     
                    map.removeOverlay( point.marker); 
                    
 
        }

        // 后台返回的poing 保证了有  经纬度; 
        function ceratePointOverlay ( pointArray ){
            var  collection = new BMap.PointCollection(
                        pointArray.map( function( v, i ){  
                            var p = new BMap.Point( v.longitude , v.latitude ) // long 经度 , lat 维度 ;
                            p.system = v ; 

                            return   p ;
                        }),
                        collenTionOptions 
                    ); 
 
            //mouseover 显示 system 名字;  详细属性;  
            collection.addEventListener("mouseover" ,  pointMouseOver );

            collection.addEventListener( "mouseout" ,  pointMouseOut ) ;

            return collection ;

        }

           

        $scope.initMap = function( ) { 

            // map =   $map.createMap($scope, document.getElementsByClassName("sys_bdmap"), 268);   
            map =   $map.createMap($scope,  "bdmap", 168);    

            $scope.showMask = true ; 

            forMapPromise = forMapPromise || $source.$system.get( 
                angular.extend( { options:"queryformap" } , $scope.od )
            ).$promise ;

            forMapPromise.then( function(resp ){  

                map.addOverlay(  ceratePointOverlay( resp.ret ) );

                $scope.showMask = false ;
            })
    
        }
 
  

        $scope.createSystem = function() {
            $modal.open({
                templateUrl: "athena/dastation/dastation_add_temp.html",
                controller: function($scope, $modalInstance) {
                    $scope.__proto__ = thatScope;
                    $scope.$modalInstance = $modalInstance;

                    var region_id = thatScope.project && thatScope.project.id;


                    $scope.system = {
                        region_id: region_id
                    };

                    $scope.od = {
                        systemModel: undefined,
                        selectRegion: !!region_id
                    };


                    $scope.$watch("od.systemModel", function(n, o) {
                        if (!n) return;
                        //@if append

                        console.log(" systemModel  change ", n);
                        //@endif 


                        // 加载  profile;
                        if (n.mode == 2) {
                            delete $scope.system.network;
                        }

                        $scope.showMask = true;
                        $source.$sysProfile.get({
                            system_model: n.uuid
                        }, function(resp) {
                            $scope.profiles = resp.ret;
                            $scope.system.profile = resp.ret[0] && resp.ret[0].uuid;
                            $scope.showMask = false;
                        }, function() {
                            $scope.showMask = false;
                        })

                    })




                    $scope.done = function() {
                        $scope.validForm();

                        $scope.showMask = true;

                        // $scope.system.network = angular.toJson($scope.system.network);
                        var sys = angular.extend({
                            model: $scope.od.systemModel.uuid
                        }, $scope.system);


                        $source.$system.save(sys, function(resp) {
                            // alert("创建成功!");  
                            sys.uuid = resp.ret;
                            sys.state = 0;

                            $scope.page.data.unshift(sys);
                            $scope.cancel();

                            $scope.confirmInvoke({
                                    title: "配置系统",
                                    note: "创建成功,是否去配置该系统?",
                                    todo: "是",
                                    undo: "不用了"
                                },
                                function(next) {
                                    $scope.goto("app.m_system_prop._config", sys, sys);
                                    next();
                                }
                            )

                            $scope.showMask = false;

                        }, function() {
                            $scope.showMask = false;
                        })
                    }


                }
            })
        }

        $scope.updateSystem = function(idObj) {
            return $source.$system.put({}, idObj).$promise;
        }


    })


 