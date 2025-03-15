from datetime import datetime
import azure.functions as func
import logging, json
from service_models import User
from function_app_context import context

bpUsers = func.Blueprint()

@bpUsers.route(route="users", methods=['GET', 'POST'])
def user_service(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('User service called')

    try:
        user_data = req.get_json()
    except ValueError:
        return func.HttpResponse("Invalid User Data", status_code=400)
    else:
        guid = user_data.get('userid') # msft live id
        name = user_data.get('name')
        email = user_data.get('email')
        avatarPath = user_data.get('avatarPath')
        activehousehold_id = user_data.get('activehousehold_id')

    logging.info('user_data : %s', user_data)

    if req.method == 'GET':
        if guid == context.KEY:
            logging.info('getting ALL users')
            users = context.session.query(User).all()
            return func.HttpResponse(json.dumps([user.to_dict() for user in users], default=str), mimetype="application/json")
        else:
            user = context.session.query(User).filter(User.guid == guid).first()
            # if the user is not found, the user should be created
            if not user:
                logging.info('creating new user : %s', guid)
                user = User(guid=guid, email=email, name=name.split(' ')[0])
                context.session.add(user)
                context.session.commit()
                return func.HttpResponse(json.dumps(user.to_dict(), default=str), mimetype="application/json")
            else:
                output = json.dumps(user.to_dict(), default=str)
                logging.info('user found : %s', output)
                user.lastLogon = datetime.now()
                context.session.commit()
                return func.HttpResponse(output, mimetype="application/json")

    elif req.method == 'POST':
        logging.info('updating user')
        user = context.session.query(User).filter(User.guid == guid).first()
        if not user:
            return func.HttpResponse("User Not Found", status_code=404)
        else:
            user.name = name
            user.email = email
            user.avatarPath = avatarPath
            user.activehousehold_id = activehousehold_id
            context.session.commit()
            logging.info('user found : %s', json.dumps(user.to_dict(), default=str))
            return func.HttpResponse(json.dumps(user.to_dict(), default=str), mimetype="application/json")


    # id: Mapped[int] = mapped_column(INTEGER, primary_key=True, autoincrement=True)
    # guid: Mapped[str] = mapped_column(NTEXT, nullable=False)  # liveid uuid.tenantid
    # email: Mapped[str] = mapped_column(NTEXT, nullable=False)
    # name: Mapped[str] = mapped_column(NTEXT, nullable=False, default='New User')
    # createdOn: Mapped[datetime] = mapped_column(DATETIME2, default=datetime.now)
    # lastLogon: Mapped[datetime] = mapped_column(DATETIME2)
    # avatarPath: Mapped[str] = mapped_column(NTEXT)
    # activehousehold_id: Mapped[uuid.UUID] = mapped_column(UNIQUEIDENTIFIER, ForeignKey('households.id'))
    # households: Mapped[list["HouseholdMembership"]] = relationship("HouseholdMembership", back_populates="user")
