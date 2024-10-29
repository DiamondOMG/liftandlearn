// pages/api/dpop-receiver.js

export default function handler(req, res) {
    // ตรวจสอบว่า request เป็น POST หรือไม่
    if (req.method === 'POST') {
        // แสดงข้อมูลใน console
        console.log('DPoP Data Received:');
        console.log('Headers:', req.headers);
        console.log('Body:', req.body);

        // ส่ง response กลับไปยัง client
        res.status(200).json({ message: 'Data received successfully' });
    } else {
        // หากไม่ใช่ POST ให้ส่ง response 405 Method Not Allowed
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
