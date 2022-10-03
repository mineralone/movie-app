import React, { Component } from 'react'
import { Input, Spin, Alert, Pagination } from 'antd'
import { debounce } from 'lodash'
import './search.css'

import List from '../list'
import Api from '../../api'

export default class Seacrh extends Component {
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
      this.getMovieList(savedInputSearch.toString(), savedCurrentPage.seacrhPage)
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
    const { onChangeInputValue, onChangeCurrentPage } = this.props
    this.setState({ inputValue: e.target.value, currentPage: 1 })
    onChangeInputValue(e.target.value)
    onChangeCurrentPage(1, true)
  }

  getMovieList = debounce((str, currentPage) => {
    if (!str) return
    this.goLoad()
    this.api
      .getMovies(str, currentPage)
      .then((result) => {
        if (result.results.length !== 0) {
          this.setState({
            movieDate: result.results,
            totalMovies: result.total_results,
            load: false,
            error: null,
          })
        } else throw new Error('no content')
      })
      .catch((e) => this.setState({ error: e, load: false, currentPage: 1 }))
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
    const body = (
      <>
        <List movies={movieDate} />
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
      </>
    )

    return (
      <main className="movie-page">
        <Input className="movie-page__input" ref={this.input} value={inputValue} onChange={this.onChange} />
        {load ? <Spin className="movie-page__spin" size="large" /> : null}
        {error ? <Alert message={error.message} type="error" showIcon /> : { ...body }}
      </main>
    )
  }
}
