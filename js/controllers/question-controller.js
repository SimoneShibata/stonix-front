app.controller('QuestionController', function ($scope, $rootScope, $http, $routeParams, $location, $mdDialog, $mdToast) {

    document.body.style.zoom = 0.9;

    var getLikedQuestion = function (myQuestion) {
        $http.post($rootScope.serviceBase + "questions/likes/find/like-user-question",
            {user: $rootScope.userAuthenticated, question: myQuestion})
            .then(function (response) {
                myQuestion.likedQuestion = response.data;
            });
    };

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

        var countLikesMyQuestion = function (myQuestion) {
            $http.get($rootScope.serviceBase + "questions/likes/question/" + myQuestion.id)
                .then(function (response) {
                    myQuestion.numberLikes = response.data.length;
                    getLikedQuestion(myQuestion);
                    countFlagsOnMyQuestion(myQuestion);
                });
        };

        var countFlagsOnMyQuestion = function (myQuestion) {
            $http.get($rootScope.serviceBase + "questions/flags/question/" + myQuestion.id)
                .then(function (response) {
                    myQuestion.numberFlags = response.data.length;
                });
        };

        // GetAllMyQuestions - Somente minhas pergunta
        $scope.myQuestions = [];
        $http.get($rootScope.serviceBase + "questions/user/" + $rootScope.userAuthenticated.id)
            .then(function (response) {
                $scope.myLimit = 8;
                $scope.myQuestions = response.data;
                for (var i = 0; i < $scope.myQuestions.length; i++) {
                    countLikesMyQuestion($scope.myQuestions[i]);
                }
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

            for (var i = 0; i < response.data.length; i++) {
                getLikedAnswer($scope.answers[i]);
            }
        });
    };

    var getLikeByUser = function (position) {
        $http.post($rootScope.serviceBase + "questions/likes/find/like-user-question",
            {user: $rootScope.userAuthenticated, question: $scope.questions[position]})
            .then(function (response) {
                $scope.questions[position].likedQuestion = response.data;
                $http.get($rootScope.serviceBase + "questions/likes/question/" + $scope.questions[position].id)
                    .then(function (response) {
                        $scope.questions[position].numberLikes = response.data.length;
                    });
            });
        $http.get($rootScope.serviceBase + "questions/flags/question/" + $scope.questions[position].id)
            .then(function (response) {
                $scope.questions[position].numberFlags = response.data.length;
                getFlagQuestionByUser($scope.questions[position]);
            });
    };

    var getFlagQuestionByUser = function (question) {
        $http.post($rootScope.serviceBase + "questions/flags/find/flag-user-question", {
            user: $rootScope.userAuthenticated,
            question: question
        })
            .then(function (response) {
                if (response.data) {
                    question.flaged = true;
                } else {
                    question.flaged = false;
                }
            });
    };

    $scope.unFlagQuestion = function (question) {
        $http.post($rootScope.serviceBase + "questions/flags/find/flag-user-question", {
            user: $rootScope.userAuthenticated,
            question: question
        })
            .then(function (response) {
                $http.delete($rootScope.serviceBase + "questions/flags/" + response.data.id)
                    .then(function (response) {
                        question.numberFlags--;
                        question.flaged = false;
                    })
            });
    };

    $scope.flagQuestion = function (question) {
        $http.post($rootScope.serviceBase + "questions/flags", {user: $rootScope.userAuthenticated, question: question})
            .then(function (response) {
                question.numberFlags++;
                question.flaged = true;
            })
    };

    $scope.countLikes = function (question) {
        $http.get($rootScope.serviceBase + "questions/likes/question/" + $scope.question.id)
            .then(function (response) {
                $scope.question.numberLikes = response.data.length;
            });
    };

    $scope.unlikeQuestion = function (question) {
        $http.post($rootScope.serviceBase + "questions/likes/find/like-user-question",
            {user: $rootScope.userAuthenticated, question: question})
            .then(function (response) {
                question.likedQuestion = response.data;
                $http.delete($rootScope.serviceBase + "questions/likes/" + question.likedQuestion.id).then(function (response) {
                    question.numberLikes--;
                    question.likedQuestion = response.data;
                });
            });
        };

    $scope.unlike = function (question) {
        $http.delete($rootScope.serviceBase + "questions/likes/" + question.likedQuestion.id).then(function (response) {
            question.numberLikes--;
            question.likedQuestion = response.data;
        });
    };

    var position;
    var verfyLikedQuestion = function () {
        for (var i = 0; i < $scope.questions.length; i++) {
            getLikeByUser(i);
        }
    };

    $scope.viewMore = function () {
        $scope.limitAll += 8;
    };

    $scope.viewMoreMy = function () {
        $scope.myLimit += 8;
    };

    $scope.getAll = function () {
        $scope.questions = [];
        $http.get($rootScope.serviceBase + "questions").then(function (response) {
            $scope.diference = 0;
            $scope.limitAll = 8;
            $scope.questions = response.data;
            verfyLikedQuestion();
        }, function (error) {
            // failure
        });
    };

    $scope.getAll();


    $scope.unFlagAnswer = function (answer) {
        $http.post($rootScope.serviceBase + "answers/flags", answer.flaged)
            .then(function (success) {
                console.log(success.data);
                $http.delete($rootScope.serviceBase + "answers/flags/" + success.data.id)
                    .then(function (response) {
                        answer.flaged = response.data;
                        answer.numberFlags--;
                    });
            });
    };

    $scope.flagAnswer = function (answer) {
        $http.post($rootScope.serviceBase + "answers/flags", {user: $rootScope.userAuthenticated, answer: answer})
            .then(function (response) {
                console.log(response.data);
                answer.numberFlags++;
                answer.flaged = response.data;
            });
    };

    $scope.newLikeQuestion = function (question) {
        $http.post($rootScope.serviceBase + "questions/likes", {user: $rootScope.userAuthenticated, question: question})
            .then(function (response) {
                question.numberLikes++;
                question.likedQuestion = true;
            });
    };

    window.setInterval(function () {
        $http.get($rootScope.serviceBase + "questions").then(function (response) {
            $scope.questionsUp = response.data;

            if ($scope.questionsUp.length > $scope.questions.length) {
                $scope.diference = $scope.questionsUp.length - $scope.questions.length;
            }
            if ($scope.questionsUp.length < $scope.questions.length) {
                $scope.getAll();
            }
        }, function (error) {
            // failure
        });
    }, 3000);

    $scope.newLike = function (question) {
        $http.post($rootScope.serviceBase + "questions/likes", {user: $rootScope.userAuthenticated, question: question})
            .then(function (response) {
                question.numberLikes++;
                question.likedQuestion = response.data;
            });
    };

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

    var getOne = function (id) {
        $http.get($rootScope.serviceBase + "questions/flags/question/" + $scope.questions[position].id)
            .then(function (response) {
                $scope.question.numberFlags = response.data.length;
                getFlagQuestionByUser($scope.question);
            });
    }

// GetOne - Chama Question solicitada
    if ($routeParams.id != null) {
        $http.get($rootScope.serviceBase + "questions/" + $routeParams.id).then(function (response) {
            $scope.question = response.data;
            $http.get($rootScope.serviceBase + "questions/likes/question/" + $scope.question.id)
                .then(function (response) {
                    $scope.question.numberLikes = response.data.length;
                    getLikedQuestion($scope.question);
                });
            $http.get($rootScope.serviceBase + "questions/flags/question/" + $scope.question.id)
                .then(function (response) {
                    $scope.question.numberFlags = response.data.length;
                    getFlagQuestionByUser($scope.question);
                });
        }, function (error) {
            if (error.status == 404) {
                $location.path('/404');
            }
        });
    }
// Delete Question
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
                    $location.path("/questions/" + response.data.id);
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

        for (var i = 0; i < response.data.length; i++) {
            getLikedAnswer($scope.answers[i]);
            countLikesAnswer($scope.answers[i]);
        }
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
        ['bold', 'italic', 'underline', 'strikethrough', 'link', 'image', 'quote'],
        ['left-justify', 'center-justify', 'right-justify'],
        ['ordered-list', 'unordered-list', 'outdent', 'indent'],
        ['format-block'],
        ['font'],
        ['font-size'],
        ['font-color', 'hilite-color'],
        ['remove-format'],
        ['code']
    ];

    $scope.cssClasses = ['test1', 'test2'];

    $scope.setDisabled = function () {
        $scope.disabled = !$scope.disabled;
    };

    $scope.unlikeAnswer = function (answer) {
        $http.delete($rootScope.serviceBase + "answers/likes/" + answer.likedAnswer.id).then(
            function (response) {
                answer.likedAnswer = response.data;
                answer.numberLikes --;
            });
    };
    $scope.likeAnswer = function (answer) {
        $http.post($rootScope.serviceBase + "answers/likes",
            {user: $rootScope.userAuthenticated, answer: answer})
            .then(function (response) {
                answer.likedAnswer = response.data;
                answer.numberLikes ++;
            });
    };
    var verifyLikedAnswer = function () {
        for (var i = 0; i < $scope.answers.length; i++) {
            getLikeAnswerByUser(i);
        }
    };

    var getNumberLikeAnswer = function (answer) {
        $http.get($rootScope.serviceBase + "answers/likes/answer/" + answer.id)
            .then(function (response) {
                answer.numberLikes = response.data.length;
            });
    };
    var getLikeAnswerByUser = function (position) {
        $http.post($rootScope.serviceBase + "answers/likes/find/like-user-answer",
            {user: $rootScope.userAuthenticated, answer: $scope.answers[position]})
            .then(function (response) {
                $scope.getAllAnswers();
            });
    };

    var countFlagByAnswer = function (answer) {
        $http.get($rootScope.serviceBase + "answers/flags/answer/" + answer.id)
            .then(function (response) {
                answer.numberFlags = response.data.length;
            })
    }

    var getFlagByUserOnAnswer = function (answer) {
        $http.post($rootScope.serviceBase + "answers/flags/find/flag-user-answer", {user:$rootScope.userAuthenticated, answer:answer})
            .then(function (response) {
                answer.flaged = response.data;
                countFlagByAnswer(answer);
            })
    };

    var getLikedAnswer = function (answer) {
        $http.post($rootScope.serviceBase + "answers/likes/find/like-user-answer",
            {user: $rootScope.userAuthenticated, answer: answer})
            .then(function (response) {
                answer.likedAnswer = response.data;
                getNumberLikeAnswer(answer);
            });

    };
    var countLikesAnswer = function (answer) {
        $http.get($rootScope.serviceBase + "answers/likes/answer/" + answer.id)
            .then(function (response) {
                answer.numberLikes = response.data.length;
                getFlagByUserOnAnswer(answer);
            });
    };

// Clear Question
    $scope.clearNewQuestion = function () {
        $scope.question = {};
    }
});
