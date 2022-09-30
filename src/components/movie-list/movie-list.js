import React from 'react'
import { Row, Col } from 'antd'

import './movie-list.css'

import Movie from '../movie'

export default function MovieList({ movies, genresList }) {
  let items
  if (movies) {
    items = movies.map((movie) => {
      const { id, title, overview } = movie
      const path = movie.poster_path
      const release = movie.release_date
      const voteAverage = movie.vote_average
      const genres = movie.genre_ids
      return (
        <Col key={id} className="movie-list__item" xs={24} sm={24} md={24} lg={12}>
          <Movie
            title={title}
            plot={overview}
            release={release}
            id={id}
            path={path}
            voteAverage={voteAverage}
            genresList={genresList}
            genres={genres}
          />
        </Col>
      )
    })
  } else {
    items = undefined
  }
  return (
    <div className="movie-list">
      <Row gutter={[32, 32]}>{items}</Row>
    </div>
  )
}
