package com.cooksys.groupfinal.services;

import com.cooksys.groupfinal.dtos.ProjectDto;

public interface ProjectService {

	ProjectDto createProject(ProjectDto projectDto);

	ProjectDto editProject(ProjectDto projectDto, long id);

	ProjectDto deleteProject(long id);

}
