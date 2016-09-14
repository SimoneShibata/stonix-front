$.ajaxPrefilter(function( options ) {
    options.async = true;
});
var app = angular.module('app', ['ngRoute', 'ngMaterial', 'ngMessages', 'wysiwyg.module']);

app.filter('to_trusted', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);

app.config(function ($mdThemingProvider, $mdIconProvider, $routeProvider) {

    $routeProvider
        .when('/login', {
            controller: "LoginController",
            templateUrl: "views/login/login.html",
        })
        .when('/cadastro', {
            controller: "LoginController",
            templateUrl: "views/login/cadastro.html",
        })
        
        .when('/oldowl', {
            templateUrl: "views/oldowl.html",
        })
        
        .when('/questions/answers/:id', {
            controller: "QuestionController",
            templateUrl: "views/forum/question-answer.html",
        })
        .when('/questions', {
            controller: "QuestionController",
            templateUrl: "views/forum/questions-list.html",
        })
        .when('/questions/:id', {
            controller: "QuestionController",
            templateUrl: "views/forum/question.html",
        })
        .when('/questions/edit/:id', {
            controller: "QuestionController",
            templateUrl: "views/forum/question-edit.html",
        })

        .when('/salas', {
            controller: "SalasController",
            templateUrl: "views/salas/salas.html",
        })

        .when('/jogo', {
            controller: "JogoController",
            templateUrl: "views/jogo/jogo.html",
        })

        .when('/ranking', {
            controller: "RankingController",
            templateUrl: "views/ranking/ranking.html",
        })

        .when('/perfil', {
            controller: "PerfilController",
            templateUrl: "views/perfil/perfil.html",
        })

        .otherwise({
            redirectTo: '/login'
        });


    $mdIconProvider
        .defaultIconSet("./img/svg/menu.svg", 24)
        .icon("menu", "./img/svg/menu.svg", 24);

    var themeMap = $mdThemingProvider.extendPalette('red', {
        '500': '#ab1d18'
    });
    $mdThemingProvider.definePalette('theme', themeMap);

    $mdThemingProvider.theme('default')
        .primaryPalette('theme')
        .accentPalette('blue');

    var whiteThemeMap = $mdThemingProvider.extendPalette('blue', {
        '500': '#fff'
    });
    $mdThemingProvider.definePalette('white', whiteThemeMap);

    $mdThemingProvider.theme('input')
        .primaryPalette('white');
});