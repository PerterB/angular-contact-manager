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
  .config ( function ($stateProvider){
    $stateProvider.state('contact ', {
      url:'/contact/:id',
      parent: 'app',
      component: 'contactEdit',
      resolve : {
        contact : function ($transition$, ContactService) {
          var key = $transition$.params().id;
          return ContactService.getContactById(key).$loaded();
          //return
        }
      }
    })
  });
