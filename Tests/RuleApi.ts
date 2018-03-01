/// <reference path="../Extern/Test.ts"/>
/// <reference path="../Source/Rule.ts"/>

namespace Abitvin
{
    new Test("Rule API")
        .it("all()", (assert, done) =>
        {
            const code = "abcdefg";
            
            const fn = (b, l) => {
                assert(l === "abcdefg");
                return [true, false, false, true];
            };
            
            const r = new Rule<boolean, void>(fn).anyChar().anyChar().anyChar().anyChar().anyChar().anyChar().anyChar();
            const result = r.scan(code);
            
            assert(result.isSuccess);
            assert(result.branches[0] === true);
            assert(result.branches[1] === false);
            assert(result.branches[2] === false);
            assert(result.branches[3] === true);
            done();
        })
        .it("allExcept()", (assert, done) =>
        {
            const code = "abc";
            
            const fn = (b, l) => {
                assert(l === "abc");
                return [0, 1, 2, 3];
            };
            
            const c = new Rule<number, void>().anyCharExcept('A', 'B', 'C', 'D');
            const r = new Rule<number, void>(fn).exact(3, c);
            
            const result = r.scan(code);

            assert(result.isSuccess);
            assert(result.branches[0] === 0);
            assert(result.branches[1] === 1);
            assert(result.branches[2] === 2);
            assert(result.branches[3] === 3);
            done();
        })
        .it("alter()", (assert, done) =>
        {
            const code = "\\<東\\<💝\\>中\\>"; // There are gonna be 7 replacements.
            
            const alterations = [
                "\\<", "<",
                "\\>", ">",
                "東", "AAA",
                "💝", "BBB",
                "中", "CCC",
            ];
            
            const a = new Rule<Number, void>().alter(alterations);
            
            const f = (b, l) => {
                assert(l === "<AAA<BBB>CCC>");
                return [111, 222];
            }; 
            
            const r = new Rule<Number, void>(f).exact(7, a);
            const result = r.scan(code);

            assert(result.isSuccess);
            assert(result.branches[0] === 111);
            assert(result.branches[1] === 222);
            done();
        })
        .it("anyOf()", (assert, done) =>
        {
            const code = "aaabbbccc";
            
            const aaaFn = (b, l) => {
                assert(l === "aaa");
                return [111];
            }; 
            
            const bbbFn = (b, l) => {
                assert(l === "bbb");
                return [222];
            };
            
            let cccFn = (b, l) => {
                assert(l === "ccc");
                return [333];
            };
            
            const aaa = new Rule<number, void>(aaaFn).literal("aaa");
            const bbb = new Rule<number, void>(bbbFn).literal("bbb");
            const ccc = new Rule<number, void>(cccFn).literal("ccc");
            const anyOfThese = new Rule<number, void>().anyOf(aaa, bbb, ccc);
            const root = new Rule<number, void>().exact(3, anyOfThese);

            const result = root.scan(code);
            
            assert(result.isSuccess);
            assert(result.branches[0] === 111);
            assert(result.branches[1] === 222);
            assert(result.branches[2] === 333);
            done();
        })
        .it("atLeast()", (assert, done) =>
        {
            const code = "xxxx";
            
            const x = new Rule<number, void>(() => 10).literal("x");
            const root = new Rule<number, void>();
            
            let result = root.atLeast(3, x).scan(code);
            assert(result.isSuccess);
            assert(result.branches[0] === 10);
            assert(result.branches[1] === 10);
            assert(result.branches[2] === 10);
            assert(result.branches[3] === 10);

            result = root.clear().atLeast(4, x).scan(code);
            assert(result.isSuccess);
            assert(result.branches[0] === 10);
            assert(result.branches[1] === 10);
            assert(result.branches[2] === 10);
            assert(result.branches[3] === 10);
            
            result = root.clear().atLeast(5, x).scan(code);
            assert(!result.isSuccess);

            done();
        })
        .it("atMost()", (assert, done) =>
        {
            const code = "yyy";
            
            const y = new Rule<number, void>(() => 14).literal("y");
            const root = new Rule<number, void>();
        
            let result = root.atMost(2, y).scan(code);
            assert(!result.isSuccess);
            
            result = root.clear().atMost(3, y).scan(code);
            assert(result.isSuccess);
            assert(result.branches[0] === 14);
            assert(result.branches[1] === 14);
            assert(result.branches[2] === 14);

            result = root.clear().atMost(4, y).scan(code);
            assert(result.isSuccess);
            assert(result.branches[0] === 14);
            assert(result.branches[1] === 14);
            assert(result.branches[2] === 14);
            
            done();
        })
        .it("between()", (assert, done) =>
        {
            const code = "zzz";
            
            const z = new Rule<number, void>(() => 34).literal("z");
            const root = new Rule<number, void>();
            
            let result = root.between(1, 3, z).scan(code);
            assert(result.isSuccess);
            assert(result.branches[0] === 34);
            assert(result.branches[1] === 34);
            assert(result.branches[2] === 34);

            result = root.clear().between(0, 10, z).scan(code);
            assert(result.isSuccess);
            assert(result.branches[0] === 34);
            assert(result.branches[1] === 34);
            assert(result.branches[2] === 34);

            result = root.clear().between(4, 5, z).scan(code);
            assert(!result.isSuccess);

            done();
        })
        .it("charIn()", (assert, done) =>
        {
            // TODO Rename to `charIn`
            const digit = new Rule<number, void>((b, l) => l.charCodeAt(0) - 48).between('0', '9');
            const af = new Rule<number, void>((b, l) => l.charCodeAt(0) - 55).between('A', 'F');
            const hex = new Rule<number, void>().anyOf(digit, af);

            const parserFn = (b, l) => {
                let m = 1;
                let n = 0;

                for (let i = b.length - 1; i >= 0; i--) {
                    n += b[i] * m;
                    m <<= 4;
                }

                return n;
            };

            const parser = new Rule<number, void>(parserFn).between(1, 8, hex);
            
            let result = parser.scan("A");
            assert(result.isSuccess);
            assert(result.branches[0] === 10);

            result = parser.scan("12345678");
            assert(result.isSuccess);
            assert(result.branches[0] === 305419896);

            result = parser.scan("FF");
            assert(result.isSuccess);
            assert(result.branches[0] === 255);
            
            result = parser.scan("FFFFFFFF");
            assert(result.isSuccess);
            assert(result.branches[0] === 4294967295);
            
            result = parser.scan("FFFFFFFFF");
            assert(!result.isSuccess);

            result = parser.scan("FFxFF");
            assert(!result.isSuccess);
            
            result = parser.scan("");
            assert(!result.isSuccess);
            
            done();
        })
        .it("clear()", (assert, done) =>
        {
            const code = "Ello'";
            
            const r = new Rule<void, void>();
            r.literal("Ello'");
            r.clear();
            
            try {
                r.scan(code);   // Exception! We cleared the rule.
                assert(false);
            }
            catch (e) {
                assert(true);
            }

            done();
        })
        .it("eof()", (assert, done) =>
        {
            const code = "123";
            
            const r = new Rule<string, void>(() => ['A', 'B']).literal("123").eof();
            
            const result = r.scan(code);
            assert(result.isSuccess);
            assert(result.branches[0] === "A");
            assert(result.branches[1] === "B");
            done();
        })
        .it("exact()", (assert, done) =>
        {
            let code = "..........";
            
            const dot = new Rule<string, void>(() => ".").literal(".");
            const nope = new Rule<string, void>(() => "x").literal("nope");
            const root = new Rule<string, void>();
            
            let result = root.exact(10, dot).scan(code);
            assert(result.isSuccess);
            assert(result.branches.length === 10);
            assert(result.branches.every(c => c === "."));

            result = root.clear().exact(9, dot).scan(code);
            assert(!result.isSuccess);
            
            result = root.clear().exact(11, dot).scan(code);
            assert(!result.isSuccess);

            result = root.clear().exact(10, dot).exact(0, nope).scan(code);
            assert(result.isSuccess);
            assert(result.branches.length === 10);
            assert(result.branches.every(c => c === "."));

            done();
        })
        .it("literal()", (assert, done) =>
        {
            const code = "y̆y̆y̆x̆";
            
            const rootFn = (b, l) => {
                assert(l === "y̆y̆y̆x̆");
                return [7777, 8888, 9999];
            };

            const root = new Rule<number, void>(rootFn).literal("y̆y̆").literal("y̆").literal("x̆");
            
            const result = root.scan(code);

            assert(result.isSuccess);
            assert(result.branches[0] === 7777);
            assert(result.branches[1] === 8888);
            assert(result.branches[2] === 9999);

            done();
        })
        .it("maybe()", (assert, done) =>
        {
            const codes = [
                "xxx",
                "...xxx",
                "xxx...",
                "...xxx...",
            ];
            
            const dots = new Rule<string, void>().literal("...");
            const xxx = new Rule<string, void>(() => "x").literal("xxx");
            const root = new Rule<string, void>().maybe(dots).one(xxx).maybe(dots);
            
            for (let c of codes) {
                const result = root.scan(c);
                assert(result.isSuccess);
                assert(result.branches.length === 1);
                assert(result.branches[0] === "x");
            }

            done();
        })
        .it("noneOrMany()", (assert, done) =>
        {
            const dot = new Rule<boolean, void>(() => true).literal(".");
            const x = new Rule<boolean, void>(() => false).literal("x");
                    
            const code1 = new Rule<boolean, void>((b, l) => 
            {
                assert(b.length === 0);
                assert(l === "");
                return [];
            });
            
            const code2 = new Rule<boolean, void>((b, l) =>
            {
                assert(b.length === 1);
                assert(b[0] === false);
                assert(l === "x");
                return [];
            });
            
            const code3 = new Rule<boolean, void>((b, l) =>
            {
                assert(b.length === 2);
                assert(b[0] === true);
                assert(b[1] === true);
                assert(l === "..");
                return [];
            });
            
            const code4 = new Rule<boolean, void>((b, l) =>
            {
                assert(b.length === 3);
                assert(b[0] === false);
                assert(b[1] === false);
                assert(b[2] === true);
                assert(l === "xx.");
                return [];
            });
            
            const code5 = new Rule<boolean, void>((b, l) =>
            {
                assert(b.length === 4);
                assert(b[0] === true);
                assert(b[1] === true);
                assert(b[2] === false);
                assert(b[3] === false);
                assert(l === "..xx");
                return [];
            });
            
            const result1 = code1.noneOrMany(dot).noneOrMany(x).noneOrMany(dot).scan("");
            assert(result1.isSuccess); 

            const result2 = code2.noneOrMany(dot).noneOrMany(x).noneOrMany(dot).scan("x");
            assert(result2.isSuccess);

            const result3 = code3.noneOrMany(dot).noneOrMany(x).noneOrMany(dot).scan("..");
            assert(result3.isSuccess);

            const result4 = code4.noneOrMany(dot).noneOrMany(x).noneOrMany(dot).scan("xx.");
            assert(result4.isSuccess);

            const result5 = code5.noneOrMany(dot).noneOrMany(x).noneOrMany(dot).scan("..xx");
            assert(result5.isSuccess);
            
            done();
        })
        .it("not()", (assert, done) =>
        {
            const notThis = new Rule<void, void>().literal("not this");
            const r = new Rule<void, void>().literal("aaa").not(notThis).literal("bbb").literal("ccc");
            
            const result1 = r.scan("aaabbbccc");
            assert(result1.isSuccess);

            const result2 = r.scan("aaanot thisbbbccc");
            assert(!result2.isSuccess);
            
            done();
        })
        .it("one()", (assert, done) =>
        {
            const code = "onetwothree";
            
            const one = new Rule<number, void>(() => 1).literal("one");
            const two = new Rule<number, void>(() => 2).literal("two");
            const three = new Rule<number, void>(() => 3).literal("three");
            const root = new Rule<number, void>().one(one, two, three);
            
            const result = root.scan(code);
            assert(result.isSuccess);
            assert(result.branches.length === 3);
            assert(result.branches[0] === 1);
            assert(result.branches[1] === 2);
            assert(result.branches[2] === 3);

            done();
        })

