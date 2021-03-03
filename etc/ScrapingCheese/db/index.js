const {Sequelize, Model, DataTypes} = require("sequelize");
const { dbname,username, password} = require("../Passwords/db");

const sequelize = new Sequelize(dbname, username, password, {
    host: "localhost",
    dialect: "postgres",
    define: {
        timestamps: false
    },
    pool: {
        max: 50,
        min: 0,
        acquire: 300000,
        idle: 100000
    }
});
const urlDB = new Sequelize("WineCharcuterieDB", username, password, {
    host: "localhost",
    dialect: "postgres",
    define: {
        timestamps: false
    },
    pool: {
        max: 50,
        min: 0,
        acquire: 300000,
        idle: 100000
    }
});

const CheeseURL = urlDB.define("cheeseurls", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

const CheeseType = sequelize.define("cheesetypes", {
    typeid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

const CheeseRegion = sequelize.define("cheeseregions", {
    regionid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});
const CheeseFlavor = sequelize.define("cheeseflavors", {
    flavorid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

const CheeseAroma = sequelize.define("cheesearomas", {
    aromaid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});
const CheeseData = sequelize.define("cheesedata", {
    cheeseid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    regionid: {
        type: DataTypes.INTEGER,
        references: {
            model: CheeseRegion,
            key: "regionid"
        },
        onDelete: "CASCADE"
    }
});

const FlavorLookup = sequelize.define("flavorlookups", {
    cheeseid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: CheeseData,
            key: "cheeseid"
        }
    },
    flavorid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: CheeseFlavor,
            key: "flavorid"
        }
    }
});
const AromaLookup = sequelize.define("aromalookups", {
    cheeseid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: CheeseData,
            key: "cheeseid"
        }
    },
    aromaid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: CheeseAroma,
            key: "aromaid"
        }
    }
});

const TypeLookup = sequelize.define("typelookups", {
    cheeseid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: CheeseData,
            key: "cheeseid"
        }
    },
    typeid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: CheeseType,
            key: "typeid"
        }
    }
});
//define one to many between region and data
CheeseRegion.hasMany(CheeseData, {foreignKey: "regionid"});
CheeseData.belongsTo(CheeseRegion, {foreignKey: "regionid"});
//define many to many between data, type through typelookup
CheeseType.belongsToMany(CheeseData, {through: TypeLookup, foreignKey: "typeid"});
CheeseData.belongsToMany(CheeseType, {through: TypeLookup, foreignKey: "cheeseid"});
//define many to many between data, flavor through flavorlookup
CheeseData.belongsToMany(CheeseFlavor, {through: FlavorLookup, foreignKey: "cheeseid"});
CheeseFlavor.belongsToMany(CheeseData, {through: FlavorLookup, foreignKey: "flavorid"});
//define many to many between data, aroma through aromalookup
CheeseData.belongsToMany(CheeseAroma, {through: AromaLookup, foreignKey: "cheeseid"});
CheeseAroma.belongsToMany(CheeseData, {through: AromaLookup, foreignKey: "aromaid"});

async function checkIfDbConnected() {
    try {
        await sequelize.authenticate();
        console.log("connection has been established successfully");
    } catch (error) {
        console.error("unable to connect to the database" + error);
    }
}
//get all cheeseurls
const selectAllUrls = async function () {
    return urlDB.query("SELECT * FROM cheeseurls");
};

checkIfDbConnected();

module.exports = {
    CheeseURL,
    selectAllUrls,
    CheeseData,
    CheeseAroma,
    CheeseFlavor,
    CheeseType,
    CheeseRegion,
    sequelize
};
