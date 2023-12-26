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
   - status - orders: (1 -n) => 1 trạng thái đơn hàng có thể có 1 hoặc nhiều đơn hàng (1 đơn hàng chỉ có 1 trạng thái đơn hàng)
   
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




