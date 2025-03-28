package com.cooksys.groupfinal.services.impl;

import java.sql.Timestamp;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.cooksys.groupfinal.dtos.AnnouncementDto;
import com.cooksys.groupfinal.entities.Announcement;
import com.cooksys.groupfinal.entities.Company;
import com.cooksys.groupfinal.entities.User;
import com.cooksys.groupfinal.exceptions.BadRequestException;
import com.cooksys.groupfinal.exceptions.NotFoundException;
import com.cooksys.groupfinal.mappers.AnnouncementMapper;
import com.cooksys.groupfinal.repositories.AnnouncementRepository;
import com.cooksys.groupfinal.repositories.UserRepository;
import com.cooksys.groupfinal.services.AnnouncementService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnnouncementServiceImpl implements AnnouncementService {
	
	private final AnnouncementRepository announcementRepository;
	private final AnnouncementMapper announcementMapper;
	
	private final UserRepository userRepository;
	
	
	@Override
	public AnnouncementDto createNewAnnouncement(AnnouncementDto announcementDto) {
		// Validate required fields for an announcement.
		if (announcementDto.getTitle() == null || announcementDto.getTitle().isEmpty()) {
			throw new BadRequestException("Announcement title is required.");
		}
		
		if (announcementDto.getMessage() == null || announcementDto.getMessage().isEmpty()) {
			throw new BadRequestException("Announcement message is required.");
		}
		
		if (announcementDto.getAuthor() == null || announcementDto.getAuthor().getId() == null) {
			throw new BadRequestException("Author is required to post an announcement.");
		}
		
		// Fetch author from database.
		User author = userRepository.findById(announcementDto.getAuthor().getId()).orElseThrow(() -> new NotFoundException("User not found."));
		
		// Create a new announcement entity.
		Announcement announcementCreated = new Announcement();
		announcementCreated.setTitle(announcementDto.getTitle());
		announcementCreated.setMessage(announcementDto.getMessage());
		announcementCreated.setAuthor(author);
		announcementCreated.setDate(new Timestamp(System.currentTimeMillis()));
		
		
		Set <Company> company = author.getCompanies(); //{FedEx}
		
		if(company == null || company.isEmpty())
		{
			throw new BadRequestException("Author is not assigned to any company.");
		}
		
		//{fedex, google, ..}
		for(Company c : company)
		{
			announcementCreated.setCompany(c);
			break;
		}

		// Save announcement.
		Announcement savedAnnouncement = announcementRepository.save(announcementCreated);
		
		// Return entity back to DTO.
		return announcementMapper.entityToDto(savedAnnouncement);
	}

	@Override
	public AnnouncementDto editAnnouncement(AnnouncementDto announcementDto, long id) {
		
		
		Optional<Announcement> found = announcementRepository.findById(id);
		
		if(!found.isPresent() || announcementDto.getTitle() == null || announcementDto.getMessage() == null)
		{
			throw new NotFoundException("Cannot find Id");
		}
		
		String title = announcementDto.getTitle();
		String message = announcementDto.getMessage();
		
		Announcement announcement = found.get();
		
		announcement.setTitle(title);
		announcement.setMessage(message);
		
		announcementRepository.save(announcement);
		
		return announcementMapper.entityToDto(announcement);
	}

	@Override
	public AnnouncementDto deleteAnnouncement(long id) {
		
		Optional<Announcement> found = announcementRepository.findById(id);
		
		if(!found.isPresent())
		{
			throw new NotFoundException("Cannot find Id");
		}
		
		Announcement announcement = found.get();
		
		announcementRepository.delete(announcement);
		
		return announcementMapper.entityToDto(announcement);
	
	}


}