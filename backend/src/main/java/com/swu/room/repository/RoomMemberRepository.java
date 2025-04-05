package com.swu.room.repository;

import com.swu.room.domain.Room;
import com.swu.room.domain.RoomMember;
import com.swu.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoomMemberRepository extends JpaRepository<RoomMember, Long> {
    boolean existsByRoomAndUserAndExitedAtIsNull(Room room, User user);
    Optional<RoomMember> findByRoomAndUserAndExitedAtIsNull(Room room, User user);
    int countByRoomAndExitedAtIsNull(Room room);
}
