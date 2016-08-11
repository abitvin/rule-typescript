namespace Abitvin.ToyScript.AstNode
{
    export class GreaterThen extends BaseOperation implements IAstNode
    {
        public exit(interperter: Interpreter): IVariable
        {
			return interperter.popVariable().greaterThen(interperter.popVariable());
        }
    }
} 