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

class VersionHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        print("setting headers!!!")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "x-requested-with")
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        
    def get(self):
        response = { 'version': '3.5.1',
                     'last_build':  date.today().isoformat() }
        self.write(json.dumps(gallery1.all()))
#        gallery1.all()
        print(json.dumps(gallery1.all()))

class GetTextHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        print("setting headers!!!")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "x-requested-with")
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        
    def get(self, id):
        text = texts.search(where('id') == id)
        self.write(json.dumps(text))
        print('El id:'+ id)

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

        #Project = table_simple_project.Query()
        # projects = table_simple_project.search((Project.userId == userId) | (Project.userId == int(userId)))
        projects = table_simple_project.search((where('userId') == userId) | (where('userId') == int(userId)))
        self.write(json.dumps(projects))

        print(projects)

    def post(self):
        print("SimpleProject:POST!!!")

        self.json_args = json.loads(self.request.body)

        print(self.json_args['projectName'])

        # print(len(table_user.search(where('email') == self.json_args['email'])))

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
        # print(len(table_user.search(where('email') == self.json_args['email'])))

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

        proposals = table_proposal.search(where('projectId') == int(projectId))
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
    waiters = set()

    def open(self, *args):
        # self.id = self.get_argument("Id")
        self.stream.set_nodelay(True)
        # clients[self.id] = {"id": self.id, "object": self}
        self.write_message("you've been connected. Congratz.")

        WebSocketHandler.waiters.add(self)
        print('WebSocketHandler:OPEN')

    def on_message(self, message):    
        print('WebSocketHandler:on_message: ' + message) 
        WebSocketHandler.send_updates(message) 

        self.json_args = json.loads(message)
        table_proposal.insert(self.json_args)

        """
        when we receive some message we want some message handler..
        for this example i will just print message to console
        """
        # print "Client %s received a message : %s" % (self.id, message)
        
    def on_close(self):
        WebSocketHandler.waiters.remove(self)
        print('WebSocketHandler:on_close')
        # if self.id in clients:
        #     del clients[self.id]

    @classmethod
    def send_updates(cls, message):
        logging.info("sending message to %d waiters", len(cls.waiters))
        for waiter in cls.waiters:
            try:
                waiter.write_message(message)
            except:
                logging.error("Error sending message", exc_info=True)

    def check_origin(self, origin):
        print('WebSocketHandler:check_origin')
        return True        

application = tornado.web.Application([
    (r"/ravic/text/([0-9]+)", GetTextHandler),
    (r"/ravic/?", VersionHandler),
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
    (r"/CoralliumRestAPI/ws/(.*)", WebSocketHandler)
])

if __name__ == "__main__":
    print('Ravic server---host:localhost---port:9090')
    application.listen(9090)
    tornado.ioloop.IOLoop.instance().start()