from PIL import Image
import numpy as np
import matplotlib.pyplot as plt


def array_to_image(matrix, io):
    img = plt.imshow(matrix, interpolation="nearest", aspect="equal")
    img.set_cmap("hot")
    plt.axis("off")
    plt.savefig(io, format="png", bbox_inches="tight", dpi=600)


if __name__ == "__main__":
    import json
    from pathlib import Path
    from io import BytesIO

    with open(Path("logs", "history", "network-15710790561962734.json")) as fp:
        with BytesIO() as out:
            layer = json.load(fp)[0]["layer_0"][0]
            array_to_image(layer, out)
