export enum ResponseCodes {
    SUCCESS = 200,
    ACCEPTED = 202,

    FOUND = 302,

    ERROR_BAD_REQUEST = 400,
    ERROR_UNAUTHORIZED = 401,
    ERROR_NOT_FOUND = 404,
    ERROR_GONE = 410,
    ERROR_TOO_MANY_REQUESTS = 429,

    ERROR_INTERNAL_SERVER_ERROR = 500
}