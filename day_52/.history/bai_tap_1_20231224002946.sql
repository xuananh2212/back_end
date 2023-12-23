-- tạo database
CREATE DATABASE database_01_xuananh
/*
-1. Tạo bảng courses có cấu trúc như sau
	id => Kiểu int, NOT NULL
	name => Kiểu varchar, NOT NULL
	price => Kiểu float
	detail => Kiểu text
	teacher_id => Kiểu int, NOT NULL
	active => Kiểu int
	created_at => Kiểu timestamp
	updated_at => Kiểu timestamp
*/

CREATE TABLE courses(
 id INT NOT NULL,
 name VARCHAR(50) NOT NULL,
 price FLOAT,
 detail TEXT,
 teacher_id INT NOT NULL,
 active INT,
 created_at  TIMESTAMP with TIME ZONE,
 updated_at  TIMESTAMP with TIME ZONE
);

--2.Thêm trường description trước trường detail với kiểu dữ liệu (text) và ràng buộc (null) sau:

ALTER TABLE courses
ADD COLUMN description TEXT;

--2.1 Đổi tên trường detail thành content và ràng buộc chuyển thành NOT NULL

--2.1.1 Đổi tên trường detail thành content

ALTER TABLE courses
RENAME COLUMN detail TO content;

-- 2.1.2 ràng buộc chuyển thành NOT NULL

ALTER TABLE courses
ALTER COLUMN content SET NOT NULL;


/*
-3. Tạo bảng teacher có cấu trúc như sau
	id => Kiểu int, NOT NULL
	name => Kiểu varchar, NOT NULL
	bio => Kiểu text, NULL
	created_at => Kiểu timestamp
	updated_at => Kiểu timestamp
*/
CREATE TABLE teacher(
    id INT NOT NULL,
	name varchar(50) NOT NULL,
	bio TEXT,
	created_at TIMESTAMP with TIME ZONE,
	updated_at TIMESTAMP with TIME ZONE
);

--4. Thêm 3 giảng viên vào bảng teacher

INSERT INTO teacher(id , name , bio , created_at, updated_at)
VALUES  (1, 'NGuyễn Thị A', 'có 1 năm kinh nghiệm làm việc', NOW() , NOW()),
		(2, 'NGuyễn Thị B', 'có 2 năm kinh nghiệm làm việc', NOW() , NOW()),
		(3, 'NGuyễn Thị C', 'có 3 năm kinh nghiệm làm việc', NOW() , NOW());

--5.  mỗi giảng viên thêm 3 khóa học

INSERT INTO courses(id, name , price, content,teacher_id, active, created_at, updated_at)
VALUES (1, 'Toán cao cấp 1', 100000, 'Toán cao cấp 1...', 1, 1, NOW(), NOW()),
	   (2, 'Toán cao cấp 2', 100000, 'Toán cao cấp 2...', 1, 0, NOW(), NOW()),
	   (3, 'Toán cao cấp 3', 400000, 'Toán cao cấp 3...', 1, 1, NOW(), NOW()),
	   (4, 'cấu trúc dữ liệu 1', 100000, 'cấu trúc dữ liệu 1...', 2, 1, NOW(), NOW()),
	   (5, 'cấu trúc dữ liệu 2', 300000, 'cấu trúc dữ liệu 2...', 2, 0, NOW(), NOW()),
	   (6, 'cấu trúc dữ liệu 3', 100000, 'cấu trúc dữ liệu 3...', 2, 0, NOW(), NOW()),
	   (7, 'lập trình cơ bản 1', 200000, 'lập trình cơ bản 1...', 3, 1, NOW(), NOW()),
	   (8, 'lập trình cơ bản 2', 900000, 'lập trình cơ bản 2...', 3, 1, NOW(), NOW()),
	   (9, 'lập trình cơ bản 3', 100000, 'lập trình cơ bản 3...', 3, 0, NOW(), NOW());
	   
--6. Sửa tên và giá từng khóa học thành tên mới và giá mới (Tên khóa học, giá khóa học các khóa học không được giống nhau)

--6.1 Tên khóa học, giá khóa học các khóa học không được giống nhau

ALTER TABLE courses
ADD CONSTRAINT courses_name_price_unique UNIQUE (name, price);

--6.2 Sửa tên và giá từng khóa học thành tên mới và giá mới


do $$
begin
for i in 1..(SELECT count(*) FROM courses) loop
UPDATE courses
SET 
	name = CONCAT('Môn', i), 
	price=100.000 + i , updated_at= NOW()
WHERE id= i;
end loop;
end;
$$


--7. Sửa lại bio của từng giảng viên (Bio từng giảng viên không được giống nhau)

--7.1 Bio từng giảng viên không được giống nhau

ALTER TABLE teacher
ADD CONSTRAINT teacher_bio_unique UNIQUE (bio);

--7.2 Sửa lại bio của từng giảng viên

do $$
begin
for i in 1..(SELECT count(*) FROM teacher) loop
UPDATE teacher
SET 
	bio= CONCAT('có', i , ' năm kinh nghiệm làm việc'),
	updated_at= NOW()
WHERE id= i;
end loop;
end;
$$


--8. Hiển thị danh sách giảng viên

SELECT * FROM teacher;

--9. Hiển thị danh sách khóa học

SELECT * FROM courses;


	   
		