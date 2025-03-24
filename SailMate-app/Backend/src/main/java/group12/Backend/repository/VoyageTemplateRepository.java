package group12.Backend.repository;

import group12.Backend.entity.VoyageTemplate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VoyageTemplateRepository extends JpaRepository<VoyageTemplate, Integer> {
    
    // Find all active templates
    List<VoyageTemplate> findByIsActiveTrue();
    
    // Find templates by day of week
    List<VoyageTemplate> findByDayOfWeekAndIsActiveTrue(Integer dayOfWeek);
    
    // Find templates by from station and to station
    List<VoyageTemplate> findByFromStation_IdAndToStation_IdAndIsActiveTrue(
        Integer fromStationId, Integer toStationId);
    
    // Find templates by from station, to station and day of week
    List<VoyageTemplate> findByFromStation_IdAndToStation_IdAndDayOfWeekAndIsActiveTrue(
        Integer fromStationId, Integer toStationId, Integer dayOfWeek);
}