from datetime import date
import tornado.escape
import tornado.ioloop
import tornado.web
import tornado.httpserver
import tornado.httputil
import tornado.websocket
import json
import logging

from databases.coralliumTiny import *

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

class AllProjectsExceptIdHandler(tornado.web.RequestHandler):
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
        print('AllProjectsExceptIdHandler:GET!!!')

        print('userId: ' + userId)

        projects = table_simple_project.search(where('userId') != userId)
        self.write(json.dumps(projects))

        print(projects)        
                