package com.javaprogramming.javaproject05.service;

import com.javaprogramming.javaproject05.entity.BrainstormSpace;
import com.javaprogramming.javaproject05.entity.BrainstormComment;
import com.javaprogramming.javaproject05.repository.BrainstormSpaceRepository;
import com.javaprogramming.javaproject05.repository.BrainstormCommentRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class BrainstormService {
	
	private final BrainstormSpaceRepository spaceRepository;
	private final BrainstormCommentRepository commentRepository;
	
	public BrainstormService(BrainstormSpaceRepository spaceRepository, BrainstormCommentRepository commentRepository) {
		this.spaceRepository=spaceRepository;
		this.commentRepository=commentRepository;
	}
	
	public List<BrainstormSpace> getSpacesByTeam(Long teamId) {
		return spaceRepository.findByTeamId(teamId);
	}
	
	public Optional<BrainstormSpace> getSpace(Long id){
		return spaceRepository.findById(id);
	}
	
	public BrainstormSpace createSpace(BrainstormSpace space) {
		return spaceRepository.save(space);
	}
	
	public void deleteSpace(Long id) {
		spaceRepository.deleteById(id);
	}
	
	public List<BrainstormComment> getCommentsBySpace(Long spaceId) {
		return commentRepository.findBySpaceId(spaceId);
	}
	
	public BrainstormComment addComment(BrainstormComment comment) {
		return commentRepository.save(comment);
	}
	
	public void deleteComment(Long id) {
		commentRepository.deleteById(id);
	}
}