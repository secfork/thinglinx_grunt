// 管理-项目-管理; project 



angular.module('app.project', [])

.controller("manage_projs", function($scope, $source, $state, $utils,

    $filter, $timeout, $sys, $localStorage, $modal) {

    var thatScope = $scope ;

    //@if  append

    // 加载 projects ;
    console.log("manage_projs"  , $scope.user ); // postcode
    //@endif 

    $scope.pop = {
        templateUrl: "athena/debris/_edit_field.html",
    };



    //是否为 show 模块;
    $scope.isShowModul = $state.$current.data && $state.$current.data.isShowModul;

    $scope._$nextState = $scope.isShowModul ? 'app.s_region_system' : 'app.m_region_prop.system';

    // if ($scope.isShowModul) {
    //     $scope.$moduleNav("项目", $state);
    // } else {
    //jjw 区域
    $scope.$moduleNav('全部区域', $state);
    // }


    var per = $sys.itemsPerPage;
    $scope.page = {};
    $scope.loadPageData = function(pageNo) {
        $scope.showMask = true;

        var d = {
            itemsPerPage: per,
            currentPage: pageNo,
            name: $scope.f_projname
        };

        var lll = $source.$region.query(d, function(resp) {
            $scope.showMask = false;
            $scope.page = resp;
            $scope.page.currentPage = pageNo;

        }, function() {
            $scope.showMask = false;
        });

        console.log(3333333333333333333, lll)
    };




    var region_ids = [];
    $scope.collectRegionId = function(region, $last) {
        region_ids.push(region.id);

        if ($last) {
            getActiveSum(region_ids);
            !$scope.isShowModul && getUnActiveSum(region_ids);
        }
    }


    function getActiveSum(region_ids) {
        $source.$region.save({
            pk: "sum",
            state: 1
        }, region_ids, function(resp) {
            resp.ret.forEach(function(v, i) {
                $("#act_" + v.region_id).text(v.count);
            })
        })
    }


    function getUnActiveSum(region_ids) {
        $source.$region.save({
            pk: "sum",
            state: 0
        }, region_ids, function(resp) {
            resp.ret.forEach(function(v, i) {
                $("#unact_" + v.region_id).text(v.count);
            })
        })
    }

    $scope.loadPageData(1);


    /*
     * 从 fps 中移除, 从 filterP 中移除;   从 allprojects 中移除;
     * */
    $scope.delProject = function(proj, index) {

        $scope.confirmInvoke({
                title: "删除区域: " + proj.name,
                warn: "确认要删除该区域吗?"
            },
            function(next) {
                $source.$region.delete({
                    pk: proj.id
                }, function(resp) {

                    $scope.page.data.splice(index, 1);

                    next();
                }, next)
            }
        )
    }

    $scope.addProj = function() {
        $modal.open({
            templateUrl: "athena/region/project_add_temp.html",
            controller: function($scope, $modalInstance) {
                $scope.__proto__ = thatScope;
                $scope.$modalInstance = $modalInstance;
                $scope.proj = {};

                $scope.done = function(e) {
                    console.log(e)
                    $scope.validForm();

                    $scope.showMask = true;
                    $source.$region.save($scope.proj, function(resp) {
                        //resp.ret && $state.go("app.proj.manage");  
                        $scope.showMask = false;
                        $scope.proj.id = resp.ret;

                        $scope.page.data.unshift(angular.copy($scope.proj));
                        $scope.cancel();

                        //  angular.alert("添加成功!");
                    }, function() {
                        $scope.showMask = false;
                    })


                }
            }
        })

    }

    $scope.updateRegion = function(fieldObj) {

        return $source.$region.put({
            pk: fieldObj.id
        }, fieldObj).$promise;
    }

})


