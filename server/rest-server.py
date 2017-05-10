from datetime import date
import tornado.escape
import tornado.ioloop
import tornado.web
import tornado.httpserver
import tornado.httputil
import tornado.websocket
import json
import logging
from tinydb import TinyDB, Query, where

db = TinyDB('db.json')

# db.purge();

table_user = db.table('table_user')
table_profile = db.table('table_profile')
table_simple_project = db.table('table_simple_project')
table_complex_project = db.table('table_complex_project')
table_risk = db.table('table_risk')
table_reference = db.table('table_reference')
table_task = db.table('table_task')
table_proposal = db.table('table_proposal')
table_notification = db.table('table_notification')

class Client:
    def __init__(self, clientId, connection):
        self.id = clientId
        # self.name = name
        self.connection = connection

clients = []

class UserHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        print("setting headers!!!")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding")
        self.set_header('Access-Control-Allow-Methods', "POST, GET, OPTIONS, DELETE, PUT")
    
    def options(self):
        print('options!!!')
        self.set_status(204)
        self.finish()

    def get(self, email):
        print('User:GET!!!' + email)

        user = '';

        try: 
            int(email)
            user = table_user.search(where('id') == int(email))
        except ValueError:
            user = table_user.search(where('email') == email)

        self.write(json.dumps(user))
        print(user)

    def post(self):
        print("User:POST!!!")

        self.json_args = json.loads(self.request.body)

        print(self.json_args['email'])
        print(self.json_args['fullName'])
        print(self.json_args['password'])
        print(self.json_args['gender'])

        print(len(table_user.search(where('email') == self.json_args['email'])))

        if len(table_user.search(where('email') == self.json_args['email'])) != 0:
            self.write('-1')
        else:
            id = table_user.insert(self.json_args)
            table_user.update({'id': id}, eids=[id])
            self.write(str(id))
            print(id)


class SimpleProjectHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        print("setting headers!!!")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding")
        self.set_header('Access-Control-Allow-Methods', "POST, GET, OPTIONS, DELETE, PUT")
    
    def options(self):
        print('options!!!')
        self.set_status(204)
        self.finish()

    def get(self, userId):
        print('SimpleProject:GET!!!')

        print('userId: ' + userId)

        projects = table_simple_project.search((where('userId') == userId) | (where('userId') == int(userId)))
        self.write(json.dumps(projects))

        print(projects)

    def post(self):
        print("SimpleProject:POST!!!")

        self.json_args = json.loads(self.request.body)

        print(self.json_args['projectName'])

        if len(table_simple_project.search(where('projectName') == self.json_args['projectName'])) != 0:
            self.write('-1')
        else:
            id = table_simple_project.insert(self.json_args)
            table_simple_project.update({'id': id}, eids=[id])
            self.write(str(id))
            print(id)

class TaskHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        print("setting headers!!!")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding")
        self.set_header('Access-Control-Allow-Methods', "POST, GET, OPTIONS, DELETE, PUT")
    
    def options(self):
        print('options!!!')
        self.set_status(204)
        self.finish()

    def get(self, id):
        print('Task:GET!!!')
        print('id: ' + id)

        task = table_task.search(where('id') == int(id))
        self.write(json.dumps(task))
        print(task)

    def post(self):
        print("Task:POST!!!")

        self.json_args = json.loads(self.request.body)
        print(self.json_args)
        print(self.json_args['projectId'])

        if len(table_simple_project.search(where('id') == int(self.json_args['projectId']))) != 0:
            id = table_task.insert(self.json_args)
            table_task.update({'id': id}, eids=[id])
            self.write(str(id))
            print(id)
        else:
            self.write('-1')
            print('ProjectId not found')

class SimpleProjectByIdHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        print("setting headers!!!")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding")
        self.set_header('Access-Control-Allow-Methods', "POST, GET, OPTIONS, DELETE, PUT")
    
    def options(self):
        print('options!!!')
        self.set_status(204)
        self.finish()

    def get(self, projectId):
        print('SimpleProjectById:GET!!!')

        print('projectId: ' + projectId)

        projects = table_simple_project.search(where('id') == int(projectId))
        self.write(json.dumps(projects))

        print(projects)

class TaskByProjectIdHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        print("setting headers!!!")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding")
        self.set_header('Access-Control-Allow-Methods', "POST, GET, OPTIONS, DELETE, PUT")
    
    def options(self):
        print('options!!!')
        self.set_status(204)
        self.finish()

    def get(self, projectId):
        print('TaskByProjectIdHandler:GET!!!')

        print('projectId: ' + projectId)

        tasks = table_task.search(where('projectId') == projectId)
        self.write(json.dumps(tasks))

        print(tasks)     

class ProposalByProjectIdHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        print("setting headers!!!")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding")
        self.set_header('Access-Control-Allow-Methods', "POST, GET, OPTIONS, DELETE, PUT")
    
    def options(self):
        print('options!!!')
        self.set_status(204)
        self.finish()

    def get(self, projectId):
        print('ProposalByProjectIdHandler:GET!!!')

        print('projectId: ' + projectId)

        proposals = table_proposal.search((where('projectId') == int(projectId)) | (where('projectId') == projectId))
        self.write(json.dumps(proposals))

        print(proposals)

class SimpleProjectDeleteHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        print("setting headers!!!")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding")
        self.set_header('Access-Control-Allow-Methods', "POST, GET, OPTIONS, DELETE, PUT")
    
    def options(self):
        print('options!!!')
        self.set_status(204)
        self.finish()

    def get(self, projectId):
        print('SimpleProjectById:DELETE!!!')

        table_simple_project.remove(eids=[int(projectId)])
        self.write(str(projectId))      

class WebSocketHandler(tornado.websocket.WebSocketHandler):
    def open(self, *args):
        self.stream.set_nodelay(True)
        
        newclient = True
        self.id = self.get_argument("userId")
        for client in clients:
            if client.id == self.id:
                client.connection.write_message("Hello Again %s !" %(client.id))
                newclient = False
                break
        if newclient:
            clientRef = Client(self.id, self)
            clients.append(clientRef)
            self.write_message("Hello %s !" %(self.id)) 

        print('WebSocketHandler:OPEN')

    def on_message(self, message):  
        print('WebSocketHandler:on_message: ' + message) 

        for client in clients:
            if client.id == self.id:
                self.json_args = json.loads(message)
                table_proposal.insert(self.json_args)
        
    def on_close(self):
        print('WebSocketHandler:on_close')
        for client in clients:
            if self.id == client.id:
                clients.remove(client)
                break        

    # @classmethod
    # def send_updates(cls, message):
    #     logging.info("sending message to %d waiters", len(cls.waiters))
    #     for waiter in cls.waiters:
    #         try:
    #             waiter.write_message(message)
    #         except:
    #             logging.error("Error sending message", exc_info=True)

    def check_origin(self, origin):
        print('WebSocketHandler:check_origin')
        return True        

application = tornado.web.Application([
    (r"/CoralliumRestAPI/user/?", UserHandler),
    (r"/CoralliumRestAPI/user/(.*)", UserHandler),
    (r"/CoralliumRestAPI/simpleProject/?", SimpleProjectHandler),
    (r"/CoralliumRestAPI/simpleProject/(.*)", SimpleProjectHandler),
    (r"/CoralliumRestAPI/simpleProjectById/(.*)", SimpleProjectByIdHandler),
    (r"/CoralliumRestAPI/simpleProjectDelete/([0-9]+)", SimpleProjectDeleteHandler),
    (r"/CoralliumRestAPI/task/?", TaskHandler),
    (r"/CoralliumRestAPI/task/(.*)", TaskHandler),
    (r"/CoralliumRestAPI/taskByProjectId/(.*)", TaskByProjectIdHandler),
    (r"/CoralliumRestAPI/proposalByProjectId/(.*)", ProposalByProjectIdHandler),
    (r"/CoralliumRestAPI/ws(.*)", WebSocketHandler)
])

if __name__ == "__main__":
    print('Ravic server---host:localhost---port:9090')
    application.listen(9090)
    tornado.ioloop.IOLoop.instance().start()