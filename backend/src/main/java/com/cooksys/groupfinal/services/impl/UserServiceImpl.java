package com.cooksys.groupfinal.services.impl;

import java.util.Optional;
import java.util.Set;

import javax.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;

import com.cooksys.groupfinal.dtos.BasicUserDto;
import com.cooksys.groupfinal.dtos.CredentialsDto;
import com.cooksys.groupfinal.dtos.FullUserDto;
import com.cooksys.groupfinal.dtos.TeamDto;
import com.cooksys.groupfinal.dtos.UserRequestDto;
import com.cooksys.groupfinal.dtos.UserResponseDto;
import com.cooksys.groupfinal.entities.Company;
import com.cooksys.groupfinal.entities.Credentials;
import com.cooksys.groupfinal.entities.Team;
import com.cooksys.groupfinal.entities.Profile;
import com.cooksys.groupfinal.entities.User;
import com.cooksys.groupfinal.exceptions.BadRequestException;
import com.cooksys.groupfinal.exceptions.NotAuthorizedException;
import com.cooksys.groupfinal.exceptions.NotFoundException;
import com.cooksys.groupfinal.mappers.CredentialsMapper;
import com.cooksys.groupfinal.mappers.FullUserMapper;
import com.cooksys.groupfinal.mappers.TeamMapper;
import com.cooksys.groupfinal.repositories.CompanyRepository;
import com.cooksys.groupfinal.repositories.UserRepository;
import com.cooksys.groupfinal.services.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
	
	private final UserRepository userRepository;
	private final FullUserMapper fullUserMapper;
	private final CredentialsMapper credentialsMapper;
	private final TeamMapper teamMapper;
	private final CompanyRepository companyRepository; 
	
	private User findUser(String username) {
        Optional<User> user = userRepository.findByCredentialsUsernameAndActiveTrue(username);
        if (user.isEmpty()) {
            throw new NotFoundException("The username provided does not belong to an active user.");
        }
        return user.get();
    }
	
	@Override
	public FullUserDto login(CredentialsDto credentialsDto) {
		if (credentialsDto == null || credentialsDto.getUsername() == null || credentialsDto.getPassword() == null) {
            throw new BadRequestException("A username and password are required.");
        }
        Credentials credentialsToValidate = credentialsMapper.dtoToEntity(credentialsDto);
        User userToValidate = findUser(credentialsDto.getUsername());
        if (!userToValidate.getCredentials().equals(credentialsToValidate)) {
            throw new NotAuthorizedException("The provided credentials are invalid.");
        }
        if (userToValidate.getStatus().equals("PENDING")) {
        	userToValidate.setStatus("JOINED");
        	userRepository.saveAndFlush(userToValidate);
        }
        return fullUserMapper.entityToFullUserDto(userToValidate);
	}

	@Override
	public BasicUserDto addUser(UserRequestDto userRequestDto) {
		
		if (userRequestDto == null || userRequestDto.getCredentials() == null || userRequestDto.getProfile() == null ) {
            throw new BadRequestException("Credentials and profile are required.");
        }
		
		Credentials credentials = new Credentials();
		credentials.setUsername(userRequestDto.getCredentials().getUsername());
		credentials.setPassword(userRequestDto.getCredentials().getPassword());
		
		Profile profile = new Profile();
		profile.setFirstName(userRequestDto.getProfile().getFirstName());
		profile.setLastName(userRequestDto.getProfile().getLastName());
		profile.setEmail(userRequestDto.getProfile().getEmail());
		profile.setPhone(userRequestDto.getProfile().getPhone());
		
		
		User user = new User();
		user.setCredentials(credentials);
		user.setProfile(profile);
		user.setAdmin(userRequestDto.isAdmin());
		user.setStatus("PENDING");
		user.setActive(true);
		
	    if (userRequestDto.getCompanyId() != null) {
            Company company = companyRepository.findById(userRequestDto.getCompanyId())
                .orElseThrow(() -> new EntityNotFoundException("Company not found"));
            
      
            user.getCompanies().add(company);
            company.getEmployees().add(user);
        }
		
		userRepository.save(user);
		
		return fullUserMapper.entitytoBasicUserDto(user);
	}

	@Override
	public Set<TeamDto> getTeamsByUserId(Long userId) {
		// Look for user by userId in the database.
		User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("User not found with ID: " + userId));
		
		// Get the teams that user is a member of.
		Set<Team> teams = user.getTeams();
		
		// Convert entity to DTO and return.
		return teamMapper.entitiesToDtos(teams);
	}
	
}
