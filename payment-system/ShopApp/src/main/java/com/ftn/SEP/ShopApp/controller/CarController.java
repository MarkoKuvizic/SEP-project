package com.ftn.SEP.ShopApp.controller;

import com.ftn.SEP.ShopApp.service.CarService;
import domain.Car;
import dto.CreateOrderRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
public class CarController {
    @Autowired
    CarService carService;

    @PostMapping
    public ResponseEntity<String> addCar(@RequestBody Car car){
        carService.save(car);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Car>> getCars(){
        return new ResponseEntity<>(carService.getAll(), HttpStatus.OK);
    }
}
