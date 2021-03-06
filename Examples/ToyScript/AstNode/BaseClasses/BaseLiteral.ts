﻿///<reference path="../../References.ts"/>

namespace Abitvin.ToyScript.AstNode
{
    export class BaseLiteral<T>
    {
        protected _value: T;

        constructor(value: T)
        {
            this._value = value;
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