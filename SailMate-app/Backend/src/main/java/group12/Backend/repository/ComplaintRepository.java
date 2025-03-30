package group12.Backend.repository;

import group12.Backend.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Integer> {
    List<Complaint> findByUserId(String userId);
    List<Complaint> findByStatus(Complaint.ComplaintStatus status);
}