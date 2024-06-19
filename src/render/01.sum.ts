import wgsl from "@compute/sum.wgsl?raw"

async function main() {

	// Request adapter (Physical)
	const adapter = await navigator.gpu.requestAdapter()

	// Request device (Logical)
	const device = await adapter!.requestDevice()

	// Input data
	const inputData = new Float32Array( [ 10, 20, 30, 40 ] )

	// Create buffers
	const inputBuffer = device.createBuffer( {
		size: inputData.byteLength,
		usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
		mappedAtCreation: true,
	} )

	const inputArrayBuffer = inputBuffer.getMappedRange()
	new Float32Array( inputArrayBuffer ).set( inputData )
	inputBuffer.unmap()

	const resultBuffer = device.createBuffer( { size: 4, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC } )
	const stagingBuffer = device.createBuffer( { size: 4, usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST } )

	// Create bind group layout and bind group
	const bindGroupLayout = device.createBindGroupLayout( {
		entries: [
			{ binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" } },
			{ binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: "storage" } },
		],
	} )

	const bindGroup = device.createBindGroup( {
		layout: bindGroupLayout,
		entries: [
			{ binding: 0, resource: { buffer: inputBuffer } },
			{ binding: 1, resource: { buffer: resultBuffer } },
		],
	} )

	// Create compute pipeline
	const computePipeline = device.createComputePipeline( {
		layout: device.createPipelineLayout( { bindGroupLayouts: [ bindGroupLayout ] } ),
		compute: { module: device.createShaderModule( { code: wgsl } ) },
	} )

	// Encode commands
	const commandEncoder = device.createCommandEncoder()
	const passEncoder = commandEncoder.beginComputePass()

	passEncoder.setPipeline( computePipeline )
	passEncoder.setBindGroup( 0, bindGroup )
	passEncoder.dispatchWorkgroups( 1 )

	passEncoder.end()
	commandEncoder.copyBufferToBuffer( resultBuffer, 0, stagingBuffer, 0, 4 )

	// Submit commands
	device.queue.submit( [ commandEncoder.finish() ] )

	// Read result
	await stagingBuffer.mapAsync( GPUMapMode.READ )
	const resultArrayBuffer = stagingBuffer.getMappedRange()
	const result = new Float32Array( resultArrayBuffer )[ 0 ]
	console.log( "Sum:", result )

	stagingBuffer.unmap()
}

main()
