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

