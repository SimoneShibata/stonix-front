app.run(function ($rootScope, $http) {
    $rootScope.serviceBase = "http://localhost:9991/api/";
    $rootScope.uiBase = "http://localhost/stonix-front-end/#/";

    $http.get($rootScope.serviceBase + "users/auth")
        .then(
            function (response) {
                $rootScope.userAuthenticated = response.data;
                $rootScope.logado = true;
                $http.get($rootScope.serviceBase + "users/ranking/punctuation").then(function (response) {
                    for (var i = 0; i < response.data.length; i++) {
                        if (response.data[i].id == $rootScope.userAuthenticated.id) {
                            $rootScope.rank = i + 1;
                        }
                    }
                });
            }
        );
    if ($rootScope.userAuthenticated == null) {
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
        $http.post($rootScope.serviceBase + "logout", $rootScope.userAuthenticated, app.header)
            .then(
                function (response) {
                    $rootScope.userAuthenticated = {};
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
    
// pagina 404 voltar ultima pagina
    $rootScope.backLastPage = function () {
        window.history.back(2);
    }
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
                    $rootScope.userAuthenticated = response.data;
                    $location.path('/questions');
                    $http.get($rootScope.serviceBase + "users/ranking/punctuation").then(function (response) {
                        for (var i = 0; i < response.data.length; i++) {
                            if (response.data[i].id == $rootScope.userAuthenticated.id) {
                                $rootScope.rank = i + 1;
                            }
                        }
                    });
                },
                function (error) {
                    $rootScope.showToast("E-mail ou senha incorreto.");
                }
            );
    };

// Dialog
    var DialogController = function ($scope, $mdDialog) {
        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };
    };

    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
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
    };

    $scope.showThirdTutorDialog = function (ev) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: '../views/forum/tutor3.html',
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

    $scope.showSecondTutorDialog = function (ev) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: '../views/forum/tutor2.html',
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

    $scope.showSecond = function () {
        $scope.showSecondTutorDialog();
    };

    $scope.showThird = function () {
        $scope.showThirdTutorDialog();
    };

    $scope.finalTutor = function () {
        $rootScope.userAuthenticated.tutor = true;
        $rootScope.userAuthenticated.xp = $rootScope.userAuthenticated.xp + 20;
        $http.put($rootScope.serviceBase + 'users', $rootScope.userAuthenticated).then(function (response) {
            $rootScope.userAuthenticated = response.data;
        });
        $scope.cancel();
        $rootScope.showToast("Uauuu você concluiu o tutorial! 20 de XP a mais para você :)");
    }

});

app.controller('QuestionController', function ($scope, $rootScope, $http, $routeParams, $location,$mdDialog, $mdToast) {

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

    if(!$rootScope.userAuthenticated.tutor){
        $scope.showTutorDialog();
    }

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


// GetAll - Lista questions
    $scope.questions = [];
    $http.get($rootScope.serviceBase + "questions").then(function (response) {
        $scope.questions = response.data;
    }, function (error) {
        // failure
    });

// GetAllMyQuestions - Somente minhas pergunta
    $scope.myQuestions = [];
    $http.get($rootScope.serviceBase + "questions/user/" + $rootScope.userAuthenticated.id)
        .then(function (response) {
            $scope.myQuestions = response.data;
        }, function (error) {
            // failure
        });

// Post - Cria question
    $scope.question = {user: {}};
    $scope.createQuestion = function () {
        $scope.question.description = $scope.data.text;
        $scope.question.user = $rootScope.userAuthenticated;
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

app.controller('RoomController', function ($scope) {

    $scope.pageTitle = "Salas de aula";

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

app.controller('PerfilController', function ($scope, $rootScope, $location, $http, $filter) {

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

    var dateBirth = new Date(ano,mes,dia);

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