import http2 from 'http2';

const { HTTP_STATUS_FORBIDDEN } = http2.constants;


export default class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS_FORBIDDEN;
  }
}
