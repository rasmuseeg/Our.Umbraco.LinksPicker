/// <reference types="umbraco" />

namespace Our.LinksPicker {
    "strict"

    export interface IUmbOverlay<TType> {
        view: string;
        show?: boolean;
        currentTarget?: TType;
        submit?: (model) => void;
        close?: (model) => void;
    }

    export interface ILinkPickerItem{
        id: number;
        name: string;
        isMedia: boolean;
        url: string;
    }

    export interface ILinksPickerScope extends ng.IScope {
        model: {
            value: ILinkPickerItem[];
            config: {
                max: string;
                min: string;
            }
        }

        edit($index): void;
        add(): void;
        remove($index): void;
        showAdd(): void;

        // Converters
        isUrlPickerItem(obj: any): boolean;
        convertUrlPickerItem(obj: any) : ILinkPickerItem;
    }

    class LinksPickerEditor {
        static $inject: string[] = ["$scope", "mediaResource", "contentResource"];

         /**
         * Defaults for umb-overlay directive
         */
        public overlay: IUmbOverlay<ILinkPickerItem> = {
            view: "linkpicker",
            show: false
        }
        constructor(
            private $scope: ILinksPickerScope,
            private mediaResource: umb.resources.IMediaResource,
            private contentResource: umb.resources.IContentResource) {

            /**
             * Converts multiple uComponent UrlPicker item. URL, Content, Media
             */
            if (angular.isArray($scope.model.value)
                && this.isUrlPickerItem($scope.model.value[0])) {
                var items = [];
                angular.forEach($scope.model.value, (value, index) => {
                    items.push(this.convertUrlPickerItem(value));
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
            $scope.add = () => {
                this.overlay = {
                    view: 'linkpicker',
                    show: true,
                    submit: (model) => {
                        var target = model.target;
                        this.findContent(target);
                        $scope.model.value.push(target);
                        this.overlay.show = false;
                        this.overlay = null;
                    },
                    close: (model) => {
                        this.overlay.show = false;
                        this.overlay = null;
                    }
                };
            };

            /**
             * Returns false if limit reached
             */
            $scope.showAdd = () => {
                var limit = parseInt(this.$scope.model.config.max);
                if (limit > 0 && this.$scope.model.value.length >= limit) {
                    return false;
                }
                return true;
            };

            /**
             * Open edit dialog for item at $index
             */
            $scope.edit = ($index) => {
                var currentTarget = angular.copy($scope.model.value[$index]);
                this.overlay = {
                    view: 'linkpicker',
                    currentTarget: currentTarget,
                    show: true,
                    submit: (model) => {
                        $scope.model.value[$index] = model.currentTarget;
                        this.findContent($scope.model.value[$index]);

                        this.overlay.show = false;
                        this.overlay = null;
                    },
                    close: (model) => {
                        debugger;
                        this.overlay.show = false;
                        this.overlay = null;
                    }
                }
            };

            /**
             * Removes item at $index
             */
            $scope.remove = ($index) => {
                $scope.model.value.splice($index, 1);
            };

            this.loadContent();
        }

        /** 
         * Load content status for each item
         */
        loadContent() {
            var items = this.$scope.model.value;
            angular.forEach(items, (item, index) => {
                this.findContent(item);
            });
        }

        /**
         * Find content for LinkPickerItem
         */
        findContent(item) {
            if (item.id <= 0)
                return;

            if (item.isMedia) {
                this.mediaResource.getById(item.id)
                    .then((data) => {
                        this.mapContent(item, data);
                    });
            }
            else {
                this.contentResource.getById(item.id)
                    .then((data) => {
                        this.mapContent(item, data);
                    });
            }
        }
        

        /**
         * Save content on item
         */
        mapContent(item, content) {
            item.published = content.published;
            item.hasPublishedVersion = content.hasPublishedVersion;
            item.url = content.urls[0];
            item.icon = content.icon;
        }

        /**
         * Validates if current object is of type UrlPickerItem
         */
        isUrlPickerItem(obj) {
            return "Mode" in obj
                && "Title" in obj
                && "NodeId" in obj
                && "NewWindow" in obj;
        }

        /***
         * Converts UrlPickerItem to LinkPickerModelItem
         */
        convertUrlPickerItem(temp) {
            return {
                id: temp.NodeId || 0,
                name: temp.Title,
                url: temp.Url,
                isMedia: temp.Mode == 3,
                target: temp.NewWindow ? '_blank' : '_self',
            };
        }
    }

    angular.module("umbraco").controller("Our.LinksPickerEditor", LinksPickerEditor);
}
