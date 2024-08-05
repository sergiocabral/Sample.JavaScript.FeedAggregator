const express = require('express')
const cors = require('cors')

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
   * Instância do Express
   * @type {import('express').Express}
   */
  _expressInstance

  /**
   * @type {import('http').Server}
   */
  _server

  /**
   * Construtor
   * @param {number} port Porta do serviço HTTP.
   */
  constructor(port = 80) {
    console.debug(this, `Criação de objeto.`)
    this._port = port
    this._expressInstance = express()
    this._expressInstance.use(cors({ origin: '*' }))
  }

  /**
   * Registra uma rota Web para tratamento com função.
   * @param {string} route Rota Web
   * @param {function} handler Função para tratamento da rota.
   * @param {string} httpMethod Método HTTP
   */
  registerRouteForHandle(route, handler, httpMethod = 'GET') {
    console.debug(this, `Registrando rota "${route}" para método "${httpMethod}".`)
    const functionName = httpMethod.toLowerCase()
    const functionInstance = this._expressInstance[functionName]
    functionInstance.bind(this._expressInstance)(route, (...args) => {
      console.debug(this, `Requisição da rota "${route}".`)
      handler(...args)
    })
  }

  /**
   * Registra uma rota Web que entrega um caminho estaticamente.
   * @param {string} route Rota Web
   * @param {string} path Caminho onde estão os arquivos.
   */
  registerRouteForPath(route, path) {
    console.debug(this, `Registrando rota "${route}" para caminho estático "${path}".`)
    this._expressInstance.use(route, express.static(path))
  }

  /**
   * Iniciar o serviço Web.
   * @returns {Promise<void>}
   */
  async start() {
    console.debug(this, `Tentando iniciar serviço na porta ${this._port}.`)
    return new Promise(resolve => {
      this._server = this._expressInstance.listen(
        this._port,
        () => {
          console.debug(this, `Sucesso ao iniciar serviço.`)
          resolve()
        }
      )
    })
  }

  /**
   * Parar o serviço Web.
   * @returns {Promise<void>}
   */
  async stop() {
    console.debug(this, `Tentando parar serviço.`)
    return new Promise(resolve => {
      this._server.close(
        () => {
          console.debug(this, `Sucesso ao parar serviço.`)
          resolve()
        }
      )
    })
  }
}