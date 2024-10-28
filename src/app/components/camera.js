"use client";
import { useRef, useState } from "react";

const Camera = () => {
  const videoRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

  // ฟังก์ชันเปิดกล้อง
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  // ฟังก์ชันแคปเจอภาพ
  const captureImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    setImageSrc(canvas.toDataURL("image/png")); // แปลงภาพเป็น base64
  };

  // ฟังก์ชันดาวน์โหลดภาพ
  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = "captured_image.png";
    link.click();
  };

  return (
    <div>
      <video ref={videoRef} autoPlay style={{ width: "100%" }}></video>
      <button onClick={openCamera}>เปิดกล้อง</button>
      <button onClick={captureImage}>แคปเจอภาพ</button>
      {imageSrc && (
        <>
          <img src={imageSrc} alt="captured" style={{ marginTop: "10px" }} />
          <button onClick={downloadImage}>ดาวน์โหลดภาพ</button>
        </>
      )}
    </div>
  );
};

export default Camera;