        .it("Bug v0.5.12", (assert, done) =>
        {
            let stmtCount = [0, 3, 1];

            let blockFn = (b, l) => {
                assert(b.length === stmtCount.pop());
                return [1];
            };

            let rootFn = (b: number[], l) => {
                assert(b.length === 1);
                return b;
            };

            let stmtFn = (b, l) => {
                assert(b.length === 0);
                return [7];
            };
           
            let ws = new Rule<number, false>().literal(" ");
            let noneOrManyWs = new Rule<number, false>().noneOrMany(ws);
            let stmt = new Rule<number, false>(stmtFn).literal("stmt");
            let wsPlusStmt = new Rule<number, false>().one(noneOrManyWs).one(stmt);
            let stmts = new Rule<number, false>().one(stmt).noneOrMany(wsPlusStmt);
            let block = new Rule<number, false>(blockFn).maybe(stmts);
            let root = new Rule<number, false>(rootFn).one(noneOrManyWs).one(block).one(noneOrManyWs);

            {
                const result = root.scan("stmt");
                assert(result.isSuccess);
                assert(result.branches.length === 1);
                assert(result.branches[0] === 1);
            }

            {
                const result = root.scan("stmt stmt stmt");
                assert(result.isSuccess);
                assert(result.branches.length === 1);
                assert(result.branches[0] === 1);
            }

            {
                const result = root.scan("");
                assert(result.isSuccess);
                assert(result.branches.length === 1);
                assert(result.branches[0] === 1);
            }

            done();
        });
}