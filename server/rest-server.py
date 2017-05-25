import datetime
from datetime import date
import tornado.escape
import tornado.ioloop
import tornado.web
import tornado.httpserver
import tornado.httputil
import tornado.websocket
import json
import logging

from handlers.project import *
from handlers.user import *
from handlers.task import *
from handlers.proposal import *
from handlers.notifies import *
from handlers.chat import *

from databases.coralliumTiny import *
from localutils.client import * 

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

            for client in clients:
                client.connection.write_message("NEW-USER-CONNECTED") 

            self.write_message("Hello %s !" %(self.id))

        print('WebSocketHandler:OPEN')

    def on_message(self, message):  
        print('WebSocketHandler:on_message: ' + message) 
        
        self.json_args = json.loads(message)

        for client in clients:
            if client.id == self.id:
                
                print(self.json_args['type'])
                print(self.json_args['value'])
                if self.json_args['type'] == 'PROPOSAL':
                    id = table_proposal.insert(self.json_args['value'])
                    table_proposal.update({'id': id}, eids=[id])

                    users = table_user.search(where('id') == int(self.id))

                    table_notification.insert({'userId': self.id, 'from': users[0]['fullName'], 'read': False, 'type': "0", 'date': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                                               'subject': "Creation", 'content': "New proposal was created"})
                
                if self.json_args['type'] == 'CHAT':
                    table_chat.insert(self.json_args['value'])

            if self.json_args['type'] == 'PROPOSAL':
                client.connection.write_message("NOTIFICATION")
            if self.json_args['type'] == 'CHAT':
                client.connection.write_message("NEW-CHAT-MESSAGE")

    def on_close(self):
        print('WebSocketHandler:on_close')
        for client in clients:
            if self.id == client.id:
                clients.remove(client)  

                for client in clients:
                    client.connection.write_message("NEW-USER-CONNECTED")
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
    (r"/CoralliumRestAPI/chats/(.*)", ChatHandler),
    (r"/CoralliumRestAPI/allUsersExceptId/(.*)", AllUsersExceptIdHandler),
    (r"/CoralliumRestAPI/connectedUsers/(.*)", ConnectedUserHandler),
    (r"/CoralliumRestAPI/simpleProject/?", SimpleProjectHandler),
    (r"/CoralliumRestAPI/simpleProject/(.*)", SimpleProjectHandler),
    (r"/CoralliumRestAPI/simpleProjectById/(.*)", SimpleProjectByIdHandler),
    (r"/CoralliumRestAPI/allProjectsExceptId/(.*)", AllProjectsExceptIdHandler),
    (r"/CoralliumRestAPI/simpleProjectDelete/([0-9]+)", SimpleProjectDeleteHandler),
    (r"/CoralliumRestAPI/task/?", TaskHandler),
    (r"/CoralliumRestAPI/task/(.*)", TaskHandler),
    (r"/CoralliumRestAPI/taskByProjectId/(.*)", TaskByProjectIdHandler),
    (r"/CoralliumRestAPI/proposalByProjectId/(.*)", ProposalByProjectIdHandler),
    (r"/CoralliumRestAPI/proposalById/(.*)", ProposalByIdHandler),
    (r"/CoralliumRestAPI/notifiesByUserId/(.*)", NotifiesByUserIdHandler),
    (r"/CoralliumRestAPI/ws(.*)", WebSocketHandler)
])

if __name__ == "__main__":
    print('Corallium Server---host:localhost---port:9090')
    application.listen(9090)
    tornado.ioloop.IOLoop.instance().start()