package com.filmdiscourse.repository;

import com.filmdiscourse.entity.EditHistory;
import com.filmdiscourse.entity.EditHistory.EditStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EditHistoryRepository extends JpaRepository<EditHistory, Long> {

    Page<EditHistory> findByMovieId(Long movieId, Pageable pageable);

    Page<EditHistory> findBySubmittedByIdAndStatus(Long userId, EditStatus status, Pageable pageable);

    Page<EditHistory> findByStatus(EditStatus status, Pageable pageable);

    long countByMovieIdAndStatus(Long movieId, EditStatus status);
}
