package com.swu.controller;

import com.swu.auth.entity.PrincipalDetails;
import com.swu.domain.room.dto.request.RoomRequest;
import com.swu.domain.room.dto.response.RoomResponse;
import com.swu.domain.room.service.RoomService;
import com.swu.global.response.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
            @AuthenticationPrincipal PrincipalDetails userDetails) {
        RoomResponse room = roomService.createRoom(request, userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.success("방 생성 성공", room));
    }

    @Operation(summary = "전체 방 목록 조회 (페이징)", description = "활성화된 모든 방 목록을 페이징하여 조회합니다.")
    @GetMapping
    public ResponseEntity<ApiResponse<Page<RoomResponse>>> getAllRooms(
        @PageableDefault(size = 10) Pageable pageable) {
        Page<RoomResponse> rooms = roomService.getAllRooms(pageable);
        return ResponseEntity.ok(ApiResponse.success("방 목록 조회 성공", rooms));
    }


    @Operation(summary = "단일 방 조회", description = "roomId로 활성화된 특정 방 정보를 조회합니다.")
    @GetMapping("/{roomId}")
    public ResponseEntity<ApiResponse<RoomResponse>> getRoom(@PathVariable Long roomId) {
        RoomResponse room = roomService.getRoom(roomId);
        return ResponseEntity.ok(ApiResponse.success("방 조회 성공", room));
    }

    @Operation(summary = "스터디 방 검색 (페이징)", description = "방 제목으로 검색하고 결과를 페이징합니다.")
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<RoomResponse>>> searchRooms(
            @RequestParam String keyword,
            @PageableDefault(size = 10) Pageable pageable) {

        Page<RoomResponse> result = roomService.searchRooms(keyword, pageable);
        return ResponseEntity.ok(ApiResponse.success("방 검색 성공", result));
    }
}
