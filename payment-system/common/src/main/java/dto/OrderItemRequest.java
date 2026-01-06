package dto;

import domain.Car;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemRequest {

    private Car car;
    private LocalDate rentalFrom;
    private LocalDate rentalTo;
    private Long insuranceId;
    private List<Long> extraIds;
}