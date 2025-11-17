package com.javaprogramming.javaproject05.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "brainstorm_space")
public class BrainstormSpace{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private Long teamId;
	private String title;
	private String description;
	private LocalDateTime createdAt = LocalDateTime.now();
	
	public BrainstormSpace() {}
	
	public BrainstormSpace(Long teamId, String title, String description) {
		this.teamId=teamId;
		this.title=title;
		this.description=description;
	}
	
	public Long getId() {return id;}
	public void setId(Long id) {this.id=id;}
	
	public Long getTeamId() {return teamId;}
	public void setTeamId(Long teamId) {this.teamId=teamId;}
	
	public String getTitle() {return title;}
	public void setTitle(String title) {this.title=title;}
	
	public String getDescription() {return description;}
	public void setDescription(String description) {this.description=description;}
	
	public LocalDateTime getCreatedAt() {return createdAt;}
	public void setCreatedAt(LocalDateTime createdAt) {this.createdAt=createdAt;}
}