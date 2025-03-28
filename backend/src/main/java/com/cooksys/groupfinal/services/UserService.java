package com.cooksys.groupfinal.services;

import java.util.Set;

import com.cooksys.groupfinal.dtos.BasicUserDto;
import com.cooksys.groupfinal.dtos.CredentialsDto;
import com.cooksys.groupfinal.dtos.FullUserDto;
import com.cooksys.groupfinal.dtos.TeamDto;
import com.cooksys.groupfinal.dtos.UserRequestDto;
import com.cooksys.groupfinal.dtos.UserResponseDto;

public interface UserService {

	FullUserDto login(CredentialsDto credentialsDto);

	BasicUserDto addUser(UserRequestDto userRequestDto);

	Set<TeamDto> getTeamsByUserId(Long userId);

}
