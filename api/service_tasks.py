from datetime import datetime
import uuid
import azure.functions as func
import json
from service_models import Task
from function_app_context import context

bpTasks = func.Blueprint()

@bpTasks.route(route="tasks", methods=['GET', 'POST', 'PUT', 'DELETE'])
def task_service(req: func.HttpRequest) -> func.HttpResponse:
    task: Task

    context.logging.info('Task service called [%s]', req.method)

    if req.method == 'GET' or req.method == 'DELETE':
        try:
            id = req.headers.get('id')
            if not id :
                return func.HttpResponse("Missing Household ID or Task ID", status_code=400)
        except ValueError:
            return func.HttpResponse("Invalid ID", status_code=400)
    elif req.method == 'POST' or req.method == 'PUT':
        try:
            task_data = req.get_json()
            context.logging.info('task data [%s]', task_data)
            task = Task(**task_data)
        except Exception as ex:
            context.logging.info('task update error [%s]', ex)
            return func.HttpResponse(f"Error: {str(ex)}", status_code=400)

        context.logging.info('task_data [%s]', task_data)
        context.logging.info('task obj id [%s]', task.id)

    if req.method == 'GET' :
        return get_householdTasks(id)
    elif req.method == 'DELETE':
        return delete_task(id)
    elif req.method == 'POST':
        return add_task(task)
    elif req.method == 'PUT':
        return update_task(task)
    else:
        return func.HttpResponse("Method Not Allowed", status_code=405)


def get_householdTasks(id: str) -> func.HttpResponse :
    context.logging.info('get_householdTasks [%s]', id)
    if not context.session:
        return func.HttpResponse("Session not found", status_code=500)
    if id == context.KEY:
        context.logging.info('getting ALL tasks')
        tasks = context.session.query(Task).all()
    else:
        if id:
            try :
                id = str(uuid.UUID(id))
                tasks = context.session.query(Task).filter(Task.householdid == id).all()
            except: 
                return func.HttpResponse("Invalid Household ID", status_code=400)
    return func.HttpResponse(json.dumps([task.to_dict() for task in tasks], default=str), mimetype="application/json")

def delete_task(id: str) -> func.HttpResponse:
    context.logging.info('deleting task [%s]', id)
    task = context.session.query(Task).filter(Task.id == id).first()
    if task:
        context.logging.info('got here')
        context.session.delete(task)
        context.session.commit()
        return func.HttpResponse(status_code=200)
    else:
        return func.HttpResponse("Task not found", status_code=404)
    
def add_task(task: Task) -> func.HttpResponse:
    if not task:
        return func.HttpResponse("Task Missing", status_code=400)
    context.logging.info('adding task [%s]', task.name)

    try :
        task.id = None
        task.createdOn = datetime.now()    
        context.session.add(task)
        context.session.commit()
    except Exception as e:
        context.logging.error('Error updating task: %s', str(e))
        return func.HttpResponse("Database conflict or error occurred", status_code=500)

    return func.HttpResponse(json.dumps(task.to_dict(), default=str), mimetype="application/json")

def update_task(task: Task) -> func.HttpResponse:
    if not task:
        return func.HttpResponse("Invalid Task", status_code=400)
    context.logging.info('updating task [%s]', task)

    try :        
        oldTask = context.session.query(Task).filter(Task.id == task.id).first()
        if oldTask:
            if task.name is not None:
                oldTask.name = task.name
            if task.description is not None:
                oldTask.description = task.description
            if task.rewardAmount is not None:
                oldTask.rewardAmount = task.rewardAmount
            if task.active is not None:
                oldTask.active = task.active
            if task.lastCompleted is not None:
                oldTask.lastCompleted = task.lastCompleted
            if task.nextDueDate is not None:
                oldTask.nextDueDate = task.nextDueDate
            if task.frequency is not None:
                oldTask.frequency = task.frequency
            # if task.everyWeekday is not None:
            #     oldTask.everyWeekday = task.everyWeekday
            if task.interval is not None:
                oldTask.interval = task.interval
            if task.dayOfWeek is not None:
                oldTask.dayOfWeek = task.dayOfWeek
            # if task.dayOfMonth is not None:
            #     oldTask.dayOfMonth = task.dayOfMonth
            # if task.instance is not None:
            #     oldTask.instance = task.instance
            # if task.isInstanceBasedMonthly is not None:
            #     oldTask.isInstanceBasedMonthly = task.isInstanceBasedMonthly
            # if task.monthOfYear is not None:
            #     oldTask.monthOfYear = task.monthOfYear
            # if task.isInstanceBasedYearly is not None:
            #     oldTask.isInstanceBasedYearly = task.isInstanceBasedYearly


            context.session.commit()
            context.logging.info(json.dumps(task.to_dict(), default=str))
            return func.HttpResponse(json.dumps(task.to_dict(), default=str), mimetype="application/json")
        else:
            return func.HttpResponse("Task not found", status_code=404)

    except Exception as e:
        context.logging.error('Error updating task: %s', str(e))
        return func.HttpResponse("Database conflict or error occurred", status_code=500)

