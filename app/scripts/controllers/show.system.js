angular.module('app.show.system', [])



.controller("show_alarm", function($scope, $state, $source, $show, $sys, $q, $filter, $modal ) {

    $scope.$moduleNav("报警", $state);

    var S = $scope;

    $scope.openCalendar = function(e, exp) {
        e.preventDefault();
        e.stopPropagation();
        this.$eval(exp);
    };

    $scope.page = {};

    // 先加载 regions ;
    $source.$region.query({
        currentPage: 1
    }, function(resp) {
        $scope.regions = resp.data;
    })

    // 按需加载  system ;
    $scope.loadSys = function() {
        $scope.showMask = true;
        if (!$scope.od.region_id) {
            $scope.systems = [];
            $scope.od.system_id = undefined;
            return;
        };
        $source.$system.query({
            currentPage: 1,
            options: "query",
            isactive: 1,
            region_id: $scope.od.region_id
        }, function(resp) {
            $scope.systems = resp.data;
            $scope.showMask = false;

        }, function() {
            $scope.showMask = false;
        })
    }

    $scope.op = {
        active: "a" // 活跃报警，  b：全部报警； 
    };

    var activeAlarmData = {},
        allAlarmDate = {},
        _switch;


    $scope.$watch("op.active", function(n, o) {
        //$scope.page.data = [];
        //$scope.page.total = 0;
        //$scope.page.currentPage = 0; 
        if (n == 'a') {
            allAlarmDate = $scope.page || {};
            $scope.page = activeAlarmData;

        } else {

            activeAlarmData = $scope.page || {};
            $scope.page = allAlarmDate;

        }


    })



    $scope.od = {
        class_id: null, //0,
        severity: null, //'0',
        end: new Date(),
        start: new Date(new Date() - 86400000),
        region_id: undefined,
        system_id: undefined
    };

    // // 查询全部报警;

    $scope.loadPageData = function(pageNo) {



        if (!pageNo) {
            return;
        }

        $scope.validForm();
        var od = angular.copy($scope.od);

        od.desc = !!od.desc ? ("*" + od.desc + "*") : null;


        console.log(od)
        if (!od.start) {
            angular.alert("请输入起始时间");
            return;
        }
        if (!od.end) {
            angular.alert("请输入结束时间");
            return;
        }

        od.start = od.start.getTime(),
            od.end = od.end.getTime();



        if (od.start > od.end) {
            angular.alert("起始时间不可超前与结束时间");
            return;
        }

        od.itemsPerPage = $sys.itemsPerPage;
        od.currentPage = pageNo;

        // 活跃报警;
        od.active = $scope.op.active == "a" ? "1" : undefined;

        od.uuid = "query";

        $scope.showMask = true;

        $show.alarm.query(od, function(resp) {
            $scope.page.data = resp.data;
            $scope.page.total = resp.total;
            $scope.page.currentPage = pageNo;

            if (!resp.data.length) {
                angular.alert({
                    title: "无报警数据"
                })
            }

            $scope.showMask = false;
        }, function() {
            $scope.showMask = false;
        })

    }



    // alarm 详细信息;

    $scope.alarmMsg = function(a) {
        $modal.open({
            templateUrl: "athena/show/alarm_msg.html",
            controller: function($scope, $modalInstance) {
                $scope.__proto__ = S;
                $scope.$modalInstance = $modalInstance;
                // $scope.done = $scope.cancel;
                $scope.alarm = a;
            }
        })
    }
})


