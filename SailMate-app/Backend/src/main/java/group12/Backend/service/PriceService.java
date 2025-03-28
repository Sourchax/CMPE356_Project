package group12.Backend.service;

import group12.Backend.dto.PriceDTO;
import group12.Backend.entity.Price;
import group12.Backend.repository.PriceRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PriceService {
    
    private final PriceRepository priceRepository;
    
    @Autowired
    public PriceService(PriceRepository priceRepository) {
        this.priceRepository = priceRepository;
    }
    
    // Convert Entity to DTO
    private PriceDTO convertToDTO(Price price) {
        return new PriceDTO(
            price.getId(),
            price.getClassName(),
            price.getValue()
        );
    }
    
    // Convert DTO to Entity
    private Price convertToEntity(PriceDTO priceDTO) {
        Price price = new Price();
        price.setId(priceDTO.getId());
        price.setClassName(priceDTO.getClassName());
        price.setValue(priceDTO.getValue());
        return price;
    }
    
    // Get all prices
    public List<PriceDTO> getAllPrices() {
        return priceRepository.findAll()
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    // Update price by ID
    public PriceDTO updatePriceById(Integer id, PriceDTO priceDTO) {
        Optional<Price> existingPrice = priceRepository.findById(id);
        
        if (existingPrice.isPresent()) {
            Price price = existingPrice.get();
            price.setClassName(priceDTO.getClassName());
            price.setValue(priceDTO.getValue());
            
            Price updatedPrice = priceRepository.save(price);
            return convertToDTO(updatedPrice);
        } else {
            throw new RuntimeException("Price with id " + id + " not found");
        }
    }
    
    // Update price by class name (title)
    public PriceDTO updatePriceByClassName(String className, PriceDTO priceDTO) {
        Optional<Price> existingPrice = priceRepository.findByClassName(className);
        
        if (existingPrice.isPresent()) {
            Price price = existingPrice.get();
            price.setValue(priceDTO.getValue());
            
            Price updatedPrice = priceRepository.save(price);
            return convertToDTO(updatedPrice);
        } else {
            throw new RuntimeException("Price with class name " + className + " not found");
        }
    }
}