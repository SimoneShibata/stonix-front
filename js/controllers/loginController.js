app.controller('LoginController', function($scope, $mdSidenav,$location){

	$scope.toggleSidenav = function(menuId) {
		$mdSidenav(menuId).toggle();
	};

	$scope.navigateTo = function(url){
        $location.path(url);
    };
});