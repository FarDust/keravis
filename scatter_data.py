import json
import os

datos_archivos = {"data": []}
minimo = 10000000000000000


def funcion_hook(diccionario):
    if "timestamp" in diccionario.keys():
        timestamp = diccionario["timestamp"]
        best_score = diccionario["best_score"]
        datos_archivos["data"].append({"timestamp": timestamp, "best_score": best_score})


files = os.listdir("game_data")
for file in files:
    name = "game_data/" + file
    with open(name, "r") as archivo:
        data = archivo.read()
        document = json.loads(data)
        cant_puntos = len(document["history"])
        timestamp = document["timestamp"]
        round = document["round"]
        datos_archivos["data"].append({"score": cant_puntos, "timestamp":
                                       timestamp, "round": round})

minimo = min(map(lambda d: d["timestamp"], datos_archivos["data"]))

for datos in datos_archivos["data"]:
    datos["timestamp"] -= minimo
       
with open("data.json", "w") as archivo:
    json.dump(datos_archivos, archivo)
