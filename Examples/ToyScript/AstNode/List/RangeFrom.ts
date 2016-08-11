namespace Abitvin.ToyScript.AstNode
{
    export class RangeFrom extends BaseOperation implements IAstNode
    {
        public exit(interperter: Interpreter): IVariable
        {
            return interperter.popVariable().rangeFromExpr(interperter.popVariable());
        }
    }
}  