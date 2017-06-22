
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */

angular.module('t2s.services', [])

	.factory('plmMetadata', function ($http, $rootScope) {

		var getCallback = function (data, status, headers, config) {
            return data;
        };
    	var students;
    	return {
	        
	        getAllCatalogues: function (schoolId, academicPeriod) {
	          var url = "http://54.76.9.160:3001/api/HierarchyNodes/catalogues";
	          return $http.get(url, {
	              method: 'GET'
	          }).success(getCallback);
	        },

	        getMetadata: function (catalogue) {
	          var url = "http://54.76.9.160:3001/api/HierarchyNodes/metadata";
	          return $http.get(url, {
	              method: 'GET',
	              params: {
	                  name : catalogue
	              }
	          }).success(getCallback);
	        },

	        createProduct: function (data) {
	          var url = "http://54.76.9.160:3000/api/Products/productApi";
	          return $http.post(url, data, {
	              	method: 'POST'
	           }).success(getCallback);
	        }
	    }
	});
	