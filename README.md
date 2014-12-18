inference-engine
================

Reasoning machine built with node

###Running the demo

1. Clone this repo
2. Run: `npm install`
3. Run: `node app/main.js`

###Sample demo

```
Welcome to the inference engine demo!
Type "help" for help.

> all dogs are mammals
Okay.

> all cats are mammals
Okay.

> all mammals are hairy animals
Okay.

> all hairy animals are animals
Okay.

> all birds are animals
Okay.

> are all dogs animals
true

> are all dogs cats
false

> are all birds cats
false

> are all animals birds
false
```
