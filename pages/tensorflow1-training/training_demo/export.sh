rm -rf trained-inference-graphs/output_inference_graph_v1.pb

TRAINED_CHECKPOINT_PREFIX=$(ls -A1 training/*ckpt*meta | head -n1 | sed s/.meta//)

python export_inference_graph.py --input_type image_tensor --pipeline_config_path training/ssd_inception_v2_coco.config --trained_checkpoint_prefix $TRAINED_CHECKPOINT_PREFIX --output_directory trained-inference-graphs/output_inference_graph_v1.pb
