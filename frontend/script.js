function markAsReadOrDelete(button) {
  const feedToHideList = []

  const feedItem = button.closest('.feed-item')
  if (feedItem) {
    feedToHideList.push(feedItem)
  } else {
    feedToHideList.push(...document.querySelectorAll('.feed-item'))
  }

  feedToHideList.forEach(feedToHide => {
    console.debug(`Removido item "${feedToHide.querySelector("h2 a").innerHTML}"`)
    feedToHide.remove()
  })
}

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

const feedsAlreadyLoaded = []
function fillFeedEntries(feedEntries) {
  console.debug(`Preenchendo tela com um total de ${feedEntries.length} itens de feed.`)
  const feedContainer = document.querySelector("#feed-container")
  feedEntries.forEach(news => {
    const feedItem = document.createElement('div')
    feedItem.className = 'feed-item'

    if (!feedsAlreadyLoaded.includes(news.link)) {
      feedsAlreadyLoaded.push(news.link)

      feedItem.innerHTML = `
        <div class="feed-thumb">
          <img src="${news.thumb ?? "noimage.jpg"}" alt="${news.title}">
        </div>
        <div class="feed-content">
          <h2 class="feed-title"><a href="${news.link}" target="_blank">${news.title}</a></h2>
          <div class="feed-source">${news.source}, ${new Date(news.date).toLocaleString()}</div>
        </div>
        <div class="feed-actions">
          <button onclick="markAsReadOrDelete(this)">✖️</button>
        </div>
      `

      feedContainer.prepend(feedItem)
    }
  })
}

async function loadNews() {
  fillFeedEntries(
    await loadFeedEntries()
  )
}

loadNews()

const oneMinute = 60000
setInterval(loadNews, oneMinute)