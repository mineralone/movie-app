import React, { Component } from 'react'
import { Input, Spin, Alert, Pagination } from 'antd'
import { debounce } from 'lodash'
import './movie-search.css'

import MovieList from '../movie-list'
import Api from '../../api'

export default class MovieSeacrh extends Component {
  api = new Api()

  state = {
    movieDate: [],
    load: false,
    error: null,
    inputValue: '',
    totalMovies: 0,
    currentPage: 1,
  }

  componentDidMount() {
    const { savedInputSearch, savedCurrentPage } = this.props
    this.setState({ currentPage: savedCurrentPage.seacrhPage })
    if (savedInputSearch) {
      this.setState({ inputValue: savedInputSearch })
      this.getMovieList(savedInputSearch.toString(), '1')
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { inputValue, currentPage } = this.state
    if (inputValue !== prevState.inputValue || currentPage !== prevState.currentPage) {
      this.getMovieList(inputValue.toString(), currentPage)
      return
    }
    this.getMovieList.cancel()
  }

  onChange = (e) => {
    const { onChangeInputValue } = this.props
    this.setState({ inputValue: e.target.value })
    onChangeInputValue(e.target.value)
  }

  getMovieList = debounce((str, currentPage) => {
    if (!str) return
    this.goLoad()
    this.api
      .getMovies(str, currentPage)
      .then((result) =>
        this.setState({
          movieDate: result.results,
          totalMovies: result.total_results,
          load: false,
          error: null,
        })
      )
      .catch((e) => this.setState({ error: e, load: false }))
  }, 800)

  onPaginationChange = (currentPage) => {
    this.setState({ currentPage })
    const { onChangeCurrentPage } = this.props
    onChangeCurrentPage(currentPage, true)
  }

  goLoad() {
    this.setState({ load: true })
  }

  render() {
    const { movieDate, load, error, totalMovies, currentPage, inputValue } = this.state
    return (
      <main className="movie-page">
        <Input className="movie-page__input" ref={this.input} value={inputValue} onChange={this.onChange} />
        {load ? <Spin className="movie-page__spin" size="large" /> : null}
        {error ? <Alert message={error.message} type="error" showIcon /> : null}
        <MovieList movies={movieDate} />
        <Pagination
          className="movie-page__pagination"
          total={totalMovies}
          current={currentPage}
          pageSize={20}
          size="small"
          hideOnSinglePage
          showSizeChanger={false}
          onChange={this.onPaginationChange}
        />
      </main>
    )
  }
}
