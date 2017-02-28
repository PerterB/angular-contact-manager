angular
  .module('components.auth', [
    'ui.router',
    'firebase'
  ]).config(function($firebaseRefProvider){
  var config = {
       apiKey: "AIzaSyDT0Y-yKycEqZcktEPsiq3iwIOdVg5Xzos",
    authDomain: "contacts-manager-53cb1.firebaseapp.com",
    databaseURL: "https://contacts-manager-53cb1.firebaseio.com",
    storageBucket: "contacts-manager-53cb1.appspot.com",
    messagingSenderId: "776952146033"
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