.controller('show_system_prop', function($scope, $state, $stateParams, _$system, $utils, $source, $show, $q, $sys, $filter, $interval) {

    //@if  append
    console.log("show_system_prop");
    //@endif

    $scope.from = $utils.backState('show_system_prop'); // from

 
    // 用缓存可以得到 online ;
    // $scope.system = $scope.$$cache[0];

    // 用 请求数据 无法获取 onlin ;
    $scope.system = _$system.ret;

    $scope.tags = $scope.system.tags;


    // 加载 region 信息; 
    $source.$region.get({
        pk: $scope.system.region_id
    }, function(resp) {
        $scope.system.region_name = resp.ret.name;
    })


    // 加载  活活报警数; 
    $show.alarm.get({
        uuid: $scope.system.uuid,
        op: "total",
        active: 1
    }, function(resp) {
        $scope.totalAlarm_act = resp.ret;
    })

    // 加载 最后报警; 
    $show.alarm.get({
        uuid: $scope.system.uuid,
        op: "lastalarm"
    }, function(resp) {
        $scope.lastAlarm = resp.ret[0];
    })



    // 获取在线状态;  
    function getState() {
        $source.$system.status([$scope.system.uuid], function(resp) {
            var state = resp.ret[0];
            $scope.system.online = state && (state.daserver ? state.daserver.logon : state.online);
        })
    }
    getState();

    // 每分钟更新次 在线状态; 
    var state_interval;
    state_interval = $interval(getState, $sys.state_inter_time);

    $scope.$on("$destroy", function() {
        $interval.cancel(state_interval);
    })
 


    var sysModel = $scope.system.model,
        //td = $filter("date")(new Date(), "yyyy-MM-dd"),
        arr, d;

    // 加载模型来干什么?
    //  0: 展示不需要列出系统引用那个模型;
    //  1: 获得模式来判断是否能下置点数据;
    $source.$sysModel.getByPk({
        pk: sysModel
    }, function(resp) {
        $scope.systemModel = resp.ret;
        //$scope.system.network = angular.fromJson( $scope.system.network);
    })


    $scope.op = {
        start: "",
        num: 400, // 查询点历史 返回条数;
        end: new Date(),
        start: new Date(new Date() - 86400000),
        ala: "a", // a: 实时报警; b: 历史报警;
        pointSize: 60, // 曲线上的点数;
        c_int: 10000, // 实时数据 interval 时间;
        a_int: 10000, // 实时报警; interva 时间;
        progValue: 0
    };

    // $scope.openCalendar = function(e, exp) {




    $scope.openCalendar = function(e, exp) {
        e.preventDefault();
        e.stopPropagation();

        this.$eval(exp);
    };


    $scope.goHis = function(t) {
        $scope.op.his_tag = t;
        $state.go('app.s_system_prop.history');
    }

    //  var map = new BMap.Map("l-map");
    // map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
    // // 创建地理编码实例
    if ($scope.system.latitude) {
        var myGeo = new BMap.Geocoder();
        // // 根据坐标得到地址描述
        myGeo.getLocation(new BMap.Point($scope.system.longitude, $scope.system.latitude), function(result) {
            if (result) {
                console.log(result);
                $scope.$apply(function() {
                    $scope.system.map_address = result.address;
                })
            }
        });

    }


})

.controller('show_system_basic', function($scope, $sys, $show, $state) {
    // 获取是否在线;
    $scope.$popNav($scope.system.name + "", $state);
})

