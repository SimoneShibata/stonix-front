app.run(function ($rootScope, $http) {
    $rootScope.serviceBase = "http://localhost:9991/api/";
    $rootScope.uiBase = "http://localhost/stonix-front-end/#/";

    $http.get($rootScope.serviceBase + "users/auth")
        .then(
            function (response) {
                $rootScope.userAutenticate = response.data;
                $rootScope.logado = true;
            }
        );
    if ($rootScope.userAutenticate == null) {
        $rootScope.logado = false;
    }
});

app.controller('AppController', function ($scope, $mdSidenav, $location, $rootScope, $http, $mdToast) {

    $scope.toggleSidenav = function (menuId) {
        $mdSidenav(menuId).toggle();
    };

    $scope.navigateTo = function (url) {
        $location.path(url);
    };

// sair - logout
    $scope.logout = function () {
        $http.post($rootScope.serviceBase + "logout", $rootScope.userAutenticate, app.header)
            .then(
                function (response) {
                    $rootScope.userAutenticate = {};
                    $location.path('/login');
                },
                function (response) {
                    // failure callback
                }
            );
    };

// Toast
    var last = {
        bottom: false,
        top: true,
        left: false,
        right: true
    };
    $scope.toastPosition = angular.extend({}, last);
    $scope.getToastPosition = function () {
        return Object.keys($scope.toastPosition)
            .filter(function (pos) {
                return $scope.toastPosition[pos];
            })
            .join(' ');
    };
    $rootScope.showToast = function (message) {
        var pinTo = $scope.getToastPosition();
        $mdToast.show(
            $mdToast.simple()
                .content(message)
                .position(pinTo)
                .hideDelay(3000)
        );
    };

// Ranking
    $http.get($rootScope.serviceBase + "users/ranking/punctuation").then(function (response) {
        for (i=0; i<=response.data.length;i++) {
            if (response.data[i].id == $rootScope.userAutenticate.id) {
                $scope.rank = i + 1;
            }
        }
    });
});

app.controller('LoginController', function ($scope, $mdSidenav, $location, $http, $rootScope, $mdDialog) {

    $scope.toggleSidenav = function (menuId) {
        $mdSidenav(menuId).toggle();
    };

    $scope.navigateTo = function (url) {
        $location.path(url);
    };

// Login
    $scope.logar = function () {
        $http.post($rootScope.serviceBase + "login", $scope.user, app.header)
            .then(
                function (response) {
                    $rootScope.userAutenticate = response.data;
                    $rootScope.userAutenticate.rank = 1;
                    $rootScope.userAutenticate.coins = 0;
                    $location.path('/questions');
                },
                function (response) {
                    $rootScope.showToast("E-mail ou senha incorreto.");
                }
            );
    };

// Dialog
    var DialogController = function ($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };
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
        if (user.image == null) {
            user.image = "../../img/default.png";
        }
        $http.post($rootScope.serviceBase + "users", user).then(function () {
            $rootScope.showToast("Cadastrado com sucesso");
            $mdDialog.cancel();
        });
    }

});

