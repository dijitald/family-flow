import os
from sqlalchemy import create_engine, ForeignKey
from sqlalchemy.orm import DeclarativeBase, relationship, mapped_column, Mapped
from sqlalchemy.dialects.mssql import (DATETIME2, FLOAT, INTEGER, NVARCHAR, UNIQUEIDENTIFIER, BIT, JSON)
from datetime import datetime
import uuid

class Base(DeclarativeBase):
    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
    # def to_dict(self):
    #     result = {}
    #     for c in self.__table__.columns:
    #         value = getattr(self, c.name)
    #         if isinstance(value, uuid.UUID):
    #             result[c.name] = str(value)
    #         else:
    #             result[c.name] = value
    #     return result

class Household(Base):
    __tablename__ = 'households'
    id: Mapped[uuid.UUID] = mapped_column(UNIQUEIDENTIFIER, primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(NVARCHAR, nullable=False)
    createdOn: Mapped[datetime] = mapped_column(DATETIME2, default=datetime.now)
    users: Mapped[list["HouseholdMembership"]] = relationship("HouseholdMembership", back_populates="household")
    tasks: Mapped[list["Task"]] = relationship("Task", back_populates="household")
    activities: Mapped[list["Activity"]] = relationship("Activity", back_populates="household")

class User(Base):
    __tablename__ = 'users'
    id: Mapped[int] = mapped_column(INTEGER, primary_key=True, autoincrement=True)
    guid: Mapped[str] = mapped_column(NVARCHAR, nullable=False)  # liveid uuid.tenantid
    email: Mapped[str] = mapped_column(NVARCHAR, nullable=False)
    name: Mapped[str] = mapped_column(NVARCHAR, nullable=False, default='New User')
    createdOn: Mapped[datetime] = mapped_column(DATETIME2, default=datetime.now)
    lastLogon: Mapped[datetime] = mapped_column(DATETIME2, nullable=True)
    avatarPath: Mapped[str] = mapped_column(NVARCHAR, nullable=True)
    activehousehold_id: Mapped[uuid.UUID] = mapped_column(UNIQUEIDENTIFIER, ForeignKey('households.id'), nullable=True)
    households: Mapped[list["HouseholdMembership"]] = relationship("HouseholdMembership", back_populates="user")
    activities: Mapped[list["Activity"]] = relationship("Activity", back_populates="user")

class HouseholdMembership(Base):
    __tablename__ = 'memberships'
    id: Mapped[int] = mapped_column(INTEGER, primary_key=True, autoincrement=True)
    household: Mapped[Household] = relationship("Household", back_populates="users")
    household_id: Mapped[uuid.UUID] = mapped_column(UNIQUEIDENTIFIER, ForeignKey('households.id'))
    user: Mapped[User] = relationship("User", back_populates="households")
    user_id: Mapped[int] = mapped_column(INTEGER, ForeignKey('users.id'))
    role: Mapped[str] = mapped_column(NVARCHAR, default='member')
    balance: Mapped[float] = mapped_column(FLOAT, default=0)
    createdOn: Mapped[datetime] = mapped_column(DATETIME2, default=datetime.now)

class Task(Base):
    __tablename__ = 'tasks'
    id: Mapped[int] = mapped_column(INTEGER, primary_key=True, autoincrement=True)
    household: Mapped[Household] = relationship("Household", back_populates="tasks")
    household_id: Mapped[uuid.UUID] = mapped_column(UNIQUEIDENTIFIER, ForeignKey('households.id'))
    name: Mapped[str] = mapped_column(NVARCHAR, nullable=False)
    description: Mapped[str] = mapped_column(NVARCHAR, nullable=True)
    active: Mapped[bool] = mapped_column(BIT, default=True)
    rewardAmount: Mapped[float] = mapped_column(FLOAT, default=0)
    lastCompleted: Mapped[datetime] = mapped_column(DATETIME2, nullable=True)
    nextDueDate: Mapped[datetime] = mapped_column(DATETIME2, nullable=True)
    createdOn: Mapped[datetime] = mapped_column(DATETIME2, default=datetime.now)
    createdBy: Mapped[str] = mapped_column(NVARCHAR, nullable=False)
    frequency: Mapped[str] = mapped_column(NVARCHAR, nullable=True)
    everyWeekday: Mapped[bool] = mapped_column(BIT, default=False)
    interval: Mapped[int] = mapped_column(INTEGER, default=0)
    dayOfWeek: Mapped[int] = mapped_column(INTEGER, default=0)
    dayOfMonth: Mapped[int] = mapped_column(INTEGER, default=0)
    instance: Mapped[int] = mapped_column(INTEGER, default=0)
    isInstanceBasedMonthly: Mapped[bool] = mapped_column(BIT, default=False)
    monthOfYear: Mapped[int] = mapped_column(INTEGER, default=0)
    isInstanceBasedYearly: Mapped[bool] = mapped_column(BIT, default=False)

class Activity(Base):
    __tablename__ = 'activities'
    id: Mapped[int] = mapped_column(INTEGER, primary_key=True, autoincrement=True)
    household: Mapped[Household] = relationship("Household", back_populates="activities")
    household_id: Mapped[uuid.UUID] = mapped_column(UNIQUEIDENTIFIER, ForeignKey('households.id'))
    date: Mapped[datetime] = mapped_column(DATETIME2, default=datetime.now)
    user: Mapped[User] = relationship("User", back_populates="activities")
    userId: Mapped[int] = mapped_column(INTEGER, ForeignKey('users.id'))
    # userName: Mapped[str] = mapped_column(NVARCHAR)
    amount: Mapped[float] = mapped_column(FLOAT, default=0)
    isCredit: Mapped[bool] = mapped_column(BIT)  # true = credit, false = debit
    description: Mapped[str] = mapped_column(NVARCHAR)
    tags: Mapped[str] = mapped_column(NVARCHAR, nullable=True)
    

# Set up SQLAlchemy
#DATABASE_URL = "mssql+pyodbc://username:password@server:1433/database?driver=ODBC+Driver+18+for+SQL+Server"
DATABASE_URL = os.getenv("DATABASE_CONNECTIONSTRING")
engine = create_engine(DATABASE_URL)
Base.metadata.create_all(engine)