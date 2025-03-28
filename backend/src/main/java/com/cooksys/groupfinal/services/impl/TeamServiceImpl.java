package com.cooksys.groupfinal.services.impl;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.cooksys.groupfinal.dtos.BasicUserDto;
import com.cooksys.groupfinal.dtos.TeamDto;
import com.cooksys.groupfinal.entities.Company;
import com.cooksys.groupfinal.entities.Project;
import com.cooksys.groupfinal.entities.Team;
import com.cooksys.groupfinal.entities.User;
import com.cooksys.groupfinal.exceptions.BadRequestException;
import com.cooksys.groupfinal.exceptions.NotFoundException;
import com.cooksys.groupfinal.mappers.TeamMapper;
import com.cooksys.groupfinal.repositories.ProjectRepository;
import com.cooksys.groupfinal.repositories.TeamRepository;
import com.cooksys.groupfinal.repositories.UserRepository;
import com.cooksys.groupfinal.services.TeamService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService {
	private final UserRepository userRepository;
	private final TeamRepository teamRepository;
	private final ProjectRepository projectRepository;
	private final TeamMapper teamMapper;

	@Override
	public TeamDto createNewTeam(TeamDto teamDto) {
		// Make sure the team has a name.
		if (teamDto.getName() == null || teamDto.getName().isEmpty()) {
			throw new BadRequestException("Team name is required.");
		}

		// Create a new empty Team object.
		Team team = new Team();
		team.setName(teamDto.getName());
		team.setDescription(teamDto.getDescription());

		// Prepare a set to hold teammate User entities.
		Set<User> teammates = new HashSet<>();

		// If teammates were passed in the DTO, look them up by ID.
		if (teamDto.getTeammates() != null) {
			for (BasicUserDto teammateDto : teamDto.getTeammates()) {
				User user = userRepository.findById(teammateDto.getId())
						.orElseThrow(() -> new NotFoundException("User not found with ID: " + teammateDto.getId()));
				teammates.add(user);
			}
		}

		// Add those users to the team.
		team.setTeammates(teammates);

		// Use the first teammate to figure out the company.
		if (!teammates.isEmpty()) {
			User firstTeammate = teammates.iterator().next(); // just grabs one teammate
			Set<Company> companies = firstTeammate.getCompanies();

			if (companies == null || companies.isEmpty()) {
				throw new BadRequestException("Teammate is not assigned to any company.");
			}

			// Pick the first company found and assign it to the team.
			for (Company c : companies) {
				team.setCompany(c);
				break;
			}
		}

		// Save the team to the database.
		Team savedTeam = teamRepository.save(team);

		// Convert the saved team into a TeamDto and return it.
		return teamMapper.entityToDto(savedTeam);
	}

	@Override
	public TeamDto editTeam(TeamDto teamDto, long id) {
		Optional<Team> found = teamRepository.findById(id); // Look up by id.

		if (!found.isPresent()) {
			throw new NotFoundException("Team not found.");
		}

		Team team = found.get();

		// Update name and description if provided.
		if (teamDto.getName() != null) {
			team.setName(teamDto.getName());
		}

		if (teamDto.getDescription() != null) {
			team.setDescription(teamDto.getDescription());
		}

		// Update teammates if provided.
		if (teamDto.getTeammates() != null) {
			Set<User> updatedTeammates = new HashSet<>();

			for (BasicUserDto teammateDto : teamDto.getTeammates()) {
				User user = userRepository.findById(teammateDto.getId())// Look up each user by ID.
						.orElseThrow(() -> new NotFoundException("User not found with ID: " + teammateDto.getId()));
				updatedTeammates.add(user);
			}
			
			team.setTeammates(updatedTeammates);// Replace the old teammates wit the new set.
		}
		
		// Save updated team in the database.
		Team saved = teamRepository.saveAndFlush(team);
		
		// Convert saved team to DTO and return.
		return teamMapper.entityToDto(saved);
	}

	@Override
	public TeamDto deleteTeam(long id) {

		Optional<Team> found = teamRepository.findById(id); // Look up by id.
		
		if(!found.isPresent()) {
			throw new NotFoundException("Team not found.");
		}
		
		Team team = found.get();
		
		try {
			  Set<Project> projectsToDelete = new HashSet<>(team.getProjects());
		        
		        for (Project project : projectsToDelete) {
		            // Remove project from team
		            project.setTeam(null);
		            // Delete the project
		            projectRepository.delete(project);
		        }
		        
		        // Clear the projects set
		        team.getProjects().clear();
	   
	
		
        // Manually remove team from users before deletion
        for (User user : team.getTeammates()) {
            // You might need to modify the User entity or use a custom repository method
            // to remove this team from the user's teams
            user.getTeams().remove(team);
            userRepository.save(user);
        }
        
        // Clear teammates
        team.getTeammates().clear();
        
        // Now attempt deletion
        teamRepository.delete(team);
        
        return teamMapper.entityToDto(team);
   		}
		catch (Exception e) {
        // Log the full exception
        e.printStackTrace();
        // Throw a more specific exception
        throw new BadRequestException("Unable to delete team due to existing relationships");
    }
	}

}
