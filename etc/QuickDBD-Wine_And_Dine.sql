-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/U6QITl
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE `WorldMeats` (
    `Name` varchar  NOT NULL ,
    `Country` varchar  NOT NULL ,
    `Region` varchar  NULL ,
    `Description` text  NOT NULL ,
    PRIMARY KEY (
        `Name`
    )
);

CREATE TABLE `Wineries` (
    `Winery` varchar  NOT NULL ,
    `Web` varchar  NULL ,
    `Region` varchar  NULL ,
    `Country` varchar  NOT NULL ,
    PRIMARY KEY (
        `Winery`
    )
);

CREATE TABLE `Wines` (
    `Vintage` int  NOT NULL ,
    `Country` varchar  NOT NULL ,
    `County` varchar  NULL ,
    `Designation` varchar  NULL ,
    `Points` int  NOT NULL ,
    `Price` float  NULL ,
    `Province` varchar  NOT NULL ,
    `Title` varchar  NOT NULL ,
    `Variety` varchar  NOT NULL ,
    `Winery` varchar  NOT NULL ,
    PRIMARY KEY (
        `Title`
    )
);

CREATE TABLE `WineCheesePairingData` (
    `Wine` varchar  NOT NULL ,
    `CheeseName` varchar  NOT NULL ,

    CONSTRAINT `uc_WineCheesePairingData_Wine` UNIQUE (
        `Wine`
    )
);

CREATE TABLE `CheeseData` (
    `Cheeseid` serial  NOT NULL ,
    `Name` varchar  NOT NULL ,
    `Regionid` int  NULL ,

    CONSTRAINT `uc_CheeseData_Cheeseid` UNIQUE (
        `Cheeseid`
    ),
    CONSTRAINT `uc_CheeseData_Name` UNIQUE (
        `Name`
    )
);

CREATE TABLE `Flavorlookups` (
    `Cheeseid` serial  NOT NULL ,
    `Flavorid` serial  NOT NULL 
);

CREATE TABLE `CheeseFlavors` (
    `Flavorid` serial  NOT NULL ,
    `Name` varchar  NOT NULL ,
    PRIMARY KEY (
        `Flavorid`
    )
);

ALTER TABLE `WineCheesePairingData` ADD CONSTRAINT `fk_WineCheesePairingData_CheeseName` FOREIGN KEY(`CheeseName`)
REFERENCES `CheeseData` (`Name`);

ALTER TABLE `Flavorlookups` ADD CONSTRAINT `fk_Flavorlookups_Cheeseid` FOREIGN KEY(`Cheeseid`)
REFERENCES `CheeseData` (`Cheeseid`);

ALTER TABLE `Flavorlookups` ADD CONSTRAINT `fk_Flavorlookups_Flavorid` FOREIGN KEY(`Flavorid`)
REFERENCES `CheeseFlavors` (`Flavorid`);

