﻿namespace Abitvin.ToyScript.AstNode
{
    export class Struct extends BaseLiteral<boolean> implements IAstNode
    {
        public exit(interperter: Interpreter): IVariable
        {
            return new Type.Struct();
        }
    }
} 