/* eslint-disable security/detect-object-injection */
import cv from '@techstark/opencv-js'

import Distance from './Distance'

export interface ICorners {
	topLeftCorner: cv.Point
	topRightCorner: cv.Point
	bottomLeftCorner: cv.Point
	bottomRightCorner: cv.Point
}

const GetCornerPoints = (contour: cv.Mat): Partial<ICorners> => {
	const rect = cv.minAreaRect(contour)
	const center = rect.center

	let topLeftCorner
	let topLeftCornerDist = 0

	let topRightCorner
	let topRightCornerDist = 0

	let bottomLeftCorner
	let bottomLeftCornerDist = 0

	let bottomRightCorner
	let bottomRightCornerDist = 0

	for (let i = 0; i < contour.data32S.length; i += 2) {
		const point = { x: contour.data32S[i], y: contour.data32S[i + 1] }
		const dist = Distance(point, center)
		if (point.x < center.x && point.y < center.y) {
			// top left
			if (dist > topLeftCornerDist) {
				topLeftCorner = point
				topLeftCornerDist = dist
			}
		} else if (point.x > center.x && point.y < center.y) {
			// top right
			if (dist > topRightCornerDist) {
				topRightCorner = point
				topRightCornerDist = dist
			}
		} else if (point.x < center.x && point.y > center.y) {
			// bottom left
			if (dist > bottomLeftCornerDist) {
				bottomLeftCorner = point
				bottomLeftCornerDist = dist
			}
		} else if (point.x > center.x && point.y > center.y) {
			// bottom right
			if (dist > bottomRightCornerDist) {
				bottomRightCorner = point
				bottomRightCornerDist = dist
			}
		}
	}

	return {
		topLeftCorner,
		topRightCorner,
		bottomLeftCorner,
		bottomRightCorner,
	}
}

export default GetCornerPoints
