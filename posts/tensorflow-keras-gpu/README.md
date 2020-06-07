How to Run Tensorflow on GPU on Linux Majaro
============================================

In this tutorial we are going to configure Tensorflow to run on GPU on a Linux Manjaro operating system.
Moreoever, we are going to configure our machine to operate normally with the onboarding Intel GPU but to train our model in our Nvidia GPU.

Requirements
------------
The following applications should be installed beforehand:
- **Docker**: as described in [Docker Website]
- **Nvidia GPU with CUDA support**: here is the official list of supported GPU, but in my experience this is not an exhaustive list. You might want to look directly at your GPU specifications as it may support CUDA but it is not in the official list [Recommended GPU for Developers]. Some benchmarks on [Which GPU for deep learning by Tim Dettemers].

We are running on [Linux Manjaro] but other linux distributions should follow similar steps.

Install Nvidia Drivers
======================

List the GPUs available to our operating system:
```
lspci -k | grep -A 2 -E "(VGA|3D)"

#> 00:02.0 VGA compatible controller: Intel Corporation HD Graphics 530 (rev 06)
#> 	DeviceName:  Onboard IGD
#> 	Subsystem: Gigabyte Technology Co., Ltd HD Graphics 530
#> --
#> 01:00.0 VGA compatible controller: NVIDIA Corporation TU117 [GeForce GTX 1650] (rev a1)
#> 	Subsystem: Gigabyte Technology Co., Ltd TU117 [GeForce GTX 1650]
#> 	Kernel driver in use: nvidia
```

As we can see, we have an integrated _Intel HD Graphics 530_ and one dedicated _Nvidia GTX 1650_.


Let's install Nvidia driver automatically (note that `-f` will force a new installation):
```
sudo mhwd -f -a pci nonfree 0300
```

If you want to install a specific version; then list the available Nvidia drivers:
```
mhwd


#> 0000:01:00.0 (0300:10de:1f82) Display controller nVidia:
#> --------------------------------------------------------
#>  NAME                VERSION        FREEDRIVER     TYPE
#> --------------------------------------------------------
#> video-nvidia-440xx   2019.10.25     false          PCI
#> video-nvidia-435xx   2019.10.25     false          PCI
#> video-nvidia-430xx   2019.10.25     false          PCI
#> video-nvidia-418xx   2019.10.25     false          PCI

```

And install a specific version: 
```
sudo mhwd -f -i pci video-nvidia-435xx
```

At this point you need to reboot your operating system. Once it is back up, you can verify the driver installation:

```
mhwd -li


#> ------------------------------------------------------------------
#> NAME                                  VERSION     FREEDRIVER  TYPE
#> ------------------------------------------------------------------
#> video-linux                           2018.05.04  true        PCI
#> video-hybrid-intel-nvidia-440xx-prime 2019.10.25  false       PCI
```

Configure Intel GPU in Xorg
===========================
At this point, we need to configure our Intel GPU to be the only GPU in Xorg. [Intel for Display Nvidia for Computing by wangruohui] explains this process in more details. But basically we will need to create a configuration file for Xorg to use only the Intel GPU. In my setup the config file is as follows:

**/etc/X11/xorg.conf.d/91-mhwd.conf**:
```
Section "ServerLayout"
    Identifier     "Layout0"
    Screen      0  "Screen0"
EndSection

Section "Screen"
    Identifier     "Screen0"
    Device         "Device0"
EndSection

Section "Device"
    Identifier     "Device0"
    Driver         "intel"
    VendorName     "Intel Corporation"
    BusID          "PCI:0:2:0
EndSection
```

You might want to look at [Arch Wiki Xorg] for more details on how the configuration file works.

Reboot your system. When it is back up let's check __NVIDIA System Management Interface program__ `nvidia-smid` which show nice statistics about the GPU, it should be using __0 MiB__ and there should be no Xorg associated to it:

