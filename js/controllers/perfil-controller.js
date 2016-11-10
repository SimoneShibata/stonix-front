app.controller('PerfilController', function ($scope, $rootScope, $location, $http, $filter) {
    document.body.style.zoom=0.9;
    $http.get($rootScope.serviceBase + "users/get-auth").then(function (response) {
        $rootScope.userAuthenticated = response.data;
        $http.get($rootScope.serviceBase + "users/ranking/punctuation").then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].id == $rootScope.userAuthenticated.id) {
                    $rootScope.rank = i + 1;
                }
            }
        });
        $http.get($rootScope.serviceBase + "questions/user/" + $rootScope.userAuthenticated.id).then(function (response) {
            $rootScope.userAuthenticated.numberQuestions = response.data.length;
        });
        $http.get($rootScope.serviceBase + "answers/user/" + $rootScope.userAuthenticated.id).then(function (response) {
            $rootScope.userAuthenticated.numberAnswers = response.data.length;
        });
    });

    $scope.pageTitle = "Perfil";


});