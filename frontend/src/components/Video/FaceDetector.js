/* global cv */
import React, { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";

const FaceDetector = ({ stream, onKick, notifyKicked }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!stream) return;

    let intervalId; // 타이머 ID 저장용

    const startDetection = async () => {
      //   console.log("OpenCV 완전 로딩됨");

      // XML 모델 로드
      const response = await fetch("/haar/haarcascade_frontalface_default.xml");
      //   console.log("모델 응답 상태:", response.status);
      const buffer = await response.arrayBuffer();
      const data = new Uint8Array(buffer);

      if (!cv.FS.analyzePath("/haarcascade.xml").exists) {
        cv.FS_createDataFile("/", "haarcascade.xml", data, true, false);
      }

      const classifier = new cv.CascadeClassifier();
      const loadResult = classifier.load("haarcascade.xml");
      //   console.log("모델 로딩 결과:", loadResult);

      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
      }

      // 메타데이터 로드 시점 기다리기 (비디오 오류 방지)
      await new Promise((resolve) => {
        if (!videoRef.current) return;
        video.onloadedmetadata = () => resolve();
      });

      const width = video.videoWidth;
      const height = video.videoHeight;
      video.width = width;
      video.height = height;
      //   console.log("받아온 비디오 사이즈:", width, height);

      const cap = new cv.VideoCapture(video);
      const frame = new cv.Mat(height, width, cv.CV_8UC4);
      const gray = new cv.Mat(height, width, cv.CV_8UC1);
      const faces = new cv.RectVector();
      let noFaceCount = 0;
      let warned = false;

      intervalId = setInterval(() => {
        cap.read(frame);
        if (frame.cols === 0 || frame.rows === 0) {
          //   console.warn("비어있는 프레임 감지됨. 건너뜀");
          return;
        }

        cv.cvtColor(frame, gray, cv.COLOR_RGBA2GRAY);
        classifier.detectMultiScale(gray, faces, 1.1, 6, 0);

        if (faces.size() > 0) {
          noFaceCount = 0;
        } else {
          noFaceCount++;

          // 4분 30초에 경고 알림
          if (noFaceCount === 240 && !warned) {
            toast.warning("⚠️ 얼굴 인식이 안되고 있어요. 1분 내로 인식되지 않으면 퇴장됩니다.");
            warned = true;
          }
          //   console.log("얼굴 없음 시간:", noFaceCount);
          if (noFaceCount >= 300) {
            // console.warn("얼굴 30초 동안 없음 → 퇴장");
            onKick?.();
            notifyKicked?.();
            toast.error("자리비움으로 식별되어 퇴장되었습니다.");
          }
        }
      }, 1000);
    };

    const waitForOpenCV = () => {
      let waitCount = 0;
      const maxWait = 50;

      const checkId = setInterval(() => {
        if (cv && cv.FS_createDataFile) {
          clearInterval(checkId);
          startDetection();
        } else {
          waitCount++;
          //   console.log(`OpenCV 로딩 대기 중... (${waitCount})`);
          if (waitCount > maxWait) {
            clearInterval(checkId);
            // console.error("OpenCV 로딩 실패: 타임아웃");
          }
        }
      }, 100);
    };

    waitForOpenCV();
    return () => {
      if (intervalId) clearInterval(intervalId);

      //   console.log("FaceDetector 종료됨");
    };
  }, [stream, onKick]);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: "1px", height: "1px", opacity: 0, position: "absolute" }}
      />
    </>
  );
};

export default FaceDetector;
