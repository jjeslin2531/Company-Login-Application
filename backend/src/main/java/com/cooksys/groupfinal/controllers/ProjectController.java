package com.cooksys.groupfinal.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cooksys.groupfinal.dtos.ProjectDto;
import com.cooksys.groupfinal.services.ProjectService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/projects")
@CrossOrigin(origins="*")
@RequiredArgsConstructor
public class ProjectController {
	
	private final ProjectService projectService;
	
	//create project: name & description
	@PostMapping
	public ProjectDto createProject(@RequestBody ProjectDto projectDto) {
		return projectService.createProject(projectDto);
	}
	
	//edit project: name & description
	@PatchMapping("/{id}")
	public ProjectDto editProject(@RequestBody ProjectDto projectDto,@PathVariable long id) {
		return projectService.editProject(projectDto,id);
	}
	
	//Delete project
	@DeleteMapping("/{id}")
	public ProjectDto deleteProject(@PathVariable long id) {
		return projectService.deleteProject(id);
	}
}
