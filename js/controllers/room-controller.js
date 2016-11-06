app.controller('RoomController', function ($scope, $http, $rootScope, $location, $routeParams, $timeout, $q) {

    $http.get($rootScope.serviceBase + "users/get-auth").then(function (response) {
        $rootScope.userAuthenticated = response.data;
        $http.get($rootScope.serviceBase + "classroom/teacher/" + $rootScope.userAuthenticated.id).then(function (response) {
            $scope.myRooms = response.data;
        });
        $http.get($rootScope.serviceBase + "users/ranking/punctuation").then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].id == $rootScope.userAuthenticated.id) {
                    $rootScope.rank = i + 1;
                }
            }
        });
        $http.get($rootScope.serviceBase + "classroom").then(function (response) {
            $scope.rooms = response.data;
        });
    });

    $scope.pageTitle = "Salas de aula";


    $scope.createRoom = function (room) {
        room.teacher = $rootScope.userAuthenticated;
        $http.post($rootScope.serviceBase + "classroom", room).then(function (response) {
            $rootScope.showToast("Sala de aula criada com sucesso.");
            console.log(response.data);
            $location.path('/rooms/' + response.data.id);
        });
    };

    // GetOne - Chama Sala solicitada
    if ($routeParams.id != null) {
        $http.get($rootScope.serviceBase + "classroom/" + $routeParams.id).then(function (response) {
            $scope.room = response.data;
            $scope.users = $scope.room.students;
            getNumberApples($scope.room.teacher);
            console.log($scope.room);
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
    };
    var getNumberApples = function (teacher) {
        $http.get($rootScope.serviceBase + "apples/teacher/" + teacher.id).then(function (response) {
            $scope.room.teacher.numberApples = response.data.length;
        })
    };
// Maçã
    $scope.addApple = function(teacher) {
        var apple = {};
        apple.teacher = teacher;
        apple.student = $rootScope.userAuthenticated;
        $http.post($rootScope.serviceBase + "apples", apple).then(function (response) {
        getNumberApples(teacher);
        })
    };




});
