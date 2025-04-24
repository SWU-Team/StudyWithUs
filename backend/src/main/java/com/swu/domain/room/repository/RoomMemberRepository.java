package com.swu.domain.room.repository;

import com.swu.domain.room.entity.Room;
import com.swu.domain.room.entity.RoomMember;
import com.swu.domain.user.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoomMemberRepository extends JpaRepository<RoomMember, Long> {
    boolean existsByRoomAndUserAndExitedAtIsNull(Room room, User user);
    Optional<RoomMember> findByRoomAndUserAndExitedAtIsNull(Room room, User user);
    int countByRoomAndExitedAtIsNull(Room room);
    List<RoomMember> findByRoomAndExitedAtIsNull(Room room);
}
