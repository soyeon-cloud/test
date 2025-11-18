package com.javaprogramming.javaproject05.repository;

import com.javaprogramming.javaproject05.entity.BoardPost;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BoardPostRepository extends JpaRepository<BoardPost, Long>{
	List<BoardPost> findByBoardId(Long boardId);
	List<BoardPost> findByTitleContaining(String keyword);
}