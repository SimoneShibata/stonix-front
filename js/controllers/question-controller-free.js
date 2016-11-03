app.controller('QuestionControllerFree', function ($scope, $rootScope, $http, $routeParams, $location, $mdDialog, $mdToast) {


// GetAll - Lista questions
    $scope.questions = [];
    $http.get($rootScope.serviceBase + "questions").then(function (response) {
        $scope.questions = response.data;
    }, function (error) {
        // failure
    });

    $scope.getOne = function (id) {
        $http.get($rootScope.serviceBase + "questions/" + id).then(function (response) {
            $scope.question = response.data;
            $http.get($rootScope.serviceBase + "answers/question/" + $scope.question.id).then(function (response) {
                $scope.answers = response.data;
                $scope.numberAnswers = response.data.length;
            });
            $location.path("/free/questions/" + id);
        }, function (error) {
            if (error.status == 404) {
                $location.path('/404');
            }
        });
    }

    // GetOne - Chama Question solicitada
    if ($routeParams.id != null) {
        $scope.getOne($routeParams.id);
    }
});
