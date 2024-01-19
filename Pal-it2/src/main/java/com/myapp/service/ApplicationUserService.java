package com.myapp.service;


import com.myapp.domain.ApplicationUser;
import com.myapp.domain.Formula;
import com.myapp.domain.Paint;
import com.myapp.domain.User;
import com.myapp.repository.ApplicationUserRepository;
import com.myapp.repository.FormulaRepository;
import com.myapp.repository.PaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ApplicationUserService {

    @Autowired
    ApplicationUserRepository applicationUserRepository;
    @Autowired
    PaintRepository paintRepository;
    @Autowired
    FormulaRepository formulaRepository;


    /**
     * used during the UserService account creation service
     * 137-138 UserService.java upon registration a new application
     * user will be generated and tied to the users email address
     * This is required for the relationship between users -> paints,
     * user -> Miniatures and user -> formulas
     * @param user
     * @return the same user after creating an applicationUser
     */
    public User createApplicationUser(User user){
        ApplicationUser newUser = new ApplicationUser();
        newUser.setApplicationUserName(user.getEmail());
        newUser.setInternalUser(user);
        applicationUserRepository.save(newUser);
        return user;
    }

    public ResponseEntity<Set<Paint>> getUnownedPaintByUserLogin(Long id) {
        ApplicationUser user = applicationUserRepository.getReferenceById(id);
        Set<Paint> paints = new HashSet<>(paintRepository.findAll());
        paints.removeAll(user.getOwnedPaints());
        return new ResponseEntity<>(paints,HttpStatus.OK);
    }

    public ResponseEntity<Boolean> setOwnedPaintByUserLogin(Long id, Paint[] paints) {
        if(applicationUserRepository.findById(id).isPresent()){
            Set<Paint> paints1 = new HashSet<>();
            for(Paint p: paints){
                paints1.add(paintRepository.getReferenceById(p.getId()));
            }
            ApplicationUser user = applicationUserRepository.findById(id).get();
            user.setOwnedPaints(paints1);
            applicationUserRepository.save(user);
            return new ResponseEntity<>(true,HttpStatus.OK);
        }else{
            throw new IllegalArgumentException("Incorrect ID supplied");
        }

    }
    public ApplicationUser verifyMiniatureAndFormulas(ApplicationUser applicationUser){
        Set<Paint> p;
        Set<Paint> ownedPaints = applicationUser.getOwnedPaints();
        Set<Formula> formulaNames = applicationUser.getFormulaNames();
        for(Formula formula : formulaNames){
            p = formula.getPaintFormulas();
            p = p.stream().filter(ownedPaints::contains).collect(Collectors.toSet());
            formula.setPaintFormulas(p);
            this.formulaRepository.save(formula);
        }
        applicationUser.setFormulaNames(formulaNames);
        return applicationUser;
    }
}
