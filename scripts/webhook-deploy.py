
import time
import os
import json
import BaseHTTPServer

DEFAULT_HOST = 'localhost'
DEFAULT_PORT = 8000

REPO = 'scottostler/AolGameJam'
LOCAL_REPO_PATH = '/home/aprod/repo'
LOCAL_EXPORT_PATH = '/home/aprod/dev/'
TRUSTED_IPS = ['207.97.227.253', '50.57.128.197', '108.171.174.178', '50.57.231.61', '204.232.175.64', '192.30.252.0']
DEBUG=True

def pull_local_repo(local_repo_path):
  os.chdir(local_repo_path)
  r = os.system('git pull')
  if r != 0:
    raise Exception('Error pulling repo')
  print time.asctime(), 'pulled repo'

def archive_local_repo(repo_path, export_path):
  if not export_path.endswith('/'):
    raise Exception('Local archive path %s must have trailing slash' % export_path)
  os.chdir(repo_path)
  r = os.system('git checkout-index -f -a --prefix=%s' % export_path)
  if r != 0:
    raise Exception('Error archiving repo')
  print time.asctime(), 'exported repo'

class GithubWebhookHandler(BaseHTTPServer.BaseHTTPRequestHandler):

  def do_GET(self):
    if not DEBUG:
        self.send_response(404)
        self.end_headers()
        self.wfile.write('GET only available in debug mode')
        return
    try:
      pull_local_repo(LOCAL_REPO_PATH)
      archive_local_repo(LOCAL_REPO_PATH, LOCAL_EXPORT_PATH)

      self.send_response(200)
      self.end_headers()
      self.wfile.write('ok')
    except Exception as e:
      self.send_response(500)
      self.end_headers()
      self.wfile.write(str(e))

  def do_POST(self):
    try:
      pull_local_repo(LOCAL_REPO_PATH)
      archive_local_repo(LOCAL_REPO_PATH, LOCAL_EXPORT_PATH)

      self.send_response(200)
      self.end_headers()
      self.wfile.write('ok')
    except Exception as e:
      self.send_response(500)
      self.end_headers()
      self.wfile.write(str(e))

if __name__ == '__main__':
  server_class = BaseHTTPServer.HTTPServer
  httpd = server_class((DEFAULT_HOST, DEFAULT_PORT), GithubWebhookHandler)
  print time.asctime(), "Server Starts - %s:%s" % (DEFAULT_HOST, DEFAULT_PORT)
  try:
      httpd.serve_forever()
  except KeyboardInterrupt:
      pass
  httpd.server_close()
  print time.asctime(), "Server Stops - %s:%s" % (DEFAULT_HOST, DEFAULT_PORT)
