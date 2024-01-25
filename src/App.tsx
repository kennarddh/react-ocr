import {
	ChangeEvent,
	FC,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'

import TesseractScheduler, { AddLogger, RemoveLogger } from 'TesseractScheduler'
import { LoggerMessage } from 'tesseract.js'

const App: FC = () => {
	const [SelectedFile, SetSelectedFile] = useState<File | null>(null)

	const [Log, SetLog] = useState<string>('')

	const InputRef = useRef<HTMLInputElement>(null)

	const OnFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		const file = event?.target?.files?.[0] ?? null

		SetSelectedFile(file)
	}, [])

	const OnSubmit = useCallback(async () => {
		if (!SelectedFile) return

		TesseractScheduler.addJob('recognize', SelectedFile).then(x =>
			SetLog(prev => `${prev}\n${x.jobId}: ${x.data.text}`),
		)
	}, [SelectedFile])

	useEffect(() => {
		const logger = (log: LoggerMessage) => {
			SetLog(prev => `${prev}\n${log}`)
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
			<pre>{Log}</pre>
		</div>
	)
}

export default App
