app.controller('TaskController', function ($scope, $http, $rootScope, $routeParams, $location) {
    
    $http.get($rootScope.serviceBase + "tasks/" + $routeParams).then(function (response) {
       $scope.pageTitle = response.data.title; 
    });

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
        });
        console.log(task);
        $http.post($rootScope.serviceBase + "tasks", task).then(function (response) {
            $location.path('/rooms/' + $routeParams.id);
        });
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
});
