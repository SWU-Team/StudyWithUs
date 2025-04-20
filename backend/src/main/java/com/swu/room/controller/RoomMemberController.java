package com.swu.room.controller;


import com.swu.auth.domain.CustomUserDetails;
import com.swu.global.response.ApiResponse;
import com.swu.room.dto.response.RoomMemberResponse;
import com.swu.room.service.RoomMemberService;
import com.swu.user.domain.User;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomMemberController {

    private final RoomMemberService roomMemberService;

    @Operation(summary = "방 참여", description = "특정 스터디 방에 참여합니다.")
    @PostMapping("/{roomId}/join")
    public ResponseEntity<ApiResponse<Void>> joinRoom(
            @PathVariable Long roomId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        User user = userDetails.getUser();
        roomMemberService.joinRoom(roomId, userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.ok("방 참여 성공.", null));
    }

    @Operation(summary = "방 나가기", description = "특정 스터디 방에서 나갑니다.")
    @PostMapping("/{roomId}/exit")
    public ResponseEntity<ApiResponse<Void>> exitRoom(
            @PathVariable Long roomId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        roomMemberService.exitRoom(roomId, userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.ok("방 나가기 성공.", null));
    }

    @Operation(summary = "방 참여자 목록 조회", description = "특정 스터디 방의 참여자 목록을 조회합니다.")
    @GetMapping("/{roomId}/members")
    public ResponseEntity<ApiResponse<List<RoomMemberResponse>>> getMembers(
            @PathVariable Long roomId) {

        List<RoomMemberResponse> members = roomMemberService.getMembers(roomId);
        return ResponseEntity.ok(ApiResponse.ok("참여자 목록 조회 성공", members));
    }
}
