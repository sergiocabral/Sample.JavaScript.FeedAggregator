const fs = require('node:fs')

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
  constructor(sourceFilePath = __dirname + '/_feeds.txt') {
    console.debug(this, `Criação de objeto.`)
    this._sourceFilePath = sourceFilePath
  }

  /**
   * Listar as fontes de feed.
   * @returns {string[]}
   */
  async list() {
    const sources = await this._loadSources(this._sourceFilePath)
    return sources.map(source => source.name)
  }

  /**
   * Consultar feed
   * @param {string|undefined} sourceName Nome da fonte do feed.
   * @returns {Object[]}
   */
  async query(sourceName) {
    return [sourceName]
  }

  /**
   * Carrega a lista de fontes de feeds.
   * @param {string} filePath Arquivo com dados das fontes.
   * @returns {Object[]} Lista de fontes.
   */
  async _loadSources(filePath) {
    let sources

    console.debug(this, `Tentando carregar os dados do arquivo "${filePath}".`)
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath).toString()
        sources = this._parseSourceFileContent(fileContent)
        console.debug(this, `Um total de ${sources.length} fontes de feeds foram recebidas.`)
      } catch (error) {
        console.warn(`Não foi possível ler o conteúdo do arquivo "${filePath}".`)
        console.debug(this, `Erro ao ler o conteúdo do arquivo "${filePath}": ${error?.message}`, error)
      }
    } else {
      console.debug(this, `O arquivo "${filePath}" não existe.`)
    }

    return sources ?? []
  }

  /**
   * Analisa o conteúdo do arquivo com dados das fontes.
   * @param {string} sourceFileContent Conteúdo do arquivo com dados das fontes.
   * @returns {Object[]} Lista de fontes.
   */
  _parseSourceFileContent(sourceFileContent) {
    console.debug(this, `Analisando arquivo com dados das fontes contendo ${sourceFileContent.length} bytes.`)
    const sources = [];
    const lines = sourceFileContent.split('\n')
    for (const line of lines) {
      const divider = line.indexOf(':')
      const name = line.substring(0, divider).trim()
      const url = line.substring(divider + 1).trim()
      if (name && url) {
        sources.push({ name, url })
        console.debug(this, `Validado fonte "${name}" para "${url}".`)
      } else {
        console.debug(this, `Linha inválida: ${line}`)
      }
    }
    return sources;
  }
}