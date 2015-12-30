angular.module('SQLQueryGenerator', ['ngMaterial'])
    .controller("queryGenerator", ['$scope', function ($scope) {
        $scope.mainOptions = [
            {id: 'add_column', value: 'add a column', code: 'ALTER TABLE'},
            {id: 'add_comment', value: 'add a comment', code: 'COMMENT ON COLUMN'},
            {id: 'create_foreign_key', value: 'create a foreign key', code: 'ALTER TABLE'},
            {id: 'create_table', value: 'create a table', code: 'CREATE TABLE'},
            {id: 'update_row', value: 'update a row', code: 'UPDATE'}
        ];

        $scope.reset = function () {
            $scope.mainChoice = undefined;
            $scope.tableName = undefined;
            $scope.inputColumnValue = undefined;
            $scope.inputValueValue = undefined;
            $scope.inputWhereValue = undefined;
        };

        $scope.inputTableNeeded = function (option) {
            return (option !== undefined);
        };

        $scope.inputColumnNeeded = function (option) {
            if ($scope.inputTableNeeded(option)) {
                switch (option.id) {
                    default:
                        $scope.inputColumnOption = 'Column name';
                        return true;
                }
            }
        };

        $scope.inputValueNeeded = function(option) {
            if ($scope.inputColumnNeeded(option)) {
                switch (option.id) {
                    case 'add_comment':
                        $scope.inputValueOption = 'Comment';
                        return true;
                    case 'create_table':
                        return false;
                    default:
                        $scope.inputValueOption = 'Value';
                        return true;
                }
            }
        };

        $scope.inputWhereNeeded = function (option) {
            if ($scope.inputValueNeeded(option)) {
                switch (option.id) {
                    case 'update_row':
                        return true;
                    default:
                        return false;
                }
            }
        };

        $scope.generateCode = function (option, tableName, inputColumnValue, inputValueValue, inputWhereValue) {
            if (tableName !== undefined && tableName !== '') {
                var ret = '';
                if ($scope.inputColumnNeeded(option)) {
                    switch (option.id) {
                        case 'add_comment':
                            ret = option.code + " " + tableName;
                            ret += (inputColumnValue !== undefined && inputColumnValue !== '') ? "." + inputColumnValue : '';
                            ret += (inputValueValue !== undefined && inputValueValue !== '') ? " IS '" + inputValueValue + "'" : '';
                            ret += ';';
                            break;
                        case 'update_row':
                            var iv = '';
                            if (inputValueValue !== undefined && inputValueValue !== ''){
                                if (!isNan(parseInt(inputValueValue))) {
                                    iv = inputValueValue;
                                }
                                else {
                                    iv = "'" + inputValueValue + "'";
                                }
                            }
                            ret = option.code + " " + (tableName || '');
                            ret += (inputColumnValue !== undefined && inputColumnValue !== '') ? " SET " + inputColumnValue : '';
                            ret += (inputValueValue !== undefined && inputValueValue !== '') ? " = " + iv : '';
                            ret += (inputWhereValue !== undefined && inputWhereValue !== '') ? " WHERE " + inputWhereValue : '';
                            ret += ';';
                            break;
                        default:
                            ret = option.code + " " + tableName;
                            break;
                    }
                }
                return ret;
            }
            return '';
        }
    }]);

function isNan(value) {
    return typeof value === "number" && isNaN(value);
}