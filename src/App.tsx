import {
	ChangeEvent,
	FC,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'

import cv from '@techstark/opencv-js'
import { LoggerMessage } from 'tesseract.js'

import Canvas from 'Utils/Canvas'
import CleanCard from 'Utils/CleanCard'
import ImagePromise from 'Utils/ImagePromise'

import TesseractScheduler, {
	AddLogger,
	RemoveLogger,
} from './TesseractScheduler'

const App: FC = () => {
	const [SelectedFile, SetSelectedFile] = useState<File | null>(null)

	const [Log, SetLog] = useState<string>('')

	const InputRef = useRef<HTMLInputElement>(null)
	const OutputCanvasRef = useRef<HTMLCanvasElement>(null)

	const OnFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		const file = event?.target?.files?.[0] ?? null

		SetSelectedFile(file)
	}, [])

	const OnSubmit = useCallback(async () => {
		if (!SelectedFile) return

		const objectURL = URL.createObjectURL(SelectedFile)

		const image = await ImagePromise(objectURL)

		URL.revokeObjectURL(objectURL)

		const canvas = Canvas(image.width, image.height)

		const ctx = canvas.getContext('2d')

		ctx?.drawImage(image, 0, 0)

		const rawImage = cv.imread(canvas)

		const cleanedCard = CleanCard(rawImage)

		cv.imshow(OutputCanvasRef.current!, cleanedCard)

		const outputImageData = await new Promise<Blob>(
			resolve => OutputCanvasRef.current?.toBlob(blob => resolve(blob!)),
		)

		TesseractScheduler.addJob('recognize', outputImageData).then(x => {
			const nik = x.data.text
				.toLowerCase()
				.match(/nik *: *(\d{16})(?!\d)/i)?.[1]

			SetLog(prev => `${prev}\n${x.jobId}: ${x.data.text}\nNIK: ${nik}`)
		})
	}, [SelectedFile])

	useEffect(() => {
		const logger = (log: LoggerMessage) => {
			SetLog(prev => `${prev}\n${JSON.stringify(log)}`)
		}

		AddLogger(logger)

		return () => RemoveLogger(logger)
	})

	useEffect(() => {
		if (!InputRef.current) return

		const dataTransfer = new DataTransfer()

		if (
			SelectedFile &&
			(SelectedFile.type === 'image/bmp' ||
				SelectedFile.type === 'image/webp' ||
				SelectedFile.type === 'image/pbm' ||
				SelectedFile.type === 'image/png' ||
				SelectedFile.type === 'image/jpeg')
		)
			dataTransfer.items.add(SelectedFile)

		InputRef.current.files = dataTransfer.files
	}, [SelectedFile])

	return (
		<div>
			<input type='file' onChange={OnFileChange} ref={InputRef} />
			<button onClick={OnSubmit}>Submit</button>
			<canvas ref={OutputCanvasRef}></canvas>
			<pre>{Log}</pre>
		</div>
	)
}

export default App
