package com.bolsadeideas.springboot.backend.apirest.controllers;

import com.bolsadeideas.springboot.backend.apirest.models.entity.TransactionEntity;
import com.bolsadeideas.springboot.backend.apirest.models.services.intefaces.ITransactionService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin(origins = { "https://guardianstrustbank.com" })
//@CrossOrigin(origins = { "http://localhost:4200" })
@RestController
@RequestMapping("/api/transaction")
public class TransactionConstructor {

    @Autowired private ITransactionService transactionService;

    @PostMapping("/save")
    public void save(@RequestBody TransactionEntity transaction) {
        this.transactionService.save(transaction);
    }

    @GetMapping("/findByUser")
    public List<TransactionEntity> findTransactionById(@RequestParam Integer idUser){
        return this.transactionService.getTransactionByUser(idUser);
    }

    @GetMapping("/findAllAdmin/{idManageAdmin}")
    public List<TransactionEntity> findAllByAdmin(@PathVariable Integer idManageAdmin){
        return this.transactionService.getAllTransaction(idManageAdmin);
    }

    @GetMapping("/findAll")
    public List<TransactionEntity> findAll(){
        return this.transactionService.getAll();
    }


}
