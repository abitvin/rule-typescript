﻿namespace Abitvin.ToyScript
{
    export interface IAstNode
    {
        exit(interperter: Interpreter): IVariable;
        getChild(index: number, interperter?: Interpreter): IAstNode;
        isDefinitionScope(): boolean;
    }
} 