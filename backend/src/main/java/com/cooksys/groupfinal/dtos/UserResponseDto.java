package com.cooksys.groupfinal.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class UserResponseDto {
	
	private CredentialsDto credentials;

    private ProfileDto profile;
    
    private boolean admin;
    
    private boolean active;
    
    private String status;

}
