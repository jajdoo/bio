
(function(){

    var app = angular.module('localLcsFactory',[]);

    function getMaxOfArray(numArray) {
        return Math.max.apply(null, numArray);
    }

    app.factory('LocalLCS',function(){

        function LocalLCS(leftSeq, rightSeq, matchCost, mismatchCost, gapCost){
            this.leftSeq = leftSeq;
            this.rightSeq = rightSeq;
            this.matchCost = matchCost;
            this.mismatchCost = mismatchCost;
            this.gapCost = gapCost;
            this.lcsTable = [];
        }

        LocalLCS.prototype = {
            costFunction:function (c1,c2){
                if (c1 === c2)
                    return this.matchCost;
                else if (c1 === '-' || c2 === '-')
                    return this.gapCost;
                else
                    return this.mismatchCost;
            },
            lcsInit: function () {
                this.lcsTable = [];
                for (var i = 0; i < this.leftSeq.length + 1; i++) {
                    this.lcsTable[i] = [];
                    this.lcsTable[i][0] = {value: 0};
                }
                for (var i = 0; i < this.rightSeq.length + 1; i++) {
                    this.lcsTable[0][i] = {value: 0};
                }
            },
            calculateMatrix: function(){
                for (var i = 1; i < this.leftSeq.length + 1; i++) {
                    for (var j = 1; j < this.rightSeq.length + 1; j++) {
                        var diag = this.lcsTable[i-1][j-1].value + this.costFunction(this.leftSeq.charAt(i-1), this.rightSeq.charAt(j-1));
                        var left = this.lcsTable[i-1][j].value + this.costFunction(this.leftSeq.charAt(i-1), '-');
                        var top = this.lcsTable[i][j-1].value + this.costFunction('-', this.rightSeq.charAt(j-1));
                        var best = getMaxOfArray([0, diag, left, top]);

                        this.lcsTable[i][j] = {
                            value: best
                        };
                    }
                }
            },
            getMatch: function(){

                var max_i= 0;
                var max_j=  0;
                var max = Number.NEGATIVE_INFINITY;

                for (var i = 0; i < this.leftSeq.length + 1; i++) {
                    for (var j = 0; j < this.rightSeq.length + 1; j++) {
                        if(max < this.lcsTable[i][j].value){
                            max_i = i;
                            max_j = j;
                            max = this.lcsTable[i][j].value;
                        }
                    }
                }

                var retLeftSeq = '';
                var retRightSeq = '';

                i = max_i;
                j = max_j;

                while( (i>0 || j>0) && this.lcsTable[i][j].value>0 ) {
                    this.lcsTable[i][j].styles = 'lcs-selected';
                    var diag = i===0 || j===0 ? Number.NEGATIVE_INFINITY : this.lcsTable[i-1][j-1].value;
                    var top = i===0 ? Number.NEGATIVE_INFINITY : this.lcsTable[i-1][j].value;
                    var left = j===0 ? Number.NEGATIVE_INFINITY : this.lcsTable[i][j-1].value;
                    var best = getMaxOfArray([diag, left, top]);

                    if(diag===best){
                        retLeftSeq = this.leftSeq[i-1] + retLeftSeq;
                        retRightSeq = this.rightSeq[j-1] + retRightSeq;
                        i--; j--;
                    }
                    else if(top===best){
                        retLeftSeq = this.leftSeq[i-1] + retLeftSeq;
                        retRightSeq = '-' + retRightSeq;
                        i--;
                    }
                    else{
                        retLeftSeq = '-' + retLeftSeq ;
                        retRightSeq = this.rightSeq[j-1] + retRightSeq;
                        j--;
                    }
                }

                this.match = {
                    left: retLeftSeq,
                    right: retRightSeq
                }
            },
            run: function(){
                this.lcsInit();
                this.calculateMatrix();
                this.getMatch();
            }
        };

        return LocalLCS;
    });

})();