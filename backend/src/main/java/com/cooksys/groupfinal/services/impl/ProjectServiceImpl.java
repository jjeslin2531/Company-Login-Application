package com.cooksys.groupfinal.services.impl;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.cooksys.groupfinal.dtos.ProjectDto;
import com.cooksys.groupfinal.entities.Project;
import com.cooksys.groupfinal.entities.Team;
import com.cooksys.groupfinal.exceptions.BadRequestException;
import com.cooksys.groupfinal.exceptions.NotFoundException;
import com.cooksys.groupfinal.mappers.ProjectMapper;
import com.cooksys.groupfinal.repositories.ProjectRepository;
import com.cooksys.groupfinal.repositories.TeamRepository;
import com.cooksys.groupfinal.services.ProjectService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {
	
	private final ProjectMapper projectMapper;
	private final ProjectRepository projectRepository;
	
	private final TeamRepository teamRepository;
	
	@Override
	public ProjectDto createProject(ProjectDto projectDto) {
		
		
		if (projectDto.getName() == null || projectDto.getName().isEmpty()) {
			throw new BadRequestException("Project name is required.");
		}
		
		if (projectDto.getDescription() == null || projectDto.getDescription().isEmpty()) {
			throw new BadRequestException("Project Description is required.");
		}
		
		Optional<Team> team = teamRepository.findById(projectDto.getTeam().getId());
		
		Project project = new Project();
		project.setName(projectDto.getName());
		project.setDescription(projectDto.getDescription());
		project.setActive(true);
		project.setTeam(team.get());
		
		projectRepository.save(project);
		
		return projectMapper.entityToDto(project);
	}

	@Override
	public ProjectDto editProject(ProjectDto projectDto, long id) {
		
		Optional<Project> foundProject = projectRepository.findById(id);
		
		if(!foundProject.isPresent() || projectDto.getName() == null || projectDto.getDescription() == null)
		{
			throw new NotFoundException("Cannot find Id");
		}
		
		String name = projectDto.getName();
		String description = projectDto.getDescription();
		
		Project project = foundProject.get();
		
		project.setName(name);
		project.setDescription(description);
		project.setActive(projectDto.isActive());
		
		projectRepository.save(project);
		
		return projectMapper.entityToDto(project);
	}

	@Override
	public ProjectDto deleteProject(long id) {
		
		Optional<Project> foundProject = projectRepository.findById(id);
		
		if(!foundProject.isPresent())
		{
			throw new NotFoundException("Cannot find Id");
		}
		
		Project project = foundProject.get();
		
		projectRepository.delete(project);
		
		return projectMapper.entityToDto(project);
	}

}
