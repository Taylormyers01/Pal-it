package com.myapp.service;


import com.myapp.domain.ApplicationUser;
import com.myapp.domain.User;
import com.myapp.repository.ApplicationUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ApplicationUserService {

    @Autowired
    ApplicationUserRepository applicationUserRepository;


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
}
