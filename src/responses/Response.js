class Response {
  constructor(success = 0, messages = null, data = null) {
    this.success = success;
    this.messages = messages;
    this.data = data;
  }
}
module.exports = Response;
