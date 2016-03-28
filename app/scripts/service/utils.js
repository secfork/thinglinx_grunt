 

    angular.module('app.utils', [], function() {})

    .service("$utils", function($sessionStorage) {


        var a, b, c, d, e, f;






        function getCookie(name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
        }

        function delCookie(name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = getCookie(name);
            if (cval != null)
                document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }

        return {
            //删除cookies 
            delCookie: delCookie,
            getCookie: getCookie,


            handlerOnlineData:  function  ( sysStatus ){
                return  sysStatus &&  (sysStatus.daserver ?  sysStatus.daserver.logon : sysStatus.online   )
            } ,

            backState: function(controllerName) {


                if (angular.from && angular.from.url) {
                    return $sessionStorage['back_' + controllerName] = angular.from;

                } else {
                    return $sessionStorage["back_" + controllerName];
                }
            },
            // 展示 触发器 触发条件; 
            triggerConditions: function(c) {

                var conditions = angular.copy(c);

                if (angular.isString(conditions)) {

                    conditions = angular.fromJson(conditions);
                    console.log(conditions)
                }

                var arr = [],
                    exp;
                $.each(conditions, function(i, v) {
                    exp = v.exp;
                    arr.push(v.verb || "");
                    arr.push(exp.left.args);
                    arr.push(exp.op);
                    arr.push(exp.right.args);
                })
                return arr.join(" ");
            },


            // 拷贝 部分属性; 
            copyProp: function() {
                var a, b, c = {};
                a = arguments[0],
                    b = Array.prototype.splice.call(arguments, 1);

                b.forEach(function(v, i, t) {
                    c[v] = angular.copy(a[v]);
                });
                return c;
            },


            // profile  连接模版时用;
            findTempByid: function(temps, tempid) {
                var t;
                $.each(temps, function(i, n) {
                    if (n.template_id == tempid) {
                        t = n;
                        return false;
                    }
                });
                return t;
            },

            // profile 连接模版时用;
            containTemp: function(temps, tempid) {
                var t = false;
                $.each(temps, function(i, n) {
                    if (n.template_id == tempid) {
                        t = true;
                        return false;
                    }
                });
                return t;
            },

            // 拷贝 text 到 os 系统粘贴板； 
            copyText:  function  (copyText)   {
                    if (window.clipboardData) 
                    {
                        window.clipboardData.setData("Text", copyText)
                    } 
                    else 
                    {
                        var flashcopier = 'flashcopier';
                        if(!document.getElementById(flashcopier)) 
                        {
                          var divholder = document.createElement('div');
                          divholder.id = flashcopier;
                          document.body.appendChild(divholder);
                        }
                        document.getElementById(flashcopier).innerHTML = '';
                        var divinfo = '<embed src="../js/_clipboard.swf" FlashVars="clipboard='+encodeURIComponent(copyText)+'" width="0" height="0" type="application/x-shockwave-flash"></embed>';
                        document.getElementById(flashcopier).innerHTML = divinfo;
                    }
                  alert('copy成功！');
                }

        }




    });
 
 


 