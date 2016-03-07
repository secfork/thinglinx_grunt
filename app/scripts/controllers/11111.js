  

--source-maps --out-file $FileNameWithoutExtension$-compiled.js $FilePath$



    // window.loginUserPromise =    $source.$common.get({  op: "islogined" }).$promise ; 
  
    // window.loginUserPromise.then( function(resp) {

    //         $('#preload').fadeOut('slow'); 

    //         if (resp.ret) {
 
    //             resp.ret.sms_notice = !!resp.ret.sms_notice;
    //             resp.ret.mail_notice = !!resp.ret.mail_notice; 


    //             $rootScope.user = resp.ret ; 

    //             if( $location.$$path.length <5 || $location.$$path.startsWith("/access")){
    //                 $state.go("app.proj.manage");

    //             } 
                
    //         } else {
    //             // 获取登录次数; 
    //             $source.$common.get({
    //                 op: 'logintimes'
    //             }, function(resp) {
    //                 $scope.logintimes = resp.ret || 0;
    //                 $state.go("access.signin");
    //             });
    //         }

    // } , function(){
    //     alert("-_-。sorry！");
    // });


 
               

    //             // 时间; 
    //             $scope.sms_inter  = $localStorage.sms_inter ;
    //             $scope.email_inter = $localStorage.email_inter ;

               
    //             var text = "重新发送(%)",
    //                 sms_text ="发送验证码" ; 
    //                 email_text = "发送验证邮件" ; 
 

    //             function  em (){

    //                 var  times =   parseInt( $localStorage.email_inter || 120 ) ; 

    //                 if( !times) return ; 

    //                 emailInterval = $interval(function() { 
    //                     $scope.text = text.replace("%" , times );

    //                     $localStorage.email_inter = times--;
    //                      //@if  append
    //                         console.log(  $localStorage.email_inter)
    //                      //@endif 
    //                     if (times < 0) {  
    //                         $scope.text = email_text 
    //                         $interval.cancel(emailInterval);
    //                     }
    //                 }, 1000) 
    //             }

    //             function  sms (){
    //                 var  times =  parseInt ( $localStorage.sms_inter || 120  ); 
    //                 if( !times) return ;
    //                 smsInterval = $interval(function() { 
    //                     $scope.text = text.replace("%" , times );

    //                     $localStorage.sms_inter = times--;
                            
    //                      //@if  append
    //                         console.log(  $localStorage.sms_inter)
    //                      //@endif 

    //                     if (times < 0) {  
    //                         $scope.text = sms_text 
    //                         $interval.cancel(smsInterval);
    //                     }
    //                 }, 1000) 
    //             }

    //             $scope.sendEmail = function(e) {

    //                 if (!$scope.u.email) {
    //                     angular.alert("请输入邮箱!");
    //                     return;
    //                 }
                    
    //                 em();
 
    //                 var d = {
    //                     id: u.id,
    //                     email: $scope.u.email
    //                 };

    //                 $source.$user.save({
    //                     pk: "sendverifyemail"
    //                 }, d);

    //             }

    //             $scope.sendNote = function(e) {
    //                 if (!$scope.u.mobile_phone) {
    //                     angular.alert("请输入手机号");
    //                     return;
    //                 }

    //                 sms();


    //                 $source.$note.get({
    //                         op: "user",
    //                         mobile_phone: $scope.u.mobile_phone
    //                     },
    //                     function() {

    //                     });

    //             } 


    //             if( temp == 'phone' ){
    //                 $scope.text = sms_text ;
    //                 sms();

    //             }else{
    //                 $scope.text = email_text;
    //                 em();
    //             }

