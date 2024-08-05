/**
 * Gerenciador de feeds Atom 2.0
 */
module.exports = class Feeds {
  /**
   * Caminho do arquivo fonte de dados dos feeds.
   * @type {string}
   */
  _sourceFilePath

  /**
   * Construtor.
   * @param {string} sourceFilePath Caminho do arquivo fonte de dados dos feeds.
   */
  constructor(sourceFilePath) {
    console.debug(this, `Criação de objeto.`)
    this._sourceFilePath = sourceFilePath
  }

  /**
   * Listar as fontes de feed.
   * @returns {string[]}
   */
  async list() {
    return '(vazio)'
  }

  /**
   * Consultar feed
   * @param {string|undefined} sourceName Nome da fonte do feed.
   * @returns {Object[]}
   */
  async query(sourceName) {
    return [sourceName]
  }
}