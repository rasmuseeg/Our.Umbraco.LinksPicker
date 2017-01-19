namespace Our.LinksPicker {
    class LinksPickerDialog {
        static $inject: string[] = ["$scope"];

        constructor(private $scope) {

        }
    }

    angular.module("umbraco").controller("Our.LinksPickerDialog", LinksPickerDialog);
}