app.controller('QuestionController', function ($scope, $rootScope, $http, $routeParams, $location, $mdToast) {

    $scope.pageTitle = "Fórum";

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

    function getNumberAnswer(questionResponse) {
        $http.get($rootScope.serviceBase + "answers/count/question/" + questionResponse.id).then(function (response) {
            questionResponse.numberAnswers = response.data;
            $scope.questions.push(questionResponse);
        });
    }

    function getNumberMyAnswer(myQuestion) {
        $http.get($rootScope.serviceBase + "answers/count/question/" + myQuestion.id).then(function (response) {
            myQuestion.numberAnswers = response.data;
            $scope.myQuestions.push(myQuestion);
        });
    }

// GetAll - Lista questions
    $scope.questions = [];
    $http.get($rootScope.serviceBase + "questions").then(function (response) {
        questionsResponse = response.data;
        for(var i = 0; i<response.data.length; i++){
            getNumberAnswer(questionsResponse[i]);
        }
    }, function (error) {
        // failure
    });

// GetAllMyQuestions - Somente minhas pergunta
    $scope.myQuestions = [];
    $http.get($rootScope.serviceBase + "questions/user/" + $rootScope.userAutenticate.id)
        .then(function (response) {
            questionsResponse = response.data;
            for(var i = 0; i<response.data.length; i++){
                getNumberMyAnswer(questionsResponse[i]);
            }
        }, function (error) {
            // failure
        });

// Post - Cria question
    $scope.question = {user: {}};
    $scope.createQuestion = function () {
        $scope.question.description = $scope.data.text;
        $scope.question.user = $rootScope.userAutenticate;
        $http.post($rootScope.serviceBase + "questions/", $scope.question, app.header)
            .then(
                function (response) {
                    $location.path(/questions/ + response.data.id);
                    $scope.question = {};
                    $http.put($rootScope.serviceBase + '/users/assign/xp/5', $rootScope.userAutenticate).then(function (response) {
                        $rootScope.userAutenticate = response.data;
                        $rootScope.showToast("Em dúvida? +5 de xp para você!");
                    });
                },
                function (response) {
                    // failure callback
                }
            );
    };

    if ($routeParams.id != null) {
        // GetOne - Chama Question solicitada
        $http.get($rootScope.serviceBase + "questions/" + $routeParams.id).then(function (response) {
            $scope.question = response.data;
        }, function (error) {
            // failure
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
        $scope.answer.user = $rootScope.userAutenticate;

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
                    $http.put($rootScope.serviceBase + '/users/assign/xp/10', $rootScope.userAutenticate).then(function (response) {
                        $rootScope.userAutenticate = response.data;
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
            if($rootScope.userAutenticate.id != userAnswer.id){
                $http.put($rootScope.serviceBase + '/users/assign/xp/40', userAnswer).then(function (response) {
                });
                $http.put($rootScope.serviceBase + '/users/assign/punctuation/50', userAnswer).then(function (response) {
                });
            }
            $http.put($rootScope.serviceBase + '/users/assign/punctuation/25', $rootScope.userAutenticate).then(function (response) {
                $rootScope.userAutenticate = response.data;
                $rootScope.userAutenticate = response.data;
            });
            $rootScope.showToast("Uauuuu, boa escolha! Aceitar a resposta te rendeu 25 pontos!");
        });
    };

//Nice em Question
    $scope.niceQuestion = function (question) {
        $http.get($rootScope.serviceBase + '/questions/nice/' + question.id).then(function (response) {
            $http.get($rootScope.serviceBase + "questions").then(function (response) {
                $scope.questions = response.data;
                $scope.question.nice++;
            });
        });
    };

// Nice em Answer
    $scope.niceAnswer = function (answer) {
        $http.get($rootScope.serviceBase + 'answers/nice/' + answer.id).then(function (response) {
            $http.get($rootScope.serviceBase + "answers/question/" + $scope.question.id).then(function (response) {
                $scope.answers = response.data;
            });
        });
    };

//Delete Answer
    $scope.deleteAnswer = function (answer) {
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
        }, function (response) {
            // failure
        });
    }

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
        $scope.comment.user = $rootScope.userAutenticate;

        $http.post($rootScope.serviceBase + "comment/answers/", $scope.comment)
            .then(function (response) {
                $scope.comments.push(response.data);
                $scope.comment = {};
            }, function (error) {
                // failure
            });
    };

// Text Editor
    $scope.data = {
        text: '',
        answer: ''
    }
    $scope.disabled = false;
    $scope.menu = [
        ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript'],
        [],
        [],
        ['font-size'],
        ['font-color', 'hilite-color'],
        ['remove-format'],
        ['ordered-list', 'unordered-list'],
        [],
        ['code', 'quote'],
        ['link', 'image'],
        ['css-class']
    ];

    $scope.cssClasses = ['test1', 'test2'];

    $scope.setDisabled = function () {
        $scope.disabled = !$scope.disabled;
    }

})
;

app.controller('SalasController', function ($scope) {

    $scope.pageTitle = "Salas de aula";

});

app.controller('JogoController', function ($scope) {

    $scope.pageTitle = "Jogo";

});

app.controller('RankingController', function ($scope, $http, $rootScope) {

    $scope.pageTitle = "Ranking";

    $http.get($rootScope.serviceBase + "users/ranking/punctuation").then(function (response) {
        $scope.users = response.data;

    });

    $http.get($rootScope.serviceBase + "users/ranking/level").then(function (response) {
        $scope.usersLevel = response.data;

    });

});

app.controller('PerfilController', function ($scope) {

    $scope.pageTitle = "Perfil";

});