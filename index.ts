import { join } from 'https://deno.land/std@0.97.0/path/mod.ts';
import { exists } from 'https://deno.land/std@0.97.0/fs/mod.ts';

const mcNames: { x64: string; x32: string } = await (
	await fetch('https://raw.githubusercontent.com/BoredSathvik/cape-injector_cli/main/mcPath.json')
).json();
const mcName = parseInt(Deno.env.get('architecture_bits')!) == 32 ? mcNames.x32 : mcNames.x64;

const programfiles = Deno.env.get('programfiles') ?? 'C:/Program Files';
const programfiles_86 = Deno.env.get('ProgramFiles(x86)') ?? 'C:/Program Files (x86)';

const iobitPath = join(programfiles_86, 'IObit/IObit Unlocker');

const mcPath = mcName;
const skinPack = join(programfiles, 'WindowsApps', mcPath, 'data/skin_packs');
const persona = join(skinPack, 'persona');

if (!exists(iobitPath))
	throw new Error(
		'IoBit unlocker not found pls install it before running this (https://www.iobit.com/en/iobit-unlocker.php)'
	);
if (!Deno.args[0]) throw new Error('Arguments not found');

switch (Deno.args[0].toLowerCase()) {
	case '/clear':
		{
			const a = Deno.run({
				cmd: [join(iobitPath, 'iobitunlocker.exe'), '/Delete', persona],
			});
			await a.status();

			if (!(await exists('persona'))) await Deno.mkdir('persona');

			const b = Deno.run({
				cmd: [join(iobitPath, 'iobitunlocker.exe'), '/Copy', join(Deno.cwd(), 'persona'), skinPack],
			});
			await b.status();
		}
		break;

	case '/inject':
		{
			if (!Deno.args[1]) throw new Error('Path to cape pack not found');
			if (!(await exists(Deno.args[1]))) throw new Error('Invalid path');
			const paths: string[] = [];
			for await (const cape of Deno.readDir(Deno.args[1])) {
				paths.push(`"${join(Deno.args[1], cape.name)}"`);
			}

			const c = Deno.run({
				cmd: [join(iobitPath, 'iobitunlocker.exe'), '/Copy', `"${paths.join(',')}"`, persona],
			});

			await c.status();
		}
		break;

	case '/help':
		console.log('cpi_1.16.221 --clear\ncpi_1.16.221 --inject "pathToCapePack"');
		break;

	default:
		console.log('cpi_1.16.221 --clear\ncpi_1.16.221 --inject "pathToCapePack"');

		break;
}
