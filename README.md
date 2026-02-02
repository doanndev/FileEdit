

## Những tính năng chính
- Chỉnh sửa file văn bản với giao diện web đơn giản.
- Hỗ trợ AI (Gemini) để gợi ý, tóm tắt hoặc sửa nội dung.
- Xem trước và lưu thay đổi cục bộ.

## Chạy cục bộ

Yêu cầu trước: Node.js (v16+ khuyến nghị)

1. Cài đặt phụ thuộc:
	`npm install`
2. Tạo file `.env.local` (nằm ở gốc dự án) và đặt biến môi trường `GEMINI_API_KEY` bằng khóa Gemini của bạn:

	```
	GEMINI_API_KEY=your_api_key_here
	```

3. Chạy ứng dụng ở chế độ phát triển:
	`npm run dev`

Sau khi server chạy, mở trình duyệt và truy cập URL hiển thị trong terminal (mặc định thường là http://localhost:5173).

## Cấu trúc dự án (tóm tắt)
- `App.tsx`, `index.tsx`, `index.html` — entrypoint của ứng dụng.
- `services/geminiService.ts` — lớp/tiện ích gọi Gemini API.
- `services/fileService.ts` — logic thao tác file.
- `types.ts`, `constants.tsx` — kiểu và hằng số dự án.

## Triển khai
Bạn có thể triển khai ứng dụng lên bất kỳ hosting tĩnh/Node.js nào hoặc dùng nền tảng hỗ trợ Vite. Trước khi triển khai, đảm bảo biến môi trường `GEMINI_API_KEY` được cung cấp an toàn trên môi trường hosting.

## Góp ý & Phát triển
Nếu bạn muốn mở rộng tính năng (ví dụ: hỗ trợ đồng bộ hoá, quản lý phiên bản file, hoặc nâng cấp UI), hãy tạo một nhánh mới và gửi pull request. Mô tả ngắn gọn thay đổi và cách kiểm thử kèm theo.

---

Nếu bạn cần tôi cập nhật thêm nội dung cụ thể (ví dụ mô tả tính năng chi tiết hơn, hướng dẫn deploy lên một nền tảng cụ thể, hoặc tiếng Anh song song), cho biết yêu cầu và tôi sẽ chỉnh sửa tiếp.

