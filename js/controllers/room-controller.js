app.controller('RoomController', function ($scope, $http, $rootScope, $location, $routeParams, $timeout, $q) {

    $scope.pageTitle = "Salas de aula";

    $http.get($rootScope.serviceBase + "classroom").then(function (response) {
        $scope.rooms = response.data;
    });

    $http.get($rootScope.serviceBase + "classroom").then(function (response) {
        $scope.myRooms = response.data;
    });

    $scope.createRoom = function (room) {
        room.teacher = $rootScope.userAuthenticated;
        $http.post($rootScope.serviceBase + "classroom", room).then(function (response) {
            $rootScope.showToast("Sala de aula criada com sucesso.");
            console.log(response.data);
            $location.path('/rooms/' + response.data.id);
        });
    }

    // GetOne - Chama Sala solicitada
    if ($routeParams.id != null) {
        $http.get($rootScope.serviceBase + "classroom/" + $routeParams.id).then(function (response) {
            $scope.room = response.data;
            $scope.users = $scope.room.students;
            if ($scope.room == "") {
                $location.path('/404');
            }
        }, function (error) {
            if (error.status == 404) {
                $location.path('/404');
            }
        });
    }
    
// Add User in Classroom
    $scope.addUser = function(u) {
        var user = {};
        $http.post($rootScope.serviceBase + "users/email", u).then(function(response) {
            $scope.userClass = response.data;

            $http.post($rootScope.serviceBase + "classroom/student/" + $routeParams.id, $scope.userClass).then(function(response) {
                $scope.users.push($scope.userClass);
                $rootScope.showToast($scope.userClass.name + " foi adicionado na sala.");
            }, function(error) {
                $rootScope.showToast("Não foi possível adicionar o usuário :(");
            });
        }, function(error) {
            $rootScope.showToast("Não foi possível encontrar o usuário :(");
        });
    }

// Maçã
    $scope.addApple = function(teacher) {
    }
});
