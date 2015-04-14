
(function() {
    'use strict';
    var app = angular.module('LCS',['CombinedLcsFactory']);

    app.controller('LcsController', function(CombinedLCS) {

        //----------------------------------
        //this.leftSeq = 'ATCTGAT';
        //this.leftSeq = 'CACTA';
        this.leftSeq = 'AGTCTGAGCTATGACTACG';

        //this.rightSeq = 'TGCATA';
        //this.rightSeq = 'CTACTC';
        this.rightSeq = 'CACTGCACTTATGCCTAGT';
        this.match = {};
        this.matchCost = 1;
        this.mismatchCost = -1;
        this.gapCost = -2;
        this.lcsTable = {};
        //----------------------------------

        //----------------------------------
        this.prepareTable = function(global){
            var lcs = new CombinedLCS(
                this.leftSeq,
                this.rightSeq,
                this.matchCost,
                this.mismatchCost,
                this.gapCost
            );
            lcs.run(global);
            this.match  = lcs.match;

            // clone the table
            var ret = Object.create(lcs.lcsTable);

            // add labels (top and left)
            ret[0].unshift({});
            for( var i=1 ; i<this.leftSeq.length+1 ; i++ ) {
                ret[i].unshift({value: this.leftSeq.charAt(i - 1)});
            }
            var topLine = [{},{}];
            for( var i=0 ; i<this.rightSeq.length ; i++ ){
                topLine.push( { value: this.rightSeq.charAt(i) });
            }
            ret.unshift(topLine);

            this.lcsTable = ret;
        };

        //----------------------------------
    });

    app.directive('lcsThing', function(){
        return {
            restrict: 'E',
            controller: 'LcsController',
            controllerAs: 'lcsCtrl',
            //templateUrl: 'LCS/lcs.html',
            template:
            '<div class="container-fluid">'+
            '    <div class="row">'+
            '        <div class="col-md-2">'+
            '            <form class="form-horizontal">'+
            '                <label> Match Cost:</label>'+
            '                <input type="number" class="form-control" ng-model="lcsCtrl.matchCost">'+
            ''+
            '                <label>Mismatch cost</label>'+
            '                <input type="number" class="form-control" ng-model="lcsCtrl.mismatchCost">'+
            ''+
            '                <label>Gap Cost</label>'+
            '                <input type="number" class="form-control" ng-model="lcsCtrl.gapCost">'+
            ''+
            '                <label>First Sequence</label>'+
            '                <input class="form-control" ng-model="lcsCtrl.leftSeq">'+
            ''+
            '                <label>Second Sequence</label>'+
            '                <input class="form-control" ng-model="lcsCtrl.rightSeq">'+
            ''+
            '                <button class="btn btn-primary" ng-click="lcsCtrl.prepareTable(true)">Find Global Match</button>'+
            '                <button class="btn btn-primary" ng-click="lcsCtrl.prepareTable(false)">Find Local Match</button>'+
            '            </form>'+
            '        </div>'+
            ''+
            '        <div class="col-md-10">'+
            '            <h3>Best Match</h3>'+
            '            <table>'+
            '                <tr>'+
            '                    <td ng-repeat="letter in lcsCtrl.match.left track by $index">'+
            '                        <div class="lcs-cell text-center">'+
            '                            {{letter}}'+
            '                        </div>'+
            '                    </td>'+
            '                </tr>'+
            '                <tr>'+
            '                    <td ng-repeat="letter in lcsCtrl.match.right track by $index">'+
            '                        <div class="lcs-cell text-center">'+
            '                            {{letter}}'+
            '                        </div>'+
            '                    </td>'+
            '                </tr>'+
            '            </table>'+
            ''+
            '            <br>'+
            ''+
            '            <h3>Trace Table</h3>'+
            '            <div class="">'+
            '                <table>'+
            '                    <tr ng-repeat="row in lcsCtrl.lcsTable">'+
            '                        <td ng-repeat="col in row">'+
            '                            <div class="lcs-cell text-center {{col.styles}}">{{col.value}}</div>'+
            '                        </td>'+
            '                    </tr>'+
            '                </table>'+
            '            </div>'+
            '        </div>'+
            ''+
            '    </div>'+
            '</div>'
        }
    });
})();