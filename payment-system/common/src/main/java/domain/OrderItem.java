package domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Car car;

    private LocalDate rentalFrom;
    private LocalDate rentalTo;

//    @ManyToOne
//    private InsuranceOption insurance;

//    // dodatne opcije
//    @ManyToMany
//    private List<ExtraOption> extras = new ArrayList<>();

    private BigDecimal price;
}
