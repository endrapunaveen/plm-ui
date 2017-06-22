'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
.controller('manageProductCtrl', function($scope, $rootScope, $window, $timeout, plmMetadata) {
  
  function findIndexByKeyValue(arraytosearch, key, valuetosearch) {
      for (var i = 0; i < arraytosearch.length; i++) {
          if (arraytosearch[i][key] == valuetosearch) {
              return i;
          }
      }
      return -1;
  };
 
  console.log('manageProductCtrl +++++++');

  $scope.catalogue = '';
  $scope.inputProductJson = {
    "brand" : "",
    "status" : "",
    "commercialHierarchyCode" : "",
    "catalogue": "",
    "sellByType": "",
    "promotionType": "",
    "country": "GB",
    "productAttributes": [

    ]
  };

  $scope.getCatalogues = function(){
      console.log('getCatalogues......');

      $scope.loading = true;
      
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

  $scope.productLevelAttrs = [
    { name: "brand", dataType: "String", 
      displayNames: [{displayName: "Brand", lang: "en"}], 
      valueSets : {name: "brand_flex_values", values : [{ value: "Tesco" }, {value: "Apple"} ]} },
    {name: "status", dataType: "String", displayNames: [{displayName: "Status", lang: "en"}], 
    valueSets : {name: "status", values : [{ value: "Draft" }, {value: "Active"} ]} },
    {name: "sellByType", dataType: "String", displayNames: [{displayName: "Sell By Type", lang: "en"}], valueSets : {name: "sellByType", values : [{ value: "Item" }, {value: "Single"} ]} },
    {name: "promotionType", dataType: "String", displayNames: [{displayName: "Promotion Type", lang: "en"}], valueSets : {name: "promotionType", values : [{ value: "Standard" }, {value: "Size"} ]} },
  ]

  $scope.getMetadata = function(catalogue) {
    $scope.successAlertMsg = [];
    $scope.failureAlertMsg = [];
  
    console.log('getMetadata....');
    $scope.metadata = '';
    
    $scope.inputProductJson = {
        "brand" : "",
        "status" : "",
        "commercialHierarchyCode" : "",
        "catalogue": catalogue.name,
        "sellByType": "",
        "promotionType": "",
        "country": "GB",
        "productAttributes": [

        ]
      };

    $scope.loadingMetadata = true;

    console.log(catalogue);

    plmMetadata.getMetadata(catalogue.name)
      .success(function(_data) {
          $scope.loadingMetadata = false;
          $scope.metadata = _data;
          
          console.log($scope.metadata)
                   
      });  
  }

  $scope.agDetailsToInsert = '';
  
  $scope.getAttributes = function(attributeGroup, forceUpdate){

    if (forceUpdate || $scope.attributeGroup == undefined || attributeGroup.name != $scope.attributeGroup.name) {
      console.log(attributeGroup);
      $scope.parentDataLoading = true;

      console.log('1111 : ',$scope.agDetailsToInsert);
      

      if ($scope.attributeGroup !== undefined)
      {
        $scope.agDetailsToInsert = {
          "attrGroup": $scope.attributeGroup.name,
          "attributes" : []
        };

        var blankAg = false;
        for (var attr = 0; attr < $scope.attributeGroup.attributes.length; attr++) {
          if ($scope.attributeGroup.attributes[attr].value !== undefined && $scope.attributeGroup.attributes[attr].value !== '' && $scope.attributeGroup.attributes[attr].value !== null) {
            blankAg = true;
            break;
          }
        }
        if (blankAg) {
          for (var attr = 0; attr < $scope.attributeGroup.attributes.length; attr++) {
            $scope.agDetailsToInsert.attributes.push(
              {name: $scope.attributeGroup.attributes[attr].name, value : $scope.attributeGroup.attributes[attr].value});
          }
        }

        var index = findIndexByKeyValue($scope.inputProductJson.productAttributes, "attrGroup", $scope.agDetailsToInsert.attrGroup);
        
        console.log(index);

        if (index == -1) {
          if (blankAg) 
            $scope.inputProductJson.productAttributes.push($scope.agDetailsToInsert);
        } else {
          if (blankAg) {
            $scope.inputProductJson.productAttributes[index] = $scope.agDetailsToInsert;
          } else {
            $scope.inputProductJson.productAttributes.splice(index, 1)
          }
        }
        
      }

      $scope.attributeGroup = attributeGroup;
      
      //console.log($scope.agDetailsToInsert);
      $scope.parentDataLoading = false;  
    }  else {

    }
  }

  $scope.successAlertMsg = [];
    $scope.failureAlertMsg = [];

  $scope.createProduct = function() {
    $scope.getAttributes($scope.attributeGroup, true);
    console.log($scope.inputProductJson);

    $scope.successAlertMsg = [];
    $scope.failureAlertMsg = [];
  

    plmMetadata.createProduct($scope.inputProductJson)
    .success(function(_data) {
        console.log('Create Product Done...');
        console.log(_data);
        $scope.successAlertMsg.push('Product Created - GTIN : '+_data.gtin+ ',  productId : ' + _data.productId);
    }).error(function(err){
        $scope.failureAlertMsg.push('Product Creation Failed : '+ JSON.stringify(err));
    });
  }

    

  $scope.getCatalogues();

});


