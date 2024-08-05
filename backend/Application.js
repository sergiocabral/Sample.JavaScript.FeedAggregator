const Feeds = require("./Feeds.js")
const WebServer = require("./WebServer.js")

/**
 * Aplicação principal.
 */
module.exports = class Application {
  /**
   * Servidor Web.
   * @type {WebServer}
   */
  _webServer

  /**
   * Gerenciador de feeds.
   * @type {Feeds}
   */
  _feeds

  /**
   * Construtor.
   * @param {Object} param0 Parâmetros de inicialização.
   */
  constructor({port, file} = {}) {
    this._webServer = new WebServer(port)
    this._feeds = new Feeds(file)
  }

  /**
   * Executar aplicação.
   */
  run() {
    console.debug(`Estrutura inicial da aplicação.`)
  }
}