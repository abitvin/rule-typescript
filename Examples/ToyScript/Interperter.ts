﻿///<reference path="References.ts"/>

namespace Abitvin.ToyScript
{
    export class Interpreter
    {
        private _current: IInterperterScope;
        private _varStack: IVariable[] = [];

        constructor(program: IAstNode)
        {
            this._current = {
                index: 0,
                node: program,
                parent: null,
                return: { value: new Type.Null() },
                stackLength: 0,
                variables: {}
            };

            // TODO: Why step here?
            //this.step();
        }
       
        public defineVariable(id: string, v: IVariable): void
        {
            this._current.variables[id] = v;
        }

        public getReturn(): IVariable
        {
            return this._current.return.value;
        }

        public getVariable(id: string): IVariable
        {
            const v: IVariable = this.findVariable(id);

            if (v === null)
                throw new Error("Undefined variable with id '" + id + "'");

            return v;
        }

        public popVariable(): IVariable
        {
            const popped: IVariable = this._varStack.pop();

			if (!popped)
				throw new Error("Runtime error. Popped to many.");

            //console.log("Popped", popped.toString());
			return popped;
        }

        public pushVariable(v: IVariable): void
        {
            this._varStack.push(v);
            //console.log("Pushed", v.toString());
        }

        public setReturn(v: IVariable): void
        {
            this._current.return.value = v;
        }

        public setVariable(id: string, assignment: IVariable): void
        {
            const v: IVariable = this.findVariable(id);

            if (v)
                v.assign(assignment);
            else
                this.defineVariable(id, assignment);
        }

        public step(): boolean
        {
            let node: IAstNode;
            let exitNode: boolean = this._current.return.value.constructor !== Type.Null;

            if (!exitNode)
            {
				node = this._current.node.getChild(this._current.index, this);
                exitNode = node === null;
            }

            if (exitNode)
            {
                const v: IVariable = this._current.node.exit(this);
                
                //console.log("Exit(" + this._current.stackLength + ") `" + this._current.node.constructor["name"] + "`");

                while (this._varStack.length > this._current.stackLength)
                {
                    //console.log("Clean up pop after return");
                    this.popVariable();
                }
                    
                if (v !== null)
                {
					this.pushVariable(v);
                    //console.log("=> " + v.toString());
                }

                this._current = this._current.parent;

                if (this._current === null)
                {
                    //console.log("Stack", this._varStack.map(v => v.toString()));
                    return false;
                }

                this._current.index++;
            }
            else
            {
                const pushScope: IInterperterScope = {
					index: 0,
                    node: node,
                    parent: this._current,
                    return: null,
                    stackLength: this._varStack.length,
                    variables: null,
                };

                //console.log("Enter(" + pushScope.stackLength + ") `" + node.constructor["name"] + "`");

                if (node.isDefinitionScope())
                {
                    pushScope.return = { value: new Type.Null() };
                    pushScope.variables = {};
                }
                else
                {
                    pushScope.return = this._current.return;
                    pushScope.variables = this._current.variables;
                }

                this._current = pushScope;
            }

            //console.log("Stack", this._varStack.map(v => v.toString()));
            return true;
        }

		private findVariable(id: string): IVariable
        {
            let scope: IInterperterScope = this._current;

			while (scope)
            {
                if (scope.variables && scope.variables[id])
                    return scope.variables[id];

                scope = scope.parent;
            }

            return null;
        }
    }
} 