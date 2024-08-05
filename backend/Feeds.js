const fs = require('node:fs')
const xml2js = require('xml2js')

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
    console.debug(this, `Consultando fonte "${sourceName ?? "(todas as fontes)"}".`)
    const allSources = await this._loadSources(this._sourceFilePath)
    const sources = sourceName
      ? allSources.filter(source => source.name.toLowerCase() == sourceName.toLowerCase())
      : allSources

    const entries = []

    if (sources.length > 0) {
      for (const source of sources) {
        for (const entry of await this._queryFeed(source.url)) {
          entries.push({
            source: source.name,
            ...entry,
          })
        }
      }

      entries.sort((itemA, itemB) => {
        const itemADate = new Date(itemA.date).getTime()
        const itemBDate = new Date(itemB.date).getTime()
        if (itemADate < itemBDate) {
          return -1
        } else if (itemADate > itemBDate) {
          return +1
        } else {
          return 0
        }
      })
    } else {
      console.debug(this, `Nenhuma fonte foi encontrada`)
    }

    return entries
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

  /**
   * Consulta os itens de um feed.
   * @param {string} url Url do feed.
   * @returns {Object[]} Lista de itens do feed.
   */
  async _queryFeed(url) {
    let entries

    try {
      console.debug(this, `Consultando feed pela url "${url}".`)
      const response = await fetch(url)
      const feedContent = await response.text()
      entries = await this._parseFeedContent(feedContent)
      console.debug(this, `Um total de ${entries.length} entradas foram recebidas do feed.`)
    } catch (error) {
      console.warn(`Não foi possível consultar o feed na url "${url}".`)
      console.debug(this, `Erro ao consultar o feed na url "${url}": ${error?.message}`, error)
    }

    return entries ?? []
  }

  /**
   * Analisa o conteúdo do feed.
   * @param {string} sourceFileContent Conteúdo do feed.
   * @returns {Object[]} Lista de itens do feed.
   */
  async _parseFeedContent(feedContent) {
    console.debug(this, `Analisando conteúdo do feed contendo ${feedContent.length} bytes.`)
    const feedContentAsJson = await xml2js.parseStringPromise(feedContent)

    let isValidFormat = feedContentAsJson?.rss?.channel?.length > 0 && feedContentAsJson.rss.channel[0].item.length >= 0

    let errorCount = 0
    const entries = []
    if (isValidFormat) {
      for (const item of feedContentAsJson.rss.channel[0].item) {
        try {
          entries.push({
            title: item['title'][0].trim(),
            date: new Date(item['pubDate'][0].trim()).toISOString(),
            link: item['link'][0].trim(),
            thumb: item['media:content'] && item['media:content'][0] && item['media:content'][0]['$'] && item['media:content'][0]['$'].url,
          })
        } catch (error) {
          errorCount++
          console.debug(this, `Erro ao analisar item do feed: ${JSON.stringify(item)}`, error)
        }
      }
    }

    if (errorCount) {
      console.warn(`Ocorreram ${errorCount} erro(s) ao analisar o feed.`)
    }

    return entries
  }
}