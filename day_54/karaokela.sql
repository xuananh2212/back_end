CREATE TABLE "phong" (
  "ma_phong" varchar(20) PRIMARY KEY,
  "loai_phong" varchar(50) NOT NULL,
  "so_khach_toi_da" int NOT NULL,
  "gia_phong" float NOT NULL,
  "mo_ta" text,
  "created_at" timestamptz,
  "updated_at" timestamptz
);

CREATE TABLE "khach_hang" (
  "ma_kh" varchar(20) PRIMARY KEY,
  "ten_kh" varchar(50) NOT NULL,
  "dia_chi" text,
  "so_dt" varchar(15),
  "created_at" timestamptz,
  "updated_at" timestamptz
);

CREATE TABLE "dich_vu_di_kem" (
  "ma_dv" varchar(20) PRIMARY KEY,
  "ten_dv" varchar(50) NOT NULL,
  "don_vi_tinh" varchar(20),
  "don_gia" float NOT NULL,
  "created_at" timestamptz,
  "updated_at" timestamptz
);

CREATE TABLE "dat_phong" (
  "ma_dat_phong" varchar(20) PRIMARY KEY,
  "ma_phong" varchar(20),
  "ma_kh" varchar(20),
  "ngay_dat" date,
  "gio_bat_dau" timetz,
  "gio_ket_thuc" timetz,
  "tien_dat_coc" float NOT NULL,
  "ghi_chu" text,
  "trang_thai_dat" varchar(20)
);

CREATE TABLE "chi_tiet_su_dung_dv" (
  "ma_dat_phong" varchar(20),
  "ma_dv" varchar(20),
  "so_luong" int,
  PRIMARY KEY ("ma_dat_phong", "ma_dv")
);

ALTER TABLE "dat_phong" ADD FOREIGN KEY ("ma_kh") REFERENCES "khach_hang" ("ma_kh");

ALTER TABLE "dat_phong" ADD FOREIGN KEY ("ma_phong") REFERENCES "phong" ("ma_phong");

ALTER TABLE "chi_tiet_su_dung_dv" ADD FOREIGN KEY ("ma_dat_phong") REFERENCES "dat_phong" ("ma_dat_phong");

ALTER TABLE "chi_tiet_su_dung_dv" ADD FOREIGN KEY ("ma_dv") REFERENCES "dich_vu_di_kem" ("ma_dv");

-- thêm dữ liệu

INSERT INTO phong(ma_phong, loai_phong , so_khach_toi_da, gia_phong)
VALUES  ('P0001', 'loai 1' , 20 , 60000),
		('P0002', 'loai 2' , 25 , 80000),
		('P0003', 'loai 3' , 15 , 50000),
		('P0004', 'loai 4' , 20 , 50000)
		
INSERT INTO khach_hang(ma_kh, ten_kh, dia_chi, so_dt)
VALUES  ('KH0001', 'nguyen van a', 'hoa xuan', '1111111111'),
		('KH0002', 'nguyen van b', 'hoa hai', '1111111112'),
		('KH0003', 'nguyen van c', 'cam le', '11111111113'),
		('KH0004', 'nguyen van d', 'Hoa xuan', '1111111114')
		
INSERT INTO dich_vu_di_kem(ma_dv, ten_dv, don_vi_tinh, don_gia)
VALUES  ('DV001', 'beer', 'ion', 10000),
		('DV002', 'nuoc ngot', 'ion', 8000),
		('DV003', 'trai cay', 'dia', 35000),
		('DV004', 'khan uot', 'cai', 2000)
		
		
INSERT INTO dat_phong(ma_dat_phong, ma_phong, ma_kh, ngay_dat , gio_bat_dau, gio_ket_thuc, tien_dat_coc, trang_thai_dat)
VALUES	('DP0001', 'P0001', 'KH0002', TO_DATE('26/03/2018','DD/MM/YYYY'), '11:00', '13:30', 100000 , 'da dat'),
		('DP0002', 'P0001', 'KH0003', TO_DATE('27/03/2018','DD/MM/YYYY'), '17:15', '19:15', 50000 , 'da huy'),
		('DP0003', 'P0002', 'KH0002', TO_DATE('26/03/2018','DD/MM/YYYY'), '20:30', '22:15', 100000 , 'da dat'),
		('DP0004', 'P0003', 'KH0001', TO_DATE('01/04/2018','DD/MM/YYYY'), '19:30', '21:15', 200000 , 'da dat')
		
