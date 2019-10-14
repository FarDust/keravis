"""
runs a python simple server
"""
from http.server import HTTPServer, SimpleHTTPRequestHandler


def run(host, port, server_class=HTTPServer, handler_class=SimpleHTTPRequestHandler):
    """
    main function to run a server
    """
    server_address = (host, port)
    httpd = server_class(server_address, handler_class)
    print(f"Server is running at http://{HOST}:{PORT}")
    httpd.serve_forever()


if __name__ == "__main__":
    HOST = "0.0.0.0"
    PORT = 8000
    run(HOST, PORT)
