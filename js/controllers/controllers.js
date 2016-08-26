app.run(function($rootScope) {
    $rootScope.user = {
        'id': 1,
        'name': 'José Almeida',
        'email': 'jose@almeida.com',
        'dataNasc': '23/08/1990',
        'image': './img/user.jpg',
        'points': 1030,
        'rank': 10,
        'coins': 35,
        'level': 20,
        'xp': 15,
        'qtdPerguntas': 0,
        'qtdRespostas': 0,
        'qtdMelhoresPerguntas': 0,
        'qtdSalas':0,
        'ouro': 0,
        'prata': 0,
        'bronze': 0
    };

    $rootScope.otherUsers = [
        {
            'id': 2,
            'name': 'Marcelo Miranda',
            'email': 'marcelo@miranda.com',
            'image': './img/user2.jpg',
            'points': 542,
            'rank': 29,
            'coins': 5,
            'level': 11,
            'xp': 120
        },
        {
            'id': 3,
            'name': 'Josefina Silva',
            'email': 'josefina@silva.com',
            'image': './img/user3.jpg',
            'points': 2540,
            'rank': 7,
            'coins': 75,
            'level': 23,
            'xp': 30
        },
        {
            'id': 4,
            'name': 'Mariana Ribeiro',
            'email': 'mariana@ribeiro.com',
            'image': './img/user4.jpg',
            'points': 500,
            'rank': 38,
            'coins': 5,
            'level': 6,
            'xp': 990
        }
    ];

    $rootScope.serviceBase = "http://localhost:9991/api/";
    $rootScope.uiBase = "http://localhost/stonix-front-end/#/";
});

app.controller('AppController', function($scope, $mdSidenav,$location, $rootScope){

	$scope.toggleSidenav = function(menuId) {
		$mdSidenav(menuId).toggle();
	};

	$scope.navigateTo = function(url){
        $location.path(url);
    };

});

app.controller('LoginController', function($scope, $mdSidenav,$location){

	$scope.toggleSidenav = function(menuId) {
		$mdSidenav(menuId).toggle();
	};

	$scope.navigateTo = function(url){
        $location.path(url);
    };
});



app.controller('ForumController', function($scope, $http, $rootScope, $location){

	$scope.pageTitle = "Fórum";

});

app.controller('QuestionController', function($scope, $rootScope, $http, $routeParams, $location){

    $scope.pageTitle = "Fórum";

    var config = {
        headers : {
            'Content-Type': 'application/json;charset=utf-8;'
        }
    }

    $scope.getAllAnswers = function(){
        $http.get($rootScope.serviceBase + "answers/question/" + $routeParams.id).then(function(response){
            $scope.answers = response.data;
            console.log($scope.answers);
        });
    }

    // GetAll - Lista questions
    $http.get($rootScope.serviceBase + "questions").then(function(response){
        $scope.questions = response.data;
    });

    // Post - Cria question
    $scope.createQuestion = function() {
        $scope.question.description = $scope.data.text;
        
        $http.post($rootScope.serviceBase + "questions/", $scope.question, app.header)
       .then(
            function(response){
                $location.path(/questions/ + response.data.id);
                $scope.question = {};
                $rootScope.user.xp += 5;
                $rootScope.user.points += 5;
            }, 
           function(response){
                // failure callback
           }
        );
    };

    // GetOne - Chama Question solicitada
    $http.get($rootScope.serviceBase + "questions/" + $routeParams.id).then(function(response){
        $scope.question = response.data;
    });

    // Delete 
    $scope.deleteQuestion = function() {
        var configDelete = {
            headers: {
                'Authorization': 'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ==',
                'Accept': 'application/json;odata=verbose'
            }
        };
        $http.delete($rootScope.serviceBase + "questions/" + $routeParams.id, configDelete).then(function(response){
            $location.path('/questions');
        }, function(response){
            console.log('faioh');
        });
    }

    // Update - editar question
    $scope.editQuestion = function() {
        $http.put($rootScope.serviceBase + "questions/", $scope.question, this.config)
        .then(
            function(response){
                $location.path(/questions/ + response.data.id);
                $scope.question = {};
            }, 
           function(response){
             // failure callback
           }
        );
    };
    
    // Question Answer - responder
    $scope.answer = {question:{}};
    $scope.postAnswer = function(){

        $scope.answer.question = $scope.question;

        var configPost = {
            headers: {
                'Authorization': 'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ==',
                'Accept': 'application/json;odata=verbose'
            }
        };
        $http.post($rootScope.serviceBase + "answers/", $scope.answer, this.config)
            .then(
                function(response){
                    $scope.answer.description = "";
                    $scope.answers = $scope.getAllAnswers();
                },
                function(response){
                    // failure callback
                }
            );
    }
    // Botao show input
    $scope.toAnswer = function() {
        $scope.hideButton = true;
    }

    // GetAll - Lista answers
    $http.get($rootScope.serviceBase + "answers/question/" + $routeParams.id).then(function(response){
        $scope.answers = response.data;
    });
    
    $scope.acceptAnswer = function (answer) {
        $http.get($rootScope.serviceBase + '/answers/' + $routeParams.id + "/better/" + answer.id).then(function (response) {
            $scope.question.answered = true;
            $scope.answers = $scope.getAllAnswers();
        });
    }
    
    // Text Editor
    $scope.data = {
        text: '',
        answer:''
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

    $scope.setDisabled = function() {
        $scope.disabled = !$scope.disabled;
    }
});

app.controller('SalasController', function($scope){

	$scope.pageTitle = "Salas de aula";

});

app.controller('JogoController', function($scope){

	$scope.pageTitle = "Jogo";

});

app.controller('RankingController', function($scope){

	$scope.pageTitle = "Ranking";

});

app.controller('PerfilController', function($scope){

	$scope.pageTitle = "Perfil";

});

app.controller('FriendsController', function($scope){

    $scope.pageTitle = "Amigos";

});