module.exports = (req, res, next) => {
     const getError = (errors, fieldName) => {
          if (errors?.length) {
               errors = errors[0]
               return errors[fieldName];
          }
     }
}