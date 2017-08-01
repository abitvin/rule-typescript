namespace Abitvin
{
    const btnRun = <HTMLInputElement>document.getElementById("btn-run");
    const code = <HTMLTextAreaElement>document.getElementById("inp-code");

    function run(): void
    {
        const program = ToyScript.Compiler.compile(code.value);
        const interperter = new ToyScript.Interpreter(program);

        const step = function()
        {
            if (interperter.step())
                setTimeout(step, 0);
        };

        step();
    }

    code.onkeydown = function (this:HTMLInputElement, e)
    {
        if (e.which === 9)
        {
            e.preventDefault();
            var s = this.selectionStart;
            this.value = this.value.substring(0, this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
            this.selectionEnd = s + 1;
        }

        if (e.ctrlKey && e.which === 13)
            run();
    };

    code.focus();

    btnRun.onclick = function () 
    {
        run();
    };
}