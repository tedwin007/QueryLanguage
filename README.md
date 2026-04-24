# QueryLanguage — Learning Branch

> **This repo is a sandbox, not a product.**
> It was written as a trial-and-error exercise to learn how to build a JQL-style query DSL — lexer, parser, AST visitor, and SQL compilation — before taking on the real implementation. Expect incomplete features and a few dead ends.

The "real thing" will be built as a separate project, informed by what was learned here.

## What I was trying to learn

- How to design a small grammar and express it with [Chevrotain](https://chevrotain.io/) (tokens, CST parser rules, visitors).
- How to turn a parsed tree into an intermediate representation that a downstream compiler can consume.
- How to wire that into [TypeORM](https://typeorm.io/) and go from parsed query → executable SQL.
- How to auto-generate entity classes from a live database schema.

## The query shape being explored

    (Entity prop operator value) [And|Or (Entity prop operator value) ...]

Examples:

    (User age > 18)
    (User gender = "F") And (User age > 18)

Flow:

    input string
      → lexer (Chevrotain tokens)
      → parser (CST)
      → visitor (normalized IR)
      → query builder (SQL string)

## What works

- Tokenizing and parsing the grammar above.
- Visiting the CST into a flat list of `VisitedStatement`s joined by conjunctions.
- Compiling that list into a `SELECT * FROM <entity> WHERE …` string.
- Validating entity and property names against a supplied metadata map.
- Generating TypeORM entity classes from a database via `typeorm-model-generator`.

## Running it

    npm install
    npm test          # Jasmine suite
    npm run dev       # Nodemon on src/index.ts
    npm run tsc       # Type-check + build to main/

### Generating entities from a DB (optional)

Configure `.env`:

    HOST=localhost
    DB_NAME=my_db
    USER_NAME=my_user
    PASSWORD=***
    DB_TYPE=mysql
    OUTPUT_PATH=./src/lib/ORM/

Then:

    npm run generate-types

## Project layout

    src/
    ├── index.ts
    └── lib/
        ├── lexer/       # Chevrotain tokens
        ├── parser/      # CST parser rules
        ├── visitor/     # CST → IR
        └── ORM/
            ├── db-connector/    # TypeORM DataSource factory
            ├── query-builder/   # IR → SQL
            ├── entities/        # Generated entity classes
            └── scripts/         # generate-types.js

## Related

- [FilterManager](https://github.com/tedwin007/FilterManger) — part one, the consumer of the DSL this branch was exploring.

## Status

Archived as a reference. The production implementation lives elsewhere (or will). Please don't depend on this package.
