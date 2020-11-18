class Response {
  constructor(succes = 0, messages = null, data = null) {
    this.succes = succes;
    this.messages = messages;
    this.data = data;
  }
}
module.exports = Response;