INSERT INTO chi_tiet_su_dung_dv(ma_dat_phong, ma_dv, so_luong)
VALUES ('DP0001', 'DV001', 20),
	   ('DP0001', 'DV003', 3),
	   ('DP0001', 'DV002', 10),
	   ('DP0002', 'DV002', 10),
	   ('DP0002', 'DV003', 1),
	   ('DP0003', 'DV003', 2),
	   ('DP0003', 'DV004', 10)
		
-- truy van

/*
Câu 1: Hiển thị MaDatPhong, MaPhong, LoaiPhong, GiaPhong, TenKH, NgayDat, 
TongTienHat, TongTienSuDungDichVu, 
TongTienThanhToan tương ứng với từng mã đặt phòng có trong bảng DAT_PHONG. 
Những đơn đặt phòng nào không sử dụng dịch vụ đi kèm thì cũng liệt kê thông tin 
của đơn đặt phòng đó ra
TongTienHat = GiaPhong * (GioKetThuc – GioBatDau)
TongTienSuDungDichVu = SoLuong * DonGia 
TongTienThanhToan = TongTienHat + sum (TongTienSuDungDichVu)
*/

SELECT 
	dat_phong.ma_dat_phong as madatphong,
	dat_phong.ma_phong as maphong,
	phong.loai_phong as loaiphong,
	phong.gia_phong as giaphong,
	khach_hang.ten_kh as tenkh,
	TO_CHAR(dat_phong.ngay_dat, 'DD/MM/YYYY') as ngaydat,
	
	(((EXTRACT(EPOCH FROM(gio_ket_thuc)) - EXTRACT(EPOCH FROM(gio_bat_dau))) / 3600) * phong.gia_phong) as tongtienhat,
	 (CASE
	  WHEN sum(chi_tiet_su_dung_dv.so_luong * dich_vu_di_kem.don_gia)  IS NULL Then 0
	  ELSE sum(chi_tiet_su_dung_dv.so_luong * dich_vu_di_kem.don_gia) 
	  END
	 ) as tongtiensudungdichvu,
	 
	(
	 (((EXTRACT(EPOCH FROM(gio_ket_thuc)) - EXTRACT(EPOCH FROM(gio_bat_dau))) / 3600) * phong.gia_phong) 
	     + 
	 (CASE
	  WHEN sum(chi_tiet_su_dung_dv.so_luong * dich_vu_di_kem.don_gia)  IS NULL Then 0
	  ELSE sum(chi_tiet_su_dung_dv.so_luong * dich_vu_di_kem.don_gia) 
	  END
	 )
	) as tongtienthanhtoan
FROM dat_phong
LEFT JOIN khach_hang
ON khach_hang.ma_kh = dat_phong.ma_kh
LEFT JOIN phong
ON dat_phong.ma_phong = phong.ma_phong
LEFT JOIN chi_tiet_su_dung_dv
ON chi_tiet_su_dung_dv.ma_dat_phong = dat_phong.ma_dat_phong
LEFT JOIN dich_vu_di_kem
ON dich_vu_di_kem.ma_dv = chi_tiet_su_dung_dv.ma_dv
GROUP BY dat_phong.ma_dat_phong, phong.ma_phong, khach_hang.ma_kh
	

/*
Câu 2: Hiển thị MaKH, TenKH, DiaChi, SoDT của những khách hàng đã từng đặt phòng karaoke có địa chỉ ở “Hoa xuan”
*/

SELECT
		khach_hang.ma_kh as makh,
		khach_hang.ten_Kh as tenkh,
		khach_hang.dia_chi as diachi,
		khach_hang.so_dt as sodt
FROM khach_hang
JOIN dat_phong
ON dat_phong.ma_kh = khach_hang.ma_kh
GROUP BY khach_hang.ma_kh
HAVING LOWER(khach_hang.dia_chi) = LOWER('Hoa xuan')
	

/*
câu 3: Hiển thị MaPhong, LoaiPhong, SoKhachToiDa, GiaPhong, SoLanDat
của những phòng được khách hàng đặt có số lần đặt lớn hơn 2 lần và trạng thái đặt là “Da dat”
*/

SELECT
		phong.ma_phong as maphong,
		phong.loai_phong as loaiphong,
		phong.so_khach_toi_da as sokhachtoida,
		phong.gia_phong as giaphong,
		count(phong.ma_phong) as solandat
FROM phong
LEFT JOIN dat_phong 
ON phong.ma_phong = dat_phong.ma_phong
WHERE  LOWER(dat_phong.trang_thai_dat) = LOWER('Da dat')
GROUP BY phong.ma_phong
HAVING count(phong.ma_phong) > 2



       
        
		


		
