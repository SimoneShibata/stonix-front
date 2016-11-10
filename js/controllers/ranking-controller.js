app.controller('RankingController', function ($scope, $http, $rootScope) {
    document.body.style.zoom=0.9;
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
        $scope.limitPunct = 15;
        $scope.users = response.data;
    });

    $http.get($rootScope.serviceBase + "users/ranking/level").then(function (response) {
        $scope.limitLevel = 15;
        $scope.usersLevel = response.data;

    });

    $scope.viewMorePunct = function () {
        $scope.limitPunct += 15;
    };

    $scope.viewMoreLevel = function () {
        $scope.limitLevel += 15;
    };

});
