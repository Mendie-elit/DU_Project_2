#################################################
# import modules
#################################################
import os
import pandas as pd
import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect, func
from flask import Flask, jsonify, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.engine.url import URL
from flaskext.mysql import MySQL
import pymysql

#################################################
# Database Setup
#################################################

app = Flask(__name__)

db_url = {
   'database': 'relationship_data_db',
   'drivername': 'mysql',
   'username': 'root',
   'password': 'Outlaw1!',
   'host': '127.0.0.1',
   'query': {'charset': 'utf8'},  # the key-point setting
}

connection_string = URL(**db_url)

app.config['SQLALCHEMY_DATABASE_URI'] = connection_string
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

#################################################
# create an object reference so sqlalchemy can reference the correct tables
#################################################

class final_employment_df(db.Model):
   __tablename__ = 'final_employment_df'
   id = db.Column('index', primary_key=True)
   case = db.Column('CASEID_NEW', db.Integer)
   age_when_met = db.Column('age_when_met', db.Integer)
   year_when_met = db.Column('Q21A_Year', db.Integer)
   year_when_married = db.Column('Q21D_Year', db.Integer)
   marital_status = db.Column('ppmarit', db.String)
   education = db.Column('ppeduc', db.String)
   ethnicity = db.Column('ppethm', db.String)
   time_till_marriage = db.Column('time_till_marriage', db.Integer)
   age_when_married = db.Column('marriage_age', db.Integer)

#################################################
# define routes
#################################################

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/data")
def ryan_data():
   respondents = final_employment_df.query.all()
   index = []
   case_id = []
   age_when_met = []
   year_when_met = []
   year_when_married = []
   marital_status = []
   education = []
   ethnicity = []
   time_till_marriage = []
   age_when_married = []

   for person in respondents:
      index.append(person.id)
      case_id.append(person.case)
      age_when_met.append(person.age_when_met)
      year_when_met.append(person.year_when_met)
      year_when_married.append(person.year_when_married)
      marital_status.append(person.marital_status)
      education.append(person.education)
      ethnicity.append(person.ethnicity)
      time_till_marriage.append(person.time_till_marriage)
      age_when_married.append(person.age_when_married)
   
   df = pd.DataFrame(list(zip(index, case_id, age_when_met, year_when_met, 
                          year_when_married, marital_status, education, 
                          ethnicity, time_till_marriage, age_when_married)), 
                  columns =['index', 'case_id', 'age_when_met', 'year_when_met',
                           'year_when_married', 'marital_status', 'education',
                           'ethnicity', 'time_till_marriage', 'age_when_married'])
   
   return jsonify(df.to_dict(orient="records"))

@app.route("/age")
def age():
    """Return the age."""
    return render_template("ryan_index.html")

@app.route("/relationship")
def relationship():
    """Return the relationship."""
    return render_template("index1.html")

@app.route("/marriage")
def marriage():
    """Return the relationship."""
    return render_template("index2.html")

if __name__ == "__main__":
    app.run()
