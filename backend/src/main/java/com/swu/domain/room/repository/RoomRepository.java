package com.swu.domain.room.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.swu.domain.room.entity.Room;

import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {
    Page<Room> findAllByIsDeletedFalse(Pageable pageable);
    Optional<Room> findByIdAndIsDeletedFalse(Long roomId);
    Page<Room> findByTitleContainingIgnoreCaseAndIsDeletedFalse(String keyword, Pageable pageable);
}
