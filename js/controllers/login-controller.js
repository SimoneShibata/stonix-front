app.controller('LoginController', function ($scope, $mdSidenav, $location, $http, $rootScope, $mdDialog, MyStorageService, $filter) {
    document.body.style.zoom=0.9;
    
    $scope.toggleSidenav = function (menuId) {
        $mdSidenav(menuId).toggle();
    };

    $scope.navigateTo = function (url) {
        $location.path(url);
    };

// Login
    $scope.logar = function (credentials) {

        $http.post("http://localhost:9991/login", credentials)
            .then(
                function (response) {

                    var tokenBearer = response.headers('Authorization');
                    var token = tokenBearer.substring(7, tokenBearer.length);

                    MyStorageService.token.set(token);

                    $location.path('/questions');
                },
                function (error) {
                    console.log('error ' + error);
                    $rootScope.showToast("E-mail ou senha incorreto.");
                }
            );
    };

// Dialog
    var DialogController = function ($scope, $mdDialog) {
        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };

        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.showDialog = function (ev) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: '../views/login/cadastro.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: false
        })
            .then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
    };

// Cadastrar - register

    $scope.register = function (user) {
        var dia = $filter('date')(user.birth, 'dd');
        var mes = $filter('date')(user.birth, 'MM') - 1;
        var ano = $filter('date')(user.birth, 'yyyy');

        user.birth = new Date(ano, mes, dia);

        if (user.password != user.passwordConfirm) {
            $rootScope.showToast("Confirmação de senha inválida!");
            return null;
        }

        if($scope.image != null) {
            $scope.user.imageProfile = $scope.image.base64;
        } else {
            $scope.user.imageProfile = imageDefault;
        }

        $http.post($rootScope.serviceBase + "users", user).then(function () {
            $rootScope.showToast("Cadastrado com sucesso");
            console.log('dps ' + user.birth);
            $mdDialog.cancel();
        });
    };

    $scope.showThirdTutorDialog = function (ev) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: '../views/forum/tutor3.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            fullscreen: false
        })
            .then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
    };

    $scope.showSecondTutorDialog = function (ev) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: '../views/forum/tutor2.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            fullscreen: false
        })
            .then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
    };

    $scope.showSecond = function () {
        $scope.showSecondTutorDialog();
    };

    $scope.showThird = function () {
        $scope.showThirdTutorDialog();
    };

    $scope.finalTutor = function () {
        $rootScope.userAuthenticated.tutor = true;
        $rootScope.userAuthenticated.xp = $rootScope.userAuthenticated.xp + 20;
        $http.put($rootScope.serviceBase + 'users', $rootScope.userAuthenticated).then(function (response) {
            $rootScope.userAuthenticated = response.data;
        });
        $scope.cancel();
        $rootScope.showToast("Uauuu você concluiu o tutorial! 20 de XP a mais para você :)");
    }

    var imageDefault = "iVBORw0KGgoAAAANSUhEUgAAA8AAAAPACAYAAAD61hCbAAAACXBIWXMAAA7EAAAOxAGVKw4bAABB2WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMTEgNzkuMTU4MzI1LCAyMDE1LzA5LzEwLTAxOjEwOjIwICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI";
});
