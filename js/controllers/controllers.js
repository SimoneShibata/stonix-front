app.run(function($rootScope) {
    $rootScope.user = {
        'id': 1,
        'name': 'José Almeida',
        'email': 'jose@almeida.com',
        'image': './img/user.jpg',
        'points': 1030,
        'rank': 10,
        'coins': 35
    };

    // $rootScope.questions = [
    //     {
    //         'id':1,
    //         'title':'Pergunta titulo aqui Pergunta titulo aqui Pergunta titulo aqui Pergunta titulo aqui Pergunta titulo aqui Pergunta titulo aqui Pergunta titulo aqui Pergunta titulo aqui Pergunta titulo aqui Pergunta titulo aqui Pergunta titulo aqui Pergunta titulo aqui Pergunta titulo aqui Pergunta titulo aqui Pergunta titulo aqui Pergunta titulo aqui Pergunta titulo aqui Pergunta titulo aqui Pergunta titulo aqui Pergunta titulo aqui Pergunta titulo aqui Pergunta titulo aqui Pergunta titulo aqui Pergunta titulo aqui Pergunta titulo aqui Pergunta titulo aqui Pergunta titulo aqui Pergunta titulo aqui Pergunta titulo aqui ',
    //         'description': 'Descricao da pergunta aqui Descricao da pergunta aqui Descricao da pergunta aqui Descricao da pergunta aqui Descricao da pergunta aqui Descricao da pergunta aqui Descricao da pergunta aqui Descricao da pergunta aqui Descricao da pergunta aqui Descricao da pergunta aqui Descricao da pergunta aqui Descricao da pergunta aqui Descricao da pergunta aqui Descricao da pergunta aqui Descricao da pergunta aqui Descricao da pergunta aqui Descricao da pergunta aqui Descricao da pergunta aqui Descricao da pergunta aqui Descricao da pergunta aquiDescricao da pergunta aquiDescricaoDescricao da pergunta aqui Descricao da pergunta aqui Descricao da pergunta aqui ',
    //         'likes': 12,
    //         'lastUpdate': '10/06/2016',
    //         'numberAnswers': 4
    //     }
    // ];

    $rootScope.serviceBase = "http://localhost:9990/api/";
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

    var config = {
            headers : {
                'Content-Type': 'application/json;charset=utf-8;'
            }
        }

    $scope.pageTitle = "Fórum";

    // GetAll - Lista questions
    $http.get($rootScope.serviceBase + "questions").then(function(response){
        $scope.questions = response.data;
    });

    // Post - Cria question
    $scope.createQuestion = function() {
        

        $http.post($rootScope.serviceBase + "questions/", $scope.question, this.config)
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
});

app.controller('NewQuestionController', function($scope, $rootScope, $http){

    $scope.pageTitle = "Fórum | Nova Pergunta";

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