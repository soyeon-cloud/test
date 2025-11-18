package com.javaprogramming.javaproject05.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "brainstorm_comment")
public class BrainstormComment{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private Long spaceId;
	private Long userId;
	
	@Column(length = 1000)
	private String content;
	
	private LocalDateTime createdAt=LocalDateTime.now();
	
	public BrainstormComment() {}
	
	public BrainstormComment(Long spaceId, Long userId, String content) {
		this.spaceId=spaceId;
		this.userId=userId;
		this.content=content;
	}
	
	public Long getId() {return id;}
	public void setId(Long id) {this.id=id;}
	
	public Long getSpaceId() {return spaceId;}
	public void setSpaceId(Long spaceId) {this.spaceId=spaceId;}
	
	public Long getUserId() {return userId;}
	public void setUserId(Long userId) {this.userId=userId;}
	
	public String getContent() {return content;}
	public void setContent(String content) {this.content=content;}
	
	public LocalDateTime getCreatedAt() {return createdAt;}
	public void SetCreatedAt(LocalDateTime createdAt) {this.createdAt=createdAt;}
}