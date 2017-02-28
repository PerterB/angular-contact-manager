(function() {
'use strict';

    angular
        .module('components.posts')
        .factory('PostService', PostService);

    PostService.inject = ['$resource'];
    
    function PostService($resource) {
        return $resource('http://jsonplaceholder.typicode.com/posts/:id', 
            {
                id: '@id'
            }, {
                update:{
                    method:'PUT'
                }
            }
        );
    }
})();