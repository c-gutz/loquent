# loquent

[Language Playground](https://loquent-lang.vercel.app/)

<br>
Loquent is a tree-walking interpreter that I created in 2025 by following Robert Nystrom's great guide, "Crafting Interpreters."

Implemented in Java, this project served as both my introduction to designing programming languages and Java itself.

Loquent, like the language in Nystrom's book, is quite functional and well-featured, except for some edge cases. It includes functions, classes, inheritance, and all the basics.

As a personal twist, to reflect my interest in historical fiction, I changed the syntax to resemble the verbosity often found in classic novels. I recognize that this makes the language a bit unusable, but I do think it is funny. A dictionary can be found at the bottom of the Playground page for specifics.

This site is a simple static page that uses CheerpJ to run the Java-based language directly in the browser without any reimplementation or backend. This is possible through a WebAssembly JVM. The IDE look is to the credit of CodeMirror.