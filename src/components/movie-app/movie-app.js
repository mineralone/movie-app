import React, { Component } from 'react'
import { Alert, Menu } from 'antd'

import './movie-app.css'

import { MovieGenresProvider } from '../movie-genres-context'
import MovieSeacrh from '../movie-search'
import Api from '../../api'
import MovieRated from '../movie-rated'

export default class MovieApp extends Component {
  state = {
    error: null,
    genresList: {},
    selectedPage: 'search',
    savedInputSearch: '',
    savedCurrentPage: {
      seacrhPage: 1,
      ratedPage: 1,
    },
  }

  api = new Api()

  componentDidMount() {
    window.addEventListener('offline', () => {
      this.setState({ error: new Error('No connection') })
    })

    window.addEventListener('online', () => {
      this.setState({ error: null })
    })

    this.getGenres()
    this.api.createGuestSession()
  }

  onChangeInputValue = (value) => this.setState({ savedInputSearch: value })

  onChangeCurrentPage = (page, seacrhFlag) => {
    this.setState(({ savedCurrentPage }) => {
      const newObj = { ...savedCurrentPage }
      if (seacrhFlag) {
        newObj.seacrhPage = page
      } else newObj.ratedPage = page
      return { savedCurrentPage: newObj }
    })
  }

  getGenres = () => {
    this.api
      .getGenres()
      .then((genresList) => this.setState({ genresList }))
      .catch((error) => this.setState({ error }))
  }

  onSelect = ({ key }) => {
    this.setState({ selectedPage: key })
  }

  render() {
    const { error, genresList, selectedPage, savedInputSearch, savedCurrentPage } = this.state
    const menu = [
      { label: 'Search', key: 'search' },
      { label: 'Rated', key: 'rated' },
    ]
    return (
      <MovieGenresProvider value={genresList}>
        {error ? <Alert type="error" message={error.message} showIcon /> : null}
        <section className="movie-app">
          <Menu
            className="movie-app__menu"
            items={menu}
            mode="horizontal"
            selectedKeys={selectedPage}
            onSelect={this.onSelect}
          />
          {selectedPage === 'search' ? (
            <MovieSeacrh
              onChangeInputValue={this.onChangeInputValue}
              savedInputSearch={savedInputSearch}
              savedCurrentPage={savedCurrentPage}
              onChangeCurrentPage={this.onChangeCurrentPage}
            />
          ) : (
            <MovieRated savedCurrentPage={savedCurrentPage} onChangeCurrentPage={this.onChangeCurrentPage} />
          )}
        </section>
      </MovieGenresProvider>
    )
  }
}
