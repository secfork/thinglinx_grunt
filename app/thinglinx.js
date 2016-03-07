 


angular.module('thinglinx', [

    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngStorage',
    'ui.router',
    'ui.bootstrap',
    'ui.validate',
    "ui.jq", 
    
    'ui.bootstrap.datetimepicker',
    'pascalprecht.translate',


    'app.basecontroller', 
    'app.account', 
    'app.model.device', 
    'app.model.system', 
    'app.project',
    'app.show.proj', 
    'app.show.system', 
    'app.system', 
    'app.system.prop',
    'app.support',
    'app.directives',
    'app.filters',
    'app.services', 
    'app.sysconfig',
    "app.utils"


])

.run(


    function($rootScope, $state, $stateParams, $sys, $compile,  $localStorage,
        $cacheFactory, $translate, $sce, $sessionStorage  , $templateCache ) {



        console.log( $templateCache );

        $('#preload').fadeOut('slow');
  
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$sys = $sys;
        $rootScope.$translate = $translate;
        $rootScope.$sceHtml = $sce.trustAsHtml;
        $rootScope.$session = $sessionStorage;
        $rootScope.fromJson = angular.fromJson;



//        $rootScope.ossRoot = "@@oss";
        $rootScope.ossRoot = "http://thinglinx-test.oss-cn-beijing.aliyuncs.com/";



        // ie ;
        // window.onbeforeunload = function() {
        //     alert("关闭窗口");
        // };

        // $rootScope.$err = $err ;

        $rootScope.$debug = $sys.$debug;

        // $rootScope.$$cache = null ;
        //@if  append

        window.test = function() {
            alert("test  function !")
        };

        $rootScope.test = function() {
                alert("test  function !")
            }
            //@endif

        // $rootScope.validate = function(data, msg) {
        //   if (!data) {
        //     alert(msg)
        //     throw Error(msg);
        //   }
        // }

        $rootScope.funtest = function() {
            //@if  append

            console.log("函数测试!");
            //@endif
        };

    }

)


