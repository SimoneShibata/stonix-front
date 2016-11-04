app.controller('RankingController', function ($scope, $http, $rootScope) {

    $http.get($rootScope.serviceBase + "users/ranking/punctuation").then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].id == $rootScope.userAuthenticated.id) {
                $rootScope.rank = i + 1;
            }
        }
    });

    $http.get($rootScope.serviceBase + "users/get-auth").then(function (response) {
        $rootScope.userAuthenticated = response.data;
    });
    
    $scope.pageTitle = "Ranking";

    $http.get($rootScope.serviceBase + "users/ranking/punctuation").then(function (response) {
        $scope.users = response.data;

    });

    $http.get($rootScope.serviceBase + "users/ranking/level").then(function (response) {
        $scope.usersLevel = response.data;

    });

});
