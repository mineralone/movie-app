export default class Api {
  apiBaseMovie = 'https://api.themoviedb.org/3/'

  apiBasePoster = 'https://image.tmdb.org/t/p/w500'

  apiKey = '630851159d9b324c699a95b6ca62b1c3'

  session = localStorage.getItem('session') || ''

  async createGuestSession() {
    this.session = localStorage.getItem('session')
    if (!this.session) {
      const request = await fetch(`${this.apiBaseMovie}authentication/guest_session/new?api_key=${this.apiKey}`)
      const response = await request.json()
      if (!response.success) throw new Error('Failed to create guest session')
      this.session = response.guest_session_id
      localStorage.setItem('session', JSON.stringify(this.session))
    }
  }

  async onRateMovie(id, rating) {
    const obj = { value: rating }
    const request = await fetch(
      `${this.apiBaseMovie}movie/${id}/rating?api_key=${this.apiKey}&guest_session_id=${JSON.parse(this.session)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(obj),
      }
    )
    const response = await request.json()
    if (!response.success) throw new Error('Failed to rated movie')
    return response
  }

  async getRatedMovies(page) {
    if (!this.session) throw new Error('Guest session not created')
    const request = await fetch(
      `${this.apiBaseMovie}guest_session/${JSON.parse(this.session)}/rated/movies?page=${page}&api_key=${this.apiKey}`,
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      }
    )
    const response = await request.json()
    return response
  }

  async getMovies(query, page) {
    if (query.length === 0) return { results: null }
    const request = await fetch(`${this.apiBaseMovie}search/movie?api_key=${this.apiKey}&query=${query}&page=${page}`)
    const response = await request.json()
    if (response.results.length === 0) throw new Error('no content')
    return response
  }

  async getPoster(str) {
    const response = await fetch(`${this.apiBasePoster}${str}`)
    const file = await response.blob()
    const url = URL.createObjectURL(file)
    return url
  }

  async getGenres() {
    const response = await fetch(`${this.apiBaseMovie}genre/movie/list?api_key=${this.apiKey}`)
    const body = await response.json()
    const genres = {}
    body.genres.forEach((genre) => {
      genres[genre.id] = genre.name
    })
    return genres
  }
}
