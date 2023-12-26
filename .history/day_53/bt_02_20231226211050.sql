-- tạo DATABASE
CREATE DATABASE database_02_xuananh;

/*
-1. phân tích db quản lý đơn hàng 
 + ta có các bảng sau: customers, phones, products, products_category, orders, orders_detail, status
 + mối quan hệ giữa các bảng:
   - customers - phones : (1 - n) => 1 khách hàng có thể chứa 1 hoặc nhiều số điện thoại (1 số điện thoại chỉ thuộc 1 khách hàng)
   - customers - orders : (1 - n) => 1 khách hàng có thể đặt hàng 1 hoặc nhiều lần (1 đơn hàng chỉ thuộc 1 khách hàng)
   - products_category - products: (1 - n) => 1 danh mục có thể chứa 1 hoặc nhiều sản phẩm  (1 sản phẩm chỉ được nằm ở 1 danh mục)
   - products - orders_detail : (1 - n) => 1 sản phẩm có thể nằm ở 1 hoặc nhiều đơn hàng chi tiết.
   - orders - orders_detail : (1 - n) => 1 đơn đặt hàng có thể có 1 hoặc nhiều đơn hàng chi tiết.
   - status - orders: (1 -n) => 1 trạng thái đơn hàng có thể nằm ở 1 hoặc nhiều đơn hàng (1 đơn hàng chỉ có 1 trạng thái đơn hàng)
   
*/

CREATE TABLE customers(
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name VARCHAR(50) NOT NULL UNIQUE,
	email VARCHAR(100) NOT NULL,
	password VARCHAR(100) NOT NULL,
	avatar VARCHAR(100),
	address TEXT,
	created_at TIMESTAMPTZ,
	updated_at TIMESTAMPTZ
);


CREATE TABLE phones(
	 id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	 name VARCHAR(11),
	 customer_id  INT,
	 created_at TIMESTAMPTZ,
	 updated_at TIMESTAMPTZ
);


