package com.javaprogramming.javaproject05.service;

import com.javaprogramming.javaproject05.entity.MajorBoard;
import com.javaprogramming.javaproject05.entity.BoardPost;
import com.javaprogramming.javaproject05.repository.MajorBoardRepository;
import com.javaprogramming.javaproject05.repository.BoardPostRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class BoardService {
	
	private final MajorBoardRepository boardRepository;
	private final BoardPostRepository postRepository;
	
	public BoardService(MajorBoardRepository boardRepository, BoardPostRepository postRepository) {
		this.boardRepository=boardRepository;
		this.postRepository=postRepository;
	}
	
	public List<MajorBoard> getAllBoards() {
		return boardRepository.findAll();
	}
	
	public MajorBoard createBoard(MajorBoard board) {
		return boardRepository.save(board);
	}
	
	public Optional<MajorBoard> getBoard(Long id) {
		return boardRepository.findById(id);
	}
	
	public List<BoardPost> getPostsByBoard(Long boardId) {
		return postRepository.findByBoardId(boardId);
	}
	
	public Optional<BoardPost> getPost(Long id) {
		return postRepository.findById(id);
	}
	
	public BoardPost createPost(BoardPost post) {
		return postRepository.save(post);
	}
	
	public List<BoardPost> searchPostsByTitle(String keyword){
		return postRepository.findByTitleContaining(keyword);
	}
	
	public void deletePost(Long id) {
		postRepository.deleteById(id);
	}
}