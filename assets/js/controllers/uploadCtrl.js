'use strict';
/** 
  * controllers for Angular File Upload
*/
app.controller('UploadCtrl', ['$scope', '$rootScope', 'FileUploader', 'RestService',
function ($scope, $rootScope, FileUploader, RestService) {
    var uploaderImages = $scope.uploaderImages = new FileUploader({
        url: RestService.url + 'upload/',
        queueLimit: 1
    });

    // FILTERS
    uploaderImages.filters.push({
        name: 'imageFilter',
        fn: function (item/*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    $rootScope.$on('imageRemoved', function(event, opt) {
        uploaderImages.clearQueue();
        console.log('imageRemoved');
    }); 
    
    // CALLBACKS

    uploaderImages.onWhenAddingFileFailed = function (item/*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploaderImages.onAfterAddingFile = function (fileItem) {
        fileItem.upload();
        console.info('onAfterAddingFile', fileItem);
    };
    uploaderImages.onAfterAddingAll = function (addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploaderImages.onBeforeUploadItem = function (item) {
        console.info('onBeforeUploadItem', item);
    };
    uploaderImages.onProgressItem = function (fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploaderImages.onProgressAll = function (progress) {
        console.info('onProgressAll', progress);
    };
    uploaderImages.onSuccessItem = function (fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploaderImages.onErrorItem = function (fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploaderImages.onCancelItem = function (fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploaderImages.onCompleteItem = function (fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
        $rootScope.$broadcast('mainLayoutChanged', { layout: response });
    };
    uploaderImages.onCompleteAll = function () {
        console.info('onCompleteAll');
    };

    console.info('uploader', uploaderImages);
}]);

app.controller('UploadCtrl2', ['$scope', '$rootScope', 'FileUploader', 'RestService',
function ($scope, $rootScope, FileUploader, RestService) {
    var uploader = $scope.uploader = new FileUploader({
        url: RestService.url + 'upload/',
        queueLimit: 1
    });

    // FILTERS
    uploader.filters.push({
        name: 'customFilter',
        fn: function (item/*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });

    $rootScope.$on('referenceAdded', function(event, opt) {
        uploader.clearQueue();
        console.log('referenceAdded');
    }); 

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function (item/*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function (fileItem) {
        fileItem.upload();
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function (addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function (item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function (fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function (progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function (fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function (fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
        $rootScope.$broadcast('referenceFileLoaded', { reference: response });
    };
    uploader.onCompleteAll = function () {
        console.info('onCompleteAll');
    };

    console.info('uploader', uploader);
}]);

app.controller('UploadCtrl3', ['$scope', '$rootScope', 'FileUploader', 'RestService',
function ($scope, $rootScope, FileUploader, RestService) {
    var uploaderImages = $scope.uploaderImages = new FileUploader({
        url: RestService.url + 'upload/',
        queueLimit: 1
    });

    // FILTERS
    uploaderImages.filters.push({
        name: 'imageFilter',
        fn: function (item/*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    $rootScope.$on('imageRemoved', function(event, opt) {
        uploaderImages.clearQueue();
        console.log('imageRemoved');
    }); 

    // CALLBACKS
    uploaderImages.onWhenAddingFileFailed = function (item/*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploaderImages.onAfterAddingFile = function (fileItem) {
        fileItem.upload();
        console.info('onAfterAddingFile', fileItem);
    };
    uploaderImages.onAfterAddingAll = function (addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploaderImages.onBeforeUploadItem = function (item) {
        console.info('onBeforeUploadItem', item);
    };
    uploaderImages.onProgressItem = function (fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploaderImages.onProgressAll = function (progress) {
        console.info('onProgressAll', progress);
    };
    uploaderImages.onSuccessItem = function (fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploaderImages.onErrorItem = function (fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploaderImages.onCancelItem = function (fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploaderImages.onCompleteItem = function (fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
        $rootScope.$broadcast('profilePictureChanged', { layout: response });
    };
    uploaderImages.onCompleteAll = function () {
        console.info('onCompleteAll');
    };

    console.info('uploader', uploaderImages);
}]);