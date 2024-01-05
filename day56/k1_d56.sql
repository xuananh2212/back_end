--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying NOT NULL,
    email character varying,
    password character varying,
    created_at timestamp with time zone DEFAULT now(),
    update_at timestamp with time zone DEFAULT now(),
    "isAdmin" boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, created_at, update_at, "isAdmin") FROM stdin;
2	NGUYEN XUAN TUAN ANH	xuananh111@gmail.com	$2b$10$JkbX1GhalLNJFmfcyCXSNet0ZtWGqlkbEGqWxN7UZ4D0p9VNkpflq	2024-01-05 23:26:20.347543+07	2024-01-05 23:26:20.347543+07	f
3	NGUYEN XUAN TUAN ANH	xuananh11@gmail.com	$2b$10$PiHNdYaNBdTY0aNAp..kVeGDA8qhMTHgv6DdTS0aYnqaUN6V.80y6	2024-01-06 00:03:06.637437+07	2024-01-06 00:03:06.637437+07	f
4	TUAN ANH	xuananh11111@gmail.com	$2b$10$UiSO3S0A5GicDoz/u4AEyOQohkST4jdJxyDb.YS/HFNEX9k.CERyi	2024-01-06 00:10:35.91661+07	2024-01-06 00:10:35.91661+07	f
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

