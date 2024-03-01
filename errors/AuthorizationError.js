import http2 from 'http2';

const { HTTP_STATUS_UNAUTHORIZED } = http2.constants;

export default class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS_UNAUTHORIZED;
  }
}
