import cv from '@techstark/opencv-js'

const CleanCard = (rawImage: cv.Mat): cv.Mat => {
	const grayscaleImage = new cv.Mat()

	cv.cvtColor(rawImage, grayscaleImage, cv.COLOR_RGBA2GRAY, 0)

	// const thresholdImage = new cv.Mat()

	// cv.threshold(grayscaleImage, thresholdImage, 140, 255, cv.THRESH_BINARY)

	// grayscaleImage.delete()

	// return thresholdImage
	return grayscaleImage
}

export default CleanCard
