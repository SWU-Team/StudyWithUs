package com.swu.room.controller;

import com.swu.global.response.ApiResponse;
import com.swu.room.dto.request.RoomRequest;
import com.swu.room.dto.response.RoomResponse;
import com.swu.room.service.RoomService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RestController
@RequestMapping("/room")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @Operation(summary = "스터디 방 생성", description = "방을 생성합니다.")
    @PostMapping
    public ResponseEntity<ApiResponse<RoomResponse>> createRoom(@RequestBody RoomRequest request) {
        roomService.createRoom(request);
        return ResponseEntity.ok(ApiResponse.ok("방 생성 성공", null));
    }

    @Operation(summary = "전체 방 목록 조회", description = "현재 존재하는 모든 스터디 방 목록을 조회합니다.")
    @GetMapping
    public ResponseEntity<ApiResponse<List<RoomResponse>>> getAllRooms() {
        List<RoomResponse> rooms = roomService.getAllRooms();
        return ResponseEntity.ok(ApiResponse.ok("방 목록 조회 성공", rooms));
    }


    @Operation(summary = "단일 방 조회", description = "roomId로 특정 방 정보를 조회합니다.")
    @GetMapping("/{roomId}")
    public ResponseEntity<ApiResponse<RoomResponse>> getRoom(@PathVariable Long roomId) {
        RoomResponse room = roomService.getRoom(roomId);
        return ResponseEntity.ok(ApiResponse.ok("방 조회 성공", room));
    }

}
