import socket


def get_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
    except OSError:
        print("ВНИМАНИЕ!!! НЕТ ПОДКЛЮЧЕНИЯ К ИНТЕРНЕТУ!!!")
        return "127.0.0.1"
    return ip

