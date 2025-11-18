package com.javaprogramming.javaproject05.repository;

import com.javaprogramming.javaproject05.entity.BrainstormComment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BrainstormCommentRepository extends JpaRepository<BrainstormComment, Long>{
	List<BrainstormComment> findBySpaceId(Long spaceId);
}