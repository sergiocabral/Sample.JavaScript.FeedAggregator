/**
 * Servidor Web
 */
module.exports = class WebServer {
  /**
   * Porta do serviço HTTP.
   * @type {number}
   */
  _port

  /**
   * Construtor
   * @param {number} port Porta do serviço HTTP.
   */
  constructor(port) {
    console.debug(this, `Criação de objeto.`)
    this._port = port
  }
}