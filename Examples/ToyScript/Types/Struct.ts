namespace Abitvin.ToyScript.Type
{
	export class Struct extends BaseType implements IVariable
	{
        private _items: { [key: string]: IVariable };

		constructor()
		{
            super();
            this._items = {};
		}

        public assignAtKey(key: string, v: IVariable): void
        {
            this._items[key] = v;
        }

        public atKey(key: string): IVariable
        {
            const v: IVariable = this._items[key];

            if(!v)
                throw new Error("Runtime error. Variable with key '" + key + "' not found.");

            return v;
        }
	}
}