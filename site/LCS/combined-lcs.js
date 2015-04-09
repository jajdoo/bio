

(function(){

    var app = angular.module('CombinedLcsFactory',[]);

    function getMaxOfArray(numArray) {
        return Math.max.apply(null, numArray);
    }

    app.factory('CombinedLCS',function(){

        function CombinedLCS(leftSeq, rightSeq, matchCost, mismatchCost, gapCost){
            this.leftSeq = leftSeq;
            this.rightSeq = rightSeq;
            this.matchCost = matchCost;
            this.mismatchCost = mismatchCost;
            this.gapCost = gapCost;
            this.lcsTable = [];
        }

        CombinedLCS.prototype = {
            costFunction: function (c1, c2) {
                if (c1 === c2)
                    return this.matchCost;
                else if (c1 === '-' || c2 === '-')
                    return this.gapCost;
                else
                    return this.mismatchCost;
            },
            lcsInit: function (global) {
                this.lcsTable = [];
                for (var i = 0; i < this.leftSeq.length + 1; i++) {
                    this.lcsTable[i] = [];
                    this.lcsTable[i][0] = {value: global ? this.gapCost * i : 0};
                }
                for (var i = 0; i < this.rightSeq.length + 1; i++) {
                    this.lcsTable[0][i] = {value: global ? this.gapCost * i : 0}
                }
            },
            calculateMatrix: function (global) {
                for (var i = 1; i < this.leftSeq.length + 1; i++) {
                    for (var j = 1; j < this.rightSeq.length + 1; j++) {
                        var diag = this.lcsTable[i - 1][j - 1].value + this.costFunction(this.leftSeq.charAt(i - 1), this.rightSeq.charAt(j - 1));
                        var left = this.lcsTable[i - 1][j].value + this.costFunction(this.leftSeq.charAt(i - 1), '-');
                        var top = this.lcsTable[i][j - 1].value + this.costFunction('-', this.rightSeq.charAt(j - 1));
                        var best = global ? getMaxOfArray([diag, left, top]) : getMaxOfArray([0, diag, left, top]);

                        this.lcsTable[i][j] = {
                            value: best
                        };
                    }
                }
            },
            findMatch: function (start_i, start_j, stopAt) {

                var retLeftSeq = '';
                var retRightSeq = '';

                i = start_i;
                j = start_j;

                while ((i > 0 || j > 0) && this.lcsTable[i][j].value > stopAt) {
                    this.lcsTable[i][j].styles = 'lcs-selected';
                    var diag = i === 0 || j === 0 ? Number.NEGATIVE_INFINITY : this.lcsTable[i - 1][j - 1].value;
                    var top = i === 0 ? Number.NEGATIVE_INFINITY : this.lcsTable[i - 1][j].value;
                    var left = j === 0 ? Number.NEGATIVE_INFINITY : this.lcsTable[i][j - 1].value;
                    var best = getMaxOfArray([diag, left, top]);

                    if (diag === best) {
                        retLeftSeq = this.leftSeq[i - 1] + retLeftSeq;
                        retRightSeq = this.rightSeq[j - 1] + retRightSeq;
                        i--;
                        j--;
                    }
                    else if (top === best) {
                        retLeftSeq = this.leftSeq[i - 1] + retLeftSeq;
                        retRightSeq = '-' + retRightSeq;
                        i--;
                    }
                    else {
                        retLeftSeq = '-' + retLeftSeq;
                        retRightSeq = this.rightSeq[j - 1] + retRightSeq;
                        j--;
                    }
                }

                this.match = {
                    left: retLeftSeq,
                    right: retRightSeq
                }
            },

            run: function (global) {
                this.lcsInit(global);
                this.calculateMatrix(global);


                var max_i = this.leftSeq.length;
                var max_j = this.rightSeq.length;
                var max = Number.NEGATIVE_INFINITY;

                if (!global) {
                    for (var i = 0; i < this.leftSeq.length + 1; i++) {
                        for (var j = 0; j < this.rightSeq.length + 1; j++) {
                            if (max < this.lcsTable[i][j].value) {
                                max_i = i;
                                max_j = j;
                                max = this.lcsTable[i][j].value;
                            }
                        }
                    }
                }

                this.findMatch(max_i, max_j, global ? Number.NEGATIVE_INFINITY : 0);
            }
        };

        return CombinedLCS;
    });

})();