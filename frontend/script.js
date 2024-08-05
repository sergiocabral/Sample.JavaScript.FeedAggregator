async function loadFeedEntries(sourceName) {
  const baseUrl = `${location.protocol}//${location.host}`
  const url = `${baseUrl.startsWith('file:') ? 'http://localhost' : baseUrl}/feed/${sourceName ?? ""}`
  console.debug(`Tentando carregar dados da url "${url}".`)
  try {
    const response = await fetch(url)
    const feedEntries = await response.json()
    console.debug(`Dados carregados com sucesso.`)
    return feedEntries
  } catch (error) {
    console.error(`Erro ao carregar dados da url "${url}": ${error?.message ?? error}`)
    return []
  }
}

function fillFeedEntries(feedEntries) {
  console.debug(`Preenchendo tela com um total de ${feedEntries.length} itens de feed.`)
  const feedContainer = document.querySelector("#feed-container")
  feedEntries.forEach(news => {
    const feedItem = document.createElement('div')
    feedItem.className = 'feed-item'

    feedItem.innerHTML = `
      <div class="feed-thumb">
        <img src="${news.thumb}" alt="${news.title}">
      </div>
      <div class="feed-content">
        <h2 class="feed-title"><a href="${news.link}" target="_blank">${news.title}</a></h2>
        <div class="feed-source">${news.source}, ${new Date(news.date).toLocaleString()}</div>
      </div>
      <div class="feed-actions">
        <button>✖️</button>
      </div>
    `

    feedContainer.prepend(feedItem)
  })
}

async function loadNews() {
  fillFeedEntries(
    await loadFeedEntries()
  )
}

loadNews()