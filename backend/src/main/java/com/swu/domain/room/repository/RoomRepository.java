package com.swu.domain.room.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.swu.domain.room.entity.Room;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByIsDeletedFalse();
    Optional<Room> findByIdAndIsDeletedFalse(Long roomId);
}
