app.controller('PerfilController', function ($scope, $rootScope, $location, $http) {
    document.body.style.zoom=0.9;

    $scope.flairForm = false;
    $http.get($rootScope.serviceBase + "users/get-auth").then(function (response) {
        $rootScope.userAuthenticated = response.data;
        $http.get($rootScope.serviceBase + "users/ranking/punctuation").then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].id == $rootScope.userAuthenticated.id) {
                    $rootScope.rank = i + 1;
                }
            }
        });
        $http.get($rootScope.serviceBase + "flairs/user/" + $rootScope.userAuthenticated.id).then(function (response) {
            $scope.flairs = response.data;
        });
        $http.get($rootScope.serviceBase + "questions/user/" + $rootScope.userAuthenticated.id).then(function (response) {
            $rootScope.userAuthenticated.numberQuestions = response.data.length;
        });
        $http.get($rootScope.serviceBase + "answers/user/" + $rootScope.userAuthenticated.id).then(function (response) {
            $rootScope.userAuthenticated.numberAnswers = response.data.length;
        });
    });

    $scope.addFlairOn = function () {
        $scope.flairForm = true;
    };

    $scope.addFlairOff = function () {
        $scope.flairForm = false;
        $scope.flair = {};
        $scope.formFlairInputs.$setPristine();
    };

    $scope.showFlairs = function () {
        $scope.viewFlairs = true;
    };

    $scope.hideFlairs = function () {
        $scope.viewFlairs = false;
    };

    $scope.viewFlairs = false;

    $scope.pageTitle = "Perfil";

    $scope.createFlair = function () {
        $scope.flair.user = $rootScope.userAuthenticated;
        $http.post($rootScope.serviceBase +"flairs", $scope.flair).then(function (response) {
            $scope.flairs.push(response.data);
            $scope.addFlairOff();
        })
    }

});