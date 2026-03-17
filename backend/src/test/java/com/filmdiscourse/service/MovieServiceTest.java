package com.filmdiscourse.service;

import com.filmdiscourse.dto.request.MovieRequest;
import com.filmdiscourse.dto.response.MovieResponse;
import com.filmdiscourse.entity.Movie;
import com.filmdiscourse.entity.User;
import com.filmdiscourse.exception.ResourceNotFoundException;
import com.filmdiscourse.repository.MovieRepository;
import com.filmdiscourse.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MovieServiceTest {

    @Mock
    private MovieRepository movieRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private MovieService movieService;

    private Movie testMovie;
    private User testUser;
    private MovieRequest movieRequest;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(1L).username("testuser").build();

        testMovie = Movie.builder()
                .id(1L)
                .title("Inception")
                .description("A mind-bending thriller")
                .releaseYear(2010)
                .genre("Sci-Fi")
                .director("Christopher Nolan")
                .averageRating(4.8)
                .totalReviews(100)
                .createdBy(testUser)
                .build();

        movieRequest = new MovieRequest();
        movieRequest.setTitle("Inception");
        movieRequest.setDescription("A mind-bending thriller");
        movieRequest.setReleaseYear(2010);
        movieRequest.setGenre("Sci-Fi");
        movieRequest.setDirector("Christopher Nolan");
    }

    @Test
    void createMovie_Success() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(movieRepository.save(any(Movie.class))).thenReturn(testMovie);

        MovieResponse result = movieService.createMovie(movieRequest, "testuser");

        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("Inception");
        assertThat(result.getGenre()).isEqualTo("Sci-Fi");
    }

    @Test
    void getMovieById_NotFound_ThrowsException() {
        when(movieRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> movieService.getMovieById(999L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getAllMovies_ReturnsPaginatedResults() {
        Page<Movie> moviePage = new PageImpl<>(List.of(testMovie));
        when(movieRepository.findAll(any(PageRequest.class))).thenReturn(moviePage);

        Page<MovieResponse> result = movieService.getAllMovies(PageRequest.of(0, 10));

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Inception");
    }

    @Test
    void deleteMovie_Success() {
        when(movieRepository.findById(1L)).thenReturn(Optional.of(testMovie));
        doNothing().when(movieRepository).delete(testMovie);

        movieService.deleteMovie(1L);

        verify(movieRepository).delete(testMovie);
    }

    @Test
    void getAllGenres_ReturnsList() {
        when(movieRepository.findAllGenres()).thenReturn(List.of("Action", "Drama", "Sci-Fi"));

        List<String> genres = movieService.getAllGenres();

        assertThat(genres).containsExactly("Action", "Drama", "Sci-Fi");
    }
}
