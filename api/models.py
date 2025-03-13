import os
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Float, ForeignKey, Text, Uuid, Sequence
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime
import uuid

Base = declarative_base()

class Household(Base):
    __tablename__ = 'households'
    id = Column(Uuid, primary_key=True, default=uuid.uuid4())
    name = Column(String, nullable=False)
    createdOn = Column(DateTime, default=datetime.now)
    categories = Column(Sequence(String))
    users = relationship('User', backref='households')

class User(Base):
    __tablename__ = 'users'
    id = Column(String, unique=True, primary_key=True)  #live id guid
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False, default='New User')
    # activehouseholdid = Column(Uuid, ForeignKey('households.id'))
    # activehouseholdname = Column(String)
    # activehouseholdrole = Column(String, default='member')
    # activehouseholdbalance = Column(Float, default=0)
    createdOn = Column(DateTime, default=datetime.now)
    lastLogon = Column(DateTime)
    households = Column(Sequence(String)) # List of household ID||Name||Role||Balance
#    image = Column(String)

class Chore(Base):
    __tablename__ = 'chores'
    id = Column(Integer, primary_key=True)
    householdId = Column(Uuid, ForeignKey('households.id'))
    name = Column(String, nullable=False)
    description = Column(Text)
    active = Column(Boolean, default=True)
    rewardAmount = Column(Float, default=0)
    lastCompleted = Column(DateTime)
    nextDueDate = Column(DateTime)
    createdOn = Column(DateTime, default=datetime.now)
    createdBy = Column(String, nullable=False)
    modifiedOn = Column(DateTime)
    modifiedBy = Column(String)
    frequency = Column(String)
    everyWeekday = Column(Boolean, default=False)
    interval = Column(Integer, default=0)
    dayOfWeek = Column(Integer, default=0)
    dayOfMonth = Column(Integer, default=0)
    instance = Column(Integer, default=0)
    isInstanceBasedMonthly = Column(Boolean, default=False)
    monthOfYear = Column(Integer, default=0)
    isInstanceBasedYearly = Column(Boolean, default=False)

class Activity(Base):
    __tablename__ = 'activities'
    id = Column(Integer, primary_key=True)
    date = Column(DateTime, default=datetime.now)
    createdById = Column(Integer, ForeignKey('users.id'))
    createdByUsername = Column(String, nullable=False)
    amount = Column(Float)
    description = Column(Text)
    category = Column(String)
    approved = Column(Boolean, default=False)
#    images = Column(Text)

# Set up SQLAlchemy
#AZURE_SQL_CONNECTIONSTRING='Driver={ODBC Driver 18 for SQL Server};Server=tcp:<database-server-name>.database.windows.net,1433;Database=<database-name>;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30'
#DATABASE_URL = "mssql+pyodbc://username:password@server/database?driver=ODBC+Driver+17+for+SQL+Server"
DATABASE_URL = os.environ["AZURE_SQL_CONNECTIONSTRING"]
engine = create_engine(DATABASE_URL)
Base.metadata.create_all(engine)