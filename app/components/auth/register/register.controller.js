function Register(AuthService, $state){
  var ctrl = this;
  ctrl.$onInit = function(){
    ctrl.error = null;
    ctrl.user = {
      email:'',
      password:''
    };
  };

  ctrl.createUser = function(event){
    return AuthService
            .register(event.user)
      .then(function(){
        console.log('Success');
        //fully authorized
        $state.go('app');
      }, function(reason){
        ctrl.error = reason.message;
      })

  }
}
angular
  .module('components.auth')
  .controller('Register', Register);
