/// <reference types="umbraco" />
var Our;
(function (Our) {
    var LinksPicker;
    (function (LinksPicker) {
        "strict";
        var LinksPickerEditor = (function () {
            function LinksPickerEditor($scope, mediaResource, contentResource, localizationService, mediaHelper) {
                var _this = this;
                this.$scope = $scope;
                this.mediaResource = mediaResource;
                this.contentResource = contentResource;
                this.localizationService = localizationService;
                this.mediaHelper = mediaHelper;
                /**
                * Defaults for umb-overlay directive
                */
                this.overlay = {
                    view: "linkpicker",
                    show: false
                };
                /**
                 * Converts multiple uComponent UrlPicker item. URL, Content, Media
                 */
                if (angular.isArray($scope.model.value)
                    && this.isUrlPickerItem($scope.model.value[0])) {
                    var items = [];
                    angular.forEach($scope.model.value, function (value, index) {
                        items.push(_this.convertUrlPickerItem(value));
                    });
                    $scope.model.value = items;
                }
                /**
                 * Converts single uComponent UrlPicker item
                 */
                if (angular.isObject($scope.model.value)
                    && this.isUrlPickerItem($scope.model.value)) {
                    $scope.model.value = [];
                    var converted = this.convertUrlPickerItem($scope.model.value);
                    $scope.model.value.push(converted);
                }
                // make sure it's an array, if not make one
                if (!angular.isArray($scope.model.value)) {
                    $scope.model.value = [];
                }
                /**
                 * Adds a new link to collection
                 */
                $scope.add = function () {
                    _this.overlay = {
                        view: 'linkpicker',
                        show: true,
                        submit: function (model) {
                            var target = model.target;
                            _this.findContent(target);
                            $scope.model.value.push(target);
                            _this.overlay.show = false;
                            _this.overlay = null;
                        },
                        close: function (model) {
                            _this.overlay.show = false;
                            _this.overlay = null;
                        }
                    };
                };
                /**
                 * Returns false if limit reached
                 */
                $scope.showAdd = function () {
                    var limit = parseInt(_this.$scope.model.config.max);
                    if (limit > 0 && _this.$scope.model.value.length >= limit) {
                        return false;
                    }
                    return true;
                };
                /**
                 * Open edit dialog for item at $index
                 */
                $scope.edit = function ($index) {
                    var currentTarget = angular.copy($scope.model.value[$index]);
                    _this.overlay = {
                        view: 'linkpicker',
                        currentTarget: currentTarget,
                        show: true,
                        submit: function (model) {
                            $scope.model.value[$index] = model.currentTarget;
                            _this.findContent($scope.model.value[$index]);
                            _this.overlay.show = false;
                            _this.overlay = null;
                        },
                        close: function (model) {
                            debugger;
                            _this.overlay.show = false;
                            _this.overlay = null;
                        }
                    };
                };
                /**
                 * Removes item at $index
                 */
                $scope.remove = function ($index) {
                    $scope.model.value.splice($index, 1);
                };
                this.loadContent();
            }
            /**
             * Load content status for each item
             */
            LinksPickerEditor.prototype.loadContent = function () {
                var _this = this;
                var items = this.$scope.model.value;
                angular.forEach(items, function (item, index) {
                    _this.findContent(item);
                });
            };
            /**
             * Find content for LinkPickerItem
             */
            LinksPickerEditor.prototype.findContent = function (item) {
                var _this = this;
                if (item.id <= 0)
                    return;
                if (item.isMedia) {
                    this.mediaResource.getById(item.id)
                        .then(function (data) {
                        _this.mapContent(item, data);
                    });
                }
                else {
                    this.contentResource.getById(item.id)
                        .then(function (data) {
                        _this.mapContent(item, data);
                    });
                }
            };
            /**
             * Save content on item
             */
            LinksPickerEditor.prototype.mapContent = function (item, data) {
                item.published = data.published;
                item.hasPublishedVersion = data.hasPublishedVersion;
                item.trashed = data.trashed;
                item.icon = data.icon;
                if (item.isMedia) {
                    item.url = this.mediaHelper.resolveFile(data, false);
                }
                else {
                    item.url = data.urls[0] || "";
                }
                if (data.trashed) {
                    this.localizationService.localize("linkspicker_trashedMessage").then(function (s) {
                        item.url = s;
                    });
                }
            };
            /**
             * Validates if current object is of type UrlPickerItem
             */
            LinksPickerEditor.prototype.isUrlPickerItem = function (obj) {
                return "Mode" in obj
                    && "Title" in obj
                    && "NodeId" in obj
                    && "NewWindow" in obj;
            };
            /***
             * Converts UrlPickerItem to LinkPickerModelItem
             */
            LinksPickerEditor.prototype.convertUrlPickerItem = function (temp) {
                debugger;
                return {
                    id: temp.NodeId || 0,
                    name: temp.Title,
                    url: temp.Url,
                    isMedia: temp.Mode == 3,
                    target: temp.NewWindow ? '_blank' : '_self',
                };
            };
            return LinksPickerEditor;
        }());
        LinksPickerEditor.$inject = ["$scope", "mediaResource", "contentResource", "localizationService", "mediaHelper"];
        angular.module("umbraco").controller("Our.LinksPickerEditor", LinksPickerEditor);
    })(LinksPicker = Our.LinksPicker || (Our.LinksPicker = {}));
})(Our || (Our = {}));
