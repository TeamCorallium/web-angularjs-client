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

    def put(self):
        print("Task:PUT!!!")

        newTask = json.loads(self.request.body)

        print(newTask)

        table_task.update({'name': newTask['name'], 'cost': newTask['cost'], 'startDate': newTask['startDate'],
                           'description': newTask['description'], 'outcome': newTask['outcome'], 
                           'duration': newTask['duration'], 'state': newTask['state']}, eids=[newTask['id']])

            
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

class TaskDeleteHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        print("setting headers!!!")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding")
        self.set_header('Access-Control-Allow-Methods', "POST, GET, OPTIONS, DELETE, PUT")
    
    def options(self):
        print('options!!!')
        self.set_status(204)
        self.finish()

    def get(self, taskId):
        print('TaskDeleteHandler:DELETE!!! ' + taskId)

        table_task.remove(eids=[int(taskId)])
        self.write(str(taskId))