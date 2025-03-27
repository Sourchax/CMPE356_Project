package group12.Backend.repository;

import group12.Backend.entity.Voyage;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface VoyageRepository extends JpaRepository<Voyage, Integer> {
    
    // Find voyages by departure date range
    List<Voyage> findByDepartureDateBetween(LocalDate startDate, LocalDate endDate);
    
    // Find voyages by from station and to station
    List<Voyage> findByFromStation_IdAndToStation_Id(Integer fromStationId, Integer toStationId);
    
    // Find voyages by from station, to station and departure date
    List<Voyage> findByFromStation_IdAndToStation_IdAndDepartureDate(
        Integer fromStationId, Integer toStationId, LocalDate departureDate);
    
    // Find voyages by departure station
    List<Voyage> findByFromStation_Id(Integer stationId);
    
    // Find voyages by arrival station
    List<Voyage> findByToStation_Id(Integer stationId);
    
    // Find voyages that depart from or arrive at a station
    @Query("SELECT v FROM Voyage v WHERE v.fromStation.id = :stationId OR v.toStation.id = :stationId")
    List<Voyage> findByStationId(@Param("stationId") Integer stationId);
    
    // Find future voyages (from today onwards)
    @Query("SELECT v FROM Voyage v WHERE v.departureDate >= CURRENT_DATE ORDER BY v.departureDate, v.departureTime")
    List<Voyage> findAllFutureVoyages();
    
    // Find active future voyages
    @Query("SELECT v FROM Voyage v WHERE v.departureDate >= CURRENT_DATE AND v.status = 'active' ORDER BY v.departureDate, v.departureTime")
    List<Voyage> findActiveFutureVoyages();
    
    // Find the furthest scheduled voyage date
    @Query("SELECT MAX(v.departureDate) FROM Voyage v WHERE v.status = 'active'")
    LocalDate findFurthestScheduledDate();
    
    // Find voyages with available seats
    @Query("SELECT v FROM Voyage v WHERE v.departureDate >= CURRENT_DATE " +
           "AND (v.businessSeats > 0 OR v.promoSeats > 0 OR v.economySeats > 0) " +
           "AND v.status = 'active' " +
           "ORDER BY v.departureDate, v.departureTime")
    List<Voyage> findAvailableVoyages();
    
    // Find voyages by status and departure date range
    List<Voyage> findByStatusAndDepartureDateBetween(
        Voyage.VoyageStatus status, LocalDate startDate, LocalDate endDate);
    
    // Count voyages by status
    int countByStatus(Voyage.VoyageStatus status);
    
    // Cancel voyages by route and date range
    @Query("UPDATE Voyage v SET v.status = 'cancel' WHERE v.fromStation.id = :fromId AND v.toStation.id = :toId " +
           "AND v.departureDate BETWEEN :startDate AND :endDate AND v.status = 'active'")
    int cancelVoyagesByRoute(
        @Param("fromId") Integer fromStationId, 
        @Param("toId") Integer toStationId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate);
}