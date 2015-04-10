

(function(){

    var app = angular.module('CombinedLcsFactory',[]);

    function getMaxOfArray(numArray) {
        return Math.max.apply(null, numArray);
    }

    traceDirs = Object.freeze({
        STOP: 'STOP',
        UP: 'UP',
        LEFT: 'LEFT',
        DIAG: 'DIAG'
    });

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
                // initialise the matrix left column and top row
                // if local - all 0
                // if global - using (gap cost * cell index)

                this.lcsTable = [];
                for (var i = 0; i < this.leftSeq.length + 1; i++) {
                    this.lcsTable[i] = [];
                    this.lcsTable[i][0] = {
                        value: global ? this.gapCost * i : 0,
                        dir: global ? traceDirs.UP : traceDirs.STOP
                    };
                }
                for (var i = 0; i < this.rightSeq.length + 1; i++) {
                    this.lcsTable[0][i] = {
                        value: global ? this.gapCost * i : 0,
                        dir: global ? traceDirs.LEFT : traceDirs.STOP
                    }
                }
                this.lcsTable[0][0].dir = traceDirs.STOP;
            },
            calculateMatrix: function (global) {
                for (var i = 1; i < this.leftSeq.length + 1; i++) {
                    for (var j = 1; j < this.rightSeq.length + 1; j++) {
                        var diag = this.lcsTable[i-1][j-1].value + this.costFunction(this.leftSeq.charAt(i-1), this.rightSeq.charAt(j-1));
                        var top = this.lcsTable[i-1][j].value + this.costFunction(this.leftSeq.charAt(i-1), '-');
                        var left = this.lcsTable[i][j-1].value + this.costFunction('-', this.rightSeq.charAt(j-1));
                        var best = global ? getMaxOfArray([diag, left, top]) : getMaxOfArray([0, diag, left, top]);

                        var dir = undefined;
                        if(diag===best)
                            dir = traceDirs.DIAG;
                        else if(top===best)
                            dir = traceDirs.UP;
                        else if(left===best)
                            dir = traceDirs.LEFT;
                        else
                            dir = traceDirs.STOP;

                        this.lcsTable[i][j] = {
                            value: best,
                            dir: dir
                        };
                    }
                }
            },
            findMatch: function (start_i, start_j) {
                // generate match
                // start_i/start_j - where the algorithm will start on the matrix
                // stopAt - if the cell value is below this, the algorithm will stop.

                var retLeftSeq = '';
                var retRightSeq = '';

                var i = start_i;
                var j = start_j;

                while (this.lcsTable[i][j].dir!==traceDirs.STOP) {
                    this.lcsTable[i][j].styles = 'lcs-selected';

                    switch(this.lcsTable[i][j].dir) {
                        case traceDirs.DIAG:
                            retLeftSeq = this.leftSeq[i-1] + retLeftSeq;
                            retRightSeq = this.rightSeq[j-1] + retRightSeq;
                            i--;
                            j--;
                            break;
                        case traceDirs.UP:
                            retLeftSeq = this.leftSeq[i-1] + retLeftSeq;
                            retRightSeq = '-' + retRightSeq;
                            i--;
                            break;
                        case traceDirs.LEFT:
                            retLeftSeq = '-' + retLeftSeq;
                            retRightSeq = this.rightSeq[j-1] + retRightSeq;
                            j--;
                            break;
                        case traceDirs.STOP:
                            break;
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

                // find match:
                // if global - start at bottom right and run back to top left
                // if local - find max match and work back up until the first cell with value 0
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
                this.findMatch(max_i, max_j);
            }
        };

        return CombinedLCS;
    });

})();