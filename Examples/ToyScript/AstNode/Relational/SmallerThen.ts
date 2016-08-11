namespace Abitvin.ToyScript.AstNode
{
    export class SmallerThen extends BaseOperation implements IAstNode
    {
        public exit(interperter: Interpreter): IVariable
        {
			return interperter.popVariable().smallerThen(interperter.popVariable());
        }
    }
} 