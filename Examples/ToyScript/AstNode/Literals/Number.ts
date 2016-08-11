namespace Abitvin.ToyScript.AstNode
{
    export class Number extends BaseLiteral<number> implements IAstNode
    {
        public exit(interperter: Interpreter): IVariable
        {
            return new Type.Number(this._value);
        }
    }
} 