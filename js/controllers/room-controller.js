app.controller('RoomController', function ($scope, $http, $rootScope, $location, $routeParams, $timeout, $q) {
    document.body.style.zoom=0.9;
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

// GoRoom - entrar sala
    $scope.goRoom = function (idRoom) {
        $http.get($rootScope.serviceBase + "classroom/" + idRoom).then(function (response) {
            var room = response.data;
            if (room == "") {
                $location.path('/404');
            }

            if (room.students.length > 0) {
                for (var i = 0; i < room.students.length; i++) {
                    if (room.students[i].id == $rootScope.userAuthenticated.id) {
                        $location.path('/rooms/' + idRoom);
                        return null;
                    }
                }
            }
            if (room.teacher.id == $rootScope.userAuthenticated.id) {
                $location.path('/rooms/' + idRoom);
                return null
            }
            $location.path('/rooms');
            $rootScope.showToast("Você não está cadastrado nesta sala :(");
        }, function (error) {
            if (error.status == 404) {
                $location.path('/404');
            }
        });
    }

// GetOne - Chama Sala solicitada
    if ($routeParams.id != null) {
        $http.get($rootScope.serviceBase + "classroom/" + $routeParams.id).then(function (response) {
            $scope.room = response.data;
            $scope.users = $scope.room.students;
            getNumberApples($scope.room.teacher);
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

// Delete User in Classroom
    $scope.deleteUser = function(u) {
        var user = {};
        $http.post($rootScope.serviceBase + "users/email", u).then(function(response) {
            $scope.userClass = response.data;

            $http.delete($rootScope.serviceBase + "classroom/delete/student/" + $scope.userClass.id + "/" + $routeParams.id ).then(function(response) {
                $scope.users = response.data.students;
                $rootScope.showToast($scope.userClass.name + " foi excluído da sala.");
            }, function(error) {
                $rootScope.showToast("Não foi possível excluir o usuário :(");
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

// GetAll Categories Tasks - categorias
    var getAllCategories = function () {
        $http.get($rootScope.serviceBase + "task-category/classroom/" + $routeParams.id).then(function (response) {
            $scope.categories = response.data;
        })
    }
    getAllCategories();

    $scope.categorySelected = function(category) {
        $scope.selected = category.id;
        $scope.listTasks(category);
    };

// GetAll Tasks - atividades
    $scope.listTasks = function (category) {
        $http.get($rootScope.serviceBase + "tasks/task-category/" + category.id).then(function (response) {
            $scope.tasks = response.data;
        });
    }

// Create Category
    $scope.createCategory = function (idCategory) {
        if (idCategory) {
            $location.path('/rooms/' + $routeParams.id + '/category/' + idCategory);
        } else {
            $location.path('/rooms/' + $routeParams.id + '/category');
        }
    }

// Delete Category
    $scope.deleteCategory = function (category) {
        $http.get($rootScope.serviceBase + "tasks/task-category/" + category.id).then(function (response) {
            if (response.data.length > 0) {
                $rootScope.showToast("Não é possível excluir uma categoria com atividades cadastradas.");
            } else {
                $http.delete($rootScope.serviceBase + "task-category/" + category.id).then(function (response) {
                    getAllCategories();
                    $rootScope.showToast("Categoria excluída com sucesso");
                });
            }
        });
    }

// Cancelar edição
    $scope.cancelEdit = function (room) {
        $location.path('/rooms/' + room);
    }
    
// Editar sala 
    $scope.editRoom = function (room) {
        $http.put($rootScope.serviceBase + "classroom/", room).then(function (response) {
            $rootScope.showToast(response.data.name  + " alterada com sucesso.");
            $location.path("/rooms");
        });
    }
});
