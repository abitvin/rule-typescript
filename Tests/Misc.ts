/// <reference path="../Extern/Test.ts"/>
/// <reference path="../Source/Rule.ts"/>

namespace Abitvin
{
    new Test("Misc")
        .it("Calc", (assert, done) =>
        {
            // Predeclare add, expr and mul.
            const expr = new Rule<number, void>();
            const add = new Rule<number, void>((b, l) => b.length === 1 ? b[0] : b[0] + b[1]);
            const mul = new Rule<number, void>((b, l) => b.length === 1 ? b[0] : b[0] * b[1]);

            const digit = new Rule<number, void>().between('0', '9');
            const num = new Rule<number, void>((b, l) => parseFloat(l)).atLeast(1, digit);
            const brackets = new Rule<number, void>().literal("(").one(expr).literal(")"); 

            const mulRight = new Rule<number, void>().literal("*").one(mul);
            mul.anyOf(num, brackets).maybe(mulRight);

            const addRight = new Rule<number, void>();
            addRight.literal("+").one(add);
            add.one(mul).maybe(addRight);

            expr.anyOf(add, brackets);

            let result = expr.scan("2*(3*4*5)");
            assert(result.isSuccess);
            assert(result.branches[0] === 120);

            result = expr.scan("2*(3+4)*5");
            assert(result.isSuccess);
            assert(result.branches[0] === 70);

            result = expr.scan("((2+3*4+5))");
            assert(result.isSuccess);
            assert(result.branches[0] === 19);

            done();
        });
}