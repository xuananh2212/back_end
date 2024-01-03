module.exports = (req, res, next) => {
     const getError = (errors) => {
          if (errors?.length) {
               errors = errors[0]
               return errors;
          }
     }
     const getOld = (old) => {
          if (old?.length) {
               old = old[0];
               return old;
          }
     }
     const errors = getError(req.flash('errors'));
     const old = getOld(req.flash('old'));
     req.old = req.flash('old');
     req.errors = errors;
     next();
}