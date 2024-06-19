@group( 0 ) @binding( 0 ) var<storage, read> input: array<f32>;
@group( 0 ) @binding( 1 ) var<storage, read_write> result: array<f32>;

@compute @workgroup_size( 256 )
fn main( @builtin( global_invocation_id ) GlobalInvocationID: vec3<u32> ) {

	let index = GlobalInvocationID.x;

	if ( index == 0 ) {

		var sum: f32 = 0.0;

		for ( var i = 0u; i < arrayLength( &input ); i++ ) {

			sum += input[ i ];
		}

		result[ 0 ] = sum;
	}
}
