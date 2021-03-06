﻿namespace Abitvin.ToyScript.AstNode
{
    export class Variable implements IAstNode
    {
        private _id: string;
        
        constructor(id: string)
        {
            this._id = id;
        }

        public exit(interperter: Interpreter): IVariable
        {
            return interperter.getVariable(this._id);
        }

        public getChild(): IAstNode
        {
            return null;
        }

        public isDefinitionScope(): boolean
        {
            return false;
        }
    }
} 