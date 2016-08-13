app.config(function($stateProvider){
  $stateProvider
    .state('signup',{
      templateUrl: 'js/signup/signup.html',
      url: '/signup',
      controller: function($scope, UserFactory, AuthService, $state){
        $scope.newUser = {email:'', password:''};
        $scope.checkEmail = function(){
          if ($scope.newUserForm.email.$valid){
            UserFactory.checkEmail($scope.newUser.email)
            .then(function(data){
              $scope.exists = data.length > 0;
            });
          }
        };
        $scope.addUser = function(){
          UserFactory.addUser($scope.newUser)
          .then(function(user){
            AuthService.login($scope.newUser)
            .then(function(){
              $state.go('home');
            });
          });
        };
      }
    });
});
