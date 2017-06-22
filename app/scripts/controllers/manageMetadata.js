'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
.controller('manageMetadataCtrl', function($scope, $rootScope, $window, $timeout, plmMetadata) {
  
  console.log('manageMetadataCtrl +++++++');

  $scope.catalogue = '';
  $scope.loadingMetadata = 'a';

  $scope.getCatalogues = function(){
      console.log('getCatalogues......');

      $scope.loading = true;
      $scope.catalogues = {};
      plmMetadata.getAllCatalogues()
      .success(function(_data) {
          
          /*
          $scope.catalogues = {
            catalogues: [
              {
                name: "Tesco Product Catalogue"
              },
              {
                name: "Automotive"
              }
            ]
          };
          */
          $scope.catalogues = _data;
          $scope.catalogue = $scope.catalogues.catalogues[0];
          $scope.getMetadata($scope.catalogue);
          
          //console.log($scope.catalogues)
                   
      });                   
  }

  $scope.getMetadata = function(catalogue) {
    console.log('getMetadata....');
    $scope.loadingMetadata = true;
    //console.log(catalogue);
    $scope.metadata = '';

    plmMetadata.getMetadata(catalogue.name)
      .success(function(_data) {
          $scope.loadingMetadata = false;
          $scope.metadata = _data;
          
          console.log($scope.metadata)
                   
      });  
  }

  
  $scope.getAttributes = function(attributeGroup){
    console.log(attributeGroup);
    $scope.parentDataLoading = true;

    $scope.attributeGroup = attributeGroup;

    $scope.parentDataLoading = false;    
  }

  $scope.getCatalogues();

});


