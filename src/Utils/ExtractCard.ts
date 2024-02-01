import cv from '@techstark/opencv-js'

import FindLargestContour from './FindLargestContour'
import GetCornerPoints, { ICorners } from './GetCornerPoints'

const ExtractCard = (
	rawImage: cv.Mat,
	corners?: ICorners,
): cv.Mat | undefined => {
	const largestContour = FindLargestContour(rawImage)

	const {
		bottomLeftCorner,
		bottomRightCorner,
		topLeftCorner,
		topRightCorner,
	} = corners || GetCornerPoints(largestContour)

	if (!bottomLeftCorner) return
	if (!bottomRightCorner) return
	if (!topLeftCorner) return
	if (!topRightCorner) return

	const resultWidth = 18 * 50
	const resultHeight = 11 * 50

	const dsize = new cv.Size(resultWidth, resultHeight)

	const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
		topLeftCorner.x,
		topLeftCorner.y,
		topRightCorner.x,
		topRightCorner.y,
		bottomLeftCorner.x,
		bottomLeftCorner.y,
		bottomRightCorner.x,
		bottomRightCorner.y,
	])

	const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
		0,
		0,
		resultWidth,
		0,
		0,
		resultHeight,
		resultWidth,
		resultHeight,
	])

	const perspectiveTransform = cv.getPerspectiveTransform(srcTri, dstTri)

	const warpedResult = new cv.Mat()

	cv.warpPerspective(
		rawImage,
		warpedResult,
		perspectiveTransform,
		dsize,
		cv.INTER_LINEAR,
		cv.BORDER_CONSTANT,
		new cv.Scalar(),
	)

	largestContour.delete()
	perspectiveTransform.delete()
	srcTri.delete()
	dstTri.delete()

	return warpedResult
}

export default ExtractCard
