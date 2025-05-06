package group12.Backend.scheduler;

import com.fasterxml.jackson.core.JsonProcessingException;
import group12.Backend.entity.CompletedTicket;
import group12.Backend.entity.Ticket;
import group12.Backend.entity.Voyage;
import group12.Backend.repository.CompletedTicketRepository;
import group12.Backend.repository.TicketRepository;
import group12.Backend.repository.VoyageRepository;
import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.logging.Logger;

@Component
public class VoyageCompletionScheduler {
    
    private static final Logger logger = Logger.getLogger(VoyageCompletionScheduler.class.getName());
    
    @Autowired
    private VoyageRepository voyageRepository;
    
    @Autowired
    private TicketRepository ticketRepository;
    
    @Autowired
    private CompletedTicketRepository completedTicketRepository;

    @PostConstruct
    public void onStartup() {
        logger.info("Application started - running voyage completion check immediately");
        processCompletedVoyages();
    }

    /**
     * Scheduled task to check for completed voyages and move their tickets to completed_tickets
     * Runs every 15 minutes
     */
    @Scheduled(cron = "0 */2 * * * *") // Run every 15 minutes
    @Transactional
    public void processCompletedVoyages() {
        logger.info("Starting scheduled task to process completed voyages...");
        
        LocalDate currentDate = LocalDate.now();
        LocalTime currentTime = LocalTime.now();
        
        // Find all active voyages that have departed (date is today or in the past)
        List<Voyage> potentiallyCompletedVoyages = voyageRepository.findByStatusAndDepartureDateBetween(
                Voyage.VoyageStatus.active, 
                LocalDate.of(2025, 1, 1),
                currentDate
        );
        
        int processedVoyages = 0;
        int processedTickets = 0;
        
        for (Voyage voyage : potentiallyCompletedVoyages) {
            // Check if voyage has departed
            boolean hasVoyageCompleted = false;
            
            if (voyage.getDepartureDate().isBefore(currentDate)) {
                // If departure date is in the past, voyage has completed
                hasVoyageCompleted = true;
            } else if (voyage.getDepartureDate().isEqual(currentDate)) {
                // If departure date is today, check if departure time has passed
                if (voyage.getDepartureTime().isBefore(currentTime)) {
                    hasVoyageCompleted = true;
                }
            }
            
            if (hasVoyageCompleted) {
                try {
                    int ticketsProcessed = processCompletedVoyage(voyage);
                    processedTickets += ticketsProcessed;
                    processedVoyages++;
                    logger.info(String.format("Processed completed voyage ID %d with %d tickets", 
                            voyage.getId(), ticketsProcessed));
                } catch (Exception e) {
                    logger.severe(String.format("Error processing completed voyage ID %d: %s", 
                            voyage.getId(), e.getMessage()));
                    e.printStackTrace();
                }
            }
        }
        logger.info(String.format("Completed voyage processing: %d voyages and %d tickets processed", 
                processedVoyages, processedTickets));
    }
    
    /**
     * Process a completed voyage by moving its tickets to completed_tickets table
     * @param voyage the completed voyage
     * @return number of tickets processed
     */
    @Transactional
    public int processCompletedVoyage(Voyage voyage) {
        // Find all tickets for this voyage
        List<Ticket> voyageTickets = ticketRepository.findByVoyageId(voyage.getId());
        
        if (voyageTickets.isEmpty()) {
            return 0;
        }
        
        int ticketsProcessed = 0;
        
        for (Ticket ticket : voyageTickets) {
            // Create a completed ticket from the regular ticket
            CompletedTicket completedTicket = new CompletedTicket();
            
            // Set basic ticket information
            completedTicket.setTicketId(ticket.getTicketID());
            completedTicket.setVoyageId(voyage.getId());
            completedTicket.setPassengerCount(ticket.getPassengerCount());
            completedTicket.setTotalPrice(ticket.getTotalPrice());
            completedTicket.setTicketClass(ticket.getTicketClass());
            completedTicket.setSelectedSeats(ticket.getSelectedSeats());
            completedTicket.setUserId(ticket.getUserId());
            completedTicket.setTicketData(ticket.getTicketData());
            
            // Set voyage static information
            completedTicket.setDepCity(voyage.getFromStation().getCity());
            completedTicket.setDepStationTitle(voyage.getFromStation().getTitle());
            completedTicket.setArrCity(voyage.getToStation().getCity());
            completedTicket.setArrStationTitle(voyage.getToStation().getTitle());
            completedTicket.setDepDate(voyage.getDepartureDate());
            completedTicket.setDepTime(voyage.getDepartureTime());
            completedTicket.setArrTime(voyage.getArrivalTime());
            completedTicket.setShipType(voyage.getShipType());
            completedTicket.setFuelType(voyage.getFuelType());
            
            // Save the completed ticket
            completedTicketRepository.save(completedTicket);
            
            // Delete the original ticket
            ticketRepository.delete(ticket);
            
            ticketsProcessed++;
        }
        
        return ticketsProcessed;
    }
}