.controller('show_system_current', function($scope, $show, $interval, $sys, $state, $filter,
    $timeout) {

    $scope.$popNav($scope.system.name + "(实时数据)", $state);

    var interval;

    //$scope.$popNav($scope.system.name + "()", $state);

    $scope.$on("$destroy", function() {
        $interval.cancel(interval);
    });

    // 自动刷新   ;
    $scope.auto_r = true;

    //保留小数; 
    $scope.decimal = false;

    $scope.fractionSize = 4; // 保留四位小数; 


    // 开始订阅数据; 进程条 
    $scope.progValue = 0;



    var names = [],
        reg;

    $scope.filtTags = [];
    $scope.filterTags = function(name) {
        names = [];
        reg = new RegExp(name);

        $scope.filtTags = $scope.tags.filter(function(v) {
            if (reg.test(v.name)) {
                names.push(v.name);
                return true;
            }
            return false;
        });
        getCurrent();
    };

    $scope.filterTags("");

    $scope.$watch("auto_r", function(n) {
        if (n) { // 自动刷新;
            $scope.liveData();
        } else { // false;
            // 取消 interval , 但是保存状态( 保持 progvalue );
            $interval.cancel(interval);
        }
    })




    $scope.liveData = function() { // need = $last ;
        $interval.cancel(interval);

        interval = $interval(function() {

            $scope.progValue += 1000;

            if ($scope.progValue == $scope.op.c_int) {
                getCurrent();
            }

            if ($scope.progValue > $scope.op.c_int) {
                $scope.progValue = 0;
            }

        }, 1000);
    }


    // 单次获得 当前数据;
    var x = {
            src: null,
            pv: null
        },
        t,  
        v ,
        b,  regExp  , formatter;

    function getCurrent($event) {

        console.log(names);

        var $dom; 

        if (names.length) {
            if ($event) {
                $dom = $($event.currentTarget);
                $dom.text("刷新中").attr("disabled", true);

            };

            $show.live.get({
                uuid: $scope.system.uuid,
                tag: names
            }, function(resp) {
  
                b = $scope.decimal; 

                if(b){
                    if( $scope.fractionSize == 0){
                        regExp = new RegExp( "(\\d+).(\\d+)" );
                        formatter = "$1";

                    }else{
                        regExp = new RegExp(  "(\\d+).(\\d{" +$scope.fractionSize+  "})(\\d*)" );
                        formatter = "$1.$2";
                    } 
                }


                $.each(resp.ret, function(i, d) {
                    d = d || x;
                    t = $filter("date")(d.src, 'MM-dd HH:mm:ss'); 
                    t && $("#_time_" + i).text(t);


                    // '1232.1233455666'.replace(/(\d+).(\d{3})(\d*)/, "$1"+'xxx'+"$2");

                    $("#_val_" + i).text(d.pv == null ?  "" 
                        : (  b ? ( (d.pv+'').replace( regExp , formatter)  )  : d.pv ) 
                    );
 
                });

                if ($dom) {
                    $dom.text("刷新成功");

                    $timeout(function() {
                        $dom.text("刷新").attr("disabled", false);
                    }, 3000);

                } 
            }, function() { 
                $dom && $dom.text("刷新").attr("disabled", false);
            })
        }

    }

    function handlerPv ( pv ){
    // toFixed


    }


    $scope.getCurrent = getCurrent;


    // 下置数据;
    $scope.liveWrite = function(t, v, e, s) {
        //console.log(arguments);  // String system_id , String name ,String value

        if (!v) {
            angular.alert("请输入下置数据");
            return;
        }

        if (!t) return;
        var d = {},
            $button = $(e.currentTarget);;
        d[t.name] = v;
 
        s.showSpinner = true;
        $show.liveWrite.save({
            uuid: $scope.system.uuid
        }, d, function(resp) {
            s.showSpinner = false; 
            console.log(resp); 

        }, function() {
            s.showSpinner = false; 
        })
    }
})

