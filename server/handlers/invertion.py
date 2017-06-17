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

class InvertionHandler(tornado.web.RequestHandler):
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
        print('Invertion:GET!!!->prjectId:'+ projectId)

        invertions = table_invertion.search((where('projectId') == projectId) | (where('projectId') == int(projectId)))
        self.write(json.dumps(invertions))

        print(invertions)

    def post(self):
        print("Invertion:POST!!!")

        self.json_args = json.loads(self.request.body)

        print(self.json_args)
        projectId = self.json_args['projectId']
        userId = self.json_args['userId']
        invertions = table_invertion.search((where('projectId') == projectId) & (where('userId') == userId))

        if len(invertions) != 0:
            id = invertions[0]['id'];
            amount = float(invertions[0]['amount']) + float(self.json_args['amount']) 
            table_invertion.update({'amount': amount}, eids=[id])
            self.write(str(id))
            print(id)
        else:
            id = table_invertion.insert(self.json_args)
            table_invertion.update({'id': id}, eids=[id])
            self.write(str(id))
            print(id)

        table_simple_project.update({'inverted': True}, eids=[int(projectId)])

        table_activity.insert({'userId': userId, 'title': 'Invertion', 'content': "You make an invertion", 'date': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")})
