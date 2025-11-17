package com.javaprogramming.javaproject05.controller;

import com.javaprogramming.javaproject05.entity.BrainstormSpace;
import com.javaprogramming.javaproject05.entity.BrainstormComment;
import com.javaprogramming.javaproject05.service.BrainstormService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/brainstorm")
@CrossOrigin(origins="*")
public class BrainstormController {
	
	private final BrainstormService brainstormService;
	
	public BrainstormController(BrainstormService brainstormService) {
		this.brainstormService=brainstormService;
	}
	
	@GetMapping("/spaces/team/{teamId}")
	public List<BrainstormSpace> getSpacesByTeam(@PathVariable Long teamId) {
		return brainstormService.getSpacesByTeam(teamId);
	}
	
	@GetMapping("/spaces/{id}")
	public Optional<BrainstormSpace> getSpace(@PathVariable Long id) {
		return brainstormService.getSpace(id);
	}
	
	@PostMapping("/spaces")
	public BrainstormSpace createSpace(@RequestBody BrainstormSpace space) {
		return brainstormService.createSpace(space);
	}
	
	@DeleteMapping("/spaces/{id}")
	public void deleteSpace(@PathVariable Long id) {
		brainstormService.deleteSpace(id);
	}
	
	@GetMapping("/comments/space/{spaceId}")
	public List<BrainstormComment> getComments(@PathVariable Long spaceId) {
		return brainstormService.getCommentsBySpace(spaceId);
	}
	
	@PostMapping("/comments")
	public BrainstormComment addComment(@RequestBody BrainstormComment comment) {
		return brainstormService.addComment(comment);
	}
	
	@DeleteMapping("/comments/{id}")
	public void deleteComment(@PathVariable Long id) {
		brainstormService.deleteComment(id);
	}
}