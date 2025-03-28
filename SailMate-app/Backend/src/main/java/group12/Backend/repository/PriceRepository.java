package group12.Backend.repository;

import group12.Backend.entity.Price;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PriceRepository extends JpaRepository<Price, Integer> {
    
    // Find price by class name
    Optional<Price> findByClassName(String className);
}