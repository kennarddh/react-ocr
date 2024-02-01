import cv from '@techstark/opencv-js'

const Distance = (p1: cv.Point, p2: cv.Point) => {
	return Math.hypot(p1.x - p2.x, p1.y - p2.y)
}

export default Distance
