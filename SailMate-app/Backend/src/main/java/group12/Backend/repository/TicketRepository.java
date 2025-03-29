package group12.Backend.repository;

import group12.Backend.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Integer> {
    
    /**
     * Find all tickets by user ID
     * @param userId the ID of the user
     * @return list of tickets belonging to the user
     */
    List<Ticket> findByUserId(String userId);
    
    /**
     * Find a ticket by its unique ticketID
     * @param ticketID the unique ticket identifier
     * @return an Optional containing the ticket if found
     */
    Optional<Ticket> findByTicketID(String ticketID);
    
    /**
     * Find all tickets for a specific voyage
     * @param voyageId the ID of the voyage
     * @return list of tickets for the voyage
     */
    List<Ticket> findByVoyageId(Integer voyageId);
    
    /**
     * Find tickets by ticket class
     * @param ticketClass the class of ticket (e.g., Business, Economy, Promo)
     * @return list of tickets matching the given class
     */
    List<Ticket> findByTicketClass(String ticketClass);
}