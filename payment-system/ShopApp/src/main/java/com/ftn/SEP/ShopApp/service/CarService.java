package com.ftn.SEP.ShopApp.service;

import com.ftn.SEP.ShopApp.repository.CarRepository;
import domain.Car;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CarService {
    @Autowired
    CarRepository carRepository;


    public void saveIfNotExists(Car car){
        Optional<Car> carOptional = carRepository.findById(car.getId());

        if (carOptional.isEmpty()){
            carRepository.save(car);
        }
    }
}
