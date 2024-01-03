module.exports = (req, res, next) => {
     const getError = (errors) => {
          if (errors?.length) {
               errors = errors[0]
               return errors;
          }
     }
     const errors = getError(req.flash('errors'));
     req.errors = errors;
     next();
}