// -------------------- project 属性  ------------------------------------------
.controller("proj_prop", function($scope, $state, $stateParams, regionResp) {
    //@if  append

    console.log("manage_proj_prop");
    //@endif 
 

    //是否为 show 模块;
    $scope.isShowModul = $state.$current.data && $state.$current.data.isShowModul;

    $scope._$mapState = $scope.isShowModul ? 'app.show.system_prop.map' : 'app.station.prop._map';
    $scope._$stationState = $scope.isShowModul ? "app.show.system_prop.current" : "app.station.prop._basic";


    $scope.project = regionResp.ret;

    // $scope.title = $scope.project.name;

    $stateParams.$backText = $scope.project.name;

    //@if  append
    console.log($scope.project);
    //@endif 

})

// ==========================================================================================

//  proj_prop_system ;  使用 dastation_ignore_state 控制器; 


// 区域 权限用户;  
.controller("proj_prop_author", function($scope, $state, $sys, $source, $translate, $utils) {

    //@if  append
    console.log("proj_prop_author");
    //@endif 


    $state.current.text = $scope.project.name;



    var textArr = [];
    $scope.privilge2Text = function(privileges) {
        textArr = [];
        privileges && privileges.forEach(function(v, i) {
            textArr.push($translate.instant(v));
        })
        return textArr.join(";");
    }
 
    $scope.page = {};
    $scope.loadPageData = function(pageNo) {
        $source.$region.query({
            op: "authoruser",
            region_id: $scope.project.id,
            currentPage: pageNo,
            itemsPerPage: $sys.itemsPerPage
        }, function(resp) {
            $scope.page.data = resp.data;
            $scope.page.total = resp.total;
            $scope.page.currentPage = pageNo;
        })
    }

    $scope.loadPageData(1);
    var userIds = [];
    $scope.getUser = function(u, isLaset) {
        userIds.push(u.user_id);
        if (isLaset) {
            ///users?accesskey={accesskey}[&id={user_id}...]
            $source.$user.get({
                op: "select",
                id: userIds
            }, function( resp ) {
                resp.ret.forEach( function( v , i ){
                    console.log(v)
                    $("#user_"+ v.id ).text( v.username )

                }) 
            })
        }

        // $source.$user.get({
        //     pk: u.user_id
        // }, function(resp) {
        //     u.username = resp.ret && resp.ret.username;
        //     u.is_super_user = resp.ret && resp.ret.is_super_user;
        // })

    }


})


// 加载工程 属性字段;
.controller("proj_prop_attr", function($state, $scope, $source) {

    //@if  append

    console.log("proj_prop_attr");

    console.log($scope);
    //@endif 

    $scope.$popNav($scope.project.name + "(属性)", $state);


    $scope.proj = angular.copy($scope.project);



    $scope.od = {};

    // 得到 区域的 订阅; 
    function getSubOfRegion(proj_id) {

        $source.$sub.get({
            op: "select",
            region: proj_id,
            user: $scope.user.id
        }, function(resp) {
            $scope.od.sub_id = resp.ret[0] && resp.ret[0].id;
            $scope.od.issubed = !!$scope.od.sub_id;

        })
    }

    getSubOfRegion($scope.proj.id);

    // 编辑区域的订阅; 
    function createSubOfRegion() {

        var d = {
            filter: {
                region_id: $scope.proj.id,
                type: "alarm"
            },
            sendee: {
                user_id: $scope.user.id
            }
        }

        $source.$sub.save({
            op: "create"
        }, d, function(resp) {
            $scope.od.sub_id = resp.ret;
            $scope.od.issubed = true;
        })

    }

    function delSubOfRegion() {
        $source.$sub.get({
            op: "delete",
            pk: $scope.od.sub_id
        }, function(resp) {
            $scope.od.sub_id = undefind;
        })
    }

    $scope.editSub = function() {
        // change 之后的 值,  逻辑正好反转; 
        ($scope.od.issubed ? createSubOfRegion : delSubOfRegion)();
    }



    $scope.commit = function() {

        $scope.validForm();

        // delete $scope.project.create_time;

        $source.$region.put({
            pk: $scope.project.id
        }, $scope.proj, function(resp) {
            angular.alert("修改成功!");

            angular.extend($scope.project, $scope.proj);
        })


    };


})

;
