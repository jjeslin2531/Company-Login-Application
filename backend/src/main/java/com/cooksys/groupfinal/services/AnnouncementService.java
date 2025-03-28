package com.cooksys.groupfinal.services;

import com.cooksys.groupfinal.dtos.AnnouncementDto;

public interface AnnouncementService {

	AnnouncementDto createNewAnnouncement(AnnouncementDto announcementDto);

	AnnouncementDto editAnnouncement(AnnouncementDto announcementDto, long id);

	AnnouncementDto deleteAnnouncement(long id);


}
