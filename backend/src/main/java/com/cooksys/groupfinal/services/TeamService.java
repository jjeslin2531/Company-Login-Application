package com.cooksys.groupfinal.services;

import com.cooksys.groupfinal.dtos.TeamDto;

public interface TeamService {

	TeamDto createNewTeam(TeamDto teamDto);

	TeamDto editTeam(TeamDto teamDto, long id);

	TeamDto deleteTeam(long id);

}
