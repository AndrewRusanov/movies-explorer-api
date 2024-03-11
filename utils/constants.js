const urlRegex = /^(https?:\/\/(www\.)?([a-zA-z0-9-]){1,}\.?([a-zA-z0-9]){2,8}(\/?([a-zA-z0-9-])*\/?)*\/?([-._~:/?#[]@!\$&'\(\)\*\+,;=])*)/;
const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

module.exports = { urlRegex, emailRegex };
