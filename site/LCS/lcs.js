
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
            templateUrl: 'LCS/lcs.html'
        }
    });
})();