.controller('show_system_history', function($scope, $show, $sys, $state ) {

    // $scope.od = {
    //  showS: false,
    //  showE: false
    // };

    $scope.$popNav($scope.system.name + "(历史数据)", $state);

    $scope.$on("$destroy", function() {
        $scope.op.his_tag = null;
    })


    var polt,
        plot_config = angular.copy($sys.plotChartConfig);

    $scope.initFlotChart = function(_plot_data) {

        //@if  append
        console.log(_plot_data);
        //@endif

        if ($scope.op.his_tag) {
            $scope.op.start = new Date(new Date() - 21600000);
            $scope.op.end = new Date();
            //$scope.queryData(1);
        } else {
            refreshChart('模拟点', true);
        }
        refreshChart('模拟点', true);
    }

    var btnType = 1; //标识点击了哪个按钮
    //左移时间
    $scope.leftTime = function() {

            if (btnType == 1 || btnType == 2) {
                $scope.op.end = new Date($scope.op.end.getTime() - 24 * 3600 * 1000);
            } else if (btnType == 3 || btnType == 4 || btnType == 5) {
                if ($scope.op.end.getMonth() == 0) {
                    $scope.op.end = new Date(($scope.op.end.getFullYear() - 1) + "/12/" + $scope.op.end.getDate());
                } else {
                    $scope.op.end = new Date($scope.op.end.getFullYear() + "/" + $scope.op.end.getMonth() + "/" + $scope.op.end.getDate());
                }
            } else if (btnType == 6) {
                $scope.op.end = new Date(($scope.op.end.getFullYear() - 1) + "/" + ($scope.op.end.getMonth() + 1) + "/" + $scope.op.end.getDate());
            }
            $scope.queryData(btnType);

        }
        //右移时间
    $scope.rightTime = function() {
        if (btnType == 1 || btnType == 2) {
            $scope.op.end = new Date($scope.op.end.getTime() + 24 * 3600 * 1000);
        } else if (btnType == 3 || btnType == 4 || btnType == 5) {
            if ($scope.op.end.getMonth() == 11) {
                $scope.op.end = new Date(($scope.op.end.getFullYear() + 1) + "/1/" + $scope.op.end.getDate());
            } else {
                $scope.op.end = new Date($scope.op.end.getFullYear() + "/" + ($scope.op.end.getMonth() + 2) + "/" + $scope.op.end.getDate());
            }
        } else if (btnType == 6) {
            $scope.op.end = new Date(($scope.op.end.getFullYear() + 1) + "/" + ($scope.op.end.getMonth() + 1) + "/" + $scope.op.end.getDate());
        }
        $scope.queryData(btnType);
    }


    $scope.dateStr = new Date().getFullYear() + "." + (new Date().getMonth() + 1) + "." + new Date().getDate();

    $scope.$watch('op.end', function(n, o) {
        if ($scope.changeTemp) {
            $scope.queryData(btnType);
        }
    }, true);

    $scope.$watch('op.his_tag', function(n, o) {
        $scope.queryData(btnType);
    }, true);

    //标示op.end是否是页面模型改变的
    $scope.changeTemp;

    $scope.queryData = function(num) {

        $scope.changeTemp = false;
        if (arguments.length == 2) {
            $scope.op.end = new Date();
        }

        if (!$scope.op.his_tag) {
            return;
        }
        //按钮变色处理
        $("button[data-name='" + num + "']").css({
            'background-color': '#edf1f2',
            'border-color': '#c7d3d6',
            'box-shadow': 'inset 0 3px 5px rgba(0, 0, 0, .125)'
        }).prop('disabled', true).siblings().css({
            'background-color': '#fff',
            'border-color': '#dee5e7',
            'box-shadow': '0 1px 1px rgba(90,90,90,0.1)'
        }).prop('disabled', false);

        if ($scope.op.end.getTime() > (new Date().getTime())) {
            angular.alert("结束时间不能晚于当前时间");
            $scope.op.end = new Date();
        }



        var curdate = new Date();
        var now = {
            year: curdate.getFullYear(),
            month: curdate.getMonth() + 1,
            day: curdate.getDate(),
            time: curdate.getTime()
        }

        var op = $scope.op;
        var start;
        var end = op.end.getTime();
        var count;


        if (num == 1) { //1天
            if (now.time - op.end.getTime() < 24 * 3600 * 1000) { //当天
                start = new Date(now.year + "/" + now.month + "/" + now.day).getTime();
                end = now.time;
                $scope.dateStr = new Date(end).getFullYear() + "." + (new Date(end).getMonth() + 1) + "." + new Date(end).getDate();
            } else {
                start = new Date(op.end.getFullYear() + "/" + (op.end.getMonth() + 1) + "/" + op.end.getDate()).getTime();
                end = new Date(op.end.getFullYear() + "/" + (op.end.getMonth() + 1) + "/" + op.end.getDate()).getTime() + 24 * 3600 * 1000;
                $scope.dateStr = new Date(start).getFullYear() + "." + (new Date(start).getMonth() + 1) + "." + new Date(start).getDate();
            }
            count = 1500;
            btnType = 1;



        } else if (num == 2) { //7天
            if (now.time - op.end.getTime() < (24 * 3600 * 1000)) { //当天
                start = new Date(now.year + "/" + now.month + "/" + now.day).getTime() - 6 * 24 * 3600 * 1000;
                end = now.time;
                end = end - ((end - start) % (30 * 60 * 1000));
                $scope.dateStr = new Date(start).getFullYear() + "." + (new Date(start).getMonth() + 1) + "." + new Date(start).getDate() + "-" +
                    new Date(end).getFullYear() + "." + (new Date(end).getMonth() + 1) + "." + new Date(end).getDate();
            } else {
                end = new Date(op.end.getFullYear() + "/" + (op.end.getMonth() + 1) + "/" + op.end.getDate()).getTime() + 24 * 3600 * 1000;
                start = end - 7 * 24 * 3600 * 1000;
                $scope.dateStr = new Date(start).getFullYear() + "." + (new Date(start).getMonth() + 1) + "." + new Date(start).getDate() + "-" +
                    new Date(end - 24 * 3600 * 1000).getFullYear() + "." + (new Date(end - 24 * 3600 * 1000).getMonth() + 1) + "." + new Date(end - 24 * 3600 * 1000).getDate();
            }
            count = parseInt((end - start) / (30 * 60 * 1000));
            btnType = 2;

        } else if (num == 3) { //1月
            if ((op.end.getFullYear() == now.year) && (op.end.getMonth() + 1 == now.month)) { //当月
                start = new Date(now.year + "/" + now.month).getTime();
                end = now.time;
                end = end - ((end - start) % (2 * 3600 * 1000));
                $scope.dateStr = new Date(end).getFullYear() + "." + (new Date(end).getMonth() + 1);
            } else {
                start = new Date(op.end.getFullYear() + "/" + (op.end.getMonth() + 1)).getTime();
                //处理12月
                if (op.end.getMonth() == 11) {
                    end = new Date((op.end.getFullYear() + 1) + "").getTime();
                } else {
                    end = new Date(op.end.getFullYear() + "/" + (op.end.getMonth() + 2)).getTime();
                }
                $scope.dateStr = new Date(start).getFullYear() + "." + (new Date(start).getMonth() + 1);

            }
            count = parseInt((end - start) / (2 * 3600 * 1000));
            btnType = 3;


        } else if (num == 4) { //3月
            if ((op.end.getFullYear() == now.year) && (op.end.getMonth() + 1 == now.month)) { //当月
                //处理1，2月份
                if (now.month <= 2) {
                    start = new Date((now.year - 1) + "/" + (10 + now.month)).getTime();
                } else {
                    start = new Date(now.year + "/" + (now.month - 2)).getTime();
                }
                end = now.time;
                end = end - ((end - start) % (6 * 3600 * 1000));

                $scope.dateStr = new Date(start).getFullYear() + "." + (new Date(start).getMonth() + 1) + "-" +
                    new Date(end).getFullYear() + "." + (new Date(end).getMonth() + 1);
            } else {
                //处理1，2月份
                if (op.end.getMonth() < 2) {
                    start = new Date((op.end.getFullYear() - 1) + "/" + (11 + op.end.getMonth())).getTime();
                } else {
                    start = new Date(op.end.getFullYear() + "/" + (op.end.getMonth() - 1)).getTime();
                }
                //处理12月
                if (op.end.getMonth() == 11) {
                    end = new Date((op.end.getFullYear() + 1) + "").getTime();
                } else {
                    end = new Date(op.end.getFullYear() + "/" + (op.end.getMonth() + 2)).getTime();
                }

                $scope.dateStr = new Date(start).getFullYear() + "." + (new Date(start).getMonth() + 1) + "-" +
                    op.end.getFullYear() + "." + (op.end.getMonth() + 1);
            }
            count = parseInt((end - start) / (6 * 3600 * 1000));
            btnType = 4;

        } else if (num == 5) { //6月
            if ((op.end.getFullYear() == now.year) && (op.end.getMonth() + 1 == now.month)) { //当月
                //处理1，2,3,4,5月份
                if (now.month <= 5) {
                    start = new Date((now.year - 1) + "/" + (7 + now.month)).getTime();
                } else {
                    start = new Date(now.year + "/" + (now.month - 5)).getTime();
                }
                end = now.time;
                end = end - ((end - start) % (12 * 3600 * 1000));
                $scope.dateStr = new Date(start).getFullYear() + "." + (new Date(start).getMonth() + 1) + "-" +
                    new Date(end).getFullYear() + "." + (new Date(end).getMonth() + 1);
            } else {
                //处理1，2,3,4,5月份
                if (op.end.getMonth() < 5) {
                    start = new Date((op.end.getFullYear() - 1) + "/" + (8 + op.end.getMonth())).getTime();
                } else {
                    start = new Date(op.end.getFullYear() + "/" + (op.end.getMonth() - 4)).getTime();
                }
                //处理12月
                if (op.end.getMonth() == 11) {
                    end = new Date((op.end.getFullYear() + 1) + "").getTime();
                } else {
                    end = new Date(op.end.getFullYear() + "/" + (op.end.getMonth() + 2)).getTime();
                }
                $scope.dateStr = new Date(start).getFullYear() + "." + (new Date(start).getMonth() + 1) + "-" +
                    op.end.getFullYear() + "." + (op.end.getMonth() + 1);
            }
            count = parseInt((end - start) / (12 * 3600 * 1000));
            btnType = 5;


        } else if (num == 6) { //1年
            if (op.end.getFullYear() == now.year) { //当年
                start = new Date(now.year + "").getTime();
                end = now.time;
                end = end - ((end - start) % (24 * 3600 * 1000));
                $scope.dateStr = new Date(start).getFullYear();
            } else {
                start = new Date(op.end.getFullYear() + "").getTime();
                end = new Date(op.end.getFullYear() + 1 + "").getTime();
                $scope.dateStr = new Date(start).getFullYear();
            }
            count = parseInt((end - start) / (24 * 3600 * 1000));
            btnType = 6;
        }
        var json = {
            start: start,
            end: end,
            count: count
        }
        $scope.queryHistory(json);

    }



    $scope.queryHistory = function(json) { //arr：时间戳列表

        $scope.validForm();

        //页面的模型
        var op = $scope.op;
        //请求参数
        var d = {};
        d.uuid = $scope.system.uuid;
        d.tag = op.his_tag.name;
        d.mode = op.his_tag.type == 'Analog' ? 'linear' : 'last_value';
        d.start = json.start;
        d.end = json.end;
        d.count = json.count;
        // 历史数据;
        //  intervali =  ts ,  readRow  = rcv ;

        $scope.showMask = true;

        $show.his.get(d, function(resp) {

            //highchart需要的数据
            var arr = [];
            if (resp.ret[0].length > 0) {
                //遍历ret组成arr
                for (var x = 0; x < resp.ret[0].length; x++) {
                    var cArr = [];
                    if (d.end - d.start < 2 * 24 * 3600 * 1000) { //如果是一天，采用的rcv时间戳
                        cArr[0] = resp.ret[0][x].rcv;
                    } else {
                        cArr[0] = resp.ret[0][x].ts;
                    }
                    cArr[1] = resp.ret[0][x].pv;
                    arr[x] = cArr;
                }
                //type标示是否是阶越曲线
                var type = d.mode == 'linear' ? false : true;

                refreshChart(d.tag, type, arr);

            } else {
                $scope.showMask = false;
                clearChart();
                angular.alert('当前时间段，无历史数据，请选择其他时间')
            }

        }, function() {
            $scope.showMask = false;
        });
    }



    //    如果变量数据类型为analog，绘制成趋势曲线
    //    如果变量数据类型为digital，绘制成阶越曲线 (  0 ,1 整型; )
    var chart;

    function refreshChart(tag, type, arr) {
        Highcharts.setOptions({
            global: {
                useUTC: false
            },
            lang: {
                //reset zoom按钮title
                resetZoom: '重置'
            }
        });
        $('#show_live_data').highcharts({
            chart: {
                zoomType: 'x',
                events: {
                    load: function() {
                        $scope.showMask = false;
                    }
                }
            },
            title: {
                text: false
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                formatter: function() {
                    return Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        '<b>' + this.series.name + '</b>：' + this.y;
                }
            },
            credits: {
                enabled: false
            },
            //导出
            exporting: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                name: tag,
                step: type,
                data: arr
            }]
        });
        chart = $('#show_live_data').highcharts();
    }

    function clearChart() {
        if (!chart) {
            chart = $('#show_live_data').highcharts();
        }
        if (chart.series.length != 0) {
            for (var i = 0; i < chart.series.length; i++) {
                chart.series[i].remove();
            }
        }
    }
})

