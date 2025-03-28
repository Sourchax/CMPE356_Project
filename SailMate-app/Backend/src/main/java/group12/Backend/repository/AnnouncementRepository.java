package group12.Backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import group12.Backend.entity.Announcement;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Integer> {
    
    // Find announcements with titles containing the search term
    List<Announcement> findByTitleContainingIgnoreCase(String title);
}