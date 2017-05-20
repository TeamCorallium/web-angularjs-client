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

class ProposalByIdHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        print("setting headers!!!")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding")
        self.set_header('Access-Control-Allow-Methods', "POST, GET, OPTIONS, DELETE, PUT")
    
    def options(self):
        print('options!!!')
        self.set_status(204)
        self.finish()

    def get(self, proposalId):
        print('ProposalByIdHandler:GET!!!')

        print('proposalId: ' + proposalId)

        proposal = table_proposal.search((where('id') == int(proposalId)) | (where('id') == proposalId))
        self.write(json.dumps(proposal))

        print(proposal)          