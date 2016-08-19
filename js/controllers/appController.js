app.controller('AppController', function($scope, $mdSidenav,$location){

	$scope.toggleSidenav = function(menuId) {
		$mdSidenav(menuId).toggle();
	};

	$scope.navigateTo = function(url){
        $location.path(url);
    };

    $scope.pageTitle = "teste";

    $scope.user = {
        'name': 'José Almeida',
        'email': 'jose@almeida.com',
        'image': './img/user.jpg',
        'points': 1030,
        'rank': 10,
        'coins': 35
    };

});