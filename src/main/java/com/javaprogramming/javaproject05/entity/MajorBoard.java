package com.javaprogramming.javaproject05.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "major_board")
public class MajorBoard {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	public String majorName;
	
	public MajorBoard() {}
	
	public MajorBoard(String majorName) {
		this.majorName=majorName;
	}
	
	public Long getId() {return id;}
	public void setId(Long id) {this.id=id;}
	
	public String getMajorName() {return majorName;}
	public void setMajorName(String majorName) {this.majorName=majorName;}
}