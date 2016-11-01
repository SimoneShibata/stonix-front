app.controller('PerfilController', function ($scope, $rootScope, $location, $http, $filter) {

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

    $scope.pageTitle = "Perfil";

// Update Password - Atualização de senha
    $scope.savePassword = function (user) {
        if (user.passwordOld != $rootScope.userAuthenticated.password) {
            $rootScope.showToast("Senha atual incorreta!");
            return null;
        }
        if (user.password != user.passwordConfirm) {
            $rootScope.showToast("Confirmação de senha inválida!");
            return null;
        }
        var u = $rootScope.userAuthenticated;
        u.password = user.password;
        $http.put($rootScope.serviceBase + "users", u).then(function (response) {
            $rootScope.showToast("Senha alterada com sucesso!");
            $location.path('/perfil');
        });
    };

// Data no datePicker
    var dia = $filter('date')($rootScope.userAuthenticated.birth, 'dd');
    var mes = $filter('date')($rootScope.userAuthenticated.birth, 'MM');
    var ano = $filter('date')($rootScope.userAuthenticated.birth, 'yyyy');

    var dateBirth = new Date(ano, mes, dia);

    $scope.u = {
        name: $rootScope.userAuthenticated.name,
        email: $rootScope.userAuthenticated.email,
        birth: dateBirth
    };

// Update - Atualizar Perfil
    $scope.savePerfil = function (user) {
        var u = $rootScope.userAuthenticated;

        if (user.name != "") {
            u.name = user.name;
        } else {
            $rootScope.showToast("O campo nome não pode ficar vazio!");
            return null;
        }
        if (user.email != "") {
            u.email = user.email;
        } else {
            $rootScope.showToast("O campo e-mail não pode ficar vazio!");
            return null;
        }

        u.birth = user.birth;
        $http.put($rootScope.serviceBase + "users", u).then(function (response) {
            $rootScope.showToast("Dados alterados com sucesso!");
            $location.path('/perfil');
        });
    };

});