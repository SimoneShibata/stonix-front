app.controller('ViewPerfilController', function ($scope, $rootScope, $location, $http, $routeParams) {

    $http.get($rootScope.serviceBase + "users/get-auth").then(function (response) {
        $rootScope.userAuthenticated = response.data;
        $http.get($rootScope.serviceBase + "users/ranking/punctuation").then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].id == $rootScope.userAuthenticated.id) {
                    $rootScope.rank = i + 1;
                }
            }
        });
    });

    $http.get($rootScope.serviceBase + "users/" + $routeParams.id).then(function (response) {
        if (response.data == "") {
            $location.path("/404");
        }
        $scope.user = response.data;
        $http.get($rootScope.serviceBase + "questions/user/" + $scope.user.id).then(function (response) {
            $scope.user.numberQuestions = response.data.length;
        });
        $http.get($rootScope.serviceBase + "answers/user/" + $scope.user.id).then(function (response) {
            $scope.user.numberAnswers = response.data.length;
        });
    });
});