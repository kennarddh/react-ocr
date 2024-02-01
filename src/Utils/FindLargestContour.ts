import cv from '@techstark/opencv-js'

const FindLargestContour = (rawImage: cv.Mat) => {
	const grayscaleImage = new cv.Mat()

	cv.cvtColor(rawImage, grayscaleImage, cv.COLOR_RGBA2GRAY, 0)

	const bluredImage = new cv.Mat()

	cv.GaussianBlur(
		grayscaleImage,
		bluredImage,
		new cv.Size(5, 5),
		0,
		0,
		cv.BORDER_DEFAULT,
	)

	const thresholdImage = new cv.Mat()

	cv.threshold(
		bluredImage,
		thresholdImage,
		0,
		255,
		cv.THRESH_BINARY + cv.THRESH_OTSU,
	)

	const contours = new cv.MatVector()
	const hierarchy = new cv.Mat()

	cv.findContours(
		thresholdImage,
		contours,
		hierarchy,
		cv.RETR_CCOMP,
		cv.CHAIN_APPROX_SIMPLE,
	)

	let done = false
	let countourCount = 0

	let maxArea = 0
	let maxIndex = 0

	while (!done) {
		try {
			const contour = contours.get(countourCount)

			const contourArea = cv.contourArea(contour)

			contour.delete()

			if (contourArea > maxArea) {
				maxArea = contourArea
				maxIndex = countourCount
			}

			countourCount += 1
		} catch {
			done = true
		}
	}

	const maxContour = contours.get(maxIndex)

	thresholdImage.delete()
	bluredImage.delete()
	grayscaleImage.delete()
	contours.delete()
	hierarchy.delete()

	return maxContour
}

export default FindLargestContour
