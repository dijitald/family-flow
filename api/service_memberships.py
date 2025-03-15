import uuid
import azure.functions as func
import logging, json
from service_models import HouseholdMembership, User
from function_app_context import context

bpMembers = func.Blueprint()

@bpMembers.route(route="memberships", methods=['GET', 'POST'])
def membership_service(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Membership service called')
    try:
        membership_data = req.get_json()
    except ValueError:
        return func.HttpResponse("Invalid Membership Data", status_code=400)
    else:
        household_id = membership_data.get('household_id')
        user_id = membership_data.get('user_id')
        balance = membership_data.get('balance')
        role = membership_data.get('role')
    logging.info('user_data : %s', membership_data)
    try:
        idHome = uuid.UUID(household_id)
    except ValueError:
        return func.HttpResponse("Invalid House ID", status_code=400)

    if req.method == 'GET':
        if household_id == context.KEY:
            logging.info('getting ALL memberships')
            memberships = context.session.query(HouseholdMembership).all()
            return func.HttpResponse(json.dumps([membership.to_dict() for membership in memberships], default=str), mimetype="application/json")
        else:
            membership = context.session.query(HouseholdMembership).filter(HouseholdMembership.household_id == idHome and HouseholdMembership.user_id == user_id).first()
            if membership:
                return func.HttpResponse(json.dumps(membership.to_dict(), default=str), mimetype="application/json")   
            return func.HttpResponse("Membership Not Found", status_code=404)

    elif req.method == 'POST':
        logging.info('creating/updating membership')
        membership = context.session.query(HouseholdMembership).filter(HouseholdMembership.household_id == idHome and HouseholdMembership.user_id == user_id).first()
        if membership:
            membership.balance = balance
            membership.role = role
            context.session.commit()
            logging.info('membership updated')
            return func.HttpResponse(json.dumps(membership.to_dict(), default=str), mimetype="application/json")
        else:
            membership = HouseholdMembership(household_id=idHome, user_id=user_id, balance=balance, role=role)
            context.session.add(membership)
            context.session.commit()
            logging.info('membership created')
            return func.HttpResponse(json.dumps(membership.to_dict(), default=str), mimetype="application/json")










    # id: Mapped[int] = mapped_column(INTEGER, primary_key=True, autoincrement=True)
    # household: Mapped[Household] = relationship("Household", back_populates="users")
    # household_id: Mapped[uuid.UUID] = mapped_column(UNIQUEIDENTIFIER, ForeignKey('households.id'))
    # user: Mapped[User] = relationship("User", back_populates="households")
    # user_id: Mapped[int] = mapped_column(INTEGER, ForeignKey('users.id'))
    # role: Mapped[str] = mapped_column(NVARCHAR, default='member')
    # balance: Mapped[float] = mapped_column(FLOAT, default=0)
    # createdOn: Mapped[datetime] = mapped_column(DATETIME2, default=datetime.now)
