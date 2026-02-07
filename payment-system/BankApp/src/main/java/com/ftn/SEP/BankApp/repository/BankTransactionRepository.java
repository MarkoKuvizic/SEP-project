package com.ftn.SEP.BankApp.repository;

import domain.BankTransaction;
import domain.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BankTransactionRepository extends JpaRepository<BankTransaction, UUID> {
}
