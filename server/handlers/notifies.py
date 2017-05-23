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

class NotifiesByUserIdHandler(tornado.web.RequestHandler):
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
        print('NotifiesByUserIdHandler:GET!!!')

        print('userId: ' + userId)

        # notifies = table_notification.search((where('userId') == int(userId)) | (where('userId') == userId))

        notifies = table_notification.all()
        
        self.write(json.dumps(notifies))

        print(notifies)

class NotifiesByIdHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        print("setting headers!!!")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding")
        self.set_header('Access-Control-Allow-Methods', "POST, GET, OPTIONS, DELETE, PUT")
    
    def options(self):
        print('options!!!')
        self.set_status(204)
        self.finish()

    # def get(self, proposalId):
    #     print('ProposalByIdHandler:GET!!!')

    #     print('proposalId: ' + proposalId)

    #     proposal = table_proposal.search((where('id') == int(proposalId)) | (where('id') == proposalId))
    #     self.write(json.dumps(proposal))

    #     print(proposal)          