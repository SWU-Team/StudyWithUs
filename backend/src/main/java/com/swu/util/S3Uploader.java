package com.swu.util;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.swu.domain.user.exception.InvalidFileException;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Component
@RequiredArgsConstructor
public class S3Uploader {
    
    private final S3Client s3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${cloud.aws.region.static}")
    private String region;

    public String upload(MultipartFile file) throws IOException {
        
        if (file == null || file.getOriginalFilename() == null) {
            throw new InvalidFileException("파일이 없습니다.");
        }

        if (file.getSize() > 10 * 1024 * 1024) {
            throw new InvalidFileException("파일 크기가 너무 큽니다.");
        }

        String originalFilename = file.getOriginalFilename();
        String ext = originalFilename.substring(originalFilename.lastIndexOf("."));
        String key = UUID.randomUUID() + ext;  // 랜덤 이름

        // S3에 업로드
        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(key)
                        .contentType(file.getContentType())
                        .build(),
                RequestBody.fromBytes(file.getBytes())
        );

        // 업로드된 파일의 URL 반환
        return "https://" + bucket + ".s3." + region + ".amazonaws.com/" + key;
    }
}
