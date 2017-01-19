var Our;
(function (Our) {
    var LinksPicker;
    (function (LinksPicker) {
        var LinksPickerDialog = (function () {
            function LinksPickerDialog($scope) {
                this.$scope = $scope;
            }
            return LinksPickerDialog;
        }());
        LinksPickerDialog.$inject = ["$scope"];
        angular.module("umbraco").controller("Our.LinksPickerDialog", LinksPickerDialog);
    })(LinksPicker = Our.LinksPicker || (Our.LinksPicker = {}));
})(Our || (Our = {}));
//# sourceMappingURL=linkpickeroverlay.js.map