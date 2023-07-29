Generate Centered Thumbnails In Java
====================================
There are many thumbnail libraries out there but if you need a simple thumbnail generator for Java without any external dependencies you can use this [ImageUtil](https://github.com/rafasantos/matchandtrade-web-api/blob/master/src/main/java/com/matchandtrade/util/ImageUtil.java) class.

The idea is to resized the image by the short edge and then crop it from the center.

Samples:

![sample](thumbnail-0.jpg)
![sample](thumbnail-1.jpg)
![sample](thumbnail-2.jpg)
![sample](thumbnail-3.jpg)
![sample](thumbnail-4.jpg)
![sample](thumbnail-5.jpg)
![sample](thumbnail-6.jpg)
![sample](thumbnail-7.jpg)
![sample](thumbnail-8.jpg)

Here is the code used to generate the thumbnails above:

```java
List imageUrls = new ArrayList();
imageUrls.add(new URL("https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/720px-Flag_of_Brazil.svg.png"));
imageUrls.add(new URL("https://upload.wikimedia.org/wikipedia/commons/c/c2/Knute_Nelson_photograph_Civil_War.jpg"));
imageUrls.add(new URL("https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/TjWikiKatahdin.jpg/800px-TjWikiKatahdin.jpg"));
imageUrls.add(new URL("https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Mont_de_Seuc_y_l_Saslong_da_Cod_dal_Fil.jpg/800px-Mont_de_Seuc_y_l_Saslong_da_Cod_dal_Fil.jpg"));
imageUrls.add(new URL("https://upload.wikimedia.org/wikipedia/commons/b/bf/Caught-a-fish.jpg"));
imageUrls.add(new URL("https://upload.wikimedia.org/wikipedia/commons/e/ee/Treaty_of_Riga.jpg"));
imageUrls.add(new URL("https://upload.wikimedia.org/wikipedia/commons/9/9b/Gustav_chocolate.jpg"));
imageUrls.add(new URL("https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg"));
imageUrls.add(new URL("https://upload.wikimedia.org/wikipedia/commons/e/e3/Panthera_tigris6.jpg"));

for (int i=0; i < imageUrls.size(); i++) {
	Image image = ImageIO.read(imageUrls.get(i).openStream());
	Image resizedImage = ImageUtil.obtainShortEdgeResizedImage(image, 96);
	Image croppedImage = ImageUtil.obtainCenterCrop(resizedImage, 96, 96);
	ImageIO.write(ImageUtil.buildBufferedImage(croppedImage), "JPG", new File("target/thumbnail-" + i + ".jpg"));
}
```