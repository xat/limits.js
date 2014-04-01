if (typeof module !== 'undefined' && module.exports) {
    expect = require('expect.js');
    limits = require('../limits');
}

describe('limits tests', function() {

    var fn = function() {};

    it('should exist', function() {
        expect(limits).to.be.an(Function);
        expect(limits.RuleChain).to.be.an(Function);
    });

    it('should throw an RulesError exception', function() {
        expect(function() {
            limits().push(fn);
        }).to.throwException(function (e) {
            expect(e.name).to.equal('RuleError');
        });
    });

    it('should register the rules', function() {
        var rules = limits({
            secondly: 5,
            minutely: 3,
            quarterly: 2
        });

        rules.daily(100).weekly(1000);
        expect(rules.rules).to.have.length(5);
    });

    it('should find the correct position', function() {
        var rules = limits({
            history: [1,2,3,5,5,10]
        });

        expect(rules._bsearch(0)).to.equal(0);
        expect(rules._bsearch(1)).to.equal(0);
        expect(rules._bsearch(5)).to.equal(3);
        expect(rules._bsearch(10)).to.equal(5);
        expect(rules._bsearch(20)).to.equal(6);
    });

    it('should determ the correct execution delay', function() {
        var rules = limits({
            secondly: 1,
            minutely: 1,
            hourly: 3
        });

        expect(rules.push(fn).delay).to.equal(0);
        expect(rules.push(fn).delay).to.be.within(59900, 60000);
        expect(rules.push(fn).delay).to.be.within(119900, 120000);
        expect(rules.push(fn).delay).to.be.within(3599900, 3600000);
        expect(rules.push(fn).delay).to.be.within(3659900, 3660000);
    });

    it('should throw an MaxcallsRangeError exception', function() {
        expect(function() {
            limits().secondly(0);
        }).to.throwException(function (e) {
            expect(e.name).to.equal('MaxcallsRangeError');
        });

        expect(function() {
            limits().secondly(1.5);
        }).to.throwException(function (e) {
            expect(e.name).to.equal('MaxcallsRangeError');
        });
    });

    it('should execute the pushed function', function(done) {
        var rules = limits().secondly(1);
        rules.push(function() {
            done();
        });
    });

    it('should cancel the push', function() {
        var cancled = limits().secondly(1).push(fn, function() { return false });
        expect(cancled).to.not.be.ok();
    });

    it('should execute the onCall callback', function(done) {
        limits({
            hourly: 1,
            onCall: function() {
                done();
            }
        }).push(fn);
    });

    it('should execute the onClear callback', function(done) {
        var rules = limits({
            onClear: function() {
                done();
            }
        }).within(1,1);

        rules.push(fn);
        setTimeout(function() {
            rules.push(fn);
        }, 2);
    });

});