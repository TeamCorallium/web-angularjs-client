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

class ActivitiesByUserIdHandler(tornado.web.RequestHandler):
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
        print('ActivitiesByUserIdHandler:GET!!!')

        print('userId: ' + userId)

        activities = table_activity.search((where('userId') == int(userId)) | (where('userId') == userId))
        
        sortedActivities = sorted(activities, key=lambda activity: activity['date'], reverse=True)
        
        self.write(json.dumps(sortedActivities))

        print(sortedActivities)