package com.ftn.SEP.BankApp.service;

import com.ftn.SEP.BankApp.repository.TransactionRepository;
import domain.Transaction;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class TransactionService{

    private final TransactionRepository repository;

    public Transaction create(Transaction transaction) {
        return repository.save(transaction);
    }

    @Transactional
    public Transaction getById(UUID id) {
        return repository.findById(id)
                .orElseThrow(EntityNotFoundException::new);
    }

    @Transactional
    public List<Transaction> getAll() {
        return repository.findAll();
    }

    public Transaction update(UUID id, Transaction updated) {
        Transaction existing = getById(id);

        existing.setAmount(updated.getAmount());
        existing.setCurrency(updated.getCurrency());
        existing.setStatus(updated.getStatus());

        return repository.save(existing);
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException();
        }
        repository.deleteById(id);
    }
}