var posts = {
  bindings: {
    posts:'<'
  },
  templateUrl:'./posts.html',
  controller: 'PostsController'
};

angular
  .module('components.posts')
  .component('posts', posts)
  .config(function($stateProvider) {

    $stateProvider.state('posts', {
      parent:'app',
      url:'/posts',
      component: 'posts',
      resolve:{
        posts: function (PostService){
          return PostService.query();
        }
      }
    });

  });
