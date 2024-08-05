/**
 * Cache de dados
 */
module.exports = class Cache {
  /**
   * Banco de dados.
   * @type {Object}
   */
  _data = {}

  /**
   * Registra no cache um dados com prazo de expiração.
   * @param {string} key Chave
   * @param {any} value Valor
   * @param {number} expiryTime Prazo para expiração
   * @returns {any} O mesmo valor inserido
   */
  put(key, value, expiryTime = 60000) {
    console.debug(this, `Registrando chave "${key}" no cache para expirar em ${60000}ms.`)
    this._data[key] = {
      expiryTime: Date.now() + expiryTime,
      key,
      value,
    }
    return value
  }

  /**
   * Consulta um valor no cache.
   * @param {string} key Chave
   * @returns {undefined|null,any} Valor encontrado, null se expirado ou undefined se não existente
   */
  get(key) {
    const entry = this._data[key]
    if (entry?.expiryTime >= Date.now()) {
      console.debug(this, `Recuperação da chave "${key}" teve sucesso.`)
      return entry.value
    } else if (entry) {
      console.debug(this, `Recuperação da chave "${key}" falhou porque expirou.`)
      delete this._data[key]
      return null
    } else {
      console.debug(this, `Recuperação da chave "${key}" falhou porque não existe.`)
      return undefined
    }
  }
}