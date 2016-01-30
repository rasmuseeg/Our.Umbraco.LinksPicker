angular.module("umbraco")
  .controller("Our.LinksPickerController",
    function ($scope, dialogService, mediaHelper) {
        // make sure it's an array, else make one
        if (Object.prototype.toString.call($scope.model.value) !== '[object Array]') {
            $scope.model.value = [];
        }

        // add new link
        $scope.add = function () {
            dialogService.linkPicker({
                callback: function (e) {
                    console.log(e);
                    // set model
                    $scope.model.value.push({
                        id: e.id || 0,
                        name: e.name || '',
                        url: e.url,
                        target: e.target || '_self',
                        isMedia: e.isMedia
                    });
                }
            });
        };

        $scope.showAdd = function () {
            var limit = parseInt($scope.model.config.max);
            if (limit > 0 && $scope.model.value.length >= limit) {
                return false;
            }
            return true;
        };

        // choose link
        $scope.edit = function ($index) {
            $scope.target = $scope.model.value[$index] || null;
            // There is a error when trying to request path using linkPicker
            // https://github.com/Umbraco/Umbraco-CMS/commit/57118b04641151a02fc963e0bc17cb58b1c96adc
            console.log('Editing:', $scope.target);
            dialogService.linkPicker({
                currentTarget: $scope.target,
                callback: function (content) {
                    // set model
                    $scope.target = {
                        id: content.id || 0,
                        name: content.name || '',
                        url: content.url,
                        target: content.target || '_self',
                        isMedia: content.isMedia
                    };
                }
            });
        };

        // remove link
        $scope.remove = function ($index) {
            $scope.model.value.splice($index, 1);
        };
    });