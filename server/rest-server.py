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
            self.write_message("Hello %s !" %(self.id)) 

        print('WebSocketHandler:OPEN')

    def on_message(self, message):  
        print('WebSocketHandler:on_message: ' + message) 

        for client in clients:
            if client.id == self.id:
                self.json_args = json.loads(message)
                print(self.json_args['type'])
                print(self.json_args['value'])
                if self.json_args['type'] == 'PROPOSAL':
                    id = table_proposal.insert(self.json_args['value'])
                    table_proposal.update({'id': id}, eids=[id])

                    table_notification.insert({'userId': self.id, 'read': False, 'content': "New proposal was created"})
            
            client.connection.write_message("NOTIFICATION")

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
    (r"/CoralliumRestAPI/allProjectsExceptId/(.*)", AllProjectsExceptIdHandler),
    (r"/CoralliumRestAPI/simpleProjectDelete/([0-9]+)", SimpleProjectDeleteHandler),
    (r"/CoralliumRestAPI/task/?", TaskHandler),
    (r"/CoralliumRestAPI/task/(.*)", TaskHandler),
    (r"/CoralliumRestAPI/taskByProjectId/(.*)", TaskByProjectIdHandler),
    (r"/CoralliumRestAPI/proposalByProjectId/(.*)", ProposalByProjectIdHandler),
    (r"/CoralliumRestAPI/proposalById/(.*)", ProposalByIdHandler),
    (r"/CoralliumRestAPI/ws(.*)", WebSocketHandler)
])

if __name__ == "__main__":
    print('Ravic server---host:localhost---port:9090')
    application.listen(9090)
    tornado.ioloop.IOLoop.instance().start()