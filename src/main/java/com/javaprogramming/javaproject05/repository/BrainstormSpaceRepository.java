package com.javaprogramming.javaproject05.repository;

import com.javaprogramming.javaproject05.entity.BrainstormSpace;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BrainstormSpaceRepository extends JpaRepository<BrainstormSpace, Long> {
	List<BrainstormSpace> findByTeamId(Long teamId);
}