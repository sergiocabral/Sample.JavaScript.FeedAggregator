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
    this._adjustConsoleDebug()
    console.debug(this, `Criação de objeto.`)
    this._webServer = new WebServer(port)
    this._feeds = new Feeds(file)
  }

  /**
   * Executar aplicação.
   */
  async run() {
    console.debug(this, `Aplicação iniciada.`)

    this._webServer.registerRoute('/', this._routeRoot.bind(this), 'GET')

    await this._webServer.start()

    await this._waitForEnd()

    await this._webServer.stop()

    console.debug(this, `Aplicação finalizada.`)
  }

  /**
   * Rota Web: Raiz
   * @param {import('express').Request} request Requisição HTTP
   * @param {import('express').Response} response Resposta HTTP
   */
  _routeRoot(request, response) {
    response.send('Hello Feeds!')
  }

  /**
   * Ajusta a função nativa `console.debug`.
   */
  _adjustConsoleDebug() {
    const consoleDebug = console.debug;
    console.debug = (...args) => {
      let source = '[?]'
      if (typeof args[0] === 'object' && typeof args[0]?.constructor?.name === 'string') {
        source = `[${args[0].constructor.name}]`
        args.shift()
      }
      consoleDebug(new Date().toISOString(), source, ...args)
    }
  }

  async _waitForEnd() {
    return new Promise(resolve => {})
  }
}