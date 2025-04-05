package com.swu.room.repository;

import com.swu.room.domain.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByIsDeletedFalse();
    Optional<Room> findByIdAndIsDeletedFalse(Long roomId);
}
