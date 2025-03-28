package com.cooksys.groupfinal.controllers;

import java.util.Set;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cooksys.groupfinal.dtos.BasicUserDto;
import com.cooksys.groupfinal.dtos.CredentialsDto;
import com.cooksys.groupfinal.dtos.FullUserDto;
import com.cooksys.groupfinal.dtos.TeamDto;
import com.cooksys.groupfinal.dtos.UserRequestDto;
import com.cooksys.groupfinal.services.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins="*")
@RequiredArgsConstructor
public class UserController {
	
	private final UserService userService;
	
	@PostMapping("/login")
	@CrossOrigin(origins="*")
    public FullUserDto login(@RequestBody CredentialsDto credentialsDto) {
        return userService.login(credentialsDto);
    }
	
	//create new user
	@PostMapping
	@CrossOrigin(origins="*")
    public BasicUserDto addUser(@RequestBody UserRequestDto userRequestDto) {
        return userService.addUser(userRequestDto);
    }
	
	// Get all teams by user ID.
	@GetMapping("/{userId}/teams")
	@CrossOrigin(origins="*")
	public Set<TeamDto> getTeamsByUserId(@PathVariable Long userId){
		return userService.getTeamsByUserId(userId);
	}

}
