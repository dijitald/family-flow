import azure.functions as func
import logging
import json
from sqlalchemy.orm import sessionmaker
# from models import engine, Household, User, Chore, Activity
from models import User

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)
# Session = sessionmaker(bind=engine)
# session = Session()

# @app.route('/households', methods=['POST'])
# def add_household(req: func.HttpRequest):
#     logging.info('add_household called')
#     # household_data = req.get_json()
#     household_data = req.params.get('name')
#     logging.info('data received: %s', household_data)
#     # new_household = Household(name=household_data['name'])
#     new_household = Household(name=household_data)
#     session.add(new_household)
#     session.commit()
#     logging.info('household saved : %s', json.dumps(new_household.__dict__))
#     return func.HttpResponse(json.dumps(new_household.__dict__), mimetype="application/json")

# @app.route('/households', methods=['GET'])
# def get_households(req: func.HttpRequest):
#     logging.info('get_households called')
#     householdid = req.params.get('id')

#     if householdid == '000111000111':
#         households = session.query(Household).all()
#         return func.HttpResponse(json.dumps([household.__dict__ for household in households]), mimetype="application/json")
#     elif householdid:
#         household = session.query(Household).filter(Household.id == householdid).first()
#         return func.HttpResponse(json.dumps(household.__dict__), mimetype="application/json")
#     else:
#         return func.HttpResponse("No household id provided", status_code=400)

# @app.route('/users', methods=['GET'])
# def get_users():
#     logging.info('get_users called')
#     users = session.query(User).all()
#     return func.HttpResponse(json.dumps([user.__dict__ for user in users]), mimetype="application/json")

# @app.route('/chores', methods=['GET'])
# def get_chores():
#     logging.info('get_chores called')
#     chores = session.query(Chore).all()
#     return func.HttpResponse(json.dumps([chore.__dict__ for chore in chores]), mimetype="application/json")

# @app.route('/activities', methods=['GET'])
# def get_activities():
#     logging.info('get_activities called')
#     activities = session.query(Activity).all()
#     return func.HttpResponse(json.dumps([activity.__dict__ for activity in activities]), mimetype="application/json")





@app.route(route="hw", methods=["GET"])
def helloworld(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    return func.HttpResponse("Hello, World!", status_code=200)

    try:
        # Example: Add a new user
        new_user = User(name="John Doe", email="john.doe@example.com")
        session.add(new_user)
        session.commit()

        # Example: Query users
        users = session.query(User).all()
        user_list = [{"id": user.id, "name": user.name, "email": user.email} for user in users]

        return func.HttpResponse(f"Users: {user_list}", status_code=200)
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return func.HttpResponse("An error occurred.", status_code=500)
    finally:
        session.close()

#     # name = req.params.get('name')
#     # if not name:
#     #     try:
#     #         req_body = req.get_json()
#     #     except ValueError:
#     #         pass
#     #     else:
#     #         name = req_body.get('name')

#     # if name:
#     #     return func.HttpResponse(f"Hello, {name}. This HTTP triggered function executed successfully.")
#     # else:
#     #     return func.HttpResponse(
#     #          "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
#     #          status_code=200
#     #     )

