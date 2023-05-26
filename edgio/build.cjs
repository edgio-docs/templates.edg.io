const appDir = process.cwd()
const { join } = require('path')
const { DeploymentBuilder } = require('@edgio/core/deploy')

const SW_SOURCE = join(appDir, 'sw', 'service-worker.ts')
const SW_DEST = join(appDir, '.edgio', 'temp', 'service-worker.js')

module.exports = async () => {
	const builder = new DeploymentBuilder()
	builder.clearPreviousBuildOutput()
	await builder.exec('npm run build')
	builder.addJSAsset(join(appDir, 'overviews'))
	await builder.buildServiceWorker({ swSrc: SW_SOURCE, swDest: SW_DEST })
	builder.addJSAsset(join(appDir, 'static', 'fonts'), join('static', 'fonts'))
	builder.addJSAsset(join(appDir, '.vercel', 'output', 'functions'), join('dist'))
	builder.writeFileSync(join(builder.jsDir, '__backends__', 'package.json'), JSON.stringify({ type: 'commonjs' }))
	await builder.build()
}
