package com.javaprogramming.javaproject05.repository;

import com.javaprogramming.javaproject05.entity.MajorBoard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MajorBoardRepository extends JpaRepository<MajorBoard, Long> {
	MajorBoard findByMajorName(String majorName);
}