function PostsController (PostService) {
  var ctrl = this;

  ctrl.savePost = function() {

      PostService.save({title: 'This is a test'})
        .$promise
        .then(function(res) {
            ctrl.posts.push(res);
        });
  };
}

angular
  .module('components.posts')
  .controller('PostsController', PostsController);
