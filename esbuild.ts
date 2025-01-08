import * as esbuild from 'esbuild';

async function build() {
  await esbuild.build({
    entryPoints: ['./src/index.ts'], // Update with your actual entry points
    bundle: true,
    outfile: './dist/bundle.js', // Set your output path here
    inject: ['cjs-shim.ts'],
  });
}

build().catch(() => process.exit(1));

export {};