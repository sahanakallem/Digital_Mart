-- Table: public.credentials

-- DROP TABLE IF EXISTS public.credentials;

CREATE TABLE IF NOT EXISTS public.credentials
(
    unique_id character varying COLLATE pg_catalog."default" NOT NULL,
    password character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT credentials_pkey1 PRIMARY KEY (unique_id),
    CONSTRAINT "Fkey_cred" FOREIGN KEY (unique_id)
        REFERENCES public.customer (customeruniqueid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.credentials
    OWNER to postgres;

-- Table: public.credentials_admin

-- DROP TABLE IF EXISTS public.credentials_admin;

CREATE TABLE IF NOT EXISTS public.credentials_admin
(
    username character varying(32) COLLATE pg_catalog."default" NOT NULL,
    password character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT credentials_pkey PRIMARY KEY (username)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.credentials_admin
    OWNER to postgres;
-- Table: public.customer

-- DROP TABLE IF EXISTS public.customer;

CREATE TABLE IF NOT EXISTS public.customer
(
    customerid character varying(32) COLLATE pg_catalog."default" NOT NULL,
    customeruniqueid character varying(32) COLLATE pg_catalog."default" NOT NULL,
    zipcode integer NOT NULL,
    city character varying(32) COLLATE pg_catalog."default" NOT NULL,
    state character varying(2) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT customer_pkey PRIMARY KEY (customerid),
    CONSTRAINT unique_id_cust UNIQUE (customeruniqueid)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.customer
    OWNER to postgres;
-- Table: public.order_details

-- DROP TABLE IF EXISTS public.order_details;

CREATE TABLE IF NOT EXISTS public.order_details
(
    orderid character varying(32) COLLATE pg_catalog."default" NOT NULL,
    customerid character varying(32) COLLATE pg_catalog."default" NOT NULL,
    orderstatus character varying(11) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT order_details_pkey PRIMARY KEY (orderid),
    CONSTRAINT "Fkey_order_details_customer" FOREIGN KEY (customerid)
        REFERENCES public.customer (customerid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.order_details
    OWNER to postgres;
-- Table: public.order_timestamps

-- DROP TABLE IF EXISTS public.order_timestamps;

CREATE TABLE IF NOT EXISTS public.order_timestamps
(
    orderid character varying(32) COLLATE pg_catalog."default" NOT NULL,
    orderpurchasetimestamp character varying(14) COLLATE pg_catalog."default",
    orderapprovedat character varying(14) COLLATE pg_catalog."default",
    orderdeliveredcustomerdate character varying(14) COLLATE pg_catalog."default",
    orderestimateddeliverydate character varying(13) COLLATE pg_catalog."default",
    CONSTRAINT order_timestamps_pkey PRIMARY KEY (orderid),
    CONSTRAINT order_timestamps_orderid_fkey FOREIGN KEY (orderid)
        REFERENCES public.order_details (orderid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.order_timestamps
    OWNER to postgres;

-- Table: public.orders

-- DROP TABLE IF EXISTS public.orders;

CREATE TABLE IF NOT EXISTS public.orders
(
    orderid character varying(32) COLLATE pg_catalog."default" NOT NULL,
    orderitemid integer NOT NULL,
    productid character varying(32) COLLATE pg_catalog."default" NOT NULL,
    sellerid character varying(32) COLLATE pg_catalog."default" NOT NULL,
    price numeric(7,2) NOT NULL,
    freightvalue numeric(6,2) NOT NULL,
    CONSTRAINT orders_pkey PRIMARY KEY (orderid, orderitemid),
    CONSTRAINT "Fkey_orders_order_details" FOREIGN KEY (orderid)
        REFERENCES public.order_details (orderid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "Fkey_orders_products" FOREIGN KEY (productid)
        REFERENCES public.products (productid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "Fkey_orders_sellers" FOREIGN KEY (sellerid)
        REFERENCES public.sellers (sellerid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.orders
    OWNER to postgres;
-- Index: idx_order_details_productid

-- DROP INDEX IF EXISTS public.idx_order_details_productid;

CREATE INDEX IF NOT EXISTS idx_order_details_productid
    ON public.orders USING btree
    (productid COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: index_order_details_productid

-- DROP INDEX IF EXISTS public.index_order_details_productid;

CREATE INDEX IF NOT EXISTS index_order_details_productid
    ON public.orders USING btree
    (productid COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Table: public.payments

-- DROP TABLE IF EXISTS public.payments;

CREATE TABLE IF NOT EXISTS public.payments
(
    orderid character varying(32) COLLATE pg_catalog."default" NOT NULL,
    paymenttype character varying(11) COLLATE pg_catalog."default" NOT NULL,
    paymentinstallments integer NOT NULL,
    paymentvalue numeric(8,2) NOT NULL,
    paymentid character varying(41) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT payments_pkey PRIMARY KEY (paymentid),
    CONSTRAINT "Fkey_payments_order_details" FOREIGN KEY (orderid)
        REFERENCES public.order_details (orderid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.payments
    OWNER to postgres;
-- Table: public.product_category_translation

-- DROP TABLE IF EXISTS public.product_category_translation;

CREATE TABLE IF NOT EXISTS public.product_category_translation
(
    productcategoryname character varying(46) COLLATE pg_catalog."default" NOT NULL,
    productcategorynameenglish character varying(39) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT product_category_translation_pkey PRIMARY KEY (productcategoryname)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.product_category_translation
    OWNER to postgres;
-- Table: public.products

-- DROP TABLE IF EXISTS public.products;

CREATE TABLE IF NOT EXISTS public.products
(
    productid character varying(32) COLLATE pg_catalog."default" NOT NULL,
    productcategoryname character varying(46) COLLATE pg_catalog."default",
    productweight integer,
    productlength integer,
    productheight integer,
    productwidth integer,
    CONSTRAINT products_pkey PRIMARY KEY (productid),
    CONSTRAINT "Fkey_products_product_category_translation" FOREIGN KEY (productcategoryname)
        REFERENCES public.product_category_translation (productcategoryname) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.products
    OWNER to postgres;
-- Table: public.reviews

-- DROP TABLE IF EXISTS public.reviews;

CREATE TABLE IF NOT EXISTS public.reviews
(
    reviewid character varying(32) COLLATE pg_catalog."default" NOT NULL,
    orderid character varying(32) COLLATE pg_catalog."default" NOT NULL,
    reviewscore integer NOT NULL,
    CONSTRAINT reviews_pkey PRIMARY KEY (reviewid),
    CONSTRAINT "Fkey_reviews_order_details" FOREIGN KEY (orderid)
        REFERENCES public.order_details (orderid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.reviews
    OWNER to postgres;
-- Index: idx_reviews_orderid

-- DROP INDEX IF EXISTS public.idx_reviews_orderid;

CREATE INDEX IF NOT EXISTS idx_reviews_orderid
    ON public.reviews USING btree
    (orderid COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: index_reviews_orderid

-- DROP INDEX IF EXISTS public.index_reviews_orderid;

CREATE INDEX IF NOT EXISTS index_reviews_orderid
    ON public.reviews USING btree
    (orderid COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Table: public.sellers

-- DROP TABLE IF EXISTS public.sellers;

CREATE TABLE IF NOT EXISTS public.sellers
(
    sellerid character varying(32) COLLATE pg_catalog."default" NOT NULL,
    sellerzipcode integer NOT NULL,
    sellercity character varying(40) COLLATE pg_catalog."default" NOT NULL,
    sellerstate character varying(2) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT sellers_pkey PRIMARY KEY (sellerid)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.sellers
    OWNER to postgres;