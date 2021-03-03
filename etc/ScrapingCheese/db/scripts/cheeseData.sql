DROP TABLE IF EXISTS CheeseTypes
CASCADE;
CREATE TABLE CheeseTypes
(
	typeid serial PRIMARY KEY,
	Name VARCHAR(255) UNIQUE
);

DROP TABLE IF EXISTS CheeseRegions
CASCADE;
CREATE TABLE CheeseRegions
(
	regionid serial PRIMARY KEY,
	Name VARCHAR(255) UNIQUE
);

DROP TABLE IF EXISTS CheeseFlavors
CASCADE;
CREATE TABLE CheeseFlavors
(
	flavorid serial PRIMARY KEY,
	Name VARCHAR(255) UNIQUE
);

DROP TABLE IF EXISTS CheeseAromas
CASCADE;
CREATE TABLE CheeseAromas
(
	aromaid serial PRIMARY KEY,
	Name VARCHAR(255) UNIQUE
);

DROP TABLE IF EXISTS CheeseData
CASCADE;
CREATE TABLE CheeseData
(
	cheeseid serial PRIMARY KEY,
	Name VARCHAR(100) UNIQUE,
	regionId INTEGER,
	FOREIGN KEY (regionId) REFERENCES CheeseRegions(regionId)
);

DROP TABLE IF EXISTS FlavorLookups
CASCADE;
CREATE TABLE FlavorLookups
(
	cheeseid INTEGER,
	flavorid INTEGER,
	FOREIGN KEY (cheeseid) REFERENCES CheeseData(cheeseid),
	FOREIGN KEY (flavorid) REFERENCES CheeseFlavors(flavorid)
);

DROP TABLE IF EXISTS AromaLookups
CASCADE;
CREATE TABLE AromaLookups
(
	cheeseid INTEGER,
	aromaid INTEGER,
	FOREIGN KEY (cheeseid) REFERENCES CheeseData(cheeseid),
	FOREIGN KEY (aromaid) REFERENCES CheeseAromas(aromaid)
);

DROP TABLE IF EXISTS TypeLookups
CASCADE;
CREATE TABLE TypeLookups
(
	cheeseid INTEGER,
	typeid INTEGER,
	FOREIGN KEY (cheeseid) REFERENCES CheeseData(cheeseid),
	FOREIGN KEY (typeid) REFERENCES CheeseTypes(typeid)
);