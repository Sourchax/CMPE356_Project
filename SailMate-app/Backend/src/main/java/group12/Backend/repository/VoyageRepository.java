package group12.Backend.repository;

import group12.Backend.entity.Voyage;
import group12.Backend.entity.VoyageTemplate;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface VoyageRepository extends JpaRepository<Voyage, Integer> {
    
    // Find all voyages for a specific template
    List<Voyage> findByTemplate(VoyageTemplate template);
    
    // Find voyages by departure date range
    List<Voyage> findByDepartureDateBetween(LocalDate startDate, LocalDate endDate);
    
    // Find voyages by from station and to station
    List<Voyage> findByFromStation_IdAndToStation_Id(Integer fromStationId, Integer toStationId);
    
    // Find voyages by from station, to station and departure date
    List<Voyage> findByFromStation_IdAndToStation_IdAndDepartureDate(
        Integer fromStationId, Integer toStationId, LocalDate departureDate);
    
    // Find voyages by template and departure date range
    List<Voyage> findByTemplateAndDepartureDateBetween(
        VoyageTemplate template, LocalDate startDate, LocalDate endDate);
    
    // Find future voyages (from today onwards)
    @Query("SELECT v FROM Voyage v WHERE v.departureDate >= CURRENT_DATE ORDER BY v.departureDate, v.departureTime")
    List<Voyage> findAllFutureVoyages();
    
    // Find non-modified voyages by template and departure date range
    @Query("SELECT v FROM Voyage v WHERE v.template = :template AND v.departureDate >= :startDate AND v.isModified = false")
    List<Voyage> findUnmodifiedVoyagesByTemplateFromDate(
        @Param("template") VoyageTemplate template, @Param("startDate") LocalDate startDate);
    
    // Find the furthest scheduled voyage date
    @Query("SELECT MAX(v.departureDate) FROM Voyage v")
    LocalDate findFurthestScheduledDate();
    
    // Find voyages with available seats
    @Query("SELECT v FROM Voyage v WHERE v.departureDate >= CURRENT_DATE " +
           "AND (v.businessSeats > 0 OR v.promoSeats > 0 OR v.economySeats > 0) " +
           "AND v.status = 'active' " +
           "ORDER BY v.departureDate, v.departureTime")
    List<Voyage> findAvailableVoyages();
    
    // Count voyages by template
    long countByTemplate(VoyageTemplate template);
}