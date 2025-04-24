package com.swu.domain.room.service;

import com.swu.domain.room.dto.request.RoomRequest;
import com.swu.domain.room.dto.response.RoomResponse;
import com.swu.domain.room.entity.Room;
import com.swu.domain.room.entity.RoomMember;
import com.swu.domain.room.exception.RoomNotFoundException;
import com.swu.domain.room.repository.RoomMemberRepository;
import com.swu.domain.room.repository.RoomRepository;
import com.swu.domain.user.entity.User;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomMemberRepository roomMemberRepository;

    @Transactional
    public RoomResponse createRoom(RoomRequest request, User user) {
        Room room = Room.builder()
                .title(request.title())
                .maxCapacity(request.maxCapacity())
                .focusMinute(request.focusMinute())
                .breakMinute(request.breakMinute())
                .build();

        roomRepository.save(room);

        RoomMember roomMember = RoomMember.builder()
                .room(room)
                .user(user)
                .isHost(true)
                .build();

        roomMemberRepository.save(roomMember);

        return toRoomResponse(room);
    }

    @Transactional
    public List<RoomResponse> getAllRooms() {
        return roomRepository.findByIsDeletedFalse().stream()
                .map(this::toRoomResponse)
                .toList();
    }

    @Transactional
    public RoomResponse getRoom(Long roomId) {
        Room room = roomRepository.findByIdAndIsDeletedFalse(roomId)
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

    public boolean hasAccessToRoom(Long roomId, User user) {
        try {
            // 방이 존재하는지 확인
            Room room = roomRepository.findByIdAndIsDeletedFalse(roomId)
                .orElseThrow(() -> new RoomNotFoundException("해당 방이 존재하지 않습니다."));
            
            // 해당 방의 멤버 정보 조회
            Boolean isJoined = roomMemberRepository.existsByRoomAndUserAndExitedAtIsNull(room, user);            
            
            // 멤버가 존재하면 접근 허용
            boolean hasAccess = isJoined;
            
            log.debug("접근 권한 확인 - 방: {}, 사용자: {}, 접근 가능: {}", roomId, user.getId(), hasAccess);
            
            return hasAccess;
        } catch (Exception e) {
            log.error("방 접근 권한 확인 중 오류 발생 - 방: {}, 사용자: {}, 오류: {}", roomId, user.getId(), e.getMessage());
            return false;
        }
    }
}

