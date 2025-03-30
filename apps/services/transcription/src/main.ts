import { program } from 'commander';

const main = async () => {
  try {
    program
      .requiredOption('--url <url>')
      .requiredOption('--callback-url <callback-url>')
      .parse(process.argv);

    const options = program.opts();

    await fetch(options.callbackUrl, {
      method: 'POST',
      body: JSON.stringify({
        transcription: 'Hello World',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
  }

  process.exit(0);
};

main();
