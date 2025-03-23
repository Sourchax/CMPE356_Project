package group12.Backend.repository;

import group12.Backend.entity.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StationRepository extends JpaRepository<Station, Integer> {
    
    List<Station> findByCity(String city);
    
    List<Station> findByStatus(Station.Status status);
    
    List<Station> findByCityAndStatus(String city, Station.Status status);
}