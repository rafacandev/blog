FROM tensorflow/tensorflow:1.14.0-py3-jupyter
# Base root folder /tensorflow
ENV TENSORFLOW_FOLDER /tensorflow
WORKDIR ${TENSORFLOW_FOLDER}

# Required system packages
RUN apt-get update -y
RUN apt-get install -y wget curl git protobuf-compiler python-pil python-lxml

# Download models compatible with tensorflow:1.14
RUN wget -O models-1.13.0.tar.gz https://github.com/tensorflow/models/archive/v1.13.0.tar.gz
RUN tar -xvf models-1.13.0.tar.gz
RUN mv models-1.13.0 ${TENSORFLOW_FOLDER}/models
RUN rm models-1.13.0.tar.gz

# Required pip packages
RUN pip install pillow==6.2.1
RUN pip install lxml==4.4.1
RUN pip install matplotlib==3.1.1
RUN pip install opencv-python==3.4.9.33
RUN pip install pathlib==1.0.1
RUN pip install cython==0.29.17
RUN pip install pandas==1.0.3
RUN pip install absl-py==0.9.0
#RUN pip install nympy==1.18.1

# Official pycocotools installation. Avoid using pip pycocotools as is not officially maintained
RUN git clone https://github.com/cocodataset/cocoapi.git
WORKDIR ${TENSORFLOW_FOLDER}/cocoapi/PythonAPI
RUN make
RUN cp -r pycocotools ${TENSORFLOW_FOLDER}/models/research/

# Proto compile models
WORKDIR ${TENSORFLOW_FOLDER}/models/research
RUN protoc object_detection/protos/*.proto --python_out=.
RUN pip install .

# Environment variables
ENV PYTHONPATH /usr/local/bin/python
ENV PYTHONPATH ${PYTHONPATH}:${TENSORFLOW_FOLDER}/models/research/
ENV PYTHONPATH ${PYTHONPATH}:${TENSORFLOW_FOLDER}/models/research/object_detection
ENV PYTHONPATH ${PYTHONPATH}:${TENSORFLOW_FOLDER}/models/research/slim

# Tensorboard port
EXPOSE 6006

# Default workspace folder
WORKDIR ${TENSORFLOW_FOLDER}/workspace
