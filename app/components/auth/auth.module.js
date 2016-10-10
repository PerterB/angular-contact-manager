angular
  .module('components.auth', [
    'ui.router',
    'firebase'
  ]).config(function($firebaseRefProvider){
  var config = {
      apiKey: "AIzaSyBF-WCC5  KqDsZ1C2kGkTa5WXwacDq9cEA4",
      authDomain: "contact-manager-dd6c5.firebaseapp.com",
      databaseURL: "https://contact-manager-dd6c5.firebaseio.com",
      storageBucket: "contact-manager-dd6c5.appspot.com",
      messagingSenderId: "49362835449"
  };
  $firebaseRefProvider.registerUrl({
    default:config.databaseURL,
    contacts:config.databaseURL+'/contacts',
  })
  firebase.initializeApp(config);
}).run(function($transitions, $state, AuthService ){
    $transitions.onStart ({
      to : function (state){
        return !!(state.data && state.data.requiredAuth);
      }
    }, function() {
        return AuthService
          .requireAuthentication()
          .catch(function(){
            return $state.target('auth.login');
          });
      });
    $transitions.onStart({
      to: 'auth.*'
    }, function () {
        if (AuthService.isAuthenticated ()) {
          return $state.target('app');
        }
    });

});


