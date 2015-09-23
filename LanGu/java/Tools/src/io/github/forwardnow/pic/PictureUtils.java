package io.github.forwardnow.pic;

import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import javax.imageio.ImageIO;

public final class PictureUtils {

	private PictureUtils( ) {
		// do nothings
	}

	/***
	 * 功能 :调整图片大小
	 * 
	 * @param srcImgPath
	 *            原图片路径
	 * @param distImgPath
	 *            转换大小后图片路径
	 * @param width
	 *            转换后图片宽度
	 * @param height
	 *            转换后图片高度
	 */
	public static void resizeImage( String srcImgPath, String distImgPath, int width, int height, String imgType ) throws IOException {

		File srcFile = new File( srcImgPath );
		Image srcImg = ImageIO.read( srcFile );
		BufferedImage buffImg = null;
		buffImg = new BufferedImage( width, height, BufferedImage.TYPE_INT_RGB );
		buffImg.getGraphics( ).drawImage( srcImg.getScaledInstance( width, height, Image.SCALE_SMOOTH ), 0, 0, null );

		ImageIO.write( buffImg, imgType.toUpperCase( ), new File( distImgPath ) );

	}

	public static void main( String[] args ) throws Exception {
		// File file = new File( "resource/images/2.800x800.png" );
		// new FileInputStream( file );
		for ( int i = 1; i <= 1; i++ ) {
			String filename = i + "";
			String srcImgPath = "resource/images/" + filename + ".800x800.png";
			String distImgPath = "resource/images/" + filename + ".800x800.png";
			int midWidth = 400;
			int midHeight = 400;
			int smallWidth = 50;
			int smallHeight = 50;
			String imgType = "PNG";
			// mid
			resizeImage( srcImgPath, distImgPath.replaceAll( "800", "400" ), midWidth, midHeight, imgType );
			// small
			resizeImage( srcImgPath, distImgPath.replaceAll( "800", "50" ), smallWidth, smallHeight, imgType );
		}
	}
}
