app.controller('RankingController', function ($scope, $http, $rootScope) {

    $scope.pageTitle = "Ranking";

    $http.get($rootScope.serviceBase + "users/ranking/punctuation").then(function (response) {
        $scope.users = response.data;

    });

    $http.get($rootScope.serviceBase + "users/ranking/level").then(function (response) {
        $scope.usersLevel = response.data;

    });

});
