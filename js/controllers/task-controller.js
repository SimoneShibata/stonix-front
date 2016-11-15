app.controller('TaskController', function ($scope, $http, $rootScope, $routeParams, $location) {

    $scope.options = [];

// Create Category
    $scope.createCategory = function (category) {
        console.log(category);
        if (!category.name || !category.description) {
            console.log("oi");
            $rootScope.showToast("Todos os campos são obrigatórios");
            return null;
        }
        if ($scope.category.id) {
            $http.put($rootScope.serviceBase + "task-category", category).then(function (response) {
                $rootScope.showToast("Categoria salva com sucesso");
                $location.path('/rooms/' + $routeParams.id);
            });
        } else {
            category.classRoom = {'id': $routeParams.id};
            $http.post($rootScope.serviceBase + "task-category", category).then(function (response) {
                $rootScope.showToast("Categoria salva com sucesso");
                $location.path('/rooms/' + $routeParams.id);
            });
        }
    }
    
// Create Task
    $scope.createTask = function (task) {
        var category;
        $http.get($rootScope.serviceBase + "task-category/" + $routeParams.idCategory).then(function (response) {
            task.taskCategory = response.data;
            $scope.saveTask(task);
        });
    }

    $scope.saveTask = function (task) {
        $http.post($rootScope.serviceBase + "tasks", task).then(function (success) {
            $scope.saveOptions(success.data);
        });
    }

    $scope.saveOptions = function (task) {


        for (var i=1 ; i < $scope.options.length; i++) {
            if ($scope.options[i].correct == null) {
                $scope.options[i].correct = false;
            }
            $scope.options[i].task = task;

            if ($scope.options[i].description != null) {
                $http.post($rootScope.serviceBase + "tasks/options", $scope.options[i]).then(function (res) {
                    console.log("Alternativa '" + $scope.options[i] + "' salva.");
                    $location.path('/rooms/' + task.taskCategory.classRoom.id);
                });
            }
        }
    }

// Cancel Category
    $scope.cancelCategory = function () {
        $location.path('/rooms/' + $routeParams.id);
    }

// Edit Category
    if ($routeParams.idCategory) {
        $http.get($rootScope.serviceBase + "task-category/" + $routeParams.idCategory).then(function (response) {
            $scope.category = response.data;
        });
    }

// GetOne task
    var getOneTask = function (idTask) {
        if (idTask) {
            $http.get($rootScope.serviceBase + "tasks/" + idTask).then(function (response) {
                $scope.pageTitle = response.data.title;
                $scope.task = response.data;

                $http.get($rootScope.serviceBase + "tasks/options/list/" + response.data.id).then(function (success) {
                    $scope.options = success.data;
                });
            });
        }
    }
    getOneTask($routeParams.id);

// Conferir resposta
    $scope.evaluate = function (choice, task) {
        $http.get($rootScope.serviceBase + "tasks/options/" + choice).then(function (response) {
            if (response.data.correct) {
                $rootScope.showToast("Você acertou, parabéns!");
            } else {
                $rootScope.showToast("Precisa estudar mais, amiguinho");
            }
            $location.path("/rooms/" + task.taskCategory.classRoom.id);
        });
    }
    
// Editar
    $scope.edit = function (task) {
        
    }

// Delete
    $scope.deleteTask = function (task) {
        var classroom = task.taskCategory.classRoom.id;
        $http.delete($rootScope.serviceBase + "tasks/" + task.id).then(function (response) {
            $rootScope.showToast("Atividade excluída com sucesso.");
            $location.path("/rooms/" + classroom);
        });
    }
});
