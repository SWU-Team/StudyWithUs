package com.swu.room.service;

import com.swu.room.domain.Room;
import com.swu.room.domain.RoomMember;
import com.swu.room.exception.AlreadyJoinedRoomException;
import com.swu.room.exception.NotJoinedRoomException;
import com.swu.room.exception.RoomFullException;
import com.swu.room.exception.RoomNotFoundException;
import com.swu.room.repository.RoomMemberRepository;
import com.swu.room.repository.RoomRepository;
import com.swu.user.domain.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoomMemberService {

    private final RoomMemberRepository roomMemberRepository;
    private final RoomRepository roomRepository;

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

        boolean isHost = roomMember.isHost();
        if (isHost) roomMember.setHost(false);

        roomMemberRepository.save(roomMember);

        if (isHost) delegateHost(room);

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