```
nvidia-smi
 
#> +-----------------------------------------------------------------------------+
#> | NVIDIA-SMI 440.82       Driver Version: 440.82       CUDA Version: 10.2     |
#> |-------------------------------+----------------------+----------------------+
#> | GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
#> | Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
#> |===============================+======================+======================|
#> |   0  GeForce GTX 1650    Off  | 00000000:01:00.0 Off |                  N/A |
#> | 51%   35C    P0    10W /  75W |      0MiB /  3911MiB |      0%      Default |
#> +-------------------------------+----------------------+----------------------+
#>                                                                                
#> +-----------------------------------------------------------------------------+
#> | Processes:                                                       GPU Memory |
#> |  GPU       PID   Type   Process name                             Usage      |
#> |=============================================================================|
#> |  No running processes found                                                 |
#> +-----------------------------------------------------------------------------+
```

Configure Docker
================

Before moving forward I recommend a quick read at [Tensorflow Install Docker] for a general understanding of how to use Tensorflow with Docker.

Let's install _Nvidia Docker Support_. The simplest way is to install it via the __Add/Remove Software__ application (Pamac).
Go to __Preferences__ and enable AUR as described in [Pamac Wiki]. Now you can search and install the `nvidia-container-toolkit` package from the AUR repository.

Let's test our Docker installation but running the `nvidia-smi` from a container:
```
docker run --gpus all --rm nvidia/cuda nvidia-smi

#> +-----------------------------------------------------------------------------+
#> | NVIDIA-SMI 440.82       Driver Version: 440.82       CUDA Version: 10.2     |
#> |-------------------------------+----------------------+----------------------+
#> | GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
#> | Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
#> |===============================+======================+======================|
#> |   0  GeForce GTX 1650    Off  | 00000000:01:00.0 Off |                  N/A |
#> | 52%   35C    P0    10W /  75W |      0MiB /  3911MiB |      0%      Default |
#> +-------------------------------+----------------------+----------------------+
#>                                                                                
#> +-----------------------------------------------------------------------------+
#> | Processes:                                                       GPU Memory |
#> |  GPU       PID   Type   Process name                             Usage      |
#> |=============================================================================|
#> |  No running processes found                                                 |
#> +-----------------------------------------------------------------------------+
```

We should should see that the same Nvidia device is also listed from the Docker container, confirming that our Docker container is able to access the GPU device.


Let's run Tensorflow with GPU support from a Docker container. The console should confirm that we are running on our GPU:
```
docker run --gpus all -it --rm tensorflow/tensorflow:2.2.0-gpu \
   python -c "import tensorflow as tf; print(tf.reduce_sum(tf.random.normal([1000, 1000])))"

#> ...
#> job:localhost/replica:0/task:0/device:GPU:0 with 3551 MB memory) 
#> -> physical GPU (device: 0, name: GeForce GTX 1650, pci bus id: 0000:01:00.0, compute capability: 7.5)
```

Additional Docker parameter that may be useful:
  - `--privileged`: Give extended privileges to this container, generally not recommended but can get you going if you encounter Tensorflow error `CUPTI_ERROR_INSUFFICIENT_PRIVILEGES` as described in this [GitHub Issue](https://github.com/tensorflow/tensorflow/issues/35860)
  - `--gpus`: Allows you to access Nvidia GPU devices. Use the `device` option to specify GPUs. Example: `--gpus device=0,2`




References
==========

[Tensorflow GPU Support]

[Intel for Display Nvidia for Computing by wangruohui]

[Pamac Wiki]

[Arch Wiki Xorg]

[Intel for Display Nvidia for Computing by wangruohui]

[Docker Website]

[Recommended GPU for Developers]

[Which GPU for deep learning by Tim Dettemers]

[Linux Manjaro]



[Tensorflow GPU Support]: https://www.tensorflow.org/install/gpu

[Intel for Display Nvidia for Computing by wangruohui]: https://gist.github.com/wangruohui/bc7b9f424e3d5deb0c0b8bba990b1bc5

[Pamac Wiki]: https://wiki.manjaro.org/index.php/Pamac#Preferences

[Arch Wiki Xorg]: https://wiki.archlinux.org/index.php/Xorg

[Intel for Display Nvidia for Computing by wangruohui]: https://gist.github.com/wangruohui/bc7b9f424e3d5deb0c0b8bba990b1bc5

[Docker Website]: https://docs.docker.com/get-docker

[Recommended GPU for Developers]: https://developer.nvidia.com/cuda-gpus

[Which GPU for deep learning by Tim Dettemers]: https://timdettmers.com/2019/04/03/which-gpu-for-deep-learning

[Linux Manjaro]: https://manjaro.org
