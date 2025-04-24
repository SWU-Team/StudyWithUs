package com.swu.controller;

import com.swu.auth.entity.CustomUserDetails;
import com.swu.domain.room.dto.request.RoomRequest;
import com.swu.domain.room.dto.response.RoomResponse;
import com.swu.domain.room.service.RoomService;
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
@Tag(name = "Room", description = "스터디룸 관련 API")
public class RoomController {

    private final RoomService roomService;

    @Operation(summary = "스터디 방 생성", description = "방을 생성합니다.")
    @PostMapping
    public ResponseEntity<ApiResponse<RoomResponse>> createRoom(
            @RequestBody RoomRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        RoomResponse room = roomService.createRoom(request, userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.success("방 생성 성공", room));
    }

    @Operation(summary = "전체 방 목록 조회", description = "활성화된 모든 방 목록을 조회합니다.")
    @GetMapping
    public ResponseEntity<ApiResponse<List<RoomResponse>>> getAllRooms() {
        List<RoomResponse> rooms = roomService.getAllRooms();
        return ResponseEntity.ok(ApiResponse.success("방 목록 조회 성공", rooms));
    }


    @Operation(summary = "단일 방 조회", description = "roomId로 활성화된 특정 방 정보를 조회합니다.")
    @GetMapping("/{roomId}")
    public ResponseEntity<ApiResponse<RoomResponse>> getRoom(@PathVariable Long roomId) {
        RoomResponse room = roomService.getRoom(roomId);
        return ResponseEntity.ok(ApiResponse.success("방 조회 성공", room));
    }

}
