angular.module("umbraco")
  .controller("Our.LinksPickerController",
    function ($scope, dialogService, mediaHelper) {
        /**
         * Converts multiple uComponent UrlPicker item. URL, Content, Media
         */
        if (angular.isArray($scope.model.value)
            && isUrlPickerItem($scope.model.value[0])) {
            var items = [];
            angular.forEach($scope.model.value, function (value, index) {
                items.push(convertUrlPickerItem(value));
            });
            $scope.model.value = items;
        }

        /**
         * Converts single uComponent UrlPicker item
         */
        if(angular.isObject($scope.model.value)
            && isUrlPickerItem($scope.model.value)) {
            $scope.model.value = [];
            var converted = convertUrlPickerItem($scope.model.value);
            $scope.model.value.push(converted);
        }
  
        // make sure it's an array, else make one
        if (!angular.isArray($scope.model.value)) {
            $scope.model.value = [];
        }

        // add new link
        $scope.add = function () {
            dialogService.linkPicker({
                callback: function (e) {
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

        /**
         * Validates if current object is of type UrlPickerItem
         */
        function isUrlPickerItem(obj) {
            return "Mode" in $scope.model.value
            && "Title" in $scope.model.value
            && "NodeId" in $scope.model.value
            && "NewWindow" in $scope.model.value;
        }

        /***
         * Converts UrlPickerItem to LinkPickerModelItem
         */
        function convertUrlPickerItem(temp) {
            return {
                id: temp.NodeId || 0,
                name: temp.Title,
                url: temp.Url,
                isMedia: temp.Mode == 3,
                target: temp.NewWindow ? '_blank' : '_self',
            };
        }
    });
