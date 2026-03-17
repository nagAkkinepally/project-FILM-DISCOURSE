package com.filmdiscourse.repository;

import com.filmdiscourse.entity.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long>, JpaSpecificationExecutor<Movie> {

    Page<Movie> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    Page<Movie> findByGenreIgnoreCase(String genre, Pageable pageable);

    Page<Movie> findByReleaseYear(Integer releaseYear, Pageable pageable);

    @Query("SELECT m FROM Movie m WHERE " +
           "(:title IS NULL OR LOWER(m.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:genre IS NULL OR LOWER(m.genre) = LOWER(:genre)) AND " +
           "(:releaseYear IS NULL OR m.releaseYear = :releaseYear)")
    Page<Movie> findByFilters(
            @Param("title") String title,
            @Param("genre") String genre,
            @Param("releaseYear") Integer releaseYear,
            Pageable pageable
    );

    @Query("SELECT DISTINCT m.genre FROM Movie m ORDER BY m.genre")
    List<String> findAllGenres();

    @Query("SELECT m FROM Movie m ORDER BY m.averageRating DESC")
    Page<Movie> findTopRatedMovies(Pageable pageable);

    @Query("SELECT m FROM Movie m WHERE m.genre = :genre AND m.id != :movieId ORDER BY m.averageRating DESC")
    List<Movie> findSimilarMovies(@Param("genre") String genre, @Param("movieId") Long movieId, Pageable pageable);
}
