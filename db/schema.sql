DROP TABLE IF EXISTS products;
CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price_id TEXT NOT NULL,
    price_amount INTEGER NOT NULL,
    image_url TEXT,
    stock INTEGER DEFAULT 100
);
INSERT INTO products (name, description, price_id, price_amount, image_url, stock) VALUES ('Noise Cancelling Earbuds', 'Premium audio experience with active noise cancellation.', 'price_1Sk5aKArKFLEdb5Blswi8K8F', 8999, 'https://placehold.co/600x400/121212/e67e22?text=Earbuds', 100);
INSERT INTO products (name, description, price_id, price_amount, image_url, stock) VALUES ('Minimalist Phone Case', 'Sleek protection for your device.', 'price_1Sk5a4ArKFLEdb5BiCAw1h5f', 2999, 'https://placehold.co/600x400/121212/e67e22?text=Phone+Case', 200);
INSERT INTO products (name, description, price_id, price_amount, image_url, stock) VALUES ('Noise Canceling Earbuds', 'High-fidelity sound.', 'price_1Sk5ZhArKFLEdb5BDypxGsvy', 12999, 'https://placehold.co/600x400/121212/e67e22?text=Pro+Earbuds', 50);
