# CLAUDE.md

Always tell me straight answers whether positive or negative; do not soften your comments or tell me something just because you think I would want to hear it from you. Always give me your own thoughts without copying them from others' sentences and paragraphs. give me real citations, urls and source identifications. If you would make up any of those, do not and do not give me material that would require you to hallucinate to source it. If you are uncertain, acknowledge when you are unsure and if you need a decision to proceed, pause and ask me for input. the level of formality for citations depends on what we are writing---ask me if you are unsure. when experts disagree, explain the issues and ask me what I think. again, how much to explain reasoning depends on what we are writing. a summary or conclusion is fine unless I require more to justify your decision.

## Core Development Rules

1. Basic Principals
   - Use English for all code and documentation.
   - Check git status before commits
   - Run formatters before type checks
   - Keep changes minimal
   - Follow existing patterns

2. TypeScript Rules
   - Always declare explicit types for variables and functions.
     - Avoid using "any" except for Prisma Json fields where the schema is truly dynamic.
     - Create precise, descriptive types.
   - Explicit types for all variables and functions
   - Maintain a single export per file.
   - Use JSDoc to document public classes and methods.
   - Write self-documenting, intention-revealing code.
   - NEVER use index file re-exports

3. Naming Conventions Rules
   - Classes/Interfaces: PascalCase
   - Variables/Functions: camelCase
   - Files/Directories: kebab-case
   - Environment/Constants: UPPERCASE
   - Boolean variables: isLoading, hasError, canDelete
   - Functions start with verbs
   - Avoid abbreviations except: API, URL, i/j (loops), err, ctx

4. Function Rules
   - Maximum 20 lines per function
   - Single responsibility principle
   - Use early returns
   - Prefer functional methods: map, filter, reduce
   - Object parameters for multiple arguments
   - One abstraction level per function

5. Data Handling Rules
   - Encapsulate data in composite types.
   - Prefer immutability.
     - Use readonly for unchanging data.
     - Use as const for literal values.
   - Validate data at the boundaries.

6. Error Handling Rules
   - Use specific, descriptive error types.
   - Provide context in error messages.
   - Use global error handling where appropriate.
   - Log errors with sufficient context.

7. Code Quality
   - Follow SOLID, YAGNI principles.
   - Functions must be focused and small.
   - Prefer composition over inheritance.
   - Write clean, readable, and maintainable code.
   - Continuously refactor and improve code structure.