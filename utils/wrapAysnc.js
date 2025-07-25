// Export a function called wrapAsync that takes a function 'fn' as an argument
module.exports = function wrapAsync(fn) {
    // Return a new function (middleware for Express)
    return function(req, res, next) {
        // Call the original async function 'fn' with req, res, and next
        // If 'fn' returns a rejected promise (throws an error), catch it and pass to Express error handler
        fn(req, res, next).catch(next);
    }
}
