app.controller('QuestionController', function ($scope, $rootScope, $http, $routeParams, $location, $mdDialog, $mdToast) {

    $scope.pageTitle = "Fórum";
    
    $http.get($rootScope.serviceBase + "users/get-auth").then(function (response) {
        $rootScope.userAuthenticated = response.data;
        $http.get($rootScope.serviceBase + "users/ranking/punctuation").then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].id == $rootScope.userAuthenticated.id) {
                    $rootScope.rank = i + 1;
                }
            }
        });

        if (!$rootScope.userAuthenticated.tutor) {
            $scope.showTutorDialog();
        }
        // GetAllMyQuestions - Somente minhas pergunta
        $scope.myQuestions = [];
        $http.get($rootScope.serviceBase + "questions/user/" + $rootScope.userAuthenticated.id)
            .then(function (response) {
                $scope.myQuestions = response.data;
            }, function (error) {
                // failure
            });

    });

    $scope.showTutorDialog = function (ev) {
        $mdDialog.show({
            templateUrl: '../views/forum/tutor.html',
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

    var config = {
        headers: {
            'Content-Type': 'application/json;charset=utf-8;'
        }
    };

// GetAll Answers - atualiza lista de respostas
    $scope.getAllAnswers = function () {
        $http.get($rootScope.serviceBase + "answers/question/" + $scope.question.id).then(function (response) {
            $scope.answers = response.data;
            $scope.numberAnswers = response.data.length;
        });
    };


// GetAll - Lista questions
    $scope.questions = [];
    $http.get($rootScope.serviceBase + "questions").then(function (response) {
        $scope.questions = response.data;
    }, function (error) {
        // failure
    });

// Post - Cria question
    $scope.question = {user: {}};
    $scope.createQuestion = function () {
        $scope.question.description = $scope.data.text;
        $scope.question.user = $rootScope.userAuthenticated;
        console.log($scope.question);
        $http.post($rootScope.serviceBase + "questions/", $scope.question, app.header)
            .then(
                function (response) {
                    $location.path(/questions/ + response.data.id);
                    $scope.question = {};
                    $http.put($rootScope.serviceBase + '/users/assign/xp/5', $rootScope.userAuthenticated).then(function (response) {
                        $rootScope.userAuthenticated = response.data;
                        $rootScope.showToast("Em dúvida? +5 de xp para você!");
                    });
                },
                function (response) {
                    // failure callback
                }
            );
    };

// GetOne - Chama Question solicitada
    if ($routeParams.id != null) {
        $http.get($rootScope.serviceBase + "questions/" + $routeParams.id).then(function (response) {
            $scope.question = response.data;
        }, function (error) {
            if (error.status == 404) {
                $location.path('/404');
            }
        });
    }
// Delete
    $scope.deleteQuestion = function () {
        var configDelete = {
            headers: {
                'Authorization': 'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ==',
                'Accept': 'application/json;odata=verbose'
            }
        };
        $http.delete($rootScope.serviceBase + "questions/" + $scope.question.id, configDelete).then(function (response) {
            $location.path('/questions');
        }, function (response) {
            // failure
        });
    }

// Update - editar question
    $scope.editQuestion = function () {
        $http.put($rootScope.serviceBase + "questions/", $scope.question, this.config)
            .then(
                function (response) {
                    $location.path(/questions/ + response.data.id);
                    $scope.question = {};
                },
                function (response) {
                    // failure callback
                }
            );
    };

// Question Answer - responder
    $scope.answer = {question: {}, user: {}};
    $scope.postAnswer = function () {
        $scope.answer.question = $scope.question;
        $scope.answer.user = $rootScope.userAuthenticated;

        var configPost = {
            headers: {
                'Authorization': 'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ==',
                'Accept': 'application/json;odata=verbose'
            }
        };
        $http.post($rootScope.serviceBase + "answers/", $scope.answer, this.config)
            .then(
                function (response) {
                    $scope.answer.description = "";
                    $scope.answers = $scope.getAllAnswers();
                    $scope.question.numberAnswers++;
                    $http.put($rootScope.serviceBase + '/users/assign/xp/10', $rootScope.userAuthenticated).then(function (response) {
                        $rootScope.userAuthenticated = response.data;
                        $rootScope.showToast("Boaaaa, ganhou +10 xp!");
                    });
                },
                function (response) {
                    // failure callback
                }
            );
    }

    $scope.countAnswer = function (question) {
        $http.get($rootScope.serviceBase + "answers/count/question/" + question.id).then(function (response) {
            return response.data;
        });
    };

// Botao show input
    $scope.toAnswer = function () {
        $scope.hideButton = true;
    }

// Botao hide input
    $scope.hideInputAnswer = function () {
        $scope.hideButton = false;
    }

// GetAll - Lista answers
    $http.get($rootScope.serviceBase + "answers/question/" + $routeParams.id).then(function (response) {
        $scope.answers = response.data;
        $scope.numberAnswers = response.data.length;
    });

// Aceitar Melhor Resposta
    $scope.acceptAnswer = function (answer) {
        $http.get($rootScope.serviceBase + '/answers/' + $scope.question.id + "/better/" + answer.id).then(function (response) {
            $scope.question.answered = true;
            $scope.answers = $scope.getAllAnswers();
            var userAnswer = answer.user;
            if ($rootScope.userAuthenticated.id != userAnswer.id) {
                $http.put($rootScope.serviceBase + '/users/assign/xp/40', userAnswer).then(function (response) {
                });
                $http.put($rootScope.serviceBase + '/users/assign/punctuation/50', userAnswer).then(function (response) {
                });
            }
            $http.put($rootScope.serviceBase + '/users/assign/punctuation/25', $rootScope.userAuthenticated).then(function (response) {
                $rootScope.userAuthenticated = response.data;
                $rootScope.userAuthenticated = response.data;
            });
            $rootScope.showToast("Uauuuu, boa escolha! Aceitar a resposta te rendeu 25 pontos!");
        });
    };

//Dislike em Question
    $scope.dislikeQuestion = function (question) {
        $scope.question.dislike++;
        // $http.get($rootScope.serviceBase + '/questions/dislike/' + question.id).then(function (response) {
        //     $http.get($rootScope.serviceBase + "questions").then(function (response) {
        //         $scope.questions = response.data;
        //         $scope.question.dislike++;
        //     });
        // });
    };

//Delete Answer
    $scope.deleteAnswer = function (answer) {
        var questionId = answer.question.id;
        var configDelete = {
            headers: {
                'Authorization': 'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ==',
                'Accept': 'application/json;odata=verbose'
            }
        };
        $http.delete($rootScope.serviceBase + "answers/" + answer.id, configDelete).then(function (response) {
            $http.get($rootScope.serviceBase + "answers/question/" + $scope.question.id).then(function (response) {
                $scope.answers = response.data;
            });
            $http.get($rootScope.serviceBase + "questions/" + questionId).then(function (response) {
                $scope.question = response.data;
            });
        }, function (response) {
            // failure
        });
    };

// GetAllCommentAnswer - listar comentarios de resposta

    $scope.comments = [];
    $scope.listComments = function (answer) {
        $http.get($rootScope.serviceBase + "comment/answers/answer/" + answer.id)
            .then(
                function (response) {
                    $scope.comments = response.data;
                }, function (error) {
                    // failure
                }
            );
    };

    $scope.commentSelected = function (answer) {
        $scope.selected = answer.id;
        $scope.listComments(answer);
    }
    $scope.comment = {user: {}, answer: {}};
// Post Comment Answer - comentar resposta
    $scope.postCommentAnswer = function (answer) {
        $scope.comment.answer = answer;
        $scope.comment.user = $rootScope.userAuthenticated;

        $http.post($rootScope.serviceBase + "comment/answers/", $scope.comment)
            .then(function (response) {
                $scope.comments.push(response.data);
                $scope.comment = {};
                $scope.getAllAnswers();
            }, function (error) {
                // failure
            });
    };

// Text Editor
    $scope.data = {
        text: '',
        answer: ''
    };
    $scope.disabled = false;
    $scope.menu = [
        ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript'],
        ['font-size'],
        ['font-color', 'hilite-color'],
        ['remove-format'],
        ['ordered-list', 'unordered-list'],
        ['code', 'quote'],
        ['link', 'image'],
        ['css-class']
    ];

    $scope.cssClasses = ['test1', 'test2'];

    $scope.setDisabled = function () {
        $scope.disabled = !$scope.disabled;
    };

});
