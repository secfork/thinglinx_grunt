/* Directives */
// All the directives rely on jQuery.

 



    angular.module('app.directives', ['pascalprecht.translate'])

    // popwin = "templateUrl"
    // 主键默认 为  id ;  为其他是 需要设置 pk = "uuid||xxx" 其他值 ; 
    //  { pk , prop }   fa fa-pencil    glyphicon  glyphicon-edit    text-muted
    .directive("popwin", function($compile, $templateCache, $http) {

        return {
            restrict: "E",
            require: "?^ngModel",
            replace:true,
            scope: {},
            // template: ' <a class=" text-muted  {{:: __$$icon || \'glyphicon  glyphicon-edit\' }} m-l-xs  "  popover-placement="bottom"  popover-template =" pop.templateUrl "  popover-title=" {{ pop.title }}" />',
            template: ' <a class=" text-muted   fa fa-pencil  m-l-xs  {{::__$classfor}} "  popover-is-open="isOpen" popover-placement="bottom"  popover-template =" pop.templateUrl "  popover-title=" {{ pop.title }}" />',
            link: function($scope, $ele, $attrs, $model) {

                $scope.__$classfor = $attrs.classfor ; 
                
                $scope.isOpen = false ;
                $scope.pop = {
                    templateUrl: "athena/debris/_edit_field.html"
                };

                var prop = $attrs.prop;
                var idObj = {},
                    idkey;

                $model.$formatters.push(function(v) {
                     if(!v){
                        return ; 
                     }
                    idkey = $attrs.pk || "id",
                        idObj[idkey] = v[idkey];
                    $scope.$ov = {
                        value: v[prop]
                    };

                });

                $scope.done = function() {

                    idObj[prop] = $scope.$ov.value;

                    $ele.parent().scope()[$attrs.handler](idObj).then(function() {

                        $model.$modelValue[prop] = $scope.$ov.value;
                        $model.$commitViewValue();
                        $scope.isOpen = false ;
                    });
                };

                $scope.cancel = function(){
                    $scope.isOpen = false ;
                }

            }
        }



    })


    .directive(
        'uiModule', ['MODULE_CONFIG', 'uiLoad', '$compile',
            function(MODULE_CONFIG, uiLoad, $compile) {
                return {
                    restrict: 'A',
                    compile: function(el, attrs) {
                        var contents = el.contents().clone();
                        return function(scope, el, attrs) {
                            el.contents().remove();
                            uiLoad.load(MODULE_CONFIG[attrs.uiModule])
                                .then(function() {
                                    $compile(contents)(scope,
                                        function(clonedElement, scope) {

                                            if (attrs.to) {
                                                $(attrs.to).append(clonedElement)
                                            } else {
                                                el.append(clonedElement);
                                            }

                                        });
                                });
                        }
                    }
                };
            }
        ])



    .directive('uiShift', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            link: function(scope, el, attr) {
                // get the $prev or $parent of this el
                var _el = $(el),
                    _window = $(window),
                    prev = _el.prev(),
                    parent, width = _window
                    .width();

                !prev.length && (parent = _el.parent());

                function sm() {
                    $timeout(function() {
                        var method = attr.uiShift;
                        var target = attr.target;
                        _el.hasClass('in') || _el[method](target).addClass('in');
                    });
                }

                function md() {
                    parent && parent['prepend'](el);
                    !parent && _el['insertAfter'](prev);
                    _el.removeClass('in');
                }

                (width < 768 && sm()) || md();

                _window.resize(function() {
                    if (width !== _window.width()) {
                        $timeout(function() {
                            (_window.width() < 768 && sm()) || md();
                            width = _window.width();
                        });
                    }
                });
            }
        };
    }])

    .directive('uiToggleClass', ['$timeout', '$document', function($timeout, $document) {
            return {
                restrict: 'AC',
                link: function(scope, el, attr) {
                    el.on('click', function(e) {
                        e.preventDefault();
                        var classes = attr.uiToggleClass.split(','),
                            targets = (attr.target && attr.target
                                .split(',')) || Array(el),
                            key = 0;
                        angular.forEach(classes, function(_class) {
                            var target = targets[(targets.length && key)];
                            (_class.indexOf('*') !== -1) && magic(_class, target);
                            $(target).toggleClass(_class);
                            key++;
                        });
                        $(el).toggleClass('active');

                        function magic(_class, target) {
                            var patt = new RegExp('\\s' + _class.replace(/\*/g,
                                    '[A-Za-z0-9-_]+')
                                .split(' ')
                                .join('\\s|\\s') + '\\s', 'g');
                            var cn = ' ' + $(target)[0].className + ' ';
                            while (patt.test(cn)) {
                                cn = cn.replace(patt, ' ');
                            }
                            $(target)[0].className = $.trim(cn);
                        }
                    });
                }
            };
        }])
        .directive('uiNav', ['$timeout', function($timeout) {
            return {
                restrict: 'AC',
                link: function(scope, el, attr) {
                    var _window = $(window),
                        _mb = 768,
                        wrap = $('.app-aside'),
                        next, backdrop = '.dropdown-backdrop';
                    // unfolded
                    el.on('click', 'a', function(e) {
                        next && next.trigger('mouseleave.nav');
                        var _this = $(this);
                        _this.parent().siblings(".active")
                            .toggleClass('active');
                        _this.next().is('ul') && _this.parent().toggleClass('active') && e.preventDefault();
                        // mobile
                        _this.next().is('ul') || ((_window.width() < _mb) && $('.app-aside')
                            .removeClass('show off-screen'));
                    });

                    // folded & fixed
                    el.on('mouseenter', 'a', function(e) {
                        next && next.trigger('mouseleave.nav');

                        if (!$('.app-aside-fixed.app-aside-folded').length || (_window.width() < _mb))
                            return;
                        var _this = $(e.target),
                            top, w_h = $(window).height(),
                            offset = 50,
                            min = 150;

                        !_this.is('a') && (_this = _this.closest('a'));
                        if (_this.next().is('ul')) {
                            next = _this.next();
                        } else {
                            return;
                        }

                        _this.parent().addClass('active');
                        top = _this.parent().position().top + offset;
                        next.css('top', top);
                        if (top + next.height() > w_h) {
                            next.css('bottom', 0);
                        }
                        if (top + min > w_h) {
                            next.css('bottom', w_h - top - offset).css('top',
                                'auto');
                        }
                        next.appendTo(wrap);

                        next.on('mouseleave.nav', function(e) {
                            $(backdrop).remove();
                            next.appendTo(_this.parent());
                            next.off('mouseleave.nav').css('top', 'auto')
                                .css('bottom', 'auto');
                            _this.parent().removeClass('active');
                        });

                        $('.smart').length && $('<div class="dropdown-backdrop"/>')
                            .insertAfter('.app-aside').on('click',
                                function(next) {
                                    next
                                        && next
                                        .trigger('mouseleave.nav');
                                });

                    });

                    wrap.on('mouseleave', function(e) {
                        next && next.trigger('mouseleave.nav');
                    });
                }
            };
        }])
        .directive('uiScroll', ['$location', '$anchorScroll',
            function($location, $anchorScroll) {
                return {
                    restrict: 'AC',
                    link: function(scope, el, attr) {
                        el.on('click', function(e) {
                            console.log(attr.uiScroll);
                            $location.hash(attr.uiScroll);
                            $anchorScroll();
                        });
                    }

                };
            }
        ])
        .directive('uiFullscreen', ['uiLoad', function(uiLoad) {
            return {
                restrict: 'AC',
                template: '<i class="fa fa-expand fa-fw text"></i><i class="fa fa-compress fa-fw text-active"></i>',
                link: function(scope, el, attr) {
                    el.addClass('hide');
                    //@if  append

                    console.log("加载 fullscreen .js 文件!");
                    //@endif 
                    uiLoad.load('lib/js/screenfull.min.js').then(function() {
                        if (screenfull.enabled) {
                            el.removeClass('hide');
                        }
                        el.on('click', function() {
                            var target;
                            attr.target && (target = $(attr.target)[0]);
                            el.toggleClass('active');
                            screenfull.toggle(target);
                        });
                    });
                }
            };
        }])
        // ajax 加载时 动作条; 



    // state 切换是动作条; 
    .directive('uiButterbar', ['$rootScope', '$location', '$anchorScroll',

            function($rootScope, $location, $anchorScroll) {
                return {
                    restrict: 'AC',
                    template: '<span class="bar" ></span>',
                    link: function(scope, el, attrs) {
                        //@if  append

                        console.log("bbbb", el);
                        //@endif 
                        el.addClass('butterbar hide');


                        scope.$on('$stateChangeStart', function(event) {
                            $location.hash('app');
                            $anchorScroll();
                            el.removeClass('hide').addClass('active');
                        });
                        scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
                            event.targetScope.$watch(
                                '$viewContentLoaded',
                                function() {
                                    el.addClass('hide').removeClass('active');
                                })
                        });
                    }
                };
            }
        ])
        .directive('setNgAnimate', ['$animate', function($animate) {
            return {
                link: function($scope, $element, $attrs) {
                    $scope.$watch(function() {
                        return $scope.$eval($attrs.setNgAnimate,
                            $scope);
                    }, function(valnew, valold) {
                        $animate.enabled(!!valnew, $element);
                    });
                }
            };
        }])

    // =================================================================================

    .directive('draggable', function($document) {
        return function(scope, element, attr) {
            //@if  append

            console.log(attr);
            console.log(element);
            console.log($document);
            //@endif 

            var startX = 0,
                startY = 0,
                x = 0,
                y = 0;

            element.css({
                position: 'relative',
                border: '1px solid red',
                backgroundColor: 'lightgrey',
                cursor: 'pointer'
            });

            element.on('mousedown', function(event) {
                // Prevent default dragging of selected
                // content
                event.preventDefault();
                startX = event.pageX - x;
                startY = event.pageY - y;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            });

            function mousemove(event) {
                y = event.pageY - startY;
                x = event.pageX - startX;
                element.css({
                    top: y + 'px',
                    left: x + 'px'
                });
            }

            function mouseup() {
                $document.unbind('mousemove', mousemove);
                $document.unbind('mouseup', mouseup);
            }
        };
    })



    .directive("token", function($compile, $timeout) {
        // disabled
        var spinner = '<i class="fa fa-spin hide fa-spinner pull-right" ></i>';
        return {
            restrict: "A",
            require: ["?^ngDisabled"],
            link: function(scope, $ele, attrs, fn) {

                // if( $ele.is("a") ){  // a 标签  没有 disabled 属性

                //     $ele.on("click", function ( e ){
                //         console.log("-------------------"); 
                //         $timeout( function(){
                //             scope._$preventDefault = false ;
                //         }, attrs.token || 2000 )
                //     } ) 
                //     return ;
                // }


                $ele.css({
                    opacity: 1
                });

                if (attrs.spinner != undefined) {
                    $ele.append(spinner);
                }

                $ele.on("click", function() {
                    var that = this;

                    that.disabled = true;
                    $(that).find("i").toggleClass("show")

                    $timeout(function() {
                        that.disabled = false
                        $(that).find("i").toggleClass("show")
                    }, attrs.token || 2000)
                });
            }

        }
    })


    .directive("mark", function() {
        return {
            restrict: 'E',
            replace: true,
            template: '<span class="text-danger font-bold">*</span>',
            link: function() {
                //@if  append

                console.log("mark!");
                //@endif 
            }
        };
    })

    .directive("centered", function($timeout) {
        return function(scope, $element, attr) {

            var wh, dh, st;
            wh = $(window).height();
            st = $(window).scrollTop();

            $element.css({
                display: "none"
            });

            $element.ready(function() {
                $timeout(function() {
                    //@if  append

                    console.log(wh, dh);
                    //@endif 
                    dh = $element.height();
                    dh ? $element.offset({
                        top: dh < wh ? st + (wh - dh) / 2 : 0
                    }) : $element.offset({
                        top: 10
                    });

                    $element.css({
                        display: "block"
                    });
                }, 200);
            });
        }
    })


    .directive("wrap", function() {

        var x = '<div class="form-group">' +
            '<div class="col-sm-3 col-sm-offset-1 control-label"></div></div>'

        return function(s, e, a) {
            e.wrap(x);
        }
    })


    .directive("wrapL", function() {
        var x = '<div class="form-group"><div class="col-sm-3 col-sm-offset-1 control-label"></div></div>'

        return function(s, e, a) {
            e.wrap(x);
        }
    })

    .directive('tlWrap', wrap)


    .directive('tlWrapL', wrap)



    .value("valid", function($scope, $ele, $attrs, $translate, $compile, modelCtrl) {


        $scope.m = modelCtrl;

        function v(type, value) {
            var msg = $translate.instant("valid." + type);
            if (value) {
                msg = msg.replace("X", value);
            }

            $ele.after(
                $compile("<p class='text-danger m-n " + type + " '   ng-if=' m.$dirty &&  m.$error." + type + "' >" + msg + " </p>")($scope)
            );

        }

        if ($attrs.required) {
            if ($attrs.type) {
                var msg = $translate.instant("valid." + $attrs.type);
                $ele.after(
                    $compile("<p class='text-danger' ng-if=' m.$dirty &&  m.$error.required' >" + msg + " </p>")($scope)
                );
            } else {
                v("required");
            }
        } else {
            // return ; // 无required ; 其他的就不验证了; 
        };

        if ($attrs.type) {
            v($attrs.type)
        }

        if ($attrs.max) {
            v("max", $attrs.max);
        }

        if ($attrs.min) {
            v("min", $attrs.min);
        }

        if ($attrs.ngMinlength) {
            v("minlength", $attrs.ngMinlength);
        }
        if ($attrs.ngMaxlength) {
            v("maxlength", $attrs.ngMaxlength);
        }

        // ui-validate , 自定义的验证; 带完成; ( require:"uiValidate"); 
    })



    .directive("hexSimulator", function() {
        return {
            restrict: "E",
            scope: {
                data: "=",
                notation: "="
            },
            replace: true,
            template: // "<div><div>xxxx</div>" +
                "<div  class='row hex' > " +
                "<ul class='col-xs-2 col-xs-offset-2 text-right'>" +
                " <li ng-if='notation>16' >高16位</li><li>低16位</li></ul>" +
                "<ul class=' col-xs-7 hex-ul ' > " +
                "<li  ng-repeat='  b in byte track  by $index ' " +
                "  class='btn'     ng-class='{ \"btn-default\":b==0,\"btn-info\":b==1" +
                "   ,\"m-l-sm\": !($index%8) " +
                " } '  " +
                "       ng-click = ' updataHex(  $index ) '   popover='{{notation -$index-1 || 0 }}' popover-trigger='mouseenter'   >   " +
                "  {{b}}    " +
                " </li> " +


                "</ul>" +
                "</div> ",
            // + " </div>",



            link: function($scope, $ele, $attrs) {
                //$scope.notation = 32;// 16 进制 ?;  //32位 ?
                $scope.$watch("notation", function(n, o) {
                    // $scope.data = undefined ;
                    if (n != o) $scope.data = undefined;
                    $scope.byte = [];
                    while ($scope.byte.length < n) {
                        $scope.byte.unshift(0);
                    }
                });


                $scope.$watch("data", function(n, o) {
                    $scope.byte = [];
                    if (n) {
                        var bytestr = parseInt(n, 16).toString(2);
                        for (var i = 0; i < bytestr.length; ++i) {
                            $scope.byte.push(parseInt(bytestr[i]));
                        }
                    }
                    //  byte 位数不够, 不够的补 0 ;
                    while ($scope.byte.length < $scope.notation) {
                        $scope.byte.unshift(0);
                    }
                });

                // butten 更新到input ;
                $scope.updataHex = function(index) {
                    $scope.byte[index] = $scope.byte[index] ? 0 : 1;
                    $scope.data = parseInt($scope.byte.join(""), 2).toString(16).toUpperCase();

                };

            }
        }
    })

    .directive("nofocus", function() {
        return function(a, b) {
            b.focus(function() {
                $(this).blur();
            })
        }
    })



    // 指令默认 为A ;  清楚html 中的 script ; 
    .directive("html", function($sce) {
        return function($scope, $element, $attrs) {

            var s = $($scope[$attrs.html]);
            s.find('script').remove()
            $element.html(s);
        }

    })

    // 挨个去修改 table 有点麻烦;  故用指令更改; 
    .directive("table", function() {
        return {
            restrict: "E",
            link: function($scope, $ele, $attr) {
                /*  table-striped  */
                //$ele.addClass("   table  table-hover  table-bordered  "); 
            }
        }
    })

    // 展示  template  t ;  device  d ; templatePoint  tp ;  profpoint pp ;  profalarm pa
    //       project   proj ; station  s ;
    //       的 属性;
    .directive("params", function($sys, $translate) {

        var a, b, c, e, f, p;

        return function($scope, $ele, $attrs) {

            var x = $scope.$eval($attrs.params),
                params = angular.fromJson(x),
                a = [];

            // template ;
            if ($scope.dm) {
                e = $scope.dm,
                    p = $sys.point,
                    b = p[e.driver_id] // && p[e.driver_id][e.driver_ver];


                if (!b) {
                    console.error("无匹配的驱动数据: 驱动 id =  ", e.driver_id, " 驱动版本 = ",
                        e.driver_ver);
                    $ele.text(x);
                } else {
                    //@if  append

                    console.log(params);
                    //@endif 
                    angular.forEach(params, function(v, k) {
                        // a.push( $translate.instant("params."+k)  +'='+  b[k][v] );
                        //  非 select 的字段 匹配成原始值 ;
                        c = b[k];
                        //console.log(c , k);
                        if (k == "type_ex") {
                            a.push("额外配置值:" + v)
                        } else {
                            f = $translate.instant("params." + k) + ":" + (c ? c[v].k : v);
                            a.push(f);
                        }
                    });
                    $ele.text(a.join(" , "));
                }
            }


        }
    })


    .directive("panelclass", function() {
        return function($scope, $ele, $attrs) {
            $ele.addClass(" col-md-7 col-md-offset-2 col-sm-10 col-sm-offset-1  col-xs-12 m-t")
        }
    })

    //  初始化 得用 , $sys 中配置的 entituy ; 
    // 出现  nodejs 返回 字段为number 值是 不匹配 $sys 中配置的 key 时 ; 用 tl-defatul 转换成 string ; 
    //  此时 的 ng-change 要 换成  when-change ;  

    // tl-default =  只能是  数字格式字符串 ,或 a.b.c .. 格式( 不存在是返回null ); 
    //  无意义的字符串 返回 undefined ; 
    // 可以完全不用这个指令 ;  为 model 在sysconfig 中 配置各个模型的模版 ( 配置上默认值)
    .directive("tlDefault", function($parse) {
        return {
            restrict: "A",
            require: '?^ngModel',
            priority: 110, //  mgModel 的权重为100 ; 该指令 要低于 ngmodel ; 确保 trans 有值;
            link: function($scope, $ele, $attrs, modelControl) {


                // tl-default =  可以是 自定义任何字符串; ,
                //    或 a.b.c .. 格式( 不存在是返回null , 为 0 时 比较危险;  ); 


                var vo = $parse($attrs.tlDefault)($scope),
                    v1 = $parse($attrs.tlDefault)($scope) || $attrs.tlDefault,
                    mv = $parse($attrs.ngModel)($scope);

                v1 = mv ? mv : v1;
                if ($attrs.type == "number" || $attrs.type == "Number") {
                    modelControl.$setViewValue(v1);
                } else {
                    modelControl.$setViewValue(v1 + "");

                }
                modelControl.$render();

                // 触发 when-chage 监听; 
                if ($attrs.whenChange) {
                    modelControl.$viewChangeListeners.push(function() {
                        $scope.$eval($attrs.whenChange);
                    });
                }

            }
        }

    })

    .directive("acrollLimit", function() {
        // 多少行监听滚动; 
        var t_offset = 2;
        p_offset = 10;
        // template 滚动; 
        function tempScroll() {

        }

        // point 滚动; 
        function pointScroll() {

        }

        return function($scope, $ele, $attr) {

            if ($attr.$attr.temp) {
                if ($scope.$index % t_offset === 0) {
                    $ele.addClass("temp")
                }
            } else {
                if ($scope.$index % p_offset === 0) {
                    $ele.addClass("point");
                }

            }
        }
    })


    .directive("loadMask", function($timeout) {

        return {
            restrict: "A",
            link: function($scope, $element, $attrs) {

                // $element.addClass("pos-rlt");
                var $maskDom = $('<i class="fa fa-spin fa-3x  text-info fa-spinner hide pos-abt" style="top:50%;left:50%;z-index:9999" ></i>'),
                    wtcher = $attrs.loadMask || "showMask";


                $element.append($maskDom);



                $scope.$watch(wtcher, function(n) {
                    //@if  append
                    console.log("showMask =", n);

                    //@endif  
                    (n ? show : hide)();

                })

                function show() {
                    $maskDom.addClass("show");
                }

                function hide() {
                    $maskDom.removeClass("show");
                }
            }
        }

    })


    .directive("tlSel", function() {
        return {
            restrict: "A",
            translate: true,
            scope: true,
            template: '<div class="form-group col-md-4"><label>{{label}}</label> {{translate}} </div>',
            link: function($scope, $ele, $attrs) {
                alert(888)
                $scope.label = $attrs.label;
            }


        }


    })


    // tl-wrap  tl-warp-l  指令控制器;  
    //  {  width , label , label-width , left } ;
    function wrap($compile, $translate, valid) {
        return {
            restrict: "A",
            priority: 90,
            require: '?^ngModel',
            scope: {
                label: "@"
            },
            link: function($scope, $ele, $attrs, modelCtrl) {

                console.log($attrs.label)

                var width = $attrs.width || ($attrs.tlWrapL && 9) || ($attrs.tlWrap && 8) || 8,
                    offset = $attrs.offset || ($attrs.tlWrap && 1),
                    labelWidth = $attrs.labelWidth || 3
                    left = $attrs.hasOwnProperty('left'),

                    label_text = $translate.instant( $attrs.label );;
 

                var label = '<label class= " col-sm-' + labelWidth + (!!offset ? ('col-sm-offset-' + offset) : "")
                    //  + ( $attrs.required ? '' : 'm-l-n-xs' )
                    + ' control-label " ' + (left ? ' style= text-align:left ' : '') + '>' + ($attrs.required ? '<span class="text-danger font-bold">*</span>' : '')

                // +($attrs.required ? '' : "&nbsp;") + $attrs.label + '</label>',
                +($attrs.required ? '' : "&nbsp;") +  label_text + '</label>',

                    wrap_input = '<div class="form-group" ><div class=" col-sm-' + width + '"></div></div>',

                    cls;


                cls = $ele.is("input , textarea , select") ? "form-control" : " no-border";

                $ele.addClass(cls).wrap(wrap_input);

                $ele.parent().before(label);

                modelCtrl && valid($scope, $ele, $attrs, $translate, $compile, modelCtrl);

            }
        }
    }



 