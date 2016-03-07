 /**
  * show Module
  *
  * Description
  */
 

     angular.module('app.show.proj', [])

     .controller('s_region_system', function($scope, $source, $stateParams) {

         $scope.title = $stateParams.name;
         $scope.project = $stateParams;


     });

 