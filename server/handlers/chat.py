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
from localutils.client import * 

class ChatHandler(tornado.web.RequestHandler):
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
        print('Chat:GET!!!' + userId)

        for client in clients:
            print(client.id)

        chats = table_chat.search((where('idUser') == int(userId)) | (where('idOther') == int(userId)) | (where('idOther') == userId) | (where('idUser') == userId))
        self.write(json.dumps(chats))

        print(chats)

    def post(self):
        print("Chat:POST!!!")
           