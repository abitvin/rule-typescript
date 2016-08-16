About these examples
====================
These examples should be considered prototypes, they are incomplete, buggy or old. They were build in the first stages of developing the Rule API.
I build these to test the Rule API but they are still a good example to what you can do with it.

ToyScript
---------
This project started the Rule API. I was working on this "toy language" and I needed a parser. So the Rule API was born!
The language featured: basic arithmetic, functions, range syntaxes and some buggy structs which I don't gonna fix.
The Rule API is used to compile the source code to an AST and run that via an interperter. 

Common rules
------------
Some examples of common rules.

INI Reader
----------
A variant of an INI reader which parses the text into a JSON object.

JSON Reader
-----------
An almost fully implemented working JSON reader which parses the text into a JSON object. 
The part that isn't working is support for all the different variable names that for example has weird Unicode characters in it.