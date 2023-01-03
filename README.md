# QueryLanguage - [Work-in-Progress]

this project is the second part of a larger project aiming to provide
an easy to implement solution for filtering and query data in a JQL like style

part one: "Filter Manger"  
https://github.com/tedwin007/FilterManger

## Analyze query

Example: the query

```
(user bday > "1/1/1998") And (user gender = "F")
```

Is being analyzed to see if the query's structure.

future planning:

- validate the existing of entities and their props (not in this package scope)
- transforming the query into any DB query you use (partially in this package scope)

more examples :

``(Asset 1 > 10)``

will throw the following msg due to wrong statement structure
(entity prop cannot be numeric)

``
MismatchedTokenException: Expecting token of type --> Identifier <-- but found --> '1' <--
``