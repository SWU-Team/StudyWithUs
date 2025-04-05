package com.swu.room.service;

import com.swu.room.domain.Room;
import com.swu.room.domain.RoomMember;
import com.swu.room.dto.request.RoomRequest;
import com.swu.room.dto.response.RoomResponse;
import com.swu.room.exception.RoomNotFoundException;
import com.swu.room.repository.RoomMemberRepository;
import com.swu.room.repository.RoomRepository;
import com.swu.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomMemberRepository roomMemberRepository;

    @Transactional
    public void createRoom(RoomRequest request) {
        Room room = Room.builder()
                .title(request.title())
                .maxCapacity(request.maxCapacity())
                .focusMinute(request.focusMinute())
                .breakMinute(request.breakMinute())
                .build();

        roomRepository.save(room);
    }

    @Transactional
    public List<RoomResponse> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(this::toRoomResponse)
                .toList();
    }

    @Transactional
    public RoomResponse getRoom(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundException("해당 방이 존재하지 않습니다."));
        return toRoomResponse(room);
    }

    private RoomResponse toRoomResponse(Room room) {
        int currentMembers = roomMemberRepository.countByRoomAndExitedAtIsNull(room);

        return new RoomResponse(
                room.getId(),
                room.getTitle(),
                room.getMaxCapacity(),
                room.getFocusMinute(),
                room.getBreakMinute(),
                currentMembers,
                room.getCreatedAt(),
                room.getBgm() != null ? room.getBgm().getTitle() : null
        );
    }
}

