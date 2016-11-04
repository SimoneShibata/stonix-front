app.controller('LoginController', function ($scope, $mdSidenav, $location, $http, $rootScope, $mdDialog, MyStorageService) {

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

                    console.log('Response Headers: ', response.headers('Authorization'));

                    var tokenBearer = response.headers('Authorization');
                    var token = tokenBearer.substring(7, tokenBearer.length);

                    console.log(tokenBearer);
                    console.log(token);

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

        if (user.password != user.passwordConfirm) {
            $rootScope.showToast("Confirmação de senha inválida!");
            return null;
        }

        $scope.user.imageProfile = $scope.image.base64;

        $http.post($rootScope.serviceBase + "users", user).then(function () {
            $rootScope.showToast("Cadastrado com sucesso");
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

});
