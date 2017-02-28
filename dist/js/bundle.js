(function(angular){
'use strict';
angular
  .module('root', [
    'common',
    'components',
    'templates'
  ]);
})(window.angular);
(function(angular){
'use strict';
angular
  .module('common', [
    'ui.router',
    'angular-loading-bar'
  ])
  .run(["$transitions", "cfpLoadingBar", function($transitions, cfpLoadingBar){
    $transitions.onStart({}, cfpLoadingBar.start);
    $transitions.onSuccess({}, cfpLoadingBar.complete);
  }])
})(window.angular);
(function(angular){
'use strict';
angular
  .module('components', [
    'components.contact',
    'components.auth'
  ]);
})(window.angular);
(function(angular){
'use strict';
angular
  .module('components.auth', [
    'ui.router',
    'firebase'
  ]).config(["$firebaseRefProvider", function($firebaseRefProvider){
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
}]).run(["$transitions", "$state", "AuthService", function($transitions, $state, AuthService ){
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

}]);


})(window.angular);
(function(angular){
'use strict';
angular
  .module('components.contact', [
    'ui.router'
  ]);
})(window.angular);
(function(angular){
'use strict';
var root = {
  templateUrl: './root.html'
};

angular
  .module('root')
  .component('root', root);
})(window.angular);
(function(angular){
'use strict';
var appNav  = {
  bindings:{
    user:'<',
    onLogout:'&'
  },
  templateUrl: './app-nav.html'
}

angular.module('common')
    .component('appNav', appNav)
})(window.angular);
(function(angular){
'use strict';
var sidebar = {
  templateUrl:'./app-sidebar.html',
  bindings:{},
  controller:'AppSideBarController'
}
angular
  .module('common')
  .component('appSidebar', sidebar);
})(window.angular);
(function(angular){
'use strict';
function SideBarController(){

  var ctrl = this;
  ctrl.contactTags = [
    {
      label:'All Contacts',
      icon: 'star'
    },
    {
      label:'Friends',
      icon: 'people'
    },
    {
      label:'Family',
      icon: 'child_care'
    },
    {
      label:'Acquaintances',
      icon: 'accessibility'
    },
    {
      label:'Following',
      icon: 'remove_red_eye'
    }
  ]

}

angular
  .module('common')
  .controller('AppSideBarController', SideBarController)
})(window.angular);
(function(angular){
'use strict';
var app = {
  templateUrl : './app.html',
  controller: 'AppController'
}

angular.module('common')
.component ('app', app)
  .config(["$stateProvider", function ($stateProvider){
    $stateProvider
      .state('app', {
        url : '/app',
        data: {
          requiredAuth : true
        },
        component: 'app',
        redirectTo:'contacts'
      })
  }]);
})(window.angular);
(function(angular){
'use strict';
AppController.$inject = ["AuthService", "$state"];
function AppController (AuthService, $state) {
  var ctrl = this;
   ctrl.user = AuthService.getUser();
  ctrl.logout = function(){
    AuthService.logout().then(function(){
      $state.go('auth.login');
    })
  }
}


angular
  .module('common')
  .controller ('AppController', AppController);
})(window.angular);
(function(angular){
'use strict';
AuthService.$inject = ["$firebaseAuth"];
function AuthService($firebaseAuth){
  var auth = $firebaseAuth();
  var authData = null;
  function clearAuthData(){
    authData = null;
  }
  function storeAuthData(response) {
    authData = response;
    return authData;
  }
  function onSignIn(user) {
    authData = user;
    return auth.$requireSignIn();
  }
  this.register  = function(user){
    console.log(user);
    return auth
      .$createUserWithEmailAndPassword(user.email, user.password)
      .then(storeAuthData);
  }
  this.login = function (user) {
    return auth
      .$signInWithEmailAndPassword(user.email, user.password)
      .then(storeAuthData);
  }

  this.requireAuthentication = function () {
    return auth
      .$waitForSignIn().then( onSignIn );
  }

  this.isAuthenticated = function () {
    return !!authData;
  }

  this.getUser = function () {
    if (authData) {
      return authData
    }
  }

  this.logout = function(){
    return auth.$signOut().then(clearAuthData)
  }
}
angular
  .module('components.auth')
  .service('AuthService', AuthService);
})(window.angular);
(function(angular){
'use strict';
ContactService.$inject = ["AuthService", "$firebaseRef", "$firebaseArray", "$firebaseObject"];
function ContactService (AuthService, $firebaseRef, $firebaseArray, $firebaseObject ){
  var ref = $firebaseRef.contacts;
  var uid = AuthService.getUser().uid;

  function createNewContact (contact) {
    return $firebaseArray(ref.child(uid)).$add(contact);
  }

  function getContactById (id){
    return $firebaseObject(ref.child(uid).child(id));
  }

  function updateContact (contact) {
    return contact.$save();
  }

  function deleteContact (contact) {
    return contact.$remove();
  }

  function getContactList () {
    return $firebaseArray (ref.child(uid));
  }
  return {
    createNewContact: createNewContact,
    updateContact: updateContact,
    deleteContact: deleteContact,
    getContactById: getContactById,
    getContactList: getContactList
  }

}


angular
  .module('common')
  .factory('ContactService', ContactService);

})(window.angular);
(function(angular){
'use strict';
var authForm = {
  bindings:{
    user:'<',
    button:'@',
    message:'@',
    onSubmit:'&'
  },
  templateUrl:'./auth-form.html',
  controller:'AuthFormController'
};
angular
  .module('components.auth')
  .component('authForm', authForm);

// user = "$ctrl.user"
// message="{{$ctrl.error}}"
// button="Create user"
// on-submit="$ctrl.createUser($event);">
})(window.angular);
(function(angular){
'use strict';
function AuthFormController(){
  var ctrl = this;
    ctrl.$onChanges = function(changes){
    if(changes.user){
      ctrl.user = angular.copy(ctrl.user);
    }
  }

  ctrl.submitForm = function(){
    ctrl.onSubmit({
      $event:{
        user: ctrl.user
      }
    })
  }
}

angular
  .module('components.auth')
  .controller('AuthFormController', AuthFormController);
})(window.angular);
(function(angular){
'use strict';
var login = {
  templateUrl:'./login.html',
  controller: 'LoginController'
}

angular
  .module('components.auth')
  .component('login', login)
  .config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){
    $stateProvider
      .state('auth',{
        redirectTo:'auth.login',
        url:'/auth',
        template:'<div ui-view></div>'
      })
      .state('auth.login',{
        url:'/login',
        component:'login'
      });
    $urlRouterProvider.otherwise('auth/login');

  }]);
})(window.angular);
(function(angular){
'use strict';
LoginController.$inject = ["AuthService", "$state"];
function LoginController(AuthService, $state){
  var ctrl = this;
  ctrl.$onInit = function(){
    ctrl.error = null;
    ctrl.user = {
      email:'',
      password:''
    };
  };

  ctrl.loginUser = function(event){
    return AuthService
      .login(event.user)
      .then(function(){
        $state.go('app');
      }, function(reason){
        ctrl.error = reason.message;
      })

  }
}

angular
  .module('components.auth')
  .controller('LoginController', LoginController);
})(window.angular);
(function(angular){
'use strict';
var register = {
  templateUrl:'./register.html',
  controller:'Register'
}
angular
  .module('components.auth')
  .component('register', register)
  .config(["$stateProvider", function($stateProvider){
    $stateProvider
      .state('auth.register',{
        url:'/register',
        component:'register'

      })

  }])
})(window.angular);
(function(angular){
'use strict';
Register.$inject = ["AuthService", "$state"];
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
})(window.angular);
(function(angular){
'use strict';
var contactDetail = {
  bindings:{
    contact:'<',
    onSave:'&',
    onUpdate: '&',
    onDelete: '&'
  },
  templateUrl : './contact-detail.html',
  controller:'ContactDetailController'

}

angular
  .module('components.contact')
  .component('contactDetail', contactDetail);
})(window.angular);
(function(angular){
'use strict';
function ContactDetailController () {
  var ctrl = this;
  ctrl.$onInit = function () {
     ctrl.isNewContact = !ctrl.contact.$id;
  }
  ctrl.saveContact = function () {
    ctrl.onSave ( {
      $event : {
        contact : ctrl.contact
      }
    })
  }

  ctrl.updateContact = function () {
    ctrl.onUpdate  ( {
      $event : {
        contact : ctrl.contact
      }
    })
  }

  ctrl.deleteContact = function () {
    ctrl.onDelete ( {
      $event : {
        contact : ctrl.contact
      }
    })
  }

  ctrl.tagChange  = function (event) {
    ctrl.contact.tag = event.tag;
    ctrl.updateContact();
  }
}

angular
  .module('components.contact')
  .controller ('ContactDetailController', ContactDetailController);

})(window.angular);
(function(angular){
'use strict';
var contactEdit = {
  bindings : {
    contact:'<'
  },
  controller : 'ContactEditController',
  templateUrl: './contact-edit.html'
}



angular
  .module('components.contact')
  .component('contactEdit', contactEdit)
  .config ( ["$stateProvider", function ($stateProvider){
    $stateProvider.state('contact ', {
      url:'/contact/:id',
      parent: 'app',
      component: 'contactEdit',
      resolve : {
        contact : ["$transition$", "ContactService", function ($transition$, ContactService) {
          var key = $transition$.params().id;
          return ContactService.getContactById(key).$loaded();
          //return
        }]
      }
    })
  }]);
})(window.angular);
(function(angular){
'use strict';
ContactEditController.$inject = ["$state", "ContactService", "cfpLoadingBar", "$window"];
function ContactEditController ($state,  ContactService, cfpLoadingBar, $window) {
  var ctrl = this;
  ctrl.updateContact = function (event) {
    cfpLoadingBar.start();
    return ContactService
      .updateContact(event.contact)
      .then(cfpLoadingBar.complete,  cfpLoadingBar.complete);
  }
  ctrl.deleteContact = function (event) {
    var message = 'Delete' + event.contact.name + ' from contacts';
    if( $window.confirm (message)){
      return ContactService
        .deleteContact (event.contact)
        .then (function () {
          $state.go ('contacts');
        })
    }

  }
}

angular
  .module('components.contact')
  .controller('ContactEditController', ContactEditController)
})(window.angular);
(function(angular){
'use strict';
var contactNew = {
  templateUrl : "./contact-new.html",
  controller: "ContactNewController"
};

angular
  .module('components.contact')
  .component('contactNew', contactNew)
  .config(["$stateProvider", function($stateProvider){
    $stateProvider.state('new', {
      parent:'app',
      url: '/new',
      component:'contactNew'
    });
  }])
;
})(window.angular);
(function(angular){
'use strict';
ContactNewController.$inject = ["ContactService", "$state"];
function ContactNewController (ContactService, $state){
  var ctrl = this;
  ctrl.$onInit = function (){
    ctrl.contact = {
      name: '',
      email: '',
      job: '',
      location: '',
      social : {
        facebook: '',
         github: '',
        twitter: '',
        linkedin: ''
      },
      tag: 'none ',
    }
  }
  ctrl.createNewContact = function (event){
    ContactService.createNewContact(event.contact)
      .then(function (contact) {
        console.log(contact.key);
        $state.go ('contact',{
          id: contact.key
        });
      })
    //ctrl.contact
  }
}

angular
  .module('components.contact')
  .controller('ContactNewController', ContactNewController);
})(window.angular);
(function(angular){
'use strict';
var contacts = {
  bindings: {
    contacts:'<'
  },
  templateUrl:'./contacts.html',
  controller: 'ContactsController'
};
angular
  .module('components.contact')
  .component('contacts', contacts)
  .config(["$stateProvider", function($stateProvider){
    $stateProvider.state('contacts', {
      parent:'app',
      url:'/contacts',
      component: 'contacts',
      resolve:{
        contacts: ["ContactService", function (ContactService){
          return ContactService.getContactList().$loaded();
        }]
      }
    })
  }]);
})(window.angular);
(function(angular){
'use strict';
function ContactsController () {
  var ctrl = this;
  ctrl.goToContact = function(event) {
    $state.go ('contact', {id: event.contactId });
  }
}

angular
  .module('components.contact')
  .controller('ContactsController', ContactsController);
})(window.angular);
(function(angular){
'use strict';
var contactTag = {
  bindings:{
    tag: '<',
    onChange:'&'
  },
  templateUrl: './contact-tag.html',
  controller: 'ContactTagController'
}

angular
  .module('components.contact')
  .component('contactTag', contactTag);
})(window.angular);
(function(angular){
'use strict';
function ContactTagController (){
  var ctrl = this;
  ctrl.$onInit = function () {
    ctrl.tags = [
      'friends', 'family', 'following', 'acquaintaances'
    ];
  };

  ctrl.$onChanges = function (changes) {
    if (changes.tag) {
      ctrl.tag = angular.copy(ctrl.tag)
    }
  }

  ctrl.updateTag = function (tag) {
    ctrl.onChange ({
      $event:{
         tag : tag
      }
    })
  }
}

angular
  .module('components.contact')
  .controller('ContactTagController', ContactTagController);
})(window.angular);
(function(angular){
'use strict';
angular.module('templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('./root.html','<div class="root"><div ui-view></div></div>');
$templateCache.put('./app-nav.html','<header class="header"><div class="header__fixed"><div><div class="header__brand">Contacts <a ui-sref="new" class="header__button header__button--new-contact"><i class="material-icons">add_circle_outline</i> New Contact</a></div><div class="header__logout">{{::$ctrl.user.email }} <a href="" ng-click="$ctrl.onLogout()"><span class="header__button"><i class="material-icons">power_settings_new </i>Logout</span></a></div></div></div></header>');
$templateCache.put('./app-sidebar.html','<aside class="sidebar"><div class="sidebar__logo"><a href=""><img src="/img/logo/png" alt=""></a></div><span class="sidebar__header">Tags</span><ul class="sidebar__list"><li class="sidebar__item" ng-repeat="item in ::$ctrl.contactTags"><a href="" class="sidebar__link"><i class="material-icons">{{ ::item.icon }} </i>{{ ::item.label }}</a></li></ul></aside>');
$templateCache.put('./app.html','<div class="root"><app-nav user="$ctrl.user" on-logout="$ctrl.logout"></app-nav><app-sidebar></app-sidebar><div class="app" ui-view></div></div>');
$templateCache.put('./auth-form.html','<form name="authForm" novalidate ng-submit="$ctrl.submitForm();"><label><input type="email" name="email" required="required" placeholder="Enter your email" ng-model="$ctrl.user.email"></label><label><input type="password" name="password" required="required" placeholder="Enter your password" ng-model="$ctrl.user.password "></label><div class="auth-button"><button type="submit" ng-disabled="authForm.$invalid">{{$ctrl.button}}</button></div><div><div ng-if="$ctrl.message ">{{$ctrl.message }}</div></div></form>');
$templateCache.put('./login.html','<div class="auth"><h1>Login</h1><auth-form user="$ctrl.user" message="{{$ctrl.error}}" button="Login" on-submit="$ctrl.loginUser($event);"></auth-form></div><div class="auth__info"><a ui-sref="auth.register">It\'s your lucky day today. Create account here</a></div>');
$templateCache.put('./register.html','<div class="auth"><h1>Register</h1><auth-form user="$ctrl.user" message="{{$ctrl.error}}" button="Create user" on-submit="$ctrl.createUser($event);"></auth-form></div><div class="auth__info"><a ui-sref="auth.login">Have an account? Login now</a></div>');
$templateCache.put('./contact-detail.html','<div class="contact"><form name="contactDetailForm" novalidate><div><span class="contact__required">*</span>field is required</div><div class="contact__box"><h3 class="contact__sub-title">Personal</h3><div class="contact__field"><label>Name <span class="contact__required">*</span></label><input type="text" name="name" required="required" ng-model="$ctrl.contact.name" ng-change="$ctrl.updateContact()" ng-model-options="{\n            \'updateOn\' : \'default blur\',\n            \'debounce\' : {\n              \'default\': 250,\n              \'blur\': 0\n            }\n          }"></div><div class="contact__field"><label>Email <span class="contact__error" ng-if="contactDetailForm.email.$touched && contactDetailForm.email.$error.email">Must be a valid email</span></label><input type="email" name="email " ng-model="$ctrl.contact.email" ng-model-options="{\n            \'updateOn\' : \'default blur\',\n            \'debounce\' : {\n              \'default\': 250,\n              \'blur\': 0\n            }\n          }"></div><div class="contact__field"><label>Job</label><input type="text" name="jobTitle" ng-model="$ctrl.contact.job" ng-model-options="{\n            \'updateOn\' : \'default blur\',\n            \'debounce\' : {\n              \'default\': 250,\n              \'blur\': 0\n            }\n          }"></div><div class="contact__field"><label>Location</label><input type="text" name="location" ng-model="$ctrl.contact.location" ng-model-options="{\n            \'updateOn\' : \'default blur\',\n            \'debounce\' : {\n              \'default\': 250,\n              \'blur\': 0\n            }\n          }"></div></div><div class="contact__box contact__box--no-margin"><h3 class="contact__sub-title">Social</h3><div class="contact__field"><label>Facebook</label><input type="text" name="facebook" ng-model="$ctrl.contact.social.facebook" ng-model-options="{\n            \'updateOn\' : \'default blur\',\n            \'debounce\' : {\n              \'default\': 250,\n              \'blur\': 0\n            }\n          }"></div><div class="contact__field"><label>Github</label><input type="text" name="github" ng-model="$ctrl.contact.social.github" ng-model-options="{\n            \'updateOn\' : \'default blur\',\n            \'debounce\' : {\n              \'default\': 250,\n              \'blur\': 0\n            }\n          }"></div><div class="contact__field"><label>Twitter</label><input type="text" name="twitter" ng-model="$ctrl.contact.social.twitter" ng-model-options="{\n            \'updateOn\' : \'default blur\',\n            \'debounce\' : {\n              \'default\': 250,\n              \'blur\': 0\n            }\n          }"></div><div class="contact__field"><label>Linkedin</label><input type="text" name="linkedIn" ng-model="$ctrl.contact.social.linkedIn" ng-model-options="{\n            \'updateOn\' : \'default blur\',\n            \'debounce\' : {\n              \'default\': 250,\n              \'blur\': 0\n            }\n          }"></div></div><contact-tag tag="$ctrl.contact.tag" on-change="$ctrl.tagChange($event);"></contact-tag><div ng-if="$ctrl.isNewContact"><button ng-disabled="contactDetailForm.$invalid" ng-click="$ctrl.saveContact();">Create Contact</button></div><div ng-if="!$ctrl.isNewContact"><button class="delete" ng-click="$ctrl.deleteContact();">Delete Contact</button></div></form></div>');
$templateCache.put('./contact-edit.html','<contact-detail contact="$ctrl.contact" on-delete="$ctrl.deleteContact($event);" on-update="$ctrl.updateContact($event);"></contact-detail>');
$templateCache.put('./contact-new.html','<contact-detail contact="$ctrl.contact" on-save="$ctrl.createNewContact($event);"></contact-detail>');
$templateCache.put('./contact-tag.html','<div class="contact__field contact__field--long"><label>Tag</label><ul><li class="contact-card__pill contact-card__pill--{{ tag }}" ng-repeat="tag in ::$ctrl.tags" ng-class="{\n      \'contact__pill--active\': $ctrl.tag == tag\n    }"><a href="" ng-click="$ctrl.updateTag(tag);">{{::tag}}</a></li></ul></div>');
$templateCache.put('./contacts.html','<div class="contacts"><ul class="contacts-list"><li ng-repeat="contact in $ctrl.contacts">{{contact}}</li></ul><div class="contacts__empty" ng-if="!$ctrl.contacts.length"><i class="material-icons">face There is no one here yet</i></div></div>');}]);})(window.angular);
//# sourceMappingURL=bundle.js.map
