'use strict';

/**
 * 0.1.1
 * General-purpose jQuery wrapper. Simply pass the plugin name as the expression.
 *
 * It is possible to specify a default set of parameters for each jQuery plugin.
 * Under the jq key, namespace each plugin by that which will be passed to ui-jq.
 * Unfortunately, at this time you can only pre-define the first parameter.
 * @example { jq : { datepicker : { showOn:'click' } } }
 *
 * @param ui-jq {string} The $elm.[pluginName]() to call.
 * @param [ui-options] {mixed} Expression to be evaluated and passed as options to the function
 *     Multiple parameters can be separated by commas
 * @param [ui-refresh] {expression} Watch expression and refire plugin on changes
 *
 * @example <input ui-jq="datepicker" ui-options="{showOn:'click'},secondParameter,thirdParameter" ui-refresh="iChange">
 */
angular.module('ui.jq', ['ui.load']).
value('uiJqConfig', {}).
directive('uiJq', ['uiJqConfig', 'JQ_CONFIG', 'uiLoad', '$timeout', function uiJqInjectingFunction(uiJqConfig,
    JQ_CONFIG, uiLoad, $timeout) {

    return {
        restrict: 'A',
        // require: '?^ngModel',
        // link: function($scope, $ele, $attrs, modelCtrl) {
        compile: function uiJqCompilingFunction(tElm, tAttrs) {

            if (!angular.isFunction(tElm[tAttrs.uiJq]) && !JQ_CONFIG[tAttrs.uiJq]) {
                throw new Error('ui-jq: The "' + tAttrs.uiJq + '" function does not exist');
            }
            var options = uiJqConfig && uiJqConfig[tAttrs.uiJq];

            return function uiJqLinkingFunction(scope, elm, attrs ) {
                 
                function getOptions() {
                    var linkOptions = [];

                    // If ui-options are passed, merge (or override) them onto global defaults and pass to the jQuery method
                    if (attrs.uiOptions) {
                        //
                        linkOptions = scope.$eval('[' + attrs.uiOptions + ']');
                        if (angular.isObject(options) && angular.isObject(linkOptions[0])) {
                            linkOptions[0] = angular.extend({}, options, linkOptions[0]);
                        }
                    } else if (options) {
                        linkOptions = [options];
                    }
                     //@if  append
                     console.log("flot 参数!! ", linkOptions);
                     
                     //@endif 
                    
                    return linkOptions;
                }

                // If change compatibility is enabled, the form input's "change" event will trigger an "input" event
                if (attrs.ngModel && elm.is('select,input,textarea')) {
                    elm.bind('change', function() {
                        elm.trigger('input');
                    });
                }

                // lixq
                var arr , value ; 
                function getV ( model ,  v ){
                    value = "";
                    arr = v.split("&")
                    if( arr.length == 1){
                        value =  model[v]
                    }else{
                        arr.forEach( function( x , i ){
                            value += model[x] + (i+1 == arr.length?"":"&" );
                        })
                    } 

                    return  value ;
                }
   

                // Call jQuery method and pass relevant options
                
                var f = elm.find("option").clone();
                function callPlugin() {
                    $timeout(function() { 
                        // 如果是 chosen 插件;  要赋 初始值; 
                        if (attrs.uiJq === "chosen") {

                            if (attrs.sourceArr || attrs.uiRefresh) {
                                var ops = [] ,
                                 k = attrs.k , 
                                 v = attrs.v ,
                                 child , arr ;
                                 arr = scope.$eval(  attrs.sourceArr || attrs.uiRefresh ); 
                                 if( arr ){
                                     arr.forEach( function( x ){  
                                       ops.push(  " <option value='" +  getV( x , v )  +"'>" +x[k]+"</option>");
                                     });
                                     // ":not(:first)" 

                                    elm.empty().append(f).append( ops.join("") ); 
                                 } 
                            }   
                             
                            elm[attrs.uiJq].apply(elm, getOptions());  
                            // scope.$eval(attrs.ngModel)
                            elm.val( scope.$eval(attrs.ngModel) ).trigger("chosen:updated");
                           
                        } else {
                             elm[attrs.uiJq].apply(elm, getOptions());
                        }  
                    }, 0, false);
                }

                function refresh() {
                    // If ui-refresh is used, re-fire the the method upon every change
                    if (attrs.uiRefresh) {
                        scope.$watch(attrs.uiRefresh, function() {
                             //@if  append
                                console.log(" callPlugin -----------------");
                             //@endif 
                            callPlugin();
                        });
                    }
                }

              

                if (JQ_CONFIG[attrs.uiJq]) {
                    uiLoad.load(JQ_CONFIG[attrs.uiJq]).then(function() {
                        
                        callPlugin();
                        refresh();
                    }).catch(function() {

                    });
                } else {
                    
                    callPlugin();
                    refresh();
                }
            };
        }
    };
}]);
