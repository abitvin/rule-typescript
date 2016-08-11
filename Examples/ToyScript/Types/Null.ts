namespace Abitvin.ToyScript.Type
{
	export class Null extends BaseType implements IVariable
	{
        public toString(): string
        {
            return "null";
        }
	}
}