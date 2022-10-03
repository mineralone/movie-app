/* eslint-disable no-return-assign */
import React, { Component } from 'react'
import { Card, Typography, Spin, Avatar, Rate } from 'antd'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import Ellipsis from 'ellipsis.js'

import Api from '../../api'
import MovieGenres from '../genres'
import { GenresConsumer } from '../genres-context'

import './movie.css'

import noImage from './no-poster.jpg'

const { Title, Text, Paragraph } = Typography

const getColorVote = (vote) => {
  if (vote <= 3) return '#E90000'
  if (vote <= 5) return '#E97E00'
  if (vote <= 7) return '#E9D100'
  return '#66E900'
}

const ellipsisDefault = {
  debounce: 50,
  break_word: false,
}

export default class Movie extends Component {
  api = new Api()

  state = {
    url: null,
    load: false,
    stars: 0,
  }

  elliplisTitle = Ellipsis({
    ...ellipsisDefault,
    className: '.movie__title',
    lines: 1,
  })

  elliplisPlot = Ellipsis({
    ...ellipsisDefault,
    className: '.movie__plot',
    lines: 4,
  })

  moviePlot = React.createRef()

  movieTitle = React.createRef()

  componentDidMount() {
    this.getPoster()
    this.elliplisPlot.add(this.moviePlot.current)
    this.elliplisTitle.add(this.movieTitle.current)
    const { id } = this.props
    const ratedMoviesStorage = localStorage.getItem('ratedMovies')
    if (ratedMoviesStorage) {
      const ratedMovies = JSON.parse(ratedMoviesStorage)
      if (ratedMovies[id]) {
        this.setState({ stars: ratedMovies[id] })
      }
    }
  }

  getPoster() {
    this.setState({ load: true })
    const { path } = this.props
    if (path !== null) {
      this.api
        .getPoster(path)
        .then((res) => this.setState({ url: res, load: false }))
        .catch(() => this.setState({ url: noImage, load: false }))
    } else {
      this.setState({ url: noImage, load: false })
    }
  }

  onChange = (rating) => {
    const { id } = this.props
    this.setState({ stars: rating })
    this.api.onRateMovie(id, rating).then(() => {
      if (!localStorage.getItem('ratedMovies')) localStorage.setItem('ratedMovies', JSON.stringify({}))
      const ratedMovies = JSON.parse(localStorage.getItem('ratedMovies'))
      ratedMovies[id] = rating
      localStorage.setItem('ratedMovies', JSON.stringify(ratedMovies))
    })
  }

  render() {
    const { title, id, plot, release, voteAverage, genres } = this.props
    const { load, url, stars } = this.state
    return (
      <Card
        key={id}
        className="movie"
        cover={load ? <Spin className="movie__spin" /> : <img className="movie__poster" src={url} alt="movie-poster" />}
      >
        <Avatar
          className="movie__vote-average"
          size={30}
          style={{
            borderColor: getColorVote(voteAverage),
          }}
        >
          {voteAverage}
        </Avatar>
        <Title className="movie__title" ref={this.movieTitle}>
          {title}
        </Title>
        <GenresConsumer>{(genresList) => <MovieGenres genres={genres} genresList={genresList} />}</GenresConsumer>
        <Text className="movie__date-release">
          {release ? format(parseISO(release), 'MMMM d, y') : 'Month day, Year'}
        </Text>
        <Paragraph className="movie__plot" ref={this.moviePlot}>
          {plot || 'No description'}
        </Paragraph>
        <Rate className="movie__rate" allowHalf value={stars} onChange={this.onChange} count={10} allowClear={false} />
      </Card>
    )
  }
}
