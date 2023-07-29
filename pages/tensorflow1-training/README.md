Tensorflow Object Detection Training With One Custom Class and Transfer Learning Tutorial
-----------------------------------------------------------------------------------------

Introduction
------------
Training Tensorflow (v1.14) modules isn't a trivial task, it requires several manual steps as described in [TensorFlow Object Detection API Tutorial]. In this tutorial, we will automate some of these manual steps and creates a framework to start training our custom models as fast as possible.

It also serves as basis if we want to expand and create your own training setup. For simplicity, we are going to train a custom model to detect car's tire.

Requirements
------------
The following applications should be installed:
- **Docker**: as described in [Docker Website](https://docs.docker.com/get-docker/).
- **LabelImg**: as described in [LabelImg Website](https://github.com/tzutalin/labelImg)

Create a Project Folder
=======================
Create a project root folder in your operating system. From now on, this folder will be referenced as `PRJ_WORKSPACE_FOLDER`.
```
mkdir PRJ_WORKSPACE_FOLDER
cd PRJ_WORKSPACE_FOLDER
```

Preparing the Workspace
-----------------------

In `PRJ_WORKSPACE_FOLDER`, run:
```
mkdir training_demo
mkdir training_demo/annotations
mkdir training_demo/images
mkdir training_demo/images/test
mkdir training_demo/images/train
mkdir training_demo/pre-trained-model
mkdir training_demo/training
mkdir training_demo/scripts
mkdir training_demo/scripts/extra
mkdir training_demo/scripts/preprocessing
```

Directory Layout
----------------
At this point your `PRJ_WORKSPACE_FOLDER` should look like:
```
├── Dockerfile
└── training_demo
    ├── annotations
    ├── images
    │   ├── test
    │   └── train
    ├── pre-trained-model
    ├── scripts
    │   └── preprocessing
    │   └── extra    
    └── training
```

- `training_demo`: Our custom model to be created in this tutorial
- `training_demo/annotations`: all `*.csv` files and the respective TensorFlow `*.record` files, which contain the list of annotations for our dataset images.
- `training_demo/images`: all the images in our dataset, as well as the respective `*.xml` files produced for each one, once **LabelImg** is used to annotate objects.
- `training_demo/images/train`: all images, and the respective `*.xml` files, which will be used to train our model.
- `training_demo/images/test`: all images, and the respective `*.xml` files, which will be used to test our model.
- `training_demo/pre-trained-model`: pre-trained model of our choice, which shall be used as a starting checkpoint for our training job.
- `training_demo/training:` contains the training pipeline configuration file `*.config`, as well as a `*.pbtxt` label map file and all files generated during the training.

Preparing Images
================

Download Images
---------------
Save [download_training_images.sh](training_demo/scripts/extra/download_training_images.sh) in `PRJ_WORKSPACE_FOLDER/training_demo/scripts/extra/download_training_images.sh`.

In `PRJ_WORKSPACE_FOLDER`, run:
```
sh training_demo/scripts/extra/download_training_images.sh
```

In `PRJ_WORKSPACE_FOLDER`, verify if the images are downloaded in the correct folders:
```
ls -l training_demo/images/train/ | grep jpg | wc -l
#> 120
ls -l training_demo/images/test/ | grep jpg | wc -l
#> 20
```

Create a Label Map
------------------
We need a file to describe the labels we are going to use. In our case, there will be only one label named `tire`.

Create `PRJ_WORKSPACE_FOLDER/training_demo/annotations/label_map.pbtxt` as:
```
item {
    id: 1
    name: 'tire'
}
```

Label the Images
----------------
Run **LabelImg** and label the images in `PRJ_WORKSPACE_FOLDER/training_demo/images/train` and `PRJ_WORKSPACE_FOLDER/training_demo/images/train`. Make sure to label the images using **PascalVOC** format as described in [LabelImg Usage](https://github.com/tzutalin/labelImg#steps-pascalvoc). In some instances, you may see a image without any tire, that is alright just make sure the image also has a corresponding `.xml` label file without objects in it. Alternatively, you can donwload our [train labels](training_demo/images/train) and [test labels](training_demo/images/test).

At this point, `PRJ_WORKSPACE_FOLDER/training_demo/images/train` and `PRJ_WORKSPACE_FOLDER/training_demo/images/train` should contain a label `.xml` file for each image.

In `PRJ_WORKSPACE_FOLDER`, verify if the labels are created:
```
ls -l training_demo/images/train/ | grep xml | wc -l
#> 120
ls -l training_demo/images/test/ | grep xml | wc -l
#> 20
```

Build a Docker Container
========================
In `PRJ_WORKSPACE_FOLDER`, save this [Dockerfile](Dockerfile).

In `PRJ_WORKSPACE_FOLDER`, build a docker image named `tensorflow1-training` with tagged as `1.0`:
```
docker build --tag tensorflow1-training:1.0 .
```

In `PRJ_WORKSPACE_FOLDER`, run a docker container:
```
docker run -it --name tf_training --rm -p 0.0.0.0:6006:6006 -v $PWD:/tensorflow/workspace tensorflow1-training:1.0 bash
```
- `-it`: interactive terminal.
- `--name`: a name for the container.
- `--rm`: remove the container when done.
- `-p`: binds ports from the container to your host system.
- `-v`: populates the content of `$PWD` (current directory) into the container's `/tensorflow/workspace` folder.
- `tensorflow1-training:1.0`: the docker image, in our case the one we just built.
- `bash`: runs bash in the interactive terminal.

Now the terminal is attached to bash running in our docker container. Moreover, `-v $PWD:/tensorflow/workspace` mounts the content of the current folder into the container's `/tensorflow/workspace` which means that we should see the content `PRJ_WORKSPACE_FOLDER/training_demo` from this interactive terminal:

Change the current directory to `training_demo`.
```
cd training_demo
ls
```

From now on, our docker interactive terminal in the `training_demo` folder will be referenced as `DOCKER_TRAINING_FOLDER`:

In `DOCKER_TRAINING_FOLDER`, test the tensorflow's installation
```
python -c "import tensorflow as tf;print(tf.reduce_sum(tf.random.normal([1000, 1000])))"
#> Tensor("Sum:0", shape=(), dtype=float32)
```

Preparing for the Training
==========================

Converting *.xml to *.csv
-------------------------
Save the [xml_to_csv.py](training_demo/scripts/preprocessing/xml_to_csv.py) in `PRJ_WORKSPACE_FOLDER/training_demo/scripts/preprocessing/xml_to_csv.py`.

In `DOCKER_TRAINING_FOLDER`, run:
```
python scripts/preprocessing/xml_to_csv.py -i images/train -o annotations/train_labels.csv
python scripts/preprocessing/xml_to_csv.py -i images/test -o annotations/test_labels.csv
```

Converting from *.csv to *.record
---------------------------------
Save the [generate_tfrecord.py](training_demo/scripts/preprocessing/generate_tfrecord.py) in `PRJ_WORKSPACE_FOLDER/training_demo/scripts/preprocessing/generate_tfrecord.py`.

In `DOCKER_TRAINING_FOLDER`, run:
```
python scripts/preprocessing/generate_tfrecord.py --label=tire --csv_input=annotations/train_labels.csv --output_path=annotations/train.record --img_path=images/train
python scripts/preprocessing/generate_tfrecord.py --label=tire --csv_input=annotations/test_labels.csv --output_path=annotations/test.record --img_path=images/test
```

Configuring a Training Pipeline
-------------------------------
We are going to use `ssd_inception_v2_coco` as a pre-trained model.

In `PRJ_WORKSPACE_FOLDER`, verify if the labels are created:
```
wget -P training_demo/pre-trained-model http://download.tensorflow.org/models/object_detection/ssd_inception_v2_coco_2018_01_28.tar.gz
tar -xvf training_demo/pre-trained-model/ssd_inception_v2_coco_2018_01_28.tar.gz -C training_demo/pre-trained-model/
```

Save the [ssd_inception_v2_coco.config](training_demo/training/ssd_inception_v2_coco.config) in `PRJ_FOLDER/training_demo/training/ssd_inception_v2_coco.config`.

Training the Model
==================
Copy the training script.

In `DOCKER_TRAINING_FOLDER`, run:
```
cp /tensorflow/models/research/object_detection/model_main.py .
```

At this point your `PRJ_WORKSPACE_FOLDER` should look like:
```
├── Dockerfile
├── README.md
└── training_demo
    ├── annotations
    │   ├── label_map.pbtxt
    │   ├── test_labels.csv
    │   ├── test.record
    │   ├── train_labels.csv
    │   └── train.record
    ├── images
    │   ├── test
    │   │   ├── ... .jpg
    │   │   ├── ... .xml
    │   └── train
    │       ├── ... .jpg
    │       ├── ... .xml
    ├── model_main.py
    ├── pre-trained-model
    │   └── ssd_inception_v2_coco_2018_01_28
    │       ├── checkpoint
    │       ├── frozen_inference_graph.pb
    │       ├── model.ckpt.data-00000-of-00001
    │       ├── model.ckpt.index
    │       ├── model.ckpt.meta
    │       ├── pipeline.config
    │       └── saved_model
    │           ├── saved_model.pb
    │           └── variables
    ├── scripts
    │   └── preprocessing
    │       ├── generate_tfrecord.py
    │       └── xml_to_csv.py
    │   └── extra
    │       └── download_training_images.sh
    └── training
        └── ssd_inception_v2_coco.config
```

Start training the model. In `DOCKER_TRAINING_FOLDER`, run:
```
python model_main.py --alsologtostderr --model_dir=training/ --pipeline_config_path=training/ssd_inception_v2_coco.config
```

Monitoring the Training
-----------------------
In `PRJ_WORKSPACE_FOLDER`, run a docker container:
```
# Note that 'tf_traning' is how we named the container
docker exec tf_training tensorboard --logdir=/tensorflow/workspace/training_demo/training
```

Open a web-browser and navigate to [http://localhost:6006](http://localhost:6006)

Exporting the Model
==================

In `DOCKER_TRAINING_FOLDER`, run:
```
cp /tensorflow/models/research/object_detection/export_inference_graph.py .
```

Check inside your `training_demo/training` folder for highest numbered `model.ckpt-*` checkpoint `e.g. model.ckpt-34350`. This number represents the training step index at which the file was created. It will be passed as an argument when we call the `export_inference_graph.py` script.

In `DOCKER_TRAINING_FOLDER`, run:
```
python export_inference_graph.py --input_type image_tensor --pipeline_config_path training/ssd_inception_v2_coco.config --trained_checkpoint_prefix training/[MOST_RECENT_CKPT] --output_directory trained-inference-graphs/output_inference_graph_v1.pb

#> Writing pipeline config file to trained-inference-graphs/output_inference_graph_v1.pb/pipeline.config
```

BONUS
=====
Run docker in detached mode so the processes won't be terminated if you close the current terminal.

In `PRJ_WORKSPACE_FOLDER`, run a docker container:
```
docker run -d --name tf_training --rm -p 0.0.0.0:6006:6006 -v $PWD:/tensorflow/workspace tensorflow1-training:1.0
```

Train in detached mode and output the results in `train.log`. Save [train.sh](training_demo/train.sh) in `PRJ_WORKSPACE_FOLDER/training_demo/train.sh`.

In `PRJ_WORKSPACE_FOLDER`, run a docker container:
```
docker exec -d -w /tensorflow/workspace/training_demo tf_training sh train.sh
```

Export training results. Save [export.sh](training_demo/train.sh) in `PRJ_WORKSPACE_FOLDER/training_demo/export.sh`.

In `PRJ_WORKSPACE_FOLDER`, run a docker container:
```
docker exec -it -w /tensorflow/workspace/training_demo tf_training sh export.sh
```

References
==========
[TensorFlow Object Detection API Tutorial]

[TensorFlow Object Detection with Docker from Scratch]

[TensorFlow Object Detection API Tutorial]: https://tensorflow-object-detection-api-tutorial.readthedocs.io/en/latest/index.html
[TensorFlow Object Detection with Docker from Scratch]: https://towardsdatascience.com/tensorflow-object-detection-with-docker-from-scratch-5e015b639b0b
