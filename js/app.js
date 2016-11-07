$.ajaxPrefilter(function( options ) {
    options.async = true;
});
var app = angular.module('app', ['ngRoute', 'ngMaterial', 'ngMessages', 'wysiwyg.module', 'naif.base64']);

app.filter('to_trusted', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);


app.config(function ($mdThemingProvider, $mdIconProvider, $routeProvider, $httpProvider) {

    $httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push('AuthInterceptor');

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
        .when('/free/questions', {
            controller: "QuestionControllerFree",
            templateUrl: "views/forum/questions-list-free.html",
        })
        .when('/questions/:id', {
            controller: "QuestionController",
            templateUrl: "views/forum/question.html",
        })
        .when('/free/questions/:id', {
            controller: "QuestionControllerFree",
            templateUrl: "views/forum/question-free.html",
        })
        .when('/questions/edit/:id', {
            controller: "QuestionController",
            templateUrl: "views/forum/question-edit.html",
        })

        .when('/rooms', {
            controller: "RoomController",
            templateUrl: "views/rooms/rooms.html",
        })
        .when('/rooms/:id', {
            controller: "RoomController",
            templateUrl: "views/rooms/room.html",
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
        .when('/perfil-edit', {
            controller: "PerfilEditController",
            templateUrl: "views/perfil/perfil-edit.html",
        })
        .when('/perfil-edit-password', {
            controller: "PerfilEditController",
            templateUrl: "views/perfil/perfil-edit-password.html",
        })

        .when('/404', {
            templateUrl: "404.html",
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

app.factory('AuthInterceptor', ['$q', '$window', '$location', '$injector', function ($q, $window, $location, $injector) {

    var MyStorageService = $injector.get("MyStorageService");

    return {
        request: function (config) {
            config.headers = config.headers || {};
            //insere o token no header do cabeçalho
            if (MyStorageService.token.get()) {
                config.headers.Authorization = MyStorageService.token.get();
            }
            return config || $q.when(config);
        },
        response: function (response) {
            return response || $q.when(response);
        },
        responseError: function (rejection) {
            if (rejection.status === 403) {
                //limpa o token do storage
                MyStorageService.token.clear();
                $location.path("/login");
            } else {
                var message = rejection.data + '<br><br><i>' + rejection.status + ' - ' + rejection.statusText + '</i>';
                console.log(message);
            }
            return $q.reject(rejection);
        }
    };
}]);
