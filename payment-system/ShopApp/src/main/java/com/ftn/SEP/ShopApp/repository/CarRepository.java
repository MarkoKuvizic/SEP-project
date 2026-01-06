package com.ftn.SEP.ShopApp.repository;

import domain.Car;
import domain.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarRepository extends JpaRepository<Car, String> {
}