.controller('show_system_alarm', function($scope, $show, $interval, $modal, $sys, $state) {


    $scope.$popNav($scope.system.name + "(报警)", $state);
    // var interval;
    $scope.page = {};

    // $scope.$on("$destroy", function() {
    //     $interval.cancel(interval);
    // });



    var od = {
        uuid: $scope.system.uuid
    };

    $scope.$watch("op.ala", function(n) {
        //@if  append
        console.log(n);
        //@endif

        if (n == 'a') {
            $scope.loadPageData(1);
        } else {
            $scope.page.data = [];
            $scope.page.total = 0;
            $scope.page.currentPage = 0;
        }

    });

    // 查询活跃 报警;  未确认的;
    $scope.getActiveAlarm = function(pageNo, $dom) { // 一般值 interval是, 切换是调用;
        var pg = {
            currentPage: pageNo,
            itemsPerPage: $sys.itemsPerPage
        };

        $scope.showMask = true;
        $show.alarm.get(angular.extend(od, pg), function(resp) {

            if ($dom) {
                $dom.toggleClass("show");
            }
            $scope.page.data = resp.data;
            $scope.page.total = resp.total;
            $scope.page.currentPage = pageNo;
            if (!resp.data.length) {
                // angular.alert({
                //     title: "无活跃报警数据"
                // })
            };
            $scope.showMask = false;
        }, function() {
            $scope.showMask = false;
        })
    }

    $scope.loadPageData = function(pageNo, $event) {

        if (!pageNo) {
            return;
        }
        var $dom;


        if ($event) {
            $dom = $($event.currentTarget).find("i");
            $dom.toggleClass("show");

        }


        if ($scope.op.ala == "a") { // 活跃报警
            $scope.getActiveAlarm(pageNo, $dom);
        } else { //  全部活跃;
            $scope.queryAlarm(pageNo, $dom);
        }
    }


    // 点击按钮 查询全部报警;
    $scope.queryAlarm = function(pageNo, $dom) {
        var d = {},
            op = $scope.op;
        d.start = op.start.getTime(),
            d.end = op.end.getTime();

        if (d.start > d.end) {
            angular.alert("起始时间不可超前与结束时间!");
            return;
        }

        //@if  append
        console.log(d);
        //@endif
        //var  pg = { currentPage: pageNo ,  itemsPerPage : $sys.itemsPerPage  };
        d.uuid = $scope.system.uuid,
            d.currentPage = pageNo,
            d.itemsPerPage = $sys.itemsPerPage;

        $scope.showMask = true;
        $show.alarm.save(d, null, function(resp) {
            if ($dom) {
                $dom.toggleClass("show");
            }

            $scope.page.data = resp.data;
            $scope.page.total = resp.total;
            $scope.page.currentPage = pageNo;
            if (!resp.data.length) {
                angular.alert({
                    title: "无报警数据"
                })
            }
            $scope.showMask = false;
        }, function() {
            $scope.showMask = false;
        })
    }

})

