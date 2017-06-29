from datetime import date
import datetime
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

        investions = table_invertion.search((where('userId') == userId) | (where('userId') == int(userId)))
        
        # create copy by value
        rp = projects[:]

        for inv in investions:
            projectId = inv['projectId']
            p = table_simple_project.search((where('id') == projectId) | (where('id') == int(projectId)))
            if len(p) != 0:
                rp.append(p[0])

        self.write(json.dumps(rp))
        print(rp)

    def post(self):
        print("SimpleProject:POST!!!")

        newProject = json.loads(self.request.body)

        print(newProject['projectName'])
        projectId = newProject['id']

        activityContent = ''

        if projectId != '':
            if len(table_simple_project.search((where('id') == projectId) | (where('id') == int(projectId)))) != 0:
                id = newProject['id']
                table_simple_project.update(newProject, eids=[int(id)])
                table_simple_project.update({'id': int(id)}, eids=[int(id)])
                self.write(str(id))
                activityContent = 'You updated a project'
        else:
            id = table_simple_project.insert(newProject)
            table_simple_project.update({'id': id}, eids=[id])
            self.write(str(id))
            activityContent = 'You created a new project'

        table_activity.insert({'userId': newProject['userId'], 'title': 'Project', 'content': activityContent, 'date': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")})

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

        projects = table_simple_project.search((where('id') == projectId) | (where('id') == int(projectId)))
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

        projects = []
        if userId != 'null':
            projects = table_simple_project.search((where('userId') != userId) & (where('userId') != int(userId)))
            investions = table_invertion.search((where('userId') == userId) | (where('userId') == int(userId)))

            for inver in investions:
                projects = [item for item in projects if int(item['id']) != int(inver['projectId'])]
        else:
            projects = table_simple_project.all()

        filter = self.get_argument("filter")
        print(filter)

        if filter != '':
            if filter == 'deathLine':
                sortedProjects = sorted(projects, key=lambda project: project[filter])
            else:
                sortedProjects = sorted(projects, key=lambda project: int(project[filter]), reverse=True) 

            self.write(json.dumps(sortedProjects))
            print('sorted....')
            print(sortedProjects)   
        else:
            self.write(json.dumps(projects))
            print(projects)


class SimpleProjectOpportunitiesHandler(tornado.web.RequestHandler):
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
        print('SimpleProjectOpportunitiesHandler:GET!!!')

        print('userId: ' + userId)

        # print(self.get_argument("filter"))

        projects = []
        if userId != 'null':
            projects = table_simple_project.search((where('userId') != userId) & (where('userId') != int(userId)))
        else:
            projects = table_simple_project.all()

        opportunities = []

        for project in projects:
            if project['state'] != '1':
                continue

            projectId = project['id']
            totalCost = project['totalCost']

            invertions = table_invertion.search((where('projectId') == projectId) | (where('projectId') == int(projectId)))
            
            print(invertions)

            amount = 0;
            for invertion in invertions:
                amount += int(invertion['amount'])

            if amount < int(totalCost):
                opportunities.append(project)

        filter = self.get_argument("filter")
        print(filter)

        if filter != '':
            if filter == 'deathLine':
                sortedOpportunities = sorted(opportunities, key=lambda opportinity: opportinity[filter])
            else:
                sortedOpportunities = sorted(opportunities, key=lambda opportinity: int(opportinity[filter]), reverse=True) 

            self.write(json.dumps(sortedOpportunities))
            print(sortedOpportunities)   
        else:
            self.write(json.dumps(opportunities))
            print(opportunities)        
