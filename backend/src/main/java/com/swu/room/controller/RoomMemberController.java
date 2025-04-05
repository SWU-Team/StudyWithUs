package com.swu.room.controller;


import com.swu.auth.domain.CustomUserDetails;
import com.swu.global.response.ApiResponse;
import com.swu.room.service.RoomMemberService;
import com.swu.user.domain.User;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/room")
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
}
