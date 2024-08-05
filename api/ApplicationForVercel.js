const Application = require('./Application.js')

/**
 * Aplicação principal configurada para o ambiente da Vercel
 */
module.exports = class ApplicationForVercel extends Application {
  /**
   * Não permite finalizar a aplicação.
   * @type {boolean}
   */
  get _terminated() {
    return false
  }

  /**
   * Executar aplicação.
   * @returns {import('express').Express} Instância do Express.
   */
  run() {
      super.run()
      return this._webServer._expressInstance
  }
}