package com.javaprogramming.javaproject05.controller;

import com.javaprogramming.javaproject05.entity.MajorBoard;
import com.javaprogramming.javaproject05.entity.BoardPost;
import com.javaprogramming.javaproject05.service.BoardService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/boards")
@CrossOrigin(origins="*")

public class BoardController {
	
	private final BoardService boardService;
	
	public BoardController(BoardService boardService) {
		this.boardService=boardService;
	}
	
	@GetMapping
	public List<MajorBoard> getAllBoards(){
		return boardService.getAllBoards();
	}
	
	@PostMapping
	public MajorBoard createBoard(@RequestBody MajorBoard board) {
		return boardService.createBoard(board);
	}
	
	@GetMapping("/{boardId}")
	public Optional<MajorBoard> getBoard(@PathVariable Long boardId) {
		return boardService.getBoard(boardId);
	}
	
	@GetMapping("/{boardId}/posts")
	public List<BoardPost> getPostsByBoard(@PathVariable Long boardId) {
		return boardService.getPostsByBoard(boardId);
	}
	
	@GetMapping("/posts/{postId}")
	public Optional<BoardPost> getPost(@PathVariable Long postId){
		return boardService.getPost(postId);
	}
	
	@PostMapping("/posts")
	public BoardPost createPost(@RequestBody BoardPost post) {
		return boardService.createPost(post);
	}
	
	@GetMapping("/posts/search")
	public List<BoardPost> searchPostsTitle(@RequestParam("keyword") String keyword) {
		return boardService.searchPostsByTitle(keyword);
	}
	
	@DeleteMapping("/posts/{postId}")
	public void deletePost(@PathVariable Long postId) {
		boardService.deletePost(postId);
	}
}