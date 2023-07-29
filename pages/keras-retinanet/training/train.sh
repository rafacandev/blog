rm -rf training/tensorboard
mkdir training/tensorboard

python ../keras-retinanet/keras_retinanet/bin/train.py \
    --freeze-backbone \
    --random-transform \
    --batch-size 2 \
    --steps 5 \
    --epochs 10 \
    --weights training/pre-trained-model/resnet50_coco_best_v2.1.0.h5 \
    --tensorboard-dir training/tensorboard \
    csv training/images/train_labels.csv training/images/labels.csv --val-annotations training/images/validation_labels.csv
