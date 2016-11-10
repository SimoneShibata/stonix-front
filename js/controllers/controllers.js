app.run(function ($rootScope) {
    $rootScope.serviceBase = "http://localhost:9991/api/";
    $rootScope.uiBase = "http://localhost/stonix-front-end/#/";
});

app.controller('AppController', function ($scope, $mdSidenav, $location, $rootScope, $http, $mdToast, $injector) {
    document.body.style.zoom=0.9;
    var MyStorageService = $injector.get("MyStorageService");
    $scope.toggleSidenav = function (menuId) {
        $mdSidenav(menuId).toggle();
    };

    $scope.navigateTo = function (url) {
        $location.path(url);
    };

    $scope.logout = function() {
        MyStorageService.token.clear();
        $rootScope.userAuthenticated = null;

        $location.path("/login");
    };
// Toast
    var last = {
        bottom: false,
        top: true,
        left: false,
        right: true
    };
    $scope.toastPosition = angular.extend({}, last);
    $scope.getToastPosition = function () {
        return Object.keys($scope.toastPosition)
            .filter(function (pos) {
                return $scope.toastPosition[pos];
            })
            .join(' ');
    };
    $rootScope.showToast = function (message) {
        var pinTo = $scope.getToastPosition();
        $mdToast.show(
            $mdToast.simple()
                .content(message)
                .position(pinTo)
                .hideDelay(3000)
        );
    };

// pagina 404 voltar ultima pagina
    $rootScope.backLastPage = function () {
        window.history.back(2);
    }
});
