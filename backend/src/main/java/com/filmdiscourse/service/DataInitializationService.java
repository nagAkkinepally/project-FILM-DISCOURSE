package com.filmdiscourse.service;

import com.filmdiscourse.entity.Role;
import com.filmdiscourse.entity.User;
import com.filmdiscourse.repository.RoleRepository;
import com.filmdiscourse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializationService implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        initRoles();
        initAdminUser();
    }

    private void initRoles() {
        for (Role.RoleName roleName : Role.RoleName.values()) {
            if (roleRepository.findByName(roleName).isEmpty()) {
                roleRepository.save(Role.builder().name(roleName).build());
                log.info("Created role: {}", roleName);
            }
        }
    }

    private void initAdminUser() {
        if (!userRepository.existsByUsername("admin")) {
            Role adminRole = roleRepository.findByName(Role.RoleName.ROLE_ADMIN)
                    .orElseThrow();
            Role userRole = roleRepository.findByName(Role.RoleName.ROLE_USER)
                    .orElseThrow();

            User admin = User.builder()
                    .username("admin")
                    .email("admin@filmdiscourse.com")
                    .password(passwordEncoder.encode("Admin@1234"))
                    .fullName("System Administrator")
                    .active(true)
                    .roles(Set.of(adminRole, userRole))
                    .build();

            userRepository.save(admin);
            log.info("Admin user created. Username: admin | Password: Admin@1234");
        }
    }
}
