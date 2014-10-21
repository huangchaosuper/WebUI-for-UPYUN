'use strict';
/*
 * Controllers 
 * author:huangchaosuper@gmail.com
 * date:May 17, 2014
 * update:June 1, 2014
 */
 var appControllers = angular.module('appControllers', []);
 appControllers.controller('MainCtrl', ['$scope','$cookies','$log','$modal',
 	function($scope,$cookies,$log,$modal) {
		if(!$cookies['UPYUN-User']){
			window.location = '#/login';
		}else{
	 		$scope.action = $cookies['UPYUN-Server'] + '/' + $cookies['UPYUN-Bucket'];
	 		$scope.cloudPath = $cookies['UPYUN-CloudPath'];
	 		$scope.usage = usage($cookies['UPYUN-User'],$cookies['UPYUN-Password'],$cookies['UPYUN-Server'] + $cookies['UPYUN-Bucket'] + '/?usage');
	 		$scope.directorys = structure($cookies['UPYUN-User'],$cookies['UPYUN-Password'],($cookies['UPYUN-Server'] + $cookies['UPYUN-Bucket'] + $cookies['UPYUN-CloudPath'])||'/');
	 		$(':file').change(function(){
	 			var file = this.files[0];
	 			var reader = new FileReader();
	 			reader.onload = function(e) {
	 				var rawData = reader.result;
	 				upload($cookies['UPYUN-User'],$cookies['UPYUN-Password'],$cookies['UPYUN-Server'] + $cookies['UPYUN-Bucket'] + $cookies['UPYUN-CloudPath'] + file.name,rawData);
	 			}
	 			reader.readAsBinaryString(file);
			});
	 	}
 		$scope.refresh = function(){
 			$scope.directorys = structure($cookies['UPYUN-User'],$cookies['UPYUN-Password'],($cookies['UPYUN-Server'] + $cookies['UPYUN-Bucket'] + $cookies['UPYUN-CloudPath'])||'/');
 		};
 		$scope.search = function(cloudPath){
 			$cookies['UPYUN-CloudPath'] = cloudPath;
 			$scope.cloudPath = cloudPath;
 			$scope.refresh();
 		};
 		$scope.select = function(element){
 			if(element.type=='F'){
 				$scope.search($cookies['UPYUN-CloudPath']+element.name+'/');
 			}else if(element.type == 'N'){
 				window.location = 'http://'+$cookies['UPYUN-Bucket'] + '.b0.upaiyun.com/'+ $scope.cloudPath+element.name;
 			}
 		}
 		$scope.createFolder = function(){
 			var createFolderDialog = ""
 			+"<div class='modal-header alert'>"
 				+"<button type='button' class='close' data-dismiss='alert' aria-hidden='true' ng-click='cancel()'>&times;</button>"
 				+"<strong>Create Folder</strong>"
 			+"</div>"
 			+"<div class='modal-body'>"
 				+"<form class='form-horizontal' role='form'>"
 					+"<div class='form-group'>"
 						+"<label for='inputName' class='col-sm-2 control-label'>Name:</label>"
 						+"<div class='col-sm-10'>"
 							+"<input type='text' class='form-control' id='name' ng-model='input.folderName' />"
 						+"</div>"
 					+"</div>"
 				+"</form>"
 			+"</div>"
 			+"<div class='modal-footer'>"
 				+"<button class='btn btn-primary' ng-click='ok()'>Create</button>"
 				+"<button class='btn btn-default' ng-click='cancel()'>Cancel</button>"
 			+"</div>";
 			var modalInstance = $modal.open({
 				template: createFolderDialog,
 				controller: 'CreateFolderDialogCtrl',
 				size: "sm"
 			});
 			modalInstance.result.then(function (folderName) {
 				if(!folderName){}else{
 					var obj = new Object();
 					obj.name = folderName;
 					obj.size = 0;
 					obj.type = 'F';
 					obj.date = (new Date()).getTime()/1000;
 					$scope.directorys.push(obj);
 					createFolder($cookies['UPYUN-User'],$cookies['UPYUN-Password'],$cookies['UPYUN-Server'] + $cookies['UPYUN-Bucket'] + $cookies['UPYUN-CloudPath'] + '/' + folderName);
 				}
 			}, function () {
 				$log.info('Modal dismissed at: ' + new Date());
 			});
 		}
 		$scope.delete = function(index,name,type){
 			var deleteDialog = ""
 			+"<div class='modal-header alert'>"
 				+"<button type='button' class='close' data-dismiss='alert' aria-hidden='true' ng-click='cancel()'>&times;</button>"
 				+"<strong>Delete Confirm</strong>"
 			+"</div>"
 			+"<div class='modal-body'>"
 				+"Are you sure you want to delete this Row?"
 			+"</div>"
 			+"<div class='modal-footer'>"
 				+"<button class='btn btn-primary' ng-click='ok()'>Delete</button>"
 				+"<button class='btn btn-default' ng-click='cancel()'>Cancel</button>"
 			+"</div>";
 			var modalInstance = $modal.open({
 				template: deleteDialog,
 				controller: 'deleteDialogCtrl',
 				size: "sm"
 			});
 			modalInstance.result.then(function () {
 				$scope.directorys.splice(index, 1);
 				remove($cookies['UPYUN-User'],$cookies['UPYUN-Password'],$cookies['UPYUN-Server'] + $cookies['UPYUN-Bucket'] + $cookies['UPYUN-CloudPath'] + '/' + name);
 			}, function () {
 				$log.info('Modal dismissed at: ' + new Date());
 			});
 		}
 	}]);

