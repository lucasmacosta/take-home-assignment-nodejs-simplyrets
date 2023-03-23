# Proposed solution

I decided to use the libraries already installed, I only added the following modules:

- `joi`: This is a very complete validation library, I've used it in many projects. Basically it allows to define schemas of data to validate, and then provides a function which does the validation and returns a sanitized version of the input. I wrapped this in a higher order function to generate validation middlewares.
- `express-async-errors`: By default express uses its default error handler if an exception is thrown from an async request handler. This module overrides that behavior and allows to catch them in the general error handler. This avoids having to put try/catch blocks on all error handlers and use the `next` function with the error.
- `ts-node-dev`: Useful when developing, works the same than `ts-node` but does reload on changes in source files.

I left the code that configured the Express app and the TypeORM data source as they were, I saw no need to change them.

I tried to keep types usage simple, most likely there's no need to duplicate the types definition because the Joi schemas can provide them, but it's not documented and it would take some extra research time to achieve it.

For performing the different operations against the database, I opted to use `QueryBuilder` feature suggested in the TypeORM documentation. One of the major drawbacks that I noticed when using it is that the update operations don't return the affected object, which requires to issue a query immediately after to get it. I'm not sure if there's a better way to handle this, I think most likely it will be.

API endpoints outputs are not being sanitized, Joi can be used for the same thing, I did it in a couple of projects but it requires extra work.

I usually set a config file in which I handle environment variables and their defaults, for this project I just used an object.

For the sake of simplicity and time constraints, I left out unit testing.

I could have also added some kind of API documentation with swagger, for instance, but again I omitted it to keep it simple.
