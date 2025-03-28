package com.cooksys.groupfinal.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.cooksys.groupfinal.dtos.TeamDto;
import com.cooksys.groupfinal.services.TeamService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/team")
@CrossOrigin(origins="http://localhost:4200")
@RequiredArgsConstructor
public class TeamController {
	
	private final TeamService teamService;
	
	//Create new team: has team name, descriptions, members
	@PostMapping
	//@CrossOrigin(origins="*")
    public TeamDto createNewTeam(@RequestBody TeamDto teamDto) {
        return teamService.createNewTeam(teamDto);
    }
	
	//Edit existing Teams: edit team, descriptions, members
	@PatchMapping("/{id}")
	//@CrossOrigin(origins="*")
    public TeamDto editTeam(@RequestBody TeamDto teamDto, @PathVariable long id) {
        return teamService.editTeam(teamDto,id);
    }
	
	@DeleteMapping("/{id}")
	//@CrossOrigin(origins="*")
	public TeamDto deleteTeam(@PathVariable long id) {
        return teamService.deleteTeam(id);
    }


}
