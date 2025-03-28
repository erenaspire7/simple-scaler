import { program } from 'commander';

const main = async () => {
  program
    .requiredOption('--url <url>')
    .requiredOption('--callback-url <callback-url>')
    .parse(process.argv);

  const options = program.opts();

  try {
    await fetch(options.callbackUrl, {
      method: 'POST',
      body: JSON.stringify({
        transcription: 'Hello World',
      }),
    });
  } catch (error) {
    console.error(error);
  }

  process.exit(0);
};

main();
