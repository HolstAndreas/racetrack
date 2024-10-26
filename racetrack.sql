--
-- PostgreSQL database dump
--

-- Dumped from database version 14.13 (Ubuntu 14.13-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.13 (Ubuntu 14.13-0ubuntu0.22.04.1)

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
-- Name: drivers; Type: TABLE; Schema: public; Owner: andreas
--

CREATE TABLE public.drivers (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    car integer,
    current_race integer
);


ALTER TABLE public.drivers OWNER TO andreas;

--
-- Name: drivers_id_seq; Type: SEQUENCE; Schema: public; Owner: andreas
--

CREATE SEQUENCE public.drivers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.drivers_id_seq OWNER TO andreas;

--
-- Name: drivers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: andreas
--

ALTER SEQUENCE public.drivers_id_seq OWNED BY public.drivers.id;


--
-- Name: lap_times; Type: TABLE; Schema: public; Owner: andreas
--

CREATE TABLE public.lap_times (
    id integer NOT NULL,
    driver_id integer,
    race_id integer,
    lap_time integer,
    lap_number integer
);


ALTER TABLE public.lap_times OWNER TO andreas;

--
-- Name: lap_times_id_seq; Type: SEQUENCE; Schema: public; Owner: andreas
--

CREATE SEQUENCE public.lap_times_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lap_times_id_seq OWNER TO andreas;

--
-- Name: lap_times_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: andreas
--

ALTER SEQUENCE public.lap_times_id_seq OWNED BY public.lap_times.id;


--
-- Name: races; Type: TABLE; Schema: public; Owner: andreas
--

CREATE TABLE public.races (
    id integer NOT NULL,
    start_time timestamp without time zone,
    drivers integer[],
    remaining_time integer DEFAULT 600,
    status character varying(50) DEFAULT 'WAITING'::character varying,
    mode character varying(50) DEFAULT 'DANGER'::character varying
);


ALTER TABLE public.races OWNER TO andreas;

--
-- Name: races_id_seq; Type: SEQUENCE; Schema: public; Owner: andreas
--

CREATE SEQUENCE public.races_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.races_id_seq OWNER TO andreas;

--
-- Name: races_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: andreas
--

ALTER SEQUENCE public.races_id_seq OWNED BY public.races.id;


--
-- Name: drivers id; Type: DEFAULT; Schema: public; Owner: andreas
--

ALTER TABLE ONLY public.drivers ALTER COLUMN id SET DEFAULT nextval('public.drivers_id_seq'::regclass);


--
-- Name: lap_times id; Type: DEFAULT; Schema: public; Owner: andreas
--

ALTER TABLE ONLY public.lap_times ALTER COLUMN id SET DEFAULT nextval('public.lap_times_id_seq'::regclass);


--
-- Name: races id; Type: DEFAULT; Schema: public; Owner: andreas
--

ALTER TABLE ONLY public.races ALTER COLUMN id SET DEFAULT nextval('public.races_id_seq'::regclass);


--
-- Data for Name: drivers; Type: TABLE DATA; Schema: public; Owner: andreas
--

COPY public.drivers (id, name, car, current_race) FROM stdin;
4	Lewis Hamilton	\N	\N
6	Mihkel	\N	\N
9	John Pork	\N	\N
1	Jaan Kood	1	1
3	Lewis Hamilton	3	\N
5	Mihkel	2	\N
\.


--
-- Data for Name: lap_times; Type: TABLE DATA; Schema: public; Owner: andreas
--

COPY public.lap_times (id, driver_id, race_id, lap_time, lap_number) FROM stdin;
\.


--
-- Data for Name: races; Type: TABLE DATA; Schema: public; Owner: andreas
--

COPY public.races (id, start_time, drivers, remaining_time, status, mode) FROM stdin;
1	\N	{1}	600	WAITING	DANGER
11	\N	{1}	0	WAITING	DANGER
12	\N	{1,3}	600	WAITING	DANGER
6	2024-10-22 13:23:44.933197	{1,3,5,9,4}	600	WAITING	DANGER
8	\N	{1,3,4,5,6}	600	WAITING	DANGER
9	\N	{1,3,4,5,6}	600	WAITING	DANGER
10	\N	{1,3,4,5,6}	600	WAITING	DANGER
7	\N	{1,3,4,5,6,9}	600	WAITING	DANGER
\.


--
-- Name: drivers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: andreas
--

SELECT pg_catalog.setval('public.drivers_id_seq', 12, true);


--
-- Name: lap_times_id_seq; Type: SEQUENCE SET; Schema: public; Owner: andreas
--

SELECT pg_catalog.setval('public.lap_times_id_seq', 1, false);


--
-- Name: races_id_seq; Type: SEQUENCE SET; Schema: public; Owner: andreas
--

SELECT pg_catalog.setval('public.races_id_seq', 12, true);


--
-- Name: drivers drivers_pkey; Type: CONSTRAINT; Schema: public; Owner: andreas
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_pkey PRIMARY KEY (id);


--
-- Name: lap_times lap_times_driver_id_race_id_lap_number_key; Type: CONSTRAINT; Schema: public; Owner: andreas
--

ALTER TABLE ONLY public.lap_times
    ADD CONSTRAINT lap_times_driver_id_race_id_lap_number_key UNIQUE (driver_id, race_id, lap_number);


--
-- Name: lap_times lap_times_pkey; Type: CONSTRAINT; Schema: public; Owner: andreas
--

ALTER TABLE ONLY public.lap_times
    ADD CONSTRAINT lap_times_pkey PRIMARY KEY (id);


--
-- Name: races races_pkey; Type: CONSTRAINT; Schema: public; Owner: andreas
--

ALTER TABLE ONLY public.races
    ADD CONSTRAINT races_pkey PRIMARY KEY (id);


--
-- Name: drivers drivers_current_race_fkey; Type: FK CONSTRAINT; Schema: public; Owner: andreas
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_current_race_fkey FOREIGN KEY (current_race) REFERENCES public.races(id);


--
-- Name: lap_times lap_times_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: andreas
--

ALTER TABLE ONLY public.lap_times
    ADD CONSTRAINT lap_times_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id);


--
-- Name: lap_times lap_times_race_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: andreas
--

ALTER TABLE ONLY public.lap_times
    ADD CONSTRAINT lap_times_race_id_fkey FOREIGN KEY (race_id) REFERENCES public.races(id);


--
-- PostgreSQL database dump complete
--

