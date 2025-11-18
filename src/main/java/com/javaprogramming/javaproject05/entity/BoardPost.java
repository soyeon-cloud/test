package com.javaprogramming.javaproject05.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="board_post")
public class BoardPost{
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	private Long boardId;
	private Long userId;
	private String title;
	
	@Column(length=2000)
	private String content;
	
	private LocalDateTime createdAt=LocalDateTime.now();
	
	public BoardPost() {}
	
	public BoardPost(Long boardId, Long userId, String title, String content) {
		this.boardId=boardId;
		this.userId=userId;
		this.title=title;
		this.content=content;
	}
	
	public Long getId() {return id;}
	public void setId(Long id) {this.id=id;}
	
	public Long getBoardId() {return boardId;}
	public void setBoardId(Long boardId) {this.boardId=boardId;}
	
	public Long getUserId() {return userId;}
	public void setUserId(Long userId) {this.userId=userId;}
	
	public String getTitle() {return title;}
	public void setTitle(String title) {this.title=title;}
	
	public String getContent() {return content;}
	public void setContent(String content) {this.content=content;}
	
	public LocalDateTime getCreatedAt() {return createdAt;}
	public void setCreatedAt(LocalDateTime createdAt) {this.createdAt=createdAt;}
}