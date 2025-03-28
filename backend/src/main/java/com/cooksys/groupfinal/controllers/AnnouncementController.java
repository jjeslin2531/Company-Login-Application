package com.cooksys.groupfinal.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cooksys.groupfinal.dtos.AnnouncementDto;
import com.cooksys.groupfinal.services.AnnouncementService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/announcements")
@CrossOrigin(origins="*")
@RequiredArgsConstructor
public class AnnouncementController {
	
	private final AnnouncementService announcementService;
	
	
	//Create new announcement: has title and message 
	@PostMapping
	@CrossOrigin(origins="*")
    public AnnouncementDto createNewAnnouncement(@RequestBody AnnouncementDto announcementDto) {
        return announcementService.createNewAnnouncement(announcementDto);
    }
	
	//Edit existing announcements: edit title and message
	@PatchMapping("/{id}")
	@CrossOrigin(origins="*")
    public AnnouncementDto editAnnouncement(@RequestBody AnnouncementDto announcementDto, @PathVariable long id) {
        return announcementService.editAnnouncement(announcementDto,id);
    }
	
	//Delete announcement
	@DeleteMapping("/{id}")
	@CrossOrigin(origins="*")
    public AnnouncementDto deleteAnnouncement(@PathVariable long id) {
		return announcementService.deleteAnnouncement(id);
    }
	
}
