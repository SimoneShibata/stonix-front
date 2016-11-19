app.controller('TaskController', function ($scope, $http, $rootScope, $routeParams, $location) {

    document.body.style.zoom=0.9;
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

    $scope.options = [];

// Create Category
    $scope.createCategory = function (category) {
        if (!category.name || !category.description) {
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
    $scope.createTask = function (task, options, correct) {
        var category;
        $http.get($rootScope.serviceBase + "task-category/" + $routeParams.idCategory).then(function (response) {
            task.taskCategory = response.data;
            $scope.saveTask(task, options, correct);
            $http.put($rootScope.serviceBase + '/users/assign/xp/5', $rootScope.userAuthenticated).then(function (response) {
                $rootScope.userAuthenticated = response.data;
                $rootScope.showToast("Criar atividades te acrescenta +5 de xp!");
            });
        });
    }

    $scope.saveTask = function (task, options, correct) {
        $http.post($rootScope.serviceBase + "tasks", task).then(function (success) {
            $scope.saveOptions(success.data, options, correct);
        });
    }

    $scope.saveOptions = function (task, options, correct) {
        for (var i = 0; i < options.length; i++) {
            if (i != correct) {
                options[i].correct = false;
            } else {
                options[i].correct = true;
            }
            options[i].task = task;

            if (options[i].description != null) {
                $http.post($rootScope.serviceBase + "tasks/options", options[i]).then(function (res) {
                    $location.path('/rooms/' + task.taskCategory.classRoom.id);
                });
            }
        }
    }

    $scope.saveTaskAnswered = function (task, taskOption) {
        var taskAnsweed = {task: task, user: $rootScope.userAuthenticated, taskOption: taskOption};
        $http.post($rootScope.serviceBase + "tasks/answered", taskAnsweed).then(function (response) {
            $location.path("/rooms/" + task.taskCategory.classRoom.id);
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

// GetOne task
    var getOneTask = function (idTask) {
        if (idTask) {
            $http.get($rootScope.serviceBase + "tasks/" + idTask).then(function (response) {
                $scope.pageTitle = response.data.title;
                $scope.task = response.data;
                $scope.task.closingDate = new Date(response.data.closingDate);

                $http.get($rootScope.serviceBase + "tasks/options/list/" + $scope.task.id).then(function (success) {
                    $scope.options = success.data;

                    if ($rootScope.userAuthenticated.id != $scope.task.taskCategory.classRoom.teacher.id) {
                        var taskAnswered = {user: $rootScope.userAuthenticated, task: $scope.task};

                        loadTaskAnswered(taskAnswered);
                    } else {
                        for (var i=0; i < $scope.options.length; i++) {
                            if ($scope.options[i].correct) {
                                $scope.correct = i;
                                return null;
                            }
                        }
                    }
                });
            });
        }
    }

    var loadTaskAnswered = function (taskAnswered) {
        $http.post($rootScope.serviceBase + "tasks/answered/find", taskAnswered).then(function (res) {
            if (res.data != null || res.data != "") {
                verifyOption(res.data);
            }
        });
    }

    var verifyOption = function (taskAnswered) {
        for (var i=0; i < $scope.options.length; i++) {
            if ($scope.options[i].id == taskAnswered.taskOption.id) {
                $scope.choice = $scope.options[i].id;
                $scope.correct = $scope.options[i].id;
                $scope.task.answered = true;
            }
        }
    }

    getOneTask($routeParams.id);

// Conferir resposta
    $scope.evaluate = function (choice, task) {
        $http.get($rootScope.serviceBase + "tasks/options/" + choice).then(function (response) {
            if (response.data.correct) {
                $http.put($rootScope.serviceBase + 'users/assign/xp/10', $rootScope.userAuthenticated).then(function (response) {
                    $http.put($rootScope.serviceBase + 'users/assign/punctuation/5', response.data).then(function (response) {
                        $rootScope.userAuthenticated = response.data;
                        $rootScope.showToast("Você acertou, parabéns! +10 de xp e +5 de reputação!");
                    });
                });
            } else {
                $rootScope.userAuthenticated.punctuation -= 5;
                $http.put($rootScope.serviceBase + 'users', $rootScope.userAuthenticated).then(function (response) {
                    $rootScope.userAuthenticated = response.data;
                    $rootScope.showToast("Precisa estudar mais, amiguinho! Perdeu 5 pontos de reputação :(");
                });
            }

            $scope.saveTaskAnswered(task, response.data);
        });
    }

// Editar task
    $scope.edit = function (task, options, correct) {
        $http.put($rootScope.serviceBase + "tasks", task).then(function (response) {
            for (var i=0; i < options.length; i++) {
                if (i == correct) {
                    options[i].correct = true;
                } else {
                    options[i].correct = false;
                }
                $http.put($rootScope.serviceBase + "tasks/options", options[i]).then(function (response) {
                }, function (error) {
                    $rootScope.showToast("Desculpe :( houve algum erro ao salvar as alternativas.");
                    return null;
                });
            }
            $rootScope.showToast("Atividade atualizada com sucesso.");
            $location.path('/rooms/' + task.taskCategory.classRoom.id);
        });
    }

// Delete
    $scope.deleteTask = function (task) {
        var classroom = task.taskCategory.classRoom.id;
        $http.delete($rootScope.serviceBase + "tasks/" + task.id).then(function (response) {
            $rootScope.showToast("Atividade excluída com sucesso.");
            $location.path("/rooms/" + classroom);
        });
    }
    
// Cancelar edição
    $scope.cancelEdit = function (room) {
        $location.path('/rooms/' + room);
    }
});
