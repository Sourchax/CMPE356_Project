package group12.Backend.repository;

import group12.Backend.entity.SeatsSold;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SeatsSoldRepository extends JpaRepository<SeatsSold, Integer> {
    
    Optional<SeatsSold> findByVoyageId(Integer voyageId);
    
    boolean existsByVoyageId(Integer voyageId);
    
    void deleteByVoyageId(Integer voyageId);
}