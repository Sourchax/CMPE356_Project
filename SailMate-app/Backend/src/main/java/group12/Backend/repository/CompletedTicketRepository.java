package group12.Backend.repository;

import group12.Backend.entity.CompletedTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompletedTicketRepository extends JpaRepository<CompletedTicket, Integer> {
    
    /**
     * Find a completed ticket by its unique ticketId
     * @param ticketId the unique ticket identifier
     * @return an Optional containing the completed ticket if found
     */
    Optional<CompletedTicket> findByTicketId(String ticketId);
    
    /**
     * Find all completed tickets by user ID
     * @param userId the ID of the user
     * @return list of completed tickets belonging to the user
     */
    List<CompletedTicket> findByUserId(String userId);
    
    /**
     * Find all completed tickets for a specific voyage
     * @param voyageId the ID of the voyage
     * @return list of completed tickets for the voyage
     */
    List<CompletedTicket> findByVoyageId(Integer voyageId);
}