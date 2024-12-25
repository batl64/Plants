CREATE TABLE users (
    ID_User INT AUTO_INCREMENT PRIMARY KEY,      
    Login VARCHAR(120) NOT NULL,                
    Password VARCHAR(120) NOT NULL,              
    Email VARCHAR(120) NOT NULL                  
);

-- Таблиця для категорій
CREATE TABLE categories (
    ID_Category INT AUTO_INCREMENT PRIMARY KEY, 
    NameCategory VARCHAR(255) NOT NULL UNIQUE,         
    ID_ParentCategories int DEFAULT NULL,                    
    Level INT NOT NULL,                         
    FOREIGN KEY (ID_ParentCategories) REFERENCES Categories(ID_Category) 
);

-- Таблиця для рослин
CREATE TABLE plants (
    ID_Plant INT AUTO_INCREMENT PRIMARY KEY, 
    Name VARCHAR(120) NOT NULL,              
    PhotoURL TEXT,                           
    Area DECIMAL(10,2) NOT NULL,             
    ID_Category INT DEFAULT NULL,
    `Description` TEXT,                        
    FOREIGN KEY (ID_Category) REFERENCES Categories(ID_Category) 
);

-- Таблиця для регіонів
CREATE TABLE regions (
    ID_Region INT AUTO_INCREMENT PRIMARY KEY,  
    Name VARCHAR(255) NOT NULL UNIQUE,               
    RegionType ENUM('Область', 'Район') NOT NULL, 
    ID_ParentRegion INT DEFAULT NULL,                       
    FOREIGN KEY (ID_ParentRegion) REFERENCES Regions(ID_Region) 
);

-- Таблиця для облікових записів наявності рослин
CREATE TABLE areaplants (
    ID_AreaPlants INT AUTO_INCREMENT PRIMARY KEY, 
    ID_Region INT NOT NULL,                       
    ID_Plant INT NOT NULL,                        
    AreaSize DECIMAL(10,2) NOT NULL,             
    Date_LastUpdated DATETIME NOT NULL,           
    FOREIGN KEY (ID_Region) REFERENCES Regions(ID_Region), 
    FOREIGN KEY (ID_Plant) REFERENCES Plants(ID_Plant)     
);

ALTER TABLE `areaplants`
ADD CONSTRAINT `unique_area_region` UNIQUE (`ID_Plant`, `ID_Region`);

-- Таблиця для динаміки змін
CREATE TABLE changelogs (
    ID_AreaPlants INT NOT NULL,                
    ChangeDate DATETIME NOT NULL,               
    AreaSize DECIMAL(10,2) NOT NULL,           
    `Description` TEXT,                      
    PRIMARY KEY (ID_AreaPlants, ChangeDate),    
    FOREIGN KEY (ID_AreaPlants) REFERENCES AreaPlants(ID_AreaPlants)
);



ALTER TABLE `regions` DROP FOREIGN KEY `regions_ibfk_1`; 
ALTER TABLE `regions` ADD CONSTRAINT `regions_ibfk_1` FOREIGN KEY (`ID_ParentRegion`) REFERENCES `regions`(`ID_Region`) ON DELETE RESTRICT ON UPDATE SET NULL;
ALTER TABLE `regions` DROP FOREIGN KEY `regions_ibfk_1`; 
ALTER TABLE `regions` ADD CONSTRAINT `regions_ibfk_1` FOREIGN KEY (`ID_ParentRegion`) REFERENCES `regions`(`ID_Region`) ON DELETE SET NULL ON UPDATE SET NULL;
ALTER TABLE `categories` DROP FOREIGN KEY `categories_ibfk_1`; 
ALTER TABLE `categories` ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`ID_ParentCategories`) REFERENCES `categories`(`ID_Category`) ON DELETE SET NULL ON UPDATE SET NULL;
ALTER TABLE `areaplants` DROP FOREIGN KEY `areaplants_ibfk_1`; 
ALTER TABLE `areaplants` ADD CONSTRAINT `areaplants_ibfk_1` FOREIGN KEY (`ID_Region`) REFERENCES `regions`(`ID_Region`) ON DELETE CASCADE ON UPDATE CASCADE; 
ALTER TABLE `areaplants` DROP FOREIGN KEY `areaplants_ibfk_2`; 
ALTER TABLE `areaplants` ADD CONSTRAINT `areaplants_ibfk_2` FOREIGN KEY (`ID_Plant`) REFERENCES `plants`(`ID_Plant`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `changelogs` DROP FOREIGN KEY `changelogs_ibfk_1`; 
ALTER TABLE `changelogs` ADD CONSTRAINT `changelogs_ibfk_1` FOREIGN KEY (`ID_AreaPlants`) REFERENCES `areaplants`(`ID_AreaPlants`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `plants` DROP FOREIGN KEY `plants_ibfk_1`; 
ALTER TABLE `plants` ADD CONSTRAINT `plants_ibfk_1` FOREIGN KEY (`ID_Category`) REFERENCES `categories`(`ID_Category`) ON DELETE SET NULL ON UPDATE SET NULL;

INSERT INTO `users`( `Login`, `Password`, `Email`) VALUES ('admin','$2a$07$Dgi.L026xzobmdPe8Zz5X.VlmQttpiK37KktDwzlTaO8Cos8foLtq','admin@example.com')