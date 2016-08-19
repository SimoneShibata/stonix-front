app.controller('QuestionController', [ "$scope", function($scope){

    $scope.pageTitle = "Fórum";



    $scope.question = {
        'title': 'Qual é a melhor plataforma educacional que une diversão e conhecimento?',
        'description': 'Conheça Stonix Hero, a plataforma educacional que une professores e alunos em um só lugar. Qualquer usuário poderá acessar o fórum, onde todos podem sanar suas dúvidas e ajudar outras pessoas respondendo. Os professores poderão criar sala de aulas para suas turmas, onde poderão colocar materiais de estudo e atividades com remuneração em pontos para o jogo.',
        'numberAnswers': 4,
        'likes': 12,
        'lastUpdate': '10/08/2016 10:21'
    };

    $scope.user = {
        'name': 'José Almeida',
        'email': 'jose@almeida.com',
        'image': './img/user.jpg',
        'points': 1030,
        'rank': 10,
        'coins': 35
    };

}]);