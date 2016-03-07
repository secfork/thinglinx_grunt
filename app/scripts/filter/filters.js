//'use strict';

/* Filters */
// need load the moment.js to use this filter.

 


    angular.module('app.filters', [])
        .filter('fromNow', function() {
            return function(date) {
                return moment(date).fromNow();
            }
        })
        .filter("hour", function() {
            return function(data) {
                return data + "时"
            }
        })

    .filter("log_cycle", function() {
        return function(data) {
            if (!data) return "不保存历史";
            if (data <= 60)
                return data + "秒";
            else {
                return data / 60 + "分钟";
            }
        }
    })

    .filter("params", function($sys, $translate) {

        return function(data) {
            // console._log($translate.instant('th.station'));

            var k, s;
            data = angular.fromJson(data);
            var ret = [];
            for (k in data) {
                s = $translate.instant("params." + k);
                ret.push(s + "=" + data[k]);
            }
            return ret.join(", ");
        }
    })

    .filter("pageLimit", function($sys) {
            var l = $sys.pager.itemsPerPage
            return function(array, currentPage) {
                s = (currentPage - 1) * l;
                return array.slice(s, s + l)
            }
        })
        .filter("acrollLimit", function() {
            return function(array, start, end) {

                return array;
            }
        })



    .filter("driverValueTrans", function($sys) {
        var rel;
        return function(k, v, type, version) {
            console._log(k, "---", v, "---", type, "----", version);
            // 实际上要根据 type 翻译;
            if (type === "device") {
                return $sys.device_modbus[k + ""] ? $sys.device_modbus[k + ""][v].k : v; // 实际应该是 $sys.device_modubs[version][k][v][k]
            }

            if (type === "log") {
                return $sys.temp_point[0][k] ? $sys.temp_point[0][k][v].k : v;
                //实际应为; 

            }
            if (type === "alarm") {
                return v //$sys                
            }

            return v;

        }
    })
 