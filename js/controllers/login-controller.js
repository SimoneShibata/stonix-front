app.controller('LoginController', function ($scope, $mdSidenav, $location, $http, $rootScope, $mdDialog) {

    $scope.toggleSidenav = function (menuId) {
        $mdSidenav(menuId).toggle();
    };

    $scope.navigateTo = function (url) {
        $location.path(url);
    };

// Login
    $scope.logar = function () {
        $rootScope.userAuthenticated = {
            "id": "4561e152-f093-4074-93ef-f13a597f4a51",
            "dead": false,
            "name": "Bruna Marconato",
            "birth": 803185200000,
            "email": "bruna@email.com",
            "xp": 0,
            "xpForNextLevel": 40,
            "level": 0,
            "punctuation": 0,
            "password": "123",
            "image": "../../img/bruna.jpg",
            "tutor": true,
            "authenticated": true
        }
        $http.get($rootScope.serviceBase + "users/ranking/punctuation").then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].id == $rootScope.userAuthenticated.id) {
                    $rootScope.rank = i + 1;
                }
            }
        });
        $location.path('/questions');
        // $http.post($rootScope.serviceBase + "login", $scope.user, app.header)
        //     .then(
        //         function (response) {
        //             $rootScope.userAuthenticated = response.data;
        //             $http.get($rootScope.serviceBase + "users/ranking/punctuation").then(function (response) {
        //                 for (var i = 0; i < response.data.length; i++) {
        //                     if (response.data[i].id == $rootScope.userAuthenticated.id) {
        //                         $rootScope.rank = i + 1;
        //                     }
        //                 }
        //             });
        //             $location.path('/questions');
        //         },
        //         function (error) {
        //             $rootScope.showToast("E-mail ou senha incorreto.");
        //         }
        //     );
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

        if (user.image == null) {
            user.image = "../../img/default.png";
        }
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
