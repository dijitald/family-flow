import uuid
import azure.functions as func
import logging, json
from pydantic import InstanceOf
from sqlalchemy.orm import joinedload
from function_app_context import context
from service_models import Household, HouseholdMembership

bpMembers = func.Blueprint()

@bpMembers.route(route="memberships", methods=['GET', 'POST', 'PUT', 'DELETE'])
def membership_service(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Membership service called [%s]', req.method)
    
    if req.method == 'GET' or req.method == 'DELETE':
        try:
            uid = req.headers.get('uid')
            hid = req.headers.get('hid')
            if hid:
                hid = uuid.UUID(hid)
        except ValueError:
            return func.HttpResponse("Invalid House ID", status_code=400)
    elif req.method == 'POST' or req.method == 'PUT':
        try:
            membership_data = req.get_json()
        except ValueError:
            return func.HttpResponse("Invalid Membership Data", status_code=400)
        else:
            household_id = membership_data.get('hid')
            uid = membership_data.get('uid')
            balance = membership_data.get('balance')
            role = membership_data.get('role')
        logging.info('user_data : %s', membership_data)
        try:
            hid = uuid.UUID(household_id)
        except ValueError:
            return func.HttpResponse("Invalid House ID", status_code=400)
        
    if req.method == 'GET':
        return get_membership(hid, uid)
    elif req.method == 'DELETE':
        return delete_membership(hid, uid)
    elif req.method == 'POST':
        return create_membership(hid, uid)
    elif req.method == 'PUT':
        return update_membership(hid, uid, balance, role)
    else:
        return func.HttpResponse("Method Not Allowed", status_code=405)
    
def get_membership(hid: str, uid :str) -> func.HttpResponse:
    logging.info('get_membership equal [%s][%s] = %s', hid, context.KEY, str(hid) == str(context.KEY))
    if str(hid) == str(context.KEY):  # get all memberships  
        logging.info('getting ALL memberships')
        memberships = context.session.query(HouseholdMembership).options(joinedload(HouseholdMembership.household)).all()
        return func.HttpResponse(json.dumps([membership.to_dict() for membership in memberships], default=str), mimetype="application/json")
    elif not hid:           # get all memberships for a user
        logging.info('getting USER memberships')
        memberships = context.session.query(HouseholdMembership).filter(HouseholdMembership.user_id == uid).options(joinedload(HouseholdMembership.household)).all()
        # if memberships:
        return func.HttpResponse(json.dumps([membership.to_dict() for membership in memberships], default=str), mimetype="application/json")
        # return func.HttpResponse("{}", mimetype="application/json")
    else :                   # get a membership for a user in a household
        logging.info('getting SPECIFIC membership')
        membership = context.session.query(HouseholdMembership).filter(HouseholdMembership.household_id == hid and HouseholdMembership.user_id == uid).options(joinedload(HouseholdMembership.household)).first()
        if membership:
            return func.HttpResponse(json.dumps(membership.to_dict(), default=str), mimetype="application/json")   
        return func.HttpResponse("Membership Not Found", status_code=404)

def delete_membership(hid: str, uid :str) -> func.HttpResponse:
    membership = context.session.query(HouseholdMembership).filter(HouseholdMembership.household_id == hid and HouseholdMembership.user_id == uid).first()
    if membership:
        context.session.delete(membership)
        context.session.commit()
        membership = context.session.query(HouseholdMembership).filter(HouseholdMembership.user_id == uid).first()
        return func.HttpResponse(json.dumps(membership.to_dict(), default=str), mimetype="application/json")   
    return func.HttpResponse("Membership Not Found", status_code=404)

def create_membership(hid: str, uid: str) -> func.HttpResponse:
    logging.info('creating membership for user %s in household %s', uid, hid)
    membership = HouseholdMembership(household_id=hid, user_id=uid, role='member', balance=0)
    context.session.add(membership)
    context.session.commit()
    logging.info('membership created [%s]', json.dumps(membership.to_dict(), default=str))
    return func.HttpResponse(json.dumps(membership.to_dict(), default=str), mimetype="application/json")

def update_membership(hid: str, uid: str, balance: float, role : str) -> func.HttpResponse:
    logging.info('updating membership')
    membership = context.session.query(HouseholdMembership).filter(HouseholdMembership.household_id == hid and HouseholdMembership.user_id == uid).first()
    if membership:
        membership.balance = balance
        membership.role = role
        context.session.commit()
        logging.info('membership updated')
        return func.HttpResponse(json.dumps(membership.to_dict(), default=str), mimetype="application/json")










    # id: Mapped[int] = mapped_column(INTEGER, primary_key=True, autoincrement=True)
    # household: Mapped[Household] = relationship("Household", back_populates="users")
    # household_id: Mapped[uuid.UUID] = mapped_column(UNIQUEIDENTIFIER, ForeignKey('households.id'))
    # user: Mapped[User] = relationship("User", back_populates="households")
    # user_id: Mapped[int] = mapped_column(INTEGER, ForeignKey('users.id'))
    # role: Mapped[str] = mapped_column(NVARCHAR, default='member')
    # balance: Mapped[float] = mapped_column(FLOAT, default=0)
    # createdOn: Mapped[datetime] = mapped_column(DATETIME2, default=datetime.now)
