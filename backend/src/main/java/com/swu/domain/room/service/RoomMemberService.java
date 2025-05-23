package com.swu.domain.room.service;

import com.swu.domain.room.dto.response.RoomMemberResponse;
import com.swu.domain.room.entity.Room;
import com.swu.domain.room.entity.RoomMember;
import com.swu.domain.room.exception.AlreadyJoinedRoomException;
import com.swu.domain.room.exception.NotJoinedRoomException;
import com.swu.domain.room.exception.RoomFullException;
import com.swu.domain.room.exception.RoomNotFoundException;
import com.swu.domain.room.repository.RoomMemberRepository;
import com.swu.domain.room.repository.RoomRepository;
import com.swu.domain.studytime.service.StudyTimeService;
import com.swu.domain.user.entity.User;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoomMemberService {

    private final RoomMemberRepository roomMemberRepository;
    private final RoomRepository roomRepository;
    private final StudyTimeService studyTimeService;

    @Transactional
    public void joinRoom(Long roomId, User user) {

        Room room = roomRepository.findByIdAndIsDeletedFalse(roomId)
                .orElseThrow(() -> new RoomNotFoundException("해당 방이 존재하지 않습니다."));

        boolean isAlreadyJoined = roomMemberRepository.existsByRoomAndUserAndExitedAtIsNull(room, user);
        if (isAlreadyJoined) {
            throw new AlreadyJoinedRoomException("이미 방에 참여 중인 사용자입니다.");
        }

        int currentCount = roomMemberRepository.countByRoomAndExitedAtIsNull(room);
        if (currentCount >= room.getMaxCapacity()) {
            throw new RoomFullException("방이 가득 차서 더 이상 참여할 수 없습니다.");
        }

        RoomMember roomMember = RoomMember.builder()
                .room(room)
                .user(user)
                .isHost(false)
                .build();

        roomMemberRepository.save(roomMember);
    }

    @Transactional
    public void exitRoom(Long roomId, User user) {
        Room room = roomRepository.findByIdAndIsDeletedFalse(roomId)
                .orElseThrow(() -> new RoomNotFoundException("해당 방이 존재하지 않습니다."));

        RoomMember roomMember = roomMemberRepository.findByRoomAndUserAndExitedAtIsNull(room, user)
                .orElseThrow(() -> new NotJoinedRoomException("방에 참여하지 않은 사용자입니다."));
        
        roomMember.exit();

        // 스터디 시간 기록
        LocalDateTime enteredAt = roomMember.getJoinedAt();
        LocalDateTime exitedAt = roomMember.getExitedAt();
        int minutes = (int) Duration.between(enteredAt, exitedAt).toMinutes();
        LocalDate studyDate = enteredAt.toLocalDate();
        studyTimeService.addOrUpdate(user.getId(), studyDate, minutes);
        
        boolean isHost = roomMember.isHost();
        if (isHost) roomMember.setHost(false);

        roomMemberRepository.save(roomMember);

        if (isHost) delegateHost(room);
    }

    @Transactional(readOnly = true)
    public List<RoomMemberResponse> getMembers(Long roomId) {
        Room room = roomRepository.findByIdAndIsDeletedFalse(roomId)
                .orElseThrow(() -> new RoomNotFoundException("해당 방이 존재하지 않습니다."));

        List<RoomMember> members = roomMemberRepository.findByRoomAndExitedAtIsNull(room);

        return members.stream()
                .map(m -> new RoomMemberResponse(
                        m.getUser().getId(),
                        m.getUser().getNickname(),
                        m.isHost(),
                        m.getJoinedAt()
                ))
                .toList();
    }

    private void delegateHost(Room room) {
        List<RoomMember> others = roomMemberRepository.findByRoomAndExitedAtIsNull(room);

        if (!others.isEmpty()) {
            RoomMember newHost = others.get(0); // 현재는 첫번째 유저가 방장이 됨
            newHost.setHost(true);
            roomMemberRepository.save(newHost);
        } else { // 방에 남아있는 유저가 없을 경우 방 삭제
            room.setDeleted(true);
            roomRepository.save(room);
        }
    }
}
