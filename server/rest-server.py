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
from handlers.upload import *
from handlers.invertion import *
from handlers.comment import *
from handlers.vote import *
from handlers.activity import *

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
                
        print(self.json_args['type'])
        print(self.json_args['value'])

        if self.json_args['type'] == 'PROPOSAL':

            proposalId = table_proposal.insert(self.json_args['value'])
            table_proposal.update({'id': proposalId}, eids=[proposalId])

            projectId = self.json_args['value']['projectId']
            projects = table_simple_project.search((where('id') == projectId) | (where('id') == int(projectId)))
            project = projects[0]

            users = table_user.search(where('id') == int(self.id))
            fromName = users[0]['fullName']

            interestedUserIds = []
            interestedUserIds.append(project['userId'])

            invertions = table_invertion.search((where('projectId') == projectId) | (where('projectId') == int(projectId)))
            for invertion in invertions:
                interestedUserIds.append(invertion['userId'])

            proposalType = self.json_args['value']['type']
            for userId in interestedUserIds:
                table_notification.insert({'userId': userId, 'projectId': projectId, 'proposalId': proposalId, 'from': fromName, 'read': False, 'type': proposalType, 'date': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                                            'subject': "Creation", 'content': "New proposal was created"})
                for c in clients:
                    if int(c.id) == int(userId):
                        c.connection.write_message("NOTIFICATION")

            table_activity.insert({'userId': self.id, 'title': 'Proposal', 'content': "Create a proposal", 'date': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")})

            print(interestedUserIds)

        if self.json_args['type'] == 'VOTE':
            vote = self.json_args['value']
            proposalId = vote['proposalId']
            table_vote.insert(vote)

            projectId = vote['projectId']
            projects = table_simple_project.search((where('id') == projectId) | (where('id') == int(projectId)))
            project = projects[0]

            users = table_user.search(where('id') == int(self.id))
            fromName = users[0]['fullName']

            ownerId = project['userId']           
            votes = table_vote.search((where('proposalId') == proposalId) | (where('proposalId') == int(proposalId)))                                                
            
            proposals = table_proposal.search((where('id') == proposalId) | (where('id') == int(proposalId)))
            proposal = proposals[0]

            interestedUserIds = []
            interestedUserIds.append(project['userId'])

            invertions = table_invertion.search((where('projectId') == projectId) | (where('projectId') == int(projectId)))
            for invertion in invertions:
                interestedUserIds.append(invertion['userId'])

            notifieType = proposal['type'] + ' Approved'
            proposalContent = proposal['proposalContent']              

            table_activity.insert({'userId': self.id, 'title': 'Vote', 'content': "Vote:" + vote['value'] + ' for ' + proposalContent, 'date': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")})

            percent = 0
            for v in votes:
                if v['value'] == 'yes':
                    percent += int(v['percent'])

            if percent > 50:
                for userId in interestedUserIds:
                    content = ''
                    taskField = ''
                    if proposal['type'] == 'Start Project':
                        table_simple_project.update({'state': '2'}, eids=[project['id']])
                        content = 'Project ' + project['projectName'] + ' Started'
                    else:
                        if proposal['type'] == 'Modified Task State':
                            content = 'A task state was modified'
                            taskField = 'state'
                        if proposal['type'] == 'Modified Task Name': 
                            content = 'A task name was modified'
                            taskField = 'name'                               
                        if proposal['type'] == 'Modified Task Description':
                            content = 'A task description was modified'
                            taskField = 'description'                                
                        if proposal['type'] == 'Modified Task Cost':
                            content = 'A task cost was modified'
                            taskField = 'cost'                                
                        if proposal['type'] == 'Modified Task Outcome':
                            content = 'A task outcome was modified'
                            taskField = 'outcome'                                
                        if proposal['type'] == 'Modified Task Start Date':
                            content = 'A task start date was modified'
                            taskField = 'startDate'                                
                        if proposal['type'] == 'Modified Task Duration':   
                            content = 'A task duration was modified'
                            taskField = 'duration'  

                        table_task.update({taskField: proposalContent}, eids=[proposal['itemSubject']])                              

                    table_notification.insert({'userId': userId, 'projectId': projectId, 'proposalId': proposalId, 'proposalSubject': proposal['itemSubject'], 'from': fromName, 'read': False, 'type': notifieType, 'date': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                                            'subject': proposal['itemSubject'], 'content': content})
                    for c in clients:
                        if int(c.id) == int(userId):
                            c.connection.write_message("NOTIFICATION")
                
        if self.json_args['type'] == 'CHAT':
            table_chat.insert(self.json_args['value'])

        if self.json_args['type'] == 'COMMENT':
            table_comment.insert(self.json_args['value'])
            table_activity.insert({'userId': self.id, 'title': 'Comment', 'content': "New comment", 'date': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")})

        if self.json_args['type'] == 'CHAT':
            for c in clients:
                c.connection.write_message("NEW-CHAT-MESSAGE")    

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

def test():
    # print('ok ok ok ok')
    return True

application = tornado.web.Application([
    (r"/CoralliumRestAPI/user/?", UserHandler),
    (r"/CoralliumRestAPI/user/(.*)", UserHandler),
    (r"/CoralliumRestAPI/chats/(.*)", ChatHandler),
    (r"/CoralliumRestAPI/upload/", UploadHandler),
    (r"/CoralliumRestAPI/allUsersExceptId/(.*)", AllUsersExceptIdHandler),
    (r"/CoralliumRestAPI/connectedUsers/(.*)", ConnectedUserHandler),
    (r"/CoralliumRestAPI/simpleProject/?", SimpleProjectHandler),
    (r"/CoralliumRestAPI/simpleProject/(.*)", SimpleProjectHandler),
    (r"/CoralliumRestAPI/simpleProjectOpportunities/(.*)", SimpleProjectOpportunitiesHandler),
    (r"/CoralliumRestAPI/simpleProjectById/(.*)", SimpleProjectByIdHandler),
    (r"/CoralliumRestAPI/allProjectsExceptId/(.*)", AllProjectsExceptIdHandler),
    (r"/CoralliumRestAPI/simpleProjectDelete/([0-9]+)", SimpleProjectDeleteHandler),
    (r"/CoralliumRestAPI/task/?", TaskHandler),
    (r"/CoralliumRestAPI/task/(.*)", TaskHandler),
    (r"/CoralliumRestAPI/taskDelete/([0-9]+)", TaskDeleteHandler),
    (r"/CoralliumRestAPI/invertion/?", InvertionHandler),
    (r"/CoralliumRestAPI/invertion/(.*)", InvertionHandler),    
    (r"/CoralliumRestAPI/taskByProjectId/(.*)", TaskByProjectIdHandler),
    (r"/CoralliumRestAPI/proposalByProjectId/(.*)", ProposalByProjectIdHandler),
    (r"/CoralliumRestAPI/commentsByProjectId/(.*)", CommentByProjectIdHandler),
    (r"/CoralliumRestAPI/proposalById/(.*)", ProposalByIdHandler),
    (r"/CoralliumRestAPI/notifiesByUserId/(.*)", NotifiesByUserIdHandler),
    (r"/CoralliumRestAPI/voteByProposalId/(.*)", VoteByProposalIdHandler),
    (r"/CoralliumRestAPI/activitiesByUserId/(.*)", ActivitiesByUserIdHandler),
    (r"/CoralliumRestAPI/ws(.*)", WebSocketHandler)
])

if __name__ == "__main__":
    print('Corallium Server---host:localhost---port:9090')
    application.listen(9090)
    main_loop = tornado.ioloop.IOLoop.instance()

    # background update every x seconds
    task = tornado.ioloop.PeriodicCallback(test, 5 * 1000)
    task.start()

    main_loop.start()