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
-- Name: drivers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.drivers (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    car integer,
    current_race integer
);


--
-- Name: drivers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.drivers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: drivers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.drivers_id_seq OWNED BY public.drivers.id;


--
-- Name: global_state; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.global_state (
    id integer NOT NULL,
    mode character varying(50) DEFAULT 'DANGER'::character varying
);


--
-- Name: global_state_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.global_state_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: global_state_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.global_state_id_seq OWNED BY public.global_state.id;


--
-- Name: lap_times; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lap_times (
    id integer NOT NULL,
    driver_id integer,
    race_id integer,
    lap_time integer,
    lap_number integer
);


--
-- Name: lap_times_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lap_times_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: lap_times_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lap_times_id_seq OWNED BY public.lap_times.id;


--
-- Name: races; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.races (
    id integer NOT NULL,
    start_time timestamp without time zone,
    drivers integer[],
    remaining_time integer,
    status character varying(50) DEFAULT 'WAITING'::character varying
);


--
-- Name: races_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.races_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: races_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.races_id_seq OWNED BY public.races.id;


--
-- Name: drivers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.drivers ALTER COLUMN id SET DEFAULT nextval('public.drivers_id_seq'::regclass);


--
-- Name: global_state id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.global_state ALTER COLUMN id SET DEFAULT nextval('public.global_state_id_seq'::regclass);


--
-- Name: lap_times id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lap_times ALTER COLUMN id SET DEFAULT nextval('public.lap_times_id_seq'::regclass);


--
-- Name: races id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.races ALTER COLUMN id SET DEFAULT nextval('public.races_id_seq'::regclass);


--
-- Name: drivers drivers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_pkey PRIMARY KEY (id);


--
-- Name: global_state global_state_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.global_state
    ADD CONSTRAINT global_state_pkey PRIMARY KEY (id);


--
-- Name: lap_times lap_times_driver_id_race_id_lap_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lap_times
    ADD CONSTRAINT lap_times_driver_id_race_id_lap_number_key UNIQUE (driver_id, race_id, lap_number);


--
-- Name: lap_times lap_times_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lap_times
    ADD CONSTRAINT lap_times_pkey PRIMARY KEY (id);


--
-- Name: races races_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.races
    ADD CONSTRAINT races_pkey PRIMARY KEY (id);


--
-- Name: drivers drivers_current_race_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_current_race_fkey FOREIGN KEY (current_race) REFERENCES public.races(id);


--
-- Name: lap_times lap_times_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lap_times
    ADD CONSTRAINT lap_times_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id);


--
-- Name: lap_times lap_times_race_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lap_times
    ADD CONSTRAINT lap_times_race_id_fkey FOREIGN KEY (race_id) REFERENCES public.races(id);


--
-- PostgreSQL database dump complete
--

