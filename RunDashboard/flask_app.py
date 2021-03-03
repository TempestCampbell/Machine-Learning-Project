from flask import Flask, jsonify,  make_response, after_this_request, render_template, redirect, request
from flask_sqlalchemy import SQLAlchemy
import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from config import pw


################################################
# Database Setup
################################################

engine = create_engine(f"postgresql://postgres:{pw}@localhost:5432/WineAndDined")

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
CheeseFlavors = Base.classes.cheeseflavors
CheeseData = Base.classes.cheesedata
FlavorLookups = Base.classes.flavorlookups
WineCheesePairingData = Base.classes.winecheesepairingdata
Wines = Base.classes.wines
Wineries = Base.classes.wineries
WorldMeats = Base.classes.worldmeats

# Create session
session=Session(engine)
################################################
# Flask Setup
#################################################
# Create an instance of Flask
app = Flask(__name__)

# Use flask_sqlalchemy to set up sql connection locally
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://postgres:{pw}@localhost:5432/WineAndDined'
db = SQLAlchemy(app)

@app.route("/")
def index():
    
        # """List all available api routes."""
        # return (
        #     f"Welcome to the Wine API! <br/>"
        #     f"Available Routes:<br/>"
        #     f"For country and recurrence number:<br/>"
        #     f"/api/v1.0/world<br/>"
        #     f"For top 100 of 'filter' for 'country': <br/>"
        #     f"/api/v1.0/buildtable/<countryIn>/<dropDown><br/>"
        # )
    return render_template("index.html", title='Wine and Dine')

@app.route("/api/v1.0/world")
def world():
    session = Session(engine)
    """Query to retrieve the country and the number of wines associated with each."""
    countryCount=session.query(Wines.country, func.count(Wines.country)).group_by(Wines.country).order_by(func.count(Wines.country).desc()).all()
    
    countryDict=[]
    for country, count in countryCount:
        country_dict={}
        country_dict["country"]=country
        country_dict["count"]=count
        countryDict.append(country_dict)

    @after_this_request
    def _add_header(response):
        response.headers.add("Access-Control-Allow-Origin","*")
        return response
    session.close()
    return jsonify(countryDict)

@app.route("/api/v1.0/buildtable/<countryIn>", methods=['GET'])
@app.route("/api/v1.0/buildtable/<countryIn>/<dropDown>", methods=['GET'])
def buildtable(countryIn=None,dropDown=None):

    session = Session(engine)
    """Return Wine country, points, price, title, variety, and vintage for a specified country and filter."""

    spl=countryIn.split(" ")
    if len(spl)==1:
        countryIn=countryIn.title()
    else:
        countryIn=spl[0].capitalize()+" "+spl[1].capitalize()    


    if dropDown==None:
        tableQ=session.query(Wines.country, Wines.points, Wines.price, Wines.title, Wines.variety, Wines.vintage).filter(Wines.country==countryIn).order_by(Wines.points.desc()).limit(100)
    
    else:
        if dropDown == "HighestRated":
            tableQ=session.query(Wines.country, Wines.points, Wines.price, Wines.title, Wines.variety, Wines.vintage).filter(Wines.country==countryIn).order_by(Wines.points.desc()).limit(100)
        elif dropDown == "LowestRated":
            tableQ=session.query(Wines.country, Wines.points, Wines.price, Wines.title, Wines.variety, Wines.vintage).filter(Wines.country==countryIn).order_by(Wines.points).limit(100)
        elif dropDown == "Cheapest":
            tableQ=session.query(Wines.country, Wines.points, Wines.price, Wines.title, Wines.variety, Wines.vintage).filter(Wines.country==countryIn).order_by(Wines.price).limit(100)
        elif dropDown == "MostExpensive":
            tableQ=session.query(Wines.country, Wines.points, Wines.price, Wines.title, Wines.variety, Wines.vintage).filter(Wines.country==countryIn, Wines.price!=None).order_by(Wines.price.desc()).limit(100)
        elif dropDown == "NewestVintage":
            tableQ=session.query(Wines.country, Wines.points, Wines.price, Wines.title, Wines.variety, Wines.vintage).filter(Wines.country==countryIn).order_by(Wines.vintage.desc()).limit(100)
        elif dropDown == "OldestVintage":
            tableQ=session.query(Wines.country, Wines.points, Wines.price, Wines.title, Wines.variety, Wines.vintage).filter(Wines.country==countryIn).order_by(Wines.vintage).limit(100)

    # Set up dictionary
    orderDict=[]
    for country, points, price, title, variety, vintage in tableQ:
        order_dict={}
        order_dict["country"]=country
        order_dict["points"]=points
        order_dict["price"]=price
        order_dict["title"]=title
        order_dict["variety"]=variety
        order_dict["vintage"]=vintage
        orderDict.append(order_dict)

    session.close()
    print(orderDict)
    return jsonify(orderDict)

@app.route("/api/v1.0/cheesepair/<variety>")
def cheesepair(variety):
    """Returns the cheese ID given a varietal."""
    print(variety)
    spl=variety.split(" ")
    if len(spl)==1:
        variety=variety.title()
    else:
        variety=spl[0].capitalize()+" "+spl[1].capitalize()   
    print(variety)

    # Handle naming differences:
    if variety=='Cabernet Sauvignon':
        variety='Cabernet'
    elif variety=='Bordeaux-style Red':
        variety='Bordeaux'
    
    cheeseID=session.query(FlavorLookups.flavorid, FlavorLookups.cheeseid).filter(FlavorLookups.cheeseid==session.query(CheeseData.cheeseid).filter(CheeseData.name==session.query(WineCheesePairingData.cheesename).filter(WineCheesePairingData.wine==variety)))
    justFlavors=[]
    for flavorid, cheeseid in cheeseID:
        justFlavors.append(flavorid)
    
    cheeseFlav=session.query(FlavorLookups.cheeseid,FlavorLookups.flavorid).filter(FlavorLookups.flavorid.in_(justFlavors))
    justIDS=[]
    for cheeseid, flavorid in cheeseFlav:
        justIDS.append(cheeseid)


    cheeseNames=session.query(CheeseData.name, CheeseData.cheeseid).filter(CheeseData.cheeseid.in_(justIDS)).limit(5)
    cnDict=[]
    for name, cheeseid in cheeseNames:
        cn_dic={}
        cn_dic["name"]=name
        cn_dic["cheeseid"]=cheeseid
        cnDict.append(cn_dic)
    

    return jsonify(cnDict)


@app.route("/api/v1.0/meatpair/<countryIn>")
def meatpair(countryIn):
    """Returns a suggested meat pairing for the wine."""
    
    print("here", countryIn)
    spl=countryIn.split(" ")
    if len(spl)==1:
        countryIn=countryIn.title()
    else:
        countryIn=spl[0].capitalize()+" "+spl[1].capitalize()    
    print("after", countryIn)

    if countryIn=='United States':
        countryIn="US"

    meatPair=session.query(WorldMeats.name, WorldMeats.region, WorldMeats.description).filter(WorldMeats.country==countryIn).limit(5)

    meatDict=[]
    for name, region, description in meatPair:
        meat_dict={}
        meat_dict["name"]=name
        meat_dict["region"]=region
        meat_dict["description"]=description
        meatDict.append(meat_dict)
    return jsonify(meatDict)

if __name__ == '__main__':
    app.run(debug=True)