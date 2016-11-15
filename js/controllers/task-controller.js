app.controller('TaskController', function ($scope, $http, $rootScope, $routeParams, $location) {


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
    $scope.createTask = function (task, options) {
        var category;
        $http.get($rootScope.serviceBase + "task-category/" + $routeParams.idCategory).then(function (response) {
            task.taskCategory = response.data;
            console.log(options);
            for (var i=1; i<=options.length; i++) {
                if (!options[i].description) {
                    $http.post($rootScope.serviceBase + "tasks/options", options[i]).then(function (res) {
                        console.log("Alternativa '" + options[i] + "' salva.");
                    });
                }
            }
            $http.post($rootScope.serviceBase + "tasks", task).then(function (success) {
                $location.path('/rooms/' + task.taskCategory.classRoom.id);
            });
        });
        console.log(task);
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
    $scope.evaluate = function (choice) {
        $http.get($rootScope.serviceBase + "tasks/options/" + choice).then(function (response) {
            if (response.data.correct) {
                $rootScope.showToast("Você acertou, parabéns!");
            } else {
                $rootScope.showToast("Precisa estudar mais, amiguinho");
            }
        });
    }
    
// Editar
    $scope.edit = function () {
        
    }
});
