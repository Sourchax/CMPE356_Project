package group12.Backend.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Timestamp;

public class TicketRepository {

    private final Connection connection;

    public TicketRepository(Connection connection) {
        this.connection = connection;
    }

    public void saveTicket(
        String ticketId,
        int voyageId,
        int passengerCount,
        int totalPrice,
        String ticketClass,
        String selectedSeats,
        String userId,
        String ticketDataJson,
        Timestamp createdAt
    ) throws Exception {
        String sql = "INSERT INTO tickets (ticket_id, voyage_id, passenger_count, total_price, ticket_class, selected_seats, user_id, ticket_data, created_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, ticketId);
            stmt.setInt(2, voyageId);
            stmt.setInt(3, passengerCount);
            stmt.setInt(4, totalPrice);
            stmt.setString(5, ticketClass);
            stmt.setString(6, selectedSeats);
            stmt.setString(7, userId);
            stmt.setString(8, ticketDataJson); // JSON string
            stmt.setTimestamp(9, createdAt);
            stmt.executeUpdate();
        }
    }
}
