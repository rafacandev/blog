python scripts/preprocessing/xml_to_csv.py -i images/train -o annotations/train_labels.csv
python scripts/preprocessing/xml_to_csv.py -i images/test -o annotations/test_labels.csv

python scripts/preprocessing/generate_tfrecord.py --label=card --csv_input=annotations/train_labels.csv --output_path=annotations/train.record --img_path=images/train
python scripts/preprocessing/generate_tfrecord.py --label=card --csv_input=annotations/test_labels.csv --output_path=annotations/test.record --img_path=images/test

cp /tensorflow/models/research/object_detection/model_main.py .

python model_main.py --alsologtostderr --model_dir=training/ --pipeline_config_path=training/ssd_inception_v2_coco.config