.config(  function($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider,
            $filterProvider, $provide, $httpProvider, $resourceProvider , $templateCacheProvider  ) {

            console.log(  $templateCacheProvider );

            // 自定义 ajax 拦截器;
            $httpProvider.interceptors.push('Interceptor');
            // 默认前端 跨域;
            //$httpProvider.defaults.withCredentials = true;
 
          

            $resourceProvider.defaults.actions = {
                put:    {method:"PUT"},
                get:    {method: "GET"},
                post: { method:"POST"},
                "delete": {method: "DELETE"} ,
                remove:   {method: "DELETE"},
 
                getByPk:{method:"GET"} , 
                delByPk:{ method:"DELETE"}, 
                save:   {method: "POST"},

                getArr: {method: "GET", isArray: !0},
                query:  {method:"GET"} 

            }

 


            // lazy controller, directive and service
            app.controller = $controllerProvider.register;
            app.directive = $compileProvider.directive;
            app.filter = $filterProvider.register;
            app.factory = $provide.factory;
            app.service = $provide.service;
            app.constant = $provide.constant;
            app.value = $provide.value;



            $urlRouterProvider
            //.otherwise('/access/signin');
            //.otherwise('/app/template');
            //.otherwise('/app/proj/manage');
                .otherwise('/app');

          

            $stateProvider.state('app', {
                //abstract: true,
                url: '/app',
                templateUrl: 'athena/app.html',
                resolve: {
                    userResp: function($source) {                        
                        return $source.$common.get({
                            op: "islogined"
                        }).$promise
                    }
                },
                controller: function($scope, $state, $sys, userResp) {

                    //后台判断是否已经登录;
                    var user = userResp.ret;
                   

                    if (user) {
                        user.sms_notice = !!user.sms_notice;
                        user.mail_notice = !!user.mail_notice;

                        $scope.user = user;
                        $scope.$$user = user;

                        //@if  append
                        console.log("sessionStorage 含有user");
                        //@endif

                        // 是 app 路由转到 rootState ;
                        // rootstate = app.prpj.namage ;
                        $state.is("app") ? $state.go($sys.rootState) : undefined;

                        $scope.user = user;

                    } else { 
                        //  if( !$sys.$debug ){
                        $state.go('access.signin');
                        //  }
                    };


                }

            }) 
            //  模版 =================================
            .state("app.s_region", {
                url: "/s_region",
                controller: "manage_projs",
                data: {
                    isShowModul: true
                },
                templateUrl: "athena/region/project_temp.html"
            })

            .state("app.s_region_system", {
                    url: "/s_region/{id}/{name}",  // region_id ;
                    // controller: "proj_prop",
                    data: {
                        isShowModul: true
                    }, 
                    controller: "s_region_system",
                    templateUrl: "athena/show/region_system.html"

                })


            /*========================*/

            .state("app.s_system", {
                url: "/s_system",
                templateUrl: "athena/dastation/dastation_temp.html",
                data: {
                    isShowModul: true
                },
                controller: "dastation_ignore_active"
            })


            .state("app.s_system_prop", {
                url: "/s_system_prop/:uuid",
                resolve: {
                    _$system : function( $source , $stateParams ){
                        //$source.$system.getByPk( {pk: $stateParams.uuid}).$promise ;
                        return $source.$system.get({
                                        system_id: $stateParams.uuid,
                                        tag: true
                                    }).$promise

                    }

                },
                controller: "show_system_prop",
                templateUrl: "athena/show/system_prop.html"
            })

            .state("app.s_system_prop.basic", {
                url: "/_basic",
                templateUrl: "athena/show/system_prop_basic.html",
                controller: "show_system_basic"

            })

            .state("app.s_system_prop.current", {
                    url: "/_current",
                    templateUrl: "athena/show/system_prop_current.html",
                    controller: "show_system_current"
                })
                .state("app.s_system_prop.history", {
                    url: "/_history",
                    templateUrl: "athena/show/system_prop_history.html",
                    controller: "show_system_history"
                })

                .state("app.s_system_prop.alarm", {
                    url: "/_alarm",
                    templateUrl: "athena/show/system_prop_alarm.html",
                    controller: "show_system_alarm"
                })


            .state("app.s_system_prop.map", {
                url: "/_map",
                templateUrl: "athena/show/system_prop_map.html",
                //template: "<div class='panel-body h-full' id='station_map' > 423 </div>",
                controller: "show_system_map"
            })

            // syalias
            .state("app.s_system_prop.panel", {
                url: "/_panel",
                templateUrl: "athena/show/system_prop_panel.html",
                //template: "<div class='panel-body h-full' id='station_map' > 423 </div>",
                controller: "show_system_panel"
            })


            .state("app.s_alarm", {
                url: "/alarm",
                templateUrl: "athena/show/alarm.html",
                controller: "show_alarm"
            })


            //===========================================================
            .state("app.my_detail" , {
                url:"/userself",
                templateUrl:"athena/account/user_detail.html",
                controller:"account_userdetail"
            })

 
            //===========================================================


            .state("app.devmodel", {
                    url: "/devmodel",
                    templateUrl: "athena/template/template.html",
                    controller: 'devmodel'

                })
                .state("app.sysmodel", {
                    url: "/sysmodel",
                    templateUrl: "athena/sysmodel/sysmodel.html",
                    controller: 'sysmodel'
                })


            .state("app.sysmodel_p", {
                    url: "/sysmodel_p/{uuid}", 
                    templateUrl: 'athena/sysmodel/sysmodel_prop.html',
                    controller: "sysmodelProp"
                })
                .state("app.sysmodel_p.basic", {
                    url: "/basic",
                    templateUrl: "athena/sysmodel/sys_basic.html",
                    controller: "sysmodel_basic"
                })
                .state("app.sysmodel_p.sysdevice", {
                    url: "/sysdevice",
                    templateUrl: "athena/sysmodel/sys_device.html",
                    controller: "sysmodel_device"
                })
                .state("app.sysmodel_p.systag", {
                    url: "/systag",
                    templateUrl: "athena/sysmodel/sys_tag.html",
                    controller: "sysmodel_tag"
                })

            .state("app.sysmodel_p.sysprofile", {
                    url: "/sysprofile",
                    templateUrl: "athena/sysmodel/sys_profile.html",
                    controller: "sysmodel_profile"
                })
                .state("app.sysmodel_p.trigger", {
                    url: "/trigger",
                    templateUrl: "athena/sysmodel/sys_proftrigger.html",
                    controller: "sysmodel_prof_trigger"
                })

            .state("app.sysmodel_p.message", {
                    url: "/message",
                    templateUrl: "athena/sysmodel/sys_message_center.html",
                    controller: "sysmodel_message"
                })
            .state("app.sysmodel_p.gateway", {
                url: "/gateway",
                templateUrl: "athena/sysmodel/sys_gateway.html",
                controller: "sysmodel_gateway"
            })

            // dyalias
            .state("app.sysmodel_p.panel", {
                url: "/panel",
                templateUrl: "athena/sysmodel/sys_panel.html",
                controller: "sysmodel_panel"
            })



            //===========================================================
            //===========================================================


            .state("app.m_region", {
                url: "/m_region",
                controller: "manage_projs",
                templateUrl: "athena/region/project_temp.html"
            })


            //   项目 属性 ; ==============================================
            .state("app.m_region_prop", {
                    url: "/m_regipn/{id}",
                    controller: "proj_prop",
                    resolve: {
                        regionResp : function($source , $stateParams){
                            return  $source.$region.get( {pk:$stateParams.id} ).$promise ;
                        }
                    },
                    templateUrl: "athena/region/pro_man_prop.html"
                })
            // 得到项目所在的系统 属性;
            // app.proj_prop 被忽略掉; 才可;
            .state("app.m_region_prop.system", {
                url: "/system",
                // controller: "proj_prop_station",
                controller:"dastation_ignore_active",
                templateUrl: "athena/dastation/dastation_temp_panel.html"
            })
            // 项目自身属性;
            .state("app.m_region_prop.author", {
                url: "/author",
                controller: "proj_prop_author",
                templateUrl: "athena/region/prop_author.html"
            })


            //==========采集站 =====================   class="fade-in-right-big smooth"

            //================
            .state("app.m_system", {
                url: "/m_system",
                controller: "dastation_ignore_active",
                templateUrl: "athena/dastation/dastation_temp.html"
            })


            // 采集站 属性;
            .state("app.m_system_prop", {
                    //abstract:true ,
                    url: "/m_system/{uuid}", // 开始就传递 station id 参数;
                    controller: "dastation_prop",
                    resolve: {
                        systemResp :function( $source , $stateParams ){
                            return $source.$system.get({
                                        system_id: $stateParams.uuid
                                    }).$promise ;
                        }
                    },
                    templateUrl: "athena/dastation/dastation_prop.html"
                })
                //========================

            // 又分  dastation 的 好多 tab  属性;
            .state("app.m_system_prop._basic", {
                url: "/_basic",
                controller: "das_basic",
                templateUrl: "athena/dastation/prop_basic.html"
            })

            .state("app.m_system_prop._config", {
                url: "/_config",
                controller: "das_config",
                templateUrl: "athena/dastation/prop_config.html"
            })


            // 系统信息版( sation 中 使用 );  描述信息版(外部描述 ,);
            .state("app.m_system_prop.tag", {
                    url: "/_tag",
                    controller: "das_tag",
                    templateUrl: "athena/sysmodel/sys_tag.html"
                })
                .state("app.m_system_prop.trigger", {
                    url: "/_trigger",
                    controller: "das_trigger",
                    templateUrl: "athena/sysmodel/sys_proftrigger.html"
                })
                .state("app.m_system_prop.message", {
                    url: "/_message",
                    controller: "das_message",
                    templateUrl: "athena/sysmodel/sys_message_center.html"
                })

            .state("app.m_system_prop.contact", {
                url: "/_contact",
                templateUrl: "athena/dastation/prop_contact.html",
                controller: "das_contact"
            })

            .state("app.m_system_prop._map", {
                url: "/_map",
                controller: "das_map",
                templateUrl: "athena/dastation/prop_map.html"
                    // http://api.map.baidu.com/api?v=1.5&ak=M9b53slaoqAKQj8jX0CRz6xA" type="text/javascript
              
               

            })



            // athena_user --------------------------------------------------


            .state("app.account.info", {
                url: "/info",
                controller: "account_info",
                templateUrl: "athena/account/info.html"
            })

            .state("app.user", {
                url: "/user",
                templateUrl: "athena/account/users.html",
                controller: "account_users"
            })
            .state("app.userdetail" , {
                url:"/userdetail/:id",
                templateUrl:"athena/account/user_detail.html",
                controller:"account_userdetail"
            })




            //app.account.author
            // 账户 -->编辑权限;
            .state("app.role", {
                url: "/role",
                // controller: "acco_role",
                templateUrl: "athena/account/role.html"
            })



                .state("app.role.region", {
                    url: "/region",
                    data:{ role_category:1},
                    templateUrl: "athena/account/role_panel.html",
                    controller: "role_ctrl"
                })
                .state("app.role.account", {
                    url: "/account",
                    data:{ role_category:0},
                    templateUrl: "athena/account/role_panel.html",
                    controller: "role_ctrl"
                })

            .state("app.account_info",  {
                 url:"/account",
                 controller:"account_info",
                 templateUrl:"athena/account/account_info.html"
            })
            .state("app.account_weichat" , {
                url:"/weichat",
                controller:"account_weichat",
                templateUrl:"athena/account/account_weichat.html"
            })

            //================================================================
            //================================================================

            //   access/signin
            .state('access', {
                    url: '/access',
                    template: '<div ui-view class="   h-full smooth"></div>',
                    resolve: {
                        $user: function() {

                            //  return   window.loginUserPromise
                        }
                    }
                })
                .state('access.signin', {
                    url: '/signin',
                    controller: "access_signin",
                    templateUrl: 'athena/page_signin.html'
                })


            .state('access.signup', {
                    url: '/signup',
                    controller: "access_signup",
                    templateUrl: 'athena/page_signup.html'
                })
                .state('access.forgotpwd', {
                    url: '/forgotpwd',
                    controller: "access_fogpas",
                    templateUrl: 'athena/page_forgotpwd.html'
                })

            .state("access.verifyemail", {
                url: "/verifyemail",
                controller: "verifyemail",
                templateUrl: "athena/page_verifyemail.html"
            })

            .state('access.404', {
                url: '/404',
                templateUrl: 'tpl/page_404.html'
            })

            //============ access  ===========================================================
            // 联系我们; 技术支持; 使用条款; 问题反馈; 帮助;
            // .state("support", {
            //   url:"support",
            //   template:'<div ui-view class="smooth"></div>'
            // })
            .state("conncet", {

                })
                .state('app.tech', {
                    url: "/tech",
                    templateUrl: "athena/support/tech.html",
                    controller: "tech"

                })
                .state("app.tech_detail", {
                    url: "/techdetail",
                    templateUrl: "athena/support/techdetail.html",
                    controller: "techdetail"
                })
                .state('protocol', {})
                .state('htlp', {})




        }
     
)

.constant('JQ_CONFIG', {

    // wysiwyg: ['lib/wysiwyg/bootstrap-wysiwyg.js',
    //           'lib/wysiwyg/jquery.hotkeys.js'
    //         ]
    //         
    easyPieChart:   ['lib/flot/jquery.easy-pie-chart.js'],

    chosen: [
        'lib/chosen/chosen.jquery.min.js',
        'lib/chosen/chosen.css'
    ],
    filestyle: [
        'lib/file/bootstrap-filestyle.min.js'
    ]

})

.config(['$translateProvider', function($translateProvider) {


    $translateProvider.useStaticFilesLoader({
        prefix: 'l10n/',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('zh_CN');
    $translateProvider.useLocalStorage();


}])

;

//  这样的话    grunt - ngTempalte 命令 生成的 代码会放到 bootstrap(); 之后 , html 模版就不能用了;
// angular.bootstrap( document.getElementsByTagName("body") , ['thinglinx'])



     

 