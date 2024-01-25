import Tesseract, { LoggerMessage, OEM } from 'tesseract.js'

const loggers: Set<(data: LoggerMessage) => void> = new Set()

export const AddLogger = (logger: (data: LoggerMessage) => void) => {
	loggers.add(logger)
}

export const RemoveLogger = (logger: (data: LoggerMessage) => void) => {
	loggers.delete(logger)
}

const TesseractScheduler = Tesseract.createScheduler()

const AddWorker = async () => {
	const worker = await Tesseract.createWorker('ind', OEM.LSTM_ONLY, {
		logger: log => {
			for (const logger of loggers) {
				logger(log)
			}
		},
	})

	TesseractScheduler.addWorker(worker)
}

const workerN = 4

const workersPromise: Promise<void>[] = []

for (let i = 0; i < workerN; i++) {
	workersPromise.push(AddWorker())
}

await Promise.all(workersPromise)

export default TesseractScheduler
