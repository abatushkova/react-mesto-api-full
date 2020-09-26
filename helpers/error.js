class CustomError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleDocNotFoundError = () => {
  throw new CustomError(404, 'Нет пользователя с таким id');
};

const handleCastError = (err) => {
  throw new CustomError(400, `Запрос по ${err.path}:${err.value} не прошел валидацию`);
};

const renderErrors = (err) => {
  const errors = Object
    .values(err.errors)
    .map((elm) => `${elm.path} - ${elm.message}`)
    .join('. ');

  return errors;
};

const handleValidationError = (err) => {
  throw new CustomError(400, `Входные данные не прошли валидацию: ${renderErrors(err)}`);
};

module.exports = {
  CustomError,
  handleDocNotFoundError,
  handleCastError,
  handleValidationError,
};
