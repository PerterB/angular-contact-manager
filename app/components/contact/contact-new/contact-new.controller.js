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
