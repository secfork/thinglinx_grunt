/* Services
 *
 * */
// Demonstrate how to register services   ___   $resource ,


// ajax  响应 ,不会被拦截的响应 ;

/**
 修改 angualr-resource.js  源码 133 行, 增加put 方式;
增加   getByPk:{method:"GET"} , 方法;
*/
 


    angular.module('app.services', ["ngResource"], function() {
        ingorErr = {
            'DEVICE_NOT_EXIST': true,
            'ER_CONTACT_NOT_EXIST': true,
            'ER_SYSTEM_HAS_NOT_BOUND': true,
            'ACK_MESSAGE_NOT_EXIST': true,
            "ER_USER_NOT_EXIST": true ,
            "ER_USER_EXIST":true

        };

        // angular.rootUrl = 'http://localhost:8082/thinglinx/web/' ;
        // angular.rootUrl = 'web/'; 

        angular.rootUrl = "node/"


        // angular.rootUrl = ''; 


    })

 

    .service('$source', ['$resource', function($resource) {


        function $createSource(url, config1, config2) {
            return $resource(angular.rootUrl + url, config1, config2);
        }


        this.$deviceModel = $createSource("devmodel/:pk");
        this.$dmPoint = $createSource("devmodel/points/:pk");
        this.$sysProfile = $createSource("profile/:pk");
        this.$sysLogTag = $createSource("profile/tags/:pk");
        this.$sysTag = $createSource("sysmodel/tags/:pk");
        this.$sysProfTrigger = $createSource("profile/triggers/:pk");
        this.$sysModel = $createSource("sysmodel/:pk");
        this.$sysDevice = $createSource("sysmodel/devices/:pk");
        this.$message = $createSource("sysmodel/messages/:pk");
        this.$contact = $createSource("system/contacts/:pk");
        this.$region = $createSource("region/:pk/:op");

        // account/admin?uuid 来判断 uuid is Exist
        this.$account = $createSource("account/:pk" , {},{
            daliyStatistic:{  url: angular.rootUrl+  "account/daily_statistic"}
        });

        this.$role = $createSource("role/:pk");
        this.$driver = $createSource("driver/:type");
        this.$sub = $createSource("subscribe/:pk/:op");

        // http://faefae.com/:id/crate , { id:123}

        //    sou: connent( sys联系人) , user( 用户) , 
        //  ? send : cell_phone , verify: code ;  
        this.$note = $createSource("sms/:op/:sou");

        this.$common = $createSource("common/:op", {}, {
            // 验证 uuid ; 
            verifyUuid: {
                params: {
                    op: "vuuid"
                }
            },

            // 验证 图片验证码; 
            verify: {
                url: angular.rootUrl + "common/verify"
            }

        });

        this.$user = $createSource("user/:pk/:op", {}, {
            login: {
                url: angular.rootUrl + "common/login",
                method: "POST"
            },
            logout: {
                url: angular.rootUrl + "user/logout"
            }
        });

        /// {pk:"@pk", userid:"@userid"} ,
        this.$userGroup = $createSource("usergroup/:pk/:userid", {}, {
            queryUser: {
                url: angular.rootUrl + "usergroup/:pk/users"
            },

        });

        this.$ticket = $createSource("ticket/:system_id");

        this.$system = $createSource("system/:pk/:options/:proj_id", {}, {

            setPLC:{ method:"PUT" , params:{ options:"set_plc_prog"}  },
            
            getPLC:{ params:{ options:"get_plc_prog"} },

            sync: {
                method: "GET",
                params: {
                    options: "sync"
                }
            },
            stop: {
                method: "GET",
                params: {
                    cmd: "stop"
                }
            },
            start: {
                method: "GET",
                params: {
                    cmd: "start"
                }

            },
            call: {
                method: "POST"
            },
            active: {
                params: {
                    options: "active"
                }
            },
            deactive: {
                params: {
                    options: "deactive"
                }
            },
            assign: {
                params: {
                    options: "assign"
                }
            },
            getDtuServer: {
                method: "GET"
            },

            status: {
                method: "POST",
                params: {
                    options: "status"
                }
            },
            needSync: {
                method: "POST",
                params: {
                    options: "needsync"
                }
            }
        });

        // 权限;
        this.$permission = $createSource("permission/:source/:source_id/:group_id")

        this.$weChat = $createSource ( 'wechat' , {} ,  {
            //生成服务器地址接口
            createUrl:       { params: { method:"get_wechat_server_address" }  } ,
            //查询微信服务器状态接口
            getServerStatus: { params: { method:"get_wechat_status"         }  } ,
            //激活服务器接口
            //    menu=1,2,3
            activeServer:    { params: { method:"set_wechat_server" }  } ,
            //解除绑定
            unBindServer:    { params: { method:"unbind_wechat_server" }  } ,
            // getServerInfo ;
            getServerInfo :  { params: { method: "get_wechat_server_info"}}
            

            
        })


    }])

    .service('$show', ['$resource', function($resource) {

        var live = angular.rootUrl + "show/live/:uuid",
            liveWrite = angular.rootUrl + 'show/livewrite/:uuid', // uuid = system uid ;
            // his = angular.rootUrl + "show/history/:uuid",   // uuid = system uid ;
            his = angular.rootUrl + "line/:uuid/:method", // uuid = system uid ;
            alarm = angular.rootUrl + "show/alarm/:uuid/:op"; // uuid = system uid ;


        this.live = $resource(live);
        this.his = $resource(his);

        this.alarm = $resource(alarm, {}, {
            conform: {
                method: "POST",
                params: {
                    uuid: "confirm"
                }
            },
            getConformMsg: {
                params: {
                    uuid: "confirm"
                }
            }
        });
        this.liveWrite = $resource(liveWrite); // 下置; 



    }])



    // driver ;
    // .factory("$driver", function($resource) {
    //     return $resource(angular.rootUrl + "driver/:pk", {}, {

    //         // template , type =0 得到的是 driver最高版本;
    //         getDriverList: {
    //             params: {
    //                 id: "list",
    //                 type: 0
    //             }
    //         },

    //         // station ; type = 1 ;  得到 dtu ;
    //         getDtuList: {
    //             params: {
    //                 id: "list",
    //                 type: 1
    //             }
    //         },  
    //     })
    // })



    //==========================================================================
    //==========================================================================
    //==========================================================================
    // js 命令;
    .factory("jsorder", function($sys, $cookies) {
        return {
            'login': function() {
                // 跳到登录界面;
                // if( !$sys.$debug ){
                console.log($cookies);
                window.location.hash = "#/access/signin";
                // }
            }
        }
    })


    .factory('Interceptor', function($q, jsorder,
        $location, $anchorScroll, $timeout, $sys) {

        // 判断 是否有ajax加载 并显隐 动作条;
        var ajax_times = 0,
            _timeout, animat = false,
            $dom = [];


        return {
            /* 四种拦截 key 是 固定的; */
            // optional method    通过实现 request 方法拦截请求
            'request': function(config) {
               


                // 添加区域字段;
                // html 的不添加 local ;
                // if (!/(.html)$/.test(config.url)) {

                //     config.headers['Accept-Language'] = localStorage.NG_TRANSLATE_LANG_KEY || "en";
                //     config.console = true;
 
                // }   

                return config || $q.when(config);

            },
            /*
             // optional method  通过实现 requestError 方法拦截请求异常: 有时候一个请求发送失败或者被拦截器拒绝了
             'requestError': function (rejection) {
             // do something on request error
             if (canRecover(rejection)) {
             return responseOrNewPromise
             }
             return $q.reject(rejection);
             }, */

            // optional method   通过实现 response 方法拦截响应:
            'response': function(response , a , b, c ) {

                var resp = response.data ; 

                if (resp.err) {
                    //alert( $err[response.data.err+'']|| response.data.err ); 
                    console.error("_ERR_:" + resp.err);

                    if (!ingorErr[resp.err]) {

                        angular.alert({
                            type: "resp_err",
                            title: resp.err
                        }); 
                    }
                    throw resp ;
                }

                if (resp.total == 0 && resp.data.length == 0) {
                    // angular.alert( { type:"info" , title:"无返回数据"});
                }



                //return response || $q.when(response); 
                if (resp.order) {
                    //@if  append 
                    console.log("order:" + resp.order);
                    //@endif 

                    jsorder[resp.order]();
                }
                return response;
            },

            // optional method  通过实现 responseError 方法拦截响应异常:
            'responseError': function(response) {
                //@if  append
                console.log("responseError");
                //@endif 
 
              
                
                //@if  append

                console.log(response.status + "--" + response);
                //@endif 
                return response;

            }
        }

    })

    .factory("$brower", function($window) {

        var brower = {};

        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? brower.ie = s[1]:
            (s = ua.match(/msie ([\d.]+)/)) ? brower.ie = s[1] :
            (s = ua.match(/firefox\/([\d.]+)/)) ? brower.firefox = s[1] :
            (s = ua.match(/chrome\/([\d.]+)/)) ? brower.chrome = s[1] :
            (s = ua.match(/opera.([\d.]+)/)) ? brower.opera = s[1] :
            (s = ua.match(/version\/([\d.]+).*safari/)) ? brower.safari = s[1] : 0;

        function isSmartDevice($window) {
            // Adapted from http://www.detectmobilebrowers.com
            var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
            // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
            return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
        }

        brower.isSmart = isSmartDevice($window);

        return brower;
    })

  
    .service("$map", function($http, $utils , $templateRequest ,$templateCache, $sys, $filter, $interpolate , $timeout , $source  ) {

        var $map = this;
        // dom_id 无需加 # 号 ;
        function initMap(Dom_id) {
            // 百度地图API功能

            var map = new BMap.Map(Dom_id); // 创建Map实例


            map.centerAndZoom(new BMap.Point(116.404, 39.915), 12 );

            // 初始化地图,设置中心点坐标和地图级别 

            //map.addControl(new BMap.MapTypeControl()); //添加地图类型控件

            //map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的

            //开启鼠标滚轮缩放
            map.enableScrollWheelZoom(true);
            // 左上角，添加比例尺
            var top_left_control = new BMap.ScaleControl({
                anchor: BMAP_ANCHOR_TOP_LEFT
            });
            //左上角，添加默认缩放平移控件
            var top_left_navigation = new BMap.NavigationControl();

            //右上角，仅包含平移和缩放按钮
            var top_right_navigation = new BMap.NavigationControl({
                anchor: BMAP_ANCHOR_TOP_RIGHT,
                type: BMAP_NAVIGATION_CONTROL_SMALL
            });
            /*缩放控件type有四种类型:
             BMAP_NAVIGATION_CONTROL_SMALL：仅包含平移和缩放按钮；BMAP_NAVIGATION_CONTROL_PAN:仅包含平移按钮；BMAP_NAVIGATION_CONTROL_ZOOM：仅包含缩放按钮*/
            map.addControl(top_left_control);
            map.addControl(top_left_navigation);
            // map.addControl(top_right_navigation);

            
            // var cr = new BMap.CopyrightControl({anchor: BMAP_ANCHOR_TOP_RIGHT});   //设置版权控件位置
            // map.addControl(cr); //添加版权控件

            // var bs = map.getBounds();   //返回地图可视区域
            // cr.addCopyright({id: 1, content: "<a href='#' style='font-size:20px;background:yellow'>我是自定义版权控件呀</a>", bounds: bs}); 



            return map;
        }

        // flushMarkers 清除所有覆盖物 , 添加新覆盖物;

        this.flushMarkers = function(map, stations) {
            map.clearOverlays();
            addMarkers2map(map, createDAPoint(stations));

        }

        this.addSearch = function(map, inputid, resultid) {
            function G(id) {
                return document.getElementById(id);
            }

            //建立一个自动完成的对象
            var ac = new BMap.Autocomplete({
                "input": inputid,
                "location": map
            });
            //鼠标放在下拉列表上的事件
            ac.addEventListener("onhighlight", function(e) {
                var str = "";
                var _value = e.fromitem.value;
                var value = "";
                if (e.fromitem.index > -1) {
                    value = _value.province + _value.city + _value.district + _value.street + _value.business;
                }
                str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

                value = "";
                if (e.toitem.index > -1) {
                    _value = e.toitem.value;
                    value = _value.province + _value.city + _value.district + _value.street + _value.business;
                }
                str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
                G("searchResultPanel").innerHTML = str;
            });

            var myValue;
            //鼠标点击下拉列表后的事件
            ac.addEventListener("onconfirm", function(e) {
                var _value = e.item.value;
                myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                G(resultid).innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

                setPlace();
            });

            function setPlace() {
                map.clearOverlays(); //清除地图上所有覆盖物
                function myFun() {
                    var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果

                    map.centerAndZoom(pp, 18);
                    // map.addOverlay(new BMap.Marker(pp));    //添加标注
                }
                var local = new BMap.LocalSearch(map, { //智能搜索
                    onSearchComplete: myFun
                });
                local.search(myValue);
            }
        }

        // 地图展示 一个proj下的所有已定位的是station ;
        /**
           必要 :$scope , sations , domid , h_offset ;
           非必要: projName ;
        */
        this.createMap = function($scope, domid, h_offset) {

            var $mapdom, marks, map;

            // $mapdom =  typeof domid =='string'? $("#" + domid) : $( domid );

            $mapdom = $("#"+ domid );

            // return  initMap( domid ) 
            // 取消  resize 事件 ;
            $scope.$on("$destroy", function() {
                $(window).off("resize");
            })
            $(window).on("resize", function() {
                $mapdom.css({
                    height: window.innerHeight - h_offset
                });
            });
            $mapdom.css({
                height: window.innerHeight - h_offset
            });

            map = initMap(domid);

            return map;

        }

        // var myGeo = new BMap.Geocoder();
        //    // // 根据坐标得到地址描述
        //    myGeo.getLocation(new BMap.Point($scope.system.longitude, $scope.system.latitude), function(result) {
        //        if (result) {
        //            console.log(result);
        //            $scope.$apply(function() {
        //                $scope.system.map_address = result.address;
        //            })
        //        }
        //    });

        var myGeo = new BMap.Geocoder();
        this.getLocation = function(mapPoint, cb) {

            myGeo.getLocation(mapPoint, cb);
        }


        // stations = [ { latitude , longitude , name ,... } ,...]
        //  mapCluster :bol ,  是否聚合 点; 

        this.createDAPoint2Map = function(map, stations, clickHandler, mapCluster) {

            var marks = [],
                that = this;

            map.clearOverlays();

            stations = stations instanceof Array ? stations : [stations];

            angular.forEach(stations, function(v, i) {
                if (!v.latitude) return;

                var mark = that.mapMarker(v.latitude, v.longitude, v.name);
                mark.system = v;

                clickHandler && mark.addEventListener('click', clickHandler);

                map.addOverlay(mark);

                marks.push(mark);
            });

            // 设置中心; 
            centeredMap(map, marks);
            // 聚合 点; 
            !mapCluster && 　new BMapLib.MarkerClusterer(map, {
                markers: marks
            })

            return marks;
        }

        // marker点;
        this.mapMarker = function(x, y, text) {

            var mark = new BMap.Marker(new BMap.Point(y, x));
            if (text) {
                label = new BMap.Label(text, {
                    offset: new BMap.Size(20, -10)
                });
                label.setStyle({
                    'border-width': 0,
                    'font-weight': 700
                });
                mark.setLabel(label);
            }

            return mark;
        }

        var timeOutGetSystemStatus ,  
            markerOptions = {   offset: new BMap.Size( 0,5)     }  , 
            infoWindowOptions = { enableCloseOnClick: false  , enableMessage :false , enableAutoPan: false }  ;
       
        this.showSystemProp = function( map , point  , system  , $scope  , autoPan ){
                 
                $timeout.cancel( timeOutGetSystemStatus );

                timeOutGetSystemStatus = $timeout( function(){
                     $source.$system.status([ system.uuid ] , function( resp ){
                        // 获取 单个 系统的在线 状态; 
                        $("#one_system_status").addClass (  $utils.handlerOnlineData(resp.ret[0] )  ?'fa-circle  text-success' : 'fa-circle text-danger' );

                     })
                },500 )
   
                if( ! point.marker){
                    var mk =  new  BMap.Marker( point , markerOptions);
                    $scope &&  mk.addEventListener('click' , function(){
                        $scope.goto( $scope._$stationState , system );
                    }) 
                    point.marker = mk ;  
                }
 

                $templateRequest("athena/dastation/prop_map_popup.html").then( function(html){
                     
                    infoWindowOptions.enableAutoPan = !!autoPan ;
                    // s.proj_name = s.proj_name || projName; // ;
                    // system 类型;
                    // system.type =  $sys.stationtype.values[s.type].k ; 
                    var str = $interpolate(html)(system);
                    var infoWindow = new BMap.InfoWindow(str , infoWindowOptions ); 
                    point.marker.openInfoWindow(infoWindow); 
                }) 
  
                map.addOverlay( point.marker );


        }


        // 设置 map 中心点; 
        function centeredMap(map, markers) {

            if (markers && markers[0]) {
                map.centerAndZoom(markers[0].point, 12);
            } else {
                var myCity = new BMap.LocalCity();
                myCity.get(function(result) {
                    map.centerAndZoom(result.center, 12);
                    map.setCurrentCity(result.name);
                });
            }

        }

        // 展示 system 属性 窗口;
        this.propWin = function() {
                var that = this;
                // 动态生成 infoWindow ;

                $http({
                        method: "GET",
                        url: "athena/dastation/prop_map_popup.html",
                        cache: $templateCache
                    })
                    .success(function(a) {
                        var s = angular.copy(station);
                        //@if  append

                        console.log(s);
                        //@endif  
                        // s.proj_name = s.proj_name || projName; // ;
                        s.create_time = $filter("date")(s.create_time, "yyyy-MM-dd hh:mm:ss");

                        // system 类型;
                        // s.type =  $sys.stationtype.values[s.type].k ;

                        var str = $interpolate(a)(s);
                        //console.log(str , $(str).html()  );

                        var infoWindow = new BMap.InfoWindow(str)
                        that.openInfoWindow(infoWindow);
                        //  删除 手机 小图片;


                    }).error(function(b) {
                        alert("error");
                        throw ("加载异常  athena/views/dastation/prop_map_popup.html?");
                    })
            }
            // 定位窗口;
            // 编辑定位窗口; 



    })

    .factory("$workerConfig", function() {
            return {
                baseUrl: 'athena/webworker/'
            }
        })
        .factory('$webWorker', ['$q', '$workerConfig', function($q, $workerConfig) {

            return function(jsFile) {
                //@if  append

                console.log("创建 webworker -- ", jsFile);
                //@endif 
                var worker = new Worker($workerConfig.baseUrl + jsFile);

                var defer = $q.defer();

                worker.addEventListener('message', function(e) {
                    defer.resolve(e.data);
                }, false);

                return {
                    postMessage: function() {
                        defer = $q.defer();
                        worker.postMessage(arguments);
                        return defer.promise;
                    },
                    terminate: function() {
                        worker.terminate();
                        //@if  append

                        console.log(" 关闭 web worker !; ");
                        //@endif 
                    }

                };

            }

        }])


    ;
 