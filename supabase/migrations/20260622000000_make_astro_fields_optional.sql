-- Migration: Make astro detail fields optional
-- Description: Removes the NOT NULL constraints from dob, birth_time, birth_place, zodiac_sign, and birth_star.

-- Alter customers table
ALTER TABLE customers ALTER COLUMN dob DROP NOT NULL;
ALTER TABLE customers ALTER COLUMN birth_time DROP NOT NULL;
ALTER TABLE customers ALTER COLUMN birth_place DROP NOT NULL;
ALTER TABLE customers ALTER COLUMN zodiac_sign DROP NOT NULL;
ALTER TABLE customers ALTER COLUMN birth_star DROP NOT NULL;

-- Alter astro_cards table
ALTER TABLE astro_cards ALTER COLUMN full_name DROP NOT NULL;
ALTER TABLE astro_cards ALTER COLUMN dob DROP NOT NULL;
ALTER TABLE astro_cards ALTER COLUMN birth_time DROP NOT NULL;
ALTER TABLE astro_cards ALTER COLUMN birth_place DROP NOT NULL;
ALTER TABLE astro_cards ALTER COLUMN zodiac_sign DROP NOT NULL;
ALTER TABLE astro_cards ALTER COLUMN birth_star DROP NOT NULL;
