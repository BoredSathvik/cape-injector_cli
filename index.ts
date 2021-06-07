import { join } from 'https://deno.land/std@0.97.0/path/mod.ts';
import { exists } from 'https://deno.land/std@0.97.0/fs/mod.ts';

const mcNames: { x64: string; x32: string } = await (
	await fetch('https://raw.githubusercontent.com/BoredSathvik/cape-injector_cli/main/mcPath.json')
).json();
const mcName = parseInt(Deno.env.get('architecture_bits')!) == 32 ? mcNames.x32 : mcNames.x64;

const programfiles = Deno.env.get('programfiles') ?? 'C:/Program Files';
const mcPath = mcName;
const skinPack = join(programfiles, 'WindowsApps', mcPath, 'data/skin_packs');
const persona = join(skinPack, 'persona');

if (!Deno.args[0]) Deno.exit(0x1);

switch (Deno.args[0].toLowerCase()) {
	case '/clear':
		{
			const a = Deno.run({
				cmd: ['iobitunlocker', '/Delete', persona],
			});
			await a.status();

			if (!(await exists('persona'))) await Deno.mkdir('persona');

			const b = Deno.run({
				cmd: ['iobitunlocker', '/Copy', join(Deno.cwd(), 'persona'), skinPack],
			});
			await b.status();
		}
		break;

	case '/inject':
		{
			if (!Deno.args[1]) Deno.exit(0x3);
			if (!(await exists(Deno.args[1]))) Deno.exit(0x3);
			const paths: string[] = [];
			for await (const cape of Deno.readDir(Deno.args[1])) {
				paths.push(`"${join(Deno.args[1], cape.name)}"`);
			}

			const c = Deno.run({
				cmd: ['iobitunlocker', '/Copy', `"${paths.join(',')}"`, persona],
			});

			await c.status();
		}
		break;

	case '/help':
		console.log(
			'capeinjector_1.16.22101.0_x64 --clear\ncapeinjector_1.16.22101.0_x64 --inject "pathToCapePack"'
		);
		break;

	default:
		console.log(
			'capeinjector_1.16.22101.0_x64 --clear\ncapeinjector_1.16.22101.0_x64 --inject "pathToCapePack"'
		);

		break;
}