CREATE TABLE products(
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	product_code VARCHAR(20),
	name VARCHAR(100) NOT NULL,
	description TEXT,
	price FLOAT NOT NULL,
	thumbnail VARCHAR(100) NOT NULL,
	product_category_id INT,
	total_quantity INT NOT NULL,
	created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

CREATE TABLE products_category(
	  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	  name VARCHAR(30)  NOT NULL,
	  created_at TIMESTAMPTZ,
	  updated_at TIMESTAMPTZ
);

CREATE TABLE orders(
	 id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	 total_quantity INT NOT NULL,
	 total_amount FLOAT NOT NULL,
	 customer_id INT,
	 status_id INT,
	 created_at TIMESTAMPTZ,
	 updated_at TIMESTAMPTZ
);

CREATE TABLE status(
	 id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	 name VARCHAR(30)  NOT NULL,
	 created_at TIMESTAMPTZ,
	 updated_at TIMESTAMPTZ
);

CREATE TABLE orders_detail(
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	order_id INT NOT NULL,
	product_id INT NOT NULL,
	quantity INT NOT NULL,
	created_at TIMESTAMPTZ,
	updated_at TIMESTAMPTZ
);
-- thêm ràng ruộc khoá ngoại.

ALTER TABLE phones 
ADD CONSTRAINT phones_customer_id_fk  
FOREIGN KEY (customer_id) 
REFERENCES customers(id);

ALTER TABLE products 
ADD CONSTRAINT products_product_categroy_id_fk 
FOREIGN KEY (product_category_id) 
REFERENCES products_category(id);

ALTER TABLE orders 
ADD CONSTRAINT orders_customer_id_fk
FOREIGN KEY (customer_id) 
REFERENCES customers(id);

ALTER TABLE orders 
ADD CONSTRAINT orders_status_id_fk
FOREIGN KEY (status_id) 
REFERENCES status(id);

ALTER TABLE orders_detail
ADD CONSTRAINT orders_detail_order_id_fk
FOREIGN KEY (order_id) 
REFERENCES orders(id);

ALTER TABLE orders_detail 
ADD CONSTRAINT orders_detail_product_id_fk
FOREIGN KEY (product_id) 
REFERENCES products(id);
-- THÊM DỮ LIỆU CHO TỪNG BẢNG
INSERT INTO customers(name ,email, password,created_at, updated_at)
VALUES('user1', 'user1@gmail.com', '123456', NOW() , NOW()),
	  ('user2', 'user2@gmail.com', '123456', NOW() , NOW()),
	  ('user3', 'user2@gmail.com', '123456', NOW() , NOW())
	  
INSERT INTO phones (name, customer_id)
VALUES  ('0981089128', 1),
		('0981089121', 2),
		('0981089124', 3)

INSERT INTO products_category(name)
VALUES  ('điện tử'),
		('đồ ăn vặt'),
		('quần áo')

INSERT INTO products(name,product_code , description, price, thumbnail, total_quantity,product_category_id , created_at, updated_at)
VALUES ('MÁY TÍNH 1', 'mk1001', 'desc1', 10000, 'https://www.bing.com/images/1', 100, 1, NOW() ,NOW()),
	   ('MÁY TÍNH 2', 'mk1002', 'desc1', 15000, 'https://www.bing.com/images/2', 10, 1, NOW() ,NOW()),
	   ('MÁY TÍNH 3', 'mk1003', 'desc1', 11000, 'https://www.bing.com/images/3', 110, 1, NOW() ,NOW()),
	   ('ĐỒ ĂN VẶT 1', 'DAV1004', 'desc1', 11000, 'https://www.bing.com/images/4', 90, 2, NOW() ,NOW()),
	   ('QUẦN ÁO 1', 'qa1005', 'desc1', 11000, 'https://www.bing.com/images/5', 90, 3, NOW() ,NOW())

INSERT INTO status(name)
VALUES('ĐANG CHỜ'),
	  ('ĐANG VẬN CHUYỂN'),
	  ('ĐÃ XÁC NHẬN'),
	  ('ĐÃ HUỶ'),
	  ('Đã Thành công')

INSERT INTO orders(total_quantity, total_amount, customer_id, status_id, created_at, updated_at)
VALUES(3, 36000, 1 , 1, NOW(), NOW()),
      (3, 37000, 2 , 1, NOW(), NOW())
	  
	  
INSERT INTO orders_detail(order_id, product_id , quantity, created_at, updated_at)
VALUES(1,1,1,NOW(), NOW()),
      (1,2,1,NOW(), NOW()),
	  (1,3,1, NOW(), NOW()),
	  (2,2,1, NOW(), NOW()),
	  (2,3,1, NOW(), NOW()),
	  (2,4,1, NOW(), NOW())
	   

/*
	1. Xem danh sách đơn hàng
	Tên khách hàng
	Email khách hàng
	Số điện thoại khách hàng
	Tổng số lượng sản phẩm
	Tổng tiền đơn hàng
	Trạng thái đơn hàng
	Thời gian đặt hàng
*/
SELECT  customers.name, 
		customers.email, 
		phones.name , 
		orders.total_quantity,
		orders.total_amount, 
		orders.created_at,
		orders.status_id
FROM customers
JOIN phones 
ON customers.id = phones.customer_id
JOIN orders
ON customers.id = orders.customer_id

/*
2. Xem chi tiết đơn hàng
Tên khách hàng
Email khách hàng
Số điện thoại khách hàng
Danh sách sản phẩm trong đơn hàng: Tên, Mã sản phẩm, giá, số lượng, tổng tiền từng sản phẩm
Trạng thái đơn hàng
Thời gian tạo đơn hàng
Thời gian cập nhật cuối cùng

*/
SELECT  customers.name, 
		customers.email, 
		phones.name , 
		orders.created_at as time_start_order,
		orders.updated_at as time_update_order,
		orders.status_id,
		products.*
FROM customers
JOIN phones 
ON customers.id = phones.customer_id
JOIN orders
ON customers.id = orders.customer_id
JOIN orders_detail
ON orders.id = orders_detail.order_id
JOIN products
ON orders_detail.product_id = products.id





