package com.swu.controller;

import com.swu.auth.entity.PrincipalDetails;
import com.swu.domain.room.dto.response.RoomMemberResponse;
import com.swu.domain.room.service.RoomMemberService;
import com.swu.global.response.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
@Tag(name = "Room_Member", description = "스터디룸 사용자 관련 API")
public class RoomMemberController {

    private final RoomMemberService roomMemberService;

    @Operation(summary = "방 참여", description = "특정 스터디 방에 참여합니다.")
    @PostMapping("/{roomId}/join")
    public ResponseEntity<ApiResponse<Void>> joinRoom(
            @PathVariable Long roomId,
            @AuthenticationPrincipal PrincipalDetails userDetails) {

        roomMemberService.joinRoom(roomId, userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.success("방 참여 성공.", null));
    }

    @Operation(summary = "방 나가기", description = "특정 스터디 방에서 나갑니다.")
    @PostMapping("/{roomId}/exit")
    public ResponseEntity<ApiResponse<Void>> exitRoom(
            @PathVariable Long roomId,
            @AuthenticationPrincipal PrincipalDetails userDetails) {

        roomMemberService.exitRoom(roomId, userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.success("방 나가기 성공.", null));
    }

    @Operation(summary = "방 참여자 목록 조회", description = "특정 스터디 방의 참여자 목록을 조회합니다.")
    @GetMapping("/{roomId}/members")
    public ResponseEntity<ApiResponse<List<RoomMemberResponse>>> getMembers(
            @PathVariable Long roomId) {

        List<RoomMemberResponse> members = roomMemberService.getMembers(roomId);
        return ResponseEntity.ok(ApiResponse.success("참여자 목록 조회 성공", members));
    }
}