.controller('show_system_map', function($scope, $map, $state, $filter) {
 
    var map;
    $scope.initMap = function() {
        //@if  append

        console.log("initMap");
        //@endif
        // map = $map.initMap(   $scope, [$scope.system],  "station_map",   135 ); 
        map = $map.createMap($scope, "station_map", 235);

        var system = $scope.system;
        system.regionName = system.region_name //||  $scope.rg_k_v[system.region_id].name ;
        system.createTime = system.createTime || $filter("date")(system.create_time, "yyyy-MM-dd hh:mm:ss");

        var p =  new BMap.Point(system.longitude, system.latitude) ;

        $map.showSystemProp(map, p , $scope.system );
        
        map.panTo( p  ) ;
    }

})

.controller('show_system_panel', function($scope, $map, $state, $source, $http) {
    var getProUrl = "/v5/json/syalias/project.search?smid=" + $scope.system.model;

    $http.get(getProUrl).
    success(function(data, status, headers, config) {
        if (data.err) {
            console.log("Get Panel Err");
            return;
        } else {
            if (data.ret) {
                var panel_id = data.ret[0].uuid;
                $source.$user.get({
                    op: 'getack'
                }, function(sdata) {
                    if (sdata.ret) {
                        var ack = sdata.ret;
                        var sysName = $scope.system.name;
                        $scope.currentProjectUrl = "/syalias/trunk/syalias.html?ack=" + ack + "&uuid=" + panel_id + "&systemName=" + sysName;
                        //      var newUrl = "/syalias/trunk/syalias.html?ack=" + ack + "&uuid=" + panel_id;
                        //            window.open(newUrl)
                    }

                })
            }
        }
    }).
    error(function(data, status, headers, config) {
        console.log(data);
    });


})