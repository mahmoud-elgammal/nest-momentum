// HTTP RESPONSE SUFFIXES
export const HTTP_ERROR_SUFFIX = 'FAILED'; // Suffix indicating an unsuccessful outcome of an HTTP operation
export const HTTP_SUCCESS_SUFFIX = 'SUCCEEDED'; // Suffix indicating a successful outcome of an HTTP operation

// DEFAULT HTTP TEXTS
export const HTTP_DEFAULT_TEXT = 'FETCH_DATA'; // Default text used for initiating data retrieval
export const HTTP_DEFAULT_ERROR_TEXT = `${HTTP_DEFAULT_TEXT}_${HTTP_ERROR_SUFFIX}`; // Default text for indicating a failed data retrieval
export const HTTP_DEFAULT_SUCCESS_TEXT = `${HTTP_DEFAULT_TEXT}_${HTTP_SUCCESS_SUFFIX}`; // Default text for indicating a successful data retrieval

// HTTP STATUS TEXTS
export const HTTP_ANONYMOUS = 'ANONYMOUS'; // Text representing an anonymous or unidentified user in the context of HTTP
export const HTTP_UNAUTHORIZED = 'UNAUTHORIZED'; // Text indicating an unauthorized HTTP status
export const HTTP_BAD_REQUEST = 'BAD_REQUEST'; // Text indicating a bad request HTTP status
export const HTTP_NOT_FOUND = 'NOT_FOUND'; // Text indicating a not found HTTP status
export const HTTP_PARAMS_PERMISSION_ERROR = 'PARAMETER_PERMISSION_ERROR'; // Text indicating a permission error related to parameters in an HTTP request
export const VALIDATION_ERROR = 'VALIDATION_ERROR'; // Text indicating an error due to validation failure in an HTTP request
export const HTTP_INTERNAL_SERVER_ERROR_TEXT = 'INTERNAL_EVER_ERROR'; // Text indicating an internal server error HTTP status
export const EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS' // Text indicating an there's already email with the same name
export const USER_NOT_FOUND = 'HTTP_USER_NOT_FOUND';
export const INCORRECT_PASSWORD = 'INCORRECT_PASSWORD';
