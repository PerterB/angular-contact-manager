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