appControllers.controller('CreateFolderDialogCtrl', ['$scope', '$modalInstance',
 	function($scope, $modalInstance) {
 		$scope.input = {folderName:'_'};
 		$scope.ok = function () {
 			$modalInstance.close($scope.input.folderName);
 		};
 		$scope.cancel = function () {
 			$modalInstance.dismiss('cancel');
 		};
 	}
 	]);

appControllers.controller('deleteDialogCtrl', ['$scope', '$modalInstance',
 	function($scope, $modalInstance) {
 		$scope.ok = function () {
 			$modalInstance.close();
 		};
 		$scope.cancel = function () {
 			$modalInstance.dismiss('cancel');
 		};
 	}
 	]);

appControllers.controller('NavigationCtrl', ['$scope','$cookies','$log',
	function($scope, $cookies,$log) {
		$scope.userName = $cookies['UPYUN-User'] || 'Login';
	}
	]);

appControllers.controller('LoginCtrl', ['$scope','$cookies','$log','$window',
	function($scope, $cookies, $log,$window) {
		$scope.alertMessage = null;
		$scope.active = ($cookies['UPYUN-User']!=null);
		$scope.userName = $cookies['UPYUN-User'];

		$scope.login = function(){
			var message = usage($scope.userName,$scope.password,'http://v0.api.upyun.com/' + $scope.bucketName + '/?usage');
			if(!isNaN(message)){
				$cookies['UPYUN-Server'] = 'http://v0.api.upyun.com/';
				$cookies['UPYUN-Bucket'] = $scope.bucketName;
				$cookies['UPYUN-User'] = $scope.userName;
				$cookies['UPYUN-CloudPath'] = '/';
				//var auth = base64encode($scope.userName+':'+$scope.password)
				$cookies['UPYUN-Password'] = $scope.password;
				$scope.active = true;
				$window.location.href = "/";
			}else{
				$scope.alertMessage = message;
			}
		};

		$scope.logoff = function(){
			delete $cookies['UPYUN-Server'];
			delete $cookies['UPYUN-Bucket'];
			delete $cookies['UPYUN-User'];
			delete $cookies['UPYUN-Password'];
			delete $cookies['UPYUN-CloudPath'];
			$scope.active = false;
			$window.location.href = "/";
		};
	}
	]);

