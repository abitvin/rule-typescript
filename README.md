Rule
====

About
-----
The Rule API is a parser combinator written in TypeScript which offers infinite look ahead scanning.
You parse a string into a generic T. Where T is a custom defined data structure for example an AST or a number. 

You can use Rule for:
* Creating a programming language syntax and parse an AST out of it.
* Making different parsers for different Unicode text based file formats.
* Writing a calculator with correct operator precedence with a few lines of code.
* A text comparer, like a regexp alternative.
* Much more...

This API is used for the Grammer API. But you can use it standalone if that's more your cup-of-thee.

Building
--------
This project is build within Visual Studio Code and a installation of TypeScript 1.8 in the default directory.
If your install path of TypeScript is different then the default path then you should change the path in the ".vscode/tasks.json" file.
If everything is set, just press CTRL+SHIFT+B to build.

License
-------
This project is licensed under the MIT license.