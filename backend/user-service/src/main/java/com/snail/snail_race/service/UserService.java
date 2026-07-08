package com.snail.snail_race.service;

import com.snail.snail_race.domain.User;
import com.snail.snail_race.dto.UserResponseDto;
import com.snail.snail_race.exception.UserNotFoundException;
import com.snail.snail_race.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public UserResponseDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        
        return new UserResponseDto(user.getId(), user.getEmail(), user.getNickname());
    }
}
